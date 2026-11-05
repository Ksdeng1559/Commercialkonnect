# Planned feature: Multi-agent web research provider evaluation

**Status:** Planned; not implemented or approved for production use  
**Product:** KonstructionComOS / ClearConnect  
**Launch geography:** British Columbia  
**Primary pilot users:** Commercial mortgage and development-finance brokers, general contractors and specialist subcontractors  
**Last reviewed:** October 19, 2026

## Objective

Evaluate Exa, Tavily, and Parallel as interchangeable web discovery and content-retrieval providers for finding public project and company signals and preparing source-backed project briefings. Each provider is tested by a separate, identically instructed research agent. Providers are research inputs, not the system of record and not authorities for permitting, procurement, financing, or project status.

The feature supports the product promise of turning early construction activity into qualified B2B relationships. It must keep discovery separate from qualification: a public permit, article, or project announcement does not prove financing demand, open contract scope, project viability, or decision-maker authority.

## Comparative research-agent bake-off

Run three independent agents against the same test set:

| Agent | Assigned provider | Purpose |
|---|---|---|
| Exa Research Agent | Exa Search and Contents; use deeper research only if included in the agreed test mode | Test project-signal discovery and evidence retrieval |
| Tavily Research Agent | Tavily Search and Extract; use Research/Crawl only if included in the agreed test mode | Test project-signal discovery, page extraction, and domain exploration |
| Parallel Research Agent | Parallel Search and Extract; use Task only if included in the agreed test mode | Test structured, multi-step project research and source-grounded outputs |
| Human baseline (control) | Existing manual research process and designated authoritative sources | Establish the quality and time baseline |

All agents receive the same query packet, geography, target segments, signal definitions, time window, output schema, and per-run limits. Keep model instructions and post-processing identical. Record provider-specific features and extra tool calls; do not let one provider use a more permissive research budget. If advanced/deep modes are compared, run a separate tier so basic search results remain comparable.

### Standard query packet

Build a small, adjudicated set of BC examples covering municipal planning/rezoning, development and building permit signals, public project announcements, tender/procurement status, and company/stakeholder context. Include known positive projects, negative or irrelevant examples, duplicate mentions, stale pages, and cases where no reliable public evidence exists. Prefer primary government/procurement sources for ground truth. Freeze the query set and truth labels before running agents.

### Shared output contract

Each agent returns the same structured records: project identity and location; signal category; event/publication/retrieval dates; project stage; sponsor/owner if evidenced; relevant source URLs and excerpts; unsupported or unknown fields; duplicate candidates; field-level confidence; and a short rationale. Every factual field must cite at least one source. Agents must say “unknown” when evidence is absent and must not infer financing need or open contract availability.

### Scoring and controls

Have reviewers who do not know which provider produced each record adjudicate against the frozen reference set. Compare:

- Precision and recall of relevant project signals
- Novel, actionable projects per fixed query and time budget
- Primary-source share and field-level evidence coverage
- Accuracy of stage, dates, location, sponsor, and status after adjudication
- Citation relevance, source freshness, duplicate rate, and unsupported-claim rate
- Median time to a review-ready briefing
- API cost and cost per verified, useful project
- Failure, timeout, and rate-limit frequency

Report results by signal category and segment as well as overall. Do not rank providers on raw result count. Set pass/fail thresholds with pilot users before testing; preserve raw outputs, queries, provider/version metadata, timestamps, and reviewer decisions for reproducibility. A provider may win different categories; retain a routing option if the evidence supports it.

## Proposed MVP

1. A user or authorized workflow starts a research run for a geography, project type, target segment, and signal category.
2. A provider-specific agent uses its assigned provider's search and content retrieval APIs to discover candidate public pages and retrieve relevant text or highlights.
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
- Provider query/run identifier, agent identifier, provider/model/API version, and run metadata needed for audit and cost attribution
- Extracted value, field-level confidence, and verification state
- Duplicate/canonical project match and reviewer decision
- Segment fit and rationale (broker, contractor/trade, developer, or commercial real estate)
- Next action and owner

Confidence is a review aid, not proof. Store uncertainty and missing values explicitly; do not silently convert them to facts.

## Provider boundary and data flow

Implement each provider behind the same `ResearchProvider` interface, keeping search and content retrieval replaceable. The evaluation harness should support Exa, Tavily, and Parallel adapters without changing prompts, schemas, or scoring rules. Calls and API keys must remain server-side. Persist normalized findings and source provenance in the existing application data model only after checking the approved tenancy/schema design. Do not create a parallel source of truth.

Expected flow:

`Research request → provider-specific agent → search and page retrieval → structured extraction → deduplication → human review → verified project registry → segment-specific qualification`

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
- Respect source terms, robots/access restrictions, each provider's plan limits, and applicable Canadian privacy and outreach rules.
- Do not collect or use personal contact information for outreach without the product's separate compliance and permission checks.
- Add per-tenant usage budgets, request logging, error handling, retries with limits, and a manual fallback.
- Confirm each provider's feature availability, terms, quotas, and pricing before implementation; API capabilities and costs can change.

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
- Exa, Tavily, and Parallel credentials and account-specific API entitlements for the comparative evaluation
- Official source hierarchy for each signal type and BC municipality
- Human reviewer role and promotion rules
- Freshness windows by field and source
- Pilot queries, reference projects, and pass/fail thresholds
- Provider cost limits and fallback behavior
- Which provider, if any, meets the pilot gates; whether routing should be category-specific
- Whether future monitoring uses one selected provider or separate source-specific feeds

## References

- Exa documentation: https://exa.ai/docs
- Tavily product and API: https://www.tavily.com/product
- Parallel documentation: https://docs.parallel.ai/introduction
- Existing product scope: `docs/PRD.md`
- Existing project and source model work: see repository README and approved schema/design documents

