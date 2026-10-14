# Product requirements — KonstructionComOS

## Customer promise
Turn early-stage construction activity into qualified B2B relationships and financing opportunities. First market: British Columbia; expansion to Canadian provinces and, using appropriately licensed US data, the US.

## Primary buyers
1. Commercial mortgage and development finance brokers
2. General contractors and specialist subcontractors
3. Developers and land acquisition teams
4. Architects and engineering firms
5. Private lenders, debt funds and capital advisors

## MVP scope
**P0:** Clerk-based organization onboarding; Supabase tenant isolation; BC project registry; source/provenance records; manual and CSV ingestion; stakeholder relationships; search/filter/score; financing pipeline stages; interaction history; audit trail; admin roles.

**P1:** Scheduled provincial/municipal permit ingest, entity deduplication, enrichment via contracted providers, project alerting, saved lists, export and Stripe billing.

**P2:** AI briefings, geospatial opportunity heatmap, automated source change detection, lender fit and compliant outbound orchestration.

## Success metrics
Activation = user saves 5 verified projects and creates 1 opportunity in first 7 days. Track verified project freshness, stakeholder match precision, demo-to-paid conversion, qualified meetings per 100 reviewed projects, monthly active teams, churn, data acquisition cost and outbound compliance incidents.

## Non-goals
No automated credit approval, guarantee of funding, scraping behind access controls, or non-consensual mass marketing. Scores support prioritization and must not be presented as predictive guarantees.

## Definition of done for MVP
A signed-in member accesses only their organization's records; imports BC projects with source metadata; creates stakeholders and opportunities; filters priorities; and exports a compliant project briefing. Automated CI verifies isolation tests and typecheck.
