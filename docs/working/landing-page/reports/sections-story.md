# Report: sections-story

## Outcome

Done. `WhyFluxIQ` and `HowItWorks` are built to the Phase 3 conventions. The
checks the conventions name pass for the owned directories.

## What changed and why

- `src/components/why-fluxiq/why-fluxiq.tsx` (`WhyFluxIQ`): the conventions'
  section root, `SectionHeading` with `id="why-title"`, then `WHY.cards` as a
  `ul` grid (`grid gap-6 md:grid-cols-3`). Each `li` wraps its card in
  `Reveal className="h-full"`, so the three cards are the same height.
- `src/components/why-fluxiq/why-card.tsx` (`WhyCard`): the conventions' card,
  cyan-to-blue icon tile, h3, and body classes, used exactly as written.
- `src/components/how-it-works/how-it-works.tsx` (`HowItWorks`): the section
  root and heading, then a `relative mx-auto mt-16 max-w-3xl` wrapper that holds
  the rail and the `ol`. The rail (`w-px bg-linear-to-b from-cyan-400/60
  via-purple-500/50 to-fuchsia-500/40`, `aria-hidden`) is a sibling of the
  `ol`, not a child, because an `ol` may only contain `li` elements. It starts
  at `top-10`, under the first dot, and runs to the bottom.
- `src/components/how-it-works/timeline-step.tsx` (`TimelineStep`, props
  `step: Card` and `index: number`): each `li` has a 24 px dot column and the
  step card. The dot is `size-3 rounded-full bg-linear-to-br ring-4 ring-ink`
  with the step's accent. The card holds the icon tile, the number from "01"
  to "04" (`padStart`), the h3, and the body.
  - Accents by index are full static class strings in a local `ACCENTS`
    tuple: cyan→blue, blue→purple, purple→fuchsia, fuchsia→cyan. The dot and
    the tile share the gradient, and the tile's shadow tint follows it.
  - The number uses the 300 shade of the accent's first stop (cyan, blue,
    purple, fuchsia), not gradient text. Gradient text would reach blue-600,
    at about 3.9:1 on ink, below 4.5:1. The number is `aria-hidden`, because
    the `ol` already announces the position.
  - Alignment: the dot column has `pt-10` (40 px) and the dot is 12 px, so its
    centre is at 46 px. That equals the card padding (24 px) plus half the
    tile (22 px). The tile row is `items-start`, so a title that wraps at
    375 px cannot move the tile away from the dot. The rail is at `left-3
    -translate-x-1/2`, the centre of the 24 px dot column.
- Every card and each `SectionHeading` is wrapped in `Reveal`, following "any
  block shorter than a screen". The dot and rail sit outside `Reveal` and stay
  still. No `"use client"`, no copy is hard-coded, no transform transitions,
  and no animations other than the `[data-reveal]` rule.

## Commands run and observed results

- `pnpm exec biome check src/components/why-fluxiq src/components/how-it-works`
  printed "Checked 4 files in 7ms. No fixes applied." and exited 0.
- `node scripts/structure-audit.mjs` printed "structure: passed (42 files)"
  and exited 0.
- `pnpm exec tsc --noEmit` exited 2. All seven errors are TS2307 in
  `src/app/page.tsx`, about the modules for developers, features, follow,
  hero, licensing, site-footer, and site-header, which other workers are
  building. `grep -cE 'src/components/(why-fluxiq|how-it-works)/'` on the tsc
  output returned 0. `page.tsx` lines 5 and 10 import `HowItWorks` and
  `WhyFluxIQ` from these paths, and neither import errors.

## Not verified

- Nothing was rendered. Per the brief, no `pnpm build`, `next dev`, or
  screenshots were run. The dot-to-tile alignment and the rail position come
  from class arithmetic, not from a rendered check at 375 or 1440 px.
- Colour contrast values are estimates from Tailwind 4 palette values, not
  measured.

## Open questions or contradictions found

- Wrapping `SectionHeading` in `Reveal` is my reading of "any block shorter
  than a screen". If the other section workers did not wrap their headings,
  the supervisor may want to align them one way or the other.
- The conventions' card classes use `bg-white/[0.03]`. The Live Site Inventory
  records `bg-white/5`. I followed the conventions.
