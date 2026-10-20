# GTM enrichment → OODA Chief of Staff (draft pipeline)

**Branch:** `feature/gtm-provider-adapter`. Status: **pure TypeScript prototype, not deployed or persistence-enabled**.

## Path
1. A reviewed, tenant-authorized service obtains `EnrichmentResult` from a configured provider.
2. `draftOodaFromEnrichment` maps normalized claims to workspace-scoped, in-memory `Signal` records, deduplicated per subject/field/value/source.
3. `Orient` separates source-backed, provider-labelled verified claims from inferred claims and unsupported/unknown claims, using Client Brain goals, constraints and version.
4. `Decide` creates **only** an evidence-referenced `needs_review` prospect-review recommendation when supported claims exist. It never claims that financing demand has been confirmed.
5. `Act` is deliberately **not implemented**; no automatic outreach, loan submission, spending, CRM promotion or agent dispatch.

## Limits and engineering gates
- This is a deterministic draft transformer, not an autonomous OODA engine. Claims marked "verified" by a provider are not independently verified by the platform.
- Signals are not yet persisted; generated IDs are scoped to one batch only and **must be replaced by stable persisted identifiers**.
- OODA decisions are not ranked by value, urgency, probability, effort and risk yet; that phase requires calibrated criteria and explicit client context.
- Do not trust caller-supplied `workspaceId`: authenticated tenancy, Supabase RLS, Client Brain access authorization and audit logging belong in a server-only application service.
- Enforce source freshness, provenance quality, data minimization, usage/licensing, CASL/PIPEDA, contact suppression and spend limits upstream.
- Implement a durable approval queue and scoped action executor with explicit approval records and negative tests before enabling `Act`.
- Add unit tests, typecheck/CI, multi-tenant access tests and a BC provider bake-off before merging.

Reference: [OODA Chief of Staff architecture](OODA_CHIEF_OF_STAFF.md), [provider implementation](GTM_PROVIDER_ADAPTER_IMPLEMENTATION.md).
