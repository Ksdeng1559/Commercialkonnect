# Mortgage Mix Tenancy + Clerk Wiring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify tenancy on `workspace_id` across Mortgage Mix (`mix_*` tables), wire Clerk Organizations as the auth layer mapped onto that tenancy, and clean up FK structure on `mix_leads`/`mix_opportunities` — the foundation the BC-construction-vertical plan (Phase 1, separate later plan) builds on.

**Architecture:** Next.js Server Actions / Route Handlers backed by a service-role webhook for org provisioning and an anon-key client carrying the Clerk-issued JWT for request-serving. RLS policies on every workspace-scoped table key off a single `current_workspace_id()` SQL helper. Local dev/test via the Supabase CLI's local Docker stack (already configured); schema changes to the real `amgknqnhiscryvcfeoyj` project ship later via the Supabase MCP tool's `apply_migration`, not as part of this plan's automated steps.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Supabase (`@supabase/supabase-js`), Clerk (`@clerk/nextjs`), `svix` (webhook signature verification), Vitest, Supabase CLI.

**Scope note:** This plan covers Phase 0 only (tenancy unification + Clerk wiring) from `docs/superpowers/specs/2026-10-14-mortgage-mix-commercial-financing-design.md`. Phase 1 (the `construction_projects` table, the `mix_opportunities.construction_project_id` extension, and construction-project CRUD) is independently testable on its own and gets its own plan once this one lands — Phase 1 depends on the `current_workspace_id()` helper and workspace-scoped RLS pattern this plan establishes.

## Global Constraints

- Working directory for every task below: the `feature/clerk-orgs-rls-crud` git worktree at `.claude/worktrees/clerk-orgs-rls-crud` (branch already exists; this plan does not rename it despite the stale branch name — renaming is cosmetic and out of scope).
- Never trust a client-supplied org/workspace identifier. Every workspace scope is derived server-side from the verified Clerk session (`AGENTS.md`).
- `SUPABASE_SERVICE_ROLE_KEY` is server-only, never in a `NEXT_PUBLIC_*` variable, and used only by the Clerk webhook's provisioning path — never for request-serving (`AGENTS.md`, superseded spec section 3).
- No destructive operations on the real `amgknqnhiscryvcfeoyj` project's existing data. The `konstruction` schema being dropped in Task 1 exists only in the local Docker stack (confirmed: the local CLI was never linked to the remote project, so nothing under `konstruction` was ever applied remotely).
- RLS policies must have a passing cross-tenant denial test before any table is considered done (`AGENTS.md`).
- Run `npm run typecheck` and `npm test` before every commit in this plan; do not report a step as passing without having actually run it.

---

### Task 1: Retire the `konstruction` schema plan, sync with `main`

**Files:**
- Modify: `supabase/config.toml`
- Create: `supabase/migrations/20261014160000_drop_konstruction_schema.sql`
- Delete: `supabase/migrations/20261014150050_grant_konstruction_privileges.sql` (untracked, never applied anywhere but the local stack)
- Modify: `tests/helpers/fake-session.ts`
- Delete: `tests/rls/tenant-isolation.test.ts` (tests a `konstruction.projects`/`organizations` shape this plan abandons; Task 4 below adds its workspace-scoped replacement)
- Modify: `CLAUDE.md`

**Interfaces:**
- Produces: `clientFor(config, token)` and `adminClient(config)` from `tests/helpers/fake-session.ts`, now targeting the `public` schema (default, no explicit `db.schema` override) — every later task's tests import these unchanged.

- [ ] **Step 1: Bring `main`'s latest commit into this branch**

```bash
git merge main
```
Expected: a clean merge commit (or fast-forward) with no conflicts — `main`'s changes are to `README.md` and `docs/superpowers/specs/`, which this branch hasn't touched.

- [ ] **Step 2: Delete the untracked, now-obsolete grant migration**

```bash
rm supabase/migrations/20261014150050_grant_konstruction_privileges.sql
```

- [ ] **Step 3: Add a migration that drops the `konstruction` schema**

Create `supabase/migrations/20261014160000_drop_konstruction_schema.sql`:

```sql
-- Retires the konstruction-schema-isolation plan (see
-- docs/superpowers/specs/2026-10-14-mortgage-mix-commercial-financing-design.md,
-- which supersedes 2026-10-14-clerk-orgs-rls-crud-design.md). This schema was
-- only ever applied to the local Docker stack, never to the remote project, so
-- dropping it is not a production data-loss risk.
drop schema if exists konstruction cascade;
```

- [ ] **Step 4: Stop exposing `konstruction` from the local Data API**

In `supabase/config.toml`, find:
```toml
schemas = ["public", "graphql_public", "konstruction"]
```
Replace with:
```toml
schemas = ["public", "graphql_public"]
```

- [ ] **Step 5: Drop the `konstruction` schema override from the test helpers**

In `tests/helpers/fake-session.ts`, remove the `db: { schema: "konstruction" }` option from both `clientFor` and `adminClient` so they use the default (`public`) schema:

```ts
export function clientFor(
  config: LocalSupabaseConfig,
  token: string
): SupabaseClient {
  return createClient(config.url, config.anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

export function adminClient(config: LocalSupabaseConfig): SupabaseClient {
  const serviceKey = JSON.parse(
    require("node:child_process").execSync("npx supabase status -o json", {
      encoding: "utf8",
    })
  ).SERVICE_ROLE_KEY;
  return createClient(config.url, serviceKey);
}
```

- [ ] **Step 6: Delete the obsolete RLS test**

```bash
rm tests/rls/tenant-isolation.test.ts
```

- [ ] **Step 7: Rebuild the local stack from the new migration sequence and confirm it's clean**

```bash
npx supabase db reset
```
Expected: succeeds with no reference to `konstruction` in the output; the stack ends up with only `public`/`graphql_public` exposed.

- [ ] **Step 8: Run the remaining test (connectivity only, since the RLS test was just deleted)**

```bash
npm test
```
Expected: `tests/helpers/local-stack.test.ts` passes; no other test files exist yet at this point in the plan — that's expected, not a failure.

- [ ] **Step 9: Update `CLAUDE.md`'s stale workstream description**

In `CLAUDE.md`, replace:
```markdown
## Current files
- `src/app/page.tsx`: synthetic executive dashboard
- `src/lib/demo.ts`: synthetic projects
- `supabase/schema.sql`: organization/project/stakeholder/opportunity schema; RLS enabled but not wired to Clerk
- `docs/`: requirements, architecture and frontend integration
- `.github/workflows/ci.yml`: basic checks; not evidence that checks passed

## First coding workstream
Implement **Clerk Organizations + verified server-side org mapping + complete Supabase RLS policies + project CRUD + denial tests across two organizations**. Keep demo records clearly labeled and avoid mixing them into live tables. Only then wire production project listings and public CTAs.
```
with:
```markdown
## Current files
- `src/app/page.tsx`: synthetic executive dashboard
- `src/lib/demo.ts`: synthetic projects
- `supabase/schema.sql`: original standalone schema outline; superseded in practice by migrations building directly on the live `amgknqnhiscryvcfeoyj` project's schema (Mortgage Mix + RIOS)
- `docs/`: requirements, architecture and frontend integration
- `.github/workflows/ci.yml`: basic checks; not evidence that checks passed

## First coding workstream
Refactor Mortgage Mix (`mix_*` tables in the live Supabase project) into the commercial-financing opportunity engine, fed by BC construction-project data as a new lead source. See `docs/superpowers/specs/2026-10-14-mortgage-mix-commercial-financing-design.md` and `docs/superpowers/plans/2026-10-14-mortgage-mix-tenancy-clerk.md`. Clerk Organizations map onto the platform's existing `workspaces` table via a `clerk_org_id` column — not a separate schema. Keep demo records clearly labeled and avoid mixing them into live tables.
```

- [ ] **Step 10: Commit**

```bash
git add supabase/config.toml supabase/migrations/20261014160000_drop_konstruction_schema.sql tests/helpers/fake-session.ts CLAUDE.md
git rm supabase/migrations/20261014150050_grant_konstruction_privileges.sql --cached 2>/dev/null
git add -u tests/rls
git commit -m "chore: retire konstruction-schema plan, sync with main"
```

---

### Task 2: Verification checkpoint — confirm the `mix_opportunities` in-place refactor is safe

This is the explicit checkpoint requested before any Phase 1 schema work touches `mix_opportunities`: confirm extending it in place (rather than branching into a separate `construction_opportunities` table) won't break anything that already depends on its current shape.

**Files:** none (read-only verification against the real `amgknqnhiscryvcfeoyj` project via the Supabase MCP tool)

- [ ] **Step 1: Check for non-trivial triggers on `mix_opportunities`**

Run via the Supabase MCP tool's `execute_sql` against project `amgknqnhiscryvcfeoyj`:
```sql
select tgname, relname from pg_trigger t
join pg_class c on c.oid = t.tgrelid
where c.relname = 'mix_opportunities' and not t.tgisinternal;
```
Documented baseline (checked 2026-10-14): one row, `tgname = 'mix_opp_updated_at'` — a benign `updated_at`-maintenance trigger. If this still matches, proceed. If a new, non-`updated_at` trigger appears, stop and escalate before continuing to Task 6/Phase 1 — investigate what it does before deciding whether the in-place refactor still holds.

- [ ] **Step 2: Check for views that depend on `mix_opportunities`**

```sql
select table_name from information_schema.views
where table_schema = 'public' and view_definition ilike '%mix_opportunities%';
```
Documented baseline: zero rows. If any appear, stop and escalate — a dependent view means the in-place column additions could change its output shape unexpectedly.

- [ ] **Step 3: Check for deployed Edge Functions referencing it**

Via the Supabase MCP tool's `list_edge_functions` against project `amgknqnhiscryvcfeoyj`.
Documented baseline: `{"functions":[]}` — zero Edge Functions deployed at all in this project. If any now exist, grep their source for `mix_opportunities` before proceeding.

- [ ] **Step 4: Confirm existing data will be preserved, not dropped, by Task 6's migration**

```sql
select count(*) as n from public.mix_opportunities;
```
Documented baseline: 16 rows (Dennis's own pre-launch test data). Task 6's migration only adds a nullable column — it must not delete or truncate this table. If this count is non-zero (expected), the migration in Task 6 is additive-only and safe as written.

**Decision recorded:** all three checks (trigger, views, Edge Functions) came back clean as of 2026-10-14 — extending `mix_opportunities` in place is safe. Proceed with Task 6 as written. If re-running these checks at implementation time shows a different result, stop before Task 6 and design a separate `construction_opportunities` table instead (same FK/tenancy conventions as `mix_opportunities`, just not interleaved into its existing rows).

---

### Task 3: `workspaces.clerk_org_id` + `current_workspace_id()` helper

**Files:**
- Create: `supabase/migrations/20261014170000_workspace_clerk_mapping.sql`
- Create: `tests/rls/current-workspace-id.test.ts`

**Interfaces:**
- Produces: SQL function `public.current_workspace_id() returns uuid`, callable as `client.rpc("current_workspace_id")` from `@supabase/supabase-js`. Every later RLS policy in this plan calls this function by name.

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/20261014170000_workspace_clerk_mapping.sql`:

```sql
alter table public.workspaces
  add column if not exists clerk_org_id text unique;

create or replace function public.current_workspace_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.workspaces
  where clerk_org_id = (auth.jwt() ->> 'org_id')
  limit 1
$$;

grant execute on function public.current_workspace_id() to authenticated;
```

- [ ] **Step 2: Apply it locally**

```bash
npx supabase db reset
```
Expected: succeeds, no errors.

- [ ] **Step 3: Write the failing test**

Create `tests/rls/current-workspace-id.test.ts`:

```ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getLocalSupabaseConfig } from "../helpers/local-stack";
import { mintSessionToken, clientFor, adminClient } from "../helpers/fake-session";

describe("current_workspace_id()", () => {
  const config = getLocalSupabaseConfig();
  const clerkOrgId = "org_test_current_ws";
  let workspaceId: string;

  beforeAll(async () => {
    const admin = adminClient(config);
    const { data, error } = await admin
      .from("workspaces")
      .insert({ name: "Current WS Test", slug: "current-ws-test", clerk_org_id: clerkOrgId })
      .select("id")
      .single();
    if (error) throw error;
    workspaceId = data!.id;
  });

  afterAll(async () => {
    const admin = adminClient(config);
    await admin.from("workspaces").delete().eq("id", workspaceId);
  });

  it("resolves the workspace matching the JWT's org_id claim", async () => {
    const token = mintSessionToken(config.jwtSecret, { sub: "user_x", orgId: clerkOrgId });
    const client = clientFor(config, token);
    const { data, error } = await client.rpc("current_workspace_id");
    expect(error).toBeNull();
    expect(data).toBe(workspaceId);
  });

  it("resolves to null when no workspace matches the JWT's org_id claim", async () => {
    const token = mintSessionToken(config.jwtSecret, { sub: "user_x", orgId: "org_does_not_exist" });
    const client = clientFor(config, token);
    const { data, error } = await client.rpc("current_workspace_id");
    expect(error).toBeNull();
    expect(data).toBeNull();
  });
});
```

- [ ] **Step 4: Run it**

```bash
npx vitest run tests/rls/current-workspace-id.test.ts
```
Expected: both assertions PASS.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20261014170000_workspace_clerk_mapping.sql tests/rls/current-workspace-id.test.ts
git commit -m "feat: map Clerk org_id to workspaces via current_workspace_id()"
```

---

### Task 4: Workspace-scope every `mix_*` table and add RLS

**Files:**
- Create: `supabase/migrations/20261014171000_mix_workspace_tenancy.sql`
- Create: `tests/rls/workspace-isolation.test.ts`

**Interfaces:**
- Consumes: `public.current_workspace_id()` from Task 3; `clientFor`/`adminClient`/`mintSessionToken` from Task 1's cleaned-up `tests/helpers/fake-session.ts`.
- Produces: `workspace_id` column + enforced RLS on `mix_leads`, `mix_opportunities`, `mix_campaigns`, `mix_campaign_sends`, `mix_conversations`, `mix_relationship_scores`, `mix_agent_runs`, `mix_knowledge_assets`, `mix_outreach_messages` — every later task that reads/writes these tables must supply a `workspace_id`.

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/20261014171000_mix_workspace_tenancy.sql`:

```sql
-- Verified safe to extend mix_opportunities in place: see
-- docs/superpowers/plans/2026-10-14-mortgage-mix-tenancy-clerk.md, Task 2.

insert into public.workspaces (name, slug, plan, vertical, onboarding_status)
select 'Default Workspace', 'default-workspace', 'lite', 'rios_general', 'complete'
where not exists (select 1 from public.workspaces where slug = 'default-workspace');

do $$
declare
  default_ws_id uuid;
  t text;
begin
  select id into default_ws_id from public.workspaces where slug = 'default-workspace';

  foreach t in array array[
    'mix_leads', 'mix_opportunities', 'mix_campaigns', 'mix_campaign_sends',
    'mix_conversations', 'mix_relationship_scores', 'mix_agent_runs',
    'mix_knowledge_assets', 'mix_outreach_messages'
  ]
  loop
    execute format('alter table public.%I add column if not exists workspace_id uuid references public.workspaces(id)', t);
    execute format('update public.%I set workspace_id = %L where workspace_id is null', t, default_ws_id);
    execute format('alter table public.%I alter column workspace_id set not null', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I on public.%I', t || '_workspace_isolation', t);
    execute format(
      'create policy %I on public.%I for all using (workspace_id = public.current_workspace_id()) with check (workspace_id = public.current_workspace_id())',
      t || '_workspace_isolation', t
    );
  end loop;
end $$;
```

- [ ] **Step 2: Apply it locally**

```bash
npx supabase db reset
```
Expected: succeeds. The local stack has no pre-existing rows in these tables (it's a fresh Docker Postgres, not a copy of remote data), so the backfill `update` statements are no-ops locally — they matter when this migration is later applied to the real project via the Supabase MCP tool, where the 16 existing `mix_opportunities` rows (and whatever `mix_leads` rows exist) get backfilled to the default workspace instead of being orphaned.

- [ ] **Step 3: Write the failing test**

Create `tests/rls/workspace-isolation.test.ts`:

```ts
import { describe, it, expect, beforeAll } from "vitest";
import { getLocalSupabaseConfig } from "../helpers/local-stack";
import { mintSessionToken, clientFor, adminClient } from "../helpers/fake-session";

describe("workspace isolation on mix_opportunities", () => {
  const config = getLocalSupabaseConfig();
  let workspaceAId: string;
  let workspaceBId: string;

  beforeAll(async () => {
    const admin = adminClient(config);
    const { data: wsA } = await admin
      .from("workspaces")
      .insert({ name: "Workspace A", slug: "workspace-a-test", clerk_org_id: "org_test_a" })
      .select("id")
      .single();
    const { data: wsB } = await admin
      .from("workspaces")
      .insert({ name: "Workspace B", slug: "workspace-b-test", clerk_org_id: "org_test_b" })
      .select("id")
      .single();
    workspaceAId = wsA!.id;
    workspaceBId = wsB!.id;

    await admin.from("mix_opportunities").insert([
      { workspace_id: workspaceAId, title: "Workspace A deal" },
      { workspace_id: workspaceBId, title: "Workspace B deal" },
    ]);
  });

  it("lets a member read their own workspace's opportunities", async () => {
    const token = mintSessionToken(config.jwtSecret, { sub: "user_a", orgId: "org_test_a" });
    const client = clientFor(config, token);
    const { data, error } = await client.from("mix_opportunities").select("title").eq("workspace_id", workspaceAId);
    expect(error).toBeNull();
    expect(data).toEqual([{ title: "Workspace A deal" }]);
  });

  it("denies a member from reading another workspace's opportunities", async () => {
    const token = mintSessionToken(config.jwtSecret, { sub: "user_a", orgId: "org_test_a" });
    const client = clientFor(config, token);
    const { data, error } = await client.from("mix_opportunities").select("title").eq("workspace_id", workspaceBId);
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it("denies cross-workspace writes", async () => {
    const token = mintSessionToken(config.jwtSecret, { sub: "user_a", orgId: "org_test_a" });
    const client = clientFor(config, token);
    const { error } = await client
      .from("mix_opportunities")
      .update({ title: "hijacked" })
      .eq("workspace_id", workspaceBId);
    expect(error).toBeNull();

    const admin = adminClient(config);
    const { data: check } = await admin
      .from("mix_opportunities")
      .select("title")
      .eq("workspace_id", workspaceBId)
      .single();
    expect(check!.title).toBe("Workspace B deal");
  });
});
```

- [ ] **Step 4: Run it**

```bash
npx vitest run tests/rls/workspace-isolation.test.ts
```
Expected: all three PASS.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20261014171000_mix_workspace_tenancy.sql tests/rls/workspace-isolation.test.ts
git commit -m "feat: workspace-scope Mortgage Mix tables with RLS"
```

---

### Task 5: `mix_leads` FK cleanup — `contact_id` / `company_id`

**Files:**
- Create: `supabase/migrations/20261014172000_mix_leads_fk_cleanup.sql`
- Create: `tests/rls/mix-leads-fk.test.ts`

**Interfaces:**
- Consumes: `workspace_id` column + RLS from Task 4.
- Produces: `mix_leads.contact_id → contacts.id`, `mix_leads.company_id → organizations.id`.

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/20261014172000_mix_leads_fk_cleanup.sql`:

```sql
alter table public.mix_leads
  add column if not exists contact_id uuid references public.contacts(id),
  add column if not exists company_id uuid references public.organizations(id);

-- Backfill: link each existing mix_leads row to a contacts row with a matching
-- email in the same workspace, creating one if none exists yet. company_id is
-- left null here — there's no company data on the legacy mix_leads rows to
-- backfill from.
insert into public.contacts (workspace_id, full_name, email, city, source)
select ml.workspace_id, ml.name, ml.email, ml.city, 'mix_leads_backfill'
from public.mix_leads ml
where ml.contact_id is null
  and not exists (
    select 1 from public.contacts c
    where c.workspace_id = ml.workspace_id and c.email = ml.email
  );

update public.mix_leads ml
set contact_id = c.id
from public.contacts c
where ml.contact_id is null
  and c.workspace_id = ml.workspace_id
  and c.email = ml.email;
```

- [ ] **Step 2: Apply it locally**

```bash
npx supabase db reset
```
Expected: succeeds.

- [ ] **Step 3: Write the failing test**

Create `tests/rls/mix-leads-fk.test.ts`:

```ts
import { describe, it, expect, beforeAll } from "vitest";
import { getLocalSupabaseConfig } from "../helpers/local-stack";
import { adminClient } from "../helpers/fake-session";

describe("mix_leads FK cleanup", () => {
  const config = getLocalSupabaseConfig();
  let workspaceId: string;
  let contactId: string;

  beforeAll(async () => {
    const admin = adminClient(config);
    const { data: ws } = await admin
      .from("workspaces")
      .insert({ name: "FK Test WS", slug: "fk-test-ws", clerk_org_id: "org_fk_test" })
      .select("id")
      .single();
    workspaceId = ws!.id;

    const { data: contact } = await admin
      .from("contacts")
      .insert({ workspace_id: workspaceId, full_name: "Jane Lead", email: "jane@example.com" })
      .select("id")
      .single();
    contactId = contact!.id;
  });

  it("accepts a mix_leads row with a valid contact_id", async () => {
    const admin = adminClient(config);
    const { error } = await admin
      .from("mix_leads")
      .insert({ workspace_id: workspaceId, name: "Jane Lead", email: "jane@example.com", contact_id: contactId });
    expect(error).toBeNull();
  });

  it("rejects a mix_leads row with a contact_id that doesn't exist", async () => {
    const admin = adminClient(config);
    const { error } = await admin
      .from("mix_leads")
      .insert({
        workspace_id: workspaceId,
        name: "Ghost Lead",
        email: "ghost@example.com",
        contact_id: "00000000-0000-0000-0000-000000000000",
      });
    expect(error).not.toBeNull();
  });
});
```

- [ ] **Step 4: Run it**

```bash
npx vitest run tests/rls/mix-leads-fk.test.ts
```
Expected: both PASS.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20261014172000_mix_leads_fk_cleanup.sql tests/rls/mix-leads-fk.test.ts
git commit -m "feat: add contact_id/company_id FKs to mix_leads"
```

**Manual verification note (not automated here):** the backfill `insert`/`update` in this migration only has rows to act on against the real `amgknqnhiscryvcfeoyj` project (the local stack starts empty). After this migration is applied there via the Supabase MCP tool, manually confirm via `execute_sql` that every pre-existing `mix_leads` row now has a non-null `contact_id` pointing at a `contacts` row with a matching email, before relying on the join in application code.

---

### Task 6: `mix_opportunities.company_id`

**Files:**
- Create: `supabase/migrations/20261014173000_mix_opportunities_company_fk.sql`
- Create: `tests/rls/mix-opportunities-company-fk.test.ts`

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/20261014173000_mix_opportunities_company_fk.sql`:

```sql
alter table public.mix_opportunities
  add column if not exists company_id uuid references public.organizations(id);
```

- [ ] **Step 2: Apply it locally**

```bash
npx supabase db reset
```

- [ ] **Step 3: Write the failing test**

Create `tests/rls/mix-opportunities-company-fk.test.ts`:

```ts
import { describe, it, expect, beforeAll } from "vitest";
import { getLocalSupabaseConfig } from "../helpers/local-stack";
import { adminClient } from "../helpers/fake-session";

describe("mix_opportunities.company_id", () => {
  const config = getLocalSupabaseConfig();
  let workspaceId: string;
  let companyId: string;

  beforeAll(async () => {
    const admin = adminClient(config);
    const { data: ws } = await admin
      .from("workspaces")
      .insert({ name: "Company FK Test WS", slug: "company-fk-test-ws", clerk_org_id: "org_company_fk_test" })
      .select("id")
      .single();
    workspaceId = ws!.id;

    const { data: org } = await admin
      .from("organizations")
      .insert({ workspace_id: workspaceId, name: "Acme Developments" })
      .select("id")
      .single();
    companyId = org!.id;
  });

  it("accepts an opportunity tied to a developer organization", async () => {
    const admin = adminClient(config);
    const { error } = await admin
      .from("mix_opportunities")
      .insert({ workspace_id: workspaceId, title: "Acme refi", company_id: companyId });
    expect(error).toBeNull();
  });

  it("rejects an opportunity with a company_id that doesn't exist", async () => {
    const admin = adminClient(config);
    const { error } = await admin.from("mix_opportunities").insert({
      workspace_id: workspaceId,
      title: "Ghost deal",
      company_id: "00000000-0000-0000-0000-000000000000",
    });
    expect(error).not.toBeNull();
  });
});
```

- [ ] **Step 4: Run it**

```bash
npx vitest run tests/rls/mix-opportunities-company-fk.test.ts
```
Expected: both PASS.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20261014173000_mix_opportunities_company_fk.sql tests/rls/mix-opportunities-company-fk.test.ts
git commit -m "feat: add company_id FK to mix_opportunities"
```

---

### Task 7: Supabase server client modules

**Files:**
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/admin.ts`
- Modify: `package.json` (add `server-only`)
- Modify: `.env.example`

**Interfaces:**
- Produces: `createServerSupabaseClient(): SupabaseClient` and `createAdminSupabaseClient(): SupabaseClient`. Task 8's webhook logic and every future CRUD Server Action import these by name.

- [ ] **Step 1: Add the `server-only` dependency**

In `package.json`, under `"dependencies"`, add:
```json
"server-only": "^0.0.1",
```
Then:
```bash
npm install
```

- [ ] **Step 2: Add the service-role env var placeholder**

In `.env.example`, add a line:
```
SUPABASE_SERVICE_ROLE_KEY=
```

- [ ] **Step 3: Write `src/lib/supabase/admin.ts`**

```ts
import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function createAdminSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient(url, serviceRoleKey, { db: { schema: "public" } });
}
```

- [ ] **Step 4: Write `src/lib/supabase/server.ts`**

```ts
import "server-only";
import { auth } from "@clerk/nextjs/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function createServerSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Supabase URL/anon key are not set");
  }
  return createClient(url, anonKey, {
    db: { schema: "public" },
    global: {
      fetch: async (fetchUrl, options = {}) => {
        const { getToken } = await auth();
        const token = await getToken();
        const headers = new Headers(options.headers);
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return fetch(fetchUrl, { ...options, headers });
      },
    },
  });
}
```

- [ ] **Step 5: Write the failing test for the admin client**

Create `tests/lib/supabase-admin.test.ts`:

```ts
import { describe, it, expect, afterEach } from "vitest";
import { createAdminSupabaseClient } from "../../src/lib/supabase/admin";

describe("createAdminSupabaseClient", () => {
  const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  afterEach(() => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
    process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
  });

  it("throws when SUPABASE_SERVICE_ROLE_KEY is missing", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:54331";
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    expect(() => createAdminSupabaseClient()).toThrow("SUPABASE_SERVICE_ROLE_KEY is not set");
  });

  it("returns a Supabase client when the key is present", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:54331";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
    const client = createAdminSupabaseClient();
    expect(typeof client.from).toBe("function");
  });
});
```

- [ ] **Step 6: Run it**

```bash
npx vitest run tests/lib/supabase-admin.test.ts
```
Expected: both PASS. (`createServerSupabaseClient` isn't unit-tested here — it depends on `@clerk/nextjs/server`'s request context, which only exists inside a real Next.js request; it's exercised indirectly once Task 9 wires up real routes, consistent with the spec's documented gap on testing the live Clerk→Supabase handshake.)

- [ ] **Step 7: Commit**

```bash
git add src/lib/supabase/server.ts src/lib/supabase/admin.ts tests/lib/supabase-admin.test.ts package.json package-lock.json .env.example
git commit -m "feat: add server-only and admin Supabase client modules"
```

---

### Task 8: Clerk → `workspaces` sync (webhook)

**Files:**
- Create: `src/lib/clerk/sync-workspace.ts`
- Create: `src/app/api/webhooks/clerk/route.ts`
- Modify: `package.json` (add `svix`)
- Modify: `.env.example`

**Interfaces:**
- Consumes: `createAdminSupabaseClient` from Task 7.
- Produces: `upsertWorkspaceFromClerkOrg(org: ClerkOrganizationPayload): Promise<void>`, and the `POST` handler at `/api/webhooks/clerk`.

- [ ] **Step 1: Add the `svix` dependency**

In `package.json`, under `"dependencies"`, add:
```json
"svix": "^1.45.0",
```
Then:
```bash
npm install
```

- [ ] **Step 2: Add the webhook secret env var placeholder**

In `.env.example`, add:
```
CLERK_WEBHOOK_SECRET=
```

- [ ] **Step 3: Write the sync function**

Create `src/lib/clerk/sync-workspace.ts`:

```ts
import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export type ClerkOrganizationPayload = {
  id: string;
  name: string;
  slug: string;
};

export async function upsertWorkspaceFromClerkOrg(org: ClerkOrganizationPayload): Promise<void> {
  const admin = createAdminSupabaseClient();
  const { error } = await admin
    .from("workspaces")
    .upsert({ clerk_org_id: org.id, name: org.name, slug: org.slug }, { onConflict: "clerk_org_id" });
  if (error) throw error;
}
```

- [ ] **Step 4: Write its failing test**

Create `tests/lib/sync-workspace.test.ts`:

```ts
import { describe, it, expect, afterEach } from "vitest";
import { upsertWorkspaceFromClerkOrg } from "../../src/lib/clerk/sync-workspace";
import { getLocalSupabaseConfig } from "../helpers/local-stack";
import { adminClient } from "../helpers/fake-session";

describe("upsertWorkspaceFromClerkOrg", () => {
  const config = getLocalSupabaseConfig();

  afterEach(async () => {
    const admin = adminClient(config);
    await admin.from("workspaces").delete().eq("clerk_org_id", "org_sync_test");
  });

  it("creates a workspace on first call and updates it on repeat calls", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = config.url;
    const serviceKey = JSON.parse(
      require("node:child_process").execSync("npx supabase status -o json", { encoding: "utf8" })
    ).SERVICE_ROLE_KEY;
    process.env.SUPABASE_SERVICE_ROLE_KEY = serviceKey;

    await upsertWorkspaceFromClerkOrg({ id: "org_sync_test", name: "Sync Test Org", slug: "sync-test-org" });

    const admin = adminClient(config);
    const { data: created } = await admin
      .from("workspaces")
      .select("name, slug")
      .eq("clerk_org_id", "org_sync_test")
      .single();
    expect(created).toEqual({ name: "Sync Test Org", slug: "sync-test-org" });

    await upsertWorkspaceFromClerkOrg({ id: "org_sync_test", name: "Renamed Org", slug: "sync-test-org" });
    const { data: updated } = await admin
      .from("workspaces")
      .select("name")
      .eq("clerk_org_id", "org_sync_test")
      .single();
    expect(updated!.name).toBe("Renamed Org");
  });
});
```

- [ ] **Step 5: Run it**

```bash
npx vitest run tests/lib/sync-workspace.test.ts
```
Expected: PASS.

- [ ] **Step 6: Write the route handler**

Create `src/app/api/webhooks/clerk/route.ts`. Reads headers straight off the `Request` object rather than `next/headers`, so it can be unit-tested by constructing a plain `Request` without a live Next.js request context:

```ts
import "server-only";
import { Webhook } from "svix";
import { upsertWorkspaceFromClerkOrg } from "@/lib/clerk/sync-workspace";

export async function POST(req: Request): Promise<Response> {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("CLERK_WEBHOOK_SECRET not configured", { status: 500 });
  }

  const payload = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id") ?? "",
    "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
    "svix-signature": req.headers.get("svix-signature") ?? "",
  };

  let event: { type: string; data: { id: string; name: string; slug: string } };
  try {
    event = new Webhook(secret).verify(payload, svixHeaders) as typeof event;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type !== "organization.created" && event.type !== "organization.updated") {
    return new Response("ignored", { status: 200 });
  }

  try {
    await upsertWorkspaceFromClerkOrg(event.data);
  } catch (err) {
    return new Response(err instanceof Error ? err.message : "upsert failed", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}
```

- [ ] **Step 7: Write its failing test**

Create `tests/app/clerk-webhook.test.ts`:

```ts
import { describe, it, expect, afterEach } from "vitest";
import { POST } from "../../src/app/api/webhooks/clerk/route";

describe("POST /api/webhooks/clerk", () => {
  const originalSecret = process.env.CLERK_WEBHOOK_SECRET;

  afterEach(() => {
    process.env.CLERK_WEBHOOK_SECRET = originalSecret;
  });

  it("returns 500 when CLERK_WEBHOOK_SECRET is not configured", async () => {
    delete process.env.CLERK_WEBHOOK_SECRET;
    const req = new Request("http://localhost/api/webhooks/clerk", { method: "POST", body: "{}" });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  it("rejects a request with an invalid svix signature", async () => {
    process.env.CLERK_WEBHOOK_SECRET = "whsec_dGVzdHNlY3JldGZvcndlYmhvb2tzaWduaW5nMTIz";
    const req = new Request("http://localhost/api/webhooks/clerk", {
      method: "POST",
      headers: {
        "svix-id": "msg_test",
        "svix-timestamp": String(Math.floor(Date.now() / 1000)),
        "svix-signature": "v1,not-a-real-signature",
      },
      body: JSON.stringify({ type: "organization.created", data: { id: "org_x", name: "X", slug: "x" } }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 8: Run it**

```bash
npx vitest run tests/app/clerk-webhook.test.ts
```
Expected: both PASS.

- [ ] **Step 9: Commit**

```bash
git add src/lib/clerk/sync-workspace.ts src/app/api/webhooks/clerk/route.ts tests/lib/sync-workspace.test.ts tests/app/clerk-webhook.test.ts package.json package-lock.json .env.example
git commit -m "feat: sync Clerk organizations into workspaces via webhook"
```

---

### Task 9: Clerk app wiring (middleware, provider, sign-in/sign-up)

**Files:**
- Create: `src/middleware.ts`
- Modify: `src/app/layout.tsx`
- Create: `src/app/sign-in/[[...rest]]/page.tsx`
- Create: `src/app/sign-up/[[...rest]]/page.tsx`

No automated RLS/session test here — this requires a real Clerk instance and browser session, which the local test stack doesn't have (same documented gap as the superseded spec: only RLS policy logic is tested locally). Verified manually at the end.

- [ ] **Step 1: Write the middleware**

Create `src/middleware.ts`:

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
```

- [ ] **Step 2: Wrap the app in `ClerkProvider`**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "KonstructionComOS",
  description: "Construction intelligence and capital origination",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

- [ ] **Step 3: Add the sign-in route**

Create `src/app/sign-in/[[...rest]]/page.tsx`:

```tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#091523]">
      <SignIn />
    </div>
  );
}
```

- [ ] **Step 4: Add the sign-up route**

Create `src/app/sign-up/[[...rest]]/page.tsx`:

```tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#091523]">
      <SignUp />
    </div>
  );
}
```

- [ ] **Step 5: Verify it compiles**

```bash
npm run typecheck
npm run build
```
Expected: both succeed.

- [ ] **Step 6: Manual verification (requires real Clerk dev keys in `.env.local`)**

```bash
npm run dev
```
Visit `http://localhost:3000/sign-in` — confirm the Clerk widget renders. Visit any non-public route while signed out — confirm it redirects to `/sign-in`. Record the result in the PR/commit description; do not claim this step passed without actually running it.

- [ ] **Step 7: Commit**

```bash
git add src/middleware.ts src/app/layout.tsx src/app/sign-in src/app/sign-up
git commit -m "feat: wire Clerk middleware, provider, and sign-in/sign-up routes"
```

---

### Task 10: CI runs the local Supabase stack and the test suite

**Files:**
- Modify: `.github/workflows/ci.yml`

- [ ] **Step 1: Add Supabase CLI setup and test steps before typecheck/build**

Replace `.github/workflows/ci.yml`:

```yaml
name: Validate
on:
  push:
  pull_request:
jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
          cache-dependency-path: package-lock.json
      - run: npm install
      - uses: supabase/setup-cli@v1
        with:
          version: latest
      - run: supabase start
      - run: npm test
      - run: npm run typecheck
      - run: npm run build
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: start local Supabase stack and run tests before typecheck/build"
```

- [ ] **Step 3: Push and confirm the workflow run is green**

```bash
git push -u origin feature/clerk-orgs-rls-crud
```
Then check the Actions run for this push on GitHub. Do not report this task done without confirming the run actually passed.

---

## Self-Review

**Spec coverage:** Task 1 retires the superseded `konstruction` plan. Tasks 3–4 deliver the spec's "Tenant identity flow" and RLS sections. Tasks 5–6 deliver the "Mortgage Mix FK cleanup" section. Tasks 7–8 deliver the webhook-based org provisioning described in the spec's Phase 0 (replacing the old `konstruction.organizations` webhook target with `workspaces`). Task 9 delivers the spec's "Auth UI" section. Task 10 delivers the "CI" testing requirement. Phase 1 (`construction_projects`, the `mix_opportunities.construction_project_id` extension, and CRUD) is explicitly out of scope for this plan per the Scope note above — it gets its own plan once this lands.

**Placeholder scan:** no TBD/TODO; every step has complete, runnable code.

**Type consistency:** `ClerkOrganizationPayload` (Task 8) matches the `{ id, name, slug }` shape used in both the webhook route's `event.data` typing and the test fixtures. `LocalSupabaseConfig`, `mintSessionToken`, `clientFor`, `adminClient` are used with identical signatures across Tasks 3–6, unchanged from Task 1's cleanup.
