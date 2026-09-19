# Report: sections-closing

## Outcome

Done. `Roadmap`, `Licensing`, and `Follow` are built as server components to the
Phase 3 conventions. Biome, the structure audit, and tsc are clean for the owned
directories.

## What changed and why

New files, all server components with no `"use client"`, one component per file:

- `src/components/roadmap/roadmap.tsx` (`Roadmap`, from `ROADMAP`)
  - Uses the standard section root and `SectionHeading` with `id="roadmap-title"`.
  - Lays the columns out in a `mt-16 grid gap-6 lg:grid-cols-3`, with each column card wrapped in `Reveal`.
- `src/components/roadmap/roadmap-column-card.tsx` (`RoadmapColumnCard`)
  - Uses the standard card classes plus `relative h-full`, so the cards in a row are the same height.
  - Header: an accent-tinted icon tile (`size-11 rounded-xl ring-1 ring-inset`, with the Lucide icon at `size-5`, `strokeWidth={2}`, `aria-hidden`), then the h3 status title, then an item-count pill.
  - Below the header, a `ul` of items. Each item has an accent dot, a title (`text-sm font-medium text-white`), and a detail (`text-sm text-slate-400`).
  - Accent map: shipped `cyan-300`, in-progress `purple-300`, planned `slate-300`. It colours the icon, the count, the item dots, and a thin gradient rule along the card's top edge.
  - Status is never shown by colour alone, because the h3 names it.
  - The count pill is `aria-hidden`, because screen readers already announce the `ul`'s item count. This also keeps copy out of the component: no hard-coded "items" word.
- `src/components/licensing/licensing.tsx` (`Licensing`, from `LICENSING`)
  - Uses the section root and `SectionHeading`, with `id="license-title"`.
  - The two list cards sit in a `mx-auto max-w-4xl grid md:grid-cols-2`, so they are side by side from `md` up. Each card is wrapped in `Reveal`.
  - Below the cards, one `Reveal` block holds the centred `disclaimer` (`text-sm text-slate-400`), then the `actions` as `ActionButton`s.
- `src/components/licensing/license-list-card.tsx` (`LicenseListCard`)
  - Takes `list: LicenseList` and `accent: "cyan" | "purple"`.
  - Free-for uses a cyan icon (`text-cyan-300` on a cyan tint). Needs-agreement uses a purple icon (`text-purple-300` on a purple tint).
  - Below the h3, a `ul` of items with accent dots. The item text is `text-slate-300`: brighter than the `slate-400` floor, because these items are the section's main content.
- `src/components/follow/follow.tsx` (`Follow`, from `FOLLOW`)
  - The section root holds one `Reveal` containing:
    - A decorative glow: `aria-hidden`, `pointer-events-none`, `absolute -inset-4`, a cyan/blue/purple `/20` linear gradient, `blur-3xl`.
    - The card: `relative rounded-3xl border border-white/10 bg-ink/75`, holding the centred `SectionHeading` (`id="follow-title"`) and the `actions`.
  - The glow comes first in the DOM, so the card paints over it without a negative z-index. A negative z-index could slip behind an ancestor's background.
  - The glow extends 16 px past the card, which is less than the section's 24 px side padding, so it cannot cause horizontal scroll at 375 px.

Design choice on icon tiles: the convention's cyan-to-blue gradient tile has a white icon. The brief instead asks for status accents and cyan/purple icons, so these sections use a tinted tile with the icon in the accent colour. The tile has the same size and radius as the convention's.

All copy comes from `@/content/*`. The only colours are Tailwind classes in the components. No animations are used beyond `Reveal`, and there are no transform transitions.

## Commands run and observed results

- `pnpm exec biome check src/components/roadmap src/components/licensing src/components/follow` printed `Checked 5 files in 7ms. No fixes applied.` and exited 0.
- `node scripts/structure-audit.mjs` printed `structure: passed (45 files)` and exited 0.
- `pnpm exec tsc --noEmit` exited 2 with five errors, all TS2307 in `src/app/page.tsx`. Each is a missing module owned by another worker: `developers/developers`, `features/features`, `hero/hero`, `site-footer/site-footer`, and `site-header/site-header`.
  - A second run filtered for `components/(roadmap|licensing|follow)` matched nothing.
  - `page.tsx` imports `Follow`, `Licensing`, and `Roadmap` from `@/components/{follow,licensing,roadmap}/…`. Those names match the exports.

## Not verified

- No build, dev server, or screenshots, as the brief directs. Visual balance is unchecked at 375 and 1440 px. That covers the glow's strength behind the Follow card, the relative heights of the Roadmap cards (9, 4, and 3 items), and the tinted icon tiles next to the gradient tiles in other sections.
- Whether Tailwind generates `bg-white/[0.03]` and `bg-ink/75` as expected is unconfirmed without a build.
- Screen-reader output is untested. That includes the item count announced for the Roadmap lists in place of the hidden count pill.

## Open questions or contradictions found

- "Free-for with a cyan icon, needs-agreement with a purple icon" could mean either gradient tiles or accent-coloured icons. I chose accent-coloured icons on tinted tiles, to match the Roadmap accents. Swapping to gradient tiles is a class change in `license-list-card.tsx`.
- The licence list items use `text-slate-300`, where the card body convention is `slate-400`. This is allowed ("never dimmer than slate-400") but is a deliberate step up. It is a one-class revert if the supervisor prefers strict `slate-400`.
