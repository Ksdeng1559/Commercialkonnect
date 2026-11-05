# Mission Control system design contract

Status: engineering target to reconcile against actual code and migrations. No database/provider implementation is delivered by this document.

## Product and boundaries
Primary customer is a commercial mortgage/finance brokerage team; initial data coverage is BC. Core outcome is a new attributable, held qualified financing meeting, with later mandate and funding outcomes tracked separately. Adjacent contractor workflows remain future packs. The same dashboard can specialize in construction, commercial acquisition/refinance, owner-occupied property, working capital, equipment, receivables/ABL or business acquisition.

A project signal is not borrower intent. Project budget, financing estimate, requested amount, sponsor-confirmed need, lender commitment and funded amount are separate values with evidence. Construction lifecycle is independent of the relationship pipeline.

## Architecture to preserve
| Layer | Target responsibility |
|---|---|
| Existing Next.js App Router / TypeScript app | Authenticated Mission Control and accessible client interaction components; port reference behavior incrementally. |
| Clerk Organizations | Verified session and active organization; server derives authorized workspace. Verify current provider claim format/documentation before implementation. |
| Existing `public.workspaces` | Tenant identity mapped through `clerk_org_id` per approved Mortgage Mix spec. `workspace_id` is the canonical tenancy column for this workstream. |
| Supabase PostgreSQL | Transactional records, restrictive RLS, scoped joins and immutable audit history. Company `organization_id` is not the tenant key. |
| Server Actions / server-only repositories | Validated requests, verified actor context, expected-version concurrency and audit mutations. Never trust a browser-selected workspace as authorization. |
| Ingestion / enrichment adapters | Licensed bounded source pulls, raw snapshots, normalization, entity resolution, assertion-level provenance, review queue and dead-letter handling. |
| Background orchestration | Tenant-scoped jobs, signed callbacks, bounded retry and durable idempotency; no privileged generic write endpoint for agents. |
| Calendar / communication / CRM adapters | Real availability, event status, approved messages and relationship sync with external identifiers. Disabled until configured and validated. |

The Sites-hosted prototype is an independent reference deployment. Its project identifiers and private hosting configuration must not be copied into this GitHub app. Keep ClearConnect/Lovable as public marketing frontend per `docs/FRONTEND_INTEGRATION.md`.

## Records and reuse decisions
Inspect real schema first. Names below describe contracts, not migrations to apply without reconciliation.

| Record | Key fields / relationship |
|---|---|
| Existing workspaces / membership | Clerk mapping, actor roles, active state; preserve existing tenants and rows. |
| Client Brain draft | workspace_id, answers, schema_version, draft_revision, updated_by/at. |
| Client Brain version | workspace_id, version, immutable answers, reviewed_by/at, interview participant, confirmation, activated_by/at. Workspace stores active version pointer. |
| Existing organizations / contacts | Reuse company and person entities; identity/authority assertions, verification dates, source and confidence. |
| Source evidence | workspace_id, provider, external ID, URL, publisher, observed_at, retrieved_at, verified_at, license/usage, snapshot hash, assertion status and reviewer. |
| construction_projects | Existing approved project proposal; source-linked lifecycle, location, type and project budget. Financing requests can exist without a construction project. |
| mix_opportunities | workspace_id, company/contact/project FKs, financing purpose, estimated/requested/confirmed/committed amounts, need status, relationship stage, authority, timing, origin, owner, next action. |
| Fit assessment | workspace_id, opportunity_id, client_brain_version_id, algorithm_version, categorical mandate result, criteria, missing fields, evaluated_at; optional display score separate. |
| Existing tasks/notes/touchpoints | Reuse approved satellite pattern; validate parent workspace consistency on polymorphic references. |
| Playbook / outreach review | workspace_id, strategy, personalized offer, source evidence, profile version, recipient and contact basis, suppression check, content hash, reviewer, expiry and status. |
| Appointment | workspace_id, opportunity/contact, primary playbook/origin, starts_at UTC, IANA timezone, duration, provider ID, idempotency key, booking status and invitation status. |
| Meeting outcome | appointment_id, held time, authorized participant, credible project, financing discussion evidence, qualified flag, next action and recorder. |
| Audit event / job | actor and workspace, input/version references, request/correlation ID, immutable event, retries/failure status. Avoid PII in operational logs. |
| Subscription / entitlement | Tenant-scoped billing customer, plan, seat/usage limits and signed webhook processing; later phase. |

All tenant FKs must reject cross-workspace relationships, including writes through privileged workers. Use composite FK constraints or equivalent validated database invariants. Restrictive policies must protect reads and old/new values on updates. Service-role use is limited to explicitly authorized maintenance/webhook/worker paths with separate scoped checks; ordinary tenant CRUD must not bypass RLS.

## Domain state machines
- **Brain:** draft → reviewed version → active; replacement creates another immutable version. Concurrent activation requires expected active version and one transaction. Invalidated permissions/changes require new review.
- **Financing need:** unknown / hypothesis / sponsor-confirmed / no-current-need / disputed. Supporting assertion and date required for confirmation; stale data can return to review.
- **Relationship:** Discovered → Qualified → Outreach → Meeting booked → Mandate. Permit stage changes never move this state automatically. Qualified requires broker-defined minimum facts. Outreach requires reviewed eligibility and current suppression check. Booked requires a confirmed appointment, not drag-and-drop alone. Mandate requires explicit engagement evidence.
- **GTM readiness:** Research / Review / Ready for manual action / Hold, reconciled with existing planner. High specialization fit cannot bypass authority, evidence or contact-basis gates. Stops include opt-out, reply received, booked meeting, no-current-need and reviewer hold.
- **Appointment:** proposed → pending confirmation → booked → held / no-show / cancelled. Track invitation delivery separately. Reschedule links to prior event without double-counting; outcomes cannot mark no-shows qualified. A held meeting alone does not create a mandate.

The reference has deliberately simplified states and gates. In particular its checkbox is not sufficient evidence of authority/contact eligibility; its booked records are local plans; post-meeting stage reconciliation is illustrative. Implement the domain model rather than copying these shortcuts.

## Validated server operation contracts
| Operation | Required checks / result |
|---|---|
| SaveBrainDraft(input, expectedRevision) | Validate schema and role; return new draft revision; never activate implicitly. |
| ActivateBrain(draftRevision, reviewedConfirmation, expectedActiveVersion) | Validate required fields, current draft and actor; append immutable version, activate and audit atomically; invalidate stale fit/draft approvals. |
| ListPriorities(filters) | Workspace-derived authorized query; active version, evidence freshness, reasons and missing fields returned. Pagination; full list retains out-of-mandate records. |
| QualifyOpportunity(id, facts, expectedVersion) | Assertion evidence, identity/authority, timing and profile minimums; preserve unknown values; audit. |
| PrepareOutreach(id, strategy, expectedVersions) | Draft only; evidence/contact eligibility and stop-state evaluation; return review state with no sending. |
| ApproveOutreach(draftId, contentHash, expectedVersions) | Reviewer role, current contact basis/suppression, immutable approval; stale edits invalidate it. Dispatch only through separately configured approved outbox. |
| ProposeAppointment(id, window) | Real provider availability, timezone, capacity and authorized participant agreement; proposal not booking. |
| ConfirmAppointment(proposal, idempotencyKey) | Recheck availability/permission; reserve and create provider event safely; durable reconciliation if provider succeeds before DB commit. |
| RecordOutcome(appointmentId, evidence, expectedVersion) | Valid transitions, meeting qualification and deduplicated attribution; record held timestamp and next action. |

No provider signatures, SDK endpoints or executable SQL are prescribed here. Verify current official provider documentation and schema immediately before adapter/auth implementation.

## Reliability and operations
Bound every source/enrichment job to an explicit workspace and quota. Use provider IDs plus source version/hash for deduplication; conflicting assertions remain visible. Store sync cursor only after successful persistence. Retry transient errors with backoff; dead-letter permanent ones. Calendar/message side effects require durable idempotency and webhook reconciliation. Record external response identifiers rather than retrying blindly after timeouts.

Protect exports, redact borrower information in logs, define retention/residency and backup restore procedures, and exercise tenant isolation on all records/joins/functions/jobs. Do not migrate or delete live records based on old documents claiming empty tables: main README explicitly corrects that assumption.

## Decisions before implementation
Record ADRs for route mapping and responsive component plan; actual schema compatibility/backfill; numeric-fit versus categorical readiness presentation; funding-purpose taxonomy; source licenses and measured coverage; calendar provider and participant authorization; Client Brain roles/version conflicts; final brand alignment and pilot-to-paid entitlements. Keep unconfigured integrations visibly unavailable, rather than simulating production success.

## Chief of Staff orchestration layer

See [CHIEF_OF_STAFF.md](CHIEF_OF_STAFF.md) for the delegation envelope, roster, state machine, permission matrix, resource controls and acceptance tests. The coordinator reads active Client Brain and opportunity/evidence versions, plans finite task dependencies and delegates through typed server-side adapters. Reuse existing agent runs where possible; reconcile durable plans/tasks/attempts/leases/artifacts/approvals/usage ledger against actual schema. All are workspace-scoped. External side effects remain in independently authorized, idempotent adapters. Model output cannot confer permissions, verify borrower intent or count as a held meeting. Runtime selection is an ADR, not a dependency introduced by this reference.
