# Worker B report: "How it fits together" (section id `framework`)

Brief: rebuild the Parts section from the approved boards (desktop
`HomeV4.dc.html` §2 and `parts(t, fine)`, phone `HomeV5Mobile.dc.html`
"HOW IT FITS TOGETHER" and `partsM`), and reword the extension's analytics line.

## Files

Removed: `src/components/parts/part-card.tsx` (old version, replaced).

| File | What it holds |
| --- | --- |
| `src/content/parts.ts` | All copy, plus the new types (`PartsSectionContent`, `PartCardCopy`, `FlowsMockCopy`, `BrowserMockCopy`, `LiveStepCopy`, `FlowRowCopy`, `WireLabels`). Sources comment kept and extended with the pairing source (Connect, then approve the matching code: Extension `docs/user/install.md`, `quickstart.md`, already cited in `extension.ts`). |
| `src/content/extension.ts` | One string only: "The extension has no analytics and no tracking. What it sees goes only to the FluxIQ you pair it with." |
| `src/components/parts/parts.tsx` | `Parts` (server): `PageSection id="framework"`, eyebrow, split title, lede (short on phone, full from `md`). Same export name, so `page.tsx` is unchanged. |
| `src/components/parts/pairing-stage.tsx` | `PairingStage` (the only client component): `useLoopClock`, computes the frame, lays out card / connector / card. |
| `src/components/parts/part-card.tsx` | `PartCard`: illustration slot, kicker (+ amber tag, "Soon" on phone), title, body (short on phone), ghost `LinkButton`. |
| `src/components/parts/flows-mock.tsx` | `FlowsMock`: the framework's Flows screen and the approval dialog. |
| `src/components/parts/search-page.tsx` | `SearchPage`: the page with the typed query, Search press, and results (short names below `md`). |
| `src/components/parts/side-panel.tsx` | `SidePanel`: the Connect, code, and live-steps views. |
| `src/components/parts/connector.tsx` | `Connector`, `orientation: "row" | "column"`: wires, two balls merging into one with a shield-check, flow label (row only). |
| `src/components/parts/timeline.ts` | Pure `partsFrame(tick, query, resultCount)`: the board's 64-step story as state. |
| `src/components/parts/typed-at.ts` | Pure `typedAt` (the board's human-typing function). |
| `src/components/parts/motion.ts` | `fadeStyle`, `pressStyle` (the board's `fade` and `press`). |
| `src/components/parts/palette.ts` | Colours with no site token (stripe lights, blue panel, light page). |
| `src/components/parts/wire.css` | `parts-wire-{right,left,down,up}` keyframes, imported by `connector.tsx`. |

## Decisions

- Timing is the board's exactly: step `p = floor(tick / 5) % 64`; idle 0–3,
  Connect press at 3, pairing 4–10 (amber "code" flow from 5, dialog 6–10,
  Approve press at 10), live 11–59, job flow 13–30, rows flow 31+, typing from
  17 on the fine clock (`typedAt("roofing", (tick % 320 - 85) * 50, 3)`),
  Search press 24, results 26–29, connector fades out at 57 so the reset at
  60–63 is unseen. Checked by running `partsFrame` at each key step in node.
- Phone vs desktop: one markup per mock with responsive classes; the connector
  renders twice (`md:hidden` column, 76 px, 10→30 px balls, 16 px shield, no
  label; `hidden md:block` row, 14→36 px balls, 20 px shield, label).
- Desktop grid is `minmax(0,1fr) clamp(112px,16vw,184px) minmax(0,1fr)` so
  it reaches the board's 184 px at 1160 px yet fits at 768 px. The connector
  stretches to the cards' full height (`min-h-[306px]`), so the wire is
  centred on it.
- Between `md` and `lg` the Flows mock's 112 px sidebar is hidden (the phone
  board's logo-before-"Flows" header shows instead): at 768 px the card is
  ~300 px and the sidebar left the list ~140 px wide. Deviation from the
  desktop board in that range only.
- Links: the phone board has no link under the cards; the brief asks for one,
  so the ghost `LinkButton` shows at every width. The board's "→" is dropped
  from the labels ("Get the framework", "More about the extension") because
  `LinkButton` has no aria-hidden trailing slot; add one in `ui/` if wanted.
- Accessibility: each illustration is `role="img"` with an "Illustration: …"
  label from content; the connector is `aria-hidden`.
- Wire stripes animate for every visitor, matching the hero demo and the loop
  clock (the user's decision); no reduced-motion override.
- `typedAt` lives in `parts/`. Workers C and D port the same board helper;
  the supervisor may want one shared copy in `ui/` later.

## Verified

- `pnpm exec biome check src/components/parts src/content/parts.ts src/content/extension.ts`: clean.
- `pnpm exec tsc --noEmit`: no errors in my paths (only `src/components/vision/*`, worker D's).
- `node scripts/structure-audit.mjs`: passed.
- `partsFrame` state at steps 0–63 matches the board's logic (node run of a scratch copy).

## Not verified

- Nothing rendered: no build, dev server, or browser per the brief. Layout,
  the md–lg range, text overflow in the phone side panel's step rows, the
  flow label overlapping the cards' edges at narrow desktop widths (it is
  wider than the connector column, as on the board), and the motion itself
  are unchecked.

## For the supervisor

- `src/content/types.ts` still defines `Part` and `PartsContent`; nothing uses
  them now. Remove in the types cleanup.
- The Claims section says the product mocks "must say so" (illustrations):
  this section's board has no visible caption, so it is said only through the
  `aria-label`s. Add a visible caption if the claims rule needs one here.
