# Report: deploy-targets

Brief: `### Brief: deploy-targets` in `docs/working/deployment.md`, which covers Decisions 4 and 5 and the platform files.

## Outcome

Done, with one dependency and one gap flagged.

- Every file in the brief is written.
- Both workflows parse and pass schema validation.
- Every command in `deployment.md` exists, except `pnpm start`. That script and the new `build` and `preview` arrive with the `static-hosting` worker's `package.json` change, which had not landed when I finished.
- Not run, per the brief or the hooks: the publish script, the Docker image, and any live host.

## What changed and why

- `.nvmrc`: `22`, followed by a newline (Decision 5).
- `Dockerfile`: two stages, both `node:22-alpine`.
  - Build stage:
    - Sets `NEXT_TELEMETRY_DISABLED=1` and `COREPACK_ENABLE_DOWNLOAD_PROMPT=0`, then runs `corepack enable`.
    - Copies the manifests (`package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`) first, so the install layer is cached, then runs `pnpm install --frozen-lockfile`.
    - Copies the source (`COPY . .`) and runs `pnpm build`.
  - Runtime stage:
    - Sets `NODE_ENV=production`, `PORT=3000`, and `HOST=0.0.0.0`.
    - Copies `out/` and `scripts/static-hosting/`. They stay root-owned and world-readable (no `--chown`), so the unprivileged `node` user can serve the files but not change them.
    - `USER node`, `EXPOSE 3000`, a `HEALTHCHECK` with busybox `wget -q -O /dev/null http://127.0.0.1:${PORT}/`, and the exec-form `CMD ["node","scripts/static-hosting/serve.mjs"]`.
  - There is no init process, because the brief makes `serve.mjs` handle SIGTERM itself.
  - `pnpm-lock.yaml` already lists the musl binaries (`@next/swc-linux-x64-musl`, `lightningcss-linux-x64-musl`, `@tailwindcss/oxide-linux-x64-musl`), so Alpine needs no extra setup.
- `.dockerignore`:
  - The brief's list: `node_modules`, `.next`, `out`, `.git`, `design`, `docs`, and `**/.env*`.
  - Machine-local files: `.claude`, `CLAUDE.local.md`, and `.tmp`.
  - Generated files: `*.tsbuildinfo`, `next-env.d.ts`, and `coverage`.
  - `src/` mentions `docs/` only in comments, and nothing in the build reads `design/`.
- `netlify.toml`: `[build] command = "pnpm build"`, `publish = "out"`. A comment says not to add `[[headers]]`, because `_headers` is the source.
- `.github/workflows/ci.yml`:
  - `push` now has `branches-ignore: [deploy]`.
  - `node-version: 22` is replaced by `node-version-file: .nvmrc`.
  - Nothing else changed.
- `.github/workflows/deploy.yml`:
  - Triggers on pushes to `main` and on `workflow_dispatch`, with `permissions: contents: write` and the `deploy` concurrency group (`cancel-in-progress: false`).
  - Uses the same action versions as `ci.yml`.
  - Runs install `--frozen-lockfile`, `check`, `test`, `build`, and `test:site`, then `actions/upload-artifact@v7` with `name: site`, `path: out/`, `include-hidden-files: true`, and `if-no-files-found: error`.
  - The publish step runs only when `github.ref == 'refs/heads/main'`. A manual run from another branch builds and uploads the artifact but does not publish.
  - It sets the `github-actions[bot]` identity, then works in a `git worktree` under `$RUNNER_TEMP`:
    - If `deploy` exists (`git ls-remote --exit-code`), it fetches the tip at depth 1 and runs `worktree add -B deploy … origin/deploy`, so the next commit stacks on that tip.
    - Otherwise it runs `worktree add --detach`, `checkout --orphan deploy`, then `git rm -r -q -f .`. Emptying the index means `main`'s `.gitattributes` cannot apply to the first commit.
    - It then clears everything except `.git`, runs `cp -a out/. "$site"/` (which copies dotfiles), and `add --all`.
    - `git diff --cached --quiet` ends the step with no commit when nothing changed. On an unborn branch, this compares against the empty tree.
    - Otherwise it commits `Deploy <sha> from main` and runs a plain `push origin HEAD:refs/heads/deploy`, never a force push.
  - The push needs the checkout's credentials inside the worktree. I confirmed in the `actions/checkout` changelog that v6.0.1 added worktree support for persisted credentials (`includeIf gitdir:<repo>/.git/worktrees/*`), and `@v6` resolves to v6.0.3.
- `docs/architecture/deployment.md` (new): covers what a build produces; the header policy, with a table of which host reads `.htaccess`, `_headers`, or `policy.mjs` through `serve.mjs`; the workflows and the `deploy` branch; and exact settings for each target.
  - Hostinger website Git. The field names come from docs.hostinger.com/websites/git: **Advanced** → **Git**, then branch `deploy`, and a deploy directory left blank for `public_html` that must be empty before the first deployment. **Connect with GitHub** deploys automatically. The SSH method needs the **Auto Deployment** webhook URL added in GitHub.
  - Hostinger Node.js web app. Fields and values come from docs.hostinger.com/node.js/github and /creating-an-app: preset **Other**, branch `main`, Node 22, build command `build` (Hostinger takes the script name), output `out`, and entry file `scripts/static-hosting/serve.mjs` (`.mjs` is allowed).
  - Docker, a VPS, and Coolify.
  - Vercel, Netlify, and Cloudflare Pages. For Cloudflare Pages: preset None, `pnpm build`, output `out`, and an optional `PNPM_VERSION=10.5.0`.
  - Any static or FTP host.
- `README.md`: a `## Deploy` section at the end that links the guide. I put it last so that the existing untitled paragraphs do not fall under a heading.

## Commands run and observed results

- `pnpm dlx js-yaml .github/workflows/ci.yml` and `… deploy.yml`: both exited 0. I checked the parsed JSON: `on`, `permissions`, `concurrency`, the upload step's `with`, and the publish step's `if` and `env` are as intended.
- `pnpm dlx @action-validator/cli <file>`, run on each workflow: both exited 0 with no findings.
- I extracted the publish step's `run` from the parsed YAML and ran `bash -n` on it: ok.
- `smol-toml` parse of `netlify.toml`, in a scratch directory: `{"build":{"command":"pnpm build","publish":"out"}}`.
- `node scripts/structure-audit.mjs`: `structure: passed (66 files)`.
- `node scripts/working-docs-audit.mjs`: `working-docs: passed (2 documents)`.
- `pnpm exec biome check` on the changed files: `No files were processed`. Biome ignores YAML, TOML, Markdown, and Dockerfiles, so these files do not affect `pnpm check`.
- I grepped `deployment.md` for commands:
  - `corepack enable` and `pnpm install --frozen-lockfile` are in the `Dockerfile`.
  - `pnpm build`, `pnpm check`, `pnpm test`, `pnpm test:site`, and `pnpm preview` are in `package.json`.
  - `docker build` and `docker run` are the Docker CLI and are shown in the `Dockerfile` header.
  - `pnpm start` is **not yet** in `package.json`.
- `curl` of the GitHub releases API: the latest `upload-artifact` is v7.0.1. I checked its `action.yml` and it still has `include-hidden-files`, default `false`.
- `docker run hadolint/hadolint` failed: the Docker daemon is not running (`open //./pipe/dockerDesktopLinuxEngine`). The Dockerfile is not linted.

## Not verified

- The publish script has not been run. My sandbox test against a local bare origin in the scratchpad was denied by the worker hook, because it contained `git commit`, and I did not work around the hook. A harness for the supervisor is at `C:\Users\mrjoh\AppData\Local\Temp\claude\f---FluxIQWebsite\6708a801-e647-4bbc-8ef2-1dd0adeb265f\scratchpad\dt-publish-sandbox.sh`.
  - Run it as `bash dt-publish-sandbox.sh "F:/!FluxIQWebsite"`. It isolates git config with `GIT_CONFIG_GLOBAL`.
  - It extracts the step from `deploy.yml` and runs it three times: first deploy, no change, and a change.
  - It then prints the `deploy` branch's log and tree.
  - Local git is 2.41, and the script avoids `worktree add --orphan`, which needs 2.42.
- `docker build` and `docker run`: not run, per the brief.
- The workflows have not run on GitHub. The first real test is the first push to `main`, which needs the user's approval.
- The Hostinger, Vercel, Netlify, Cloudflare Pages, and Coolify settings are taken from their public docs and have not been tried against a live account. The two biggest uncertainties are in Open questions 3 and 5.

## Open questions or contradictions found

1. **Vercel sends no policy headers.** Vercel reads neither `_headers` nor `.htaccess`, and Next.js does not apply `headers()` to a static export. Zero-config Vercel therefore deploys without the CSP, the security headers, or the cache rules. `deployment.md` says this plainly. The fix is a `vercel.json` generated from `policy.mjs`, which no brief owns. I recommend adding it to `write-host-files.mjs` as a repository-root output, or accepting the gap as documented.
2. **`serve.mjs` default directory.** Docker (`WORKDIR /app`) and Hostinger's entry-file mode both start the server from the repository root, so a cwd-relative `out` works in both. Resolving the default from `import.meta.url` (`../../out`) would stop it from depending on the host's working directory. This is worth checking when the `static-hosting` output is verified.
3. **Hostinger Node.js web app mode.** Hostinger's docs say static apps are served from `public_html`, while server apps run the entry file from `hbuilds/current/nodejs` behind an `.htaccess` proxy. They do not say which mode wins when both an output directory and an entry file are set, or whether `PORT` is injected. Either mode applies the policy: `.htaccess` in one, `serve.mjs` in the other. The exact behaviour still needs a live check.
4. **Dotfiles on non-Apache hosts.** On Netlify and Cloudflare Pages, `.htaccess` may be served as a plain file, and on Apache, `_headers` is served. Both contain only public header policy, so nothing leaks. `serve.mjs` could return 404 for them if that is wanted.
5. **Cloudflare Pages pnpm.** The v3 build image defaults to pnpm 10.11.1, and the lockfile is v9, so `--frozen-lockfile` should work. `PNPM_VERSION=10.5.0` is documented as optional.
