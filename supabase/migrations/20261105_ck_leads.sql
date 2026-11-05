-- Public enquiry leads captured by the Astro marketing site (/apply).
-- These are unauthenticated, pre-tenant leads, distinct from ck.funding_applications
-- (which is org-scoped and part of the authenticated intake pipeline).
-- Writes happen server-side with the service role key (RLS bypassed); no public
-- policies are granted, so the anon/authenticated roles cannot read or write.

create table if not exists ck.leads (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),

  -- attribution (rank-and-rent)
  source_page        text,
  utm                jsonb not null default '{}'::jsonb,

  -- enquiry
  product            text,
  purpose            text,
  amount_band        text,
  timing             text,
  industry           text,

  -- contact
  name               text not null,
  business           text,
  email              text not null,
  phone              text,

  -- consent (CASL: email and SMS tracked separately)
  email_consent      boolean not null default false,
  email_consent_at   timestamptz,
  sms_consent        boolean not null default false,
  sms_consent_at     timestamptz,

  -- lifecycle + routing
  status             text not null default 'new',
  assigned_broker    text,

  -- delivery audit
  resend_message_id  text,
  twilio_message_sid text
);

alter table ck.leads enable row level security;
-- No policies on purpose: only the service role (which bypasses RLS) reads/writes.

create index if not exists leads_created_at_idx on ck.leads (created_at desc);
create index if not exists leads_product_idx on ck.leads (product);
create index if not exists leads_status_idx on ck.leads (status);
