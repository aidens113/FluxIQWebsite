# Worker D report: "Where it's going" (§4)

- Status: Done, not visually verified (no build or dev run, per the brief)
- Owner: worker D
- Brief: Build Plan v5, row D (`src/components/vision/**`, `src/content/vision.ts`)

## Files

Replaced `src/components/vision/pipeline-concept.tsx` and `roadmap-list.tsx` (deleted). Rewrote `src/content/vision.ts` and `vision.tsx`.

| File | Lines | Role |
| --- | --- | --- |
| `src/content/vision.ts` | 173 | All copy plus its own types (`VisionContent`, `ConceptAppContent`, `ConceptLead`, `ConceptLeadStatus`, `ConceptFlow`, `ConceptFlowState`, `ConceptCounter`, `VisionRoadmapStage`). It keeps the Core f6ef9f4 and paper v0.9 source comment and adds a note that every name and number in RoofLeads is invented. |
| `src/components/vision/vision.tsx` | 31 | Server section, `id="vision"`. Phone: intro, then the demo, then the roadmap. From `lg`: intro and roadmap on the left (.85fr), the demo on the right (1.15fr) spanning both rows. |
| `src/components/vision/vision-demo.tsx` | 33 | Client. Owns `useLoopClock`, computes one story frame, and renders the chat, `PhoneApp` (`md:hidden`), `DesktopApp` (`max-md:hidden`), and the "Concept…" figcaption. |
| `src/components/vision/request-chat.tsx` | 49 | The request with a caret, then FluxIQ's reply after the typing dots (`animate-pulse`). Full text is in `sr-only`; the animated text is `aria-hidden`. |
| `src/components/vision/roadmap-timeline.tsx` | 45 | The NOW/NEXT/THEN/LATER rail. The NOW dot has an `animate-ping` halo. |
| `src/components/vision/outcome-story.ts` | 213 | Pure model: `storyAt(fine, prompt, reply, pool)` returns a `StoryFrame`. It also exports `AIM` (pointer targets as fractions of the aimed element), `dollars`, `fill` (`{n}` templates), and `fadeStyle`. |
| `src/components/vision/app/desktop-app.tsx` | 87 | 150 px sidebar (nav with the fixing dot, "AI this week $x of $5 limit" and its bar, "Saved with FluxIQ $y") and a 372 px view area. |
| `src/components/vision/app/phone-app.tsx` | 85 | Header with "live", three tabs, a 262 px view area, and the footer line "AI this week $x of $5 · Saved $y". |
| `src/components/vision/app/pipeline-view.tsx` | 90 | Counters, the 30-day bars (today grows), and the top three leads. `compact` gives the phone's 2×2 counters, a 70 px chart, and no header or table. |
| `src/components/vision/app/leads-view.tsx` | 77 | Lead table: the newest row arrives, flashes, and goes New → Enriched → Qualified, and its score appears. `compact`: 6 rows, no city or header. |
| `src/components/vision/app/flows-view.tsx` | 56 | Four Flows with runs, cost, and state. Refresh shows "site changed · fixing" at $0.05, then "fixed" at "$0.05 once". `compact`: name, purpose, and state. |
| `src/components/vision/app/pointer.tsx` | 108 | Desktop arrow or phone fingertip, plus the click ripple. It measures its target (see below). |

## Decisions

- **Pointer tracks the layout, not board pixels.** The model names a target (`nav-0..2`, `chart`, `lead-0`, `lead-3`, `flow-2`, `flow-3`). The matching element carries `data-aim`. `Pointer` sums `offsetLeft`/`offsetTop` up to the card and adds a fraction of the element's size from `AIM`.
  - It re-measures when the target changes and on a `ResizeObserver` of the card.
  - Offsets ignore transforms, so a view still fading in (translateY 6 px) does not shift the pointer.
  - Phone tabs are aimed at their centres. The desktop nav is aimed at 40% across (the board's x = 62 in a 126 px item) and the vertical centre. The board hard-coded y 4 px above centre.
- **Story timing is the board's, exactly:** 500 fine ticks a pass, app card at raw 14, intro 16, 84 use ticks, and clicks at p = 26, 54, 82. Counters, run counts, and "saved" keep climbing across passes (from `t`). The reveal formulas are the same.
- **Breakpoints.** The phone app shows below `md`, as briefed. From `md` to `lg` the desktop app sits full-width in one column; the two-column board layout starts at `lg`. At 768 px a 382 px right column cannot fit the 150 px sidebar plus the Flows grid (62 + 70 + 132 px fixed columns). Supervisor: change it if you want two columns from `md`.
- **Board keyframes are not in `globals.css`** (`ping`, `breathe`, `halo`, `roadfill`), and that file is not mine. Substitutes:
  - Tailwind's built-in `animate-ping` for the live dot and the NOW halo.
  - `animate-pulse` for the typing dots.
  - The road fill is drawn static at its end state (green to 22%) rather than looping.

  These play for everyone, like the clock, per the user's decision. If you want the board's exact motion, add those keyframes to `globals.css`.
- **The section background is not set.** The board's section uses `#0e0f11`, but `PageSection` has no background prop, so it stays on ink. The roadmap dot rings use `--color-ink` to match.
- **Copy:**
  - Title "Ask for an outcome." with "Get the whole app." muted.
  - The `md`+ lede is the board's. The phone lede is the brief's.
  - Roadmap labels keep the current sourced content ("Deploy self-repairing Flows to the cloud", "Integrations and Flows that build on Flows"). The board has slightly shorter wording: "Self-repairing Flows in the cloud" and "Integrations, and Flows that build on Flows".
  - Stage names are now "Now/Next/Then/Later", shown uppercase by CSS.
- **Accessibility:**
  - The section is a `figure`, with the "Concept…" text as its `figcaption`.
  - The app mock is `aria-hidden`.
  - The chat's full prompt and reply are read once through `sr-only`.

## Claims to review (supervisor)

- **"Next" versus the roadmap.** Both ledes open with "Next", but the roadmap places generating complete applications at LATER, and "Next" there is cloud Flows. The approved board copy says "Next" anyway. Consider "Later," or "Eventually,".
- **"jobs" versus "Flows".** The `md`+ lede says "the jobs that keep it current", and the Flows view's lede says "the jobs that keep this app current". FluxIQ's vocabulary is "Flows". Both are board copy, kept verbatim.
- **All app data is invented:** RoofLeads, the eight companies, cities, scores, counts, $0.42 / $0.05 / $5, and "saved $38.20+". The "Concept…" caption sits directly under the app at every width.

## Verified

- `pnpm exec biome check src/components/vision src/content/vision.ts`: clean (12 files).
- `pnpm exec tsc --noEmit`: exit 0, whole project.
- `node scripts/structure-audit.mjs`: passed (162 files). The largest file is 213 lines.
- **Differential test against the board.** I ran the board's own `app(t, fine)` body, extracted from `HomeV4.dc.html`, beside `storyAt` for fine ticks 0 to 2599 (5.2 passes). Compared at every tick:
  - prompt and reply text, dots, reply row, card, and pointer visibility;
  - clicks, the active view, and nav-target coincidence with the board's NAV pixels;
  - the four counters (value, note, hot);
  - the today label, all seven lead rows (name, status, score, flash, hidden), and the top three;
  - all four Flows (state, cost, runs);
  - spend, saved, spend highlight, and the Flows nav dot.

  0 mismatches. One pass reaches all eight pointer targets.

## Not verified

- No build, dev server, or browser render. The following were not seen:
  - layout and spacing at 375, 768, 1024, or 1440 px;
  - that the pointer lands visually on each item;
  - the transitions, contrast, and horizontal overflow at 375 px.
- Tailwind arbitrary classes (`bg-ok/12`, `align-[-3px]`, `h-[calc(22%_-_4px)]`, the gradient rail) were not checked in generated CSS.
- `src/content/types.ts` still exports the old `VisionContent`, `ConceptContent`, `RoadmapStage`, `PipelineStage`, and `PipelineFlow`. Nothing of mine uses them; cleaning them up is the supervisor's. I do import `HomeSectionId`, `SplitTitle`, and `Tone` from it.
