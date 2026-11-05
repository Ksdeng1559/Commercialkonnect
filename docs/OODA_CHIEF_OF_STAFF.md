# OODA Loop — AI Chief of Staff Decision Framework

> Status: proposed architecture and implementation specification; **not implemented**.
> Source of truth: [Notion OODA Loop — AI Chief of Staff Decision Framework](https://app.notion.com/p/3ff9e94cf0a4810a857bfb686383b314) (read October 20, 2026).
> Product: KonstructionComOS Mission Control / commercial financing and construction intelligence.

## Purpose

Adopt John Boyd's **Observe → Orient → Decide → Act (OODA)** cycle as the Chief of Staff's recurring decision architecture. Optimize evidence-based decisions, situational awareness, and measurable business outcomes rather than the volume or speed of automated actions.

| Stage | Sources/agents | Required output |
| --- | --- | --- |
| **Observe** | Construction signals, CRM, research/monitoring agents, market and lender news | Dated, sourced, deduplicated signal with freshness and confidence |
| **Orient** | Client Brain (goals, preferences, capabilities, constraints), project/prospect intelligence, qualification | Opportunity brief distinguishing observed facts from hypotheses, risks and limitations |
| **Decide** | Chief of Staff ranking and decision support | Up to three prioritized next-best-action proposals with evidence, rationale, alternatives, expected impact and approval status |
| **Act** | Authorized outreach, follow-up, CRM/workflow agents | Logged execution, measured results, next review and feedback into subsequent OODA cycle |

## Operating procedure

1. Trigger a cycle daily in the MVP; support event-driven triggers in Phase 2.
2. Ingest relevant incremental signals with source URL/ID, captured/observed time, freshness, confidence and organization scope.
3. Deduplicate, validate, and enrich against project, stakeholder, prospect, lender and Client Brain context. Never infer borrower demand or financing readiness from permits alone.
4. Orient: label confirmed facts, estimates and unknowns separately; apply mandates, geography, goals, risk tolerance and capacity.
5. Decide: rank candidate actions using **value, urgency, probability, effort and risk**. These factors are a framework, not a calibrated predictive model. Surface top three, expected impact, evidence, alternatives, downside and explicit assumptions.
6. Gate financial commitments, regulated outreach, irreversible changes, sensitive disclosures and other high-impact actions on human approval. A recommendation is not permission to execute.
7. Dispatch only approved actions to scoped, least-privileged agents; log actor, tenant, input/source refs, approval, time, tool result, and failures.
8. Reconcile actual outcomes to prior expectations; update working hypotheses and Client Brain only when evidence supports the change. Respect user confirmation and access boundaries.

## MVP user experience

**Mission Control / Today:** daily Chief of Staff briefing containing material changes, missed/at-risk commitments, opportunities and the **top three decisions**. Each recommendation is expandable: why now, source evidence, confidence, expected value, downside, next step and approval requirement.

**Decision queue:** New → Needs Review → Approved / Rejected → Executing → Completed / Failed → Outcome Reviewed. Show decision owner, due date, linked project/prospect and next review.

**Approval workflow:** Operator explicitly approves or rejects each gated proposed action. No auto-approval by model, no background unapproved outbound campaigns, payments, lender submissions or destructive changes.

**Execution audit and feedback:** Show what happened versus predicted outcome and a way to record verified contacts, meetings, progress, false positives, exceptions and changes to assumptions.

## Domain-specific use cases

- **Commercial lending:** Business expansion, acquisition, construction milestones and market changes → verify sponsor and potential financing suitability → propose qualified broker contact → operator-approved outreach → CRM outcome.
- **Construction:** Permit, rezoning or planning changes → verify stage, stakeholders, trade fit and appointment status → propose timely contractor/developer actions → approval → track pursuit.
- **Competitive/lender intelligence:** Lender appetite, terms or product news → identify impacted clients and mandates → propose briefing or offer adjustment → operator-approved campaign/test → measure.
- **Client briefing:** Compose concise, evidence-linked briefings using the Client Brain and latest qualified opportunities; distinguish verified financial need from unknown.

## Suggested data contracts (design, not existing tables)

- `Signal`: id, workspace_id, domain, source_id/url, observed_at, ingested_at, last_verified_at, confidence, fact_status, payload_ref, dedup_key.
- `Orientation`: signal_ids, client_brain_version, observed_facts, assumptions, constraints, opportunity, risks, generated_at.
- `DecisionProposal`: id, workspace_id, orientation_id, recommended_action, ranking_factors, rationale, alternatives, expected_impact, confidence, status, approval_required, proposed_by, due_at.
- `Approval`: proposal_id, reviewer_id, decision, scope, timestamp, reason.
- `AgentExecution`: proposal_id, agent_id, authorized_scope, approval_id, invoked_at, completed_at, status, audit_refs, errors.
- `OutcomeReview`: proposal_id, measured_results, verified_at, outcome_source, false_positive, feedback, next_review_at.

Implement through the existing stack and **do not create a parallel tenancy/auth scheme**. Keep records isolated by workspace using the application's established tenant identity and RLS, resolve the current Mortgage Mix integration dependencies first and treat these contracts as proposed only.

## Delivery priorities and acceptance criteria

### MVP
1. Daily briefing generated from eligible workspace-scoped project and CRM signals.
2. Top-three recommendation queue with click-through provenance, confidence, assumptions and risk explanation.
3. Human approval for sensitive/high-impact actions, with rejection and no-op paths.
4. Audit trail for every executed action and failed/retried operation.
5. Outcome-review capture and attribution to specific recommendations.

**Acceptance checks:** unsourced signals are clearly flagged; duplicates collapse; stale/unknown financing need is not presented as confirmed; no denied action is executed; tenant A cannot view/approve/execute tenant B's items; approval scopes and execution statuses persist; outcomes can be compared with recommendations. Mock data must be visibly labeled and no real autonomous action implied.

### Phase 2
- Event-driven signal alerts and deduplicated reorientation.
- Policy-controlled multi-agent orchestration and bounded retries.
- Feedback-driven prioritization from **measured** outcomes, with human-reviewed Client Brain updates.

## KPIs

- Signal-to-decision and decision-to-action latency.
- Percentage of recommendations supported by identifiable evidence.
- Operator acceptance of recommendations.
- Qualified opportunities and meeting conversion; attributable assisted revenue (do not conflate with funded financing).
- False-positive rates, review workload, approval/compliance exceptions.
- Decision accuracy by cohort and improvement across review cycles.

## Governance and limitations

Human operator remains accountable; preserve CASL/PIPEDA and licensing controls as applicable. Enforce least-privilege, approval, privacy, access controls and provenance. This document describes a **planned** feature; the existing dashboard/other roadmap features are not evidence that OODA orchestration runs today. Reconcile with `docs/PRD.md`, `docs/ARCHITECTURE.md`, `client.brain.md` and any active GTM design branch before implementation.
