# Client Briefings and meeting preparation

Status: browser-local reference implemented; authenticated persistence, automated research and production review remain engineering work. Source method: Dennis's **Social Intelligence & Counterparty Due Diligence v1.1**, October 12, 2026, with report-template, evidence-standard, affiliation-discovery and search-playbook references. The complete source package was read during implementation. No real subject dossier or completed client profile is committed here.

## Purpose and entry points
Prepare a source-backed client/prospect briefing before a commercial mortgage, business financing, developer, referral or investor discussion. Client Brain describes the brokerage using Mission Control; the briefing describes a prospect/counterparty. Never conflate these entities. Start from the Client Briefings view or an opportunity's **Prepare client briefing** action. Link back to company/contact/opportunity without fabricating a construction project for business finance.

Inputs: exact person, legal company/aliases, domain, geography/jurisdiction, purpose, depth/output mode, project names and user-known relationship. Source opportunity fields start as user-supplied or synthetic context. Missing context stays unknown. Resolve namesakes before linking identities; ask for one clarifying identifier only if a defensible match is impossible.

## Report and output contract
- Quick brief: verdict, identity, three gaps and next action; target one page after a dedicated print-layout implementation.
- Standard: eleven sections in the detailed original template (the original skill summary says ten): verdict; identity; professional profile; social footprint; business offering/technology; external references/contradictions; professional relationships; cross-company affiliations; project/transaction track record; diligence/regulatory questions; three strategic actions.
- Investor-grade: standard plus sponsor track-record matrix, site control/approvals, financing proof, LP/GP and issuer roles, offering/distribution checks and disclosure annex. An export with missing evidence is not completed investor diligence.
- Battlecard: executive summary, verified personalization, business/pain hypotheses, talking points, discovery questions, objections and next action.

Reference exports are Markdown text; page limits and PDF composition are not implemented. Unfilled sections say not researched/not verified. Record actual tools used and access limits. Generated summaries are drafts and source pointers, never automatically verified claims.

## Claim ledger
Use stable claim IDs, never positional IDs that change after deletion. Each substantive/material assertion links to exact source records and caveats:

| Code | Meaning |
| --- | --- |
| V | Verified: authoritative record appropriate to the exact assertion |
| C | Corroborated: independent attributable sources, at least one strong |
| S | Self-reported: subject website, social bio, deck or interview |
| U | User-supplied: workflow context, not independently verified |
| A | Analyst inference: explicit premise and uncertainty |
| N | Not verified: unconfirmed, not disproven |
| X | Excluded collision: namesake not linked to the target |

Preserve source URL, publisher, source class, published/event/retrieved dates separately, content/version hash where permitted, retrieval tool/run, reviewer and exact supporting excerpt within source rights. Different URLs, providers or domains do not establish independent provenance: detect syndication and common origin. A company's page substantiates what it says, not its performance. Numeric credibility/fraud scores are out of scope.

A material legal role, license, ownership, project completion, funding, return or adverse finding requires its own evidence record. Shared name, city, photo or area code cannot establish a cross-company identity. Keep CEO/director/shareholder/registered-agent roles distinct; document identity bridges and unresolved contradictions. Never attribute team/personal work to a current legal entity without evidence. A term sheet is not funded financing; a forecast is not a realized return. Search absence is not a negative registration or misconduct finding.

## Production persistence and review
Reconcile proposed briefing, immutable revision, claim, source, claim-source and review records against the real schema. All tenant-private records/jobs/exports use authorized `workspace_id`, including parent FKs. Public source material still cannot leak one tenant's dossier to another. The existing Mortgage Mix workspace mapping is a dependency to implement/verify, not assumed already installed.

Bind each revision to subject identifiers, source versions, template/model version and active Client Brain version. Use optimistic locking, actor/time audit, immutable review records and transaction-safe status changes. States: draft → researching → needs-review → reviewed-working-brief; partial/failed/cancelled jobs remain explicit. Identity ambiguity or source contradictions can hold review. Report/source/profile changes invalidate prior review; historical reviewed revisions remain available.

Reviewer must check target/collisions, every material assertion's support, labels, gaps, privacy and next action. A reviewed working brief does not certify diligence, approve credit or authorize sending. Separate outreach/contact-basis approvals remain MC-08. Chief of Staff may plan/assign research and report blocked decisions; it cannot self-verify findings or count completed research as a held qualified meeting.

## Financing conversation content
Commercial property: authority, sponsor/entity, site control, asset/stage, purpose, amount, timing, current debt/lender and evidence needed. Business financing: cash cycle, working capital, receivables/payables, equipment or acquisition purpose and borrowing entity. Lender/product fit remains a hypothesis until facts are confirmed. Use three concrete next actions with owner/proof/expected outcome, and a discovery CTA appropriate to the active Brain. Keep investor solicitation and underwriting conclusions outside automatic generation.

See [research providers](RESEARCH_PROVIDERS.md), MC-17–MC-20 in [the backlog](IMPLEMENTATION.md), and the runnable `prototype/#briefing` view.
