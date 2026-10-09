# Worker A report: Why section ("What it saves you")

## Files changed

- `src/content/why.ts`: rewritten. It holds the board copy and defines `WhyContent`, `WhyPoint`, and `WhyIcon`. The source comments are kept and extended with the chart's assumed prices.
- `src/components/why-fluxiq/why-fluxiq.tsx`: rewritten. It is a server component that uses `PageSection` (id `why`, labelled by `why-title`) and `SectionTitle`. It renders the eyebrow, the headline with a muted half, and the lede: the full lede from `md` up, the short one below.
- `src/components/why-fluxiq/savings/card.tsx` (new, client, `SavingsCard`): runs `useLoopClock`. It shows the "Example, not real data" pill, "Learning the job" or "You've saved", the counter (48 px on a phone, 60 px from `md` up), and "over N runs of one job". From `md` up the agent and FluxIQ totals are bars in a column beside the chart (240 px from `lg`, 200 px at `md`). Below `md` the totals share one line under the chart.
- `src/components/why-fluxiq/savings/chart.tsx` (new, `SavingsChart`): draws the header and keys, the plot, and the axis labels.
- `src/components/why-fluxiq/savings/model.ts` (new, pure): the model, the paths, and `savingsFrame(tick)`.
- `src/components/why-fluxiq/value-icon.tsx` (new, `ValueIcon`): the four static icons (coin, gauge, shield check, sliders) from the boards, in the amber square: 34 px on a phone, 40 px from `md` up.
- `src/components/why-fluxiq/value-points.tsx` (new, `ValuePoints`): an icon list with the short copy below `md`. Tiles from `md` up: 2 columns at `md`, 4 from `lg`.

## Decisions

- **Chart.** It is drawn in one viewBox, `0 0 740 206`, with `preserveAspectRatio="none"`. The box is 146 px tall below `md` and 206 px from `md` up, which matches both boards' plot heights to within about 2 px. Every stroke uses `vector-effect="non-scaling-stroke"`. The curve is 2.6 px on a phone and 3 px from `md` up.
- **Glow.** The amber glow is a CSS `drop-shadow` on the curve's own outer `<svg>`, so the stretched viewBox does not distort it. The green gap is in a separate SVG without the glow.
- **Paths.** They are computed once, at module load, from avg(r) = (0.10 + 0.00016·r)/r, YMAX 0.12, a plot height of 200 with 8 units of headroom, a log x axis from 1 to 1,000 runs, and 150 samples. The output matches the board's path strings exactly: the curve starts `M0.0 39.7 L4.9 46.9`, the gap `M74.6 120.0 L740.0 120.0 L740.0 199.6`, and the agent line is at y = 120. The gap starts at the crossing, r = 0.10/(0.05 − 0.00016) ≈ 2.006.
- **Reveal.** The line is revealed with `clip-path: inset(-10px <100−x>% -10px 0)` on a wrapper the size of the plot. The clip edge is exactly the dot's x, with no +6. The 10 px above and below keep the glow, which takes the place of the board's top:-10px box with a 10 px margin. The dot's `left`/`top` and the clip both transition over 0.05 s linear. Neither transitions on the reset tick.
- **Dot and notes.** The dot is a `box-border` 14 px span with −7 px margins, placed at `left: x%` and `top: y/206 %`. The notes are placed in percentages taken from each board's pixel positions (phone positions below `md`). "Cheaper from run 3" shows from run 3, "You keep the difference" from run 40, and everything fades out from tick 178.
- **Timing.** The 50 ms clock runs a cycle of 190 ticks, with an ease-in-out sweep over 140 ticks and a hold until 178, as on the board.
- **Assistive tech.** The animated numbers and the chart are `aria-hidden`. An `sr-only` sentence in the content gives the final figures and says it is an example. Its figures ($50.00, $0.26, $49.74, cheaper from run 3) were checked against `savingsFrame`.
- **The "$0.05 every run" label.** It shows from `md` up only, as on the boards: the phone board has no such label.
- **File layout.** The three `savings-*` files tripped the shared-prefix audit, so they live in `savings/` as `card.tsx`, `chart.tsx`, and `model.ts`.
- **Colours.** Tokens are used where one exists. A few board colours with no token are written as literal values: #80848e (the agent line), #1a1b1f (the pills and bar tracks), #1d1f23 (the gridlines), #4a4d55 (the agent bar), and #131416 (the card gradient top).

## For the supervisor (outside my files)

- `src/content/types.ts`: `WhyContent` there is now unused, since why.ts defines its own. `Point` and `src/components/ui/point-grid.tsx` may now be unused too, if no other section uses them. why.ts still imports `HomeSectionId` from types.ts.
- `src/app/page.tsx`: the import of `WhyFluxIQ` from `@/components/why-fluxiq/why-fluxiq` is unchanged.

## Verified

- `pnpm exec biome check src/components/why-fluxiq src/content/why.ts` is clean.
- `pnpm exec tsc --noEmit` reports no errors in my paths. Errors in other workers' paths were filtered out, and none were shown in mine.
- `node scripts/structure-audit.mjs` reports no findings for why-fluxiq. The shared-prefix finding was fixed.
- The model, run under Node:
  - tick 140 gives 1,000 runs, agent $50.00, FluxIQ $0.26, saved $49.74;
  - tick 0 gives run 1 with "Learning the job";
  - the first non-negative saving is at run 3;
  - the paths are identical to the board's.

## Not verified

- No `pnpm build`, dev server, or browser run, per the brief. Not checked:
  - layout at 375 and 1440 px;
  - that the dot sits on the line in a real browser;
  - the transitions for `clip-path` (including Safari);
  - the drop-shadow glow and the gap fill under the stretched viewBox;
  - the card at `md` (768 px) with the 200 px column;
  - no sideways scroll on a phone.
- The copy is the boards' copy. I did not re-check it against the Core repository. The existing source comments, Core f6ef9f4, were carried over.
