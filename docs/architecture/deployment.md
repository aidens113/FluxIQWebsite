# Deployment

How the site gets from this repository onto a host, and the exact settings for
each supported target. The repository deploys unchanged to every target below;
nothing is edited per host. This document describes the current state; plans
live in [docs/working/](../working/README.md).

## What a build produces

`pnpm build` runs `next build --webpack`, which writes the static export to
`out/`, then `scripts/static-hosting/write-host-files.mjs`, which adds the host
files. Webpack lets Next use its WebAssembly SWC fallback when a host's glibc is
too old for the native compiler; Turbopack requires native bindings.

| File | Read by |
| --- | --- |
| `out/.htaccess` | Apache and LiteSpeed: security headers, CSP, cache rules, compression, `ErrorDocument 404` |
| `out/_next/static/.htaccess` | Apache and LiteSpeed: the immutable cache for hashed assets |
| `out/_headers` | Netlify and Cloudflare Pages: the same headers and cache rules |

`pnpm start` (and `pnpm preview`) runs `scripts/static-hosting/start.mjs`, an
unconditional entry that starts the dependency-free Node server in
`scripts/static-hosting/serve.mjs`. It serves `out/` on `PORT` (default 3000)
and `HOST` (default `0.0.0.0`) and applies the same headers itself, so it is the
runtime for Node hosts and for the Docker image.

The Node version is 22, from `.nvmrc`; setup-node, Netlify, and Cloudflare
Pages read it. pnpm comes from `packageManager` in `package.json`, except for
the temporary Hostinger npm workaround described below.

## One header policy

`scripts/static-hosting/policy.mjs` is the only source of the security headers,
the CSP, the cache rules, and the content types. The generated `.htaccess`,
`_headers`, and `vercel.json`, and the Node server, are all derived from it, so the hosts cannot
drift apart. To change a header, change `policy.mjs` and rebuild; never edit
the generated files or add headers in a host's own configuration.

| Host | Applies the policy through |
| --- | --- |
| Hostinger website hosting, cPanel, any Apache or LiteSpeed host | `.htaccess` |
| Netlify, Cloudflare Pages | `_headers` |
| Hostinger Node.js web app, Docker, a VPS, Coolify, Render, Railway | `start.mjs` / `serve.mjs`, reading `policy.mjs` |
| Vercel | `vercel.json` at the repository root (see [Vercel](#vercel)) |
| nginx, Caddy, object storage | Nothing: the headers are not sent; proxy to `serve.mjs` instead |

## Workflows and the deploy branch

- `.github/workflows/ci.yml` runs on every push except to `deploy`, and on pull
  requests: install, `pnpm check`, `pnpm test`, `pnpm build`, `pnpm test:site`,
  and a production dependency audit.
- `.github/workflows/deploy.yml` runs on every push to `main`, and manually
  from the Actions tab. It installs with `--frozen-lockfile`, runs the same
  checks and build, uploads `out/` as the artifact `site` with its dotfiles,
  then publishes `out/` to the `deploy` branch.
  - The first run creates `deploy` as an orphan branch. Later runs stack a
    normal commit, `Deploy <sha> from main`, by `github-actions[bot]`.
  - When `out/` has not changed, nothing is committed.
  - It never force-pushes. If the branch moved, the push fails instead.
  - Runs are serialized in the `deploy` concurrency group.
  - A manual run from a branch other than `main` builds and uploads the
    artifact, but does not publish.
- The `deploy` branch holds the contents of `out/` at its root and nothing
  else. It is generated: never edit, commit to, or push it by hand. Change
  `main` and let the workflow regenerate it.
- Pushes made by the workflow's token do not trigger other workflows, but
  repository webhooks, such as Hostinger's, still fire.

## Targets

### Hostinger website Git

For Hostinger web hosting, which serves files through LiteSpeed. The Git
feature pulls a branch as-is and runs no build, so it pulls `deploy`.

In hPanel, open **Advanced**, then **Git**.

| Setting | Value |
| --- | --- |
| Repository | This repository, through **Connect with GitHub**, or its URL for the SSH method |
| Branch | `deploy` |
| Deploy directory | Blank, for `public_html`, or a subfolder. It must be empty before the first deployment. |
| Auto deployment | Built in with **Connect with GitHub**. With SSH, copy the webhook URL from **Auto Deployment** into GitHub, **Settings**, **Webhooks**, for push events. |

- For a private repository over SSH, add Hostinger's SSH key to the repository
  as a read-only deploy key.
- The `deploy` branch must exist first: push to `main` or run the Deploy
  workflow once.
- LiteSpeed applies `out/.htaccess`; no Node process runs.

### Hostinger Node.js web app

For Hostinger's web app hosting, which installs, builds, and runs the app. Import
the repository from GitHub and set:

| Setting | Value |
| --- | --- |
| Framework preset | Other |
| Branch | `main` |
| Node.js version | 22 |
| Package manager | `npm` |
| Root directory | The repository root |
| Build command | `build`, the `package.json` script |
| Output directory | `out` |
| Entry file | `scripts/static-hosting/start.mjs` |

- Select npm explicitly. Hostinger currently provisions pnpm 12 through an
  older Corepack that looks for the removed `bin/pnpm.cjs` entry point. The
  repository remains pinned to pnpm 10 for local work and CI; npm is only the
  Hostinger installation workaround until its Corepack is updated.
- The webpack production build falls back to WebAssembly SWC when Hostinger's
  glibc is older than Next's native Linux compiler requires.
- The server listens on `PORT`, or 3000 if it is unset.
- Each push to `main` sends a webhook, and Hostinger installs, builds, and
  restarts the app.
- Use **Other** so that no Next.js server defaults apply; the site is a static
  export, and `start.mjs` is the unconditional server entry.

### Docker, a VPS, and Coolify

The `Dockerfile` builds in `node:22-alpine` and runs `start.mjs` in a second
`node:22-alpine` stage that holds only `out/` and `scripts/static-hosting/`.

```bash
docker build -t fluxiq-website .
docker run -d --restart unless-stopped -p 3000:3000 fluxiq-website
```

- It runs as the `node` user, listens on port 3000, and has a `HEALTHCHECK`
  that requests `/` with busybox `wget`.
- The server handles `SIGTERM`, so `docker stop` shuts it down cleanly.
- Set `PORT` to listen elsewhere, for example `-e PORT=8080 -p 8080:8080`.
- On a VPS, put a TLS-terminating reverse proxy (Caddy, nginx, or Traefik) in
  front of port 3000. The proxy passes the policy headers through.
- On a VPS without Docker, install Node 22, run `corepack enable`, then
  `pnpm install --frozen-lockfile`, `pnpm build`, and `pnpm start` under a
  process manager such as systemd.
- In Coolify, create a resource from this repository with the **Dockerfile**
  build pack and port 3000 exposed.
- Serving `out/` directly from nginx or Caddy sends none of the policy headers.
  Proxy to the Node server instead.

### Vercel

Zero configuration: import the repository. Vercel detects Next.js and pnpm,
runs the `build` script, and serves the static export.

- Vercel takes the Node version from its project settings or `engines`, not
  from `.nvmrc`. Set it to 22.x in the project settings.
- Vercel reads neither `_headers` nor `.htaccess`, and Next.js does not apply
  `headers()` to a static export. So the policy reaches Vercel through the
  committed `vercel.json`, which `pnpm vercel:config` generates from
  `policy.mjs`. A test in `pnpm test` fails if the file drifts from the policy,
  so after changing `policy.mjs`, run `pnpm vercel:config` and commit the
  result. The file sets headers only, never framework, build, or output
  settings.

### Netlify

`netlify.toml` sets the build command to `pnpm build` and the publish
directory to `out`, so importing the repository needs no settings. Netlify
reads the Node version from `.nvmrc`, and applies `out/_headers`. Do not add
`[[headers]]` to `netlify.toml`.

### Cloudflare Pages

Connect the repository and set:

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Build command | `pnpm build` |
| Build output directory | `out` |
| Root directory | Blank |

- The build image reads the Node version from `.nvmrc`, and detects pnpm from
  `pnpm-lock.yaml`. To match `packageManager` exactly, set the environment
  variable `PNPM_VERSION` to `10.5.0`.
- Pages applies `out/_headers`.

### Any static or FTP host

1. Get the built site:
   - Download the `site` artifact from a Deploy workflow run.
   - Check out the `deploy` branch.
   - Or run `pnpm build` locally.
2. Upload the contents of `out/`, not the folder itself, to the web root. Include
   the dotfiles `.htaccess` and `_next/static/.htaccess`. Many FTP clients hide
   them unless hidden files are shown.

An Apache or LiteSpeed host applies `.htaccess` when it allows overrides and has
`mod_headers` loaded. Any other static host sends none of the policy headers.
