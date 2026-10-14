# Architecture and security boundaries

Web: Next.js App Router + TypeScript + Tailwind/shadcn patterns. Authentication: Clerk with Organizations. Source of record: PostgreSQL on Supabase. Async ingestion: Railway worker or scheduled server job. Stripe for subscriptions. Object storage for licensed source documents.

**Tenant isolation**: Each business row has `organization_id`; on each authenticated request verify Clerk session and active organization on the server, map Clerk org to internal UUID, then invoke Postgres using a verified actor/tenant claim. Define RLS policies on all tenant tables. Never allow the browser to choose or overwrite the authorized tenant. Do not use service-role credentials to process ordinary tenant requests; service role bypasses RLS. Include tests for cross-tenant reads/writes before exposing APIs.

**Pipeline**: source adapters (municipal BC permits, open data, permitted vendor APIs) → source snapshot storage → normalization → entity resolution and deduplication → provenance/quality checks → human validation → project records → priority ranking → stakeholder enrichment → opportunities. License and rate-limit constraints are mandatory per adapter.

**Compliance**: CASL contact eligibility, suppression lists and unsubscribe handling before marketing; PIPEDA and applicable provincial privacy controls, data minimization, retention and access logging; Canadian securities/mortgage regulations and permissions as applicable; human review of financing claims. Consult counsel for regulated workflows.

**Operational baseline**: encrypted transport, secrets in hosting secret store, role-based permissions, audit events, backups/restore tests, Sentry-style error monitoring, bounded retries and idempotent imports. Geographic storage/residency decisions must be documented before accepting production personal data.

**Current scaffold**: dashboard displays explicit synthetic fixtures. Schema has RLS enabled and no access policies; there is no production CRUD or billing until JWT / policy integration is tested.
