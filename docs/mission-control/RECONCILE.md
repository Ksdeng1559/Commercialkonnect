# MC-00 — reconcile: PR #1–#6 actual vs planned

What the first six PRs proposed, what actually landed, and how each maps onto the Mission Control backlog in [_status.md](_status.md). Written after merging main into this branch (merge `30e67db`), so "actual (main)" reflects the current app this branch now carries.

## One-line state

**None of PR #1–#6 is merged.** All six are still OPEN against `main` (except #4, stacked on #1). So "actual" on `main` is: the synthetic executive dashboard (`src/app/page.tsx`, `src/lib/demo.ts`), the Supabase schema with RLS enabled and no policies, the docs tree, and CI that runs typecheck/lint only. Everything PR #1–#6 describes is proposed, not shipped. This branch adds the intake slice (adapter + repository + actions + migration) and now the MC-03 RLS policies on top of that merged base.

## Map

| PR | Title | Base | Size | State | Lands as | MC ticket | Reconciliation note |
|---|---|---|---|---|---|---|---|
| #1 | Build interactive BC construction intelligence dashboard | `main` | +7343 | OPEN | app shell, mock dashboard components, `tests/demo.test.ts` | MC-01 | Prototype/mock only — `mock-dashboard.tsx`, `project-kanban.tsx`, `demo.ts`. Ships a test file, so a runner is expected but `package.json` on main has none wired. Reconcile: adopt as the MC-01 shell, keep demo data clearly labeled, do not mix into live tables. |
| #2 | Claude Code client intelligence + GTM implementation handoff | `main` | +1096 | OPEN | docs: GTM enrichment/execution/goals/playbook/wireframes, `client.brain.md` | MC-02, MC-08 | Docs + the first `client.brain.md`. Feeds the qualification engine (MC-02) and the GTM review queue (MC-08). No code. Reconcile: this is factory/reference material, not product. |
| #3 | Broker-console design prototype + spec with unified inbox | `main` | +7515 | OPEN | `docs/design/BROKER_CONSOLE.md`, `prototypes/broker-console.html` | MC-01, MC-15 | Static HTML prototype + spec. Overlaps MC-15 (human review queue) and the broker-review surface for QUALIFICATION. Reconcile: design reference; no live claims. |
| #4 | BuildData API integration + GTM opportunity pipeline | `feature/mock-dashboard` (#1) | +93 | OPEN | `docs/BUILDDATA_INTEGRATION.md`, `.env.example` | MC-05 | **Stacked on #1, not main** — can't merge until #1 lands. Pure spec; the P0 Clerk/Supabase isolation dependency (this branch's work) must precede any ingestion. Reconcile: MC-05 stays blocked on MC-03. |
| #5 | GTM outreach system contract + tested dry-run planner | `main` | +379 | OPEN | `src/lib/gtm/outreach.ts`, `tests/gtm-outreach.test.mjs`, workflow yml | MC-08 | Only PR besides #1 with runnable code + a `.mjs` test. Dispatch is dry-run/disabled by default — matches the WF "dispatch disabled" rule. Reconcile: MC-08, keep dispatch off until review queue exists. |
| #6 | Harvey fork as pinned outreach worker (safe foundation) | `main` | +106 | OPEN | `.gitmodules`, `services/harvey` submodule, docs | MC-08, MC-16 | Adds a submodule (pinned). CASL risk noted in project memory. Reconcile: foundation only; no sending path wired; gate behind HITL + consent before any outreach. |

## Dependency facts surfaced

- **PR #4 is stacked on PR #1**, so the BuildData spec can't reach `main` independently — merging #1 first, or rebasing #4 onto `main`, is required. Everything else targets `main` directly.
- **Two PRs carry test files** (`tests/demo.test.ts`, `tests/gtm-outreach.test.mjs`) but `main`'s `package.json` wires no test runner. Landing either forces the runner decision (see the intake `node:test` suites in the same bind). This is the single most repeated gap across the branch.
- **No PR wires RLS policies.** All of #1–#6 either enable RLS with no policy or touch docs only. The tenant-isolation P0 is this branch's job (MC-03, now added) and gates MC-05 ingestion.

## What this branch adds beyond #1–#6

- Intake slice: `src/lib/intake/{transcript-adapter,repository,actions}.ts` + `supabase/migrations/20261105_intake_funding.sql` (stages 03→04, consent-gated, unknown-preserving).
- `src/lib/supabase/server.ts` (`createRlsClient`) pulled from `docs/port-builddata-integration-spec` so the actions resolve.
- MC-03: `supabase/migrations/20261105_intake_rls_policies.sql` — `current_org_id()` + tenant policies on the five intake tables.

## Decisions extracted as ADRs

See [adr/](adr/): 0001 tenant-isolation model, 0002 non-atomic intake persistence, 0003 classifier provider boundary.
