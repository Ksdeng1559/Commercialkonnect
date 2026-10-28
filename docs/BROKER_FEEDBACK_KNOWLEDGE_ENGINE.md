# commercialKonnect OS — Broker Feedback & Institutional Knowledge Engine
Status: implementation handoff / proposed, not deployed
Updated: 2026-10-25
Source SOP: https://app.notion.com/p/4029e94cf0a481bf8a29d4f46e9b2422

## Decision and boundaries
Build an OODA feedback loop that captures broker observations, interprets them as candidate claims, requires review, and feeds validated experience into opportunity recommendations. The system must **not** automatically expose tenant-private data to other brokerages or infer confirmed borrower financing intent from public activity.

This repository is a Next.js/Clerk/Mortgage Mix planning and scaffold track; the Atomic CRM application is a **separate repository / local codebase** with Supabase Auth and tenant_id conventions according to README. This handoff specifies reusable contracts and UI. Do not apply this migration to the existing live Mortgage Mix public schema or assume Clerk identity mappings in Atomic CRM. Implement and test in the actual Atomic CRM repo first.

## Outcomes
- Every material broker conversation can yield an attributable, structured outcome.
- Broker tribal knowledge becomes a versioned, reviewable claim with provenance and uncertainty.
- Chief of Staff surfaces **verified** applicable precedents with explicit constraints.
- Users can correct or reject recommendations; subsequent cycles improve without unapproved autonomous communication.
- Isolation, deletion, consent and private expertise protection are foundational, not post-launch additions.

## OODA operational contract
1. OBSERVE: ingest signals and structured broker outcomes; retain raw source and observation time.
2. ORIENT: associate feedback with canonical tenant-scoped opportunity/company, people, property, lender and product entities; distinguish fact from opinion/inference.
3. DECIDE: assemble evidence, contradictions, eligibility/mandate filters and next-best-action proposal; require broker approval.
4. ACT: approved actions run through Atomic CRM, carrying outreach/consent audit.
5. LEARN: record actual result and broker correction; convert candidate claims through human review; re-evaluate stale/contradicted items.

## MVP user flow
1. Broker opens Opportunity Intelligence Card and selects **Record feedback**.
2. Required: interaction date, interaction outcome, financing intent (unknown/future/confirmed/denied), next action or explicit closed reason. Optional: lender response with distinct `submitted`, `accepted_for_review`, `terms_received`, `declined`, `funded` values, evidence and confidential notes.
3. Save to tenant-isolated `broker_feedback`, attach to opportunity activity timeline and display author + date.
4. On explicit **Create knowledge candidate**, propose an atomic statement with scope and precedent, but keep it `captured` / `pending_review`. Broker can edit and submit for review.
5. Reviewer verifies source, applicable context, constraints, validity period and sharing scope; may approve, reject, request more evidence or mark disputed.
6. Only approved, in-date claims can appear in Chief of Staff recommendations. UI shows source, reviewer and conditions, not just an AI confidence number.
7. Broker marks recommendation accepted, modified or rejected and optionally records outcome, closing the learning loop.

## Component contract — BrokerFeedbackPanel (shadcn compatible)
Props:
- `opportunityId: string`
- `tenantId` derived server-side from authenticated session (NEVER trusted from client input)
- `onSaved?: (feedbackId: string) => void`
- `readOnly?: boolean`

Fields:
- `interactionAt` ISO datetime (required)
- `interactionOutcome` enum: no_contact, attempted, spoke_to_decision_maker, meeting_booked, qualified, not_interested, closed
- `intentStatus` enum: unknown, future, confirmed, denied
- `lenderResponse` enum: not_discussed, submitted, accepted_for_review, terms_received, declined, funded
- `reasonCode` enum/text with lender reasons kept separate from borrower objections
- `notes` private default, max length and basic sanitization
- `evidenceIds[]` tenant-scoped provenance references
- `nextActionAt` nullable
- `knowledgeCandidateRequested` boolean; initial default false
- `shareScope` private default; network contribution can only request review, not publish

UI states: loading, validation errors, saving, persisted, duplicate/idempotent, permission denied. Accessible keyboard and screen-reader labels. Do not claim feedback saved until server success.

## Proposed Postgres data model (adapt names to existing Atomic CRM schema)
```sql
-- Illustrative migration contract; not safe to run without examining Atomic CRM schema.
create table broker_feedback (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  opportunity_id uuid not null,
  interaction_id uuid,
  actor_user_id uuid not null,
  interaction_at timestamptz not null,
  interaction_outcome text not null,
  intent_status text not null default 'unknown'
    check (intent_status in ('unknown','future','confirmed','denied')),
  lender_response text not null default 'not_discussed'
    check (lender_response in ('not_discussed','submitted','accepted_for_review','terms_received','declined','funded')),
  reason_code text,
  private_notes text,
  evidence_ids uuid[] not null default '{}',
  next_action_at timestamptz,
  knowledge_candidate_requested boolean not null default false,
  share_scope text not null default 'private'
    check (share_scope in ('private','brokerage','request_network_review')),
  idempotency_key text not null,
  created_at timestamptz not null default now(),
  unique (tenant_id, idempotency_key)
);
create index broker_feedback_tenant_opp_idx
 on broker_feedback (tenant_id, opportunity_id, interaction_at desc);

create table knowledge_claims (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  source_feedback_id uuid not null,
  statement text not null,
  classification text not null default 'anecdote'
    check (classification in ('anecdote','interpretation','corroborated_practice','published_policy','disputed')),
  verification_status text not null default 'pending_review'
    check (verification_status in ('pending_review','approved','rejected','needs_evidence','expired','disputed')),
  evidence_ids uuid[] not null default '{}',
  constraints jsonb not null default '{}',
  confidence numeric(4,3),
  sharing_scope text not null default 'private',
  reviewer_user_id uuid,
  reviewed_at timestamptz,
  valid_until timestamptz,
  supersedes_claim_id uuid,
  created_at timestamptz not null default now()
);
create index knowledge_claims_tenant_review_idx
 on knowledge_claims (tenant_id, verification_status, valid_until);
```
**Before migration:** link FKs to actual tenant/opportunity/user/evidence tables, use the Atomic CRM auth model, create restrictive RLS policies, policies for reviewers, tenant-qualified FK integrity, audit/event table, retention triggers and an approved network-publication pathway. Never deploy this illustrative DDL as-is: it deliberately lacks those application-specific protections.

## API behavior
- `POST /api/opportunities/:id/feedback`: authenticated, resolved tenant on server; validation and anti-duplicate key; persist in transaction; authorization and immutable audit.
- `GET /api/opportunities/:id/feedback`: tenant-scoped, paginated, least-privilege notes.
- `POST /api/feedback/:id/knowledge-candidates`: create draft, no automatic approval/publishing.
- `POST /api/knowledge/:id/review`: explicit reviewer role; record before/after and justification.
- `GET /api/chief-of-staff/knowledge?opportunityId=...`: only current approved claims within authorized visibility; include sources/constraints.
- `POST /api/recommendations/:id/feedback`: accept/modify/reject + reason, later actual result.

## Safeguards
- Strong RLS and server-side authenticated tenant resolution; negative tests between two tenant accounts.
- Separate person/contact consent, outreach authorization and broker-to-broker sharing; never interpret opting into feedback as authorization to disclose client details.
- Store original documents and claims in controlled locations; source licensing and retention apply.
- Contradictions create review tasks and preserve earlier versions; no silent truth overwrites.
- Knowledge revalidation scheduled and event-driven. Claims past `valid_until` excluded from operational recommendations.
- No automatic lender approval or credit decisions; no outbound without explicit approval.
- Include rate limits, input limits, audit, deletion/export workflow and telemetry with no secret or borrower detail in logs.

## Acceptance tests
1. User A in Tenant A creates feedback; User B in Tenant B cannot list, retrieve, modify or infer it.
2. Duplicate retries using same idempotency key produce exactly one event.
3. Financing intent remains unknown if only an expansion signal or outreach response exists.
4. A one-off lender exception cannot be approved as universal lender policy without corroboration.
5. Rejected, expired, disputed and private-other-tenant claims never appear in recommendations.
6. Approved claims show provenance, reviewer, valid scope and dates.
7. Save success surfaces only after durable DB write; transient failures preserve local form state.
8. Broker rejection of a recommendation persists with reason and is visible only to appropriate tenant users.
9. Deleted/withdrawn shared contributions stop future retrieval and are reviewed for downstream derivatives.
10. Browser-level accessibility checks and API validation complete.

## Suggested delivery sequencing
- P0a: inspect Atomic CRM schema/auth and produce actual migration + tenant tests.
- P0b: BrokerFeedbackPanel wired to authenticated API, opportunity timeline.
- P0c: Knowledge review queue and broker-private claim extraction (manual first).
- P1: Chief of Staff retrieval and recommendation feedback; verified playbooks.
- P2: explicitly permissioned aggregate network learning and ranking evaluation.

## KPI instrumentation
Feedback coverage per meaningful interaction, sourced-and-reviewed claim rate, stale claim rate, feedback-to-reviewed time, qualified conversations per broker-month, review acceptance, time saved and funded-deal attribution. Compare pilot vs baseline; do not claim learning benefit before observation.

## Definition of done
An Atomic CRM pilot broker can record feedback, review and correct a knowledge claim, retrieve a validated/dated insight in Chief of Staff, and document a recommendation outcome without any cross-tenant exposure. Database migration, RLS, server authorization, automated tests and real pilot verification required. This document alone is not deployed functionality.
