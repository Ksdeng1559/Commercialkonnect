# Deepline — optional GTM enrichment provider (evaluation candidate)

**Status:** Planned alternative; not integrated, approved, or the default provider.
**Source:** https://github.com/getaero-io
**Candidate repositories:** https://github.com/getaero-io/gtm-eng-skills and https://github.com/getaero-io/deepline-gtm-agent

## Purpose
Evaluate Deepline as an optional provider of company/contact enrichment, decision-maker discovery, email verification, buying-signal research, lead scoring and GTM workflow automation for KonstructionComOS, commercialKonnect and LeadSniperAI. This is a provider comparison, not a commitment to use Deepline or its paid data sources.

## Architecture and boundaries
- Build an interchangeable `GtmEnrichmentProvider` adapter, separate from verified construction-project ingestion (e.g., BuildData).
- Compare Deepline with existing Exa, Tavily, Parallel and other configured research/enrichment routes. These tools may have different strengths: do not imply interchangeable APIs or equal contact coverage.
- Preserve Supabase as the system of record. Persist source URL, observed timestamp, verification time, provider, evidence, confidence, purpose/consent and cost metadata with each enrichment assertion.
- Never silently overwrite confirmed project facts or relationship records. Deduplicate at company, domain, project, contact and parent-organization levels.
- Distinguish public indicators of business expansion from **confirmed** financing need. Unknown need remains unknown until a qualified conversation establishes it.
- Route proposed prospect matches to a human-review queue before outreach, resale or brokerage assignment. Respect tenant isolation, role permissions, CASL/PIPEDA and applicable vendor licensing.
- Chief of Staff may summarize candidate leads and recommend next actions, but external contact or CRM promotion requires configured authorization and audit logging.

## Pilot use cases
1. **Development financing:** construction/project signal -> legal entity & sponsor research -> decision-maker contact validation -> financing-stage hypothesis -> human verification -> broker review queue.
2. **Business financing:** company growth/hiring/expansion signal -> company/contact enrichment -> evidence-backed financing-fit hypothesis -> manual qualification.
3. **Contractor GTM:** project or procurement signal -> contractor/owner/GC role match -> qualified introduction hypothesis -> verify appointment and package status.
4. **Inbound routing:** validated business and prospect identity -> jurisdiction, mandate and consent checks -> eligible broker shortlist.

## Provider interface (design only)
Input: `tenant_id`, `subject_type`, `subject_id`, requested fields, jurisdiction, purpose, spend cap and allowed providers.
Output: normalized company/contact/role attributes, provenance for every claim, observed/verified timestamps, confidence, status (`verified`/`inferred`/`unknown`), costs, duplicate indicators and provider errors.
Operations: `enrichCompany`, `findDecisionMakers`, `verifyContact`, `detectSignals`; all optional by capability. Enforce rate limits, timeouts, caching, audit logs and opt-out/suppression checks.

## Evaluation protocol
Use the same sample of **50 real BC companies/projects** for each applicable provider and a manual-research control; stratify by developer, broker, contractor and owner. Do not send unapproved messages.
Measure:
- Evidence-backed company/entity match precision; sponsor/contact-role accuracy checked by an analyst
- Verified and deliverable contact coverage (separately from guessed emails)
- Canadian and BC coverage by target segment
- Signal relevance, freshness, source citation availability and duplicated results
- Median analyst-review minutes saved, failure/retry rate and cost per **verified usable record**
- Licensing and data retention restrictions, permitted resale/CRM usage, Canadian privacy and outreach compliance

**Acceptance gate:** no production adoption until documented quality, coverage, cost, terms, compliance and human-review results meet thresholds agreed before testing. Compare against manual research and existing provider paths; retain the cheapest compliant, evidence-backed route for each task rather than selecting a universal vendor.

## Engineering tasks
- [ ] Review upstream licences, CLI/API authentication, provider dependencies, rate limits and pricing
- [ ] Define provider adapter and normalized provenance-rich schema
- [ ] Implement opt-in Deepline test adapter behind feature flag (no production credentials in client)
- [ ] Create repeatable test fixture and side-by-side scorecard vs Exa/Tavily/Parallel/manual
- [ ] Add cost caps, tenant scoping, suppression, deduplication, monitoring and review gates
- [ ] Write a go/no-go decision with measured BC performance

**Not implemented:** This document adds an alternative to the roadmap only. It does not install Deepline, create secrets, run enrichment, or claim measured product-market fit.
