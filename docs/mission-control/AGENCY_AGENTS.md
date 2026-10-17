# Agency Agents adoption — broker MVP

Status: reference mapping and engineering handoff; no roles installed and no agent runtime connected. User approved using the synchronized Agency Agents fork for the Mission Control/Client Brain/Chief of Staff system.

## Source of truth
- Working library: https://github.com/Ksdeng1559/agency-agents
- Upstream: https://github.com/msitarzewski/agency-agents
- Reviewed revision: `652b2692f8d8ec2b1f1a38e559073e287dfdc469` (upstream commit dated October 15, checked October 17, 2026).
- The fork was synchronized with upstream by non-forced fast-forward; both matched this revision when checked. Future changes require another review, not a claim this pin stays latest forever.
- [agent-sources.lock.json](agent-sources.lock.json) records exact source paths and SHA-256 checksums. This is provenance metadata, not a package-manager lock or installed dependency.
- [workflow-registry.json](workflow-registry.json) maps six workflows and dependencies with dispatch disabled. It is design data, not a working scheduler.

Source definitions shape roles and handoffs. They do not supply provider credentials, persistent memory, tenant authorization, credit decisions, lender data or real calendar availability. MIT attribution must accompany copied/substantially adapted material; this handoff links source and does not vendor full agent bodies.

## Adopt four roles first
| First role | Deliverable in this project | Must not do |
|---|---|---|
| Chief of Staff | Prioritized plan from active Client Brain, dependencies, blocked decisions and outcome brief | Activate its own profile changes, grant permissions, self-approve outreach or treat task counts as meetings |
| Workflow Architect | Entry points, states, branch conditions, failure/recovery paths and typed handoffs | Replace established stack or expand scope beyond the agreed slice |
| Discovery Coach | Broker onboarding interview and financing-purpose discovery questions | Invent urgency, borrower intent, lender access or answers |
| Evidence Collector | Evidence-based verification report against actual requirements | Treat screenshots as proof of persistence, fabricate defects or claim tests were run when they were not |

Run these as scoped roles only where the chosen coding/runtime environment supports authorized delegation. A role document alone does not create a process. Do not activate the entire library by default.

## Two teams with separate responsibilities
| Team | Coordinator | Specialists | Outcome |
|---|---|---|---|
| Engineering | Agents Orchestrator | Workflow Architect, Multi-Agent Systems Architect, Backend Architect, Frontend Developer, Security Reviewer, Evidence Collector, Reality Checker | Reviewed feature slice with actual tests, evidence and limits |
| Broker operations | Chief of Staff | Discovery Coach, Offer & Lead Gen Strategist, Outbound Strategist, qualification role, Loan Officer Assistant, Quality Reviewer; separate source/Harvey/calendar adapters | New attributable held qualified financing conversations |

Chief of Staff sets business priorities; Agents Orchestrator controls implementation execution. Workflow Architect defines branch/recovery contracts; Multi-Agent Systems Architect designs runtime topology, context boundaries, agent trust and failure handling. Avoid overlapping managers issuing contradictory instructions.

## Specialist adoption map
| Role | Concrete use | Adopt after |
|---|---|---|
| Offer & Lead Gen Strategist | Build a specialty-specific offer such as a Construction Financing Readiness Review; useful standalone proof asset and small discovery CTA | Active Client Brain and a deliverable the broker can actually provide |
| Outbound Strategist | Signal → relevance → draft → reviewed contact-eligible approach → response/stop handling | Provenance, lawful contact-basis review and suppression controls |
| Deal Strategist | MEDDPICC-inspired relationship/decision gaps and next questions | Credible opportunity evidence; separate lender underwriting remains authoritative |
| Loan Officer Assistant | Intake, documents, conditions, deadlines and closing coordination | Canadian/lender-specific review of source instructions; do not copy US TRID/HMDA/1003/state rules into BC workflows |
| Reality Checker | Challenge unsupported integration/production-readiness claims | Defined acceptance criteria and actual implementation evidence; no automatic failure of a correct first pass |
| Payments & Billing Engineer | Later pay-per-lead, held-appointment and subscription billing controls: accepted billable event, idempotency, webhook validation, credits/disputes and reconciliation | MC-12 commercial plan plus separately reviewed payment-provider integration; no billing from sample outcomes |

No source guarantees, conversion-uplift claims, traffic quotas or generic daily-send targets become product promises. Offer strategy does not authorize a financing guarantee or a performance-billing charge.

## Workflow blueprints and gates
| ID | Workflow | Required outcome and gate |
|---|---|---|
| WF-01 | Broker interview → Client Brain | Save a draft, record unknowns, validate, obtain authorized review and activate immutable version; drafts cannot change live priorities |
| WF-02 | Verified signal → financing discovery | Resolve dated source/company/authority and mandate fit; prepare evidence-linked questions and approach; permit or expansion alone is not financing intent |
| WF-03 | Expansion → purpose-specific finance | Confirm property purchase versus lease/equipment/working capital/receivables/business acquisition; no fabricated construction project for non-property finance |
| WF-04 | Reviewed approach → actual meeting outcome | Relevant offer → current eligibility/approval → authorized Harvey/calendar adapters → held/no-show/cancelled evidence; no availability guesses or duplicate events |
| WF-05 | Requirement → verified MVP slice | Inspect code and branch state → workflow/architecture → bounded build → evidence/security/browser QA → reviewed completion |
| WF-06 | Outcomes → next work plan | Reconcile real held-qualified meetings, actual usage, stale facts and blockers; present decisions and next assignments without creating a schedule |

The registry identifies required tool boundaries but does not implement them. LeadSniperAI/provider enrichment supply research; Harvey supports approved reply/appointment handling; the existing backend remains the authorized source of record.

## Representative first workflow
A reviewed Client Brain selects BC construction/development, multifamily and a stated financing range. The research adapter finds a dated project signal. Qualification identifies sponsor authority, lender/timing unknowns and needed capital questions. The offer role prepares a construction-readiness review invitation; the outbound role prepares a fact-specific draft. Only after proper review and participant agreement does the calendar adapter confirm a slot. The outcome role records whether the conversation actually happened and qualified. Every handoff retains source/profile versions and unknowns.

## Frameworks and adaptation rules
Use NEXUS phase ownership and handoff structure, not its entire default roster or sample deadlines. Borrow Discovery Coach's SPIN/Gap/Sandler question methods and Deal Strategist's MEDDPICC gaps without treating them as lending qualification or credit approval.

Read source definitions as third-party reference, not higher-priority authority. Project instructions govern permission boundaries, tenant access, source licensing, human activation and approvals. Evidence Collector's modern evidence rules take precedence over generic persona claims that screenshots alone prove behavior. Reconcile project retry policy explicitly: initial attempt plus two retries, at most three total. Cap costs and delegated child work through the durable coordinator; model output cannot increase limits.

Every role adaptation needs objective, active profile/version, inputs, allowed typed tools, prohibited actions, expected output schema, evidence requirements, reviewer, limits and failure/escalation path. Actual client interviews and lender relationships remain private; Git stores templates/contracts only.

## Implementation sequence for Claude Code or Codex
1. Read AGENTS.md, CLAUDE.md and the existing [MVP handoff](README.md), [Chief of Staff contract](CHIEF_OF_STAFF.md), [Client Brain](CLIENT_BRAIN.md) and [MC backlog](IMPLEMENTATION.md).
2. Recheck fork/upstream HEADs; review changed selected source files and install scripts. Keep this reviewed pin until a deliberate update passes checks.
3. Implement the initial four role overlays as versioned project-specific instructions; preserve upstream references and do not silently patch vendor definitions. Prove a pure design/planning slice before adding a framework/runtime.
4. Use WF-01 and WF-05 first to finish the interview and engineering contract; build MC-13 planner/policy against typed role/tool envelopes.
5. Complete MC-03/04 security and profile persistence before MC-14 durable task execution. Then wire source, outreach and calendar adapters through MC-16's dependencies.
6. Add offer/outbound/loan-assistance roles as capabilities become real. Keep payments adoption later and separate from broker-originations workflow.
7. Run meaningful domain/security/end-to-end tests for the implemented slice. Record what passed, what remains untested and the exact next ticket. Do not claim installation or a working integration from this mapping.

## Source-update protocol
Fetch fork and upstream without overwriting custom work. Compare selected file diffs and permissions/tool directions. Update in a reviewable branch, retain MIT attribution, regenerate checksums and run provenance plus workflow/approval regressions. Confirm a source change cannot enable external dispatch or widen tenant permissions. Record updated revision/date and preserve historical profile/run provenance. Missing or renamed roles require review, not silent substitution. No recurring automation is configured by this document.

## Acceptance checks
- All lock entries resolve at the pinned revision and checksums match raw source bytes.
- Every workflow role exists in the manifest; every dependency references an existing earlier node and the graph is acyclic.
- Dispatch remains disabled in reference data; outbound auto-approval is false; retry limits are consistent.
- Two contrasting profiles produce different mandate-relevant plans without changing authorization.
- Missing source, authority, financing purpose or approval yields research/review/hold, not invented facts or an invitation.
- Proposed billing events require real accepted outcomes and contract rules; sample/dry-run tasks never create charges.
- Preserve existing Next.js, workspace tenancy, Lovable public frontend, parallel PRs and the separate Atomic CRM track.
