# Report: H

## Outcome

Done. How it works now follows canvas concept B (HowB / HowBMobile): headline and lede, part 1 "Three sentences. Three jobs that keep running." (three request-over-Flow cards), part 2 the overnight-redesign split, and four benefits. All four checks pass, and Playwright at 375 and 1440 px found no overflow and no page errors. Nothing was committed.

## What changed and why

- `src/content/how-it-works.ts`: rewritten for concept B. It holds the copy, types, and a sources comment. The claim list is kept: a Flow; runs on a schedule; anything that sends, buys, or deletes waits for your OK; a site change is found and fixed for $0.05, and the fix is kept only after a full run passes; checks taper from about $0.01 for a judged run to $0.00 for a trusted one. Nothing says runs are free. Phone short forms are `HowPhrase` `{ full, short }` values.
- `how-it-works.tsx`: the `PageSection`, `id`, `SectionTitle`, and eyebrow classes are unchanged. It now renders `RunningJobs`, `RedesignSplit`, and `BenefitPoints`.
- `jobs/frame.ts` holds the pure functions `deskJobs` and `phoneJobs`. `jobs/job-card.tsx` and `jobs/running-jobs.tsx` render the cards.
  - The clock is `useLoopClock(50, false, false)`, so it never restarts. Run counts come from the total tick and only climb.
  - From `lg` up, the three cards sit side by side with offset periods. Below `lg`, one card shows at a time with a crossfade (cards stacked in one grid cell, so there is no fixed height) and pips underneath.
- Listing flaw fixed: the results come in groups of three, one group per listing (14 Elm Ave, 302 Bow Cres, 9 Ridge Rd). Within a listing the price only falls. After the alert, a different listing fades in (the result box is keyed and fades in with Tailwind `starting:opacity-0`).
- `redesign/frame.ts` holds the pure function `redesignFrame`, a 260-tick cycle taken from the board. It is rendered by `redesign/redesign-split.tsx`, `redesign/outcome-card.tsx`, and `redesign/site-sketch.tsx`. Its clock restarts on scroll-in, so each viewing begins on Tuesday. The two sides sit side by side from `md` up. The sheet rows show from `md` up, as on the boards.
- Shared files: `part-title.tsx`, `status-pill.tsx`, `fit-text.tsx`, `benefit-points.tsx`, `benefit-icon.tsx`. The benefits use the `value-points` tile and list pattern.
- Each illustration is wrapped in `aria-hidden` and has an `sr-only` description. The headline, part titles (h3), and benefits are real text. Text always appears whole and is never typed out.
- Deleted: `timeline.ts`, `chat.css`, and 11 old components (ask-card, chat-window, fix-card, flow-story, fluxiq-message, plan-card, record-card, run-card, stage-list, stage-progress, user-bubble).
- The red failure colour (#fa6571) has no token, so it is an arbitrary value, as elsewhere in `src`.

## Commands run and observed results

- `pnpm check`: exit 0. The structure audit passed (161 files), as did the working-docs audit, Biome (after `biome check --write` on my files), and tsc.
- `pnpm test`: exit 0, 0 failures.
- `pnpm build`: succeeded. `pnpm test:site`: passed (179.1 KB gzip JS).
- Playwright against `PORT=4400 pnpm preview`:
  - At 375 and 1440 px: `scrollWidth` equals the viewport width, and no element inside `#how-it-works` crosses the viewport edge (checked during part 1 and part 2). The same element check passed at 768 and 1024 px.
  - No `pageerror`. The only console error is the blocked Google Analytics request through the sandbox proxy.
  - Screenshots in `<scratchpad>/shots/`: part 1 at two moments, part 2 in each state (Tuesday, looking, testing, fixed), benefits, and the whole section, at each width; plus 375 with reduced motion.
  - At 1440 I sampled the listing card every 0.5 s for 30 s. It cycled 302 Bow Cres → 9 Ridge Rd → 14 Elm Ave → 302 Bow Cres, and the price never rose within a listing.
  - The result-box opacity sampled as 0.55 while a run was going and 1 when done.
- Server stopped afterwards; port 4400 returns no response.

## Not verified

- Real-device rendering and Safari. The `starting:` variant needs `@starting-style`; without it the box simply appears with no fade.
- Under reduced motion the illustrations still loop. This is unchanged: `useLoopClock` plays for every visitor by the user's decision. Only `animate-pulse` and `animate-ping` are standard Tailwind.
- The 768–1023 px layout was only checked for overflow, not reviewed visually. At those widths the job cards use the phone carousel.
- One full-section element screenshot at 1440 showed the result boxes faint. A direct probe of computed opacity showed correct values, so I take it to be a capture artifact of the tall element screenshot.

## Open questions or contradictions found

- The brief asks for 28 px after a heading block on a phone. I applied it after the section heading block (part 1 `mt-7`). Part titles keep the board's 14 px before their content; change `PartTitle`'s `mb-3.5` if 28 px is wanted there too.
- `src/components/why-fluxiq/savings/chart.tsx` shows as modified in the working tree. I did not touch it.
- The invented addresses, prices, and result lines are example data, and the sources comment says so.
