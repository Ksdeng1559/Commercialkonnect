# Mortgage Mix → commercial financing engine, fed by BC construction data — design

Date: 2026-10-14
Status: approved, pending implementation
Supersedes: `2026-10-14-clerk-orgs-rls-crud-design.md` (schema-isolation approach abandoned — see Context)

## Context

Earlier today's approved spec put KonstructionComOS tables in an isolated `konstruction` Postgres schema inside `amgknqnhiscryvcfeoyj`, specifically to avoid colliding with "a different live product" already in that project's `public` schema. Closer inspection of that live product changed the plan.

`amgknqnhiscryvcfeoyj` ("Mortgagesbydennis-ClearCloseDesk") hosts a multi-tenant relationship-intelligence platform (internally: RIOS) with three coexisting schema eras:

1. **Era 1** — `leads`/`opportunities`, `tenant_id`/`user_id` tenancy, multi-component financing score (credit/intent/capacity/market). Original commercial-financing scoring engine.
2. **Era 2** — `mix_*` tables ("Mortgage Mix"): residential mortgage lead gen, outreach campaigns, lender matching, partner relationship scoring. No tenant scoping column at all today — single-tenant, Dennis's own book of business.
3. **Era 3** — `workspaces`/`workspace_members`/`organizations`/`contacts`/`onboarding_sessions`/`lender_rates`/`notes`/`tasks`/`touchpoints`/`signals`/`relationships`/`episodes`, all `workspace_id`-scoped. A genuine multi-tenant platform with a `vertical`/`vertical_pack` concept on `workspaces`, and a polymorphic entity-graph convention (`related_entity_type` + `related_entity_id`) for its satellite tables (notes, tasks, touchpoints, signals).

A separate Supabase project, `urban-mining-capital-crm` (`xmublwqrofimfzkgbjca`), runs the open-source Atomic CRM template (`companies`/`contacts`/`deals`/`deal_notes`/`contact_notes`/`tasks`/`tags`/`sales`, explicit named FKs, no polymorphism). It backs the `urban-mining-crm.vercel.app` sign-in link currently hardcoded in the Lovable frontend's `Header.tsx`. **This project is not touched by this spec.** It contributed only an architectural pattern — explicit named FKs over polymorphic entity references — used as a tiebreaker below.

All `amgknqnhiscryvcfeoyj` tables currently show on the order of zero rows (pre-launch / Dennis's own test data only), so schema changes here carry no production migration risk.

## Decision: target and direction

Refactor **Mortgage Mix** (`mix_*`) into the commercial-financing opportunity engine. BC construction-project intelligence becomes a new lead-sourcing input into the same `mix_opportunities` table, not a parallel product. This directly fulfills the original ask — "refactor this CRM to focus on commercial financing opportunities" — by broadening an existing, working pipeline rather than building a second one beside it.

**FK convention (hybrid):** new core entities (`construction_projects`, and the extended `mix_opportunities`) get explicit named FKs, Atomic-CRM style — `organization_id`, `contact_id`, `construction_project_id`, `lender_id` — because that's clearer for the domain's primary relationships and most of `mix_opportunities` already works this way. Satellite concerns (notes, tasks, touchpoints) reuse RIOS's existing generic polymorphic tables (`notes`, `tasks`, `touchpoints` with `related_entity_type`/`related_entity_id`) rather than building new dedicated note/task tables — no point duplicating infrastructure that already exists and works.

**Tenancy:** Clerk Organizations remains the auth layer per `CLAUDE.md`. Clerk's `org_id` claim maps to `workspaces.id` via a new `workspaces.clerk_org_id` column — not a separate `konstruction.organizations` table as the superseded spec planned. `workspaces` is now the one Clerk-mapped tenant table platform-wide.

## Phase 0 — Mortgage Mix tenancy + FK cleanup

**Tenancy backfill.** Add `workspace_id uuid references public.workspaces(id)` to every `mix_*` table that currently lacks it: `mix_leads`, `mix_opportunities`, `mix_campaigns`, `mix_campaign_sends`, `mix_conversations`, `mix_relationship_scores`, `mix_agent_runs`, `mix_knowledge_assets`, `mix_outreach_messages`. Create one default workspace representing the existing book of business, backfill every row to it, then set `NOT NULL`.

**Clerk mapping.** Add `clerk_org_id text unique` to `workspaces`. Add a `current_workspace_id()` SQL helper: resolves `auth.jwt() ->> 'org_id'` (Clerk's org claim) to `workspaces.id` via `clerk_org_id`. The Clerk webhook (`organization.created`/`.updated`/`.deleted`) upserts `workspaces` directly using the service-role key — the one legitimate service-role use per `AGENTS.md`.

**RLS.** Every now-workspace-scoped `mix_*` table gets `workspace_id = current_workspace_id()` policies for `SELECT`/`INSERT`/`UPDATE`/`DELETE`. Supabase is configured as a third-party JWT consumer for Clerk (no shared signing secret) — same mechanism as the superseded spec described.

**`mix_leads` FK cleanup.** Add `contact_id uuid references contacts(id)` and `company_id uuid references organizations(id)`. Backfill: for each existing `mix_leads` row, upsert a `contacts` row from its inline `name`/`email`/`city`, link `contact_id`, leave `company_id` null (no company data to backfill from). Inline `name`/`email`/`city` columns stay on the table for now (not dropped — no destructive ops) but become informational-only; application code reads from the joined `contacts` row going forward. Mortgage-specific fields (`credit_band`, `estimated_ltv`, `mortgage_balance`, `property_value`, `estimated_equity`, risk flags, `urgency`, `opportunity_score`) stay on `mix_leads` as the domain-specific extension — this mirrors how Atomic CRM's `deals` keeps deal-specific fields while FK'ing out to `companies`/`contacts`.

**`mix_opportunities` FK cleanup.** Already has `contact_id` and `lender_id` — already close to the target shape. Add `company_id uuid references organizations(id)`, nullable, for opportunities tied to a developer organization rather than (or in addition to) an individual contact.

## Phase 1 — BC construction project data as a new lead source

**New table `construction_projects`:**
```
id uuid primary key default gen_random_uuid()
workspace_id uuid not null references workspaces(id)
organization_id uuid references organizations(id)   -- the developer/owner
name text not null
city text
province text default 'BC'
project_type text
construction_stage text
estimated_value numeric(18,2)
score int check (score between 0 and 100)
source_url text
source_seen_at timestamptz
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```
RLS: `workspace_id = current_workspace_id()`.

**`mix_opportunities` extension:** add `construction_project_id uuid references construction_projects(id)`, nullable. Existing free-text `type` column gains a new value, `'commercial_construction_financing'`, alongside its existing residential-mortgage types. One opportunity table now carries both product lines, distinguished by `type` and the presence/absence of `construction_project_id`.

**Stakeholders.** Developers, contractors, architects, property owners map directly to the existing `organizations` table (already has `organization_type`, `industry`, `location`). People at those organizations map directly to the existing `contacts` table (already has `role_title`, `contact_type`, `lead_score`, `tier`). No new company/contact tables — this is the single biggest simplification Phase 1 gets from living inside the existing platform instead of an isolated schema.

**Notes/tasks/touchpoints** on `construction_projects` and the new opportunity type use RIOS's existing generic tables directly: `notes.related_entity_type = 'construction_project'`, `tasks.related_entity_type = 'construction_project'`, etc. No new satellite tables.

## CRUD, auth, testing

Next.js Server Actions (not REST routes), consistent with the superseded spec's reasoning — one server-only Supabase client module shared by every action and server component. Each action derives `workspace_id` from `auth()` server-side via `current_workspace_id()`; it never trusts a workspace/org identifier from client input.

Routes: `/projects`, `/projects/[id]`, `/projects/new` for `construction_projects`; opportunity CRUD extends whatever UI already exists (or is being built) for `mix_opportunities`, adding the construction-sourced path alongside the residential-mortgage path. Validation via Zod schemas per entity.

Testing: Vitest against the Supabase CLI local stack (already fixed last session — ports remapped, harness at `tests/helpers/local-stack.ts`). Extend the cross-tenant denial test suite to cover the newly workspace-scoped `mix_*` tables, not just the new `construction_projects` table — mint two JWTs with different fake `org_id` claims, confirm workspace A cannot read/write workspace B's rows in any of them.

Migrations applied to the real `amgknqnhiscryvcfeoyj` project via the Supabase MCP tool's `apply_migration` (already authenticated in this environment). Local dev/test via `supabase start` / `supabase db reset` against the local CLI stack.

## Non-goals

- `urban-mining-capital-crm` (`xmublwqrofimfzkgbjca`) — not touched, not migrated, not referenced by any FK from this work. It contributed an architectural pattern only.
- CSV/bulk import.
- Billing, alerts, saved lists, enrichment.
- Phase 2 (auto-bridging qualified `construction_projects` into era-1 `leads`/`opportunities`'s multi-component scoring engine) — separate, later spec.
- Phase 3 (reconnecting ClearClose Desk underwriting from the paused `LeadSniper-3.0` project) — separate, later spec, explicitly deferred.
- Visual/brand alignment with the ClearConnect Lovable frontend.
- Testing the live Clerk→Supabase JWKS handshake end-to-end (only RLS policy logic is tested locally, same scoping note as the superseded spec).
