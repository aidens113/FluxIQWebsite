# Worker C report: How it works (§3)

## Files

Replaced: `src/content/how-it-works.ts`, `src/components/how-it-works/how-it-works.tsx`.
Deleted: `src/components/how-it-works/step-card.tsx`.
New, all under `src/components/how-it-works/`:

- `timeline.ts`: pure. `howFrame(tick, ask)` ports the board's `how(t, fine)`: a 500-tick cycle, `beat = floor(fine / 5)`, stage index, progress and glide, typed count, caret, badge, and the Allow and Keep states. Also `typedAt` (human typing), plus the message beats (`PLAN_BEAT`, `ASK_BEAT`, `FIX_BEAT`, `RUN_BEATS`, `AFTER_BEATS`, `stepBeat`).
- `flow-story.tsx` (the only client component): `useLoopClock<HTMLDivElement>()`, then lays out the stage list, the phone progress, and the chat.
- `stage-list.tsx`: the 01 to 04 cards with the active highlight and the bottom progress bar. Shown from `md`; below `md` it is `sr-only`, so assistive tech still gets the stages.
- `stage-progress.tsx`: the phone's four segments plus the active stage's number, title, and body. `md:hidden`, `aria-hidden`.
- `chat-window.tsx`: the header (mark, "FluxIQ", "Morning roofer leads", the phase badge) and the bottom-anchored message list with a top fade mask (56 px). It is 470 px tall on the phone and 560 px from `md`.
- `user-bubble.tsx`, `fluxiq-message.tsx` (avatar and card, with an `alert` variant), `plan-card.tsx`, `ask-card.tsx`, `fix-card.tsx`, and `run-card.tsx`.
- `chat.css`: the `how-msg-in` keyframes and the `.how-msg-in` (0.45 s) and `.how-step-in` (0.35 s) classes. It is imported by `flow-story.tsx`, the same pattern as `hero-demo.css`.

## Decisions

- **Content types:** they live in the content file (`HowStage`, `HowPlanStep`, `HowRun`, `HowRunTone`, `HowItWorksContent`). The title uses the existing shared `SplitTitle` from `types.ts`. `HowItWorksContent` and `Step` in `types.ts` are now unused by this section; the supervisor's cleanup can remove them.
- **Words and timing:** the content file holds words only. Every beat number lives in `timeline.ts`; run beats are matched to the content's runs by index.
- **Messages:** each message mounts when its beat arrives, so `msgIn` plays on mount, as the board's `display:none` to `flex` did. Everything unmounts when the cycle wraps to 0.
- **Phone differences:** they are done with `md:` variants:
  - 24 px avatars and 12.5 px card text;
  - plan step and run rows on one line with ellipsis (`whitespace-nowrap` and an `overflow-hidden text-ellipsis` detail);
  - run cards without the 40 px indent;
  - the "asks first" tag (via `md:hidden` and `hidden md:inline`);
  - the short lede "No scripts, nothing to babysit."
- **Chat accessibility:** the chat is `aria-hidden` inside a `<figure>` whose `sr-only` figcaption describes the whole story (`chat.description`).
- **Colours:** the board's in-between surface greys (#0f1012, #121315, #141518, #1a1b1f, #1d1f23, #1f2125, #24262b, #26282d, #17150f) and the "checked" tag blue #5e9eea are Tailwind arbitrary values, since they are not tokens. Everything else uses tokens (amber, amber-edge, amber-wash, ok, rule, edge, panel, fg, soft, muted, dim, ink).
- **Layout:** the desktop grid is `360px | 1fr` from `lg`, and `0.8fr | 1.2fr` between `md` and `lg` (no fixed widths). The heading uses `SectionTitle` and the eyebrow style of the other sections, not the board's 52 px h2.
- **Motion:** it plays for everyone, including reduced motion, matching `use-loop-clock` and the user's recorded decision. The supervisor may want to confirm this for the `msgIn` rise.
- **Sources:** the existing comment is kept (Core f6ef9f4: flow-bootstrap held actions, judged-promotion), with a note that the job, run numbers, row counts, and the $0.05 fix are an invented example following the boards.

## Verified

- `pnpm exec biome check src/components/how-it-works src/content/how-it-works.ts` reports no findings.
- `pnpm exec tsc --noEmit` reports no errors in my paths. The 8 remaining errors are in `parts/`, `vision/`, and `why-fluxiq/`.
- `node scripts/structure-audit.mjs` passed (150 files). The largest file is 146 lines.
- `howFrame` was run under node at ticks 0 to 500. Beats, stages, progress, the typing finishing by beat 16, the badges (Setting up, Building, Running, Fixing, Fixed, Running), Allowed at beat 32, Kept at beat 70, and the "fixed" tag between beats 70 and 84 all match the board's `how()`.

## Not verified

No build, dev server, or browser render (outside the brief). Not exercised:

- the layout at 375 and 1440 px;
- the top fade mask;
- whether the bottom-anchored list clips cleanly at 470 and 560 px;
- the `md:not-sr-only` stage list's appearance;
- the motion.

The product copy was taken from the boards and was not re-checked against Core.
