# Treg — Unified GTM Data Gateway (evaluation candidate)

**Status:** Planned, not integrated. **Upstream:** https://github.com/superdesigndev/treg | https://treg.to
**Decision:** Evaluate a tool-registry/API-proxy gateway for GTM research and enrichment; preserve direct integrations and supplier choice.

## Fit and limits
Treg describes one agent-facing registry for a catalog of third-party endpoints, team-owned API credentials, CLI tools and skills. It offers a hosted service or self-hosting, with some catalog calls priced per call. Availability, country-specific coverage, real pricing, data provenance, service terms, rate limits and self-hosting security must be confirmed before purchase or production use. A gateway is **not** a source of verified financing intent, and it does not make underlying provider data interchangeable.

## Position in architecture
- BuildData and other construction/municipal data sources remain authoritative for project-event discovery.
- GTM enrichment/orchestration adapter: `GtmEnrichmentProvider` (see [Deepline alternative](DEEPLINE_GTM_ENRICHMENT_ALTERNATIVE.md)).
- Candidate routes: **Treg gateway**, **Deepline workflows**, direct **Exa**, **Tavily**, **Parallel** and manual research. Deepline may optionally invoke Treg if interfaces/terms permit; do **not** assume native compatibility.
- Chief of Staff/Harvey may request enrichment and prepare evidence-backed briefings; human approval is required for outreach or commercial lead routing.
- Supabase remains system of record, with tenant isolation and per-assertion provenance. Atomic CRM / Mission Control are consumers, not raw credential stores.

## Testable GTM scenarios
1. BC developer -> entity identification -> sponsor/decision-maker discovery -> verified contact -> unknown/confirmed financing need recorded separately.
2. Contractor opportunity -> relevant project & trade -> GC/owner role match -> verified introduction readiness.
3. Growing business -> independently sourced expansion/hiring signal -> company/owner enrichment -> qualification for business-financing discussion.
4. Inbound financing request -> consent, jurisdiction and financing-fit checks -> broker eligibility and manual routing review.

## Technical design (proposed)
Introduce a `ToolGateway` interface exposing `discoverCapability`, `invokeProvider`, `estimateCost` (when published), and `getUsage`. Route only approved, supported capabilities. Require input validation, allowlists, per-tenant budgets, provider timeouts, retry limits, idempotency keys, credential isolation, cache TTL, data retention rules and audit logging. Secrets are server-side only; never forward lender/borrower sensitive financial information to third parties without explicit legal/security approval.

Normalize output: `tenant_id`, `subject_id`, `attribute`, `value`, `source_provider`, `source_url`, `observed_at`, `verified_at`, `confidence`, `status` (`verified|inferred|unknown`), `request_cost`, `rights/usage`, `review_status`. Missing source/verification must be flagged, never fabricated.

## BC benchmark (before vendor selection)
Run 50 consent-appropriate/public BC company or project samples across broker, developer, construction and business-financing segments. Compare:
- Direct provider path versus Treg-routed equivalent (same upstream whenever possible) and Deepline workflow as a separate approach.
- Source-supported precision and role accuracy, independently verified decision-maker/contact coverage, signal relevance and freshness.
- Cost per verified usable record (including gateway markup), median/p95 latency, failure rate, duplicate rate, analyst minutes.
- Privacy, CASL/PIPEDA, vendor resale/redistribution rights, data residency/security, tenant segregation and suppression handling.
- Hosted vs self-hosted operating cost and failure modes.

**Decision gates:** Do not replace direct integrations until verified quality is non-inferior, provider terms allow intended usage, gateway complexity is justified by cost/operational benefits, and compliance/security review passes. Instrument fallback to direct providers.

## Engineering checklist
- [ ] Review current upstream source, license, security guidance, authentication, endpoints and actual supported catalogs
- [ ] Map concrete Treg functions to GTM enrichment requirements; separate research from contact validation
- [ ] Define `ToolGateway` adapter behind feature flag, no production rollout
- [ ] Implement usage-cost caps, audit trails, retries, tenant scoping and suppression
- [ ] Create repeatable 50-record BC comparison with direct providers and Deepline
- [ ] Record go/no-go with raw evidence, costs and provider/data rights
- [ ] Integrate only proven provider routes into Mission Control/Chief of Staff

**No production integration, secrets, provider subscription or live enrichment is introduced by this documentation.**
