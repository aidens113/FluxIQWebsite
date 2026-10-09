# Report: F

## Outcome

Done. Concept A (6+4) for How it works is drawn as two canvas artboards in the scratchpad: `canvas/project/HowA.dc.html` (desktop, fluid page in a 1160 px `.wrap`) and `canvas/project/HowAMobile.dc.html` (375 px). Neither is in `canvas.json`, because the brief did not give me that file. The supervisor adds the board entries.

## What changed and why

- Heading: "Automations that survive a redesign." The lede says a job told once becomes a Flow that runs on your schedule and keeps working when a site changes.
- Part 1, "The task you do every morning" (18 s loop): a "By hand" card in which Open, Search, Filter and Copy light up one at a time, rows are copied 1 to 14, and a minutes counter climbs to 23 min. A "With FluxIQ" card then shows the one-sentence request (from HomeV4: "Every morning, add new roofers in Calgary to my sheet.") and a Flow card ("Morning roofer leads · every day · 7:00") with a progress bar. The run ends "Done in 41 s · 14 new rows", and "0 min" of yours lights up green. Tue, Wed and Thu rows then come in already done. Results fade out for the last second before the loop restarts.
- Part 2, "Then the site changes" (16 s loop): a small wireframe shows the search box sliding into the header ("Thursday night · site redesigned"). Two cards run the same "Friday 7:00 run":
  - "An ordinary recorded script": step 2 fails ("element not found"), steps 3–4 are skipped, the sheet stays empty with "No new rows", and the card ends "✕ Failed at step 2 · nothing arrived".
  - "A FluxIQ Flow": step 2 shows "site changed · finding it", then "fixed · $0.05". The later steps pass, the last is marked "full run passed", rows fill in, and the card ends "✓ Site changed · fixed for $0.05 · nothing missed".
- Four benefit tiles (a list on the phone):
  - Say it once: one sentence becomes a Flow on your schedule.
  - Asks before it acts: anything that sends, buys, or deletes waits for your OK.
  - Survives redesigns: finds the new element and keeps a fix only after a full run passes.
  - Checks taper with trust: about $0.01 for a judged run, $0.00 once the Flow is trusted.
- No copy says runs are free. The 23 min, the 41 s and the row counts are example figures; desktop part 1 is labelled "Example, not real data". The phone cut does not carry the label (see Open questions).
- Format: support.js head line, `<x-dc>`, a classic `class Component extends DCLogic`, a 50 ms `setInterval` state clock as in HomeV4, and lookup-only holes (styles computed in `renderVals()`). The tokens, fonts and `.sec`/`.wrap`/`.eyebrow`/`.h2`/`.lede`/`.card`/`.ico` rules come from HomeV4, and the phone sizes come from HomeV5Mobile's `.m` overrides. Text appears whole, with no typing.
- Phone simplifications: the cards are stacked, step rows show verb and target in one label with short notes ("not found", "finding it", "run passed"), the sheets have 3 rows, and the day rows drop the "0 min of yours" column.

## Commands run and observed results

- Tag balance, counting open and close tags per file:
  - HowA: div 51/51, span 42/42, section 1/1, p 28/28, svg 6/6, sc-if 0/0, sc-for 6/6.
  - HowAMobile: div 47/47, span 37/37, section 1/1, p 22/22, svg 6/6, sc-for 6/6.
- `node --check` on each extracted `<script type="text/x-dc">` body (`<scratchpad>/F-tmp/HowA.js`, `HowAMobile.js`): passed.
- Ran `renderVals()` under a stub `DCLogic` for ticks 0–12000 in steps of 7: no errors.
- Checked that every `{{ hole }}` in the markup resolves to a defined value (loop items included): all resolve. No hole contains an expression.

## Not verified

- I have not seen either board rendered in the canvas or a browser. That includes:
  - the layout at 1440 and 375 px;
  - whether the phone step notes and the 64 px / 58 px day columns fit without clipping;
  - how smooth the transitions and the wireframe slide look.
- The claims were not re-checked against the Core or Extension repositories; the copy follows the entry's claim list.
- The files are not in `canvas.json`.

## Open questions or contradictions found

- The claim list says "a trusted run $0.00". The tile writes "$0.00 once the Flow is trusted" with no "in AI" qualifier. The supervisor may want "$0.00 in AI checks" to keep it far from "free".
- The phone cut has no "Example, not real data" label for part 1. Desktop shows it beside the part 1 title.
