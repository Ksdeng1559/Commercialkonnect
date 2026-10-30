-- Reviewed schema proposal for CommercialKonnect API v1. Not an automatic migration.
-- Apply to an isolated test database first. Existing public.workspaces is canonical.
begin;
do $$ begin
  if not exists(select 1 from pg_roles where rolname='ck_api_runtime') then
    create role ck_api_runtime nologin nosuperuser nocreatedb nocreaterole noinherit nobypassrls;
  end if;
  if not exists(select 1 from pg_roles where rolname='ck_api_intake') then
    create role ck_api_intake nologin nosuperuser nocreatedb nocreaterole noinherit nobypassrls;
  end if;
end $$;
do $$ begin
 if exists(select 1 from pg_roles where rolname in('ck_api_runtime','ck_api_intake') and (rolsuper or rolbypassrls or rolcreatedb or rolcreaterole or rolinherit or rolcanlogin)) then
  raise exception 'Existing ck_api role has unsafe privileges; review roles before continuing';
 end if;
end $$;
create schema ck_api;
revoke all on schema ck_api from public;
grant usage on schema ck_api to ck_api_runtime, ck_api_intake;
create table ck_api.workspace_links (
  workspace_id uuid primary key references public.workspaces(id),
  clerk_org_id text not null unique check(length(clerk_org_id) between 1 and 150),
  active boolean not null default true
);
alter table ck_api.workspace_links enable row level security;
alter table ck_api.workspace_links force row level security;
create policy workspace_lookup on ck_api.workspace_links to ck_api_runtime,ck_api_intake
 using(active and clerk_org_id=nullif(current_setting('ck_api.clerk_org_id',true),''));
grant select on ck_api.workspace_links to ck_api_runtime,ck_api_intake;
create function ck_api.current_workspace_id() returns uuid language sql stable security invoker
 set search_path='' as $$
 select workspace_id from ck_api.workspace_links
 where active and clerk_org_id=nullif(current_setting('ck_api.clerk_org_id',true),'')
$$;
revoke all on function ck_api.current_workspace_id() from public;
grant execute on function ck_api.current_workspace_id() to ck_api_runtime,ck_api_intake;

create table ck_api.jobs (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references ck_api.workspace_links(workspace_id),
 kind text not null check(kind in('discovery','enrichment')),
 input jsonb not null, status text not null default 'queued' check(status in('queued','running','succeeded','failed')),
 idempotency_key text not null, payload_hash text not null,
 attempts int not null default 0 check(attempts between 0 and 3), run_id uuid, lease_until timestamptz,
 result_count int, error_code text, created_by text not null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(workspace_id,idempotency_key), unique(workspace_id,id)
);
create index ck_jobs_queue on ck_api.jobs(workspace_id,status,created_at);
create table ck_api.companies (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references ck_api.workspace_links(workspace_id),
 source_key text not null, business_name text not null, industry text not null, location text not null, website text, business_phone text, business_email text, summary text,
 provenance jsonb not null, source text not null default 'connectionos',
 verification_status text not null default 'unverified' check(verification_status='unverified'),
 financing_need_status text not null default 'unknown' check(financing_need_status in('unknown','owner_confirmed')),
 last_job_id uuid not null, updated_at timestamptz not null default now(),
 unique(workspace_id,source_key), unique(workspace_id,id),
 foreign key(workspace_id,last_job_id) references ck_api.jobs(workspace_id,id)
);
create table ck_api.funding_enquiries (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references ck_api.workspace_links(workspace_id),
 business_name text not null, contact_name text not null, email text not null, phone text,
 province text not null check(province in('BC','AB','SK','MB','ON','QC','NB','NS','PE','NL','YT','NT','NU')),
 purpose text check(purpose in('working_capital','equipment','property_purchase','refinance','construction','acquisition')),
 amount_cad numeric(14,2) check(amount_cad>0 and amount_cad<=100000000),
 timeline text check(timeline in('within_30_days','within_90_days','later','exploring')),
 consent_to_contact boolean not null check(consent_to_contact), consent_to_refer boolean not null default false,
 consent_at timestamptz not null default now(), privacy_version text not null, attribution jsonb not null default '{}',
 source text not null check(source in('inbound_web','operator_intake')),
 status text not null default 'received' check(status in('received','needs_information','ready_for_review','closed')),
 reviewer_note text, reviewed_by text, reviewed_at timestamptz,
 idempotency_key text not null, payload_hash text not null, created_at timestamptz not null default now(),
 unique(workspace_id,idempotency_key),unique(workspace_id,id),
 check(status<>'ready_for_review' or (purpose is not null and amount_cad is not null and timeline is not null and reviewed_by is not null))
);
create table ck_api.opportunities (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references ck_api.workspace_links(workspace_id),
 company_id uuid, enquiry_id uuid, status text not null default 'needs_broker_review' check(status in('needs_broker_review','closed')),
 owner_interest_confirmed boolean not null check(owner_interest_confirmed), review_note text not null,
 reviewed_sources jsonb not null default '[]', idempotency_key text, payload_hash text, created_by text not null, created_at timestamptz not null default now(),
 check((company_id is null)<>(enquiry_id is null)),
 unique(workspace_id,company_id), unique(workspace_id,enquiry_id), unique(workspace_id,idempotency_key),
 foreign key(workspace_id,company_id) references ck_api.companies(workspace_id,id),
 foreign key(workspace_id,enquiry_id) references ck_api.funding_enquiries(workspace_id,id)
);
create table ck_api.audit_events (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references ck_api.workspace_links(workspace_id),
 actor text not null, action text not null, resource_id uuid not null, created_at timestamptz not null default now()
);
-- No public REST grants; the API uses a restricted server-only PostgreSQL login.
do $$ declare t text; begin
 foreach t in array array['jobs','companies','funding_enquiries','opportunities','audit_events'] loop
  execute format('alter table ck_api.%I enable row level security',t);
  execute format('alter table ck_api.%I force row level security',t);
  execute format('create policy workspace_isolation on ck_api.%I to ck_api_runtime using(workspace_id=(select ck_api.current_workspace_id())) with check(workspace_id=(select ck_api.current_workspace_id()))',t);
 end loop;
end $$;
grant select,insert,update on ck_api.jobs,ck_api.companies,ck_api.funding_enquiries to ck_api_runtime;
grant select,insert,update on ck_api.opportunities to ck_api_runtime;
grant select,insert on ck_api.audit_events to ck_api_runtime;
create policy intake_insert on ck_api.funding_enquiries for insert to ck_api_intake
 with check(workspace_id=(select ck_api.current_workspace_id()) and source='inbound_web' and status='received');
create policy intake_receipt on ck_api.funding_enquiries for select to ck_api_intake
 using(workspace_id=(select ck_api.current_workspace_id()));
grant insert on ck_api.funding_enquiries to ck_api_intake;
grant select(id,workspace_id,idempotency_key,payload_hash,created_at) on ck_api.funding_enquiries to ck_api_intake;
create policy intake_audit on ck_api.audit_events for insert to ck_api_intake
 with check(workspace_id=(select ck_api.current_workspace_id()));
grant insert on ck_api.audit_events to ck_api_intake;
commit;
