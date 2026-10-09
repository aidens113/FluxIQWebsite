# Worker E report: Paper, Status, closing call to action

## Files

- `src/content/paper.ts` (replaced): new local types `PaperImage`, `PaperSection`, `PaperContent`. Keeps `title`, `edition`, `format`, `link` (LINKS.paper), `cover`, `banner` (the hero's `PaperBanner` still reads `banner` and `link`). Adds `pageCount`, `coverLabel`, `heading {lead, muted}`, and six `sections` (num, board title, PDF page, image with alt). Dropped the unused `summary`, `quote`, and long `contents` lines (the v5 boards show neither). Source comment kept and extended.
- `src/content/status.ts` (replaced): local types `StatusIconName`, `StatusItem`, `StatusContent`. Board copy, desktop `body` and phone `short`, under the original source comment. The license item links `LINKS.license` relabelled "Read it"; `repo` is `LINKS.coreRepo` relabelled "View on GitHub". Dropped the old lede (not on the boards).
- `src/content/closing-cta.ts` (new): `ClosingCtaContent`; heading, lede, actions (coreRepo as "Get the framework" primary, LINKS.paper ghost).
- `src/components/paper/paper.tsx` (server): PageSection; passes the eyebrow and heading (`intro`) and the button and format line (`actions`) into the card.
- `src/components/paper/paper-card.tsx` (the only client component): `useLoopClock(250)`, page index `floor(tick / 12) % 7` (3 s per page), page label, the phone's section line (`md:hidden`), layout.
- `src/components/paper/page-stack.tsx`: the seven stacked images; tilt for image j of 7 is `translateX(-12 + 24·j/6 px) rotate(-6 + 12·j/6 deg)`; only opacity transitions (0.8 s). Desktop back card as on the board. Hidden pages get `aria-hidden`.
- `src/components/paper/contents-list.tsx`: the 01–06 list, from `md` up (2 columns from `lg`), current item `bg-amber-row` with an amber inset edge.
- `src/components/status/status.tsx`, `status-icon.tsx`: one `<ul>` that is an icon list below `md` and tiles (2 columns at `md`, 4 at `lg`); static SVG icons (install, key, machine with green bar, license).
- `src/components/closing-cta/closing-cta.tsx`: full-width `<section>` with `border-y border-amber-edge`, a static amber-wash/ink gradient, heading, lede (from `md`), buttons stacked full width on the phone.
- `public/papers/pages/` (new), each 640 × 829 webp (pdftoppm 640 px wide, ImageMagick quality 82):
  - `page-02-core-thesis.webp` 25,646 B
  - `page-03-what-exists-today.webp` 20,992 B
  - `page-04-current-architecture.webp` 17,442 B
  - `page-07-verification.webp` 14,544 B
  - `page-09-economics.webp` 14,796 B
  - `page-10-generated-applications.webp` 19,628 B

## Decisions and deviations

- Clock: the shared hook at `stepMs = 250` instead of 50 ms, so the card re-renders 4×/s, not 20×; the board's paper story is on 250 ms ticks anyway.
- Fluid layout: card columns 280 px at `md`, 320 px at `lg` (the board's 320 px leaves too little text width at 768 px). The page stack keeps the board's fixed pixel sizes (244 × 316 desktop, 176 × 228 phone).
- Headings use `SectionTitle` (clamp 30–44 px), not the board's 42 px / 26 px paper sizes. The closing CTA has its own `h2` with the same classes.
- No drift animation on the CTA band (brief: soft gradient; a keyframe would need `globals.css`, which I do not own).
- Phone Status: the board has no GitHub button or license link on the phone; I kept both (brief: keep the button), the button full width below the list. The arrow in "View on GitHub →" is dropped; the license link has a decorative trailing arrow.
- Colours: the highlight uses token `amber-row` (#1a1710) for the board's #1f1b10; the desktop back card keeps the board's #1c1d21 as an arbitrary value.
- Renamed the helper files to `page-stack.tsx` and `contents-list.tsx`: three `paper-` files tripped the shared-prefix rule.

## Claims

- Page alt text is written from each page's own text (`pdftotext`). Page 10's alt says it is direction, not the current product, as the page does.
- Flag for the supervisor: the CTA lede "…and keep your data" is board copy. FluxIQ runs locally, but AI calls go to the user's DeepSeek key, so "keep your data" may overstate. Consider confirming or softening.
- Old `PaperContent`, `StatusContent`, `StatusRow` in `src/content/types.ts` are now unused (supervisor's cleanup).

## Verified

- `pnpm exec biome check` on all my paths: clean.
- `pnpm exec tsc --noEmit`: no errors in my paths (errors remain in how-it-works, parts, why-fluxiq, other workers' paths).
- `node scripts/structure-audit.mjs`: no findings in my paths or `public/`.
- Images: sizes above, all far under 300 KB; viewed page 9 to confirm the render.

## Not verified

- No build, dev, or browser run (per brief): the crossfade, tilts, phone/desktop layouts, contrast, and no sideways scroll at 375 px are unchecked. `ClosingCta` is not wired into `src/app/page.tsx` (supervisor).
