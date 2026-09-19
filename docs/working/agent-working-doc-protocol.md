# Agent Working Document Protocol

Status: Active
Status detail: Adopted at repository creation; every working document follows it from the start.
Created: 2026-09-18
Last updated: 2026-09-18
Owner: Senior supervisor agent
Scope: How the supervisor and workers use `docs/working/` as durable memory and as the coordination substrate for multi-agent work.
Paired document: none
Related: [AGENTS.md](../../AGENTS.md), [working document index](./README.md)

---

## Current State

- This protocol is in force for every document under `docs/working/`. It was
  copied from `F:\!AgentBrain\templates\agent-working-doc-protocol.md` on
  2026-09-18, minus the cross-repository pairing section, because this
  repository is not paired with another.
- `scripts/working-docs-audit.mjs` enforces the header block, `Current State`
  placement and budget, ledger `Validation` lines, the size threshold, and the
  index. It runs in `pnpm check`; `pnpm docs:index` regenerates the index.
- Nothing is pending. Change this document only when the brain template changes
  or this project genuinely needs a rule to differ.

---

## Why This Exists

Agent context does not survive a session. Workers share no context with each
other or with the supervisor. A worker's completion report is a claim, not a
record. Working documents are therefore the only channel through which one
agent's knowledge reaches the next, and they have to be treated as a durable
data structure rather than as prose that accumulates.

Prose that accumulates fails predictably, and every rule below prevents one of
those failures: documents outgrow a task budget, current truth gets buried in
a chronological log, free-text status cannot be triaged or indexed, and an
effort tracked in two repositories drifts because neither side owns it.

---

## The Protocol

### Directory layout

```text
docs/working/
  README.md                              index of every working document
  <effort-slug>.md                       the working document
  <effort-slug>/
    reports/<agent-label>.md             worker write-back, one file per agent
    archive/YYYY-MM-DD-<topic>.md        compacted history
```

The per-effort subdirectory is created only when it is needed: when workers
are dispatched, or at the first compaction.

### Header block

Every working document opens with an H1 followed by this block, one field per
line, no blank lines between fields:

```text
Status: <controlled value>
Status detail: <one sentence>
Created: YYYY-MM-DD
Last updated: YYYY-MM-DD
Owner: <role, agent, or area>
Scope: <one or two lines>
Paired document: <path in the other repository, or "none">
Related: <links>
```

`Status` takes exactly one of:

| Value | Meaning |
| --- | --- |
| `Active` | Work is in progress or queued. |
| `Paused` | Deliberately stopped; may resume. Say why in `Status detail`. |
| `Blocked` | Cannot proceed. Name the blocker in `Status detail`. |
| `Complete` | Delivered and validated. Retained for reference. |
| `Superseded` | Another document owns this now. Link it in `Status detail`. |
| `Archived` | Historical only. Do not plan current work from it. |
| `Unclassified` | Predates this protocol. Needs a triage pass. |

Nuance belongs in `Status detail`, never in the `Status` value itself.

### Section order

1. `## Current State` — required, authoritative, under 150 lines.
2. Reference sections — objective, design, ownership, invariants, phases.
3. `## Work Ledger` — append-only history.
4. `## Open Questions` — unresolved decisions, each owned by someone.

`Current State` is rewritten in place. It answers, for an agent with no prior
context: what is true now, what is done, what is not done, what is next, what
is blocked. If `Current State` and a ledger entry disagree, `Current State`
wins and the ledger entry is history.

### Work Ledger entries

Append one entry per completed unit of work. Keep each under 15 lines.

```text
### YYYY-MM-DD — <short title>
- Agent: <supervisor | worker label>
- Changed: <files or modules>
- Why: <one or two lines>
- Validation: `<exact command>` -> <actual observed result>
- Outcome: Accepted | Partial | Reverted | Blocked
- Follow-up: <next action, or "none">
```

The `Validation` line records the command that ran and what it actually
printed. "Worker reported success" is not a validation result and must not
appear. If nothing was run, write `not validated` and say why. This mirrors
the rule in `AGENTS.md` that completion reports are not verification by
themselves.

### Compaction

When a document passes 800 lines, or its ledger passes 20 entries, the next
agent to touch it compacts before doing anything else:

1. Fold settled outcomes into `Current State`.
2. Move superseded detail into
   `docs/working/<effort-slug>/archive/YYYY-MM-DD-<topic>.md`.
3. Leave a one-line pointer at the point of removal.
4. Record the compaction as a ledger entry.

Compaction removes redundancy, not evidence. Anything that could still explain
a decision moves to the archive rather than being deleted.

### Worker briefs and reports

Parallel workers must never edit the same file. Two agents editing one
markdown document will silently lose each other's writes. So:

- The supervisor writes a brief into the working document **before**
  dispatch, under a `## Worker Briefs` section.
- Each worker writes its findings to its own file at
  `docs/working/<effort-slug>/reports/<agent-label>.md`.
- Workers never edit `Current State` or the `Work Ledger`.
- A worker writes only its owned files and its report, using filenames unique
  to it. Workers never share a scratch file: two did once, and one overwrote
  the other's staged block after the splice.
- The supervisor reads the report files, independently verifies the claims,
  merges the outcome into `Current State`, and appends the ledger entry.

Brief format:

```text
### Brief: <agent-label>
- Repository: <this repository | the paired repository>
- Task: <what to accomplish>
- Required reads: <this document's Current State, plus specific files>
- Owns (may edit): <explicit paths>
- Must not touch: <explicit paths>
- Definition of done: <observable outcome, including checks to run>
- Report to: docs/working/<effort-slug>/reports/<agent-label>.md
```

`Owns` and `Must not touch` are what make parallel work safe. Partition by
file, never by topic. If two briefs need the same file, the work is serial.

A brief is at most 40 lines. The worker's operating rules — what to read,
what not to touch, never committing — live in the global `worker` agent
definition, not in the brief.

Report file format:

```text
# Report: <agent-label>
## Outcome
Done | Partial | Blocked, with one line of context.
## What changed and why
## Commands run and observed results
## Not verified
## Open questions or contradictions found
```

Return contract, the worker's final message, at most 12 lines:

```text
Outcome: Done | Partial | Blocked
Changed: <files>
Validation: `<command>` -> <observed result, or "not run" and why>
Not verified: <what the worker could not or did not check>
Report: docs/working/<effort-slug>/reports/<agent-label>.md
Notes: <at most three lines>
```

Everything beyond those lines belongs in the report file.

### Index

`docs/working/README.md` lists every working document with its status, owner,
size, one-line scope, and paired document. It is the cheapest possible entry
point: an agent reads it to find the right document instead of listing the
directory and guessing. Any agent that creates, retires, or re-statuses a
document updates the index in the same work unit.

### Durability

Working documents are tracked in git and committed as part of the work that
changes them, not batched at the end. An uncommitted working document is one
crash away from taking the project's memory with it.

---

## Agent Operating Rules

**Starting a task, as the senior supervisor agent**

1. Read `AGENTS.md`.
2. Read [docs/working/README.md](./README.md) and pick the relevant document.
3. Read that document's `Current State` and nothing else yet.
4. Read deeper sections, the ledger, or the archive only when the task demands
   it.

**Starting a task, as a worker**

Read your brief, the files it names, and the `Current State` of the working
document it points to. Nothing else: not the index, not the rest of that
document, not the repository's planning documents. Reading more is how a
worker spends the context its actual task needs. If the brief is not enough
to do the work correctly, say so rather than reading broadly — an
insufficient brief is the supervisor's defect to fix.

**During a task**

Record decisions, findings, and validation results as they happen. A working
document updated only at the end of a session is a summary, not memory: the
reasoning that would help the next agent is exactly what gets dropped.

**Ending a task**

Update `Current State`, append the ledger entry, update the index if status
changed, and commit. Per `AGENTS.md`, leave enough for the next agent: what
changed, why, files affected, tests performed, known failures, remaining work,
and the recommended next task.
