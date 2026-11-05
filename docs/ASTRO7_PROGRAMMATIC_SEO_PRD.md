# Astro 7 + Programmatic SEO — Child PRD
**Parent:** [CommercialKonnect Public Website & Broker Growth PRD](./COMMERCIALKONNECT_PRD.md)  
**Version:** 1.0 | **Date:** 2026-11-05 | **Status:** Proposed architecture; implementation pending  
**Domain:** https://commercialkonnect.ca  
**Business objective:** One authoritative domain → differentiated city × niche × financing-intent pages → qualified leads → compliant partner referral.

> **Architecture change proposal:** The parent PRD currently specifies WordPress/Astra/Gutenberg for the public site, and this repository currently contains a **Next.js 15** application. This document proposes **Astro 7 + Sanity** for the *public acquisition/SEO website*, while retaining the separate authenticated Next.js broker application, existing Supabase system of record, and CRM integrations. No migration, release, or production integration is claimed. Resolve the parent PRD architecture decision and migration plan before implementation.

## 1. Goals and non-goals
**Goals:** technical scalability to 1,000+ URL records; publish only demand-validated useful pages; increase qualified financing conversations; preserve privacy, source attribution, and partner routing; make public information accessible to conventional search and AI search retrieval.

**Non-goals:** automatic publication of every Cartesian city/niche/product combination; fictitious Google Business Profiles, physical offices, or reviews; doorway pages; guaranteed search rankings, AI citations, lending approvals, or lead revenue.

**North star:** qualified financing conversations attributable to organic landing-page clusters. Track partner-accepted leads and gross margin separately.

## 2. Architecture and ownership
| Layer | Proposed ownership |
|---|---|
| Keyword discovery, clustering, SERP/intent research | **OpenSEO research agent / MCP** (verify supported interfaces and metrics in integration spike) |
| Local and industry evidence, drafts, buyer-intent briefs | **Harvey** |
| Commercial fit and lead enrichment | **LeadSniperAI** |
| Editorial source of truth, human approvals | **Sanity** |
| Public SSR/static marketing pages | **Astro 7**, default static HTML, deployed to Vercel |
| SEO validation and AI search accessibility | Automated technical checks + editorial gate |
| Leads, consent, URL registry, metrics, assignments | **Supabase PostgreSQL**, with RLS and auditable events |
| Partner portal and authenticated workflow | Existing **Next.js** app (separate deployment/application boundary) |
| Lead workflow and CRM | Atomic CRM integration; ICM stage orchestration |
| Transactional email / SMS / messaging | Resend / Twilio / Unipile, subject to access and consent |
| Billing | Separate evaluated adapter; do not assume Billr production integration |

**Explicitly excluded:** Convex. WordPress/Gutenberg are not required for the proposed Astro public site, but existing WordPress work must be inventoried before being replaced. Maintain domain routing, legacy redirects, attribution, and business continuity.

## 3. Information architecture: one domain, many validated pages
Canonical examples (routes are proposals, not asserted live URLs):

```text
/financing/business-line-of-credit/
/financing/equipment-financing/
/industries/construction/
/industries/retail/
/locations/bc/surrey/
/bc/surrey/construction-financing/
/bc/vancouver/retail-working-capital/
/guides/contractor-cash-flow/
/partners/
/apply/
```

**Primary expansion key:** municipality + industry + financing product + distinct search intent. Create a dedicated location page only when intent and useful localized evidence merit a distinct result. One primary query cluster maps to one canonical page; multiple synonymous terms should usually share a page.

**MVP:** Vancouver, Surrey, Burnaby, Richmond, Langley; construction, retail, manufacturing; business lines of credit and equipment financing. Research 30 theoretical combinations and approve **10–15** genuinely differentiated local pages plus useful product/industry hubs. Expansion targets (50, 100, 1,000) are capacity milestones, never publication quotas.

## 4. OpenSEO keyword-cluster research agent (P0)
**Inputs:** seed niches, finance products, locations, locale (en-CA), existing canonical URLs, competitor sites, Search Console pages/queries where authorized.

**Responsibilities:**
1. Discover relevant commercial and informational terms.
2. Group keywords by search intent and SERP similarity; distinguish national, industry, and city-local intent.
3. Capture source, retrieval date, estimated volume, competition/difficulty, CPC, and observed SERP data **only where supplied by a verified provider**; mark unknown values null.
4. Map each cluster to an existing canonical page or proposed new page; identify cannibalization.
5. Prioritize based on commercial fit, actual demand evidence, ranking feasibility, partner coverage, and potential for substantive differentiated content.
6. Produce machine-readable cluster briefs to Harvey and the editorial queue.
7. Revisit cluster performance based on GSC and conversion data.

**Proposed scoring weights (editable hypotheses):** 25% commercial intent; 20% search demand; 20% ranking opportunity; 15% industry/product fit; 10% partner supply; 10% content evidence. Do not interpret weighted output as a predicted probability.

**Minimal cluster contract:**
```json
{
  "cluster_id": "uuid",
  "primary_keyword": "construction financing surrey",
  "secondary_keywords": ["contractor working capital surrey"],
  "intent": "commercial",
  "locale": "en-CA",
  "city_id": "uuid",
  "industry_id": "uuid",
  "product_id": "uuid",
  "metrics": {"volume": null, "difficulty": null, "cpc": null},
  "source": "openseo",
  "researched_at": "ISO-8601",
  "canonical_target": "/bc/surrey/construction-financing/",
  "decision": "propose"
}
```

**OpenSEO adapter requirement:** Confirm exact MCP tool names, response shapes, auth, quotas, and terms of use before coding. Transform supported outputs into versioned, source-attributed internal records. Never assume a particular API is exposed.

## 5. ICM publication and acquisition pipeline
1. **Discover:** OpenSEO proposes clusters, keywords, and SERP findings.
2. **Evaluate:** score opportunity, partner coverage, and existing page overlap.
3. **Evidence:** Harvey researches claims and industry/location differences with source provenance.
4. **Draft:** construct editorial brief and Sanity content.
5. **Review:** human verifies accuracy, originality, disclosures, content usefulness, and compliance.
6. **Validate:** technical SEO + AI retrieval gate (section 6).
7. **Publish:** approved Sanity record builds an Astro route, sitemap entry, and relevant navigation links.
8. **Capture:** server-side lead form collects minimum needed data with notices and consent records.
9. **Qualify/route:** LeadSniperAI and CRM match permitted opportunities to verified partners.
10. **Measure/iterate:** GSC, Bing Webmaster Tools, qualified leads, assignments, partner acceptances, and revenue inform consolidation and expansion.

All stages require inputs, outputs, timestamps, errors, reviewer checkpoints, retries, and idempotency keys.

## 6. Technical SEO + AI search discovery (release-blocking where applicable)
**For every indexable public page:**
- Server-rendered/compiled HTML with primary text visible without client JavaScript.
- HTTP 200, responsive/mobile-accessible layout; target Core Web Vitals Good at p75.
- Unique title, human-useful description, one primary H1, semantic headings, accessible images.
- Self-referencing canonical using production HTTPS domain; normalized trailing-slash policy.
- No accidental `noindex`, conflicting canonical, or crawler firewall block.
- Correct hreflang only if alternate-language/regional variants actually exist.
- Valid JSON-LD such as `Organization`, `BreadcrumbList`, `Article`, or appropriate `Service` when true of visible content; avoid unsupported `FinancialService` or lender claims.
- XML sitemap containing **only** approved canonical indexable pages; accurate last-modified values based on substantive updates.
- Internal navigation via financing, city, niche, and guide hubs; no orphan/doorway location pages.
- Correct redirects for URL migrations, no redirect chains or duplicate slug conflicts.
- Content addressing questions and limitations factually with evidence, authorship/review context, and update date as appropriate.
- No fabricated local offices/reviews or automated page proliferation.

**AI search visibility:** Maintain public readable HTML and clear organization/product/entity information; permit intended retrieval crawlers in `robots.txt` and verify Vercel/WAF response behavior. Review current official crawler docs during deployment for `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `Claude-User`, and ordinary search crawlers. Training bots such as `GPTBot`/`ClaudeBot` may be independently disallowed if desired. Crawler access is not a guarantee of citation.

**`/llms.txt` (P1):** Generate a compact, curated Markdown directory pointing to approved canonical financing, industry, locality, guide, and partner pages; never list drafts or unlaunched URLs. Optional `/llms-full.txt` and Markdown versions for substantial evergreen guides. **Treat `llms.txt` as an optional, emerging convention, not a ranking/indexing requirement or a guarantee of ChatGPT/Claude discovery.** Conventional crawlability, site authority, content usefulness, and evidence are more important.

**Build checks (P0):** fail on missing canonical, invalid sitemap URL, duplicate canonical assignment, broken critical internal link, malformed metadata/JSON-LD, draft accidentally exposed, private data in bundles, forbidden crawl headers, or unapproved publication.

## 7. Astro implementation contract
Suggested files for a *future separate public Astro app* (do not overwrite the current Next.js app without migration approval):

```text
apps/public-web/
  astro.config.mjs
  src/layouts/SeoLayout.astro
  src/pages/[province]/[city]/[service].astro
  src/pages/financing/[slug].astro
  src/pages/industries/[slug].astro
  src/pages/llms.txt.ts
  src/lib/content/approved-pages.ts
  src/lib/seo/metadata.ts
  src/lib/seo/schema.ts
  src/lib/seo/canonical.ts
  src/lib/lead-intake/client.ts
  public/robots.txt
```

Choose Astro static pre-rendering for editorial pages; provide secure server endpoints for forms and authentication only where necessary. Sanity content builds must use approved records; `getStaticPaths()` must not enumerate unapproved combinations. Astro and dependency versions must be checked at implementation time.

## 8. Data model (proposed, no migration applied)
- `seo_keyword_clusters`: cluster ID, primary term, intent, geo/vertical/product foreign keys, canonical target, status, evidence.
- `seo_keywords`: term, cluster, locale, provider metrics (nullable), source timestamp.
- `seo_serp_observations`: observed result and retrieval time.
- `seo_cluster_page_map`: cluster-to-approved-page ownership, decision and reviewer.
- `seo_pages`: canonical URL, Sanity document ID, page type, publication state, review timestamps.
- `seo_page_checks`: technical validation run and failures.
- `page_metrics_daily`: page/cluster/traffic source metrics.
- `lead_submissions`, `lead_consent_events`, `lead_attribution`: secure intake audit.
- `lead_assignments`, `partner_coverage`, `billing_events`: authorized distribution and monetization.
- `icm_workflow_runs`: checkpoints, tool evidence, approvals, retries.

Use UUID primary keys, uniqueness for active canonical ownership, immutable audit events, sensitive-field protection, RLS for partner data, and migration tests. Reconcile existing tables before introducing new schemas; do not run destructive operations against production.

## 9. Lead capture and compliance
Use a server-validated, rate-limited submission API with bot protection, deduplication, idempotency, source page/UTM capture, and versioned privacy disclosures. Capture separate authorizations where required for partner sharing and marketing. Never expose Supabase service role keys in Astro/browser code. Distinguish originating broker-assigned leads from marketplace leads. Apply Canadian privacy, CASL, and financial referral/licensing reviews before commercialization.

## 10. Metrics and success thresholds
- Pages researched → approved → published → indexed.
- Unique clusters mapped; duplicate/overlap incidents.
- Organic impressions/clicks, Bing visibility, Core Web Vitals.
- AI assistant referrals/citations **only where attributable/observable**, not inferred from generic crawler requests.
- Landing-page conversion, unique leads, qualified rate, appointment rate, partner acceptance, response SLA.
- Revenue and contribution margin by canonical page, cluster, city, niche, and product.
- P0 target: 100% lead source/page attribution when available; zero unapproved auto-publications; zero exposed private leads.
- Do not set traffic, lead or revenue forecasts without measured baseline.

## 11. Phased delivery
**P0 — decision + spike:** approve Astro public-web supersession of WordPress, assess existing public URLs/redirects, test Sanity and OpenSEO MCP contract, confirm Vercel setup, resolve authenticated-app boundary.

**P1 — MVP:** schema and cluster mapping; 10–15 reviewed city/niche pages and core hubs; static HTML, SEO and AI crawler checks, curated `llms.txt`; secure intake; CRM routing; attribution.

**P2 — learn:** monitor index coverage and qualified-lead performance, improve content, eliminate cannibalization, add guide/calculator assets.

**P3 — scale:** expand to other BC cities, then AB/ON; partner subscriptions and priced referrals only after partner/legal validation.

## 12. Definition of done
A researched OpenSEO cluster produces an approved Harvey brief, approved Sanity content, and an Astro 7 page with passing canonical/structured-data/crawlability/AI discovery checks; a real inquiry can be securely received, attributed, qualified, assigned to an authorized partner, and measured to a recorded business outcome.

## 13. Governing documentation
- [CommercialKonnect master PRD](./COMMERCIALKONNECT_PRD.md)
- [Existing architecture](./ARCHITECTURE.md)
- [Marketplace business model](./CANADIAN_FINANCING_LEAD_MARKETPLACE_BUSINESS_MODEL.md)
- [SEO financing intent research](./SEO_UNSECURED_BUSINESS_CREDIT_VS_REAL_ESTATE_SECURITY.md)

**Decision note:** This child PRD proposes replacing the WordPress public acquisition stack only. It does not replace the existing Next.js broker product or claim that the repo has already migrated to Astro.

## 14. Video, graphics and interactive financing tools (proposed extension; November 2026)

### Purpose and implementation boundary
Extend the public acquisition experience beyond static landing pages while preserving fast, indexable HTML and the secure lead-intake boundary. This is an **implementation specification**, not a statement that these features are deployed. The dedicated public Astro deployment currently uses Astro 6 on a separate working branch; Astro 7 adoption requires compatibility and regression testing. No major-version change is approved by this appendix alone.

### Content blocks and assets
- **Video education:** optional HeyGen or self-hosted explainers for construction cash-flow gaps, business lines of credit, commercial mortgage preparation and equipment financing. Prefer poster-first, click-to-load players; captions/transcripts, disclosure of synthetic speakers where applicable, consent-safe analytics, and accessible controls.
- **Graphics:** use Astro's supported image pipeline for optimized informative graphics; include dimensions, responsive formats and descriptive alternative text. Preserve source/licensing metadata in Sanity. Use lightweight SVG for infographics and diagrams, not rasterized text-only images.
- **Editorial components:** `VideoExplainer.astro`, `FinanceInfographic.astro`, `CalculatorEmbed.astro`, `RelatedFinancingGuides.astro`, `FinancingCTA.astro`. Store content and asset references in approved Sanity records; do not embed unreviewed lender claims.

### First six conversion tools
| Tool / proposed route | Initial inputs | Output (illustrative) | Qualified CTA |
| --- | --- | --- | --- |
| Commercial mortgage calculator /tools/commercial-mortgage-calculator/ | principal, rate, amortization, optional down payment | indicative principal-and-interest payment, cash needed, assumptions | commercial mortgage enquiry |
| Business line-of-credit calculator /tools/business-line-of-credit-calculator/ | credit limit, expected draw, annual rate, usage days | indicative interest cost, utilization | LOC enquiry |
| Construction cash-flow gap calculator /tools/construction-cash-flow-calculator/ | payroll/supplier outflows, invoice receipts and timing | timing gap and peak cash requirement | construction/working capital enquiry |
| Equipment financing calculator /tools/equipment-financing-calculator/ | asset cost, down payment, rate and term | indicative installment estimate | equipment financing enquiry |
| Financing readiness assessment /tools/financing-readiness/ | product, province, operating history, documentation | educational checklist / missing information, **no underwriting approval** | existing application wizard |
| Business acquisition funding estimator /tools/acquisition-funding-calculator/ | purchase price, equity, transaction costs and assumptions | illustrative funding gap | acquisition financing enquiry |

All calculations require explicit assumptions, CAD denominations, financial-methodology notes, visible limitations and validation against edge cases. Never represent a calculation as an approved loan amount, binding offer, lender quote or individualized financial advice.

### Implementation pattern
- **Astro public routes:** static educational content and metadata; interactive widgets load as narrowly scoped client islands using plain TypeScript for simple tools or React only for complex state/charts.
- **Shared model:** versioned `financingProductConfig` defines product labels, intake purposes, indicative enquiry bands, corresponding calculator, landing-page CTA and backend validation. The amount-band definitions must be reconciled with the current `web/src/lib/enquiry.ts`; avoid duplicating home-page slider ranges and wizard logic.
- **Calculation code:** put deterministic pure functions into `src/lib/calculators/` and separately unit-test boundary conditions, rounding, CAD display, zero-rate and out-of-range inputs. Keep lender-specific rates and limits outside generic formulas unless verified and dated.
- **Shared funnel:** `education or video -> calculator -> funding assessment -> contact and consent -> secure enquiry API -> Supabase -> human-reviewed qualification / broker CRM`. Carry `tool_id`, `tool_version`, origin page, UTM parameters and a minimal non-sensitive result summary. Consent for optional remarketing is separate from the enquiry request and partner sharing.
- **Security:** do not persist full questionnaire data in query strings, send personal data to media embeds, expose service-role credentials, or post directly to CRM from a client island. Rate-limit and validate form API server-side. Never show a success state before confirmed persistence.
- **SEO:** each calculator has a readable static explanation, worked example, assumptions, FAQ and clear internal links, not a JavaScript-only empty shell. Appropriate structured data must describe only actual visible features; video markup and thumbnails require accurate metadata.
- **Performance/accessibility:** defer videos, honor reduced motion, keyboard-accessible sliders and form fields, test mobile breakpoints and Core Web Vitals.

### Suggested module layout
```text
web/src/components/media/
  VideoExplainer.astro
  FinanceInfographic.astro
web/src/components/tools/
  CalculatorEmbed.astro
  FinancingCTA.astro
web/src/lib/calculators/
  commercialMortgage.ts
  lineOfCredit.ts
  cashFlowGap.ts
  equipmentFinance.ts
web/src/lib/financing/
  productConfig.ts
web/src/pages/tools/
  commercial-mortgage-calculator.astro
  business-line-of-credit-calculator.astro
  construction-cash-flow-calculator.astro
  equipment-financing-calculator.astro
  financing-readiness.astro
  acquisition-funding-calculator.astro
```

### Staged delivery and acceptance
1. **P0 — stabilize current funnel:** fix product-specific amount alignment between the home-page selector, wizard and server validation; ensure all eight questionnaire stages persist to Supabase; verify consent, attribution and Broker Mission Control handoff in an end-to-end test.
2. **P1 — reusable media:** implement approved poster-first video and optimized graphic blocks, publish one evidence-backed contractor cash-flow explainer.
3. **P1 — first tools:** release the business LOC and commercial mortgage calculators with tested formulas, accessible inputs and contextual application CTAs; measure starts, completions and qualified leads without assuming conversion lift.
4. **P2 — full tool library:** add construction, equipment, readiness and acquisition tools; use approved niche/city SEO pages for distribution.
5. **Astro 7 upgrade gate:** verify current official Astro 7 release, integration compatibility (`@astrojs/vercel`, Sanity, Tailwind, optional React), Node support, build output, accessibility and successful enquiry persistence on preview before changing the existing Astro 6 dependency.

**Definition of done:** An approved page may display an accessible media block and an independently tested interactive tool; an enquiry carries verified product-specific amounts and source attribution through the secure API and database to the CRM, with no fabricated financing quote or unauthorized partner disclosure.
