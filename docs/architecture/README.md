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
scripts/        structure audit, vendored working-docs audit, brand-asset generator, tests
design/brand/   full-resolution brand masters; never served
public/         served static assets, each at most 300 KB
docs/
  architecture/ this document
  working/      plans and agent memory
```

What exists in `src/` today:

- `app/layout.tsx`: the root layout. It loads the fonts, sets the site-wide
  metadata (title template `%s — FluxIQ`, description, canonical `/`, Open
  Graph, Twitter `summary_large_image` for `@GetFluxIQ`, theme colour), and
  renders a "Skip to content" link to `#main` ahead of the page. The page
  itself owns the header, `<main id="main">`, and the footer.
- `app/globals.css`: the Tailwind `@theme` tokens, body base styles, and all
  motion (see [Brand](#brand)).
- `app/robots.ts` and `app/sitemap.ts`: static, for `https://getfluxiq.com`.
- `app/icon.png`, `apple-icon.png`, `favicon.ico`, `opengraph-image.png`, and
  `opengraph-image.alt.txt`: metadata files that Next turns into `<head>` tags.
  They are generated, never edited by hand.
- `components/ui/`: the shared primitives, one component per file.
  `SectionHeading` (eyebrow, h2, optional lede, centred), `LinkButton` (pill
  link, `primary` or `ghost`, `external` opens a new tab), `Reveal` (a server
  component that marks its block for the CSS reveal), and the decorative
  `GitHubLogo` and `XLogo` SVGs. Every interactive element, the skip link
  included, shows a visible cyan focus outline.

Dependencies point one way: `app` imports `components` and `content`;
`components` import `content` and `components/ui`; `content` imports nothing
from the site. Keeping every product claim in `content/` means a claim can be
audited, or corrected when FluxIQ changes, without reading any markup.

The page. `app/page.tsx` composes the sections in this order:

1. `site-header` (sticky)
2. `hero`
3. `why-fluxiq`
4. `how-it-works`
5. `features`
6. `developers`
7. `roadmap`
8. `licensing`
9. `follow`
10. `site-footer`

The wrapper uses `overflow-x-clip`, not `overflow-hidden`, so the hero's
decoration cannot widen the page and the header can still stick. Each section is
`components/<section>/<section>.tsx`, a server component with no props that
renders one constant from `content/`. Its parts sit beside it, one component
per file. `ui/action-button.tsx` renders a content `ActionLink` as a
`LinkButton` with its icon. No component is a client component, so the only
JavaScript shipped is the Next.js and React runtime, about 137 KB gzip.

Grids that hold code must set `min-w-0` on their items. Otherwise a `<pre>`'s
longest line widens the column past a phone screen. The page wrapper's clip
hides that from page-level overflow checks while cutting off the text.

## Brand

Carried over from the site that was live on 2026-09-18:

- Background `#03001c`; body text Tailwind `slate-200`, muted `slate-400`.
- Accent gradient cyan → blue → purple (`cyan-300/400`, `blue-500/600`,
  `purple-500`), with fuchsia at the end of the step timeline.
- Display font Space Grotesk; body font Inter.
- Logo: the neon "F" monogram in a ring. Wordmark: "Flux" in white, "IQ" in
  the accent gradient. Tagline: "Automate Smarter".

In code, the tokens, base styles, and motion live in `src/app/globals.css`, and
the fonts load in `src/app/layout.tsx`:

- Tokens: `--color-ink` (`bg-ink`, `text-ink`), and `--font-display` and
  `--font-body` (`font-display`, `font-body`), which read the `next/font`
  variables that `layout.tsx` sets on `<html>`. Space Grotesk loads at 500,
  600, and 700; Inter at 400, 500, and 600. Both are self-hosted at build time.
- Base: `body` is ink with `slate-200` Inter text; text selection is
  `cyan-400` at 30 %; `color-scheme` is dark; anchors land 5 rem below the top
  to clear the sticky header.
- Motion, all of it inside `prefers-reduced-motion: no-preference`:
  `animate-wave-drift` (an 18 s drift for the hero waves),
  `animate-status-pulse` (a 2 s fading halo for the status dot), smooth anchor
  scrolling, and the reveal on `[data-reveal]`: a 24 px rise and fade driven
  by `animation-timeline: view()`, which also sits inside
  `@supports (animation-timeline: view())`. There is no JavaScript for motion;
  without support, or under reduced motion, content simply shows.

The primary `LinkButton` puts ink text on the cyan → blue → purple gradient,
because white text on its cyan end is under 2:1 contrast.

Masters are `design/brand/fluxiq-logo-master.png` (1254 × 1254) and
`design/brand/og-banner-master.png` (2056 × 765). Served derivatives are
generated from these; never serve a master. `pnpm brand:assets`
(`scripts/brand-assets.mjs`) regenerates every derivative, writes identical
bytes on every run, and exits 1 if any output is over 300 KB:

| Output | Size | From |
| --- | --- | --- |
| `src/app/icon.png` | 512 × 512 | logo |
| `src/app/apple-icon.png` | 180 × 180 | logo |
| `src/app/favicon.ico` | ICO holding one 32 × 32 PNG | logo |
| `src/app/opengraph-image.png` and `.alt.txt` | 1200 × 630 | banner, cropped by fractions of its size to centre the logo and wordmark and leave out the corner labels |
| `public/brand/fluxiq-logo.webp` | 288 × 288, for 144 px at 2× | logo, with its black background keyed to transparency so it sits on ink without a square |

## Commands

Deployment targets and their settings are in [deployment.md](./deployment.md).

```bash
pnpm dev        # development server on http://localhost:3000
pnpm build      # static export to out/, plus the generated .htaccess and _headers
pnpm start      # serve out/ with the policy headers on PORT (default 3000)
pnpm preview    # the same server, for local checks
pnpm check      # structure audit, working-docs audit, Biome, TypeScript
pnpm test       # node:test suites under scripts/tests
pnpm test:site  # audit the built out/ (run after pnpm build)
pnpm format     # apply Biome's formatting and safe fixes
pnpm docs:index # regenerate docs/working/README.md from document headers
pnpm vercel:config # regenerate vercel.json from scripts/static-hosting/policy.mjs
pnpm brand:assets # regenerate icons, favicon, Open Graph image, and logo from design/brand/
```

`pnpm test:site` audits the built `out/index.html`. It checks headings,
anchors, the link allowlist, metadata, retired phrases, and a 200 KB gzip budget
on the scripts a modern browser loads.

CI (`.github/workflows/ci.yml`) runs install, `check`, `test`, `build`,
`test:site`, and a production dependency audit on every push and pull request.
