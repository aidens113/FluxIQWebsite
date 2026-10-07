# Hero Demo: An Animated Extension Walkthrough

Status: Active
Status detail: Three-widget hero designed on the canvas (v3 row); awaiting the user's review before building.
Created: 2026-10-07
Last updated: 2026-10-07
Owner: Senior supervisor agent
Scope: Replace the home page's run-history table with an immediately impressive, scripted demo of a website being automated by the FluxIQ extension; excludes any live or recorded use of the real extension.
Paired document: none
Related: [site v2](./site-v2.md), [site architecture](../architecture/README.md)

---

## Current State

**True now.** The hero is the headline, lede, two buttons, and an
illustrative run-history table (`src/components/hero/run-history.tsx`). The
user finds the table weak. Nothing in this plan is built yet.

**Decided (user, 2026-10-07).** The hero shows **three example widgets**,
not a faithful replay of the real product:

1. **Record:** someone does a task on a small fake site; FluxIQ captures the
   steps.
2. **Chat:** someone types what they want; FluxIQ turns it into steps and
   does them.
3. **Page change:** the site changes under a saved automation; FluxIQ
   notices, fixes it once with AI, and goes back to running without it.

They are stylised examples that borrow the extension's look (dark panel,
pill, step list) without copying every screen. Each is a short loop of 6 to
10 seconds. The earlier concepts A to E below are superseded.

**Designed (2026-10-07).** The canvas
(`https://claude.ai/artifact/YDXQXzEMpS4rpbWhoPzcAS`, row "v3") holds
`HeroV3` (the hero with the auto-playing, tabbed widget; press Play),
`Frames` (two key frames per widget), and `Stage` (the widget component).
Choices made in the design, open to the user: one tabbed stage; a fictional
lead directory, "Ridgeline Leads"; the panel in the site's ink and amber
rather than the extension's blue, since these are examples; a shorter lede.

**Next.** The user reviews the design; then build per the phases below.

---

## The Three Widgets

Each widget is one card: a mini browser (a small fictional site) on top or
left, a compact FluxIQ panel beside it, and a one-line label. Same stage size
for all three so they can swap in place.

### 1. Record it (about 8 s)
- Panel shows a red "Recording" chip and a step list that grows as the cursor
  works the site: "Click Search", "Type 'roofing'", "Click Filter: Alberta",
  "Read 24 results".
- Ends with "Saved as an automation" and a "Run" button glowing once.

### 2. Tell it (about 9 s)
- Panel is a chat. A message types itself: "Get every roofing company in
  Calgary with a phone number".
- FluxIQ answers with a short plan (3 steps) that ticks off while the site in
  the mini browser scrolls, filters, and highlights rows.
- Ends with a small table "24 rows" and "CSV".

### 3. It adapts (about 10 s)
- A saved Flow runs: steps tick, "No AI needed".
- The mini site redesigns (the Search button jumps, colours shift).
- The step it was on turns amber: "Page changed, fixing". A tiny "AI · 1
  call" badge appears; the step goes green: "Fixed. Future runs updated."
- Next run ticks through clean with "No AI needed" again.

### Presentation in the hero
- **Recommended:** one stage on the right of the title with three tabs under
  it ("Record it", "Tell it", "It adapts"). It auto-advances through all
  three, and a click jumps to one. The tab label is the caption.
- **Alternative:** all three as smaller cards in a row beneath a centred
  title, each playing its own loop. Busier; three moving things at once.

Caption under the stage: "Examples of what FluxIQ does. The browser
extension is coming soon."

---

## Style Reference: The Real Extension UI

Catalogued from FluxIQ Web Extension `b27893f` (dev, 2026-10-07). The repo has
no screenshots, so the demo is rebuilt from code. Strings below were
spot-checked by the supervisor in the files named.

- **Panel** (`apps/extension/src/panel/`): 48 px top bar with a 24 px rounded
  "F" brand square, "FluxIQ", centred "Chat" / "Automations" tabs, red record
  button, 8 px connection dot ("Connected to FluxIQ"), gear, open icon.
  Firefox popup 380 × 580; Chrome side panel, min width 320.
- **Theme** (`panel/theme/tokens.css`): Inter; dark scheme canvas `#0b1016`,
  surface `#111923`, raised `#172231`, divider `#26384a`, text `#eef4fb`,
  muted `#93a4b6`, accent `#5e9eea`, success `#3bc982`, danger `#fa6571`;
  radius 10 (buttons 8); weights 650 to 800.
- **Recording bar** (`panel/recording/recording-controls.ts`): pale red, a
  pulsing dot, "Recording · 3 steps", "Stop recording".
- **Review** (`panel/recording/review/review-view.ts`): "Recording finished",
  "Turn this recording into an automation", "Analyzing your steps...",
  "Building the automation...", numbered step preview, "Save", "Test the
  generated automation", "The test run worked.", "Saved. Find it under
  Recent automations."
- **Extraction** (`panel/extraction/`, `content/picker/overlay.ts`): "Click
  one example item on the page...", then a 2 px blue `#2f6df6` outline with a
  "24 items" label on the page, columns, "Showing 5 of 24 items.", "Confirm".
- **Run summaries** (`panel/automations/summary-copy.ts`): "Completed in
  14.2s", "No AI needed", "AI activated N times", "Learned 1 new page
  variation", "Future runs updated".
- **On-page status pill** (`content/activity-overlay/status-pill.ts`):
  near-black `rgba(17,19,26,.96)` card in a page corner, 384 × 66 in full
  mode; headlines "Running your Flow", "Fixing your Flow", "Run finished"
  (`background/activity/headline.ts`); mark colours running `#7cb2fb`,
  building `#f5b94a`, extracting `#4fdcc4`, done `#5fdf8e`.
- There is no outline on click or type targets during runs; only the pill
  and, when extracting, the picker box. The demo may add a soft cursor ripple
  as stagecraft, not as a claimed feature.

---

## Superseded Concepts (2026-10-07)

Kept for the record; the user chose the three widgets above instead.

Each is a 20 to 30 second loop in the same stage: a browser frame (fictional
site, minimal chrome, an `.example` address) with the real panel docked on
the right, an animated cursor, and the real status pill on the page.

### A. Record, then replay
Record three steps (cursor clicks search, types, submits; the bar counts
"Recording · 1 / 2 / 3 steps"), stop, review, "Building the automation...",
"Save". Then "Run": the pill reads "Running your Flow · Step 2 of 4", ends
"Run finished", the strip shows "Completed in 6.2s · No AI needed".
- For: the clearest "show it once" story; all shipped UI.
- Against: on its own it looks like any macro recorder; the cost story is
  only one small line.

### B. The page changed
A saved Flow replays ("No AI needed"). The site then visibly redesigns
itself (the button jumps, the layout shifts). The pill turns amber "Fixing
your Flow"; the strip ends "AI activated once · Learned 1 new page
variation · Future runs updated"; the next run is back to "No AI needed".
- For: the headline, dramatised: AI only for what is new. The site redesign
  is a striking motion moment.
- Against: needs a setup beat to make sense cold. Repair through the
  extension UI is still pending live acceptance (site-v2 claims table), so
  the caption must call the whole demo an illustration.

### C. Point at one, get them all
The cursor clicks one lead card; a blue box labelled "24 items" sweeps
across every card; the panel table fills row by row ("Showing 5 of 24
items."), then "Confirm", "Done: 24 rows", "CSV · JSON".
- For: the most instantly visual (many things light up at once); all shipped.
- Against: says "scraper" more than "self-repairing automation".

### D. Describe it in chat
Type "Collect the name and price of every product on this page"; the pill
reads "Building your Flow"; action cards tick to "Done".
- Against: instruction-to-Flow in the extension is partial and failing live
  (site-v2). Not recommended for the hero.

### E. Three chapters in one loop (recommended)
A, then a fast replay montage, then B, as one 30 second loop, with three
chapter labels under the stage that double as captions and controls:
1. **Show it once** (8 s): record two steps, then extract the list (C's
   sweep as the visual peak), save.
2. **It runs on its own** (8 s): the run counter climbs #2, #3 ... #40 in a
   few seconds while the strip holds "No AI needed".
3. **AI only when something changes** (14 s): the site redesigns, "Fixing
   your Flow", "AI activated once · Future runs updated", next run clean.

The chapter labels make the story readable even with the sound off and the
eye elsewhere, and they tie the visual straight to the headline.

---

## Fake Website Options

Fictional names only; nothing resembles a real company.

| Option | Why | Notes |
| --- | --- | --- |
| Lead directory ("Ridgeline Leads", list of companies with city, trade, phone) | Ties to the vision paper's lead-generation example; extraction looks natural | Recommended |
| Supplier portal (orders table, "Export CSV") | Matches the old run-history example | Plainer visually |
| Online shop (product grid with prices) | Most familiar; matches the extension's own example chip | Feels consumer, less B2B |

The site is light themed so it contrasts with the dark page and the dark
panel, and so the redesign beat (B) can swap a clear set of styles.

---

## Layout

- **Desktop (≥ 1024 px):** two columns. Left, about 40 %: a shorter title
  and lede, the two buttons, the paper banner above. Right, about 60 %: the
  widget stage with its three tabs under it.
- **Tablet and phone:** the title stack first, the stage below at full
  width. The stage is designed at a fixed 960 × 600 and scaled to its
  container, so every pixel of the script stays where it was placed. Below
  640 px the panel overlays the right third of the site, as a narrow side
  panel would.
- The run-history table is removed; its story is told better by chapter 2.

---

## Technical Approach

- **One small client component**, `HeroDemo`, the site's first. A timeline
  of cues (time, state) per widget lives in `src/content/hero-demo.ts`, so every string
  shown is in `content/` with its source comment, and markup stays in
  components: `browser-frame`, `demo-site`, `extension-panel`, `status-pill`,
  `demo-cursor`, `chapter-controls`, in `src/components/hero-demo/`.
- **Motion** is CSS transitions and keyframes driven by state changes; the
  cursor moves by transitioning `transform` to target coordinates. No
  animation library. Budget: under 10 KB gzip added (the audit limit is
  200 KB; today 128 KB).
- **Considerate playback:** starts when visible, pauses off screen
  (IntersectionObserver) and in a hidden tab, and has a visible pause/play
  button (WCAG 2.2.2 for motion over 5 seconds).
- **Reduced motion:** no autoplay. The stage shows chapter 1's final frame,
  and the chapter labels switch between three still frames.
- **Server-rendered first frame**, so the hero is complete before JavaScript
  runs and there is no layout shift.
- **Accessibility:** the stage is `aria-hidden` artwork with a visually
  hidden description of what it shows; chapter labels are real buttons; the
  caption reads "Illustration of the FluxIQ extension. Coming soon."
- **Alternatives rejected:** a screen recording of the real extension (not
  released, live runs unstable, a video over the 300 KB asset budget, cannot
  match the site's theme); a Lottie file (a new dependency and an authoring
  tool); pure CSS with no JavaScript (possible, but a 30 second multi-element
  script with pause and chapters becomes unmaintainable).

---

## Phases

1. **Storyboard.** Three or four still frames per widget on the design
   canvas, at desktop and phone sizes, for the user's approval.
2. **Static stage.** Build the frame, site, panel, and pill as server
   components at one fixed state; screenshot against the storyboard.
3. **Timeline.** The client component, cues, cursor, chapter controls,
   pause, visibility handling, reduced motion.
4. **Integration.** New hero layout, run-history removed, copy pass on the
   title and lede, docs updated.
5. **Validation.** `pnpm check`, `pnpm test`, `pnpm build`,
   `pnpm test:site`; Playwright at 375 and 1440 px with and without reduced
   motion; a frame-by-frame capture of one loop; JS budget and layout shift
   measured.

## Risks

- **Over-claiming.** The extension is unreleased, and chat-to-Flow and
  repair through its UI are unproven live. These are examples by the user's
  decision; the caption says so and says the extension is coming soon.
- **The real UI changes.** Strings live in one content file with their
  source, so a refresh is one edit.
- **Heavy hero on phones.** Fixed-stage scaling keeps one layout; motion
  pauses off screen.

---

## Work Ledger

### 2026-10-07 — Plan the hero demo
- Agent: supervisor, with one read-only Explore worker cataloguing the extension UI
- Changed: this document
- Why: The user asked for a plan for an immediately impressive hero, with several demo ideas.
- Validation: `grep` in the extension at `b27893f` confirmed "Recording · ${steps}", "What can FluxIQ do for you?", "Fixing your Flow", "Learned N new page variation", the dark tokens, and the pill background; not otherwise validated (plan only).
- Outcome: Accepted
- Follow-up: The user's choice of concept and site.

### 2026-10-07 — Revise to three example widgets
- Agent: supervisor
- Changed: this document
- Why: The user wants three illustrative widgets (record, chat, page change), not a faithful product walkthrough.
- Validation: not validated (plan only).
- Outcome: Accepted
- Follow-up: Storyboard frames on the canvas.

### 2026-10-07 — Design the three widgets
- Agent: supervisor
- Changed: canvas files `Stage.dc.html`, `HeroV3.dc.html`, `Frames.dc.html`, `canvas.json`; this document
- Why: The user approved the three-widget plan and asked for a design.
- Validation: not validated; the canvas type asks not to render-check unless the user asks.
- Outcome: Accepted
- Follow-up: The user's review.

### 2026-10-07 — Chat-first panel, narration, cleanup
- Agent: supervisor
- Changed: canvas `Stage.dc.html` (rewritten), `HeroV3.dc.html`, `Frames.dc.html`, `canvas.json`; this document
- Why: The user asked for a cleaner widget, a chat that matches the real chat-first extension (ChatGPT-style messages plus an action card per step), and a clearer demo.
- Design: the panel uses the extension's dark tokens and real strings ("What can FluxIQ do for you?", "Message FluxIQ", "Recording · N steps", "Stop recording", "Working on it", "Done: 24 rows", "Didn’t work: it wasn’t on the page", "Last run: Completed in 6.2s · No AI needed", "AI activated once · Learned 1 new page variation · Future runs updated", the "Running your Flow" / "Fixing your Flow" / "Run finished" pill). A one-line narration under the stage explains each beat; the pace is 1.6 s per beat.
- Validation: not validated; the canvas type asks not to render-check unless the user asks.
- Outcome: Accepted
- Follow-up: The user's review.

### 2026-10-07 — Tell it first, either/or
- Agent: supervisor
- Changed: canvas `Stage.dc.html`, `HeroV3.dc.html`, `Frames.dc.html`; this document
- Why: The user wants chat first (how most people will start) and the two ways to start shown as alternatives.
- Design: tab order Tell it, "or" Record it, It adapts; narration opens "One way to start…", "Or, instead of typing…", "Either way, you get a saved automation…"; hero lede "Tell it what you want in plain words, or show it once. Either way…".
- Validation: not validated; the canvas type asks not to render-check unless the user asks.
- Outcome: Accepted
- Follow-up: The user's review, then build.

### 2026-10-07 — FluxIQ narrates in the chat
- Agent: supervisor
- Changed: canvas `Stage.dc.html`; this document
- Why: The user wants the simulated chat to read like the real extension, which narrates what it is doing between action cards.
- Design: assistant messages between cards in all three examples, e.g. "Searched for “roofing”. Now narrowing it to Calgary.", "The Search button isn’t where it used to be. This page has been redesigned.", "Run finished. AI was used once, only for the part that changed." Older messages scroll off the top, as a chat does. Narration wording is illustrative; real wording comes from Core at runtime.
- Validation: not validated; the canvas type asks not to render-check unless the user asks.
- Outcome: Accepted
- Follow-up: The user's review, then build.

### 2026-10-07 — User cursor versus FluxIQ highlights
- Agent: supervisor
- Changed: canvas `Stage.dc.html`; this document
- Why: The user wants it obvious which actions are the person's and which are FluxIQ's.
- Design: a mouse cursor appears only in Record it, where the person acts; each recorded action gets a dashed red "● Recorded" box. In Tell it and It adapts there is no cursor: FluxIQ's target gets a solid amber outline with a tag ("FluxIQ · Typing", "FluxIQ · Clicking", "FluxIQ · Reading") that glides between targets; a missing target shows a red "Can’t find Search" box at the old spot, then the amber box moves to the new one. The real extension draws no per-action outline (only the pill); this is example stagecraft by the user's request.
- Validation: not validated; the canvas type asks not to render-check unless the user asks.
- Outcome: Accepted
- Follow-up: The user's review, then build.

### 2026-10-07 — Highlights attached to their elements
- Agent: supervisor
- Changed: canvas `Stage.dc.html`; this document
- Why: The user saw the action and recorded outlines sitting off their targets; they were placed by hard-coded coordinates.
- Design: each outline is now a child of the element it marks (search box, Search button, Calgary chip, results list, or the whole search row for "Can’t find the Search button"), inset 5 px, so it follows the element through the redesign. Outlines fade rather than glide. The user's cursor in Record it is still placed by coordinates. In the build, measure targets from the DOM instead.
- Validation: not validated; the canvas type asks not to render-check unless the user asks.
- Outcome: Accepted
- Follow-up: The user's review.

### 2026-10-07 — Click crosshair
- Agent: supervisor
- Changed: canvas `Stage.dc.html`; this document
- Why: The user wants FluxIQ's clicks marked by a crosshair in the middle of the outline.
- Design: an amber crosshair (ring, four ticks, centre dot) pops into the centre of the outlined element with a short scale-in when FluxIQ clicks: the Calgary filter in Tell it and the Search button in It adapts. Typing and reading keep the outline only; Record it keeps the person's cursor.
- Validation: not validated; the canvas type asks not to render-check unless the user asks.
- Outcome: Accepted
- Follow-up: The user's review.

### 2026-10-07 — Faster, per-moment pacing
- Agent: supervisor
- Changed: canvas `Stage.dc.html`; this document
- Why: The user found some steps too slow, especially at the start; the hero has to catch attention at once.
- Design: per-moment durations replace the flat 1.6 s. Tell it starts typing after 0.35 s and sends at about 1.6 s; clicks and typing hold 0.6 to 1.1 s; only the redesign, the fix, and each ending linger (1.3 to 2.6 s). Loop: Tell it 8.9 s, Record it 8.4 s, It adapts 11.1 s. Idle tail frames were cut. Tab bars fill in step with the real timing.
- Validation: not validated; the canvas type asks not to render-check unless the user asks.
- Outcome: Accepted
- Follow-up: The user's review.

### 2026-10-07 — Pacing retuned
- Agent: supervisor
- Changed: canvas `Stage.dc.html`; this document
- Why: The user found recording and FluxIQ's automation steps a little too fast; only the opening should be quick.
- Design: the opening is unchanged (typing at 0.35 s, sent by about 1.6 s). Recorded actions now hold 1.1 to 1.4 s, FluxIQ's actions 1.1 to 1.8 s, endings 2.4 to 2.6 s. Loop: Tell it 10.9 s, Record it 10.7 s, It adapts 15 s.
- Validation: not validated; the canvas type asks not to render-check unless the user asks.
- Outcome: Accepted
- Follow-up: The user's review.

### 2026-10-07 — Guided title cards
- Agent: supervisor
- Changed: canvas `Stage.dc.html`; this document
- Why: The user wants a transition screen before each example ("OR record it", and so on) with guided text on what is happening and what FluxIQ can do.
- Design: a blurred overlay card fades in over the stage before each example: "01 · Tell it · Type what you want in plain words. FluxIQ works out the steps and does them on the page."; "OR · Record it · Rather show than tell? Do the task once…"; "THEN · It adapts · Either way, you get an automation. When the site changes, FluxIQ fixes what broke, using AI only for that." The first card holds 1.3 s, later ones 1.7 s; the lines rise in with a short stagger. Clicking a tab plays that example's card first. Static frames (autoplay off) skip the cards.
- Validation: not validated; the canvas type asks not to render-check unless the user asks.
- Outcome: Accepted
- Follow-up: The user's review.

### 2026-10-07 — Countdowns, click to skip, slower pace
- Agent: supervisor
- Changed: canvas `Stage.dc.html`; this document
- Why: The user wants longer title cards with a visible countdown, the option to click a card or any step to skip it, and everything a little slower.
- Design: title cards hold 2.6 s (first) and 3.2 s (later) with a draining amber bar and "Click to continue". A 2 px amber bar fills along the stage bottom for each step. A transparent full-stage button ("Skip to the next step") advances one card or step per click, then the timer resumes. Step durations rose about 25 %. A hint "Click the demo to skip ahead" sits at the right of the caption row. Loop is now about 54 s.
- Build notes: the skip control must be a real button with an accessible name; the countdowns restart by alternating keyframe names per tick.
- Validation: not validated; the canvas type asks not to render-check unless the user asks.
- Outcome: Accepted
- Follow-up: The user's review.

### 2026-10-07 — Visible step countdown
- Agent: supervisor
- Changed: canvas `Stage.dc.html`; this document
- Why: The user found the per-step timer hard to see.
- Design: the stage-bottom bar is now 4 px with a faint amber track and glow; a dark chip at the site's bottom-left shows an amber ring filling over the step, "Step N of M", and "click to skip". Both hide during title cards.
- Validation: not validated; the canvas type asks not to render-check unless the user asks.
- Outcome: Accepted
- Follow-up: The user's review.

### 2026-10-07 — Standard timing
- Agent: supervisor
- Changed: canvas `Stage.dc.html`; this document
- Why: The user asked for faster regular steps, slower title cards, and consistent timing.
- Design: every regular step holds 1.5 s; the last step of each example holds 2.5 s; every title card holds 4 s. Loop: Tell it 4 + 14.5, Record it 4 + 13, It adapts 4 + 16 = about 56 s. These three constants are the whole timing model for the build.
- Validation: not validated; the canvas type asks not to render-check unless the user asks.
- Outcome: Accepted
- Follow-up: The user's review.

### 2026-10-07 — Ring chip only
- Agent: supervisor
- Changed: canvas `Stage.dc.html`; this document
- Why: The user found the stage-bottom bar cluttered; the ring chip is enough.
- Design: regular steps show only the bottom-left chip (filling amber ring, "Step N of M · click to skip"); the stage-bottom bar is gone. Title cards keep their own draining bar.
- Validation: not validated; the canvas type asks not to render-check unless the user asks.
- Outcome: Accepted
- Follow-up: The user's review.

### 2026-10-07 — Living highlights
- Agent: supervisor
- Changed: canvas `Stage.dc.html`; this document
- Why: The user wants FluxIQ's action highlights to feel alive while a step holds.
- Design: FluxIQ's amber outline breathes (glow in and out, 1.6 s); a soft light band sweeps across the element every 1.8 s; its tag carries a blinking live dot. The red "can't find" box pulses faster (0.9 s). Recorded (user) outlines stay static and dashed. In the build, all of this sits inside `prefers-reduced-motion: no-preference`.
- Validation: not validated; the canvas type asks not to render-check unless the user asks.
- Outcome: Accepted
- Follow-up: The user's review.

### 2026-10-07 — Pulsing outlines, one click effect
- Agent: supervisor
- Changed: canvas `Stage.dc.html`; this document
- Why: The user disliked the light sweep, wants every outline to pulse, and wants clicks more obvious and consistent.
- Design: the sweep is gone. Every outline pulses: FluxIQ amber (1.6 s), recorded dashed red (1.6 s), "can't find" red (0.9 s). One click effect for all clicks: the control presses in (scale 0.92, 420 ms) and two rings ripple out (700 ms, second 160 ms later). FluxIQ's clicks ripple amber from the element's centre and keep the crosshair; the person's clicks ripple red from the cursor tip, and the cursor dips. Keyframe names alternate per tick so each click replays.
- Validation: not validated; the canvas type asks not to render-check unless the user asks.
- Outcome: Accepted
- Follow-up: The user's review.

### 2026-10-07 — Real typing, row-by-row reading in blue
- Agent: supervisor
- Changed: canvas `Stage.dc.html`; this document
- Why: The user wants typing to look like typing, and reading to light up each result row in turn, with a glimmer used only there, in a different colour.
- Design: typing runs a character at a time with a blinking caret: the chat request (42 ms per character, spanning two steps), "roofing" typed by the person (120 ms) and by FluxIQ (110 ms). Text never flashes in full before typing starts. Reading: the results list loses its box outline and keeps a blue "FluxIQ · Reading" tag; each row in turn (240 ms apart) gets a blue outline and one blue light sweep. Blue (#5e9eea, the extension's own accent) means reading; amber means FluxIQ clicking or typing; red means the person or a failure.
- Validation: not validated; the canvas type asks not to render-check unless the user asks.
- Outcome: Accepted
- Follow-up: The user's review.

### 2026-10-07 — Rows turn green on success
- Agent: supervisor
- Changed: canvas `Stage.dc.html`; this document
- Why: The user wants the read rows to turn green at the moment the chat card reports them read.
- Design: when the "Read · Results list" card switches to "Done: 24 rows", every row gets a green outline, glow, and tint (#3bc982, the extension's success green). In It adapts the read card now shows "Working on it" while rows are read and turns done on the next step, for both runs, so card and rows change together. Green joins the colour key: success.
- Validation: not validated; the canvas type asks not to render-check unless the user asks.
- Outcome: Accepted
- Follow-up: The user's review.

### 2026-10-07 — Tell it clicks Search
- Agent: supervisor
- Changed: canvas `Stage.dc.html`, `Frames.dc.html`; this document
- Why: The user wants FluxIQ to click the Search button after typing the search term in the first example.
- Design: Tell it is now 10 steps: type "roofing" (amber Typing), click Search (crosshair, ripple, press; results appear), click Calgary, read rows (blue, two steps), done (rows green, data card). New chat line "Searching for “roofing”." with a Click · Search card; the pill counts 4 steps. The storyboard's Tell it end frame moved to step 9.
- Validation: not validated; the canvas type asks not to render-check unless the user asks.
- Outcome: Accepted
- Follow-up: The user's review.

### 2026-10-07 — One click effect for every click
- Agent: supervisor
- Changed: canvas `Stage.dc.html`; this document
- Why: The user wants every click, automated or the simulated person's, to look the same.
- Design: every click plays the same effect on the clicked control: it presses in (scale 0.92, 420 ms), two rings ripple from its centre (700 ms, second 160 ms later), and a crosshair snaps onto its centre (600 ms). This now covers the person clicking the search box and "Stop recording" too. The cursor no longer has its own ripple or dip; it only travels to the target. Only the colour differs, matching the outline: amber for FluxIQ, red for the person.
- Validation: not validated; the canvas type asks not to render-check unless the user asks.
- Outcome: Accepted
- Follow-up: The user's review; offer an identical colour if they want no difference at all.

### 2026-10-07 — Crosshair on FluxIQ clicks only
- Agent: supervisor
- Changed: canvas `Stage.dc.html`; this document
- Why: The user did not ask for a crosshair on recorded clicks; the previous entry over-applied it.
- Design: every click presses in and ripples (amber for FluxIQ, red for the person). Only FluxIQ's clicks get the crosshair.
- Validation: not validated; the canvas type asks not to render-check unless the user asks.
- Outcome: Accepted
- Follow-up: The user's review.

### 2026-10-07 — Action-based pacing
- Agent: supervisor
- Changed: canvas `Stage.dc.html`; this document
- Why: The user wants the steps to flow rather than tick at one fixed period.
- Design: each step's length now comes from its action: typing = characters × speed + 450 ms; a click 1.0 to 1.15 s; reading = the row sweep (5 × 240 ms + 650 ms); a chat line 500 ms + 22 ms per character (0.9 to 2.4 s); endings 2.8 s; title cards 1.6 s + 24 ms per character of body (3.2 to 5 s). Step counts are unchanged.
- Validation: not validated; the canvas type asks not to render-check unless the user asks.
- Outcome: Accepted
- Follow-up: The user's review.

### 2026-10-07 — Render check; pill clears the step chip
- Agent: supervisor
- Changed: canvas `Stage.dc.html`; this document
- Why: The user reported the animations broken (later: a problem on their side). The supervisor checked the design with the canvas's own runtime.
- Validation: `node dctest/sim2.js Stage.dc.html` (logic with fake timers) -> all three examples loop, typing, skip and tab clicks run without error; the canvas runtime (`artifact-type/dc-runtime.js`) served over HTTP with Playwright, Stage and HeroV3 rendered at several times -> animates as designed, no page errors. One real defect seen: the step chip overlapped the "Running your Flow" pill at the stage bottom.
- Fix: pill width 236 -> 204 px so it clears the chip; script comments use curly apostrophes only.
- Outcome: Accepted
- Follow-up: none

### 2026-10-07 — Cleaner reading finish, clicks wait for the cursor
- Agent: supervisor
- Changed: canvas `Stage.dc.html`; this document
- Why: The user saw a stray amber outline when the rows turned green, wanted the reading label to stay and turn green, and saw recorded click effects fire before the cursor arrived.
- Design: the results list never takes a box outline, so nothing flashes amber; its label sits right-aligned on the "24 results" line (it used to cover the filters) and turns green, "✓ Read 24 rows successfully", when the read card reports done. The person's click effect, Recorded outline, and captured card wait 700 ms for the cursor to arrive; those steps are 700 ms longer. The status pill moves its step count to the second line ("Reading the results · 4/4") so it fits beside the step chip.
- Validation: `node dctest/sim2.js` -> no errors, skip and tab clicks fine; canvas runtime rendered with Playwright at Tell it steps 7 and 9 and Record it step 3 -> green label on the results line, no amber flash, no stray tag, pill on two clean lines, Recorded outline on Search under the cursor.
- Outcome: Accepted
- Follow-up: The user's review.

### 2026-10-07 — Results wait for their click; one typing step
- Agent: supervisor
- Changed: canvas `Stage.dc.html`, `Frames.dc.html`; this document
- Why: The user saw results (rows loading, a filter switching on) appear before the click that caused them, and wanted the chat request typed in one step, not two.
- Design: what a click causes is held back until it lands: 950 ms for the person's clicks (cursor travel + click), 400 ms for FluxIQ's. Rows fade in with that delay; a filter switches on with a delayed transition. In It adapts the results now load after each Search click (both runs, the second replaying the load) instead of only at the read step. The record search box caret shows only while typing. Tell it is now 9 steps; the request types in one step sized to its length.
- Validation: `node dctest/sim2.js` -> no errors; canvas runtime render of Record it step 3 at +250 ms (no results) and +1.65 s (results) -> as designed.
- Outcome: Accepted
- Follow-up: The user's review.


### 2026-10-07 — Smoothing pass: clicks land first, filter narrows, cursor travels
- Agent: supervisor
- Changed: canvas `Stage.dc.html`, `Frames.dc.html`; this document
- Why: The user saw search results and the Calgary filter take effect before their click, wanted results from several cities that the Calgary click narrows, wanted the recording cursor to visibly travel to the search box with the click on its tip, and wanted It adapts to scan in blue and turn green on finding the moved button.
- Design: each click step has two phases (`landed`): the press first, then everything it causes at once. FluxIQ aims for 450 ms (outline and crosshair), presses, and results follow 300 ms later; the person's cursor glides 600 ms from where it rests, presses at 700 ms, results at 950 ms. Search shows "61 results" across Calgary, Edmonton, Red Deer and Lethbridge; the Calgary click narrows to "24 results in Calgary". The hidden cursor parks at its rest spot, so it never flies in from the corner, and returns there after Stop. The "Type roofing" captured card waits for the last letter. In It adapts the redesign now happens before the first Search attempt; the search row glows blue ("Scanning the new layout"), then the found button turns green and is clicked.
- Validation: `node dctest/sim2.js` -> no errors, skip and tab clicks fine; canvas runtime probe sampled every 40 ms -> in all three examples the press precedes its results (Tell it Search press 10.39 s, results 10.65 s; Calgary press 11.88 s, narrowed 12.15 s; Record Search press 27.82 s, results 28.04 s); cursor sampled gliding rest -> search in about 650 ms, arriving before the press; screenshots of It adapts redesign, blue scan, green found, and Tell it Calgary aim reviewed.
- Outcome: Accepted
- Follow-up: The user's review.

### 2026-10-07 — Transitions when the example site updates
- Agent: supervisor
- Changed: canvas `Stage.dc.html`; this document
- Why: The user wanted a visible transition whenever the example site's UI changes.
- Design: on every step that loads something (Search, the Calgary filter, the redesign, the second run's Search) a thin blue loading bar runs under the address bar for the click's land time plus 300 ms. While it runs, the results area dims to 40% with a 1 px blur, then the new rows slide up one after another (60 ms apart) and the count line fades in. The redesign plays as a page reload: the page fades to 15% with a 2 px blur, swaps layout while faded (500 ms), and fades back in over 420 ms. Also fixed the FluxIQ tag on the Search button being clipped at the right edge; it now anchors to the button's right side on the original layout.
- Validation: `node dctest/sim2.js` -> no errors, skip and tab clicks fine; canvas runtime screenshots at Tell it Search (+300, +600, +850 ms), Calgary (+350, +800 ms), the It adapts redesign (+150, +600, +900 ms) and the second-run Search -> bar, dim, staggered rows and reload fade as designed, tags unclipped.
- Outcome: Accepted
- Follow-up: The user's review.

### 2026-10-07 — Loading starts at the press, not the step
- Agent: supervisor
- Changed: canvas `Stage.dc.html`; this document
- Why: The user still saw the initial search results react before the click.
- Design: the loading bar and the results dimming were starting at the beginning of the step, before FluxIQ's aim (450 ms) or the person's cursor travel (700 ms) finished, so the page reacted before the press. Both now start at the press (animation and transition delays). In It adapts' second run the first run's results stay, still green, until the click lands, instead of vanishing at the step start. The press-to-results gap is now 450 ms for both FluxIQ's and the person's clicks.
- Validation: `node dctest/sim2.js` -> no errors; canvas runtime probe sampled every 30 ms, before the final gap increase -> loading starts about 450 ms into Tell it's Search and Calgary steps and about 700 ms into Record it's Search and Calgary steps, results follow it, and the second run keeps "24 results in Calgary" until its click.
- Outcome: Accepted
- Follow-up: The user's review.
---

## Open Questions

- One tabbed stage (recommended) or three cards in a row? Owner: user.
- Fake site: a fictional lead directory (recommended, matches the vision
  paper's example), a supplier portal, or a shop? Owner: user.
