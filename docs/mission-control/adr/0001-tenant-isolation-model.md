# ADR-0001 — Tenant isolation: Clerk org claim → organization uuid, enforced in RLS

Status: accepted (code landed on this branch; not yet verified against a live DB)
Date: 2026-11-05
Linked from: [../RECONCILE.md](../RECONCILE.md), [../_status.md](../_status.md) (MC-03)

## Context

Every tenant table (`projects`, `stakeholders`, `opportunities`, and the five intake tables) keys on `organization_id uuid references public.organizations(id)`. Clerk is the identity provider; its session token carries the active org as a text claim (`org_id`, e.g. `org_abc`), not the internal uuid. We need isolation enforced where it cannot be bypassed by application bugs or a spoofed client parameter.

## Decision

Enforce tenancy in Postgres RLS, not in app code. `src/lib/supabase/server.ts`'s `createRlsClient()` forwards the Clerk session token as the Supabase bearer; Supabase validates it as a third-party auth provider and exposes claims via `auth.jwt()`. A `security definer` helper `public.current_org_id()` maps `auth.jwt() ->> 'org_id'` to `organizations.id`, and every tenant policy is `organization_id = public.current_org_id()` in both `using` and `with check`.

- `security definer` is required so the mapping can read `organizations` while that table has no read policy; it only ever resolves the caller's own claim, so it leaks nothing. `search_path` is locked.
- Fail-closed: no verified claim → `current_org_id()` is NULL → `NULL = organization_id` is never true → deny.
- The service-role client (`createServiceRoleClient()`) bypasses RLS and is restricted to the Clerk org webhook and the BuildData ingestion script, neither of which has a user session.

## Consequences

- A config prerequisite now exists outside the schema: the Supabase project must register Clerk as a third-party auth provider and the Clerk token must assert `role = 'authenticated'`. If that is not set up, all tenant reads/writes deny — safe, but the app looks broken until configured.
- The `org_id` claim name is a contract. If the Clerk JWT template nests org under `o.id` instead, `current_org_id()` must change to `auth.jwt() -> 'o' ->> 'id'`.
- Isolation is not proven until the two-tenant denial test (commented in `20261105_intake_rls_policies.sql`) runs against a real Postgres. No DB is wired into CI yet.

## Alternatives rejected

- Filtering by org in app code only: one missing `.eq('organization_id', …)` leaks across tenants. Rejected.
- Storing Clerk's text `org_id` directly as the tenant key: breaks the existing uuid FK to `organizations` and every join. Rejected.
