# Working Document Index

Every working document in this repository is listed here, grouped by the
`Status` field of its header block. This index is derived from those headers
and regenerated when a document is created, retired, or re-statused; edit the
document's header, not this table. Read it first, pick the relevant document,
then read that document's `Current State` section before anything else.

Format, status vocabulary, ledger rules, worker briefs, and cross-repository
pairing are defined in
[Agent Working Document Protocol](./agent-working-doc-protocol.md).

## Active

| Document | Owner | Lines | Scope | Paired |
| --- | --- | --- | --- | --- |
| [agent-working-doc-protocol.md](./agent-working-doc-protocol.md) | Senior supervisor agent | 242 | How the supervisor and workers use `docs/working/` as durable memory and as the coordination substrate for multi-agent work. | none |
| [deployment.md](./deployment.md) | Senior supervisor agent | 230 | Make the repository deployable, unchanged, to Hostinger (Git deploy or Node.js web app) and to other CI/CD targets (Docker, Netlify, Cloudflare Pages, Vercel, any static host); excludes choosing or configuring the user's live account. | none |
| [hero-demo.md](./hero-demo.md) | Senior supervisor agent | 422 | Replace the home page's run-history table with an immediately impressive, scripted demo of a website being automated by the FluxIQ extension; excludes any live or recorded use of the real extension. | none |
| [site-v2.md](./site-v2.md) | Senior supervisor agent | 124 | Replace the gradient-glow landing page with design direction B (dark, one amber accent), rewrite the copy against FluxIQ Core and Web Extension dev, and add an /extension/ page; excludes choosing the final logo and changing the hosting setup. | none |

## Complete

| Document | Owner | Lines | Scope | Paired |
| --- | --- | --- | --- | --- |
| [landing-page.md](./landing-page.md) | Senior supervisor agent | 590 | Rebuild the getfluxiq.com landing page in Next.js with copy corrected against the FluxIQ repositories; excludes hosting cutover and any page beyond the landing page. | none |

⚠ marks documents over the 800-line compaction threshold (0 of 5 here).
Compact them the next time work touches them; do not schedule a bulk rewrite.
