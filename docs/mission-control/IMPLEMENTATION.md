# Implementation backlog and release acceptance

Status: work to implement. Do not mark a ticket complete because the reference renders it. Existing real-data and tenancy work is a dependency, not displaced by the user-selected interface.

| ID | Deliverable | Dependencies | Acceptance evidence |
|---|---|---|---|
| MC-00 | Reconcile main and PRs #1–#6; produce current-state map and ADRs | Existing docs and branch inspection | Actual files/schema vs planned features; chosen merge/cherry-pick order; no duplicate auth/tenant/scoring engines. |
| MC-01 | Port app shell and Mission Control reference into Next.js components | MC-00 | Explicit demo mode; keyboard/mobile layout; expandable cards; search; loading/error/empty states; no live claims. |
| MC-02 | Pure typed Client Brain validation/matching/qualification engine | MC-00 | Tests for contrasting profiles, missing fields, units, exclusion review, deterministic reason codes; categorical readiness separate. |
| MC-03 | Workspace security foundation and migration design | MC-00 and approved Mortgage Mix spec | Non-destructive existing-row mapping, verified Clerk integration, restrictive RLS, role matrix and A/B cross-tenant denial tests including FKs/jobs/exports. |
| MC-04 | Persist draft/reviewed/active Brain and audit versions | MC-02, MC-03 | Interview resumes across sessions; draft isolation; transactional reviewed activation; optimistic locking; historical versions retained. |
| MC-05 | Bounded real project ingestion and evidence | MC-03 and existing BuildData plan | Approved source use/coverage, dated assertions, verified sponsor roles, deduplication, retry/checkpoint evidence; no fixture leakage. |
| MC-06 | Integrate real priorities, briefs and qualification | MC-01, MC-02, MC-04, MC-05 | Active profile changes real shortlist with reasons; unknown funding need remains unknown; specialty prompts; stale facts trigger review. |
| MC-07 | Persist capital pipeline/tasks and engagement evidence | MC-06 | Optimistic locking, role/transition checks, keyboard alternative to dragging; stage not tied to permit lifecycle; mandate evidence required. |
| MC-08 | GTM review queue and personalized drafts | MC-06; reconcile PR #5 | Profile/evidence-bound draft approval, lawful contact basis review, suppression/stop gates, audit; dispatch disabled by default. |
| MC-09 | Appointment planning and one calendar adapter | MC-07, MC-08 | Participant agreement, true availability, timezone/DST/capacity, duplicate-safe creation, cancellation/reschedule/webhook reconciliation. |
| MC-10 | Held-qualified outcomes and attribution | MC-09 | Unique outcome counts; no-show/cancelled excluded; source/playbook/profile links; exact date filters and historical targets. |
| MC-11 | Internal pilot hardening and review | MC-03–MC-10 | Two isolated broker workspaces; backup restore; export/delete lifecycle; source accuracy/freshness sampling; end-to-end demo and unresolved limits. |
| MC-12 | Subscription/seat/usage entitlements | Successful internal pilot and commercial plan | Server-side entitlements; signed idempotent billing webhooks; no denial of data export; verified checkout in test mode. |

## Chief of Staff work packages

| ID | Deliverable | Dependencies | Acceptance evidence |
|---|---|---|---|
| MC-13 | Coordinator domain planner and role/tool contracts | MC-00, MC-02 | Typed delegation/output schemas, bounded acyclic plans, profile-version binding, dependency and policy tests. No provider dispatch. |
| MC-14 | Durable workspace task execution and resource accounting | MC-03, MC-04, MC-13 | Authorized roles, leases/heartbeats, retry/backoff, cancellation, quotas/budget reservations, audit and two-tenant denial tests; runtime ADR. |
| MC-15 | Chief of Staff control view and human review queue | MC-01, MC-14 | Roster, tasks/traces/dependencies, stale-profile holds, output reviews, cost unknown states, caps, blocked-work decisions and stand-up. |
| MC-16 | Connect specialist adapters and verify meeting outcomes | MC-05–MC-10, MC-14, MC-15 | Scoped LeadSniperAI/enrichment/Harvey dispatch, independent approvals, idempotent external actions, lease recovery and end-to-end outcome attribution. |

The `#chief` reference is manual simulation only. Do not equate its sample task acceptance with verified financing facts. Full test/release gates are in [CHIEF_OF_STAFF.md](CHIEF_OF_STAFF.md).

## Recommended execution sequence
First inspect and reconcile. Implement MC-01/02 as a source-independent UI/domain slice while keeping MC-03/05 as prerequisites for production. This preserves the existing ingest-first production decision without blocking useful prototype porting. Then persist the interview and wire real qualified priorities, pipeline and one calendar flow. Run an internal broker pilot before subscription or public signup changes. Contractor and investor/capital-raising products are separate later work.

## Component / route map to decide against the actual app
| Reference view | Suggested route | Reusable components |
|---|---|---|
| Overview | `/` or `/mission-control` | WorkspaceShell, OutcomeCards, MandateBanner, OpportunityList, FocusTasks, MeetingAgenda |
| Client Brain | `/client-brain` | InterviewStepper, StructuredChoices, DraftStatus, ReviewSummary, VersionHistory |
| Intelligence / detail | `/projects`, `/projects/[id]`; financing-only opportunities separately | SourceEvidence, StakeholderVerification, MatchReasons, FinancingDiscovery |
| Pipeline | `/pipeline` | CapitalBoard, StageTransition, OpportunityDrawer |
| GTM | existing/planned `/gtm` | PlaybookLibrary, StrategyResult, DraftReview, ApprovalHistory |
| Appointments | `/appointments` | AvailabilityPicker, AppointmentDetail, OutcomeForm |
| Metrics | `/outcomes` | PeriodFilter, AttributionFunnel, GoalHistory, PlannerScenario |

Names are proposals; retain existing routes where that avoids breaking navigation. Do not put a shared state blob or monolithic HTML/inline handlers into the production React app.

## Test matrix
1. Domain: specialty/asset/province/size match; exact amount bounds; CAD conversion; missing fields; city preference; unknown purpose; stable ties; manual exclusions and stale facts. No inference of credit or contact readiness.
2. Interview: required questions, draft resume, review checkbox, server role enforcement, concurrent activation conflict, schema migration, active version remains unchanged by draft edits, export content and permission.
3. Security: unauthenticated rejection; organization membership changes; A cannot read/update/delete/export B; cross-workspace company/contact/opportunity links rejected; privileged worker spoofing rejected; update cannot move a row across workspaces.
4. Ingestion: duplicate source IDs, changed snapshots, conflicting company names, stale source events, quota errors, cursors and no fixtures in live tables.
5. Pipeline/GTM: stage prerequisites, source evidence, no-current-need and suppression stops; approval expires after draft/profile/source changes; high fit does not override hold/research.
6. Calendar: Vancouver DST, UTC round trips, date-range and weekly capacity, occupied slots, participant confirmation, double-clicks, network timeout after event success, webhook duplication, reschedule/cancel and no invitation from demo mode.
7. Outcomes: no-show/cancelled cannot count; held but unqualified excluded; rescheduled chains count once; actual held date controls monthly period; net-new/assisted attribution separated; target version retained.
8. Browser: desktop/tablet/mobile, keyboard focus and dialogs, screen-reader labels, long names, no-match/empty/loading/error states; screenshot comparison of implemented views to reference.
9. Build: run declared repository scripts; add meaningful domain/integration tests with minimal framework changes. Document existing lint/config/dependency failures precisely; do not claim CI success from a workflow file.

## Metric definitions and pilot gates
North star = distinct qualifying held appointment outcomes per authorized workspace and reporting period, based on actual held timestamp in America/Vancouver. A relevant authorized participant confirms a credible opportunity and discusses financing timing/need. Booking is neither held meeting nor loan approval.

Track eligible reviewed prospects → valid permitted approaches → positive replies → qualified replies → booked → held qualified → evidenced mandates. Each stage uses its own denominator. Distinguish business origination for broker customers from platform sales to broker subscribers; no combined funnel.

Monthly goal defaults to a planning assumption, editable through reviewed Client Brain. Scenario sliders are assumptions, never actual conversion performance. Fix reference shortcuts before pilot: its outcome totals are not yet month-filtered, dates are sample values, event availability/capacity is not checked, and its simple cancellation stage fallback is not a production transition policy.

PMF targets from the supplied 2026-10-14 study: activation in seven days (five verified saved projects plus one opportunity); 80% pilot-used records within seven-day verification SLA; 90% accuracy on a documented critical-assertion sample; 30% preparation-time reduction vs measured baseline; at least half of pilot teams get one attributable qualified meeting in 30 days; 5/8 cross-segment pilot renewals. They are proposed experiment gates, not achieved traction or broker-only forecast.

## Completion protocol
For each slice report behavior delivered, files/migrations changed, commands actually run, test results, screenshots where possible, remaining operational gaps and the next exact ticket. Record approved ADRs and update README truth. Do not connect production or merge unrelated work merely to make a checklist green.

## Agency Agents coverage of the backlog

Use [AGENCY_AGENTS.md](AGENCY_AGENTS.md), `agent-sources.lock.json` and `workflow-registry.json` as reference contracts. WF-01 maps to MC-02/04; WF-02 to MC-05/06/08; WF-03 to MC-05/06; WF-04 to MC-08/09/10/16; WF-05 spans the engineering backlog; WF-06 maps to MC-10/13/15. MC-00 reconciles role/source adoption; MC-13 supplies typed delegation/policy, MC-14 durable authenticated execution, MC-15 management views and MC-16 live adapters. This adds no new claim of completion and does not require a new runtime by default.

Start with Chief of Staff, Workflow Architect, Discovery Coach and Evidence Collector. Add specialist roles only when their dependencies are met. Source hash verification and workflow graph checks validate reference consistency, not a functioning agent system. Test role-specific boundaries and two-tenant isolation during implementation.


## Client Briefings and research providers

See [CLIENT_BRIEFINGS.md](CLIENT_BRIEFINGS.md), [RESEARCH_PROVIDERS.md](RESEARCH_PROVIDERS.md) and [latest status](LATEST_REFERENCE.md). These packages extend the existing backlog and are not marked implemented.

| ID | Deliverable | Dependencies | Acceptance evidence |
| --- | --- | --- | --- |
| MC-17 | Typed briefing domain, subject resolution and persistent evidence/revisions/review/export | MC-01–MC-04; reconcile entity schema in MC-00 | Four modes, exact subject/collision register, V/C/S/U/A/N/X, stable claim IDs and dated source provenance; immutable profile-bound reviews, stale-source/edit holds, optimistic locking and tenant denial/export tests |
| MC-18 | Bounded research gateway and Exa adapter | MC-03/04/14/17 | Authorized idempotent research/cancel/status operations; server secrets, quotas/budget reservations, safe public-source retrieval/SSRF defense; normalized provider errors and fixture + one bounded real-run receipt |
| MC-19 | Tavily adapter and optional Serper coverage policy | MC-18 | Explicit enabled-provider/fallback policy; source extraction, common-origin deduplication, independent-source review, partial failure/cost-unknown handling; per-configured-provider real-run checks |
| MC-20 | Source-backed report synthesis and Chief of Staff review UI | MC-15/17/18; MC-19 for multi-provider rollout | Source-referenced draft generation with configured model ADR, gaps/collisions, no automatic verification; report edit/review invalidation, private exports, browser flow and no outbound/calendar/billing side effects |

Adjacent Market Intelligence and pilot-validation views are UX references to scope during MC-00/01, not silently added live ingestion/paid analytics. Government yield API refresh needs a hosted browser check; curated zoning/news need source-specific freshness/adoption/effect handling. Pilot outcomes require independent records and measured definitions before external traction claims. MC-11's source accuracy, baseline and retention gates still apply.
