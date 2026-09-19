# Report: content

Brief: `### Brief: content` in `docs/working/landing-page.md`. Worker, 2026-09-18.

## Outcome

Done. All landing-page copy is in `src/content/` as typed data: 12 files, one
exported SCREAMING_SNAKE constant each (types excepted). Every product claim
comes from the Claim Audit or is newly checked against Core 80a8495 or
Extension 20abce8 (listed under Copy Sources below). Both TypeScript samples
type-check against Core's source and ran against Core's build. One finding
needs a decision from the supervisor or user: GitHub's default branch lags
`dev` in both repositories (see Open questions 1).

## What changed and why

All under `src/content/`. No other path was touched.

- `types.ts`: the shared types. `SectionId` is a union of the section anchors.
  `NavItem.href` is typed `` `#${SectionId}` ``, and every section's content
  carries `id: SectionId`, so a header anchor cannot point at nothing.
  `ActionLink.icon` is `BrandMark | LucideIcon`: a string (`"github"` or `"x"`)
  means an inline-SVG brand logo from `src/components/ui/`, and anything else
  is a Lucide component, so sections can tell them apart with `typeof icon === "string"`.
  `variant: "primary" | "ghost"` matches the planned `link-button.tsx` prop.
  No class names or colours anywhere.
- `site.ts` (`SITE`): name, wordmark split `Flux` + `IQ`, tagline, the shared
  meta description (verbatim), url, status "In active development", copyright.
- `links.ts` (`LINKS`): the two repos, X, `LICENSE.md` on `main` (confirmed
  identical to `dev`'s), and `mailto:license@getfluxiq.com`, each with label
  and `external`. It uses `as const satisfies Record<string, SiteLink>`.
- `navigation.ts` (`NAV_ITEMS`): the five anchors, in the brief's order.
- `hero.ts` (`HERO`): lede (44 words), corner labels kept as on the live site,
  CTAs as on the live site (GitHub primary, Web Extension, @GetFluxIQ).
- `why.ts` (`WHY`), `how-it-works.ts` (`HOW_IT_WORKS`), `features.ts`
  (`FEATURES`: a Core group of 7 and a Web Extension group of 2, plus Decision
  10's "Tested in a deterministic scenario lab." as the group `note`),
  `developers.ts` (`DEVELOPERS`), `roadmap.ts` (`ROADMAP`: Shipped 9 /
  In progress 4 / Planned 3), `licensing.ts` (`LICENSING`: free for / needs an
  agreement, a "summary, not the license" disclaimer, and links to LICENSE.md
  and the license email), and `follow.ts` (`FOLLOW`).
- The developers section also has a `build` sample (4 lines of shell: clone
  `--branch dev`, `pnpm install`, `pnpm build`), so "build from source today"
  tells readers how. `requirements` is `["Node 22+", "Native ESM"]`.

Icons used (each checked in `lucide-react` 1.47.0): Coins, ShieldCheck,
ScrollText, MessageSquareText, GitBranch, Play, Stethoscope, Workflow, Route,
Gauge, KeyRound, Cable, Boxes, PanelsTopLeft, MousePointerClick,
FingerprintPattern (`Fingerprint` is only an alias for it in 1.x), Puzzle,
CircleCheck, CircleDotDashed, CircleDashed, Handshake, FileText, Mail.

## Commands run and observed results

- `pnpm exec biome check src/content` -> first run: 4 formatting-only findings
  (line wrapping). After `pnpm exec biome check --write src/content`:
  `Checked 12 files in 11ms. No fixes applied.`, exit 0.
- `pnpm exec tsc --noEmit` -> exit 0, no errors in any file. The foundation
  worker's files did not produce errors either. `--listFilesOnly` shows all 12
  `src/content/` files included. It rewrites the git-ignored
  `tsconfig.tsbuildinfo`, because the project sets `incremental`.
- `node scripts/structure-audit.mjs` -> `structure: passed (35 files)`, exit 0.
- Code samples: the exact strings were extracted from `developers.ts` into
  scratch files by `scratchpad/content-worker/extract-samples.mjs`.
  - `tsc -p` with a scratch tsconfig that extends `F:/!FluxIQ/tsconfig.base.json`
    and maps `fluxiq` and `fluxiq/automation-studio/dsl` to Core `src`. Exit 0.
    `--listFiles` shows `dsl/index.ts` and `framework/index.ts` resolved from
    Core `src`. As a control, a copy with `name: 42` failed with TS2322.
  - A runtime run of the Flow sample against Core's `dist` (built 2026-09-17
    22:40, after the last DSL, validation, or nodes commit 3bca251).
    `compileFlowDefinition` returned `ok: true` with no diagnostics.
    Compiling again with a different `now` gave the same digest,
    `sha256:68bbb7e8…409e7f`, printed as `same digest: true`.
  - A first draft without `targetPortId` failed at runtime with
    `flow.edge_incomplete_port_binding`, even though it type-checked. The
    published sample declares both ports.
  - The setup sample ran against `dist` in an empty scratch root and created
    only `.fluxiq/config.json`. The process exits without `close()`.
- Copy lint (`scratchpad/content-worker/copy-lint.mjs`) -> `copy-lint: passed`.
  Every body, detail, and caption is at most 30 words (the longest is 28), and
  every lede is at most 45 (the hero is 44). Sample lengths: setup 8 lines,
  Flow 20 (the limit), build 4.
- Banned-term grep over `src/content/*.ts` (seamless, revolutionary, magic,
  supercharge, unleash, polic*, task(s), routine, Coming Soon, "learns from
  your demonstrations", "patches the Flow", "any model", and the provider names)
  -> no hits.
- `git ls-remote --symref` on both repos -> `ref: refs/heads/main HEAD`. Core's
  `main` is 775ed1e (2026-08-09, `fluxiq` 0.1.0). The Extension's `main` is
  7f07a35 (2026-08-09). Remote Core `dev` is exactly 80a8495, and Extension
  20abce8 is on `origin/dev`.

## Copy Sources

Claims not in the Claim Audit, and the evidence for each. Core means 80a8495
and Extension means 20abce8. Extension HEAD is 59fb47b, but no file under
`apps/` or `packages/` has changed since 20abce8.

- "No grant, no model call" and "Every model call needs a session-bound
  grant". Core `docs/architecture/automation-studio.md:251-254` ("an opaque,
  session-bound execution grant"), `:351` ("A request that carries no
  execution grant resolves no provider"), and `:709-714`.
- A grant "caps calls, tokens, time, and spend", with a hard ceiling of USD 2.
  Core `docs/architecture/automation-studio.md:358-366` and
  `packages/fluxiq/src/programs/automation-studio/runtime/llm/execution-grants.ts:48`
  (64 calls at most), `:67` (26 by default), and `:68`
  (`MAX_TOTAL_COST_USD = 2`).
- "Core never imports a domain package; manifests drive loading". Core
  `README.md:50-51`.
- "Flows are plain data" and "defineFlow takes plain data, never callbacks".
  Core `packages/fluxiq/src/programs/automation-studio/dsl/contracts.ts:15` and
  `dsl/compiler.ts:9`.
- "The compiler checks it against the node registry and returns a plan with a
  SHA-256 digest". The digest is also deterministic. Core `dsl/compiler.ts`
  (`validateRegistry`, `digestFlow`, which zeroes the timestamps),
  `dsl/tests/compiler.test.ts:12-25`, and the scratch run above.
- "Paths resolve from rootDir". Core `packages/fluxiq/src/framework/index.ts:135-175`.
- "Databases, logs, and caches are created on first use" and "Run setup once
  at install or startup". Core `README.md:71-73` and `:84-87`, and the scratch
  run above.
- The Flow sample's node ids `builtin.control.start` (output `next`) and
  `builtin.control.end` (input `in`). Core
  `packages/fluxiq/src/programs/automation-studio/nodes/control-flow/start.ts:4-10`
  and `end.ts:4-9`. Built-ins are registered by default:
  `nodes/canonical-registry.ts:29`.
- The build-from-source commands. Core `package.json` `scripts.build` (builds
  contracts, fluxiq, client-gateway-websocket, and `@fluxiq/web`, which is
  `apps/web` on Next ^15.5.23) and `README.md:109-115`. The `--branch dev`
  flag rests on `git ls-remote` on 2026-09-18.
- Package summaries: the `description` in each `packages/*/package.json`.
  "Native ESM" comes from `packages/fluxiq/README.md:16`.
- Element Identity Scoring: "scoring on-page candidates with Core's element
  matcher", "a clear margin over the runner-up, or it refuses". Extension
  `apps/extension/src/content/identity/score.ts:1-36`.
- "Real-site test boundaries: a fail-closed allowlist validator exists". The
  audit covers the substance. The wording comes from Extension
  `docs/architecture/testing-facility.md:1802-1814`
  (`packages/real-site-policy`, which is testing infrastructure).
- The Consulting Permission item ("Paid services that configure, integrate, or
  support a customer's own installation"). Core `LICENSE.md:11-20`. "Personal
  and non-commercial" and "internal business use" are also in
  `LICENSE.md:39-40`.
- "Current work lands on the dev branch". `git ls-remote`: remote `dev` =
  80a8495, and `main` = 775ed1e (2026-08-09).
- Positioning only, not a FluxIQ claim: the Why lede "Scripts are cheap but
  brittle. Agents adapt, but call a model on every run." This is general
  framing. There is no Core source for it.

## Not verified

- How any section renders this data. Phase 3 is not built, and the brief bars
  `pnpm build`, `pnpm check`, and `next dev`.
- Whether the samples work on Core's `main` branch (0.1.0). They were verified
  only at 80a8495.
- The `pnpm install && pnpm build` commands were not run, because that would
  write into Core, which is read-only for this brief. They are taken from
  Core's `package.json` and README.
- The runtime Flow check used Core's `dist` from 2026-09-17 22:40, not a fresh
  build. It postdates every commit to `dsl/`, `model/validation*`, and
  `nodes/`. The type check did use Core `src` at 80a8495.
- Nobody read the rendered copy for voice. Word limits and banned terms were
  checked mechanically.

## Open questions or contradictions found

1. **GitHub's default branch lags `dev` in both repos.** On GitHub, `main` is
   still the 2026-08-09 state (Core at `fluxiq` 0.1.0), and `dev` holds
   everything the page describes. "FluxIQ on GitHub" and "Web Extension" land
   visitors on `main`, and a plain `git clone` gets 0.1.0. I pointed the build
   sample at `--branch dev` and said so in the caption. The cleaner fix is to
   merge `dev` into `main` in both repos, or change the default branch, before
   the site goes live. That is the user's call and outside this brief.
2. **"policy" contradiction.** The Page Plan's In-progress item "real-site
   policy boundaries" conflicts with the brief's "never 'policy'" and with
   Phase 4's retired-phrase test. It is now "Real-site test boundaries".
3. **"task" ban vs a real program name.** The control panel program is called
   "Background Tasks". It is left out of the Control Panel Programs card, which
   says "including" rather than giving a full list.
4. **Corner labels.** "Adapt / Automate / Evolve" is kept, as the Page Plan
   says. "Evolve" is decorative, not a claim. If it reads as "keeps adapting on
   its own" (Overstated in the audit), a replacement is "Describe / Replay /
   Adapt".
5. `LINKS.extensionRepo.label` is "Web Extension", as on the live site. The
   developers action reuses `LINKS.coreRepo` with the label "Read the source".
