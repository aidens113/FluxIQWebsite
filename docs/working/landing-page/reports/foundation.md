# Report: foundation

Brief: `### Brief: foundation` in `docs/working/landing-page.md`, Phase 1 steps 1 to 6 with Decision 3 for motion.

## Outcome

Done. Every item in the brief is built, and all four definition-of-done checks pass. `pnpm build`, `next dev`, and `next typegen` were not run, as the shared values require, so nothing has been checked in a real Next build.

## What changed and why

- `src/app/globals.css`
  - Tokens: `@theme { --color-ink: #03001c }`, which gives `bg-ink` and `text-ink`. `@theme inline { --font-display, --font-body }` reads `var(--font-space-grotesk)` and `var(--font-inter)`, with system fallbacks. The font tokens are `inline` so the utilities read the next/font variables directly, as the Next docs show for Tailwind.
  - `@layer base`:
    - `html`: `color-scheme: dark`, and `scroll-padding-top: 5rem` so anchors clear the Decision 11 sticky header.
    - `body`: ink background, `slate-200` text, and `font-family: var(--font-body)`.
    - `::selection`: `cyan-400` at 30 %, the same `color-mix` that `selection:bg-cyan-400/30` compiles to.
  - Keyframes: `wave-drift`, `status-pulse` (an expanding, fading halo), and `reveal-rise` (opacity 0 → 1, `translateY(24px)` → none). They use `transform` rather than `translate`, so Tailwind's `hover:-translate-y-*` still works.
  - Motion, all of it inside `@media (prefers-reduced-motion: no-preference)`:
    - `@utility animate-wave-drift`: 18 s, ease-in-out, infinite.
    - `@utility animate-status-pulse`: 2 s, infinite.
    - `html { scroll-behavior: smooth }`.
    - `[data-reveal]`: `animation: reveal-rise ease-out both; animation-timeline: view(); animation-range: entry 0% entry 100%`, nested inside `@supports (animation-timeline: view())`.
    - The utilities set longhands and leave `animation-delay` unset, so section workers can stagger layers with `[animation-delay:-6s]`.
    - The reveal finishes once an element has fully entered the viewport. Any element that can be fully visible therefore always reaches full opacity. Wrap blocks shorter than a screen.
- `src/app/layout.tsx`
  - Fonts: `Space_Grotesk` (500/600/700, `--font-space-grotesk`) and `Inter` (400/500/600, `--font-inter`), both `display: "swap"`, with their variable classes on `<html>`.
  - Metadata: `metadataBase` https://getfluxiq.com; title default "FluxIQ — Automate Smarter" with template "%s — FluxIQ"; the verbatim shared description; `alternates.canonical: "/"`.
  - Open Graph: `{ type: "website", siteName: "FluxIQ", url: "/", locale: "en_US" }`. Twitter: `{ card: "summary_large_image", site: "@GetFluxIQ" }`.
  - Title, description, and images are not repeated, because Next copies them into Open Graph and Twitter. I confirmed this by reading `postProcessMetadata` and `inheritFromMetadata` in `node_modules/next/dist/lib/metadata/resolve-metadata.js`.
  - `viewport.themeColor` is `#03001c`.
  - Body: a "Skip to content" link to `#main`, written as `sr-only focus:not-sr-only focus:fixed …` with a cyan focus outline, then `{children}`.
  - The old `body` className was removed because `globals.css` now owns those styles.
  - The description is a constant in `layout.tsx`, because `src/content/` belonged to another worker.
- `scripts/brand-assets.mjs`: ESM and sharp. It reads the two masters by name and writes:
  - `src/app/icon.png` (512) and `src/app/apple-icon.png` (180): palette PNG at quality 95.
  - `src/app/favicon.ico`: a hand-built ICO (6-byte header plus one 16-byte entry at 32×32, 32 bpp, offset 22) that wraps a 32×32 PNG. It replaces Next's default.
  - `src/app/opengraph-image.png` (1200×630): a 1200:630 window that is 0.58 of the master's width wide, centred on the logo and wordmark group at (0.508, 0.449), clamped to the image, then scaled to 1200×630. Every value is a fraction of the master, so the crop works at any master size. The follow-up section below explains the change.
  - `src/app/opengraph-image.alt.txt`: "The FluxIQ logo and wordmark with the tagline Automate Smarter, between blue and purple light waves." It has no trailing newline, because Next's `next-metadata-image-loader.js` reads the file verbatim into `og:image:alt`.
  - `public/brand/fluxiq-logo.webp` (288×288):
    - Beyond the brief: the logo master is opaque on pure black. The script keys black to transparency, taking alpha as the brightest channel and dividing the colour back out.
    - Effect: the logo composites onto `#03001c` with no visible square, and consumers need no `mix-blend` class.
  - The script prints each output's size and exits 1 if any output is over 300 KB.
- `src/app/robots.ts` and `src/app/sitemap.ts`
  - Both are static and use `export const dynamic = "force-static"`. The static-exports guide requires that for route handlers, and it is harmless if metadata routes are already static.
  - robots: allow `/`, with the sitemap at https://getfluxiq.com/sitemap.xml.
  - sitemap: one entry, `https://getfluxiq.com/`, monthly, priority 1. It has no `lastModified`, so every build is identical.
- `src/components/ui/`: one named export per file, each with an exported props type. There is no barrel.
  - `section-heading.tsx`, `SectionHeading({ eyebrow, title, lede?, id? })`:
    - Layout: centred, `max-w-2xl`.
    - Eyebrow: `font-display text-sm font-semibold tracking-widest text-cyan-300 uppercase`.
    - Title: an h2 in `font-display text-3xl sm:text-4xl font-bold text-white`.
    - Lede: `text-slate-400`.
    - `id` goes on the h2, for `aria-labelledby`.
  - `link-button.tsx`, `LinkButton({ href, variant = "primary", external, className?, children })`:
    - Shape: a `rounded-full` pill with `focus-visible:outline-2 outline-offset-4 outline-cyan-300`.
    - `primary`: `bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 text-ink`.
    - `ghost`: `border-white/10 bg-white/5`, hover `bg-white/10`.
    - `external`: adds `target="_blank" rel="noopener noreferrer"` and a `sr-only` " (opens in a new tab)".
    - `className` was added for layout additions only.
  - `reveal.tsx`, `Reveal({ className?, children })`: a server component rendering `<div data-reveal className>`. React emits `data-reveal="true"`, which the attribute selector matches.
  - `github-logo.tsx` and `x-logo.tsx`, `GitHubLogo` and `XLogo({ className? })`: 24×24 viewBox, `fill="currentColor"`, `aria-hidden="true"`, with the Simple Icons paths. I rendered both to PNG and checked that they are the correct marks.
- `docs/architecture/README.md`
  - Layout: added a "What exists in `src/` today" list and corrected the status paragraph.
  - Brand: added the tokens, base styles, motion, the primary button's contrast choice, the `brand:assets` derivatives table, and the regeneration command.
  - Commands: added a `pnpm brand:assets` line.

## Follow-up: OG crop after the master was replaced

The supervisor replaced `design/brand/og-banner-master.png` with a 2056×765 original. The old pixel-constant crop then cut the wordmark. The crop now uses fractions of the master in `scripts/brand-assets.mjs`: `OG_GROUP_CENTRE { x: 0.508, y: 0.449 }` and `OG_WINDOW_WIDTH 0.58`, computed in `openGraphImage()` from `sharp().metadata()`.

- Measurements, the same in both masters:
  - The logo and wordmark group spans x 0.318 to 0.698 and y 0.307 to 0.590. On the 2056 master that is about x 653 to 1434.
  - "Ideas → Action" ends at x 0.20. The right-hand labels start at x 0.85 or later.
- I first tried the method as asked: scale to cover 630 px high (1693 px wide), then centre a 1200 px window on the group. That window is 0.71 of the master's width, runs from x 260, and leaves a stray "CTION" at the left edge. The trial image is in the scratchpad at `og-cover630-trial.png`.
- So the window is narrowed to 0.58 of the width. Its left edge is at 0.218, clear of the label's end at 0.20. It is still centred on the group, and the wordmark and tagline have about 207 px of margin on each side in the output.
- On the 2056 master the crop is about 1192×626 and scales by about 1.006, so it is essentially 1:1 and not upscaled.
- The architecture doc's master size now reads 2056 × 765, and its table row says "cropped by fractions of its size".

## Commands run and observed results

Follow-up run, after the new master:

- `pnpm brand:assets` exited 0. It printed `icon.png: 60.6 KB`, `apple-icon.png: 12.4 KB`, `favicon.ico: 2.4 KB`, `opengraph-image.png: 266.9 KB`, `opengraph-image.alt.txt: 0.1 KB`, and `fluxiq-logo.webp: 51.1 KB`. The OG image is 1200×630.
- Determinism: I took `sha256sum` of all six outputs, ran `pnpm brand:assets` again (exit 0), and ran `sha256sum -c`. All six reported `OK`.
- Visual check: I opened `opengraph-image.png`. The full "FluxIQ" wordmark and "AUTOMATE SMARTER" are inside, horizontally centred, with about 207 px of margin on each side. No part of a corner label shows.
- `node scripts/structure-audit.mjs` printed `structure: passed (35 files)`.
- `pnpm exec biome check src/app src/components scripts/brand-assets.mjs` printed `Checked 11 files in 11ms. No fixes applied.`
- `pnpm exec tsc --noEmit` exited 0 with no output.

First run, before the new master:

- `pnpm brand:assets` exited 0. It printed `icon.png: 60.6 KB`, `apple-icon.png: 12.4 KB`, `favicon.ico: 2.4 KB`, `opengraph-image.png: 274.8 KB`, `opengraph-image.alt.txt: 0.1 KB`, and `fluxiq-logo.webp: 51.1 KB`. Node also prints an `ExperimentalWarning: Importing JSON modules`, which comes from sharp 0.35's ESM entry, not from the script.
- Idempotency: I took `sha256sum` of all six outputs, ran `pnpm brand:assets` a second time, and ran `sha256sum -c`. All six reported `OK`.
- ICO check: I parsed `favicon.ico`. It reported header `0 1 1`, w 32, h 32, bpp 32, size 2425, offset 22, total 2447. The embedded data decodes as a 32×32 PNG.
- Visual checks: I opened every image. `opengraph-image.png` is centred with no clipped labels, and a 3× zoom showed no palette banding. The webp was composited on `#03001c` and showed no square. `icon.png` and `apple-icon.png` look right, and the favicon at 8× is legible.
- `node scripts/structure-audit.mjs` printed `structure: passed (25 files)`. The count includes the other worker's `src/content/`.
- `pnpm exec biome check src/app src/components scripts/brand-assets.mjs` printed `Checked 11 files in 11ms. No fixes applied.`
- `pnpm exec tsc --noEmit` exited 0 with no output. That was after `src/content/` appeared.
- `pnpm test` reported 44 tests, 44 passed, 0 failed.
- Tailwind compile check, run from the scratchpad and not the repository: `@tailwindcss/node` compiled `globals.css` against every class used in `layout.tsx` and `components/ui/`. Every class produced CSS.
  - The two motion utilities come out inside `@media (prefers-reduced-motion: no-preference)`.
  - `[data-reveal]` comes out inside that media query and `@supports (animation-timeline: view())`.
  - `focus:fixed` is emitted after `focus:not-sr-only`, so the skip link is fixed when it is shown.

## Not verified

- `pnpm build` and `next dev` were not run, as the brief requires. So none of these has been observed in a real build:
  - the exported `robots.txt`, `sitemap.xml`, `<head>` tags, `og:image:alt`, and canonical;
  - font self-hosting;
  - that `force-static` is accepted on the metadata routes.
- `pnpm check` was not run either, because it runs `next typegen`. Instead I ran each of its steps except typegen.
- I have not watched the reveal, wave, or pulse animations run in a browser, and I have not checked the reduced-motion path in one.
- I did not measure contrast in a browser. The primary button's ink-on-gradient ratios (about 5.5:1 on `blue-500`, 5.0:1 on `purple-500`, and more on `cyan-400`) are hand calculations from Tailwind 4's colour values.

## Open questions or contradictions found

- Phase 1 step 5 says `reveal.tsx` is a client component. The brief and Decision 3 say it is a server component. I followed the brief. The Phases text is stale.
- I changed the primary button's text to ink, where the live site presumably used white. White text is under 2:1 contrast on the cyan end of the gradient and about 3.8:1 on `blue-500`, which fails WCAG AA at 14 px. If you want white text, the gradient would need changing too, and Accessibility 100 is at risk.
- `node scripts/working-docs-audit.mjs` (read-only) fails with "docs/working/README.md is out of date with the documents' header blocks". It already failed before I wrote anything under `docs/working/`, so it is not caused by this brief. The fix is `pnpm docs:index`, which the supervisor owns.
- The OG crop does not follow the supervisor's exact method (a cover crop at 630 px high), because that method leaves a sliced "CTION" at the left edge. It uses a 0.58-width window with the same centring. If the fragment is acceptable, set `OG_WINDOW_WIDTH` to about 0.71 to get the plain cover crop.
- The OG PNG is 266.9 KB, within 33 KB of the budget. If a future sharp version produces a bigger file, the script will fail loudly, not silently.
- The description is a constant in `layout.tsx`. If `src/content/` exports a site description, you may want to switch `layout.tsx` to import it.
- Contracts for the Phase 3 briefs:
  - Class names: `animate-wave-drift`, `animate-status-pulse`, `font-display`, `font-body`, `bg-ink`, `text-ink`.
  - The status halo goes on an absolutely positioned span behind the dot.
  - The logo `<img>` uses `/brand/fluxiq-logo.webp` at 144 px.
