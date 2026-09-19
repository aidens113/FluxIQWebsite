# Landing Page

Status: Active
Status detail: Executing with workers; phases 1 and 2 dispatched in parallel, phases 3 and 4 follow.
Created: 2026-09-18
Last updated: 2026-09-18
Owner: Senior supervisor agent
Scope: Rebuild the getfluxiq.com landing page in Next.js with copy corrected against the FluxIQ repositories; excludes hosting cutover and any page beyond the landing page.
Paired document: none
Related: [AGENTS.md](../../AGENTS.md), [site architecture](../architecture/README.md), [protocol](./agent-working-doc-protocol.md)

---

## Current State

**True now.** The repository is set up and nothing of the landing page is built.
`src/app/page.tsx` is a placeholder heading. Phase 0 is done:

- Next.js 16.3.5 / React 19.2.8 / Tailwind 4.3.3 / Biome 2.5.14 / pnpm 10,
  static export to `out/`, strict TypeScript with `noUncheckedIndexedAccess`.
- `AGENTS.md` (brain template, filled in, Next.js agent block kept verbatim),
  `CLAUDE.md` (FluxIQ family lessons imported), `docs/architecture/README.md`,
  and this protocol and index under `docs/working/`.
- `pnpm check` runs the structure audit (`scripts/structure-audit.mjs`), the
  vendored working-docs audit, Biome, and `tsc`; `pnpm test` runs both
  audits' node:test suites; CI runs install, check, test, build, and
  `pnpm audit`.
- The brand masters are copied from the live site's CDN into `design/brand/`.
- Git: `dev` is pushed to `origin`. `main` does not exist yet, because pushing
  it needs the user's approval.

**Done.** Content and design inventory of the live site
([Live Site Inventory](#live-site-inventory)); a claim-by-claim audit against
Core `80a8495` and Extension `20abce8` ([Claim Audit](#claim-audit)); the page
plan ([Page Plan](#page-plan)).

**In progress.** The user asked for the whole site to be built with workers,
2026-09-18. Phase 1 (brief `foundation`) and Phase 2 (brief `content`) are
dispatched in parallel under [Worker Briefs](#worker-briefs). The supervisor
added `lucide-react` 1.47 and `sharp` 0.35 and the `brand:assets` script
first, so neither worker touches `package.json`. Lucide 1.x has no brand icons,
so the GitHub and X logos are inline SVG components.

**Next.** Phase 3's section briefs, once phases 1 and 2 are verified. Every
completed phase is pushed to `origin/dev` as it lands (see `AGENTS.md`).

**Blocked.** Nothing blocks phases 1 to 4. Deploying depends on the hosting
decision in [Open Questions](#open-questions).

**Rules that bind every phase.**

- Every product claim comes from the Claim Audit, or is newly verified against
  Core or Extension and recorded in [Copy Sources](#copy-sources).
- Use "Flow", never "policy". Say "proposes" or "reviewed" wherever the live
  site said "patches" or "adapts".
- Nothing the audit marks Partial or Planned may be presented as shipped.

## Live Site Inventory

The live site (2026-09-18) is a Vite single-page app built with Hostinger's AI
builder. Its copy lives in the JS bundle `assets/index-CgRsI0DB.js`, which is
where this inventory was extracted from. Sections, in order:

1. **Hero.** Logo, then "Flux**IQ**", "Automate Smarter", a pulsing "Coming
   Soon" pill, and the lede "A hybrid automation framework that learns from your
   demonstrations, reasons with AI, and keeps adapting at runtime — the
   reliability of scripts, the flexibility of AI." Three pill links: "FluxIQ on
   GitHub" (primary gradient), "Web Extension", "@GetFluxIQ". Corner labels
   "Adapt / Automate / Evolve" and "Ideas → Action", animated gradient wave
   SVGs, and three blurred color glows.
2. **How it works: "From intent to running automation."** A vertical timeline of
   four steps, each with an icon tile and a gradient dot: Instruct / Compile /
   Execute / Recover.
3. **Planned features: "What we're building."** Two grids. Core has Automation
   Studio, Flow Engine, Runtime Adaptation, Permission-Aware Actions, Client
   Gateway, and Domain-Neutral Core. Extension has Web Extension and Scenario
   Testing Lab.
4. **Roadmap: "Where it's heading."** Three cards (Now / Next / Later) of four
   items each.
5. **"Follow the build."** The same three links again.
6. **Footer.** "© 2026 FluxIQ — Automate Smarter".

Design: background `#03001c`, Space Grotesk headings, Inter body, cyan → blue →
purple gradients, rounded-full pill buttons, `rounded-2xl` translucent cards
(`bg-white/5`, `border-white/10`), and fade-up on scroll (framer-motion). The
page title is "FluxIQ — Automate Smarter | Coming Soon". Links:
`github.com/aidens113/FluxIQ`, `github.com/aidens113/FluxIQWebExtension`,
`x.com/GetFluxIQ`.

## Claim Audit

Checked on 2026-09-18 against Core `80a8495` and Extension `20abce8`. Core's
`docs/architecture/current-system.md` and `roadmap.md` lag the code, so code
and `Current State` sections were preferred over them.

| Live site claim | Verdict | Evidence (Core unless noted) |
| --- | --- | --- |
| "Learns from your demonstrations" | Overstated | A recording becomes a Subflow through a deterministic mapper ("Generate Subflow", `automation-studio.md:52-70`). Mining and learned-model stages are contract-only (`:1188-1198`). |
| "Keeps adapting at runtime" | Overstated | New Flows are fail-closed with manual proposal review (`:200`), and "automatic promotion never applies an adaptation" (`:690`). |
| Reliability of scripts, flexibility of AI | Accurate | "token usage scales with novelty rather than execution count" (`automation-studio.md:198`). |
| Instruct: plain language or a recorded demonstration | Shipped | Blank-Flow authoring from text (`automation-studio/llm-flow-bootstrap.md`) and extension recording. The extension's natural-language Simple Mode is not built. |
| Compile into a "policy" | Wrong term | The output is a Flow: `subflow <label>: <situation>` blocks with `when:` lines (`:417-431`, commit `2c98fbd`). It is an unapplied proposal (`:318`). |
| Execute against live state | Shipped | The Router evaluates `inputs.*` and `state.*`. Proven live, 14/14 both routes (Extension week-2 plan). |
| Recover: "patches the Flow at runtime" | Wrong | Runtime patches are temporary run-context instructions. Durable changes go through `review-flow-adaptation`. |
| Recovery bounded by cost, tokens, no-progress | Shipped | Six guards: USD 2 cost cap, tokens, 600 s deadline, 3 steps without progress, unusable decisions, patch reserve (`:833-887`, `fluxiq` 0.6.0). |
| Replay with no model | Shipped | 5 replays with no key, grant, or provider; 14/14 records byte-identical. |
| Automation Studio canvas | Shipped | `@xyflow/react` canvas. Panes for Flows, Router, Subflows, Instructions, Recordings, Adaptations, Runtime Debug, Settings (`:1262-1275`). |
| Flow Engine | Shipped | Router, Subflows, recovery ladder, published Flows as pinned "Call Flow" nodes (`:1327-1354`). |
| Permission-aware actions; "nothing refused silently" | Partial | The Core gate landed in `f774b43` with five consequence classes and fail-closed grants. Wiring the web press action (t011) is held. Recovery does not receive the permitted set, and there is no request UI. |
| Client Gateway | Shipped | `ws://127.0.0.1:4777/client`. Pairing is approval, not code entry. Credentials rotate on reconnect; trust lasts 30 days. |
| Web Extension (Chrome, Edge, Firefox) | Shipped, unpacked only | MV3 v0.1.0 with `dist/chrome` and `dist/firefox` builds; Edge uses the Chrome build. No store listing. |
| Domain-Neutral Core | Shipped | `defineDomainIo`, `defineInput`, `defineOutput`, `registerDomainIo`, domain manifests. |
| Scenario Testing Lab | Internal tooling | Extension `apps/scenario-lab`. A development facility, not a product feature. |
| Roadmap "Next": Level 2 element-identity scoring | Already shipped | Extension `content/identity/score.ts`; Core `fluxiq/automation-studio/fingerprinting`. |
| Roadmap "Next": closed failure vocabulary | Already shipped | `@fluxiq/contracts` 0.2.0, `AutomationStudioFailureRecord`. |
| Roadmap "Next": data extraction | In progress | Core datasets K0 to K9 are done. Extension X0 to X4.1 are done; the element picker is in progress. |
| Roadmap "Next": real-site policy boundaries | In progress | A fail-closed validator exists; no real-site executor is connected. |
| Roadmap "Later": identity and auth | Already shipped | 12-hour sessions, PIN, TOTP, roles, Secret Keys (AES-256-GCM). |
| Roadmap "Later": compute orchestration | In progress | Nodes, queued commands, and leases exist. Live transport is planned (`docs/programs/global-programs.md:145-163`). |
| Roadmap "Later": hosted deployments | Planned | Only reserved in the license; Deployment Sync is local Git. |
| Roadmap "Later": commercial licensing | Partial | Terms exist and agreements are available on request. Templates are pending (`package-boundaries.md:99`). |

Facts the live site omits that developers care about:

- The import API: `FluxIQ.create({ rootDir })` then `setup()`, which creates
  only `.fluxiq/config.json`.
- Flows can be written in TypeScript with `defineFlow` from
  `fluxiq/automation-studio/dsl`; they compile deterministically with a SHA-256
  plan digest.
- Packages: `fluxiq` 0.6.0, `@fluxiq/contracts` 0.2.0, and
  `@fluxiq/client-gateway-websocket` 0.1.0. They are ESM and need Node 22+.
  **None is on npm yet.**
- The Next.js control panel ships global programs: Identity & Access, Secret
  Keys, Database Manager, Background Tasks, Compute Control, Deployment Sync,
  Runtime, and Automation Studio.
- Run records itemize every LLM call, and saved traces replace credentials with
  `[withheld]`. Applied adaptations are reversible. A default grant costs about
  USD 0.09 in tokens, with a hard cap of USD 2.
- Licensing is fair-code, not OSI open source: the Sustainable Use License
  v1.0 plus a Consulting Permission.
  - Personal, non-commercial, and internal business use is free.
  - Customer-facing automation, hosting or managed service, embedding, OEM,
    resale, and white-labeling need a signed agreement:
    license@getfluxiq.com.

The only built-in model provider is DeepSeek, so the copy must not claim
"any model" or name a provider list.

## Decisions

1. **Static export.** Recorded in the [site architecture](../architecture/README.md).
2. **Keep the live site's visual language.** Same background, gradients, fonts,
   and pill/card shapes. The improvements are structure, accuracy,
   accessibility, and weight, not a redesign. Core's `ui-theme.md` (AWS-style,
   no decorative gradients) governs the control panel, not the marketing site.
3. **No animation library, and no JavaScript for motion.** Reveal-on-scroll
   uses CSS scroll-driven animation (`animation-timeline: view()`) on
   `[data-reveal]`, inside `@supports`. Browsers without support just show the
   content. All motion is off under `prefers-reduced-motion`, and the wave SVGs
   animate with CSS. This replaced an `IntersectionObserver` design on
   2026-09-18, because that one hides content until hydration and needs a
   client component.
4. **Icons from `lucide-react`**, the same icon set the live site uses. The X
   logo is an inline SVG component.
5. **Fonts from `next/font/google`.** They are self-hosted at build time, so the
   page makes no runtime request to Google.
6. **Copy lives in `src/content/`** as typed data, one exported constant per
   file. Sections render it, so a claim correction never touches markup.
7. **The status pill changes** from "Coming Soon" to "In active development".
   The source is public and working; it is pre-release, not unreleased.
8. **Show the import API with an honest label.** The sample carries "npm
   release pending — build from source today", because no package is on npm.
9. **Replace the Now / Next / Later roadmap with Shipped / In progress /
   Planned**, built from the Claim Audit verdicts, because three of the live
   site's "Next" and "Later" items have already shipped.
10. **Drop Scenario Testing Lab as a feature.** It becomes one line of
    engineering credibility ("tested in a deterministic scenario lab").
11. **Add a slim sticky header** with anchors to How it works, Features,
    Developers, Roadmap, and License, plus a GitHub link. The live site has no
    navigation.

## Page Plan

Sections in order. Each is `src/components/<section>/<section>.tsx`, rendering
data from `src/content/<section>.ts`. Headlines below are direction for phase
2, not final copy.

1. **Site header.** Logo mark, wordmark, section anchors, GitHub link. Collapses
   to logo plus GitHub under `sm`.
2. **Hero.**
   - Logo, the "FluxIQ" wordmark, "Automate Smarter", and the status pill.
   - Lede direction: a source-available TypeScript framework for automations
     that use AI only when something is new. Describe or demonstrate a task
     once and FluxIQ generates a Flow that replays deterministically with no
     model. When the page changes, it diagnoses the failure and proposes a
     repair for your review.
   - CTAs as on the live site.
   - Keep the corner labels, waves, and glows.
3. **Why FluxIQ.** New section with three value cards:
   - Cost: AI spend scales with novelty, not with how many times a Flow runs.
   - Control: every model call runs under a grant with cost, token, and time
     limits, and new Flows are fail-closed.
   - Auditability: model calls are itemized per run, credentials are withheld
     from traces, and adaptations are reviewed and reversible.
4. **How it works: "From intent to a Flow that runs without a model."** Keep
   the four-step timeline, reworded:
   - **Describe or demonstrate.** Plain language or a browser recording.
   - **Generate.** A Flow: a Router plus Subflows with `when:` conditions,
     proposed for review.
   - **Run.** The Router picks a route from live state; replay needs no key and
     no model.
   - **Diagnose and adapt.** Bounded by a cost cap, token budget, deadline, and
     no-progress guard. Proposes an adaptation you review and can revert.
5. **Features.** Two grids.
   - Core: Automation Studio, Flow Engine, Bounded Runtime Adaptation,
     Execution Grants, Client Gateway, Domain-Neutral Core, Control Panel
     Programs.
   - Web Extension: Recorder and Executor, Element Identity Scoring.
   - Each card's body comes from the audit's evidence column.
6. **Developers.** The `FluxIQ.create` / `setup` sample and a `defineFlow`
   sample, both verified against `packages/fluxiq/src` at writing time.
   Package names and versions, the "npm release pending" label, and a Node 22+
   note.
7. **Roadmap.** Three columns, from the audit only.
   - Shipped: Flow engine; Automation Studio; deterministic replay; bounded
     adaptation with review; element-identity scoring; closed failure
     vocabulary; identity & access; client gateway; extension recorder and
     executor.
   - In progress: permission-aware action gating, data extraction, real-site
     policy boundaries, compute transport.
   - Planned: npm release, hosted and managed deployments, commercial agreement
     templates.
8. **License.** Fair-code in two short lists (free for / needs an agreement),
   linking `LICENSE.md` on GitHub and license@getfluxiq.com.
9. **Follow the build.** As on the live site.
10. **Footer.** Copyright, GitHub, X, license email.

Metadata:

- Title "FluxIQ — Automate Smarter".
- A description aligned with the hero lede.
- Canonical `https://getfluxiq.com/`.
- Open Graph and Twitter card from `opengraph-image.png`.
- `robots.ts` and `sitemap.ts`, both static.

## Phases

### Phase 1: Foundation

Owns `src/app/*`, `src/components/ui/*`, `scripts/brand-assets.mjs`,
`public/brand/*`, `package.json`, `pnpm-lock.yaml`, and `docs/architecture/README.md`.

1. Put the design tokens in `globals.css` under `@theme`: colors, `--font-display`,
   `--font-body`, and the wave and pulse keyframes behind
   `prefers-reduced-motion: no-preference`.
2. Load Space Grotesk and Inter through `next/font/google` in `layout.tsx`.
   Add the full metadata, a skip link, and `<main id="main">`.
3. Write `scripts/brand-assets.mjs`, using `sharp` (already a Next dependency;
   add it as a devDependency if it does not resolve). It generates
   `src/app/icon.png` (512), `src/app/apple-icon.png` (180),
   `src/app/opengraph-image.png` (1200 × 630, the banner master centered on
   `#03001c`), and `public/brand/fluxiq-logo.webp` (288 px, for 2× at 144 px).
   Replace `favicon.ico` from the same master. Commit the outputs; each must
   pass `asset-size`.
4. Add `robots.ts` and `sitemap.ts`, with `export const dynamic = "force-static"`
   if the build requires it.
5. Add `lucide-react`. Build the UI primitives, one per file under
   `src/components/ui/`: `section-heading.tsx` (eyebrow, h2, lede),
   `link-button.tsx` (primary and ghost variants), `reveal.tsx` (client), and
   `x-logo.tsx`.
6. Update the Layout section of `docs/architecture/README.md`.

### Phase 2: Content

Owns `src/content/*` and this document's Copy Sources section. The supervisor
does this phase itself, because it needs the conversation's intent.

1. Write the typed content types and one data file per section, following the
   Page Plan.
2. Re-verify any claim not in the Claim Audit, plus both code samples, against
   Core. Record each in Copy Sources as the claim, then the file or commit.

### Phase 3: Sections

Each section directory is disjoint, so the sections can go to workers in
parallel, partitioned by directory. The supervisor then composes `page.tsx`.

1. Build one component directory per Page Plan section, matching the live
   site's markup patterns from the inventory.
2. Compose them in `src/app/page.tsx` in order, with anchor ids matching the
   header.

### Phase 4: Verification

Owns `scripts/site-check.mjs`, its tests, the `test:site` script, and CI.

1. Add `scripts/site-check.mjs`, a dependency-free CLI that audits a built
   `out/` directory and exits 1 on any finding, or when `out/` is missing. Its
   node:test suite (`scripts/tests/site-check.test.mjs`) runs against
   small HTML fixtures in temp directories, so it runs in `pnpm test` without
   a build. `pnpm test:site` runs the CLI against the real `out/`. (Revised on
   2026-09-18 from a test file that read `out/` directly, which would have had
   to either skip or fail whenever no build existed.) It asserts:
   - Exactly one `h1`, and every header anchor resolves to an id.
   - Every external link is https and on the allowlist (the two GitHub repos,
     `github.com/aidens113/FluxIQ/blob/*`, `x.com/GetFluxIQ`,
     `mailto:license@getfluxiq.com`).
   - Title, description, canonical, and `og:image` are present.
   - None of the retired phrases appear: "Coming Soon", "policy", "learns from
     your demonstrations", "patches the Flow".
   - The scripts a modern browser loads (`<script src>` in `index.html` without
     `nomodule`) total at most 200 KB gzip. Next's legacy polyfill chunk is
     excluded, because modern browsers never fetch it. The placeholder
     build measured 130 KB.
2. Add `pnpm test:site` to CI after `build`.
3. Check `pnpm preview` at 375 px and 1440 px, with and without reduced motion,
   and with JavaScript disabled for content visibility. Use Playwright
   screenshots if available; otherwise do it manually. Record what was
   exercised.
4. Run a Lighthouse pass on the preview if available. Targets: Accessibility
   and SEO 100, Performance at least 95.

## Worker Briefs

Shared values for every brief:

- Meta description, verbatim: "FluxIQ is a source-available TypeScript
  automation framework: AI generates and repairs your Flows, and deterministic
  replay runs them without a model."
- No worker runs `pnpm build`, `pnpm check`, `next dev`, or `next typegen`.
  Those write `.next/` and read other workers' half-written files; the
  supervisor runs them at integration.
- The Next.js 16 guides are in `node_modules/next/dist/docs/`. Read the relevant
  one before using a Next API.

### Brief: foundation
- Repository: this repository
- Task: build Phase 1 steps 1 to 6 as specified in Phases, with Decision 3 for motion. The details are below.
  - `globals.css`: Tailwind 4 `@theme` tokens (`--color-ink: #03001c`, `--font-display`, `--font-body` wired to the next/font variables). Body base styles: ink background, `slate-200` text, body font, `selection:bg-cyan-400/30`. Keyframes for the wave drift, the status-pill pulse, and the `[data-reveal]` rise (opacity 0 → 1, translateY 24px → 0). Every animation sits under `prefers-reduced-motion: no-preference`; the reveal also sits under `@supports (animation-timeline: view())`.
  - `layout.tsx`: Space Grotesk (500/600/700) and Inter (400/500/600) via `next/font/google`.
    - Metadata: `metadataBase`; title default "FluxIQ — Automate Smarter" with template "%s — FluxIQ"; the shared description; canonical "/".
    - Open Graph: website type, siteName FluxIQ. Twitter: `summary_large_image`, site `@GetFluxIQ`. Viewport `themeColor` `#03001c`.
    - Body: a "Skip to content" link to `#main`, hidden until focused, then `{children}`. `page.tsx` owns the header, `<main id="main">`, and the footer.
  - `scripts/brand-assets.mjs`: ESM, idempotent, sharp. Reads from `design/brand/*-master.png`. Writes:
    - `src/app/icon.png` (512) and `src/app/apple-icon.png` (180).
    - `src/app/favicon.ico`: a hand-written ICO container embedding a 32×32 PNG, replacing Next's default.
    - `src/app/opengraph-image.png` (1200×630): a cover-crop of the banner that keeps the logo and wordmark centred, plus `opengraph-image.alt.txt`.
    - `public/brand/fluxiq-logo.webp` (288×288).
    - Run it with `pnpm brand:assets`. Every output must be at most 300 KB. Open the generated images to check them visually.
  - `src/app/robots.ts` and `src/app/sitemap.ts`: static; the site URL is https://getfluxiq.com.
  - `src/components/ui/`, one component per file. Match the live-site classes quoted in the Live Site Inventory, and give every interactive element a visible focus ring.
    - `section-heading.tsx`: eyebrow, title (h2), optional lede, centred.
    - `link-button.tsx`: href, variant `primary` or `ghost`, `external` adds `target=_blank rel="noopener noreferrer"`, children.
    - `reveal.tsx`: a server component rendering `<div data-reveal>` with `className` and children.
    - `github-logo.tsx` and `x-logo.tsx`: inline SVG, `aria-hidden`, a `className` prop.
  - Update the Layout and Brand sections of `docs/architecture/README.md` to match what exists.
- Required reads: this document's Current State, Live Site Inventory, Decisions, and Phases; `docs/architecture/README.md`; the Next docs for metadata files, `next/font`, robots, and sitemap.
- Owns (may edit): `src/app/layout.tsx`, `src/app/globals.css`, `src/app/{icon.png,apple-icon.png,favicon.ico,opengraph-image.png,opengraph-image.alt.txt,robots.ts,sitemap.ts}`, `src/components/ui/**`, `scripts/brand-assets.mjs`, `public/brand/**`, `docs/architecture/README.md`
- Must not touch: `src/app/page.tsx`, `src/content/**`, `package.json`, `pnpm-lock.yaml`, `AGENTS.md`, `docs/working/**` (except your report)
- Definition of done:
  - `pnpm brand:assets` exits 0.
  - `node scripts/structure-audit.mjs` passes.
  - `pnpm exec biome check src/app src/components scripts/brand-assets.mjs` is clean.
  - `pnpm exec tsc --noEmit` shows no errors in owned files. Errors under `src/content/` belong to another worker.
- Report to: docs/working/landing-page/reports/foundation.md

### Brief: content
- Repository: this repository. `F:\!FluxIQ` and `F:\!FluxIQWebExtension` are read-only sources.
- Task: write all landing-page copy as typed data in `src/content/`, following the Page Plan, using only claims in the Claim Audit or claims newly verified against Core or Extension source.
  - Files, one exported SCREAMING_SNAKE constant each:
    - `types.ts`, the shared types.
    - `site.ts` (`SITE`): name, tagline, the shared description, url, status label "In active development", and the copyright "© 2026 FluxIQ — Automate Smarter".
    - `links.ts` (`LINKS`): the two repos, X, `LICENSE.md` on `main`, and `mailto:license@getfluxiq.com`.
    - `navigation.ts` (`NAV_ITEMS`): anchors `#how-it-works`, `#features`, `#developers`, `#roadmap`, `#license`.
    - `hero.ts` (lede, corner labels, CTAs), `why.ts`, `how-it-works.ts`, `features.ts` (a Core group and a Web Extension group), `developers.ts`, `roadmap.ts` (Shipped / In progress / Planned), `licensing.ts` (free for / needs an agreement), and `follow.ts`.
  - Content is copy only: no class names and no colours. Icons are `LucideIcon` imports from `lucide-react` 1.47; confirm each name exists.
  - Voice: developer-facing, specific, and calm. Short sentences.
    - Card bodies at most 30 words; ledes at most 45.
    - No hype words ("seamless", "revolutionary", "magic", "supercharge", "unleash").
    - Use "Flow", "Router", "Subflow", "adaptation", and "grant".
    - Never "policy", "task", "routine", "Coming Soon", "learns from your demonstrations", or "patches the Flow".
    - Never "any model" or a provider list.
  - Code samples, at most 20 lines each:
    - `FluxIQ.create` / `setup()`, verified against `F:\!FluxIQ\packages\fluxiq\src`.
    - A minimal `defineFlow` that would type-check against `packages/fluxiq/src/programs/automation-studio/dsl/`.
    - Include the "npm release pending — build from source today" note and "Node 22+".
- Required reads: this document's Current State, Claim Audit, Decisions, and Page Plan; the Core source needed for the samples.
- Owns (may edit): `src/content/**`
- Must not touch: every other path, and both FluxIQ repositories
- Definition of done:
  - `pnpm exec biome check src/content` is clean.
  - `pnpm exec tsc --noEmit` shows no errors in `src/content/`.
  - `node scripts/structure-audit.mjs` passes.
  - The report has a "Copy Sources" list: each claim not in the Claim Audit, with its file path or commit.
- Report to: docs/working/landing-page/reports/content.md

### Brief: site-check
- Repository: this repository
- Task: build Phase 4 steps 1 and 2 (see Phases). `scripts/site-check.mjs [--out <dir>]`, default `out`, dependency-free ESM. It parses `out/index.html` with regexes and prints `<rule>: <message>` lines. It exits 1 on findings or when `out/index.html` is missing, and otherwise prints `site-check: passed`. Export the pure checker for tests. Rules:
  - The document has `<html lang="en">`, exactly one `<h1>`, and an `alt` attribute on every `<img>`.
  - Every in-page `href="#x"` resolves to an element `id="x"`. `#main` and the five `NAV` anchors (`how-it-works`, `features`, `developers`, `roadmap`, `license`) must exist.
  - Every `<a>` href that is not an in-page anchor is in the allowlist, and every `target="_blank"` link has `rel` containing `noopener` and `noreferrer`. The allowlist:
    - https://github.com/aidens113/FluxIQ
    - https://github.com/aidens113/FluxIQWebExtension
    - https://github.com/aidens113/FluxIQ/blob/main/LICENSE.md
    - https://x.com/GetFluxIQ
    - mailto:license@getfluxiq.com
    - `/` and https://getfluxiq.com/
  - These are present: `<title>`, meta description, `<link rel="canonical" href="https://getfluxiq.com/">`, an absolute `og:image`, and `twitter:card`.
  - None of these phrases appear in visible text (tags stripped) or in meta content, case-insensitive: "coming soon", the whole word "policy", "learns from your demonstrations", "patches the flow", "any model", "lorem", "todo".
  - The gzip size of all `.js` under `out/_next/static` is at most 200 KB.
- Tests: `scripts/tests/site-check.test.mjs`, node:test with fixture directories under `os.tmpdir()`. One passing fixture, one failing case per rule, and the CLI's exit codes (0, 1, and a missing `out/`).
- Add `"test:site": "node scripts/site-check.mjs"` to `package.json` scripts. In `.github/workflows/ci.yml`, add `pnpm test:site` after `pnpm build`.
- Required reads: this document's Current State and Phases; `scripts/structure-audit.mjs` and its test, for house style
- Owns (may edit): `scripts/site-check.mjs`, `scripts/tests/site-check.test.mjs`, `package.json` (the `scripts` block only), `.github/workflows/ci.yml`
- Must not touch: `src/**`, `public/**`, `docs/**` (except your report), `pnpm-lock.yaml`, and the other scripts
- Definition of done:
  - `pnpm test` passes, with every existing test still passing.
  - `node scripts/structure-audit.mjs` passes.
  - `pnpm exec biome check scripts package.json .github` is clean.
  - Do not run `pnpm build`: the page is being built concurrently. The supervisor runs `test:site` at integration.
- Report to: docs/working/landing-page/reports/site-check.md

## Copy Sources

Phase 2 fills this with one line per claim that is not in the Claim Audit:
the claim, then the file or commit that supports it.

## Work Ledger

### 2026-09-18 — Repository setup and landing page plan
- Agent: supervisor; claim audit by one read-only Explore agent, 8 of its claims re-checked by the supervisor (Core lines 198/200/690, commits f774b43 and 2c98fbd, failure record, `defineFlow`, versions, npm 404, scoring file)
- Changed: whole repository created (scaffold, config, AGENTS.md, CLAUDE.md, docs, scripts, CI, brand masters)
- Why: set up the project to FluxIQ family standards before building the page; plan the page with corrected claims
- Validation: `pnpm check` -> "structure: passed (8 files)", "working-docs: passed (2 documents)", Biome no fixes, typegen and tsc exit 0; `pnpm test` -> 28 pass, 0 fail; `pnpm build` -> exit 0, `/` and `/_not-found` prerendered to `out/`; Next's `writeAgentFiles` on a copy -> AGENTS.md "unchanged". `pnpm preview` not run.
- Outcome: Accepted
- Follow-up: Phase 1

### 2026-09-18 — Phase 4 built-site check
- Agent: worker `site-check`, one revision requested by the supervisor (js-budget counts only modern-loaded scripts)
- Changed: `scripts/site-check.mjs`, `scripts/tests/site-check.test.mjs`, `package.json` (`test:site`), `.github/workflows/ci.yml`
- Why: fail the build on structural, link, metadata, retired-phrase, and JS-weight regressions in the built page
- Validation: supervisor ran `pnpm test` -> 44 pass, 0 fail; `pnpm exec biome check scripts` -> no fixes; `node scripts/site-check.mjs` on the placeholder `out/` -> exit 1 with only the expected anchor and meta findings, and no js-budget finding
- Outcome: Accepted
- Follow-up: run `pnpm test:site` against the real build at integration

## Open Questions

- **Hosting target** (owner: user). Static export deploys anywhere. The domain
  currently points at Hostinger. The options are uploading `out/` to Hostinger,
  or connecting the GitHub repository to Vercel or Cloudflare Pages for
  per-branch previews. The user's choice settles it; phases 1 to 4 do not
  depend on it.
- **`main` branch** (owner: user). Only `dev` is pushed, so GitHub shows `dev`
  as the default branch. Creating `main` from `dev` needs the user's approval.
- **Stale Core documentation** (owner: user). Core's `current-system.md:78`
  says the Automation Studio port is planned, and `roadmap.md` lists
  already-built features as planned. Those are Core's documents, so fixing them
  is Core work, done only if the user asks.
