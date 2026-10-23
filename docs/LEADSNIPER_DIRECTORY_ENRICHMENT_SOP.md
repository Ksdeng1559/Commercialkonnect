# LeadSniperAI — Directory Discovery and Explee Enrichment SOP

# Purpose
Convert business listings discovered through Google Business Profile (GMB), Yelp, and Yellow Pages into evidence-backed, deduplicated company records and decision-maker research tasks for LeadSniperAI, then into human-qualified commercialKonnect broker opportunities. A listing is not a financing lead; financing intent remains **unknown** until confirmed by the business owner or authorized representative.

## Operating sequence
1. **Discover:** Run geography + category searches in approved Google Places/Business Profile-compatible APIs, Yelp Fusion or authorized data partners, and Yellow Pages licensed/approved sources. Log the exact provider, listing URL/ID, retrieval timestamp, usage rights, API cost, business name, phone, address, category, rating/review count when permitted, and website/domain. Do not assume all directories authorize scraping, long-term caching or resale.
2. **Normalize:** Standardize legal/trading name, domain, phone (E.164), physical address, postal code, province, industry/NAICS candidate, corporate versus branch/franchise identity. Retain raw source values separately; never overwrite conflicting facts silently.
3. **Resolve and deduplicate:** Prioritize matching domain + phone + normalized address; use business name plus locality as supporting evidence. Preserve all source IDs. Flag ambiguous brands, shared offices and franchises for human review; do not auto-merge different legal entities.
4. **Enrich:** First inspect the company website and public registries for identity. Pass a verified domain to the vendor-neutral enrichment adapter. Evaluate Explee for company and people discovery, owner/CEO/CFO identification, work email and optional phone; compare with Deepline and alternative providers. Record provider, requested capability, request ID, spend, freshness, match confidence, lawful use rights and source. Do not present unverified personal email or inferred mobile numbers as verified.
5. **Find business events:** Research relevant signals (location opening, hiring, expansion, new equipment, construction permit, new contracts, procurement, property acquisition). Store dated cited evidence and confidence. Reviews or high ratings alone do not demonstrate financing demand; low review count can be a marketing opportunity rather than a borrowing signal.
6. **Classify:** Separate service/appointment opportunities for contractors from capital-origination opportunities. Financing product hypotheses may include commercial mortgages, equipment finance, ABL, factoring, working capital, construction loans, and acquisition financing. Product suitability and financing need are **unconfirmed** until discussed.
7. **Review and qualify:** Human confirms business identity, correct stakeholder, evidence reliability, permitted outreach basis and fit to licensed broker's province/mandate. Use a concise client intelligence card and outreach draft. Never route as a qualified finance lead without confirmed financing discussion/interest, authorization to share, and a named recipient category.
8. **Engage and book:** Apply CASL/PIPEDA and applicable platform/provider terms; record legal basis, source, contact method, opt-outs and suppression. Human approves outbound sends. Confirm meeting with owner/authorized executive, capture stated requirements and timeframe.
9. **Route and measure:** Save to Supabase as source of truth, with tenant RLS and consent/suppression/audit history. Sync permitted summary to Atomic CRM/mission-control and Notion status view. Match to eligible broker only after checks. Track meetings held, broker acceptance, opportunity outcomes, data spend and acquisition cost.

## Opportunity state machine
Discovered → Identity checked → Enriched → Growth signal reviewed → Outreach approved → Owner contacted → Financing interest confirmed → Authorized broker introduction → Meeting held → Qualified mandate / Nurture / Closed.

**Critical separation:** discovery status, company verification, contact verification, growth hypothesis, financing intent and broker acceptance are independent fields; stage movement cannot create evidence.

## Minimum records
- `business`: internal ID, tenant ID, names, normalized domain, locations, branch/parent relation, category/NAICS, website.
- `business_source`: source platform, listing ID/URL, observed_at, retrieved_at, fields and provider-rights metadata.
- `contact`: organization, name, business role, method, verification status, provider/source/date, outreach restrictions.
- `signal`: type, observed/event date, URL, quoted supporting fact, confidence, contradiction state.
- `enrichment_run`: vendor, request ID, fields, units/credits, estimated/actual USD cost, latency, success/error, timestamp.
- `opportunity`: target use case, product hypotheses, intent status (unknown/denied/confirmed), buyer assignment eligibility, next action, broker ownership.
- `consent_audit`: legal basis, contact provenance, sharing authorization, opt-out/suppression and retention/deletion controls.

## Research quality and score
Use a configurable score based on (a) verified growth evidence, (b) relevant capital-use signal, (c) recency, (d) decision-maker verification and (e) broker mandate fit. Publish weights and underlying evidence; mark scores as research prioritization only, never borrower creditworthiness or proven intent. Apply negative indicators: stale listings, closed locations, uncertain entity match, contradictory information, already serviced, opt-out.

## API and integration design
Pipeline: **LeadSniperAI Discovery → normalization/dedup → Explee/other enrichment adapter → Evidence & Growth Signal Agent → human compliance/qualification → commercialKonnect broker Mission Control → CRM/outcome feedback**.
Suggested internal functions: `discoverBusinesses(source,region,category)`, `resolveBusinessIdentity()`, `enrichCompany(domain,provider)`, `findDecisionMakers()`, `validateContact()`, `researchSignals()`, `buildOpportunityCard()`, `approveOutreach()`, `recordOwnerIntent()`, `routeBroker()`. All providers must run behind server-only secrets, feature flags, tenant budget guards, rate limits, retries, idempotency and source-level licensing constraints. **Do not assume Explee endpoints or prices until the OpenAPI contract and commercial terms are validated.**

## Pilot and acceptance tests
BC-first: 200 businesses across construction, logistics, manufacturing, wholesale and commercial services. Review at least 100 entity matches by hand. Targets (not observed): ≥95% precision of accepted matches; 100% source URLs/date for substantive growth claims; 0 outbound contacts lacking documented compliance review; 0 broker-routed finance leads without verified interest + permission; 0 cross-tenant data leaks; measure enrichment hit rate, cost per usable company, verified stakeholder, owner conversation, held meeting, and broker-accepted financing opportunity. Run the exact same sample against Explee, manual research and at least one other provider, logging failures and duplicate charges.

## Delivery and ownership
LeadSniperAI owns discovery/enrichment orchestration; Supabase holds authoritative data. commercialKonnect surfaces broker intelligence and action queue. Harvey/Chief of Staff can summarize and recommend but must not independently send, imply financing intent or distribute contacts. Notion is the SOP and planning layer, not the transactional lead database.

## Source references
- [Explee API documentation](https://api.explee.com/public/api/docs)
- [LeadSniperAI Growth Signal Engine](https://app.notion.com/p/3fc9e94cf0a481d1ad98d01f9bfaf95c)
- [LeadSniperAI Marketplace OS](https://app.notion.com/p/3a09e94cf0a481a79a53e07966c1ac20)
- [KonstructionComOS repository](https://github.com/Ksdeng1559/KonstructionComOS)

**Status:** Proposed operating specification; not a claim of implemented connectors or production-compliant data licenses.