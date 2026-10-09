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

### 2026-10-08 — Every graphic loops a short demonstration
- Agent: supervisor
- Changed: canvas `HomeV4.dc.html` (rebuilt below the hero); this document
- Why: The user found the ambient motion too random to notice: "I want EVERY SINGLE GRAPHIC actually animated on a loop in a usefully demonstrative way." Each graphic is still shorter than the hero demo.
- Design: one 250 ms clock in the board's component drives a short story for each graphic, with CSS transitions between ticks:
  - **Cost chart:** a playhead walks runs 1 to 14 and fills both rows as it goes. AI-call counters show the agent at 14 of 14 and FluxIQ at 2 of 14 (run 1 and the site change).
  - **Pairing line:** a step travels out to the extension in amber, then the result comes back in green, labelled each way.
  - **Framework mock:** Flows replay in turn. Weekly report stops on a changed page, repairs with one AI call (the "AI calls today" counter goes from 0 to 1), waits for review, and keeps the fix.
  - **Extension mock:** it runs the Flow on the page: types "roofing", clicks Search, then reads 4 rows. Each step's card checks off as it goes.
  - **How it works:** a dot takes one Flow through show, build, a first checked run, and three replays with no AI. Then the site changes, the Flow repairs, and the dot rides the loop arc back to run. A caption names each moment.
  - **App mock:** discover, enrich, qualify, and refresh run in turn. The counters tick up and a new lead row moves from New to Enriched to Qualified. AI spend rises only on the passes where refresh needs a repair.
  - **Paper:** the contents are walked one section at a time.
  - **Tile icons:**
    - replay rewinds;
    - a bar hits the cap and stops;
    - the check flashes less and less often;
    - the autonomy slider steps through three settings;
    - install drops into its tray;
    - the key turns;
    - a run bar fills;
    - the license writes itself.
- Claims: nothing new beyond the copy already sourced above. The numbers, names, and the 0.01 repair cost are invented, and the chart and app stay labelled as an illustration and a concept.
- Validation: rendered with the canvas runtime at 1440 px. Frames captured across a full How it works cycle confirm every phase, including the loop arc. No script errors, and the hero demo still advances alongside.
- Outcome: Accepted, pending the user's review
- Follow-up: In the build, each graphic becomes a small client component that runs only while it is on screen.

### 2026-10-09 — v5: savings first, pairing, a real job's life, the app in use, real paper pages
- Agent: supervisor
- Changed: canvas `HomeV4.dc.html` (sections 1 to 5 rebuilt), new canvas files `paper-page-1..6.webp` (PDF pages 2, 3, 4, 7, 9, 10 at 480 px), `canvas.json` (board height 6560); this document
- Why: The user's review asked for:
  - the money saved as the bottom line, with a cost that decays realistically per the paper;
  - a clearer picture of the two parts connecting;
  - a full redesign of How it works;
  - the app mock used by someone moving between its tabs, with "saved $x with FluxIQ";
  - the paper's real pages, turning with its contents;
  - copy written as value to the visitor, not features.

  They also flagged that the paper's $0.016 build cost came from one single test, so the chart must not rely on it.
- Design:
  - **What it saves you:** "The more it runs, the less you pay." A 1,000-run sweep on a log axis plots the average AI cost per run against an agent's flat line. The saved figure counts up beside it: break-even by run 3, $49.74 saved by run 1,000. The model follows the paper's shape: pay to learn, check on runs 1, 2, 3, 8, 33, and 158, then pay once to fix at run 400, after which the check schedule resets. All prices are assumptions and labelled so: agent $0.05 a run, learn $0.10, check $0.01, fix $0.05.
  - **How it fits together:** the extension shows Connect, then a code. FluxIQ asks to approve that same code, the plugs join, and the line goes green ("connected, on your own machine"). Then a job goes out, the extension runs it on the page, and "24 rows" come back. The pairing steps are sourced to Extension `docs/user/quickstart.md`, as in site-v2.
  - **How it works:** "Show it once. It keeps working." Four stage cards fill as one real job plays:
    - you type it, or record it;
    - six steps build, and the email step asks you first;
    - runs replay at $0.00, double-checked early, then trusted;
    - run 400 stops when the search box moves, the fix costs $0.05 once and is kept after a full run, and free runs resume.
  - **App:** a pointer moves between Pipeline, Leads, and Flows. The counters, the chart, and new leads update live. The refresh Flow fixes a changed site. The AI-this-week widget adds "Saved with FluxIQ".
  - **Paper:** the cover and six real pages turn in step with the contents list, each labelled with its page number.
- Validation: rendered with the canvas runtime at 1440 px, with frame sheets of the full How it works, pairing, and app cycles. No errors or failed requests after replacing the templated `img src` with fixed sources.
- Outcome: Accepted, pending the user's review
- Follow-up:
  - The Why tiles and Status were left as they were ("the rest is good").
  - In the build, each graphic becomes a client component that plays only while it is on screen.

### 2026-10-09 — Simpler savings chart, bigger wire, human typing, a chat reply, the phone board
- Agent: supervisor
- Changed: canvas `HomeV4.dc.html`, new canvas board `HomeV5Mobile.dc.html` (375 px), `canvas.json`; this document
- Why: The user's review asked for:
  - one smooth line in the savings chart, with short color keys and an "example, not real data" label, kept simple;
  - a bigger, more obvious connecting wire;
  - "FluxIQ remembers" in place of "Your computer remembers";
  - human, fast typing in every typing animation;
  - FluxIQ replying in the "Where it's going" chat before the app appears;
  - a phone version.
- Design:
  - **Savings chart:** one smooth decaying curve, from the average cost per run (0.10 + 0.00016 × runs) / runs. The two keys read "AI agent" and "FluxIQ", and an "Example · not real data" pill replaces the price footnote and the check and fix tick strip. It still breaks even by run 3 and shows $49.74 saved by run 1,000.
  - **Wire:**
    - 44 × 34 plugs with prongs and sockets, on a 6 px cable;
    - flowing green stripes and a glow once connected;
    - a lock badge;
    - a status pill reading Not connected, Waiting for your OK, or Connected;
    - 18 px packets with labelled chips.
  - **Typing:** the board clock now ticks every 50 ms (stories still step every 250 ms). `typedAt` gives uneven key gaps with pauses after spaces and punctuation. How it works gets a 20-tick first stage so the ask can type out.
  - **Chat:** the request types out, FluxIQ shows typing dots, then streams "Certainly! Here's RoofLeads: your leads, a live pipeline, and four Flows that keep it current, within a $5 weekly AI budget." The app then rises in before the person starts using it.
  - **Phone board:** the same stories at 375 px.
    - The two cards stack with a vertical cable between them.
    - How it works shows four progress segments with one stage's words.
    - The app uses tabs and a fingertip.
    - The paper uses 200 px pages.
    - The hero is a placeholder, since the live site's phone hero is unchanged.
- Validation: canvas renders at 1440 and 375 px, with frame sheets of the chart, pairing, chat, and app cycles. No errors or failed requests, and no sideways scroll at 375 px.
- Outcome: Accepted, pending the user's review

### 2026-10-09 — Balls on wires, a chat for How it works, a cleaner savings chart, calmer motion
- Agent: supervisor
- Changed: canvas `HomeV4.dc.html`, `HomeV5Mobile.dc.html`, `canvas.json` (board heights); this document
- Why: The user's review asked for:
  - the pairing as two small balls on wires that merge into one bigger ball with a secure icon;
  - wire color and direction showing the flow, with no flying dot;
  - a faster savings curve, static clean tile icons, and a tidier chart;
  - How it works as simulated chat cards;
  - fast, smooth text reveals in "Where it's going";
  - a calm paper transition.
- Design:
  - **Pairing:** two 16 px balls sit on 4 px wires, grey while idle and amber while pairing. On connect they slide together and grow into one 52 px ball with a shield-check icon. Flow shows on the wire as moving stripes, blue going out ("sending the job →") and green coming back ("← results coming back"). Amber stripes carry the code during pairing.
  - **Savings chart:** the sweep takes 6 s (it was 11 s). The cursor line is gone. There is a solid agent line, faint gridlines, a glowing amber curve, and a gradient green gap. The notes are small chips. Spend bars sit beside the two totals. The tile icons are static: a coin, a gauge, a shield check, and sliders.
  - **How it works:** a FluxIQ chat window plays out the job.
    - You type the job.
    - FluxIQ lays out six steps; the email step "asks you first".
    - It asks before emailing ("Allow" is pressed).
    - Run cards report checked, then trusted, runs at $0.00.
    - "Run 400 stopped" brings a fix card, and "Keep the fix" ($0.05) is pressed.
    - A passing test run follows, then more runs.

    The stage list on the left follows the chat (on the phone, a four-segment bar).
  - **Where it's going:** the request and the reply each reveal smoothly in about a second, and the app appears at 3.5 s.
  - **Paper:** a still page that crossfades over 0.8 s, with no float or swing.
- Validation: canvas renders at 1440 and 375 px, with frame sheets of the pairing, chart, chat, app intro, and paper cycles. No errors or failed requests. A 1 px overflow at 375 px (the status pill) was found and fixed.
- Outcome: Accepted, pending the user's review

### 2026-10-09 — Savings dot on the line, one-color wire, clean loop, tilted pages
- Agent: supervisor
- Changed: canvas `HomeV4.dc.html`, `HomeV5Mobile.dc.html`; this document
- Why: The user reported:
  - the savings line rushing at the start, the dot off the line, and the green area above the $0.05 line;
  - a blue transfer color, where they want direction only;
  - a rough loop transition on the wire.

  They also asked for each paper page to sit at its own tilt, graded from left to right.
- Cause and fix:
  - The chart's reveal box was raised 10 px (so the glow is not clipped) without moving its contents back down. That lifted the line and the green area 10 px. The dot was also centred without counting its border, another 2 px off. The inner SVG now has a matching 10 px top margin and the dot uses `border-box`.
  - The chart runs on the 50 ms clock with an ease-in-out sweep (7 s), so the dot no longer cuts corners between steps.
  - The wire is green in both directions, and only the stripes change direction. The connector fades out before the loop resets and fades back in.
  - Paper pages crossfade in place, each at its own angle: −6° and −12 px for the cover, stepping to +6° and +12 px for the last page.
- Validation: in the browser, the dot stays within 0.2 px of the line at 1440 px and 0.4 px at 375 px, measured across a sweep with `getPointAtLength`. The green area's top equals the agent line's centre on both boards. Frame sheets of the wire loop and the paper cycle; no errors.
- Outcome: Accepted, pending the user's review
