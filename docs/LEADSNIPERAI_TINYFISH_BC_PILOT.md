# TinyFish BC Business Owner & Financing Signal Pilot

Date: 2026-10-21
Status: Live research proof of concept; NOT production lead qualification or outreach.

## Goal
Use TinyFish public web search and fetch to find BC businesses with independently documented expansion signals, named decision-makers, and plausible financing product conversations. Finance need remains UNKNOWN until authorized owner confirmation.

## Pilot findings

### Advanced Cyclotron Systems, Inc. (ACSI)
- Location: Surrey, BC; new facility at 19145 34A Avenue.
- Signal: 2026-05-14 trade article reports new 48,000 sq ft purpose-built manufacturing facility replacing existing 24,000 sq ft Richmond facility; designed for growth in cyclotron manufacturing, expected more than double production capacity.
- Identified leader: Richard Eppich, CEO, quoted in dated article. Role and identity should be checked against first-party/current sources before outreach.
- Possible financing discovery: industrial real estate/construction funding, specialized manufacturing equipment, working capital during expansion.
- Actual funding need: UNKNOWN. Do not claim financing is required or available.
- Source: https://www.connectcre.ca/stories/acsi-breaks-ground-on-new-purpose-built-manufacturing-site-in-surrey/

### Flagship Logistics
- Location: Delta, BC; company About page gives 1405 Cliveden Avenue, Annacis Island, 32,000 sq ft site.
- Signal: Company's 2026-04-01 expansion post says it moved from Richmond to a larger Annacis Island facility, with increased capacity.
- Owner: Company's blog identifies “Adis” as owner; full name and legal ownership not independently verified. Do not invent surname or corporate officer role.
- Possible discovery: material handling equipment, fleet, warehouse build-out, cash-flow capacity.
- Actual funding need: UNKNOWN.
- Sources: https://flagshiplogistics.ca/blog/flagship-logistics-expansion-new-facility/ and https://flagshiplogistics.ca/about/

### Additional companies from government grant announcement
- On 2026-07-13 PacifiCan described public investments and expansion/capex activities involving AI Industries ($1m), MTC Solutions ($630,250), Nanak Foods ($5.5m), and PowerHouse Building Solutions ($925k).
- These are research candidates, not established funding gaps. The government funding amounts must be factored into qualification, rather than interpreted as proof of unmet need.
- Source: https://www.canada.ca/en/pacific-economic-development/news/2026/07/backgrounder-government-of-canada-invests-over-8-million-to-help-surrey-businesses-boost-productivity-and-reach-new-markets.html

## TinyFish procedure
1. Search by BC city + industry + concrete growth event: new facility, warehouse, equipment, production, contract, expansion. Prefer fresh dated first-party and official government records.
2. Fetch primary pages with TinyFish; record canonical URL, page title, article date, observed timestamp.
3. Extract structured business signals with evidence text, not just generic AI explanations; distinguish announced/planned vs completed.
4. Read first-party About/Leadership page to verify named principal/title. Mark unidentified leaders as unverified.
5. Identify exact business entity via OrgBook/BC Registry when required. For property ownership, rely on PID + LTSA title (not inference from occupancy).
6. Infer relevant discussion topics only; do not infer creditworthiness, indebtedness or loan intent.
7. Preserve privacy and data rights; authorized contact and CASL assessment before outreach.
8. Broker human review and owner confirmation are required to move from research-qualified to financing-qualified.

## Business Intelligence Card Schema (proposed)
- business_name, website, city, industry, legal_entity_status
- contact_name, role, verification_level, role_source_url, role_as_of
- signals[]: category, event_date, evidence_url, evidence_summary, state(planned/announced/underway/completed)
- possible_products[], existing_public_funding[], needs_confirmed(false by default)
- property_address, PID (when verified), title_ownership_status (unknown by default)
- source_rights, last_verified, follow_up, broker_id, contact_permission_status

## Implementation
Add TinyFish as an *optional server-side enrichment provider* rather than replacing directory discovery adapters. Define its output as inspectable evidence records. Separate extraction from scoring and outbound operations. Add budget caps, source allow-list, retries, cache with source-specific rights, tenant-isolated storage and manual review.

## Pilot acceptance checks
- At least 80% of named roles trace to current official or first-party evidence (target).
- At least 90% of signals support their category and date (target).
- Zero records labeled as owner-confirmed financing need from web research alone.
- Track real cost and researcher review minutes per verified record.
