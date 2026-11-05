# Qualification contract — verticals, automation, broker review, underwriting gate

Status: spec, not built. Extends [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) state machines and the [CLIENT_BRAIN.md](CLIENT_BRAIN.md) matching engine (MC-02). No automation here makes a lending decision, promises approval, or submits anything to a lender without a recorded human approval.

## What this adds

1. A registry of **business-funding verticals** a deal can be qualified against.
2. An **automated qualification** step that produces a categorical verdict from deterministic rules.
3. A **broker-review queue** for everything the automation does not clear.
4. A mandatory **human-in-the-loop (HITL) gate before underwriting** — no file reaches a lender/underwriter without an explicit broker approval recorded on disk.

## Verticals

A vertical = financing **product** × borrower **industry** × **geography**. The Client Brain mandate (purposes, assets, provinces, amount band, exclusions) decides which verticals a given workspace is in-mandate for.

**Financing products** (funding purpose): business line of credit / working capital · commercial mortgage (purchase, refinance, owner-occupied) · bridge · construction & development · equipment financing · invoice factoring / receivables / ABL · business acquisition.

**Industries**: construction & contractors · HVAC · plumbing · retail · restaurant & food · manufacturing · transportation & trucking · wholesale & distribution · professional services · property development.

**Geography**: BC first (Vancouver, Burnaby, Surrey, Richmond, Langley, Coquitlam, Abbotsford, Delta). Other provinces only where broker service and data coverage genuinely exist.

Store the registry as data (`funding_verticals`: id, product, industry, geo_scope, min_cad, max_cad, active, evidence_requirements), not hardcoded. Geography selection never implies data coverage. A vertical being in the registry is not a claim that the workspace can fund it — that is the mandate check.

## Automated qualification

Deterministic, explainable, categorical. Rides the MC-02 engine. For each opportunity, evaluate against the active Client Brain version and the vertical registry and emit one verdict:

| Verdict | Meaning | Routing |
|---|---|---|
| `auto_qualified` | All required facts known and inside a single in-mandate vertical: product + asset/industry + province match, amount inside band, no blocking exclusion, financing need at least sponsor-confirmed, contactability basis present | → broker review queue, pre-filled, flagged ready |
| `out_of_mandate` | Known facts place it outside every active vertical | → visible in full list with reason; not queued |
| `needs_review` | Any required fact unknown/ambiguous, free-text exclusion hit, authority or evidence gap, stale data, or amount/currency edge | → broker review queue, flagged with the specific gaps |

Rules only. No scoring gates the verdict (a display score may exist but never promotes `needs_review` to `auto_qualified`). Every verdict carries per-criterion reasons, the Client Brain version evaluated, the vertical matched, the missing fields, and `evaluated_at`. Unknown stays unknown — never defaulted to a passing value. Re-evaluate when the Brain version, source evidence, or opportunity facts change; a new Brain version invalidates prior verdicts.

**`auto_qualified` means "rules cleared it for a broker to look at" — not approved, not funded, not contacted.** It is the automation handing a clean, evidenced file to a human. It never triggers outreach, booking, or an underwriting submission.

## Broker review (everything else)

The broker review queue holds `auto_qualified` (confirm) and `needs_review` (resolve). The broker:
- confirms or corrects the matched vertical and the facts,
- resolves unknowns and ambiguous free-text (exclusions, lender access, contact instructions) — free text is never auto-enforced,
- confirms financing need, authority, timing and contact basis with dated evidence,
- decides: send to underwriting, hold, or disqualify (with reason).

Broker actions are role-checked, version-aware (optimistic locking), and audited. A broker override of an automated verdict is recorded with actor, reason, and prior verdict.

## HITL gate before underwriting — mandatory

A deal can only move to underwriting submission through an explicit, recorded human approval. This is a hard state transition, not a checkbox shortcut.

State: `… Qualified → Broker Review → Underwriting-Approved → Submitted-to-Underwriting`.

`ApproveForUnderwriting(opportunityId, verdictVersion, brokerConfirmation, expectedVersion)` must:
- require a broker (or authorized) role; the approver cannot be the automation,
- require an active, non-stale qualification verdict and a resolved vertical,
- require the evidence the vertical demands (identity, authority, financing need with date, amount basis, consent/contact basis),
- append an immutable approval (actor, timestamp, verdict version, package hash) in one transaction,
- be invalidated by any later edit to the underlying facts or Brain version.

`SubmitToUnderwriting` runs only after a valid `Underwriting-Approved` state, is idempotent (idempotency key = tenant + opportunity + approval hash), and records the external submission identifier. No agent, model, or automation may call it directly; it is an authorized, separately configured adapter — disabled until built and approved. Specialization fit, a demo checkbox, or an automated verdict are never sufficient evidence to submit.

## Layer 2 — company financing-readiness (stub)

Later contract. The brokerage/business itself reaching a fundable state: tracked revenue, auditable invoices (Billr), collection history, unit economics from the KPI set. It rolls up Layer 1 outcomes (held qualified meetings, mandates, funded amounts) plus billing/revenue evidence into a readiness view with the same disgust for fabricated facts: readiness is evidenced, never asserted; no automation claims the business qualifies. Build after MC-10 (outcomes) and a Billr revenue contract exist. Not started — see [_status.md](_status.md).

## Checks to add (none exist yet)
- Verdict rules: contrasting profiles, unknown fields stay unknown, amount band edges + CAD boundaries, exclusion hit → needs_review, stale evidence → needs_review.
- Gate: no submission without recorded human approval; approval invalidated by later fact/Brain edits; submit is idempotent; automation cannot approve or submit; two-tenant isolation on the queue and the gate.
