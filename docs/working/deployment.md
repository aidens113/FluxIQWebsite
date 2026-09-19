# Deployment

Status: Active
Status detail: Hostinger exposed pnpm/Corepack and glibc incompatibilities; the verified repository fix awaits a live redeploy.
Created: 2026-09-18
Last updated: 2026-09-19
Owner: Senior supervisor agent
Scope: Make the repository deployable, unchanged, to Hostinger (Git deploy or Node.js web app) and to other CI/CD targets (Docker, Netlify, Cloudflare Pages, Vercel, any static host); excludes choosing or configuring the user's live account.
Paired document: none
Related: [AGENTS.md](../../AGENTS.md), [site architecture](../architecture/README.md), [landing page](./landing-page.md)

---

## Current State

**True now.** The repository deploys unchanged to Hostinger and to other
pipelines. [deployment.md](../architecture/deployment.md) has the settings for
each target.

- **Build output.** `pnpm build` writes `out/` plus `.htaccess`,
  `_next/static/.htaccess`, and `_headers`, all generated from
  `scripts/static-hosting/policy.mjs`. `vercel.json` is generated from the
  same file, and a test fails on drift.
- **Node platforms.** `pnpm start` / `npm start` serve `out/` with the
  policy on `PORT`/`HOST`. This covers a Hostinger Node.js web app
  (entry `scripts/static-hosting/serve.mjs`, output `out`), Render, and
  Railway.
- **Hostinger compatibility.** Select npm in Hostinger to avoid its pnpm 12 /
  Corepack binary-path bug. Production uses webpack, allowing Next to fall back
  to WebAssembly SWC on Hostinger's pre-glibc-2.29 image; `next.config.mjs`
  loads without compiling a TypeScript configuration first.
- **Docker.** A multi-stage `Dockerfile` with a non-root runtime and a
  health check.
- **Platform config.** `netlify.toml`, plus `.nvmrc` (22) for setup-node,
  Netlify, and Cloudflare Pages.
- **Hostinger website Git.** `.github/workflows/deploy.yml` runs on a push to
  `main`: check, test, build, test:site, the artifact `site`, and a normal
  commit of `out/` to the `deploy` branch. That branch is what Hostinger's
  website Git deploy pulls. `ci.yml` ignores `deploy`.

**Verified by the supervisor, 2026-09-18.**

- The repository gates pass: 85 tests, all checks, the build, `test:site`,
  and `vercel:config --check`.
- CSP in Chromium through `serve.mjs`: no violations, and fonts and images
  load.
- Docker: a Linux build with the frozen lockfile, `healthy`, running as
  `node`, with the headers, gzip, immutable cache, and 404 correct. SIGTERM
  shuts down cleanly (exit 0, 0.4 s).
- npm in a clean copy: `npm install`, `npm run build`, and `npm start`
  work with no pnpm.
- The publish step, against a local bare origin: an orphan branch first, a
  no-op when nothing changed, then a stacked commit. Only `out/` is on the
  branch, dotfiles included.

**Not verified.** The compatibility fix has not yet been redeployed on live
Hostinger. No live Apache, LiteSpeed, Netlify, Cloudflare, or Vercel deploy has
run. The GitHub-hosted workflows have not run from `main`.

**Next.** Push or merge the fix to the branch Hostinger builds, then redeploy
with npm, Node 22, build script `build`, output `out`, and the documented entry
file. See Open Questions.

## Findings

- **Hostinger has two Git paths** (docs.hostinger.com, checked 2026-09-18).
  - The website **Git** feature pulls a branch into a directory as-is and
    runs no build. It needs a branch that already holds the built files.
  - **Node.js web apps** use the GitHub integration: install, then build,
    then start. The package manager is auto-detected from lockfiles (npm,
    yarn, pnpm), Node 18 to 24 are supported, and the settings are framework
    preset, branch, root directory, build command, output directory, and
    entry file for server apps. A push sends a webhook, then Hostinger
    installs, builds, and restarts.
- Netlify and Cloudflare Pages read `_headers` from the publish directory.
  Apache and LiteSpeed hosts (Hostinger's web hosting, most cPanel hosts)
  read `.htaccess`.
- `actions/upload-artifact` v4 skips hidden files unless
  `include-hidden-files: true` is set, which `.htaccess` needs.
- The page carries inline RSC payload scripts (`self.__next_f.push`), so a CSP
  needs `script-src 'self' 'unsafe-inline'` unless hashes are generated.

## Decisions

1. **One header policy.** `scripts/static-hosting/policy.mjs` owns the
   security headers, CSP, cache rules, and content types. Everything else is
   derived from it:
   - the generated `.htaccess` and `_headers`;
   - the Node server;
   - the Docker image, through that server.

   One source means the hosts cannot drift apart.
2. **Host files are generated into `out/` by `pnpm build`**
   (`next build && node scripts/static-hosting/write-host-files.mjs`). They are
   not placed in `public/`, so they always match the policy.
3. **`pnpm start` serves `out/`** with a dependency-free, tested Node server
   on `PORT` and `HOST`. That makes the repository a valid Node app for
   Hostinger web apps, Render, Railway, and similar, and gives Docker a
   runtime with no nginx config to keep in sync.
4. **Hostinger Git deploy gets a `deploy` branch** that CI generates from
   `main`. It holds the contents of `out/` at its root, and each deploy is a
   normal commit, never a force push. Agents never edit it by hand.
5. **Node version comes from `.nvmrc`** (22), which setup-node, Netlify, and
   Cloudflare Pages all read. `engines` in `package.json` stays `>=22`.
6. **Security headers:**
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `X-Frame-Options: DENY`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
   - `Strict-Transport-Security: max-age=31536000`
   - The CSP: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`
7. **Cache rules:**
   - `/_next/static/*`: `public, max-age=31536000, immutable`.
   - `.html`, `.txt`, `.xml`, and directory URLs:
     `public, max-age=0, must-revalidate`.
   - Everything else: `public, max-age=86400`.
8. **Production builds use webpack.** Hostinger's current Linux image cannot
   load Next's native SWC binary because its glibc predates 2.29. Next can fall
   back to WebAssembly SWC, but that fallback does not support Turbopack. The
   JavaScript `next.config.mjs` also avoids needing SWC to compile the
   configuration before the fallback is ready.

## Worker Briefs

### Brief: static-hosting
- Repository: this repository
- Task: implement Decisions 1 to 3, 6, and 7 as dependency-free ESM under `scripts/static-hosting/`.
  - `policy.mjs` exports the header set, the CSP, `cacheControlFor(urlPath)`, content types, and which types are compressible.
  - `write-host-files.mjs [--out out]` exits 1 if `out/` is missing. It writes three files:
    - `out/.htaccess`: `Options -Indexes`, `DirectoryIndex index.html`, `ErrorDocument 404 /404.html`, `AddDefaultCharset UTF-8`, headers inside `<IfModule mod_headers.c>`, `Cache-Control` via `<FilesMatch>`, and `mod_deflate` compression inside `<IfModule>`. No `<If>` blocks, because LiteSpeed support for them is partial.
    - `out/_next/static/.htaccess`, setting the immutable cache.
    - `out/_headers`, in Netlify and Cloudflare Pages syntax.
  - `serve.mjs [--dir out]` listens on `PORT` (default 3000) and `HOST` (default 0.0.0.0).
    - It serves GET and HEAD only; anything else gets 405.
    - It rejects path traversal, including percent-encoded, and null bytes.
    - A directory serves its `index.html`. `/x` redirects with 308 to `/x/` when `x/index.html` exists, matching `trailingSlash: true`.
    - Anything missing returns 404 with the `404.html` body.
    - Every response carries the policy headers. Compressible types are gzipped when the client accepts it, with `Vary: Accept-Encoding`.
    - It prints one startup line and closes cleanly on SIGTERM and SIGINT.
  - Tests go in `scripts/static-hosting/tests/`, using node:test with temporary fixture directories:
    - Cache rules.
    - Writer output: every header in both formats, plus `ErrorDocument`.
    - Server: 200 with headers and the CSP; the 404 body and status; `/../package.json` and `%2e%2e` blocked; 405; gzip; immutable `_next/static`; the trailing-slash redirect.
  - `package.json` scripts:
    - `build`: `next build && node scripts/static-hosting/write-host-files.mjs`
    - `start` and `preview`: `node scripts/static-hosting/serve.mjs`
    - `test`: `node --test "scripts/**/tests/*.test.mjs"`. Confirm the count is the old 44 plus yours, with nothing run twice.
- Required reads: this document; `scripts/site-check.mjs` and `scripts/structure-audit.mjs` for house style; `package.json`
- Owns (may edit): `scripts/static-hosting/**`, the `scripts` block of `package.json`
- Must not touch: `src/**`, `.github/**`, `Dockerfile`, `.dockerignore`, `netlify.toml`, `.nvmrc`, `README.md`, `AGENTS.md`, `docs/**` (except your report), and the other scripts
- Definition of done:
  - `pnpm test` passes.
  - `node scripts/structure-audit.mjs` passes.
  - `pnpm exec biome check scripts package.json` is clean.
  - `pnpm build` then shows `out/.htaccess`, `out/_headers`, and `out/_next/static/.htaccess`.
  - `pnpm start`, then `curl -sI` for `/`, `/_next/static/<a real file>`, and `/nope`, shows the headers, the cache rules, and a 404.
  - You are the only worker allowed to run `pnpm build`.
- Report to: docs/working/deployment/reports/static-hosting.md

### Brief: deploy-targets
- Repository: this repository
- Task: implement Decisions 4 and 5, plus the platform files. The Node server contract from the `static-hosting` brief: `node scripts/static-hosting/serve.mjs` serves `out/` on `PORT`/`HOST`, and `pnpm build` produces `out/`, host files included.
  - `.nvmrc`: `22`.
  - `Dockerfile`, multi-stage.
    - Build stage: `node:22-alpine`, `corepack enable` (pnpm from `packageManager`), `pnpm install --frozen-lockfile`, `pnpm build`.
    - Runtime stage: `node:22-alpine`, `USER node`, copying `out/` and `scripts/static-hosting/`. `ENV PORT=3000 HOST=0.0.0.0`, `EXPOSE 3000`, a `HEALTHCHECK` with busybox `wget`, and `CMD ["node","scripts/static-hosting/serve.mjs"]`.
  - `.dockerignore`: `node_modules`, `.next`, `out`, `.git`, `design`, `docs`, and local env files.
  - `netlify.toml`: build command `pnpm build`, publish `out`.
  - `.github/workflows/ci.yml`: use `node-version-file: .nvmrc`, and ignore pushes to the `deploy` branch.
  - `.github/workflows/deploy.yml`:
    - Triggers on push to `main` and on `workflow_dispatch`. `permissions: contents: write`, and a `deploy` concurrency group.
    - Steps: install `--frozen-lockfile`, `check`, `test`, `build`, `test:site`.
    - Upload `out/` as artifact `site`, with `include-hidden-files: true`.
    - Publish `out/` to the `deploy` branch, dotfiles included. Create it as an orphan the first time, otherwise stack a normal commit on it. Commit nothing when nothing changed. Never force-push. Use the `github-actions[bot]` identity.
  - `docs/architecture/deployment.md`: exact settings for each target.
    - Hostinger website Git: the `deploy` branch, an empty install directory, and the auto-deploy webhook.
    - Hostinger Node.js web app: branch `main`, build `build`, output `out`, entry `scripts/static-hosting/serve.mjs`, Node 22.
    - Docker, VPS, and Coolify.
    - Vercel (zero-config), Netlify, and Cloudflare Pages (build `pnpm build`, output `out`).
    - Any static or FTP host: upload `out/`, including dotfiles.
    - Say which host reads `.htaccess` and which reads `_headers`, and point to `policy.mjs` as the source.
  - `README.md`: a short Deploy section linking that document.
- Required reads: this document; `.github/workflows/ci.yml`; `package.json`; `README.md`
- Owns (may edit): `Dockerfile`, `.dockerignore`, `netlify.toml`, `.nvmrc`, `.github/workflows/**`, `docs/architecture/deployment.md`, `README.md`
- Must not touch: `package.json`, `scripts/**`, `src/**`, `AGENTS.md`, `docs/architecture/README.md`, `docs/working/**` (except your report)
- Definition of done:
  - Both workflow files parse (`pnpm dlx js-yaml <file>`).
  - Every command in `deployment.md` exists in `package.json` or the Dockerfile.
  - Do not run `pnpm build` or `docker build`: the other worker is changing the build concurrently, and the supervisor runs Docker at integration.
- Report to: docs/working/deployment/reports/deploy-targets.md

## Work Ledger

### 2026-09-19 — Hostinger legacy Linux compatibility
- Agent: senior supervisor
- Changed: `next.config.ts` to `next.config.mjs`, the build script, and deployment documentation
- Why: Hostinger's Corepack failed pnpm 12 startup, then its glibc older than 2.29 could not load Next's native SWC binary
- Validation: `pnpm check` passed; 85 tests passed; a clean npm install and forced WebAssembly SWC webpack build exported all routes; `pnpm test:site` passed at 134.9 KB gzip JS
- Outcome: Accepted locally; live Hostinger redeploy pending
- Follow-up: redeploy on Hostinger and record the result

### 2026-09-18 — Deployable to Hostinger and other pipelines
- Agent: workers `static-hosting` (one follow-up: a generated `vercel.json`, and the server resolving `out/` from its own path) and `deploy-targets`; supervisor verification and doc updates
- Changed: `scripts/static-hosting/**`, `vercel.json`, `package.json` scripts, `Dockerfile`, `.dockerignore`, `netlify.toml`, `.nvmrc`, `.github/workflows/{ci,deploy}.yml`, `docs/architecture/{deployment,README}.md`, `README.md`, `AGENTS.md`
- Why: the user asked for the repository to be pushable to Hostinger and other CI/CD pipelines
- Validation:
  - `pnpm check` -> passed; `pnpm test` -> 85 pass; `pnpm build` -> host files written; `pnpm test:site` -> passed
  - `docker build` / `run` -> healthy, headers correct, `docker stop` exit 0
  - Clean-copy `npm install && npm run build && npm start` -> 200
  - Publish sandbox -> orphan, then no-op, then a stacked commit
  - Chromium via `serve.mjs` -> no CSP violations
- Outcome: Accepted
- Follow-up: the first real deploy, after the user's hosting choice and a push to `main`

## Open Questions

- **Which Hostinger product** (owner: user). "Websites → Git" with the
  `deploy` branch, or "Node.js web app" from `main`. Both will work; the
  choice is made in hPanel, not in the repository.
- **Pushing `main`** (owner: user). The deploy workflow runs on pushes to
  `main`, and pushing `main` needs the user's approval each time.
