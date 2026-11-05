-- Intake + funding data for Mission Control (INTAKE.md / QUALIFICATION.md).
-- Tenant = public.organizations(clerk_org_id); FK = organization_id, matching the existing schema.
-- RLS enabled, NO permissive policies by default — add tenant-scoped policies only after verified
-- Clerk JWT claims integration (MC-03). Server must set verified claims; never trust tenant id from client.
create extension if not exists pgcrypto;

-- Reference catalog (global, not tenant data): the funding verticals a deal can be qualified against.
create table if not exists public.funding_verticals (
  id uuid primary key default gen_random_uuid(),
  product text not null,                 -- loc | working_capital | commercial_mortgage | bridge | construction | equipment | factoring_abl | acquisition
  industry text not null,                -- construction | hvac | plumbing | retail | restaurant | manufacturing | transportation | wholesale | professional_services | property_development
  geo_scope text not null default 'BC',
  min_cad numeric(18,2),
  max_cad numeric(18,2),
  active boolean not null default true,
  evidence_requirements jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (product, industry, geo_scope)
);

-- Stage 01 — funding application (self-reported). Applicant type sets required fields.
create table if not exists public.funding_applications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  applicant_type text not null,          -- sole_proprietor | incorporated | partnership | franchise | startup_under_2yr | established_operator | commercial_property_owner | developer | holdco_opco
  product text,
  amount_cad numeric(18,2),
  industry text,
  geo text,
  use_of_funds jsonb not null default '[]'::jsonb,
  consent_basis jsonb not null default '{}'::jsonb,   -- CASL basis the applicant agreed to; a submission is not blanket marketing permission
  source text,
  submitted_at timestamptz,
  dedup_key text,                        -- business domain + contact
  status text not null default 'new',
  created_at timestamptz not null default now(),
  unique (organization_id, dedup_key)
);

-- Stage 02 — clarification call; optional transcribed Google Meet. Consent gated at DB level.
create table if not exists public.clarification_calls (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  application_id uuid not null references public.funding_applications(id) on delete cascade,
  participants jsonb not null default '[]'::jsonb,
  observed_at timestamptz,
  recording_consent_evidence jsonb,      -- all-party consent evidence (BC). Required before a transcript may be stored.
  transcript_source_id text,             -- pointer to the stored transcript source record (server-side)
  provider text,                         -- e.g. google_meet
  created_at timestamptz not null default now(),
  -- a transcript may only exist when recording consent evidence is present
  constraint transcript_requires_consent check (transcript_source_id is null or recording_consent_evidence is not null)
);

-- Stage 03 — classification into silos. One row per classified field, with provenance + confidence.
create table if not exists public.intake_classification (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  application_id uuid not null references public.funding_applications(id) on delete cascade,
  silo text not null,                    -- applicant_entity | funding_purpose | amount_use | business_profile | financials | collateral | timeline | authority | financing_need | consent_contact | evidence_source
  field text not null,
  value text,                            -- NULL = unknown; never defaulted to a passing value
  source text not null check (source in ('application','transcript')),
  transcript_span text,                  -- which transcript span, when source = transcript
  confidence numeric(4,3),               -- 0.000–1.000
  observed_at timestamptz,
  review_status text not null default 'unreviewed',  -- unreviewed | confirmed | corrected | rejected
  created_at timestamptz not null default now(),
  constraint transcript_span_only_for_transcript check (transcript_span is null or source = 'transcript')
);

-- Stage 04 — client brief (the funding-request summary). Source-linked, draft, versioned, immutable on acceptance.
create table if not exists public.client_briefs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  application_id uuid not null references public.funding_applications(id) on delete cascade,
  opportunity_id uuid references public.opportunities(id) on delete set null,
  version int not null default 1,
  summary text not null,
  citations jsonb not null default '[]'::jsonb,   -- every claim cites an application field or transcript span
  unknowns jsonb not null default '[]'::jsonb,    -- silos/fields still unknown, listed explicitly
  reviewed_by text,
  reviewed_at timestamptz,
  immutable boolean not null default false,       -- set true on broker acceptance
  created_at timestamptz not null default now(),
  unique (application_id, version)
);

create index if not exists funding_applications_org_idx on public.funding_applications(organization_id, status, created_at desc);
create index if not exists clarification_calls_app_idx on public.clarification_calls(application_id);
create index if not exists intake_classification_app_idx on public.intake_classification(application_id, silo);
create index if not exists client_briefs_app_idx on public.client_briefs(application_id, version desc);

alter table public.funding_verticals enable row level security;      -- reference catalog; read policy added later
alter table public.funding_applications enable row level security;
alter table public.clarification_calls enable row level security;
alter table public.intake_classification enable row level security;
alter table public.client_briefs enable row level security;
-- No permissive policies by default. Add tenant-scoped policies (organization_id = verified claim) under MC-03.
