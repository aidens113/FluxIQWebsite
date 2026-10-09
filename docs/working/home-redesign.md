# Home Redesign: Below the Hero, Visual First

Status: Active
Status detail: v5 built into the site with the privacy notice and terms; pushed to dev and main.
Created: 2026-10-08
Last updated: 2026-10-09
Owner: Senior supervisor agent
Scope: Redesign every home page section below the hero so it shows rather than tells; excludes the hero, the header, the footer, and the extension page.
Paired document: none
Related: [hero demo](./hero-demo.md), [site v2](./site-v2.md), [site architecture](../architecture/README.md)

---

## Current State

**Approved (2026-10-09).** The user approved both canvas boards for the
home page below the hero:

- Desktop: `HomeV4.dc.html`.
- Phone: `HomeV5Mobile.dc.html`.

Both are at `https://claude.ai/artifact/YDXQXzEMpS4rpbWhoPzcAS`. The local
copies the workers read are in the session scratchpad,
`/tmp/claude-0/-home-user-FluxIQWebsite/59b32469-4e43-5da1-b14f-d16680ab6d99/scratchpad/canvas/project/`.
The ledger below records every decision behind them. Each section loops a
short story; the boards' `<script>` holds the exact timing and states, and
their markup holds the exact layout and copy.

**Built.** The boards are in the site, with a closing call to action after
Status. Since 2026-10-09 the order is the user's: what it saves (`why`), how
it works, where it's going (`vision`), then how it fits together (`parts`),
then paper and status. Every looping illustration uses
`src/components/ui/use-loop-clock.ts`, a 50 ms tick. The clock runs from the
moment any part of the element is on screen (threshold 0) while the tab is
visible, and it restarts at zero each time the element scrolls into view. Sections also keep the CSS scroll reveal from `PageSection`.

**Also asked (2026-10-09):**

- Privacy policy and terms pages: boilerplate that names Google Analytics.
- "No analytics" in the extension copy reworded to "The extension has no
  analytics".
- Push to `main` once everything is verified.

## Claims

Copy is shortened from `src/content/{why,parts,how-it-works,vision,status,paper}.ts`,
whose sources are recorded in [site v2](./site-v2.md); nothing new is claimed.
The chart and both product mocks are illustrations and must say so; the
framework mock's Flow names are examples. The generated-app mock keeps its
"Concept" caption.

## Build Plan (v5, approved 2026-10-09)

The phone layout applies below `md` (768 px). From `md` up, the layout is the
desktop board's, fluid inside the 1160 px container: no fixed pixel widths,
and SVG charts drawn in a `viewBox`, with overlays placed in percentages.
Workers partition by file:

| Worker | Owns (create or replace) | Board parts |
| --- | --- | --- |
| A | `src/components/why-fluxiq/**`, `src/content/why.ts` | §1 savings chart, value list or tiles |
| B | `src/components/parts/**`, `src/content/parts.ts`, `src/content/extension.ts` (only the "No analytics" line) | §2 pairing mocks and connector |
| C | `src/components/how-it-works/**`, `src/content/how-it-works.ts` | §3 stage list and chat |
| D | `src/components/vision/**`, `src/content/vision.ts` | §4 chat reveal, app in use, roadmap |
| E | `src/components/paper/**`, `src/components/status/**`, new `src/components/closing-cta/**`, `src/content/paper.ts`, `src/content/status.ts`, `public/papers/pages/*` | §5 paper pages, §6 status list or tiles, §7 closing call to action |
| Supervisor | `src/app/page.tsx`, `src/components/ui/use-loop-clock.ts`, `src/content/types.ts` cleanup, privacy and terms routes, footer, docs | integration and verification |

**Every brief shares these rules:**

- Content files hold words only. A new content type goes in the worker's own
  content file, not in `types.ts`.
- Components are client components only where they animate.
- One exported component per file, files at most 300 lines, and at most 25
  files per directory. No `utils`, `helpers`, `misc`, or `common` names.
- Icons are static inline SVG.
- Copy is the boards' copy, which is value first.
- Chart and app numbers stay labelled "Example, not real data" or "Concept".
- Workers do not edit any file outside their row.
- Workers check with `pnpm exec biome check <their paths>` and
  `pnpm exec tsc --noEmit`, ignoring errors in other workers' paths. They do
  not run `pnpm build`.
- Each worker writes a report to `docs/working/home-redesign/reports/<letter>.md`.
- Workers never commit.

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

### 2026-10-09 — Savings line ends at the dot
- Agent: supervisor
- Changed: canvas `HomeV4.dc.html`, `HomeV5Mobile.dc.html`; this document
- Why: The user saw the line run ahead of the dot at the start of the curve.
- Cause and fix: the reveal box was 6 px wider than the dot's position. Where the curve is steep, 6 px of width shows a long stretch of line past the dot. The reveal now ends exactly at the dot's x.
- Validation: the reveal edge minus the dot's centre is 0 px at every sample through the sweep, at 1440 and 375 px. The dot stays within 0.3 px of the curve.
- Outcome: Accepted, pending the user's review

### 2026-10-09 — Smaller connector, centred between the cards
- Agent: supervisor
- Changed: canvas `HomeV4.dc.html`, `HomeV5Mobile.dc.html`; this document
- Why: The user asked for:
  - a smaller merged ball and icon;
  - no "Connected securely" pill;
  - the flow label lifted clear of the ball;
  - the connector centred on the two cards (desktop).
- Design: the merged ball is 36 px (it was 52) with a 15 px shield-check, and the balls are 14 px before they meet. The status pill is gone on both boards. The flow label sits 64 px above the wire. On desktop the connector column fills the cards' full height and centres the wire at 50%.
- Validation: at 1440 px the connector's centre equals the midpoint of the two cards (2544 px for both). Renders at 1440 and 375 px; no errors and no overflow.
- Outcome: Accepted, pending the user's review

### 2026-10-09 — Bigger secure icon
- Agent: supervisor
- Changed: canvas `HomeV4.dc.html`, `HomeV5Mobile.dc.html`; this document
- Why: The user asked for a bigger secure icon inside the merged ball.
- Design: the shield-check is 20 px (it was 15) inside the 36 px ball, on both boards.
- Validation: close-up render at 1440 px.
- Outcome: Accepted, pending the user's review

### 2026-10-09 — Desktop approved; phone board rescaled and simplified
- Agent: supervisor
- Changed: canvas `HomeV5Mobile.dc.html`, new canvas file `hero-phone.webp` (the live site's phone hero, captured from the build at 375 px), `canvas.json`; this document
- Why: The user approved the desktop board. They found the phone version not great, asking for better scaling, some sections redesigned, and simpler, more minimal components.
- Design:
  - **Hero:** the placeholder is replaced by the real phone hero, captured from `pnpm build`.
  - **Type scale:** headings are 30 px (they were 34) and fit in two or three lines, ledes are 15.5 px and cut to one or two sentences, and section padding is 64 px.
  - **What it saves you:** "Cheaper from run 3" moved off the curve. The totals are one line. The four value tiles return as a quiet icon list.
  - **How it fits together:** shorter mocks (176 px) and wire (124 px), result names cut to fit, and one-line card copy.
  - **How it works:** the chat is compact (24 px avatars, 12.5 px text), its step rows and run cards stay on one line with ellipsis, the email tag reads "asks first", and the panel is 470 px.
  - **Where it's going:** the app view is 262 px with no empty band, and a subtler fingertip.
  - **Paper:** a 176 px page with the current section named under it, in place of the contents list.
  - **Status:** an icon list with static icons.
- Validation: renders at 375 px, with section screenshots at 2× after the changes. No errors and no sideways scroll; the board is 7,177 px (it was 7,700). One regression found and fixed in the same pass: a stray closing `</div>` from the totals rewrite closed the page wrapper early, dropping fonts and colours below it. The tags now balance (105 open, 105 close).
- Outcome: Accepted, pending the user's review

### 2026-10-09 — Phone connector: compact, no label
- Agent: supervisor
- Changed: canvas `HomeV5Mobile.dc.html`; this document
- Why: The user found the phone's How it fits together connector poor. They asked for a smaller connection area, with the status text near the secure icon moved or deleted.
- Design:
  - The connection area is 76 px (it was 124).
  - The balls are 10 px and start 16 px from centre; they merge into a 30 px ball (it was 36) with a 16 px shield-check.
  - The flow label is deleted on the phone. The wire's stripe direction and the mocks show the flow. The desktop board keeps its label.
- Validation: renders at 375 px of the idle, pairing, and connected frames. No errors and no sideways scroll.
- Outcome: Accepted, pending the user's review

### 2026-10-09 — Built into the site; privacy notice and terms of use
- Agent: supervisor with workers A to E (reports in `home-redesign/reports/`)
- Changed:
  - Section folders `why-fluxiq/`, `parts/`, `how-it-works/`, `vision/`, `paper/`, `status/`, and the new `closing-cta/`.
  - The matching content files.
  - `public/papers/pages/` (six page images, 14 to 26 KB each).
  - `ui/use-loop-clock.ts`, and `ui/typed-at.ts` (merged from three copies).
  - `app/page.tsx` (adds `ClosingCta`).
  - The routes `app/privacy/`, `app/terms/`, and `components/legal/`.
  - `content/privacy.ts`, `terms.ts`, `links.ts`, `navigation.ts`, `types.ts` (the old section types removed).
  - The footer, the cookie banner (links to the privacy notice), the sitemap, the site check and its tests.
  - The architecture README.
- Why: The user approved both boards and asked for them built, plus a privacy notice and terms (boilerplate naming Google Analytics), scroll-into-view starts, and a push to `main`.
- Supervisor fixes at integration:
  - The closing lede "…and keep your data" is softened to "Build it and run it on your own machine", because AI calls go to the user's provider.
  - The vision ledes say "In time, FluxIQ will build…", since generated apps are LATER on the roadmap.
  - The extension's "No analytics" now reads "The extension has no analytics and no tracking…" so it cannot be read as being about the site.
  - The legal pages avoid the retired word "policy".
- Validation:
  - `pnpm check`, `pnpm test` (86 pass), `pnpm build`, and `pnpm test:site` (176.5 KB gzip JS) all pass.
  - The built site at 375, 768, 1024, and 1440 px shows no horizontal overflow and no console errors; every section was inspected against the boards.
  - The banner links to `/privacy/`; both legal pages render.
- Not verified:
  - Safari rendering of the chart's `clip-path`.
  - Reduced-motion behaviour beyond the decision that loops play for everyone.
  - Every phase of every loop at every width (sampled after 4.5 s in view).
- Outcome: Accepted

### 2026-10-09 — Analytics on every visit, with a notice
- Agent: supervisor
- Changed:
  - `src/components/analytics/` (new `analytics-notice.tsx`; `google-analytics.ts` moved here, keeping only the load).
  - Removed `src/components/consent/`.
  - `src/content/analytics.ts`, `privacy.ts` (the cookies section now describes analytics on every visit), and `terms.ts` (its header comment).
  - The footer (Cookie settings removed), `app/layout.tsx`, `AGENTS.md`, and the architecture README.
- Why: The user asked that Google Analytics always load and that the banner be a notice that using the site means agreeing to the privacy notice, saying that the site uses analytics. I told the user that loading analytics before consent does not meet prior-consent rules (the EU GDPR and ePrivacy, the UK PECR, Quebec Law 25) for visitors there; it is their call.
- Validation: `pnpm check`, `pnpm test` (86 pass), `pnpm build`, and `pnpm test:site` (175.5 KB) all pass. In the built site at 375 and 1440 px: the Google tag is requested on arrival with no interaction; the notice shows with links to the privacy notice and terms of use; OK hides it and it stays hidden after a reload; no overflow, CSP errors, or page errors.
- Outcome: Accepted

### 2026-10-09 — Section order, earlier scroll start, cleaner hero chat

- Changed:
  - `app/page.tsx` order is now Hero, Why, How it works, Vision, Parts, Paper, Status, Closing.
  - `ui/use-loop-clock.ts` and `hero-demo/use-demo-player.ts` start at IntersectionObserver threshold 0.
  - The hero demo chat (`hero-demo/panel-message.tsx`, `action-icon.tsx`, `extension-panel.tsx`, `stage.tsx`, `hero-demo.css`):
    - actions are one-line rows (name, target, outcome on the right) with a 22 px icon, and consecutive actions sit close as one list;
    - live status uses a pulsing dot;
    - the amber spotlight ring is gone from the panel, and the phone peek's pulse is a soft glow with no ring.
- Why: The user asked for "what it saves, how it works, where its going, then how it fits together"; for animations to start "right when user starts hitting the graphic"; and for the demo chat to be "cleaner".
- Validation: `pnpm check`, `pnpm test` (86 pass), `pnpm build`, `pnpm test:site` (175.5 KB) pass; this also fixes a Biome format error in `privacy.ts` and the stale docs index left by the previous commit. In the built site at 1440 px the main order is why, how-it-works, vision, framework, paper, status; chat frames show one-line actions with long outcomes on a second line; at 375 px no overflow; the only console error is the Google tag blocked by the sandbox proxy.
- Outcome: Accepted

### 2026-10-09 — Hero chat status marks

- Changed: action cards in the hero demo chat lose the corner badges on their icons (the spinning ring, ticks, alerts). Status now sits before the outcome as a small mark from `hero-demo/status-mark.tsx`: a spinner with a faint track while working or fixing, a tick when done, a dot when failed or captured.
- Why: The user said the little spinning circle in the cards "just looks weird".
- Validation: `pnpm check`, `pnpm test` (86 pass), `pnpm build`, `pnpm test:site` pass. Frames of the built site at 1440 px (2x and 3x) show the working, done, and failed rows; the section order is unchanged, and there is no overflow at 375 px.
- Outcome: Accepted

### 2026-10-09 — Phone hero, skip hint, roadmap line, no typing outside the hero

- Changed:
  - `hero/hero.tsx`: below `md` the demo follows the headline, with the lede and actions under it; `md` and up are unchanged. The demo's top is at 354 px on a 360 × 640 and a 375 × 667 phone.
  - `hero-demo/skip-hint.tsx`: new. It shows "Click to skip forward" under the stage on a desktop and "Tap to skip forward" beside the view switch on a phone (`DEMO_LABELS.skipHintClick` and `skipHintTap`).
  - `analytics/analytics-notice.tsx`: tighter on a phone (13 px text, less padding), so it covers less of the demo.
  - `vision/roadmap-timeline.tsx`: the line is one segment per stage, from its dot's centre to the next, in that stage's colour. It used to be a gradient with fixed 22% and 46% stops that missed the dots.
  - No typing outside the hero demo:
    - the parts search box, the How it works request, and the Vision request and FluxIQ reply all appear whole;
    - the Vision reply keeps its thinking dots first;
    - the carets are gone, and `ui/typed-at.ts` is deleted.
- Why: The user asked:
  - for the demo to be visible on arrival on a phone;
  - for "a small indicator… click to skip forward", "click or tap on mobile";
  - for the timeline nodes to line up with the line's colour changes;
  - to "remove human like typing for all demos except the main hero demo", "same with llm response ones".
- Validation:
  - `pnpm check`, `pnpm test`, `pnpm build`, and `pnpm test:site` pass.
  - Built site at 360, 375, 768, and 1440 px: no overflow and no page errors, and the hint fits on one line at 360 px.
  - Roadmap at 375 and 1440 px: each segment's ends measure exactly at the dot centres, and the dots and segments share one x.
  - The How it works text alternates between two lengths only (the request whole or absent).
- Outcome: Accepted

### 2026-10-09 — Smoother phone motion, even mobile spacing

- Changed:
  - `ui/use-loop-clock.ts`: a `smooth` option makes the tick fractional and advances it every animation frame.
  - `why-fluxiq/savings/*`: the savings chart uses that option and positions its dot with a transform (`cqw`/`cqh` in a size container) instead of 50 ms `left`/`top` transitions. The sweep is 5.2 s instead of 7 s (cycle 150 ticks, sweep 104, fade 138). Phones skip the line's drop-shadow filter.
  - The header and the analytics notice drop `backdrop-blur` below `md`/`sm` (nearly opaque fills instead), so fixed blur layers are not recomposited over moving sections.
  - Mobile spacing:
    - every section eyebrow is `mb-4 text-xs tracking-[0.08em]`;
    - heading to content and block to block are 28 px (`mt-7`) in Why, Status, and the closing call to action, matching the other sections;
    - the closing call to action pads 80 px like every section.
- Why: The user asked to "make animations smoother/faster, especially for the money saved graph" on phones, and to "fix negative space so its more consistent… just in general".
- Validation:
  - `pnpm check`, `pnpm test`, `pnpm build`, and `pnpm test:site` pass.
  - At 375 and 1440 px the savings dot took 60 and 59 distinct positions in one second (20 before), and screenshots show it on the line.
  - The 375 px gap audit shows 80 px section padding and 28 px gaps after every heading block; the paper card keeps its own inner padding.
  - No page errors.
- Outcome: Accepted

### 2026-10-09 — Show it once, quicker loops, Vision gap

- Changed:
  - `how-it-works/record-card.tsx`: new. After the request, a "Recording · FluxIQ is watching" card shows a small directory where the person's actions ring red as FluxIQ captures them: Type "roofing" (beat 5), Pick Calgary (8), Read the results (11), then "Captured" (14).
  - Supporting edits:
    - `timeline.ts` adds `RECORD_BEAT`, `CAPTURE_BEATS`, and `CAPTURED_BEAT`;
    - `content/how-it-works.ts` adds `chat.record`, and the plan intro is now "Got it. Here's the job, built from what you showed me:".
    - Source: recording mode is the extension's shipped side-panel recording (Web Extension `b27893f`, "Recording · N steps", as recorded in `hero-demo.md`).
  - `vision/request-chat.tsx`: the 236 px (phone) and 178 px reserved minimum height is gone. The reply bubble always holds its full text (hidden until shown, with the thinking dots over it), so nothing below jumps; the chat-to-app gap is now 16 px.
  - Speed:
    - `parts/timeline.ts` steps every 175 ms, not 250 ms (a loop is about 11 s, not 16 s);
    - `vision/outcome-story.ts` adds `STORY_SPEED` 1.6, applied in `vision-demo.tsx`.
- Why: The user said the first How it works stage "is just empty space… of a single message and nothing happening", asked to "FIX THE NEGATIVE SPACE ON MOBILE", naming the gap between the message and the example application in "Where it's going", and asked to speed up "the fluxiq remembers animations" and "the application example".
- Validation:
  - `pnpm check`, `pnpm test` (86 pass), `pnpm build`, and `pnpm test:site` (176.9 KB) pass.
  - At 375 and 1440 px the chat-to-app gap is 16 px; there is no overflow and no page errors.
  - Screenshots at both widths show the record card mid-capture.
- Outcome: Accepted

### 2026-10-09 — Chat messages no longer squeeze into each other

- Changed: the How it works chat list and the hero demo's chat list give every message `shrink-0` (`*:shrink-0`). The bottom-pinned flex column had been shrinking the recording card (its `overflow-hidden` gives it a zero minimum height) once the chat filled, so its contents ran under the next messages.
- Why: The user said "the messages are overriding other messages as it scrolls up".
- Validation: `pnpm check`, `pnpm test`, `pnpm build`, and `pnpm test:site` pass. Sampling the built site every 200 ms for 26 s at 375 and 1440 px found no overlapping messages. The only leftover is the recording card measuring 2 px taller than itself while a step chip rises in; nothing renders outside it.
- Outcome: Accepted

### 2026-10-09 — A realistic savings model; no "free" claims

- Changed:
  - `why-fluxiq/savings/model.ts`: the chart plots each run's cost instead of a flat average.
    - Costs: $0.10 to build on run 1; $0.01 per judged run, judging every run at first (`8 / (r + 7)`) and tapering to 1 in 50; $0.05 per fix on runs 4, 9, 21, 55, 160, and 480.
    - The line is smoothed with a Gaussian 0.07 decades wide on the log axis, so fixes read as bumps that shrink and spread out. The dot reads the sampled curve (300 samples).
    - Totals are the exact running sum: $0.84 against $50.00 over 1,000 runs, cheaper in total from run 3.
  - `content/why.ts`:
    - the lede and short lede say runs get cheaper, not free;
    - the third note is "Checks and fixes taper off", and the first is "Builds the job";
    - the "Pay for what's new" point names what you pay for;
    - a new `card.assumptions` line sits under the chart;
    - the summary and source comment carry the new numbers.
  - `content/how-it-works.ts`: checked runs cost $0.01 (trusted runs $0.00), "Running · $0.00 AI" is now "Running", and stage 03 says "each run costs little" instead of "no AI bill", to match the model.
- Why: The user asked that the section "not claim that you pay nothing, but simply that cost reduces", modelled on the build, fixes, and judging that decays until trusted, for a deterministic job whose edge cases can be learned, and with a line that is "more spikey but smoothed out… to show more realistic costs".
- Not changed: the hero demo's "No AI needed" lines are real extension strings (`b27893f`) describing one run.
- Validation:
  - `pnpm check`, `pnpm test`, `pnpm build`, and `pnpm test:site` pass.
  - At 375 and 1440 px the chart shows the build peak, a bump at run 4 under the agent line, fading ripples, and $49.16 saved over 1,000 runs.
  - The dot stays on the line at 60 positions a second, with no page errors.
- Outcome: Accepted

### 2026-10-09 — Recording marks match the hero demo

- Changed: `how-it-works/record-card.tsx` marks each recorded action as the hero demo does: a dashed red outline with the user pulse (`how-userpulse` in `chat.css`, a copy of `demo-userpulse`) and a red "● Recorded" label (`chat.record.recorded`). The label sits above the search box, below Calgary, and inside the results. These replace the plain red ring. The step count now reads "1 step".
- Why: The user asked to "make the scan indicators same as hero demo" on the How it works recording card.
- Validation: `pnpm check`, `pnpm test`, `pnpm build`, and `pnpm test:site` pass. Frames at 1440 and 375 px show the mark on the search box, on Calgary, and on the results, with labels clear of the card's edge.
- Outcome: Accepted

### 2026-10-09 — Automation marks, not recording marks

- Changed:
  - The How it works card now shows FluxIQ doing the job once, under the hero demo's automation marks:
    - a solid amber outline with `how-breathe`;
    - an amber label with a blinking dot (`how-blink`): "FluxIQ · Typing", "FluxIQ · Clicking", "FluxIQ · Reading" (`chat.record.tags`).
  - Header: "Doing it once · learning each step", then "Learned".
  - Plan intro: "Done once. Here's the job, built from those real actions:".
  - The red recording marks and `recorded` label are gone; the description, source comment, and architecture README are updated.
- Why: The user said the indicators read "recorded" "rather than proper automation ones".
- Validation:
  - `pnpm check`, `pnpm test`, `pnpm build`, and `pnpm test:site` pass.
  - Frames at 1440 and 375 px show "FluxIQ · Typing" on the search box and "FluxIQ · Clicking" on Calgary, in the hero demo's amber style.
- Outcome: Accepted

### 2026-10-09 — Reading is blue

- Changed: on the How it works card the reading mark uses the hero demo's read colour: `#5e9eea` outline, wash, and label, with `how-scan` (a copy of `demo-scan`). Typing and clicking stay amber.
- Why: The user said "READING IS BLUE".
- Validation: `pnpm check`, `pnpm test`, `pnpm build`, and `pnpm test:site` pass. Frames at 375 and 1440 px show a blue "FluxIQ · Reading" on the results.
- Outcome: Accepted
