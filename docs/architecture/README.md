# Site Architecture

The getfluxiq.com landing page: what it is built with, how it is laid out, and
the commands that build and check it. This document describes the current state;
plans live in [docs/working/](../working/README.md).

## Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16, App Router, React 19, React Compiler | The FluxIQ control panel is Next.js; one framework across the family. |
| Output | Static export (`output: "export"`) to `out/` | A landing page needs no server, and static files deploy to any host. |
| Styling | Tailwind CSS 4, tokens in `src/app/globals.css` | The existing site's design is utility-class based and ports directly. |
| Lint and format | Biome 2 | Matches FluxIQ Core. |
| Package manager | pnpm 10, Node 22 | Matches the FluxIQ repositories. |

Static export rules out route handlers, incremental regeneration, and the image
optimizer (`images.unoptimized` is set), so images are optimized ahead of time
and committed. Removing `output: "export"` is a one-line change if a server
feature is ever needed.

## Layout

```text
src/
  app/          routes, root layout, metadata, icon and Open Graph files
  components/   one directory per page section, plus ui/ for shared primitives
  content/      typed copy and link data; the only place product claims live
scripts/        structure audit, vendored working-docs audit, their tests
design/brand/   full-resolution brand masters; never served
public/         served static assets, each at most 300 KB
docs/
  architecture/ this document
  working/      plans and agent memory
```

Dependencies point one way: `app` imports `components` and `content`;
`components` import `content` and `components/ui`; `content` imports nothing
from the site. Keeping every product claim in `content/` means a claim can be
audited, or corrected when FluxIQ changes, without reading any markup.

As of 2026-09-18 only `src/app/` exists, with a placeholder page;
`components/` and `content/` arrive with the landing page build in
[landing-page.md](../working/landing-page.md).

## Brand

Carried over from the site that was live on 2026-09-18:

- Background `#03001c`; body text Tailwind `slate-200`, muted `slate-400`.
- Accent gradient cyan → blue → purple (`cyan-300/400`, `blue-500/600`,
  `purple-500`), with fuchsia at the end of the step timeline.
- Display font Space Grotesk; body font Inter.
- Logo: the neon "F" monogram in a ring. Wordmark: "Flux" in white, "IQ" in
  the accent gradient. Tagline: "Automate Smarter".

Masters are `design/brand/fluxiq-logo-master.png` (1254 × 1254) and
`design/brand/og-banner-master.png` (1600 × 595). Served derivatives are
generated from these; never serve a master.

## Commands

```bash
pnpm dev        # development server on http://localhost:3000
pnpm build      # static export to out/
pnpm preview    # serve out/ locally
pnpm check      # structure audit, working-docs audit, Biome, TypeScript
pnpm test       # node:test suites under scripts/tests
pnpm format     # apply Biome's formatting and safe fixes
pnpm docs:index # regenerate docs/working/README.md from document headers
```

CI (`.github/workflows/ci.yml`) runs install, `check`, `test`, `build`, and a
production dependency audit on every push and pull request.
