# Report: site-check

Brief: `### Brief: site-check` in `docs/working/landing-page.md` (Phase 4 steps 1 and 2).
Date: 2026-09-18.

Revision 2, same day, after the supervisor's follow-up: `js-budget` now measures what a modern browser loads, not every `.js` file under `_next/static`. The changes are marked "(revision 2)" below.

## Outcome

Done. All the definition-of-done checks pass, both after the first delivery and after revision 2. I did not run `pnpm build`, as the brief says.

## What changed and why

- `scripts/site-check.mjs` (new, 313 lines after revision 2, dependency-free ESM). It audits `<out>/index.html`, where `--out <dir>` defaults to `out` relative to the working directory. It prints `<rule>: <message>` lines. It exits 1 on any finding, including a missing `index.html`. Otherwise it prints `site-check: passed (<n> KB gzip JS)` and exits 0.
  - Exports: `checkHtml(html)`, the pure checker for every document rule; `scriptSources(html)`, pure, added in revision 2; `measureScripts(outDir, sources)`, which returns `{ bytes, problems }`; `checkSite(outDir)`, which returns `{ findings, scriptBytes }`; and the constants `ALLOWED_HREFS`, `REQUIRED_IDS`, `CANONICAL_URL`, `RETIRED_PHRASES`, and `MAX_SCRIPT_GZIP_BYTES`.
  - Rules:
    - `missing-index`: `out/index.html` is missing.
    - `html-lang`: `<html>` must have `lang="en"` exactly.
    - `single-h1`: the document must have exactly one `<h1>`.
    - `img-alt`: every `<img>` has an `alt` attribute. An empty `alt` is allowed, for decorative images.
    - `anchor-target`: every `<a href="#x">` resolves to an `id="x"`. `href="#"` is a finding.
    - `required-anchor`: ids `main`, `how-it-works`, `features`, `developers`, `roadmap`, and `license` exist.
    - `link-allowlist`: every other `<a href>` exactly matches the brief's seven-entry allowlist.
    - `link-rel`: every link with `target="_blank"` (case-insensitive) has `rel` tokens that include both `noopener` and `noreferrer`.
    - `head-meta`: the head has a non-empty `<title>`, `meta name=description`, `link rel=canonical href="https://getfluxiq.com/"`, an absolute http(s) `og:image`, and `twitter:card`.
    - `retired-phrase`: none of the retired phrases appear in visible text or in any `<meta content>`, case-insensitive and across whitespace.
    - `js-budget` (revision 2): the scripts a modern browser loads total at most 200 KB (204,800 bytes) gzip.
      - It measures every `<script src>` in `index.html` that has no `nomodule` attribute. Attribute names are lowercased, so Next's `noModule=""` is excluded.
      - Scripts inside HTML comments and inline scripts are excluded. So are files under `_next/static` that `index.html` does not reference.
      - Each `src` is resolved the way a browser does, with WHATWG `new URL(src, <site root>)`. This handles query strings, relative paths, and `..` at the root. The result is then joined to the out directory.
      - Each distinct file counts once, gzipped separately, and the sizes are summed.
      - A referenced file that is missing is a `js-budget` finding ("refers to a missing file: <path>"). So is a `src` on another origin, a protocol-relative `src`, or a malformed one ("is not a file in the build, so it cannot be measured"). None of these can be measured.
      - The header comment documents all of this.
  - Before any rule runs, the checker removes comments, `<!doctype>`, and the bodies of `<script>` and `<style>`. This matters because Next inlines the RSC payload in `<script>` tags, and the payload contains page strings such as the 404 page's "This page could not be found." Tag parsing handles `>` inside quoted attribute values. It decodes entities in attributes and text.
- `scripts/tests/site-check.test.mjs` (new, 262 lines after revision 2, node:test). Fixtures are written under `os.tmpdir()` with the same `withSite` pattern as `structure-audit.test.mjs`. There are 16 tests; revision 2 went from 14 to 16:
  - One passing fixture. It contains the traps that must not fire: an RSC-style `<script>` with `<h1>`, "Coming Soon", "policy", and a non-allowlisted href; a comment with "TODO"; a `<style>` with `<h1>`; and "policies", "policyholder", and "many models".
    - Revision 2 adds one real `<script src="/_next/static/chunks/app.js">`. Every fixture directory now gets that file through a `siteFiles` helper.
    - It also adds a commented-out `<script src=".../gone.js">`, whose file does not exist. If comments were not skipped, this would fire `js-budget`.
  - js-budget tests (revision 2, three tests in place of one):
    1. The summed size equals `gzip(app.js) + gzip(a.js)` exactly. `a.js` is loaded twice, once as a relative path with `?v=1`, and counts once. A 400 KB `unused.js` that nothing references is ignored. Adding a reference to `b.js` pushes the total over 200 KB and gives exactly one `js-budget` finding.
    2. The `nomodule` exclusion. A 400 KB `polyfills.js` loaded with `noModule=""` gives no finding, and the size equals `gzip(app.js)` alone. `scriptSources()` returns only the app script. The same element without `noModule` fails `js-budget`.
    3. A missing referenced file, an `https://` script on another origin, and a protocol-relative (`//`) script each give one `js-budget` finding.
  - A guard test that the fixture really uses every allowlisted href and required id.
  - At least one failing case per rule. Most replace a string in the fixture and assert that the exact rule list comes back, so each case isolates one rule.
  - CLI exit codes: 0 when clean; 1 with a `html-lang:` line; 1 with a `missing-index:` line when the tool runs with its default `out` from a directory that has no `out/`.
- `package.json`: added `"test:site": "node scripts/site-check.mjs"` after `test` in `scripts`. Nothing else changed.
- `.github/workflows/ci.yml`: added `- run: pnpm test:site` directly after `- run: pnpm build`.

## Commands run and observed results

Revision 2:

- `node --test scripts/tests/site-check.test.mjs` printed `ok 1` through `ok 16`, then `# tests 16`, `# pass 16`, `# fail 0`.
- `pnpm test` exited 0 and printed `# tests 44`, `# pass 44`, `# fail 0`.
- `node scripts/structure-audit.mjs` exited 0 and printed `structure: passed (23 files)`. The file count went up because other workers have added files.
- `pnpm exec biome check scripts` exited 0 and printed `Checked 5 files in 14ms. No fixes applied.` `pnpm exec biome check package.json .github` printed `Checked 1 file ... No fixes applied.` I ran `biome check --write` on my two files first; it fixed formatting in the test file.
- Smoke test of `checkSite('out')` against the stale placeholder build, read only:
  - `scriptSources` returned 5 chunks. The `noModule` chunk `0cz1d0mv5g_q7.js` was excluded.
  - `scriptBytes` was 133,456, or 130.3 KB gzip.
  - There were no `js-budget` findings, and every `src` resolved to a file on Windows.

First delivery (superseded where revision 2 changed things):

- `node --test scripts/tests/site-check.test.mjs` printed `# tests 14`, `# pass 14`, `# fail 0`.
- `pnpm test` exited 0 and printed `# tests 42`, `# pass 42`, `# fail 0`. That total includes the existing structure-audit and working-docs-audit suites.
- `node scripts/structure-audit.mjs` exited 0 and printed `structure: passed (16 files)`.
- `pnpm exec biome check scripts package.json .github` exited 0 and printed `Checked 6 files in 13ms. No fixes applied.`
  - The first run found formatting only, in my two new files. I fixed them with `biome check --write` on those two files alone.
- Smoke test: `pnpm test:site` against the stale `out/` already on disk, which is the placeholder page built at 22:12 and was only read. It exited 1 with these lines, which is correct for a page with no nav or full metadata:
  - `required-anchor` for all six ids.
  - `head-meta` for `twitter:card`, `og:image`, and the canonical link.
  - No false positives came from the inlined RSC payload: `single-h1`, `retired-phrase`, and `link-allowlist` did not fire.
- The same build's measured JavaScript is 173,367 bytes, or 169.3 KB gzip. It is spread over 9 files:
  - 69.9 KB and 47.3 KB for the framework and React chunks.
  - 38.7 KB for `0cz1d0mv5g_q7.js`, the `noModule` legacy polyfill chunk.
  - About 13 KB for the rest.

## Not verified

- `pnpm test:site` against a real landing-page build. The page is being built concurrently, and the supervisor runs it at integration.
- The CI workflow on GitHub Actions. I checked it only by reading the edited YAML and with Biome, which ignores `.yml` because `ignoreUnknown` is set.
- Whether Next 16 will ever put `<title>` or metadata outside `<head>`, through streaming metadata. `<meta>` and `<link>` are searched across the whole document, but `<title>` only inside `<head>` (so an SVG `<title>` does not count).

## Open questions or contradictions found

1. **JS budget headroom (resolved in revision 2).** The first version counted every `.js` file and measured 169.3 KB, leaving about 31 KB. The supervisor chose to measure only what a modern browser loads. The placeholder build now measures 130.3 KB, leaving about 70 KB for the landing page's client code.
   - One consequence: a chunk that loads only on demand, with no `<script src>` in `index.html` (a lazy `import()`), is not counted. Next preloads a route's chunks with `<script src>`, so this matters only if a section adds a dynamic import.
2. **Brief vs. Phases text.** Phase 4 in the Phases section allows `github.com/aidens113/FluxIQ/blob/*` and lists four retired phrases. The brief is narrower on the first and wider on the second: it allows only `.../blob/main/LICENSE.md`, adds `/` and `https://getfluxiq.com/`, and adds "any model", "lorem", and "todo". It also adds `html-lang`, `img-alt`, and `twitter:card`. I followed the brief. The Phases text may need updating to match. After revision 2, its line "Total JS under `out/_next/static` stays within 200 KB gzip" also no longer describes the rule, which now counts only the scripts `index.html` loads without `nomodule`.
3. **Phrase matching interpretation.** Every retired phrase must start on a word boundary, and "policy" must also end on one, as the brief requires. So "many models" does not match "any model", and "mastodon" does not match "todo". Plain substring matching would have flagged both. Plurals still match, for example "any models" and "TODOs".
4. **Strict choices that could fail the real page.**
   - `href="#"` and `/#features`-style links are findings.
   - `https://getfluxiq.com` without the trailing slash is not on the allowlist.
   - `required-anchor` checks that the target ids exist. It does not check that nav links to them exist.
