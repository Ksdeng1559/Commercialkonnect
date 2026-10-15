# Multi-Tenant Construction-Intelligence Retrofit — Atomic CRM

> **Target repo:** `G:\AI-Applications\atomic-crm` (a separate, already-existing marmelab Atomic CRM clone) — NOT this repository. Documented here for visibility/review only, since it was discovered via this repo's Notion cross-check. KonstructionComOS's own Next.js/Clerk/Mortgage-Mix track (see `docs/superpowers/plans/2026-10-14-mortgage-mix-tenancy-clerk.md`) is confirmed separate and untouched by this plan.

## Context

Notion's "Canadian Construction Intelligence — Product Definition Document" (§26, locked 2026-10-14) commits to a build direction that was never reflected in any codebase: fork the existing marmelab Atomic CRM app, retrofit it for multi-tenancy, and layer a Construction Intelligence module on top to serve two internal pilot tenants (Eng & Associates — financing/Capital Radar workflow; GPC Development — contractor-bid DSCOS workflow).

This was discovered by cross-checking the Notion doc against two other things that already exist and disagree with it:
- The KonstructionComOS git repo, which is committed to a *different* stack (Next.js/Clerk/`workspace_id`) for a *different* product framing (Mortgage Mix refactor). That track is confirmed separate and stays untouched by this plan.
- A real, already-present Atomic CRM clone at `G:\AI-Applications\atomic-crm` — single-tenant, Supabase Auth, no construction-intelligence code of any kind. This is the actual target.

This plan reconciles the gap: a concrete, phased path from "mock-data-only Atomic CRM fork" to "multi-tenant construction-intelligence CRM with real BuildData ingestion," built directly against that repo's existing conventions rather than inventing new ones. Several inputs the PDD itself hasn't resolved (BuildData API field names, licence terms, two DSCOS scoring sub-bands) are treated as explicit blocking gates, not filled in with guesses.

**Target repo:** `G:\AI-Applications\atomic-crm` only.
**Scope:** full PDD §26.4 five-phase build sequence (Contract → Core → Intelligence → Action → Switch → Real-data gate).

## Repo facts this plan relies on

- Stack: Vite 7 + React 19 + React Router v7, `ra-core` + vendored shadcn-admin-kit (`src/components/admin/*`), `ra-supabase-core` (real provider) and `ra-data-fakerest` (mock provider) side by side.
- **Mock-first is already a working pattern here** — `demo/App.tsx` + `vite.demo.config.ts` already boot the whole app against `providers/fakerest/dataProvider.ts` + `providers/fakerest/dataGenerator/index.ts`. New Construction Intelligence screens get built against an extension of this, not a new mocking approach.
- Supabase uses a **declarative schema workflow**: `supabase/schemas/01_tables.sql` … `07_storage.sql` are the source of truth; actual migrations are generated via `npx supabase db diff --local -f <name>`, never hand-written directly against `supabase/migrations/`.
- 10 existing tables (`companies, contacts, contact_notes, deals, deal_notes, sales, tags, tasks, configuration, favicons_excluded_domains`), all single-tenant: RLS is enabled everywhere but every policy is `using (true)`/`with check (true)` scoped `to authenticated` — "any authenticated user sees/edits everything."
- `is_admin()` (`supabase/schemas/02_functions.sql`) is the template to clone for the new tenant-resolution function — `SECURITY DEFINER`, `SET search_path TO ''`, resolves off `auth.uid()` via the `sales` table.
- Auth is Supabase Auth only, fully wired (`providers/supabase/authProvider.ts`). No Clerk anywhere. Clerk Organizations is explicitly deferred to external launch per PDD (open decision `D-AUTH`) — not resolved by this plan.
- Resource pattern: `src/components/atomic-crm/<resource>/{index.ts, XList.tsx, XShow.tsx, ...}`, registered via `<Resource name="x" {...x} />` in `root/CRM.tsx`. Non-CRUD dashboard pages use `<CustomRoutes>` + plain `<Route>` (see `ImportPage.tsx` pattern).
- Repo has never been linked to a remote Supabase project — 100% local Docker dev today.

## Cross-cutting primitives (built in Phase 1, used everywhere after)

- **`public.tenants`** (new table): `id bigint identity PK`, `slug text unique` (`eng`, `gpc`), `name text`, `workflow_type text check in ('financing','contractor_bid')`, `created_at`.
- **Tenant membership = `sales.tenant_id`** (direct FK column, not a separate membership table) — correct for the pilot's one-tenant-per-user, 2-tenant scope. Note in `doc/construction-intelligence.md` that this is expected to be swapped (not extended) if/when Clerk Organizations replaces Supabase Auth later.
- **`current_tenant_id()`** in `02_functions.sql`, cloned from `is_admin()`'s shape but `STABLE`: `select tenant_id from public.sales where user_id = auth.uid()`. Triple-granted (`anon`/`authenticated`/`service_role`) in `06_grants.sql`, matching the existing block's style.
- **`set_tenant_id_default()` trigger** — unconditionally overwrites `NEW.tenant_id := public.current_tenant_id()` on insert (deliberately *not* a copy of `set_sales_id_default()`'s "fill only if null" pattern — tenant isolation can't be client-forgeable). Document this divergence explicitly.
- **RLS belt-and-suspenders**: every INSERT/UPDATE policy also carries `with check (tenant_id = public.current_tenant_id())` even though the trigger already forces it.
- **Tenant-agnostic exceptions** (confirmed): `municipality_capabilities` and `builddata_records` get **no** `tenant_id` column — both hold objective public-record/reference data, and sharing them avoids each tenant separately burning the 100-req/day free-tier BuildData budget on identical city data. RLS on these two: `using (true) to authenticated`, read-only in practice.
- **Secret name**: `BUILDDATA_API_KEY` (double-D), used consistently in `supabase/functions/.env`, the new shared client module, and any deployment docs.

## Phase 0 — Contract

**Files to create:**
- `doc/construction-intelligence.md` — MVP entity list, the `current_tenant_id()` seam, "BuildData is sole import source" rule, DSCOS/Capital-Radar independence rule, and a BuildData field-name mapping table for `/property`, `/permit/{record_id}/history`, `/address/normalize`, `/{dataset}/coverage`, `/contractor` — every field marked `PLACEHOLDER — confirm against real sample response` (blocked on gate #1 below). Add a one-line include from `CLAUDE.md`.
- `src/components/atomic-crm/types.ts` additions: `Tenant`, `Project`, `ProjectRecord`, `ProjectCompany`, `ConstructionSignal`, `SignalEvidence`, `Opportunity`, `Outcome`, `AttributionEvent`, `BuilddataRecord`, `BuilddataIngestionRun`, `BuilddataCoverage`, `MunicipalityCapability`.
- New FakeRest generator modules in `providers/fakerest/dataGenerator/` — one file per entity above, following the existing per-entity module pattern (`companies.ts`, `deals.ts`).
- `providers/fakerest/dataGenerator/types.ts` — extend `Db` type with new collections.
- `providers/fakerest/dataGenerator/index.ts` — wire new `generate*(db)` calls in dependency order (tenants/sales → companies/contacts → projects → project_records/project_companies → construction_signals → signal_evidence → opportunities → outcomes/attribution_events); extend `finalize(db)` to cross-link new entities.
- `test-data/builddata-*-sample.json` fixtures, same `PLACEHOLDER` marking.

No schema migration in this phase — Phase 0 is TS/mock-only by design.

**Verification:** `npm run test:unit:app`; a FakeRest-provider boot smoke test asserting `getList("projects")`/`getList("opportunities")` resolve against the extended `Db` without throwing, before any UI is built against them.

## Phase 1 — Core

**Track A (UI, FakeRest-backed):**
- `src/components/atomic-crm/construction-intel/BuildDataImportPage.tsx`, `RadarPage.tsx`, `CoverageMatrixPage.tsx` — `<CustomRoutes>` pages (non-CRUD, join across tables via custom dataProvider methods, not `useGetList` directly).
- `src/components/atomic-crm/projects/{index.ts, ProjectList.tsx, ProjectShow.tsx}` — Project Detail is a standard resource Show page (single-record, fits the `companies`/`contacts` precedent), not a CustomRoute. `ProjectShow` renders `project_records` timeline, `project_companies` stakeholders, linked `construction_signals`/`opportunities` via `ReferenceManyField`.
- Bare `<Resource>` registrations (no custom components, matching `contact_notes`/`deal_notes`) in `root/CRM.tsx` for: `project_records`, `project_companies`, `construction_signals`, `signal_evidence`, `opportunities`, `outcomes`, `attribution_events`, `builddata_records`, `builddata_ingestion_runs`, `builddata_coverage`, `municipality_capabilities`; a real `<Resource name="projects" {...projects} />` alongside. Whole block wrapped in a `VITE_ENABLE_CONSTRUCTION_INTEL` conditional (off by default in main app `.env`, on in demo config — see Phase 4).

**Track B (backend — tenancy spike):**
- `01_tables.sql`: add `tenants`; add nullable `tenant_id bigint references tenants(id)` to all 10 existing tables; add `municipality_capabilities` as the one new "canary" table this phase (proves the pattern on a brand-new table before Phase 2's heavier FK-laden entities).
- `02_functions.sql`: add `current_tenant_id()`, `set_tenant_id_default()`.
- `04_triggers.sql`: `before insert` tenant-id trigger on each of the 10 existing tables (not on `municipality_capabilities`).
- `05_policies.sql`: rewrite every `using (true)`/`with check (true)` on the 10 existing tables to `using (tenant_id = public.current_tenant_id())`; add scoped RLS on `tenants`; add `using (true)` read-only RLS on `municipality_capabilities`.
- `06_grants.sql`: triple-grant new objects, matching existing style.
- Migration order: nullable → backfill (2 tenant rows + backfill every table's `tenant_id` from its `sales_id`) → `not null` → enable RLS. Safe to replay against a real remote project later even though none exists yet.
- `seed.sql`: insert the 2 pilot tenant rows, assign seed `sales` rows to one each.
- Generate: `npx supabase db diff --local -f tenancy_retrofit`.
- Frontend: extend `providers/supabase/authProvider.ts`'s `getIdentity()` to also return `tenant_id`/`tenant_slug`/`workflow_type`. New `providers/tenant/resolveTenantFromHostname.ts` — pure function, `window.location.hostname` → tenant slug, dev fallback via `VITE_DEFAULT_TENANT_SLUG`. Presentation-only; never gates data access (RLS does that).

**Verification:**
- New Vitest project `"db"` (`vitest.config.ts` projects array, `supabase/tests/**/*.test.ts`, `npm run test:unit:db`) — new category, no prior precedent in this repo (the existing `"functions"` project has zero actual test files today).
- `supabase/tests/tenancy_isolation.test.ts`: seed 2 fake `auth.users` (one per tenant) via a service-role client, sign in as each via the **local** Supabase JS client, assert over PostgREST (not raw SQL — this is the actual code path the app depends on): tenant A never sees tenant B's rows; an INSERT with a forged `tenant_id` still lands under the inserting tenant (proves the trigger, not just the policy); cross-tenant `getOne` returns empty, not another tenant's row.
- `make typecheck && make lint`.

## Phase 2 — Intelligence

**Track A:**
- `construction-intel/StakeholderMapPage.tsx`; `FinancingPage.tsx` (gated to `workflow_type = 'financing'`, Eng-only); `BattleCardPage.tsx` (gated to `'contractor_bid'`, GPC-only).
- `companies/CompanyIntelligencePanel.tsx`, `contacts/ContactIntelligencePanel.tsx` — new panels added into the **existing** `CompanyShow.tsx`/`ContactShow.tsx`, not parallel CRM tables (explicit PDD instruction).
- Extend Phase 0's `projectCompanies.ts`/`constructionSignals.ts` generators with stakeholder-role/signal-type variety these screens need.

**Track B:**
- `01_tables.sql`: add the remaining §20.7 MVP tables, `tenant_id not null` from creation (no retrofit dance needed — Phase 1 already built the pattern): `projects`, `project_records`, `project_companies` (FK to existing `companies` — no parallel table), `construction_signals`, `signal_evidence`, `opportunities` (carries all DSCOS fields: `dscos_score`, `dscos_band`, `dscos_breakdown jsonb`, `dscos_scoring_version`, `dscos_narrative`, `procurement_state`, `eligibility`, `investigator_findings`, `approval_state`, `next_verification_date`), `outcomes`, `attribution_events`, `builddata_records`/`builddata_ingestion_runs`/`builddata_coverage` (no `tenant_id`, per the shared-cache decision above).
- `02_functions.sql`: `compute_dscos_score(opportunity_id) returns jsonb` — deterministic, versioned, `STABLE`, pinned `search_path`. Implements only the 4 well-defined factors now (Builder Gap 25 / Permit Status 20 / Recent Activity 15 / Architect Known 10 = 70 of 100 points).

  🛑 **BLOCKING GATE — do not complete this function.** Project Value (20pt) and Applicant Type (10pt) have no defined sub-band thresholds anywhere in the PDD, and the spec's own §20.6 illustrative example (18 + 7 → 95/100) doesn't reproduce from the stated bands. Leave both factors as explicit stubs returning `null`; flag the overall result `is_provisional: true` until Dennis supplies the missing sub-bands. Never use §20.6 as a test fixture — it's internally inconsistent. Don't surface this score as a finished number on any tenant-facing screen until unblocked; show "scoring pending" instead.

  Keep this function and its narrative field (`dscos_narrative`, written by a separate LLM-explanation call path, out of scope here) strictly separate from Capital Radar's Project Opportunity/Relationship/Evidence Completeness scores — those live in the other, separate KonstructionComOS track and are **out of scope for this plan entirely**.
- New Edge Function `supabase/functions/builddata_import/index.ts` (same middleware chain as `merge_contacts/index.ts`) + `supabase/functions/_shared/builddataClient.ts` (module-level `Deno.env.get("BUILDDATA_API_KEY")`, outbound fetch with `X-API-Key` header, mirroring `_shared/supabaseAdmin.ts`'s style).

  🛑 **BLOCKING GATE — rate limit.** BuildData's per-minute limit is unpublished. `builddataClient.ts` backoff must use a conservative, env-configurable delay constant, not a hard-coded guess; tightened in Phase 5 once confirmed.
- `config.toml`: add `[functions.builddata_import]` / `verify_jwt = false`.
- Generate: `npx supabase db diff --local -f construction_intelligence_tables`.

**Verification:**
- `npm run test:unit:functions` — `builddata_import/*.test.ts`, mocked `fetch`, no live network in CI.
- `supabase/tests/dscos_scoring.test.ts` — seed cases for the 4 unblocked factors, assert Hot ≥70 / Warm 45-69 / Cold <45 bands apply correctly; `.skip` the Project Value/Applicant Type cases with a TODO pointing at the blocking gate.
- `npm run test:unit:app` — `CompanyIntelligencePanel.test.tsx`, `ContactIntelligencePanel.test.tsx`, `StakeholderMapPage.test.tsx`.
- `e2e/stakeholderMap.spec.ts`, `e2e/battleCard.spec.ts`.

## Phase 3 — Action

**Track A:**
- `construction-intel/ActivationQueuePage.tsx` — opportunities above a band threshold pending human approval; relies on RLS, no manual tenant filter in the query.
- `promoteOpportunityToDeal(opportunityId)` custom dataProvider method, added identically to `providers/supabase/dataProvider.ts` and `providers/fakerest/dataProvider.ts`, backed by new Edge Function `supabase/functions/promote_opportunity/index.ts` (multi-table write: insert `deals` row, insert `attribution_events` row, update `opportunities.approval_state`) — deliberately the seam where a future "push to external CRM" webhook (PDD's "one handoff module") gets inserted later, with zero frontend change needed then.
- Extend existing `dashboard/Dashboard.tsx` with `DscosHotlistWidget.tsx`, `CoverageSummaryWidget.tsx`, tenant-conditional (GPC sees DSCOS widgets; Eng's existing widgets untouched).
- `root/ConfigurationContext.tsx`: add a `workflowType`/tenant-derived field, following the existing `taskTypes`/`dealStages` pattern.

**Track B:**
- `02_functions.sql`: `enforce_first_touch_guard()` trigger — rejects a second "activation" claim on the same opportunity.
- `04_triggers.sql`: wire it `before insert` on `attribution_events`/`opportunities`.
- `attribution_events` table already exists (Phase 2) — this phase wires the calls that populate it on promote/dismiss, not table creation.
- Generate: `npx supabase db diff --local -f first_touch_guard_and_audit_triggers`.

**Verification:**
- `supabase/tests/first_touch_guard.test.ts` — second-promotion attempt rejected, independently per tenant.
- `npm run test:unit:functions` — `promote_opportunity/index.test.ts`.
- `e2e/activationQueue.spec.ts`.
- `npm run test:unit:app` — `ActivationQueuePage.test.tsx`, `DscosHotlistWidget.test.tsx`.

## Phase 4 — Switch

Given this repo's real shape, "switch" is a feature-flag flip, not a provider swap — `demo/App.tsx` permanently uses FakeRest, the main app permanently uses Supabase; there's no runtime provider to switch. What actually happens:

- Flip `VITE_ENABLE_CONSTRUCTION_INTEL` to on-by-default in the main app's build config, once Phase 2 migrations + Edge Functions are deployed and verified. (Set it to `true` in `vite.demo.config.ts`/`demo/.env` from Phase 1 onward already — gives the "mock data runs end-to-end as fallback/demo" behavior for free.)
- `providers/supabase/dataProvider.ts`: add `opportunities_summary` (and `projects_summary` if Radar/Battle Card need denormalized joins) to `03_views.sql` (additive `CREATE OR REPLACE VIEW`, new columns appended last), route `getList("opportunities")` to it, mirroring the existing `companies` → `companies_summary` override.
- Run `scripts/supabase-remote-init.mjs` (`make supabase-remote-init`) — the repo has never been linked to a remote project; pilot users on `gpc.klick2client.com`/`eng.klick2client.com` can't reach local Docker Postgres. Sequencing prerequisite for this phase.

**Verification:** re-run Phase 1-3's "db" project tests against the migrated schema; full `make start-e2e` pass with `VITE_ENABLE_CONSTRUCTION_INTEL=true` baked into `config.e2e.toml`, exercising every new screen end-to-end for the first time against a real (e2e) Supabase instance.

## Phase 5 — Real data gate

Entirely blocked on two open items by design — Phases 0-4 complete in full without BuildData ever being touched for real.

🛑 **Gate (key/field names):** nothing starts until Dennis obtains the free BuildData key and shares one real sample response per endpoint. `doc/construction-intelligence.md` stays `PLACEHOLDER` until then.

🛑 **Gate (licence):** the licence covers display and enrichment separately and may clear on different timelines — use two independent flags, `VITE_BUILDDATA_ENRICHMENT_LIVE` and `VITE_BUILDDATA_DISPLAY_LIVE`, not one combined flag.

Once cleared: update the contract doc from `PLACEHOLDER` to real fields, adjust `builddata_import`'s mapping (small follow-up migration if the real shape drifts from the Phase 0 guess); add `builddata_import/resolution.test.ts` against real (redacted) fixtures, asserting N raw records collapse into the expected number of `projects` — the actual "mapping/resolution precision" check the PDD asks for; replace the Phase 2 placeholder backoff constant with the real confirmed rate limit.

## Migration structuring

One migration per phase (`tenancy_retrofit`, `construction_intelligence_tables`, `first_touch_guard_and_audit_triggers`), never combined. The tenancy retrofit touches live tables with existing data and policies (inherently a rewrite); new-table creation is purely additive and should get RLS from `create table` with no nullable→backfill→not-null dance. Mixing them means a bug in either blocks the other from shipping. Matches this repo's existing one-concern-per-migration precedent.

## Scope-gap guardrail

The PDD's broader §14 vision lists 30+ entities; this plan builds only the §20.7 MVP subset (~12 tables). Don't let Phase 2 quietly expand into building the full §14 list "since we're in there anyway" — enforce the phase boundary as a scope discipline during review. Keep `construction_signals.signal_type` and `project_companies.role` as plain `text`, not Postgres `enum`, so later splitting into dedicated tables doesn't require an enum migration first. Keep `municipality_capabilities`'s per-dataset booleans (not a single top-level enum) so new datasets don't require a schema change.

## Consolidated blocking gates

| # | Item | Blocks | Resolution |
|---|---|---|---|
| 1 | BuildData key / real field names unknown | Phase 5, finalizing Phase 0 contract | `PLACEHOLDER`-marked guesses only until resolved |
| 2 | BuildData licence (display vs. enrichment) unreviewed | Phase 5 reaching any tenant-facing screen | Two independent flags, each unblocks on its own timeline |
| 3 | BuildData per-minute rate limit unknown | Finalizing Phase 5 backoff | Conservative, configurable placeholder from Phase 2 |
| 4 | Project Value/Applicant Type sub-bands undefined; §20.6 example doesn't reproduce | Phase 2's `compute_dscos_score()` | Stub as `null`/`is_provisional: true`; never use §20.6 as a fixture |
| 5 | Project Opportunity/Relationship/Evidence Completeness scores have no point values | N/A | Out of scope for this plan — belongs to the separate KonstructionComOS/Capital Radar track |

## Confirmed design decisions

- `builddata_records` and `municipality_capabilities`: shared, no `tenant_id` (saves API budget across tenants on identical public data).
- BuildData secret env var: `BUILDDATA_API_KEY` (double-D).
- Tenant membership: single `tenant_id` column on `sales`, not a membership join table — correct for 2-tenant pilot scope, expected to be swapped (not extended) if Clerk Organizations replaces Supabase Auth later.
