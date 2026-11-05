# Broker-first Mission Control: phased delivery

Decision: simplify the first broker viewing experience to **Today / Opportunities / My Pipeline**. Keep the Chief of Staff as clear priorities and next-step support. Defer dashboard feedback, Slack routing and Google Meet interviews; no message, calendar event or recurring task is authorized or created by this decision.

## Current reference (Phase 0)
The default Broker view has three main navigation destinations. Today contains up to three priorities, one held-qualified meeting outcome measure, planned calls and a small dated market-context card. Opportunities has search/filters, sponsor/source/need context, a saved-to-pipeline action, short call-preparation brief and local call planning. My Pipeline has saved opportunities, next steps and inline call/outcome records. Source/financial details are expandable rather than extra top-level pages. Client Brain is under preferences/onboarding. No fit score or illustrative debt-volume KPI appears in the broker list.

Existing deep links and all older tools remain in the reference. Preferences offers Builder tools, exposing the complete prototype for the operating team. This is a **display preference, not an authenticated administrator role or security control**. Browser records remain intact when switching views. Existing progressed sample records initialize the shortlist; removing an item from My Pipeline does not delete the opportunity. Call planning includes the opportunity in My Pipeline. Short preparation notes are browser-local, user-supplied and tied to the opportunity; no automatic research or verification is claimed.

## Phase 1: first working broker pilot
**Outcome:** a broker can use real permitted intelligence, save an opportunity, prepare a call, and reliably return to its next step.

Implement secure Clerk-to-workspace mapping and restrictive RLS first, preserving existing Mortgage Mix data. Reconcile actual schema/branches under MC-00. Ingest one bounded, rights-cleared BC source, preserve source URL/publisher/observation/verification dates, distinguish sponsor identity and confirmed financing need from hypotheses, and expose honest unknown/freshness states. Persist profile versions, saved opportunities, preparation/interaction notes, stage history, next actions and held-qualified outcomes. Keep the three-screen UX.

Gates: two-workspace denial and cross-FK tests; real-source/license and provenance check; save/reload across sessions; optimistic-lock conflicts; backup/export checks; keyboard/mobile/browser path from discover → save → prepare → record outcome. Do not substitute the static demo's local checkbox for sponsor evidence. No public paid-pilot promise before these gates. Align with existing MC-03/04/05/06/07/10 and MC-11 acceptance criteria rather than introducing a second tenancy or CRM track.

## Phase 2: reviewed research and follow-up
**Outcome:** reduce preparation work while keeping the broker in control.

Implement one server-side research provider behind a flag, with bounded jobs, source provenance and usage controls. Reuse durable Chief of Staff tasks and briefing contracts (MC-13–MC-20); persist recommendations/approvals/action receipts, enforce stale-input holds and keep generated text unverified until reviewed. Begin with an approved internal-only action, then add one calendar adapter after participant agreement, availability/timezone/idempotency checks. Add scheduled briefings only after durable tenant security, freshness, observability and reliable cancellation are verified.

Gates: measured preparation-time baseline, source assertion audit, cost known/unknown reporting, partial failure/retry/cancellation tests, approval/replay denial, provider run receipts, calendar duplicate/reschedule handling, and an attributable qualified meeting. Do not enable automatic outreach merely because a provider or agent exists.

## Phase 3: expand features that earn retained use
**Outcome:** deepen value after brokers demonstrate repeated use and willingness to renew.

Prioritize based on observed pilot evidence: richer market alerts, reviewed email/video preparation, more provider coverage, team analytics and contract-based billing. Keep these tools contextual or in team operations rather than restoring a long broker sidebar. Integrate one billing authority only after signed terms and idempotent entitlements/events. Separate platform acquisition from broker origination. Evaluate an added feature by a clear outcome and support/review burden, not feature count.

Gates: segment-specific usage and renewal, source freshness/accuracy, qualified-meeting attribution, support/research cost and margin. PMF targets in the October 14 study are experiment gates, not achieved results. Use measured demand to select the next feature; no dates or conversion gains are promised.

## Deferred feedback research
A future broker-feedback flow may collect a category/comment and relevant page/record reference, with privacy controls, into a chosen Slack channel. Qualitative Google Meet interviews may complement it. Both are deferred by the user: do not connect Slack, create a webhook, send feedback, book a meeting or schedule an automation now. Revisit the method and destination with the user when that work is resumed.

## Verification and limits
Syntax and all eight limited domain/DOM-stub suites (reference, chief, latest, market, pilot, briefing, OODA, broker) passed. The broker suite covers three-item default navigation, legacy overview alias, hidden builder navigation, contextual brief persistence, shortlist add/remove without deleting data, view switches preserving records and inline outcomes. Desktop browser checks exercised Today, Opportunities, concise briefing save, shortlist save, My Pipeline and preferences/rollout. No mobile, authenticated multi-tenant/backend, provider/calendar/billing integration or Lovable publishing success is claimed. The Lovable project write scope remains unavailable.
