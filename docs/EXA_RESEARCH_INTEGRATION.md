# Planned feature: Exa research and project-signal integration

**Status:** Planned; not implemented or approved for production use  
**Product:** KonstructionComOS / ClearConnect  
**Launch geography:** British Columbia  
**Primary pilot users:** Commercial mortgage and development-finance brokers, general contractors and specialist subcontractors  
**Last reviewed:** October 19, 2026

## Objective

Evaluate Exa as a web discovery and content-retrieval provider for finding public project and company signals and preparing source-backed project briefings. Exa is a research input, not the system of record and not an authority for permitting, procurement, financing, or project status.

The feature supports the product promise of turning early construction activity into qualified B2B relationships. It must keep discovery separate from qualification: a public permit, article, or project announcement does not prove financing demand, open contract scope, project viability, or decision-maker authority.

## Proposed MVP

1. A user or authorized workflow starts a research run for a geography, project type, target segment, and signal category.
2. Exa Search discovers candidate public pages. Contents retrieves relevant text or highlights for selected pages.
3. A server-side extraction step proposes structured project facts using a versioned schema.
4. Each proposed fact retains its evidence URL, page title, publisher when available, quoted supporting passage/highlight, source publication date when available, retrieval timestamp, and extraction status.
5. Candidates are deduplicated against existing projects and sources.
6. A human reviews critical fields before promotion into the verified project registry or a sales-ready queue.
7. The user can open the evidence and dismiss, correct, or accept each proposed finding.

No scheduled monitoring, autonomous contact enrichment, outbound messaging, or automatic opportunity qualification is included in the first slice.

## Suggested research record

- Project name and normalized location (keep source wording separately)
- Project type and scale (unknown unless supported by evidence)
- Sponsor, owner, developer, and stakeholder identity evidence
- Project stage: proposed, application, approved, tendering, under construction, completed, or unknown
- Signal category and event date, distinct from publication and retrieval dates
- Source URL, title, publisher, relevant passage, content retrieval timestamp
- Exa query/run identifier and provider metadata needed for audit and cost attribution
- Extracted value, field-level confidence, and verification state
- Duplicate/canonical project match and reviewer decision
- Segment fit and rationale (broker, contractor/trade, developer, or commercial real estate)
- Next action and owner

Confidence is a review aid, not proof. Store uncertainty and missing values explicitly; do not silently convert them to facts.

## Provider boundary and data flow

Implement Exa behind a provider interface such as `ResearchProvider`, keeping search and content retrieval replaceable. Calls and API keys must remain server-side. Persist normalized findings and source provenance in the existing application data model only after checking the approved tenancy/schema design. Do not create a parallel source of truth.

Expected flow:

`Research request → Exa search → selected page retrieval → structured extraction → deduplication → human review → verified project registry → segment-specific qualification`

Official municipal, provincial, and procurement sources remain authoritative for their own records. Exa may discover or retrieve those sources; where a fact is material, link back to the authoritative record and verify against it.

## Segment-specific review

### Financing brokers

Review sponsor identity, project stage, and whether an authorized participant confirms a financing need and timeline. Never infer a borrowing requirement from public project activity alone.

### Contractors and trades

Review trade fit, geography, timing, scope, procurement stage, and whether the package is open. Do not treat a project announcement as an available contract.

### Developers and commercial real estate teams

Review ownership/developer relevance and project context. Discovery alone does not establish site feasibility, a mandate, or an investment opportunity.

## Data quality, privacy, and operational controls

- Preserve provenance at the field level; show sources and retrieval dates in briefings.
- Track publication, event, and retrieval timestamps separately.
- Mark records stale when stage/status evidence exceeds a configurable freshness window; do not imply that a search result is live status.
- Deduplicate by canonical URL, project/address, and organization; retain multiple independent sources.
- Apply tenant isolation to requests, results, logs, and saved records.
- Restrict API keys to server-side secrets; redact credentials and personal data from logs.
- Respect source terms, robots/access restrictions, Exa plan limits, and applicable Canadian privacy and outreach rules.
- Do not collect or use personal contact information for outreach without the product's separate compliance and permission checks.
- Add per-tenant usage budgets, request logging, error handling, retries with limits, and a manual fallback.
- Confirm Exa feature availability, terms, quotas, and pricing before implementation; API capabilities and costs can change.

## Phased delivery

### Phase 0 — Validation

- Confirm Exa account/API access, current capabilities, terms, quotas, and expected cost.
- Test representative BC queries across municipal planning, project announcements, construction news, and company sources.
- Compare results with known projects and authoritative municipal/procurement records.
- Measure relevance, novelty, evidence coverage, freshness, duplicate rate, extraction error rate, and cost per usable project.
- Do not proceed if the source coverage or economics fail the pilot criteria agreed by product owners.

### Phase 1 — Human-reviewed research brief

- Manual, user-triggered search.
- Store candidate results separately from verified project records.
- Show source excerpts and dates; require review before promotion.
- Keep implementation behind the provider boundary and feature flag.

### Phase 2 — Workflow integration

After Phase 1 quality is demonstrated, add segment-specific qualification, project deduplication, CRM/Kanban handoff, freshness checks, and outcome attribution.

### Phase 3 — Monitoring

Only after cost and signal quality are proven, evaluate scheduled Exa monitoring/alerts for saved projects or searches. Monitoring must produce reviewable change suggestions with evidence and must not silently overwrite verified fields.

## Pilot measures and gates

Agree thresholds with pilot users before running the evaluation. At minimum measure:

- Relevant and genuinely new candidate share
- Percentage of key proposed fields with direct supporting evidence
- Material-field accuracy after human review
- Duplicate and stale-result rates
- Median time to prepare a usable briefing versus the current process
- Cost per verified project and cost per qualified conversation
- Share of accepted findings that lead to a confirmed, segment-relevant conversation

The feature is successful only if it improves a user outcome at an acceptable data and operating cost. Research volume, API calls, or generated briefs alone are not success metrics.

## Dependencies and open decisions

- Approved project/source schema and tenant-isolation approach
- Exa credentials and account-specific API entitlement
- Official source hierarchy for each signal type and BC municipality
- Human reviewer role and promotion rules
- Freshness windows by field and source
- Pilot queries, reference projects, and pass/fail thresholds
- Provider cost limits and fallback behavior
- Whether future monitoring uses Exa or a separate source-specific feed

## References

- Exa documentation: https://exa.ai/docs
- Exa JavaScript SDK: https://github.com/exa-labs/exa-js
- Existing product scope: `docs/PRD.md`
- Existing project and source model work: see repository README and approved schema/design documents

