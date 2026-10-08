# Site v2: Redesign And Rewritten Copy

Status: Active
Status detail: Home and extension pages are live on main; the extension is marked coming soon and the new F-and-node mark is in place.
Created: 2026-10-04
Last updated: 2026-10-05
Owner: Senior supervisor agent
Scope: Replace the gradient-glow landing page with design direction B (dark, one amber accent), rewrite the copy against FluxIQ Core and Web Extension dev, and add an /extension/ page; excludes choosing the final logo and changing the hosting setup.
Paired document: none
Related: [AGENTS.md](../../AGENTS.md), [site architecture](../architecture/README.md), [landing page (v1)](./landing-page.md)

---

## Current State

**True now.** The site is two static pages built from the approved v2 design.

- `/`: hero with the animated example widgets (see hero-demo.md; the run history it first had is retired), why, two parts (framework and
  extension), how it works, where it's going, status, footer.
- `/extension/`: hero with a side-panel sketch, what it's built to do, setup.
  It says "Coming soon" and "Not released yet" (user, 2026-10-05); the main
  button is "See GitHub". The home page's extension card and status row say
  the same. `site-check` no longer retires the phrase "coming soon".
- Brand: ink `#0c0d0f`, amber `#f5b83d`, Geist and Geist Mono. The mark is
  an F whose middle bar ends in an amber node (2026-10-05), replacing the
  "Settle" wave the user rejected. Icons, favicon, and the Open Graph image were
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
- The user plans another round of design and copy changes.
- Pushed on 2026-10-05 and fast-forwarded to `dev` and `main` at the
  user's request. CI publishes the `deploy` branch from `main`; the live
  host was not checked from here.

**Next.** The user's review of the new mark and any further copy changes.

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


### 2026-10-05 — Extension coming soon, new mark
- Agent: supervisor
- Changed: `src/content/{extension,parts,status,types}.ts`, `src/components/extension/hero.tsx`, `src/app/extension/page.tsx`, `src/components/ui/logo-mark.tsx`, `design/brand/`, generated icons and Open Graph image, `scripts/site-check.mjs` and its test, `docs/architecture/README.md`
- Why: The user asked for the extension page to say it is coming soon with a "See GitHub" button, and for a better logo than the wave.
- Validation: `pnpm check` -> passed; `pnpm test` -> all pass; `pnpm build` -> 10 pages; `pnpm test:site` -> passed (128.4 KB gzip JS); Playwright at 1440 and 375 px -> no horizontal overflow, notice and mark inspected.
- Outcome: Accepted
- Follow-up: none

### 2026-10-05 — Social media kit
- Agent: supervisor
- Changed: `design/brand/social/` (new), `docs/architecture/README.md`
- Why: The user asked for logo and banner assets for social media.
- Validation: rendered with Playwright from `social-kit.html` with Geist loaded (`Geist 600, Geist Mono 400`); transparent files checked for alpha 0 at the corner; every file inspected on a contact sheet; `pnpm check` -> passed.
- Outcome: Accepted
- Follow-up: none

### 2026-10-05 — Vision paper on the site
- Agent: supervisor
- Changed: `public/papers/` (PDF and cover), `src/content/{paper,links,navigation,types}.ts`, `src/components/paper/paper.tsx`, `src/components/hero/{hero,paper-banner}.tsx`, header nav, footer, `src/components/ui/section-title.tsx` (balanced wrapping), `src/app/page.tsx`, `scripts/site-check.mjs` and its test, `docs/architecture/README.md`
- Why: The user asked for the Technical Vision & Architecture PDF on the site, prominently. The uploaded file's properties said Author "OpenAI" and Title "v0.4"; the published copy says Author "FluxIQ" and Title "… v0.9". Pages unchanged (12, checked).
- Validation: `pnpm check` -> passed; `pnpm build` -> 10 pages; `pnpm test:site` -> passed (128.4 KB gzip JS); the PDF served 200 `application/pdf` from `pnpm preview`; Playwright at 1440 and 375 px -> no horizontal overflow, banner, nav, and section inspected.
- Outcome: Accepted
- Follow-up: none


### 2026-10-08 — Dependency audit fixed (Next.js 16.3.8, overrides)
- Agent: supervisor
- Changed: `package.json`, `pnpm-lock.yaml`, `docs/architecture/README.md`
- Why: CI on main had failed since the paper release (run 37258637417) at `pnpm audit --prod --audit-level high`: critical GHSA-vcvr-r3jv-pc5j in `next` < 16.3.6 (`next/og`; not reachable in a static export, but it fails the gate), then high advisories in `source-map-js` < 1.2.2 and `sharp` < 0.35.5, both arriving through Next.js.
- Design: `next` 16.3.5 -> 16.3.8 (latest patch of the same minor); `pnpm.overrides` pin `source-map-js` ^1.2.2 and `sharp` ^0.35.5; the dev dependency `sharp` moves to ^0.35.5.
- Validation: `pnpm audit --prod --audit-level high` -> no known vulnerabilities; `pnpm check`, `pnpm test` (86 pass), `pnpm build`, `pnpm test:site` (147.6 KB gzip JS) -> passed; Playwright on `pnpm preview` at 1440, 1024, and 375 px, with and without reduced motion -> no errors, no horizontal overflow.
- Outcome: Accepted
- Follow-up: drop the overrides once Next.js depends on the patched versions.

### 2026-10-08 — Fonts ship with the site; Deploy fixed
- Agent: supervisor
- Changed: `src/app/layout.tsx`, new `src/app/fonts/{geist-latin.woff2,geist-mono-latin.woff2,OFL.txt}`, `docs/architecture/README.md`
- Why: Deploy run 37720343576 failed twice (and its re-run) in `next build` at `next/font/google`'s loader: `TypeError: Cannot read properties of null (reading '1')` at `loader.js:122`, where it expects every Google Fonts file URL to end in a font extension. CI had built the same commit minutes earlier, and local builds only passed from the font cache, so Google's responses had changed under Next.js 16.3.8.
- Design: `next/font/local` with Geist and Geist Mono variable fonts from Vercel's `geist` npm package 1.7.2 (SIL OFL 1.1, license copied beside them), subset to Latin plus the arrows, check mark, and bullets the site uses (`pyftsubset`, woff2, all layout features kept): 34.8 KB and 36.0 KB, both preloaded. One file per family covers every weight. The CSS variables (`--font-geist`, `--font-geist-mono`) are unchanged.
- Validation: `pnpm check`, `pnpm test` (86 pass) -> passed; `pnpm build` with `.next` cleared and the network proxy pointed at a dead port -> passed (no font download); `pnpm test:site` (145.6 KB gzip JS) -> passed; Playwright on `pnpm preview`: `document.fonts` reports geist and geistMono loaded, no failed requests, hero rendered in Geist as before.
- Outcome: Accepted
- Follow-up: none
---

## Open Questions

- Should the site stay one framework page plus `/extension/`, or split
  further? Owner: user.
