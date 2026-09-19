# Report: sections-product

## Follow-up: 375 px clipping and feature column count

### Outcome

Done. All three follow-up items are handled. All five checks pass, and I
measured the built page at 375 and 1440 px.

### What changed and why

1. **Developers clipping at 375 px.** The cause was the grid's minimum
   column width.
   - **What went wrong.** Below `lg`, both grids in Developers had no
     explicit columns. That gives one implicit `auto` track.
   - Each grid item (the `Reveal` div) kept the default `min-width: auto`.
     So its minimum width was its min-content width.
   - The `<pre>` is `w-max`, so that min-content width was its longest line:
     about 447 to 512 px. This widened the track past the 327 px content box
     and clipped everything in the column, including the package list,
     which shares a track with the build window.
   - **Fix in `developers.tsx`.** Both grids get `grid-cols-1`, which is
     `repeat(1, minmax(0, 1fr))`, so the track minimum is 0. Every grid
     item gets `className="min-w-0"`. A comment in the code records why.
   - **Fix in `code-window.tsx`.** The `figure`, the window `div`, and the
     scroll `section` get `min-w-0 max-w-full`. The `<pre>` keeps
     `w-max min-w-full`, so it overflows only inside its own
     `overflow-x-auto` region.
   - `PackageList` names were already `break-all`, so they were never the
     cause. They were clipped only because they share a track with the
     build window.
2. **Feature column count.** `feature-group.tsx` has a new function,
   `largeColumns(count)`. It returns `lg:grid-cols-3` when the count is
   divisible by 3, and `lg:grid-cols-2` otherwise.
   - Both class names appear as literal strings in the source, so Tailwind
     generates them.
   - The grid is now `grid grid-cols-1 gap-6 sm:grid-cols-2 ${largeColumns(items.length)}`.
3. **Supervisor edits.** I left alone the `py-16 sm:py-24` section roots and
   the Flow sample's two-line import.

### How item 1 was confirmed

I measured it in the built output, not only by reasoning about it.

- **Harness.** `scratchpad/sections-product-measure.cjs` is outside the
  repository. It serves `out/` with a small Node HTTP server. It drives
  Chrome through playwright-core 1.51.1 from
  `F:\!FluxIQWebExtension\node_modules\.pnpm`, with reduced motion.
- **What it measured, per section and viewport.**
  - Every element outside the code regions must stay within the section's
    content box. The content box is the section's rectangle minus its
    padding.
  - Each grid's computed `grid-template-columns`.
  - Each code region's `clientWidth` against its `scrollWidth`.
  - The `clientWidth` and `scrollWidth` of each caption and package
    summary.
- **At 375 px.**
  - The document `scrollWidth` is 375. The content box runs from 24 to
    351 px.
  - No element in `#developers` or `#features` goes outside it.
  - Both Developers grids resolve to `327px`, the content width.
  - Code regions:

    | Region | clientWidth | scrollWidth | Right edge |
    | --- | --- | --- | --- |
    | `setup.ts` | 325 | 447 | 350 px |
    | `compile-flow.ts` | 325 | 512 | 350 px |
    | build (`terminal`) | 325 | 441 | 350 px |

    So each window scrolls inside itself.
  - Captions are 327 px wide, and package summaries are 285 px. In every
    one, `scrollWidth` equals `clientWidth`, so none is clipped.
- **At 1440 px.**
  - Both Developers grids are `540px 540px`.
  - The code regions are 538/538, so they no longer scroll now that the
    import is split.
  - Features Core (9 items) is `352px 352px 352px`. The Web Extension
    (2 items) is `540px 540px`.
  - No element goes outside its section.
- **Screenshots.** I looked at `sections-product-developers-375.png` and
  `sections-product-features-1440.png` in the scratchpad.
  - At 375 px the windows cut off at their own right edge, and all text
    wraps inside the column.
  - At 1440 px Core shows three full rows, and the Web Extension shows two
    cards filling one row.
  - The sticky header appears partway down these screenshots. That comes
    from capturing a single element; it is not a layout issue.

### Commands run and observed results

- `pnpm exec biome check src/components/features src/components/developers`
  printed `Checked 7 files in 9ms. No fixes applied.` with no diagnostics.
- `node scripts/structure-audit.mjs` printed `structure: passed (63 files)`
  and exited 0.
- `pnpm exec tsc --noEmit` exited 0 with no output.
- `pnpm build` printed `✓ Compiled successfully`. It prerendered `/`,
  `/_not-found`, the icons, `opengraph-image.png`, `robots.txt`, and
  `sitemap.xml` as static content, and exited 0.
- `pnpm test:site` printed `site-check: passed (136.9 KB gzip JS)` and
  exited 0.
- `node scratchpad/sections-product-measure.cjs` gave the measurements
  above.

### Not verified

- I measured only 375 and 1440 px, not the widths between them, such as
  `sm` at 640 and `lg` at 1024.
- I did not check real keyboard focus and scrolling of the code regions.
- I checked reduced motion only. The `Reveal` animation path was not
  exercised.

### Open questions or contradictions found

- For card counts that are neither divisible by 3 nor even, such as 5 or 7,
  the 2-column rule still leaves one card alone on the last row at `lg`.
  That matches the supervisor's rule. Only 9 and 2 are in use today.

---

## Original pass

### Outcome

Done. `Features` and `Developers` are built as server components to the
Phase 3 conventions. All three validation checks pass for the owned files.
Nothing was built or rendered. That is the supervisor's job at integration.

### What changed and why

`src/components/features/`
- `features.tsx` (`Features`): the conventions' section root, then
  `SectionHeading` inside `Reveal`, then one `FeatureGroup` per `FEATURES.groups`
  entry, with `space-y-20` between groups.
- `feature-group.tsx` (`FeatureGroup`): the label row is an h3 pill with the
  group title, followed by the `h-px flex-1 bg-linear-to-r from-white/15 to-transparent`
  rule. The summary comes next, and the label row and summary share one `Reveal`.
  Then comes a `ul` card grid (`sm:grid-cols-2 lg:grid-cols-3`), and last the
  optional `note` in `text-xs text-slate-400`, also inside a `Reveal`. The pill
  accent depends on the group: Core is cyan-300 and Web Extension is purple-300.
  The mapping is a `Record` keyed on `FeatureGroup["id"]`, so it covers every
  group. Each pill's text names its group, so colour is never the only signal.
  The content type `FeatureGroup` is imported as `FeatureGroupContent` so the
  component can keep the name AGENTS.md requires.
- `feature-card.tsx` (`FeatureCard`): the conventions' card classes, icon tile,
  and body. The card itself is the `Reveal` element, with `h-full` so cards in
  a row match heights.

`src/components/developers/`
- `developers.tsx` (`Developers`): in order:
  1. The heading and chips, in one `Reveal`.
  2. The two `samples` in a `lg:grid-cols-2` grid. The windows stretch to equal
     heights, so the captions line up.
  3. A second `lg:grid-cols-2` row: `PackageList` beside the compact `build` window.
  4. The `action` as an `ActionButton`, centred.
- `release-chips.tsx` (`ReleaseChips`): a `ul` of chips. The `release` label
  is an amber "attention" pill with a dot. Each `requirement` is a neutral mono
  chip.
- `package-list.tsx` (`PackageList`): a bordered `ul` with one row per package.
  Each row has the mono name, a cyan `v{version}` badge, and the summary.
- `code-window.tsx` (`CodeWindow`, with a `compact` prop): a `figure` built in
  three parts:
  - A title bar with three `aria-hidden` dots and the `filename`.
  - A scroll region holding `<pre><code>` in `font-mono`. It is
    `text-[13px] leading-6`, or `text-xs leading-5` when compact.
  - A `figcaption` holding the sample `title` as an h3, then the `caption`.

  The only highlighting is dependency-free: whole-line comments (`//` for ts,
  `#` for sh) are dimmed to `slate-400` italic. The splitter returns runs keyed
  by their first line number, so no key uses an array index.

Deviations from the letter of the brief, with reasons:
1. **Code region element.** The brief asked for `role="region"`. Biome's
   recommended `a11y/useSemanticElements` rejects that and asks for `<section>`.
   The scroll container is therefore a named `<section>`, which has the region
   role implicitly, with `tabIndex={0}` and
   `aria-label={`${title} (${filename})`}`. The `<pre>` sits inside it as
   `w-max min-w-full`, so the right padding survives horizontal scroll.
   Biome's `a11y/noNoninteractiveTabindex` still fires on `tabIndex`. It has
   one inline `biome-ignore`, whose reason cites WCAG 2.1.1 and axe's
   `scrollable-region-focusable`. The focus ring is an inset outline
   (`-outline-offset-2`), so the rounded window never clips it.
2. **Heading levels in Features.** The group label is an h3, so the card
   titles are **h4**, not h3. This keeps the outline h2 → h3 → h4 without a
   skip, and gives screen-reader heading navigation the grouping. The card
   title classes are the conventions' h3 classes. The other sections' cards
   stay h3 because they sit directly under an h2.
3. **Sample titles** (`CodeSample.title`), which the brief did not place, are
   shown as h3s in each `figcaption`, above the caption. They also name the
   scroll region. In Developers the outline is h2 → three h3s.
4. **The `v` prefix on version badges** is the only literal text in these
   components. It is formatting, not copy.

### Commands run and observed results

- `pnpm exec biome check src/components/features src/components/developers`
  (run last, after the final edit): `Checked 7 files in 8ms. No fixes applied.`
  and no diagnostics. The first run reported the two a11y rules above, which
  deviation 1 resolves.
- `node scripts/structure-audit.mjs`: `structure: passed (52 files)`, exit 0.
- `pnpm exec tsc --noEmit`: exit 2. There are three errors, all in
  `src/app/page.tsx`: TS2307 for `@/components/hero/hero`,
  `@/components/site-footer/site-footer`, and
  `@/components/site-header/site-header`, which are the sections-top worker's
  modules and did not exist yet. `tsc ... | grep -cE 'components/(features|developers)'`
  printed `0`. `page.tsx` already imports `Developers` and `Features` from the
  paths and names I exported, and they resolve.
- Scratch check (`scratchpad/sections-product-runs.mjs`, outside the repository)
  of the comment-run splitter against the three samples in `developers.ts`:
  - `SETUP_SAMPLE`: 8 lines, 5 runs, 2 comment runs.
  - `FLOW_SAMPLE`: 20 lines, 3 runs, 1 comment run.
  - `BUILD_SAMPLE`: 4 lines, 1 run, 0 comment runs.
  - All three rebuild the original text exactly, and all keys are unique.
  - Longest lines: 57, 81, and 62 characters.
- File lengths: 23 to 79 lines each, 264 in total.

### Not verified

- No render, build, or screenshot, because the brief forbids them. The layout
  was not checked at 375 or 1440 px: equal-height sample windows, pill wrapping,
  and horizontal scroll are unconfirmed.
- The 81-character import line in `compile-flow.ts`, and probably
  `const result = …` at 66 characters, will scroll horizontally inside a
  half-width window from `lg` up. That is expected (the brief asks for
  horizontal scroll), but it should be looked at in the screenshots.
- The scroll-driven `Reveal` behaviour and the inset focus ring on the code
  regions were not seen in a browser.
- Contrast of amber-200 text on `amber-300/10` over ink was not measured. It
  should be well above 4.5:1, as should cyan-300 and purple-300 on their 10%
  tints.

### Open questions or contradictions found

- The brief says `role="region"`, and Biome recommended rejects it in favour of
  `<section>`. I chose the semantic element plus one justified suppression
  (deviation 1). If the supervisor prefers the literal `role="region"` on
  `<pre>`, that needs a second `biome-ignore` for `useSemanticElements`.
- The conventions say "Card title: h3". Under a grouped layout that conflicts
  with the no-skip heading rule, and I resolved it as h4 (deviation 2). Other
  grouped sections may want the same rule, if any exist.
- The attention pill uses amber, which is outside the cyan, blue, purple, and
  fuchsia palette, because it carries meaning ("pending"). If the palette must
  stay closed, swap it for fuchsia in `release-chips.tsx`.
