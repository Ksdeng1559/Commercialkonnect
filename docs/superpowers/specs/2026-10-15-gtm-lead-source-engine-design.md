# GTM Lead-Source Strategy Engine — First Slice Design

## Context

A doc-only branch (`docs/gtm-lead-source-playbook`, open PR #2) hands off a large spec for converting construction-project signals into evidence-backed, human-reviewed business-development opportunities: `client.brain.md`, `docs/GTM_LEAD_SOURCE_PLAYBOOK.md`, `docs/GTM_ENRICHMENT.md`, `docs/GTM_WIREFRAME.md`, `docs/GTM_EXECUTION_LOOP.md`, `docs/GTM_GOALS_SUCCESS.md`. These docs span a strategy-matching engine, an enrichment job system, a review-queue UI, a qualification Kanban, real persistence with tenancy/RLS, and an outcome/learning loop — too large for one implementation plan.

This spec scopes and designs the first buildable slice: a pure, mock-mode strategy-matching engine plus the review-queue UI that exercises it. Nothing here touches persistence, real tenancy, enrichment job infrastructure, or outbound action — those are later slices, explicitly deferred below.

The three source docs each sketch a slightly different "MVP sequence" (README's own build order, `GTM_EXECUTION_LOOP.md`'s sequence, `GTM_WIREFRAME.md`'s implementation order) that don't perfectly agree on where the first slice's boundary sits. This spec resolves that by drawing one explicit line (see "Scope" below) rather than leaving it ambiguous.

## Scope

### In scope
- Two synthetic client-brain profiles with contrasting capacity/interests (proves the fit logic discriminates, per `client.brain.md`'s own acceptance scenario), each with one hardcoded, versioned offer (no offer-editor UI).
- ~6 synthetic project fixtures with enrichment results already baked in (companies, stakeholders, field assertions) — not an interactive enrichment job runner. `GTM_ENRICHMENT.md`'s job queue/dedup/cost-cap machinery is explicitly a separate, later slice.
- The engine: `normalize → evaluate (CAP-01/02/03 only) → categorize` — a pure function pipeline, no I/O, no persistence.
- Categorical output only: Research / Review / Ready for approved action / Hold-disqualified, per `GTM_LEAD_SOURCE_PLAYBOOK.md` §8. No numeric score, no invented weights — the doc is explicit that scoring rubrics remain unresolved and must not be fabricated.
- Review-queue UI: Screen A (opportunity list/queue) + Screen B (briefing detail: Briefing / Evidence / Stakeholders / Activity tabs, static synthetic data), per `GTM_WIREFRAME.md` §3-4.
- Verification-task creation (dialog) — creates a task object in in-memory/mock state, not a real `tasks` table row.
- A lightweight pursuit-disposition action (Pursue / Partner / Nurture / Pass / Needs-research) on the opportunity detail — named as part of the same early step in both the README build order and `GTM_EXECUTION_LOOP.md`'s own sequence, so included here rather than deferred.

### Explicitly deferred (named as later steps in the source docs)
- Fact-confirmation forms (recording confirmed financing need/amount/timing, etc.) — `GTM_WIREFRAME.md` §10 defers this to a second UI pass after Screens A/B + task creation.
- Capital qualification Kanban (Screen D) — same section, explicitly sequenced after confirmation/review.
- Internal opportunity promotion to `mix_opportunities` — requires a DB transaction + idempotency key; blocked on persistence, which is itself blocked on the unexecuted Mortgage Mix tenancy/RLS plan (`docs/superpowers/plans/2026-10-14-mortgage-mix-tenancy-clerk.md`).
- Today view, outcome/feedback capture, Goals & Success scorecard — `GTM_EXECUTION_LOOP.md` steps 3-4.
- Real tenancy/RLS, Clerk/Supabase wiring for this feature — this app has no auth/DB wiring for GTM data yet; mock mode has no workspace concept to isolate, so there's nothing to test here.
- Contractor (CON-*), commercial real estate (CRE-*), referral (REF-*), relationship (REL-*) strategies — only CAP-01/02/03 (capital/financing) in this slice, matching the docs' own "primary slice: commercial finance origination for Eng & Associates" framing.

## Approach

**Pure TS rule engine in `src/lib/gtm/`** (chosen). Strategies are plain data objects (id/version, evidence predicates as functions, exclusions, buyer role, linked offer) evaluated by pure functions with no I/O. This directly matches `GTM_LEAD_SOURCE_PLAYBOOK.md`'s own instruction to ship "explainable categorical queues" and its explicit prohibition on inventing numeric weights.

Two alternatives were considered and rejected:
- A generic rules-engine library (e.g. `json-rules-engine`) — unnecessary dependency for 3 simple predicate functions; violates YAGNI given the docs want deterministic, readable rules, not a general engine.
- Pushing strategy evaluation into Postgres (mirroring the Atomic CRM DSCOS pattern) — wrong fit: this slice is pre-persistence by design, and no GTM schema exists in this app yet.

## Data model

```
ClientBrainProfile { id, name, workflowType: 'financing', goals, strengths, constraints, opportunityInterests, exclusions, capacity, offerId }
Offer { id, version, name, status, intendedCustomer, problemAddressed, deliverable, qualificationQuestions, disqualifiers, nextStepCta, linkedStrategyIds }
ProjectFixture {
  project: { id, name, municipality, type, lifecycleStage, budget: { amount, currency, basis, asOfDate } }
  signals: Signal[]               // event type, event date, evidence refs, confidence, freshness
  stakeholders: StakeholderRelationship[]  // company/person ref, projectRole, identityConfidence, appointmentStatus, verifiedDate
  fieldAssertions: FieldAssertion[]         // field, value, status (unknown/candidate/corroborated/stakeholder_confirmed/conflicting/stale), source, date
}
Strategy { id, version, segment: 'capital', label, evidencePredicate: (ctx) => PredicateResult, exclusionPredicate, buyerRole, offerId, nextAction }
EvaluationResult {
  strategyId, strategyVersion, matchedFacts, missingInfo, disqualifiers,
  queueState: 'research' | 'review' | 'ready' | 'hold',
  clientProfileVersion, offerVersion
}
PursuitDecision {
  opportunityId, disposition: 'pursue' | 'partner' | 'nurture' | 'pass' | 'needs_research',
  reason, actor, decidedAt, evaluationResultRef  // the EvaluationResult this decision was made against
}
```

`EvaluationResult` is the engine's pure output. `PursuitDecision` is a separate, human-recorded action captured by `PursuitDecisionControl` and held in mock UI state — never silently merged into or overwritten by a later engine re-evaluation, per `GTM_EXECUTION_LOOP.md`'s "store recommendation separately from the user's decision."

Every `EvaluationResult` carries the profile/offer/strategy versions used, per `client.brain.md` §10's required recommendation fields — so the same project can legitimately produce different results per client profile (the two-profile acceptance scenario).

## File layout

- `src/lib/gtm/types.ts` — types above.
- `src/lib/gtm/strategies/cap.ts` — CAP-01, CAP-02, CAP-03 as data objects.
- `src/lib/gtm/engine.ts` — `normalize(fixture)`, `evaluateStrategies(project, clientBrain, strategies)`, `categorize(evaluation)`. Pure, synchronous, no network/DB.
- `src/lib/gtm/fixtures/clientBrains.ts` — 2 contrasting synthetic profiles.
- `src/lib/gtm/fixtures/offers.ts` — 2 offers, one per profile.
- `src/lib/gtm/fixtures/projects.ts` — ~6 synthetic project fixtures (new BC municipalities; same flavor as `src/lib/demo.ts` but a richer shape). `src/lib/demo.ts` and the existing dashboard (`src/app/page.tsx`) are untouched by this slice.
- `src/app/gtm/page.tsx` — Screen A (queue), route `/gtm` per `GTM_WIREFRAME.md` §2's own suggested route.
- `src/app/gtm/[id]/page.tsx` — Screen B (detail), per the wireframe's preference for a dedicated route over a dialog for "lengthy evidence editing."
- `src/components/gtm/` — `OpportunityList`, `OpportunityRow`, `OpportunityBriefingPanel`, `EvidenceList`, `StakeholderRoles`, `VerificationTaskDialog`, `PursuitDecisionControl`.

## Testing

`package.json` has no test script or framework today (confirmed by inspection). This slice adds **Vitest** (same family as the separate Atomic CRM repo's setup; zero conflict with Next.js/React 19) and a `npm run test` script.

Tests colocated with source: `src/lib/gtm/engine.test.ts`, `src/lib/gtm/strategies/cap.test.ts`. Cover the acceptance scenarios named in `GTM_LEAD_SOURCE_PLAYBOOK.md` §12 and `client.brain.md`'s acceptance scenarios, scoped to what this slice actually builds:
- Permit with no sponsor/financing confirmation → `research`, financing need stays unknown (not inferred).
- Verified match but financing already committed → no new-financing claim; `hold` or requires independently confirmed future need.
- Missing builder/applicant field → never produces a "confirmed gap" disqualifier; stays `research`/`review` with an explicit missing-info entry.
- Same project fixture evaluated twice → identical result (no duplicate-hypothesis drift — this is a pure-function determinism check, not a dedup-persistence test, since there's no DB yet).
- Two client-brain profiles against the same project fixture → different `queueState`/`pursuitDisposition` where their confirmed interests/capacity actually differ, and `insufficient_profile`-equivalent (`research` with a missing-profile-field reason) where a required preference is unknown.
- Excluded project (cancelled/awarded/out-of-territory) → `hold` via the exclusion predicate, not just a low match.

UI-level tests (component rendering, task-dialog interaction) are a nice-to-have for this slice, not a blocking requirement — the engine's correctness is the load-bearing concern; the UI is a thin, mostly-static presentation layer over it in this slice.

## Out-of-scope reminder for the next slice

The very next slice after this one is explicitly named by the docs: fact-confirmation forms + capital Kanban (per `GTM_WIREFRAME.md` §10), still fully mock. Persistence (Clerk/Supabase wiring, real tenancy/RLS, `mix_opportunities` promotion) only becomes possible once the Mortgage Mix Phase 0 plan actually executes — this slice does not depend on or block that work.
