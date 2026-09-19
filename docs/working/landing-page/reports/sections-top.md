# Report: sections-top

## Outcome

Done. I built `SiteHeader`, `Hero`, and `SiteFooter` to the Phase 3 conventions
and the brief. Biome is clean on the owned directories, the structure audit
passes, and `tsc --noEmit` exits 0 for the whole project. No build was run, so
nothing has been checked visually yet.

## What changed and why

All the files are new. They are all server components with no `"use client"`,
and each file holds one component.

- `src/components/site-header/site-header.tsx` (`SiteHeader`): a sticky header
  (`sticky top-0 z-40 border-b border-white/5 bg-ink/70 backdrop-blur`) with a
  `h-16` inner bar that is `max-w-6xl`.
  - It is a flex row below `md` and a `grid-cols-[1fr_auto_1fr]` grid from
    `md` up, so the nav stays centred whatever the widths of the two ends.
  - On the right is an icon-only GitHub link to `LINKS.coreRepo`. It has
    `target=_blank`, `rel="noopener noreferrer"`, and the `aria-label`
    `"FluxIQ on GitHub (opens in a new tab)"`.
- `site-header/home-link.tsx` (`HomeLink`): a link to `/` that holds a 32 px
  `next/image` of `/brand/fluxiq-logo.webp` (`alt=""`, because the wordmark
  names the link) and `SITE.wordmark`. The accent uses
  `bg-linear-to-r from-cyan-300 via-blue-500 to-purple-500 bg-clip-text
  text-transparent`.
- `site-header/primary-nav.tsx` (`PrimaryNav`): `<nav aria-label="Primary">`
  wrapping a `ul` built from `NAV_ITEMS`, with `hidden md:block`.
- `src/components/hero/hero.tsx` (`Hero`): a
  `section[aria-labelledby=hero-title]` with the classes `relative isolate flex
  min-h-[calc(100dvh-4rem)] flex-col items-center justify-center overflow-x-clip
  px-6 py-24 md:py-20`. Its contents, in order:
  - the 144 px logo (`size-36`, the live site's
    `shadow-[0_0_80px_rgba(59,130,246,0.45)] ring-1 ring-white/10`);
  - the h1 wordmark (`text-6xl sm:text-7xl md:text-8xl`);
  - the uppercase tagline with `tracking-[0.5em]`, and `pl-[0.5em]` to balance
    the trailing letter-spacing;
  - `StatusPill`, then `HERO.lede`, then `HERO.actions` as a `ul` of
    `ActionButton`s (stacked at full width inside `max-w-xs` on mobile, a row
    from `sm` up);
  - `ScrollCue`.
- The hero decoration sits in one `aria-hidden`, `pointer-events-none`, `-z-10`
  layer:
  - `hero/glows.tsx` (`Glows`) holds the live site's three glows, using its
    exact colours and blurs taken from the live bundle. The sizes are written
    in Tailwind 4 (`size-168`, `size-120`).
  - `hero/waves.tsx` (`Waves`) has two layers. Each uses
    `viewBox="0 0 1640 600"` and `preserveAspectRatio="none"`, with a
    cyan→blue→purple `linearGradient` stroke. Each path is drawn twice: a
    1.5 px stroke plus a faint 12 px copy, both with
    `vectorEffect="non-scaling-stroke"`.
    - The top layer (`top-0 h-64 md:h-80`, opacity 70%) draws all three paths.
    - The bottom layer (`bottom-0 h-40 md:h-56 rotate-180`, opacity 50%) draws
      the first two paths, with `[animation-delay:-9s]
      [animation-direction:reverse]`.
    - Each layer carries
      `[mask-image:linear-gradient(to_bottom,black_40%,transparent)]`, so it
      fades out towards the centre. The rotation makes the one mask fade the
      bottom layer upward. This is how the waves are kept clear of the text.
    - Each layer is `inset-x-[-10%]` (120% wide), so the −4% drift never
      shows a line ending.
    - The gradient ids are `hero-wave-top` and `hero-wave-bottom`.
  - `hero/corner-labels.tsx` (`CornerLabels`), shown from `md` up, copies the
    live site's layout.
    - `start` is split on `/` and stacked in the top-right corner over a short
      cyan rule.
    - `end` is split on `→` and set in the bottom-left corner, with the arrow
      in cyan.
    - The text is `text-slate-400`. The live site used `/80`, which the
      convention forbids.
- `hero/status-pill.tsx` (`StatusPill`) shows `SITE.status` with a dot. The
  dot has an absolutely positioned halo that uses `animate-status-pulse`.
  Under reduced motion the halo rests exactly on the dot.
- `hero/scroll-cue.tsx` (`ScrollCue`) is a link with
  `hidden md:inline-flex motion-safe:animate-bounce` and a Lucide `ArrowDown`
  icon. It gets `href` and `aria-label` from `WHY.id` and `WHY.eyebrow`, which
  renders `#why` and "Scroll to Why FluxIQ". The anchor therefore cannot drift
  from the Why section's id.
- `src/components/site-footer/site-footer.tsx` (`SiteFooter`) is a
  `border-t border-white/5` footer.
  - Inside is a `Reveal`-wrapped `max-w-6xl` bar that stacks on mobile and is
    a row from `sm` up.
  - It holds `SITE.copyright` and a `ul` of three `FooterLink`s:
    `LINKS.coreRepo` with the GitHub logo, `LINKS.x` with the X logo, and
    `LINKS.licenseEmail` with Lucide `Mail`.
- `site-footer/footer-link.tsx` (`FooterLink`) is a small `text-sm
  text-slate-400` link with an icon. External links get `target=_blank`,
  `rel="noopener noreferrer"`, and an sr-only "(opens in a new tab)".
- Focus rings: every interactive element has
  `focus-visible:outline-2 focus-visible:outline-cyan-300`, with an offset of
  2 or 4, matching `LinkButton`.
- Part files have no `hero-` prefix, because the structure audit's
  shared-prefix rule would reject three or more of them.

## Commands run and observed results

- `pnpm exec biome check src/components/site-header src/components/hero src/components/site-footer`
  printed `Checked 11 files in 10ms. No fixes applied.` and exited 0. The first
  run found one formatter issue in `site-footer.tsx` (a JSX line was too long).
  I fixed it and re-ran the check.
- `node scripts/structure-audit.mjs` printed `structure: passed (63 files)` and
  exited 0.
- `pnpm exec tsc --noEmit` printed nothing and exited 0. That covers the whole
  project, including the other workers' files as they stood at that moment.
- A scratch check, not part of the brief:
  `node <scratchpad>/sections-top-twcheck.mjs` compiles `src/app/globals.css`
  through `@tailwindcss/node` 4.3.3 and builds each class candidate from the
  owned files on its own. Every Tailwind class produced CSS. The only
  candidates that produced none were 6 strings that are not classes:
  `aria-hidden`, `hero-title`, `lucide-react`, `hero-wave-top`,
  `hero-wave-bottom`, `non-scaling-stroke`. I spot-checked the output:
  - `min-h-[calc(100dvh-4rem)]` → `min-height: calc(100dvh - 4rem)`
  - `inset-x-[-10%]` → `inset-inline: -10%`
  - the mask class → `mask-image: linear-gradient(to bottom,black 40%,transparent)`
  - `not-first:mt-2` → `:not(:first-child)`
  - `animate-wave-drift` and `animate-status-pulse` sit inside
    `prefers-reduced-motion: no-preference`
- Earlier, I downloaded the live bundle (`https://getfluxiq.com/assets/index-CgRsI0DB.js`)
  into the scratchpad. I took from it the exact classes for the glows, the logo
  shadow, the corner labels, the tagline and pill, and the wave stroke
  treatment.

## Not verified

- Nothing has been rendered. No build, no `next dev`, and no screenshots, as
  the brief requires. The wave layer heights and mask stops were tuned on paper
  against estimated content heights at 375×812 and 1440×900.
  - At 1440×900 the hero comes out slightly taller than the viewport, about
    880 px against 836 px, so the scroll cue sits near the fold.
  - On mobile, the peaks of the bottom wave may just reach the last stacked
    button, at about 25% effective opacity.
  - Both points need checking against the supervisor's screenshots.
- It is not verified whether the glows bleeding downward, which I left
  unclipped so there is no hard edge, look right over the Why section.
- `preload` on the hero image has not been checked against the built HTML
  (`<link rel="preload">`).
- `pnpm test:site` has not been run.

## Open questions or contradictions found

1. The brief says `priority` for the hero logo, but Next 16 deprecates it
   (`image.md`: "Starting with Next.js 16, the `priority` property has been
   deprecated in favor of the `preload` property"). I used `preload`.
2. Both logos use `alt=""`, because the wordmark text right beside them names
   the brand, and a meaningful alt would make screen readers say "FluxIQ"
   twice. The live site used `alt="FluxIQ logo"`. Site-check only requires the
   attribute to be present.
3. Some copy is in components rather than content:
   - The "Scroll to " prefix and the "(opens in a new tab)" suffixes are
     hard-coded. `HeroContent` has no field for a scroll label, and I do not
     own `src/content/`. `LinkButton` already hard-codes the same suffix.
   - `CornerLabels` splits `cornerLabels.start` on `/` and `end` on `→` to
     reproduce the live layout. Any string without those separators still
     renders whole.
4. The brief's `motion-safe:animate-bounce` falls outside the convention that
   "the only animations are wave-drift and status-pulse". I followed the brief.
5. The brief says `viewBox="0 0 1640 600"`, but the live site used
   `0 0 1600 500` on a `320vw` layer. I followed the brief.
