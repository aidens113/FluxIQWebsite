# Report: static-hosting

Brief: `### Brief: static-hosting` in [deployment.md](../../deployment.md), plus
the supervisor follow-up (`vercel.json`, and the server's default directory).
Date: 2026-09-18. Worker: static-hosting.

## Outcome

Done, including the follow-up. Every Definition of Done item and every
follow-up check was run and passed on Windows (Node 22.11.0, pnpm 10.5.0). As
instructed, the follow-up did not run `pnpm build`.

"Not verified" lists what this machine could not check: live Apache,
LiteSpeed, Netlify, Cloudflare, or Vercel, and the SIGTERM path.

## What changed and why

### Original brief

New files, all dependency-free ESM:

- **`scripts/static-hosting/policy.mjs`** (115 lines). The one policy:
  - `SECURITY_HEADERS` and `CONTENT_SECURITY_POLICY`, exactly as Decision 6
    states them.
  - `cacheControlFor(urlPath)`, which implements Decision 7:
    - `/_next/static/*` is immutable.
    - A path ending in `/`, `.html`, `.txt`, or `.xml` must revalidate. The
      query string and fragment are ignored.
    - Everything else is cached for a day.
  - `CONTENT_TYPES`, with text types carrying `; charset=utf-8`.
    `contentTypeFor` looks extensions up case-insensitively.
  - `mediaType`, `COMPRESSIBLE_TYPES`, and `isCompressible`.
- **`scripts/static-hosting/write-host-files.mjs`** (231 lines). It takes
  `--out out` and exits 1 when that directory is missing. It writes three
  files:
  - `out/.htaccess`:
    - `Options -Indexes`, `DirectoryIndex index.html`,
      `ErrorDocument 404 /404.html`, and `AddDefaultCharset UTF-8`.
    - `AddType` and `AddCharset` lines generated from `CONTENT_TYPES`, inside
      `<IfModule mod_mime.c>`.
    - The security headers as `Header always set`.
    - A default `Cache-Control`, overridden by
      `<FilesMatch "\.(html|txt|xml)$">`.
    - `AddOutputFilterByType DEFLATE` inside nested `mod_deflate` and
      `mod_filter` `<IfModule>` blocks.
    - No `<If>` blocks.
  - `out/_next/static/.htaccess`, with the immutable `Cache-Control`.
  - `out/_headers`, where `/*` carries the security headers and a generated
    set of `Cache-Control` rules follows.
- **`scripts/static-hosting/serve.mjs`** (269 lines). It does everything the
  brief lists, plus:
  - A weak ETag, `Last-Modified`, and 304 responses.
  - `Allow: GET, HEAD` on 405 responses.
  - A 404 for hidden files and the root `_headers`.
  - gzip only when the client accepts it, honouring `q=0`.
  - `stopServer()`, which sweeps idle keep-alive sockets and cuts any request
    still running after 10 s.
- **Tests** in `scripts/static-hosting/tests/`:
  - `policy.test.mjs` (6 tests).
  - `write-host-files.test.mjs` (11 tests).
  - `serve.test.mjs` (now 18 tests).
  - `site-fixture.mjs`, a shared temporary site. It keeps a secret one level
    above the site root so the traversal tests would catch a leak.
- **`package.json` `scripts`:**
  - `build`: `next build && node scripts/static-hosting/write-host-files.mjs`
  - `start` (new) and `preview`: `node scripts/static-hosting/serve.mjs`
  - `test`: `node --test "scripts/**/tests/*.test.mjs"`

Design choices beyond the brief's wording:

1. **`_headers` rules for `Cache-Control` never overlap.** Cloudflare Pages
   documents that when two matching rules set one header, the values are
   joined with a comma. A `/*` default plus overrides would therefore send
   duplicated `max-age` values. So only `/*` sets the security headers. The
   writer then derives the cache rules from `out/` so that exactly one of
   them matches each URL:
   - `/_next/static/*`.
   - `/dir/*` for a directory whose files share one cache value and hold no
     `index.html`. An ancestor of `_next/static` is never rolled up.
   - An exact rule for every other file and every directory URL.

   The real build needs 24 rules. Above 100, Cloudflare Pages' limit, the
   writer fails the build, as it does for a file name `_headers` cannot
   express.
2. **Unsafe request targets answer 400, not 404.** That covers:
   - malformed percent-encoding;
   - a null byte, backslash, colon, or encoded `/`;
   - empty segments, including `//`, which also rules out an open redirect;
   - a segment ending in `.` or a space, which covers `.`, `..`, and names
     Windows would trim;
   - a target that is not origin-form.
3. **Redirect `Location` headers are rebuilt from the decoded segments.** The
   segments are re-encoded, and the query string is kept only when it is
   printable ASCII.

### Follow-up

- **`scripts/static-hosting/write-vercel-config.mjs`** (109 lines, new).
  - It generates root `vercel.json` from policy.mjs. `--check` writes nothing
    and exits 1 when the file is missing or differs. CRLF endings are
    ignored, although `.gitattributes` forces LF anyway. `--file <path>` lets
    the tests exercise the command line without touching the real file.
  - The output is `JSON.stringify(..., 2)` plus a newline, which Biome
    accepts unchanged.
  - Contents:
    - `$schema` is `https://openapi.vercel.sh/vercel.json`.
    - `headers` holds one catch-all `/:path(.*)` rule with the six security
      headers, and three `Cache-Control` rules.
    - There are no framework, build, or output keys.
  - The Vercel docs (fetched 2026-09-18) do not say which rule wins when two
    matching rules set one header. So the three cache sources are regular
    expressions over the path after its leading `/` that split every path
    three ways, mirroring `cacheControlFor`:
    - `/:path(_next/static/.*)`: immutable.
    - `/:path((?!_next/static/)(?:.*/|.*\.(?:html|txt|xml))?)`: revalidate.
      This covers `/`, directory URLs, and documents.
    - `/:path((?!_next/static/)(?!.*\.(?:html|txt|xml)$).*[^/])`: a day.
  - The patterns are generated from `IMMUTABLE_PREFIX` and
    `REVALIDATE_EXTENSIONS`, not written by hand. They use only non-capturing
    and lookahead groups, which path-to-regexp 6 accepts. The Vercel docs
    show `/:path((?!uk/).*)`.
- **`scripts/static-hosting/tests/write-vercel-config.test.mjs`** (6 tests):
  - The committed `vercel.json` equals the rendered output.
  - The top-level keys are exactly `$schema` and `headers`.
  - The catch-all rule alone carries the security headers.
  - Every source has the shape path-to-regexp 6 accepts: `/:path(<pattern>)`,
    no capturing group, balanced parentheses, and not starting with `?`.
  - Every URL in a boundary corpus gets the security headers and exactly one
    `Cache-Control`, equal to `cacheControlFor`. The corpus covers `/`,
    `/docs`, `/a.HTML`, `/.html`, `/_next/static`, `/_next/staticx/a.js`,
    `/x/_next/static/a.js`, and every fixture file and directory URL.
  - Command line: `--check` returns 0 on a current file (LF or CRLF) and 1 on
    a missing or stale one, and write mode writes the file.
- **`policy.mjs` changed.** `cacheControlFor` now tests the extension as a
  plain case-sensitive suffix instead of using `path.extname`. This came out
  of verifying the Vercel sources against Next's bundled path-to-regexp:
  `extname("/.html")` is empty, so the policy said "a day" while Apache's
  `<FilesMatch>` and the Vercel pattern both say "revalidate". Now all hosts
  agree.
  - The change only affects names that start with a dot, which `_headers`
    and the Node server already exclude.
  - I re-rendered the host files in memory and they are byte-identical to
    the current `out/` files, so no rebuild is needed.
- **`serve.mjs` changed.** The new `DEFAULT_DIRECTORY` is
  `fileURLToPath(new URL("../../out", import.meta.url))`, which is `out/` at
  the repository root whatever the working directory. A `--dir` value still
  resolves against the working directory. The usage comment is updated.
- **`serve.test.mjs` changed.** A `launch()` helper now drives the
  command-line tests. Two tests are new:
  - **Different working directory.** The server starts with no `--dir`
    from a temporary directory that contains a decoy `out/index.html`. It
    must name `<repo>/out` and must not serve the decoy. If the repository is
    unbuilt, the test instead expects exit 1 with an error naming
    `<repo>/out`, so it holds in CI both before and after a build.
  - **Relative `--dir`.** `--dir site` from a temporary working directory
    serves `<cwd>/site`.

  Each command-line test now awaits the child's exit before cleanup, because
  Windows keeps a process's working directory locked.
- **`package.json` has a new script:** `"vercel:config": "node
  scripts/static-hosting/write-vercel-config.mjs"`. It is the command the
  drift errors point to.

## Commands run and observed results

### Original brief

- `pnpm test`: 77 pass, 0 fail. That was the old 44 plus 33 new.
- `node scripts/structure-audit.mjs`: `structure: passed (70 files)`.
- Biome: clean.
- `pnpm build` printed
  `host-files: wrote .htaccess, _next/static/.htaccess, _headers in F:\!FluxIQWebsite\out (24 _headers rules)`.
  All three files exist.
- `pnpm test:site`: `site-check: passed (136.9 KB gzip JS)`.
- `pnpm start` printed `serve: F:\!FluxIQWebsite\out on http://0.0.0.0:3000`.
  Then `curl -sI`:
  - `/` returned 200 with all six policy headers and
    `public, max-age=0, must-revalidate`.
  - `/_next/static/chunks/0cz1d0mv5g_q7.js` returned 200 with
    `public, max-age=31536000, immutable`.
  - `/nope` returned 404, `text/html`, 13575 bytes, which is the size of
    `404.html`.
  - `curl --path-as-is` on `/../package.json` and `/%2e%2e/package.json`
    returned 400.
  - `/.htaccess` and `/_headers` returned 404.
  - `POST /` returned 405.
  - `/404` returned 308 with `Location: /404/`.

  The server was then stopped.

### Follow-up

- `pnpm test`: `# tests 85`, `# pass 85`, `# fail 0`.
  - Per file: `policy` 6, `serve` 18, `write-host-files` 11,
    `write-vercel-config` 6.
  - The old files are unchanged: `site-check` 16, `structure-audit` 10,
    `working-docs-audit` 18.
  - 44 + 41 = 85, so nothing ran twice.
- `node scripts/structure-audit.mjs`: `structure: passed (72 files)`.
- `pnpm exec biome check scripts package.json vercel.json`: `Checked 16 files
  ... No fixes applied.`, exit 0.
  - Before that, `biome check --write scripts/static-hosting` reformatted two
    of my test files.
- `node scripts/static-hosting/write-vercel-config.mjs --check`:
  `vercel-config: F:\!FluxIQWebsite\vercel.json matches policy.mjs`, exit 0.
- **Negative check that the drift test bites.** I changed `max-age=86400` to
  `max-age=60` in `vercel.json`:
  - The test `the committed vercel.json is exactly what policy.mjs generates`
    reported `not ok 1`.
  - `--check` printed `... differs from policy.mjs; run pnpm vercel:config`
    and exited 1.

  After I restored the file, `--check` printed `matches policy.mjs` and
  exited 0.
- **Real path-to-regexp check** (scratch script, not part of the suite). I
  compiled each `vercel.json` source with Next's bundled
  `next/dist/compiled/path-to-regexp`, using Vercel's options
  (`strict: true, sensitive: true, delimiter: "/"`).
  - The output was, for example, `^(?:\/((?!_next\/static\/)(?!.*\.(?:html|txt|xml)$).*[^/]))$`,
    which is exactly the form the test's translation assumes.
  - Across 27 boundary URLs, each got the catch-all rule and exactly one
    cache rule equal to `cacheControlFor`. The first run found one
    disagreement, `/.html`, which led to the policy change above. After the
    fix it printed `bad: 0`.
- **Server from another working directory.** From the scratchpad directory, I
  ran `PORT=3217 HOST=127.0.0.1 node F:/!FluxIQWebsite/scripts/static-hosting/serve.mjs`.
  - It printed `serve: F:\!FluxIQWebsite\out on http://127.0.0.1:3217`.
  - `GET /` returned `200` with 172223 bytes, the size of `out/index.html`.
  - The process was then stopped and the port was confirmed free.
- **In-memory re-render.** `renderHeaders(cacheRules("out"))`,
  `renderHtaccess()`, and `renderStaticHtaccess()` each equal the files in
  `out/`, so `out/` matches the updated policy without a rebuild.

## Not verified

- **No live host was tested.** The configuration below has only been checked
  against documentation and local tests:
  - `.htaccess` on Apache or LiteSpeed (Hostinger).
  - `_headers` on Netlify or Cloudflare Pages.
  - `vercel.json` on Vercel. The sources were checked against Next's copy of
    path-to-regexp and Vercel's documented options, not against a
    deployment. Specifically unchecked:
    - that Vercel applies `vercel.json` headers to the Next.js preset's static
      export;
    - that its CDN does not replace our `Cache-Control` on
      `/_next/static/*`;
    - whether headers reach its 404 page.
- **SIGTERM and SIGINT handling.** Windows cannot deliver the signal to a
  handler, so the command-line test asserts a clean exit only off Windows.
  `stopServer` itself is unit-tested. `docker stop` would exercise the real
  path.
- **`pnpm check` was not run.** Biome was run on the paths the follow-up names.
- **Linux and macOS were not tested.** The `**` test glob and the
  different-working-directory test have run on Windows only.

## Open questions or contradictions found

1. **Netlify's merge behaviour is undocumented.** Netlify's headers page does
   not state what happens when two rules set the same header, and Vercel's
   page does not say which rule wins. The non-overlapping rules are safe
   under any behaviour.
2. **Should the rule limit fail the build or warn?** Above 100 `_headers`
   rules, Cloudflare Pages' limit, `pnpm build` fails for every host. It is
   24 today. Say if a warning would be better.
3. **The host files are served as ordinary files on some hosts.** The two
   `.htaccess` files are uploaded as ordinary files to Netlify, Cloudflare
   Pages, and the `deploy` branch, and Apache serves `_headers` as a plain
   file. The content is public header configuration. The Node server hides
   both.
4. **`write-host-files.mjs` still resolves its default `out` from the working
   directory,** like `site-check.mjs`. It only runs through `pnpm build`,
   whose working directory is the package root. I did not change it, because
   the follow-up named only the server.
5. **Duplicated configuration in `vercel.json`.** It repeats the CSP and the
   headers in a second committed form. The drift test stops them diverging,
   but an edit to policy.mjs now also needs `pnpm vercel:config`, and the
   failing test says so. It may be worth adding to `AGENTS.md` or the
   architecture document, which the supervisor owns.
