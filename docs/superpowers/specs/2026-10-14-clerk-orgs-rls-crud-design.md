# Clerk Organizations + Supabase RLS + Project/Stakeholder/Opportunity CRUD — design

Date: 2026-10-14
Status: approved, pending implementation

## Context

This is the first coding workstream named in `CLAUDE.md`/`AGENTS.md`: Clerk Organizations with verified server-side tenant mapping, complete Supabase RLS policies, CRUD for the core domain tables, and cross-tenant denial tests. The repo currently has only a demo dashboard (`src/app/page.tsx`, `src/lib/demo.ts`) with no auth, no RLS policies, and no live persistence.

## Provisioned infrastructure (already done)

- Clerk application **KonstructionComOS** created (`app_3KhQQsHotAkwChHarHIespkB74q`), linked to this repo via the Clerk CLI, Organizations enabled with `force_organization_selection: true`.
- Dev keys pulled into `.env.local` (gitignored). `CLERK_WEBHOOK_SECRET` is still blank — set once the webhook endpoint exists (section 2).
- Supabase project confirmed: `amgknqnhiscryvcfeoyj` ("Mortgagesbydennis-ClearCloseDesk"). **This project already hosts a different, live product's schema** (`public.organizations`, `public.opportunities`, `public.companies`, `public.contacts`, `public.workspaces`, plus `mix_*`/`outreach_*`/`rios_*` tables) with an incompatible, `workspace_id`-based multi-tenancy model. KonstructionComOS tables must not go in `public` — see schema isolation below.
- Both Clerk and Supabase credentials recorded in the Notion "API Keys — Minimal Registry" database.
- `supabase init` run locally (`supabase/config.toml` created) for the local Docker test stack. **Not** linked to the remote project via `supabase link` — no personal access token / browser OAuth available in this environment. Remote schema work goes through the Supabase MCP tool instead (see section 5).

## 1. Schema isolation

All KonstructionComOS tables live under a dedicated Postgres schema, **`konstruction`**, not `public`. This avoids any name collision or accidental interaction with the existing CRM schema in the same database/project.

- `konstruction.organizations`, `konstruction.projects`, `konstruction.stakeholders`, `konstruction.opportunities` — same shape as the current `supabase/schema.sql`, just namespaced.
- `konstruction.current_org_id()` — SQL helper, resolves `auth.jwt() ->> 'org_id'` (Clerk's org ID) to the internal `organizations.id` UUID via `clerk_org_id`. Every RLS policy references this one function instead of repeating the subquery.
- **Manual one-time step** (no API/CLI tool covers this): in the Supabase dashboard, Project Settings → API → Data API settings, add `konstruction` to the exposed-schemas list (default is `public, graphql_public`). PostgREST will not serve `konstruction.*` tables until this is done. Must happen before any client code can query them.
- The Supabase client in `src/lib/supabase/server.ts` is configured with `db: { schema: 'konstruction' }`.

## 2. Tenant identity flow

Clerk's session token carries an `org_id` claim whenever a user has an active organization. Supabase is configured as a **third-party auth consumer** (Supabase's native Clerk integration): the server-side Supabase client's `accessToken` callback calls `auth().getToken()` to get the Clerk session JWT, and Supabase verifies it against Clerk's JWKS for this instance. No shared signing secret, no custom JWT template.

RLS on `konstruction.projects`, `.stakeholders`, `.opportunities`: `organization_id = konstruction.current_org_id()` for all of `SELECT`/`INSERT`/`UPDATE`/`DELETE`. `konstruction.organizations` gets a `SELECT`-only policy (`clerk_org_id = auth.jwt()->>'org_id'`); no write policy is granted to `authenticated`, so RLS's default-deny blocks any client write — only the webhook, using the service-role key, can write it.

## 3. Org provisioning (webhook)

`POST /api/webhooks/clerk` verifies the Svix signature using `CLERK_WEBHOOK_SECRET`, handles `organization.created` / `.updated` / `.deleted`, and upserts `konstruction.organizations` using the service-role key — the one legitimate service-role use per `AGENTS.md` (provisioning, not request-serving). Idempotent on `clerk_org_id` so Clerk's retry-on-failure can't double-insert.

`organization.deleted` cascades per FK (`on delete cascade`) — acceptable for MVP since no org holds live customer data yet. Flagged as a real data-loss risk to revisit before production traffic.

## 4. CRUD surface

Server Actions, not REST routes — idiomatic for Next.js App Router, and keeps the authenticated Supabase client in one server-only module that every action and server component shares. Each action derives the org from `auth()` server-side; it never trusts an `organization_id` from form input.

Routes: `/projects`, `/projects/[id]`, `/projects/new` (same pattern for `/stakeholders`, `/opportunities`). Root `/` becomes the live dashboard — `src/lib/demo.ts` fixtures are removed from the render path (kept in the file for reference/seeding only) and replaced by a real query against the signed-in org's data. An org with zero projects shows an empty-state CTA, not demo rows, per `CLAUDE.md`'s instruction not to mix illustrative and live data.

Validation: Zod schemas per entity for create/update inputs. `opportunities.project_id` keeps the schema's default `RESTRICT` FK — deleting a project with linked opportunities fails with a clear UI error ("remove or reassign opportunities first") rather than silently cascading.

CSV import (listed as P0 in `PRD.md`/`AGENTS.md`'s broader scope) is **out of scope for this slice** — manual CRUD first; import is a clean follow-on once schema and RLS are proven end-to-end.

## 5. Migrations & local dev

`supabase/schema.sql` becomes the first Supabase CLI migration (`supabase/migrations/<ts>_initial_schema.sql`, rewritten for the `konstruction` schema); RLS policies and `current_org_id()` become a second migration. This unlocks `supabase start` / `supabase db reset` for local dev and CI, using the local project config from `supabase init` (local Docker stack only — not remotely linked).

The CLI is **not** linked to the remote project (`supabase link` needs a personal access token and browser OAuth, unavailable in this environment). Migrations are applied to the real `amgknqnhiscryvcfeoyj` project directly via the Supabase MCP tool's `apply_migration`, which is already authenticated. README's "run schema.sql in the SQL editor" instruction is replaced with "migrations applied via Supabase MCP" (plus the manual exposed-schema step above, once, on the actual project). CLI remote linking can be revisited later if `db push`/`db diff` workflows are wanted.

## 6. Testing

Vitest + Supabase CLI local stack (Docker, available on `ubuntu-latest`). Harness: `supabase start` → apply migrations → mint two JWTs signed with the **local** dev JWT secret, each with a different fake `org_id` claim → run `supabase-js` queries as each → assert org A cannot read/write org B's `projects`/`stakeholders`/`opportunities`, and cannot read org B's `organizations` row.

Scoping note: this tests the **RLS policy logic** against a token shaped like Clerk's, not the live Clerk→Supabase JWKS trust handshake itself (project-level config, not locally testable without a real Clerk instance). Documented as a known gap; a manual post-deploy smoke test ("sign in as two real test orgs, confirm isolation") is the recommended check before calling this production-ready.

CI (`.github/workflows/ci.yml`) gains steps — start Supabase, run migrations, run Vitest — before the existing typecheck/build steps.

## 7. Auth UI

Clerk's prebuilt `<SignIn/>`, `<SignUp/>`, `<OrganizationSwitcher/>` via Next.js catch-all routes (`/sign-in/[[...rest]]`, `/sign-up/[[...rest]]`). Visual alignment with ClearConnect branding is explicitly deferred to the later FE-03 design-system workstream (`docs/FRONTEND_INTEGRATION.md`).

## Non-goals for this slice

- CSV/bulk import.
- Visual/brand alignment with the ClearConnect Lovable frontend.
- Billing, alerts, saved lists, enrichment (all P1/P2 per `PRD.md`).
- Testing the live Clerk→Supabase JWKS handshake (only the RLS policy logic is tested locally).
