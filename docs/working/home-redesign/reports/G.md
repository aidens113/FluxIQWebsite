# Report: G

## Outcome

Done. Concept B (6+9) for How it works exists as two canvas artboards: `<scratchpad>/canvas/project/HowB.dc.html` (desktop, fluid page in a 1160 px `.wrap`) and `<scratchpad>/canvas/project/HowBMobile.dc.html` (375 px). Neither is added to `canvas.json`; the supervisor places them.

## What changed and why

- Both files follow `dc-format.md`: support.js head line, `<x-dc>`, `<helmet>` with the HomeV4 Google Fonts link and tokens (`.sec`, `.wrap`, `.eyebrow`, `.h2`, `.card`, `.ico`), and a classic `class Component extends DCLogic` with a 50 ms `setInterval` state timer. Holes are lookups only; all styles are computed in `renderVals()`.
- Headline: "Automations that survive a redesign." Lede says one sentence becomes a Flow that keeps running on its schedule and keeps working when the site changes.
- Part 1, "Three sentences. Three jobs that keep running.": three cards, each with the request on top ("You said") and its Flow below: name, status pill (Running / Done / Alert sent), run count, last run time, a result line, the schedule. On desktop the three cards sit in a row and run on staggered periods (4.5 s, 3 s, 6 s); on the phone one card shows at a time (5.5 s each, crossfade, pips) and runs once while visible. Run counts come from the absolute tick, so they only climb and never reset on loop.
  - Roofers: "+N new roofers added to your sheet" (sometimes "No new roofers today").
  - Listing watch: hourly price checks; on the run under $400k the card shows "Alert sent", and a footer chip "Alert email allowed by you" covers the "sends waits for your OK" claim.
  - Invoices: "N invoices saved to Invoices/<Friday date>".
- Part 2, "The site redesigns overnight. Only one of these notices.": a small mock of roofers.example crossfades from the old layout to one with the search box in the header (Tuesday to Wednesday). The left panel is "An ordinary recorded script": "Click #search-box" fails ("not found"), copy step never runs, sheet rows go empty and dashed, "Nothing arrived." The right panel is FluxIQ: "Site changed. Finding the new search box…", then "Testing the fix on a full run…", then "Site changed · fixed for $0.05 · nothing missed" with the rows landing one by one. A 13 s cycle that fades back to the old site before restarting.
- Part 3, four benefit points (tiles on desktop, an icon list on the phone): runs on your schedule; anything that sends, buys, or deletes waits for your OK; finds the new element and keeps a fix only after a full run passes; checks taper, about $0.01 for a judged run and $0.00 for a trusted one. Nothing says runs are free.
- Text always appears whole; no typing effects.

## Commands run and observed results

- Tag balance (open/close counts) for HowB: div 50/50, span 42/42, section 1/1, p 21/21, svg 4/4, sc-if 0/0, sc-for 5/5. HowBMobile: div 45/45, span 35/35, section 1/1, p 21/21, svg 4/4, sc-if 0/0, sc-for 4/4.
- Extracted each `<script type="text/x-dc">` body to `<scratchpad>/G-tmp/HowB.js` and `HowBMobile.js`; `node --check` passes for both (re-run after the last edit).
- Ran each logic class under a stub `DCLogic` for 4,000 ticks, calling `renderVals()` each tick: no exceptions; sampled output at ticks 0, 30, 100, 1000 shows counts climbing, statuses changing, and the split story at the expected stage.

## Not verified

- Not rendered in the canvas or a browser: layout, overflow at 375 px (long result lines in the phone card, the fixed 352 px card box), and transition smoothness are unchecked.
- `$preview` heights (1900 desktop, 2050 phone) are estimates.

## Open questions or contradictions found

- The listing-watch result list loops back from $398,500 to $412,000 every few runs, so the price can rise after an alert. Fine for a concept, but a real section might hold the alert state instead.
- Whether a self-addressed alert email counts as "sends" is my reading; I showed it as allowed by you to stay on the safe side.
