-- Initial tenant-isolated schema. Server must set verified JWT claims; never trust tenant_id from client input.
create extension if not exists pgcrypto;
create table if not exists public.organizations (id uuid primary key default gen_random_uuid(), clerk_org_id text not null unique, name text not null, created_at timestamptz not null default now());
create table if not exists public.projects (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, name text not null, city text, province text default 'BC', project_type text, stage text, estimated_value numeric(18,2), score int check(score between 0 and 100), source_url text, source_seen_at timestamptz, created_at timestamptz not null default now());
create table if not exists public.stakeholders (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, project_id uuid references public.projects(id) on delete set null, company_name text not null, contact_name text, role text, email text, phone text, provenance_url text, created_at timestamptz not null default now());
create table if not exists public.opportunities (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, project_id uuid references public.projects(id), financing_type text, funding_need numeric(18,2), status text not null default 'new', owner_user_id text, created_at timestamptz not null default now());
create index if not exists projects_org_idx on public.projects(organization_id,created_at desc);
create index if not exists stakeholders_org_idx on public.stakeholders(organization_id);
create index if not exists opportunities_org_idx on public.opportunities(organization_id,status);
alter table public.organizations enable row level security;
alter table public.projects enable row level security;
alter table public.stakeholders enable row level security;
alter table public.opportunities enable row level security;
-- No permissive policies by default. Add tenant-scoped policies only after verified JWT claims integration.
