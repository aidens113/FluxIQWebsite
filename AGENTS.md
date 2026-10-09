# Agent Instructions

## Agent Roles

**Senior supervisor agent** — the agent the user prompts directly. It owns
coordination, delegation, integration, conflict resolution, verification, and the
final result. It declares the workflow mode, maintains working documents, and is
the only role that commits and pushes.

**Worker** — any agent invoked by another agent rather than by the user. A worker
executes one bounded brief, writes back to its own report file, and reports
honestly on what it did and did not verify. Workers never declare a mode, never
edit a shared document, and never commit or push.

A worker's completion report is a claim, not verification. The senior supervisor
agent confirms the result itself before treating it as done.

## Start Here

This repository is the public marketing site for FluxIQ at getfluxiq.com: a
Next.js App Router site built as a static export. It is not the framework. FluxIQ
Core is `aidens113/FluxIQ` (locally `F:\!FluxIQ`) and the browser client is
`aidens113/FluxIQWebExtension` (locally `F:\!FluxIQWebExtension`). Those
repositories are the source of truth for every product claim this site makes, and
this repository only reads them: never edit them from here. If they contain stale
or wrong documentation, tell the user instead. `src/app/` owns routes and page
metadata, `src/components/` owns presentation, and `src/content/` owns copy and
link data; components import content, never the reverse. The site has no
secrets, environment variables, or API keys. Its one analytics tag, Google
Analytics behind a cookie banner (`src/content/analytics.ts`), was approved by
the user on 2026-10-09; adding any other needs the user's approval first.

What you need to read depends on your role. Context is a budget; do not spend it
on documents your task will not use.

**Senior supervisor agent.** Read this file. Then, when the work warrants it:

- The [working document index](docs/working/README.md), then the `Current State`
  section of the relevant document, before touching work already in progress.
- The [site architecture](docs/architecture/README.md) before creating, moving,
  or splitting source files, changing design tokens, or when you need the exact
  commands. Skip it for copy-only edits.
- The [deployment guide](docs/architecture/deployment.md) before changing the
  build output, the host files, the Node server, Docker, or the workflows.

**Worker.** Read your brief, the files it names, and the `Current State` of the
working document it points to. Do not read the planning documents, the rest of a
working document, or the rest of this file unless your brief says to. If your
brief is not enough to do the work correctly, say so instead of reading broadly —
an insufficient brief is the supervisor's defect to fix.

**Both roles.** The boundary, claim-accuracy, code-structure, and validation rules
in this file are binding whether or not you read the background documents.
Re-read background documents only when the task changes scope or the user asks
for their current guidance.

## Product Claims

Every statement the site makes about what FluxIQ does must be checked against the
Core or Extension repository at the time it is written, and recorded with its
source (file path or commit) in the working document that introduced it. FluxIQ
moves quickly and its own planning documents lag the code, so prefer code and
`Current State` sections over roadmap prose. Use FluxIQ's own vocabulary — a
Flow, not a policy, task, or routine — and do not present a planned or partial
capability as shipped, or a shipped one as planned. The name is always "FluxIQ".

## Working Documents Are Agent Memory

Agent context does not survive a session, and workers share no context with each
other or with the supervisor. Documents under `docs/working/` are the only
channel through which one agent's knowledge reaches the next.

- Record findings, decisions, and validation results as the work happens, not as
  an end-of-task summary.
- Brief every worker in writing before dispatch; each writes back to its own
  report file. Partition briefs by file, never by topic.
- Commit working document updates with the work that changed them.

The [agent working document protocol](docs/working/agent-working-doc-protocol.md)
defines layout, status vocabulary, ledger format, compaction, and brief format.
Read it when creating or restructuring a working document, not for routine
updates. `pnpm docs:index` regenerates the index from document headers; the audit
only sees documents git tracks, so `git add` a new document first.

## Workflow Modes

The senior supervisor agent classifies each user prompt into one of the modes
below and states it in the first user-facing response as `Mode: <mode name>`,
listing several in execution order if more than one applies. Do not repeat the
label in later updates for the same prompt, but announce a transition once when
it happens. Follow the user's intent, and let the newest instruction take
precedence. If the intended mode is genuinely unclear, ask before beginning
substantive work; minimal inspection to explain the ambiguity is allowed.

### 1. Plan And Write Working Doc

For investigation, audit, design, scoping, or planning before implementation.
Inspect the relevant code, scripts, and documentation first, then create or
update a document under `docs/working/` recording findings, decisions,
dependencies, risks, validation requirements, and detailed implementation phases
and steps. Make it concrete enough that another agent can execute it without
rediscovering the intended architecture. Do not begin broad implementation unless
the user also asks to execute the plan; small investigative probes are allowed
when needed for accuracy.

### 2. Execute Plan With Workers

For implementing an existing plan, completing its phases, or when the user asks
for subagents.

- Read the current working document before assigning or implementing work.
- Divide independent phases among workers where parallel work is safe,
  partitioning by file. If two briefs need the same file, the work is serial.
- Update the working document as each step is assigned, completed, validated,
  blocked, or revised, and record the results of the checks you run.
- Continue through every requested phase unless the user pauses the work or a
  genuine blocker requires user input.

### 3. Editing, Iteration, And Bug Fixes

For focused implementation, refinements, regressions, debugging, test failures,
and incremental work that does not require executing a full plan. Reproduce or
inspect current behavior before changing code whenever feasible, and trace bugs
to their underlying cause instead of patching symptoms. Keep edits scoped,
preserve established architecture, and add or update tests in proportion to risk.
Update authored documentation when the change is substantial; a new working
document is not required for every focused edit.

### 4. Testing And Live Validation

For testing existing behavior, verifying completed work, or reproducing a problem
in a running system.

- Establish the expected behavior, then choose the narrowest useful combination
  of type checks, unit tests, smoke tests, builds, and manual runs.
- Inspect actual results, and record exact failures, reproduction steps,
  environment details, and measured results. Do not report success from
  compilation alone or from a worker's completion report, and distinguish
  verified behavior from remaining assumptions.
- This mode does not authorize broad product changes. If testing exposes a defect
  the user asked to fix, move to mode 3, then return here to verify.

Live checks run against the static build: `pnpm build`, then `pnpm preview`
serves `out/` locally. Exercise a phone width (375 px) and a desktop width
(1440 px), and with reduced motion on. An agent may start and stop `pnpm dev` or
`pnpm preview` for its own checks and stops what it started; leave a server
running only when the user asks for one, and give its local URL.

If a prompt spans multiple modes, begin with the earliest necessary mode and
transition explicitly as work advances.

### Delegation

Delegate to a worker when the task needs more than about five files read whose
content the supervisor will not need afterwards, when a run-fix-rerun loop is
expected, when edits are bulk and partitionable by file, or when independent
pieces touch no common file. Keep with the supervisor one- or two-file edits it
already understands, verification of worker claims, integration, conflict
resolution, and anything that needs the user's conversation context. Dispatch has
fixed overhead and a worker's claim still needs verifying, so reads are the cost:
route discovery through a worker or `Explore` and read the conclusion. Briefs
follow the protocol format, at most 40 lines; the worker's final message follows
the protocol's return contract.

## Code Structure

- **One exported component per file**, named for that component. No `utils`,
  `helpers`, `misc`, or `common` files or directories.
- **A shared filename prefix is a directory.** Three or more files sharing a
  `noun-` prefix become `noun/` with the prefix stripped.
- **Tests live in a `tests/` subfolder of the directory that owns their
  subject.** `a/b.tsx` is covered by `a/tests/b.test.tsx`; never loose beside
  source, never in a separate mirrored tree.
- **Served assets stay small.** Nothing under `public/` exceeds 300 KB; source
  masters live in `design/` and are never served.

`scripts/structure-audit.mjs` runs first in `pnpm check` and fails the build on
any of the above, plus file length (300 lines under `src/`, 500 under `scripts/`)
and directory size (25 source files). There is no baseline: every finding fails.
Placement judgement — whether a component belongs in its directory, whether a
split was the right cut — remains a review obligation.

## Documentation Maintenance

After substantial changes, update authored documentation in the same work unless
the user says not to. When the user asks for documentation updates, treat them as
required work. Keep current-state design in `docs/architecture/` and
task-specific plans in `docs/working/`.

Substantial here means: adding, removing, or reordering a page section or route;
changing design tokens, fonts, or the brand assets; changing the build output
mode or hosting target; and adding a dependency, script, or check.

## Validation

Run the narrowest relevant checks while iterating, then all three before the
final response for any code change:

```bash
pnpm check   # structure audit, working-docs audit, Biome, TypeScript
pnpm test       # node:test suites under scripts/**/tests
pnpm build      # static export to out/, plus the generated host files
pnpm test:site  # audit the built out/index.html
```

Compilation and tests cannot prove layout, responsiveness, motion, contrast, or
that the copy matches what FluxIQ actually does. Check those in the built site at
the widths above when feasible, and state what was and was not exercised.

## Committing And Pushing

Only the senior supervisor agent commits or pushes. Workers never do.

Push every significant feature to the `dev` branch on `origin` without being
asked, as soon as it is done. A significant feature is a completed plan phase, a
new or reworked page section, a new check or script, or a dependency change.
Push each one when it lands; do not batch several into one end-of-session push.
A push is due once all of the following hold:

1. The work is a complete, coherent unit — not a partial refactor or an
   experiment left mid-flight.
2. The relevant checks were actually run and observed to pass. Compilation alone,
   or a worker reporting success, does not qualify.
3. Nothing known to be broken is included.

Otherwise: commit locally and explain what is holding the push. Always state what
was pushed and what was not.

These actions still require explicit user approval every time: pushing to `main`
or opening a pull request into it; force-pushing anything; rewriting history,
including `filter-repo`, `rebase -i`, and amends to already-pushed commits; and
deleting branches or tags on the remote.

The `deploy` branch holds the built site for hosts that pull files without
building, such as Hostinger's website Git deploy. CI generates it from `main`.
Never edit, commit to, or push it by hand; change `main` and let the workflow
publish.

Never commit `node_modules/`, `.next/`, `out/`, `.env*` files, or an image over
the asset budget under `public/`. Never commit secrets. Never use `--no-verify`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
