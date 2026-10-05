# Site v2: Redesign And Rewritten Copy

Status: Active
Status detail: Home and extension pages are built and validated; the logo, further copy changes, and deployment to main await the user.
Created: 2026-10-04
Last updated: 2026-10-05
Owner: Senior supervisor agent
Scope: Replace the gradient-glow landing page with design direction B (dark, one amber accent), rewrite the copy against FluxIQ Core and Web Extension dev, and add an /extension/ page; excludes choosing the final logo and changing the hosting setup.
Paired document: none
Related: [AGENTS.md](../../AGENTS.md), [site architecture](../architecture/README.md), [landing page (v1)](./landing-page.md)

---

## Current State

**True now.** The site is two static pages built from the approved v2 design.

- `/`: hero with an illustrative run history, why, two parts (framework and
  extension), how it works, where it's going, status, footer.
- `/extension/`: hero with a side-panel sketch, what it does, setup.
- Brand: ink `#0c0d0f`, amber `#f5b83d`, Geist and Geist Mono, the "Settle"
  wave mark as a stand-in logo. Icons, favicon, and the Open Graph image were
  regenerated from new masters in `design/brand/`. The old neon "F" masters
  and `public/brand/fluxiq-logo.webp` were removed; git history keeps them.
- Every product claim was checked against Core `f6ef9f4` and Extension
  `b6768b7` (dev, cloned 2026-10-04) and the Technical Vision & Architecture
  draft v0.9. Sources are in the comment at the top of each `src/content/*.ts`
  file and in the claim table below.
- `pnpm test:site` now checks both pages and fails on "execution grant" and
  on any "$2", since Core removed grants and limits are user-set.
- `lucide-react` was removed; nothing uses icons any more.

**Design source.** The canvas
`https://claude.ai/artifact/YDXQXzEMpS4rpbWhoPzcAS` holds directions A to C,
Home v2, the Extension page, and the four logo concepts. The build follows
Home v2 and Extension v2, including the user's one edit: the why heading on
three lines.

**Not done.**
- The logo is not decided. "Settle" is a placeholder.
- The user plans another round of design and copy changes.
- Pushed to `claude/fluxiq-website-redesign-0dpyy6` on 2026-10-05, after
  GitHub access was fixed. Not merged to `dev` or `main`; nothing is deployed.

**Next.** The user's review round, then a logo decision, then merge toward
`dev` and `main` with the user's approval.

---

## Claims And Sources

| Claim on the site | Source |
| --- | --- |
| Replays run saved steps with no model | Core `runtime/result-check-schedule`, adaptation mode "No LLM intervention" |
| Per-Flow limits on interventions, tokens, spend; ask or stop when hit | Core `FlowSettingsView.tsx` "LLM Budget", "When exhausted" |
| Checked on the first runs, then less often; a change restarts it | Core `result-check-schedule/settings.ts`, `decide.ts` (`initial_then_exponential`: 1, 2, 3, 8, 33…) |
| Fully adaptive, approve every change, or no AI; repairs revertible | Core `FlowSettingsView.tsx` modes; `adaptations/AdaptationsView.tsx` revert |
| A fix is kept only after a full run succeeds | Core `judged-promotion.ts` |
| Built only from actions FluxIQ has; buying, deleting, sending wait for a person | Core `runtime/flow-bootstrap`, `llm-flow-bootstrap.md` |
| fluxiq 0.7; TypeScript; Automation Studio; datasets CSV/JSON; 2FA, roles, encrypted keys | Core `packages/fluxiq/package.json`; `api/handlers/datasets.ts`; Identity & Access, Secret Keys |
| Tools run as programs with their own screens and APIs | Core `programs/_shared/catalog.ts` (ten global programs) |
| Generating applications is the direction, not shipped | No program creation in Core; vision draft v0.9 §9 |
| Roadmap now / next / then / later | Vision draft v0.9 §10 |
| Not on npm or the browser stores | `npm view fluxiq` 404; Extension `docs/user/store-listing.md` |
| DeepSeek only, bring your own key | Core `AiProviderSettingsSection.tsx` |
| Extension 0.1; Chrome, Edge, Firefox | Extension `apps/extension/manifest.*.json` |
| Records clicks, typing, dropdowns, scrolling, tab switches, uploads; review then save | Extension `content/recorder.ts`, panel review step |
| Point at one item, get the list, follow next page | Extension `content/extraction/`, `panel/extraction/` |
| Refuses rather than guesses | Extension `docs/architecture/element-identity.md` |
| No analytics; data only to the paired FluxIQ | Extension `README.md` |
| Connect, approve the code to pair | Extension `docs/user/quickstart.md`; Core client gateway |

Deliberately not claimed: execution grants or any fixed dollar ceiling,
multiple AI providers, npm or store installs, a CLI, reliable
instruction-to-Flow in the extension (live runs mostly failing), proven
end-to-end self-repair through the extension UI, generated apps,
dashboards or analytics, and pause or takeover from the panel.

---

## Work Ledger

### 2026-10-04 — Build v2 into the site
- Agent: supervisor
- Changed: `src/app/`, `src/components/`, `src/content/`, `scripts/site-check.mjs` and its tests, `scripts/brand-assets.mjs`, `design/brand/`, `docs/architecture/README.md`, `package.json`
- Why: The user approved the v2 design on the canvas and asked for it to be built and pushed.
- Validation: `pnpm check` -> structure passed (69 files), working-docs passed, Biome clean, tsc clean; `pnpm test` -> 86 pass, 0 fail; `pnpm build` -> 10 static pages; `pnpm test:site` -> passed (128.4 KB gzip JS); Playwright at 1440 and 375 px with reduced motion -> no horizontal overflow on either page, layouts inspected by screenshot.
- Outcome: Accepted
- Follow-up: Pushed 2026-10-05 once GitHub access was fixed; next, the user's review round and the logo decision.

---

## Open Questions

- Which logo concept replaces the "Settle" placeholder? Owner: user.
- Should the site stay one framework page plus `/extension/`, or split
  further? Owner: user.
- When should this branch merge to `dev` and `main`? Owner: user.
