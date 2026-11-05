-- MC-03 — tenant-scoped RLS policies for the intake/funding tables.
-- Depends on: 20261105_intake_funding.sql (tables + RLS enabled, no policies) and the existing
-- public.organizations table (clerk_org_id text unique, id uuid pk).
--
-- Tenant model: createRlsClient() (src/lib/supabase/server.ts) forwards the signed-in Clerk
-- session token as the Supabase Authorization bearer. Supabase validates it as a third-party
-- auth provider (Clerk integration) and exposes its claims via auth.jwt(). The Clerk default
-- session token carries the active org as the `org_id` claim (text, e.g. "org_abc"). That is NOT
-- the uuid FK the intake tables use, so we map it: clerk_org_id -> organizations.id.
--
-- The tenant is ALWAYS derived from the verified token here in the database. It is never taken
-- from client input and never from a parameter the app could spoof.
--
-- Prereq (config, not SQL — see ADR-0001): the Supabase project must have Clerk registered as a
-- third-party auth provider, and the Clerk token must assert role = 'authenticated'. Without that,
-- auth.jwt() is empty, current_org_id() returns NULL, and every policy below denies — fail closed.

-- Map the verified Clerk org claim to the internal organization uuid.
-- security definer so the lookup bypasses RLS on public.organizations (which itself has no read
-- policy); the function leaks nothing — it only resolves the caller's OWN org_id claim. Locked
-- search_path per Supabase security guidance.
create or replace function public.current_org_id()
returns uuid
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select id
  from public.organizations
  where clerk_org_id = (auth.jwt() ->> 'org_id')
  limit 1
$$;

revoke all on function public.current_org_id() from public;
grant execute on function public.current_org_id() to authenticated;

-- Reference catalog: readable by any authenticated user; writes only via service role (no write
-- policy = denied under RLS). Not tenant data.
drop policy if exists funding_verticals_read on public.funding_verticals;
create policy funding_verticals_read on public.funding_verticals
  for select to authenticated
  using (active);

-- Tenant tables: full read/write confined to the caller's own organization. with check mirrors
-- using so a row can neither be read, inserted, nor moved across tenants. current_org_id() is
-- NULL when no verified org claim is present, so NULL = organization_id is never true -> deny.
drop policy if exists funding_applications_tenant_rw on public.funding_applications;
create policy funding_applications_tenant_rw on public.funding_applications
  for all to authenticated
  using (organization_id = public.current_org_id())
  with check (organization_id = public.current_org_id());

drop policy if exists clarification_calls_tenant_rw on public.clarification_calls;
create policy clarification_calls_tenant_rw on public.clarification_calls
  for all to authenticated
  using (organization_id = public.current_org_id())
  with check (organization_id = public.current_org_id());

drop policy if exists intake_classification_tenant_rw on public.intake_classification;
create policy intake_classification_tenant_rw on public.intake_classification
  for all to authenticated
  using (organization_id = public.current_org_id())
  with check (organization_id = public.current_org_id());

drop policy if exists client_briefs_tenant_rw on public.client_briefs;
create policy client_briefs_tenant_rw on public.client_briefs
  for all to authenticated
  using (organization_id = public.current_org_id())
  with check (organization_id = public.current_org_id());

-- ---------------------------------------------------------------------------------------------
-- Two-tenant denial test (MC-03 acceptance). Not run by this migration — no DB in CI yet.
-- Run in the Supabase SQL editor against a scratch project, or wire into a pgTAP/integration job.
-- It fakes a verified Clerk token by setting request.jwt.claims, then asserts cross-tenant denial.
-- ---------------------------------------------------------------------------------------------
-- do $$
-- declare org_a uuid; org_b uuid; seen int;
-- begin
--   insert into public.organizations (clerk_org_id, name) values ('org_a','A') returning id into org_a;
--   insert into public.organizations (clerk_org_id, name) values ('org_b','B') returning id into org_b;
--
--   -- act as org_a (authenticated)
--   set local role authenticated;
--   perform set_config('request.jwt.claims', json_build_object('org_id','org_a','role','authenticated')::text, true);
--   insert into public.funding_applications (organization_id, applicant_type) values (org_a,'incorporated');
--   -- org_a may NOT write into org_b (with check must reject)
--   begin
--     insert into public.funding_applications (organization_id, applicant_type) values (org_b,'incorporated');
--     raise exception 'FAIL: org_a inserted a row for org_b';
--   exception when insufficient_privilege or check_violation then null; end;
--
--   -- act as org_b: must not see org_a's row
--   perform set_config('request.jwt.claims', json_build_object('org_id','org_b','role','authenticated')::text, true);
--   select count(*) into seen from public.funding_applications where organization_id = org_a;
--   if seen <> 0 then raise exception 'FAIL: org_b read % org_a rows', seen; end if;
--
--   raise notice 'PASS: two-tenant isolation holds on funding_applications';
--   raise exception 'rollback test'; -- leave no fixtures behind
-- exception when others then
--   if sqlerrm <> 'rollback test' then raise; end if;
-- end $$;
