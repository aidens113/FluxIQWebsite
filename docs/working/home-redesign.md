# Home Redesign: Below the Hero, Visual First

Status: Active
Status detail: Design on the canvas (row "v4", `HomeV4`, now the full page with the hero); awaiting the user's review before building.
Created: 2026-10-08
Last updated: 2026-10-08
Owner: Senior supervisor agent
Scope: Redesign every home page section below the hero so it shows rather than tells; excludes the hero, the header, the footer, and the extension page.
Paired document: none
Related: [hero demo](./hero-demo.md), [site v2](./site-v2.md), [site architecture](../architecture/README.md)

---

## Current State

**True now.** Below the hero the home page is six text-led sections
(`why-fluxiq`, `parts`, `how-it-works`, `vision`, `paper`, `status`). The
user finds it text heavy and not nice to look at (2026-10-08).

**Designed (2026-10-08).** The canvas
(`https://claude.ai/artifact/YDXQXzEMpS4rpbWhoPzcAS`, board `HomeV4`, row
"v4") shows the whole page: the header and hero with the demo, unchanged
(the board embeds the canvas prototype of the demo, which predates the
site's later refinements), then the sections below redesigned visual first,
reusing the sourced copy, shortened:

1. **Why FluxIQ**: the headline "Agents pay for the same thinking every
   run. FluxIQ pays once." beside a chart of AI used per run (an agent: every
   run; FluxIQ: the first run and when the site changed), labelled an
   illustration. Below, four icon tiles: pay for what's new, your limits per
   Flow, checks that relax, you set the autonomy.
2. **Two parts. One system.**: a "paired over a local connection you
   approve" link above two cards, each topped by a mock of its interface (the
   control panel's Flows list; the extension beside a page), then title, one
   sentence, feature chips, and a link. The extension card says Coming soon.
3. **How it works**: four icon nodes on a track (show, build, run, repair),
   the repair step amber with a dashed loop back to running.
4. **Where it's going**: a short pitch and the roadmap as a vertical
   timeline (now green, next amber, then and later grey) beside the
   lead-generation prompt and a generated-app mock captioned "Concept".
5. **Paper**: the cover tilted beside the headline, six numbered contents in
   two columns, and the download button.
6. **Status**: "Early, and built in the open." with a GitHub button and four
   icon tiles (install, AI provider, runs on, license).
7. **Closing call to action** (new): "Stop paying for the same thinking
   twice." with Get the framework and Read the paper.

**Not decided.** Whether the closing call to action stays; phone layouts
(planned below: every grid stacks to one column); whether the extension
page gets the same treatment.

## Claims

Copy is shortened from `src/content/{why,parts,how-it-works,vision,status,paper}.ts`,
whose sources are recorded in [site v2](./site-v2.md); nothing new is claimed.
The chart and both product mocks are illustrations and must say so; the
framework mock's Flow names are examples. The generated-app mock keeps its
"Concept" caption.

## Build Plan (after the user approves)

1. Content: shorten the strings in the six content files; add the chart
   labels, tile titles, chips, and the call-to-action copy with sources.
2. Components, one per section, with their parts beside them: a cost chart,
   icon tiles (shared `ui/icon-tile`), the two product mocks, the step track
   with its loop, the roadmap timeline, the generated-app mock, the paper
   card, the status tiles, the call to action. Icons drawn inline, as in
   `hero-demo/action-icon.tsx`.
3. Responsive: every grid stacks to one column under 768 px; the step track
   becomes a vertical list with the loop drawn beside it; mocks scale with
   their card.
4. Validation: `pnpm check`, `pnpm test`, `pnpm build`, `pnpm test:site`;
   Playwright at 375, 768, 1024, and 1440 px; contrast of the new colours.

---

## Work Ledger

### 2026-10-08 — Design for review
- Agent: supervisor
- Changed: canvas `HomeV4.dc.html` and `canvas.json` (row "v4"); this document
- Why: The user wants the rest of the site redesigned because it is text heavy and not nice to look at.
- Design: as in Current State.
- Validation: rendered with the canvas runtime at 1440 px, every section inspected; the local-connection link and the vision headline adjusted after review.
- Outcome: Accepted, pending the user's review
- Follow-up: The user's review, then the build plan above.

### 2026-10-08 — Board shows the full page; loop arrow redrawn
- Agent: supervisor
- Changed: canvas `HomeV4.dc.html`, `canvas.json`; this document
- Why: The user read the board as removing the hero demo (it began below the hero) and found the How it works arrow and graphics mangled.
- Design: the board now opens with the header and the hero, the demo embedded from the canvas `Stage`. How it works is laid out in fixed pixels (four 263 px columns), the track runs through the node centres (amber from run to repair), and the loop is drawn in the row's own coordinate space: a dashed curve from repair over to run with its arrowhead pointing into run, labelled "a fix that works goes back to running".
- Validation: rendered with the canvas runtime at 1440 px: the hero and demo show at the top; the loop arrow starts at repair and lands on run; no errors.
- Outcome: Accepted, pending the user's review
- Follow-up: The user's review, then the build plan.

### 2026-10-08 — Loop arrow aligned, fuller app mock, real cover, full-width closing band
- Agent: supervisor
- Changed: canvas `HomeV4.dc.html`, new canvas file `paper-cover.webp` (the site's cover image); this document
- Why: The user found the loop's arrowhead off its dotted line and the track line drawn over the icons, the example application too empty, the paper card missing the real cover, and the closing section narrower than the other bands.
- Design: the arrowhead is a filled triangle whose base sits on the dotted line's end; the step icons stack above the track. The generated-app mock is now a full screen: a sidebar (Pipeline, Leads, Outreach, Flows, Settings, and "AI this week $0.42 of $5 limit"), four counters with weekly change, a 30-day new-leads chart, a leads table with score and status, and the app's four Flows with their run state; still captioned "Concept". The paper card shows the real cover (`public/papers/fluxiq-technical-vision-v0.9-cover.webp`). The closing call to action is a full-width band.
- Validation: rendered with the canvas runtime at 1440 px; each fix inspected.
- Outcome: Accepted, pending the user's review
- Follow-up: The user's review, then the build plan. Every name and number in the app mock is invented and labelled a concept.

### 2026-10-08 — Ambient motion on every visual; "Two parts" section at full width
- Agent: supervisor
- Changed: canvas `HomeV4.dc.html`; this document
- Why: The user asked for the rest of the visuals to move "like the main demo", then narrowed it: "less animated, not a full demo". They also asked for the "Two parts. One system." section to be as wide as the others.
- Design: CSS loops only, with no script and no scripted story. Each visual has one quiet motion:
  - The cost chart's bars rise run by run, then hold; "site changed" breathes.
  - The tile icons glow in turn.
  - A light runs along the pairing line.
  - The repairing Flow row fills a progress line, and the extension's target ring pulses.
  - A dot travels the How it works track, lighting each step; the loop's dashes flow.
  - The NOW roadmap dot sends out a halo.
  - The app's chart line draws in and the newest lead row flashes.
  - The paper cover floats.
  - The closing band's light drifts.
  - Earlier, a reduced-motion rule switched all of it off. That hid every loop from the user, whose system has reduce motion on, so the rule is removed and the loops play for everyone, as the hero demo does.
- "Two parts" now has a left-aligned heading with its lede underneath, at the user's request. The pairing line runs edge to edge, and the extension mock fills its card.
- Validation: rendered with the canvas runtime at 1440 px at two moments: motion visible, layout unchanged, and no page errors.
- Outcome: Accepted, pending the user's review
- Follow-up: In the build, start loops only when a section scrolls into view. Ask the user whether reduced motion should slow the loops rather than stop them.
