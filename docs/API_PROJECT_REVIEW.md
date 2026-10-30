# API improvements from the project folder

Review date: October 29, 2026. This review compares the current API implementation with the supplied project documents and repository specifications. Historical documents use KonstructionComOS and KommercialConnect; the current product direction is CommercialKonnect Mission Control with ConnectionOS discovery, LeadSniper CLI research and inbound funding enquiries.

## Sources inspected

- Project source `KonstructionComOS_TAM_SAM_Product_Market_Fit.md`: segment, territory, unknown buyer intent, evidence provenance and distinct professional workflows.
- Project source `CommercialKonnect_Product_Market_Fit_2026-2.docx`: problem-led discovery, consented enquiries, attribution, lead disposition and accepted financing conversations as the proposed north-star measure. Commercial assumptions are hypotheses, not API acceptance evidence.
- [PRD](PRD.md), [architecture](ARCHITECTURE.md), [frontend integration](FRONTEND_INTEGRATION.md) and [Mission Control implementation](COMMERCIALKONNECT_MISSION_CONTROL.md).
- [Client Acquisition & Client Brain SOP](CLIENT_ACQUISITION_CLIENT_BRAIN_SOP.md), [Viral Content Engine funnel](VIRAL_CONTENT_ENGINE_ACQUISITION_FUNNEL.md), [Chatwoot integration](CHATWOOT_INTEGRATION.md) and [planned broker routing](PLANNED_SUBSCRIPTION_ROUND_ROBIN_ROUTING.md).

## Changes implemented in this review

| Requirement | Gap found | Change |
| --- | --- | --- |
| Research businesses by segment and territory | Company endpoint only paginated all saved records | Optional literal text, industry, location and recorded financing-need filters; existing workspace scoping retained |
| Trace acquisition content to enquiries | Attribution accepted only basic UTM fields and was omitted from private enquiry reads | Added campaign, creative, hook, asset, variant and Client Brain version labels plus UTM content; return saved attribution on authenticated reads |
| Agent/CLI contract | Specification lacked search and content lineage fields | Regenerated OpenAPI from validation schemas and documented semantics |

No live database changes are required by these additions. They use existing company columns and enquiry attribution JSONB. Search uses parameterized SQL and literal substring matching. For larger databases, benchmark the query before choosing a search index; this change makes no throughput claim.

## Next implementation priorities

| Order | Slice | Acceptance evidence |
| --- | --- | --- |
| 1 | Wire dashboard to persistent companies, jobs and enquiry API | Synthetic enquiry and discovery results survive browser close/reopen; denied cross-workspace reads |
| 2 | Verify actual Windows CLI contract and run one worker job | Real allowlisted command and JSON mapping; timeout, retry and source provenance checked |
| 3 | Consent withdrawal and contact suppression | Audited scope-specific withdrawal blocks future sharing/contact; downstream sync retries tested |
| 4 | Chatwoot conversation linkage and response events | Canonical enquiry reference, provider authentication, deduplication, minimal field transfer and response timestamps; general chat remains distinct from a funding request |
| 5 | Persistent content drafts with evidence and approved Client Brain version | Generated draft saves/reopens with source lineage and human review; explicit publication state |
| 6 | Atomic CRM handoff and broker acceptance/outcome events | Verified CRM contract, idempotent outbox/retries and separate accepted/booked/attended/funded states; no referral without recorded permission |

The new attribution identifiers are untrusted labels, not foreign keys or authorization claims. Reporting should validate links to actual tenant-owned campaigns before claiming revenue attribution. Existing idempotency protects request retries; it does not identify the same borrower submitting another request with a new key. Semantic duplicate handling needs a separate, privacy-aware design.

No Chatwoot connection, Atomic CRM sync, broker distribution, automatic publishing or live CLI integration is implemented by this review. Keep those status claims separate from the working local API additions.
