# Hero Demo: An Animated Extension Walkthrough

Status: Active
Status detail: Revised plan: three example widgets (record, chat, page change); awaiting the user's go-ahead to storyboard.
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

**Next.** Storyboard the three widgets as still frames on the design canvas
for the user, then build.

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

---

## Open Questions

- One tabbed stage (recommended) or three cards in a row? Owner: user.
- Fake site: a fictional lead directory (recommended, matches the vision
  paper's example), a supplier portal, or a shop? Owner: user.
