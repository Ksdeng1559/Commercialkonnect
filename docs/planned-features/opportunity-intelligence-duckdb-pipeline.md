# Planned: Opportunity Intelligence — DuckDB Processing Architecture

**Status:** Adopted as target architecture, not implemented.  
**Related:** GitHub issue #14; docs/PRD.md; existing Mortgage Mix tenancy refactor.  
**Scope:** CommercialKonnect broker opportunity intelligence, BC-first (then AB/ON).

## Architectural decision
Use **durable object storage for raw provider responses**, **DuckDB embedded in a Railway batch worker for analytical staging and transformations**, and **Supabase PostgreSQL as the operational system of record** consumed by Atomic CRM. Supabase tracks processing jobs and broker-facing state. DuckDB is **not** the durable job queue, shared transactional database, or sole copy of source records.

```text
LeadSniperAI / DataForSEO (permitted discovery)
           │
ScrapeGraphAI (structured extraction)
           │
Object storage: raw JSON / permitted HTML / Parquet (Bronze)
           │
Railway worker + DuckDB: normalize, join, deduplicate, validate (Silver)
           │
Exa / Tavily / Parallel + AI: corroborate evidence, infer hypotheses
           │
DuckDB: final provenance, confidence, quality and export checks
           │
Supabase Postgres: tenant-safe curated company, evidence, opportunity records (Gold)
           │
Atomic CRM / shadcn UI / Chief of Staff
```

## Data contracts
- **Bronze:** `job_id`, `tenant_id`, `provider`, `source_url`, `retrieved_at`, `object_key`, `content_hash`, `schema_version`; original responses retained with retention policy.
- **Silver:** canonical company identifiers, normalized names, location, website/domain, industry, dedup keys, source-linked claims, missingness flags, processing status.
- **Gold:** company and contact references, source-backed growth signals, `signal_confidence`, `last_verified_at`, financing hypotheses, `financing_need_status` (default `unknown`), score explanation, owner/workspace and next action.
- Keep **observed fact**, **inference**, **broker-confirmed need**, and **funding decision** distinct. A growth signal does not prove financing demand.
- Preserve source URL, observation date, extraction version and audit trail for every material claim.

## Job lifecycle
1. Authorized broker initiates a scoped search; Supabase records `queued` job, organization, filters, budgets and idempotency key.
2. Railway worker claims the job; discovery and extraction responses are durably written to object storage before transformation.
3. DuckDB reads batches (JSON/Parquet), standardizes and deduplicates, joins records, and selects candidates for cost-limited enrichment.
4. Research agents corroborate selected candidates; record URLs, timestamps, confidence and explicit unknowns.
5. DuckDB validates curated outputs, removes duplicates, computes explainable opportunity rankings, and emits versioned export batches.
6. Authenticated server-side ingestion performs **idempotent upserts** into the existing tenant-safe Supabase CRM model, preserving provenance and avoiding overwriting broker-owned notes.
7. Job transitions to `completed`, `partial`, or `failed`; store counts, cost, error details, and object-storage checkpoints for retries.

## Deployment boundaries
- **Vercel:** React/shadcn frontend and authenticated API gateway.
- **Railway:** isolated batch/AI worker with embedded DuckDB; avoid relying on ephemeral local DuckDB files for recovery.
- **Object storage:** Supabase Storage or S3-compatible storage for durable raw and checkpoint artifacts.
- **Supabase PostgreSQL:** durable job tracking and operational CRM records; enforce tenant isolation via established Clerk organization mapping and RLS.
- **Secrets:** provider API keys and service-role credentials remain server-side; never expose them to browsers.
- **Concurrency:** process isolated per-job DuckDB databases or in-memory connections; do not assume a single DuckDB file supports concurrent distributed writers.
- **Governance:** rate limits, provider terms, CASL/PIPEDA review, retention/deletion controls, observability, retry/backoff and budget ceilings.

## Delivery stages
**A — Synthetic demo:** existing four-screen React/shadcn prototype; no live providers or writes.
**B — Storage/job foundation:** define object paths, job schema, worker interfaces, idempotent ingestion, observability; reconcile with approved Mortgage Mix refactor before migrations.
**C — DuckDB batch pipeline:** implement Bronze → Silver → Gold transformations with fixtures, deterministic dedup and provenance tests.
**D — Provider integration:** connect LeadSniperAI, DataForSEO, ScrapeGraphAI and corroboration agents under cost controls.
**E — CRM activation:** qualified prospect cards, broker-reviewed outreach, Chief of Staff briefings and outcome attribution.

## Acceptance criteria
- Reprocessing a batch never creates duplicate companies/opportunities or destroys existing broker interactions.
- Source evidence and confidence remain inspectable in Atomic CRM.
- Broker confirmation is required to change financing need from `unknown` to `confirmed`.
- Restarting a worker can resume from durable checkpoints; failed batches do not create misleading Gold records.
- Cross-tenant read/write tests pass and every API action is authorized.
- Measure ingest cost, provider failures, extraction quality, duplicate rate, freshness, verified meetings per 100 researched prospects.
- Benchmark DuckDB against direct PostgreSQL transforms for actual batch sizes; retain DuckDB only if justified by measurable processing needs.

## Important existing repository constraint
The README documents an unfinished Mortgage Mix `mix_*` tenancy refactor and live existing records. This document is **planning only**: do not execute untargeted migrations or change production tables until existing schema/tenant ownership is reconciled.
