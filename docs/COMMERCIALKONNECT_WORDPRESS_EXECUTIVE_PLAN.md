# CommercialKonnect.ca — WordPress Executive Plan (Divi)
**Version:** 1.1 | **Date:** 2026-10-23 | **Status:** Approved direction / implementation blueprint

## Executive summary
CommercialKonnect.ca is a Canadian two-sided commercial and business financing marketplace: (1) business owners and commercial property investors discover financing options and professionals; (2) participating commercial finance brokers identify, attract and convert financing prospects through a self-service growth workspace. Its defensible growth mechanism is a **broker-driven distribution flywheel**, complemented by SEO and paid acquisition.

**Official public-site stack: WordPress + Divi (not Astra) + WP MCP Ultimate + Claude Code.** User owns a Divi license; installation/activation on the Docker WordPress dev site (`http://localhost:8090`) is **not yet confirmed**. The broker app should remain outside WordPress, provisionally `app.commercialkonnect.ca`, using Supabase (system of record), Atomic CRM, and Vercel/Railway.

## Three acquisition engines
1. **Organic:** Financing product/industry/property/geographic guides, professional directory, trustworthy evergreen resources, technical SEO. Visitors submit a financing assessment.
2. **Broker-led outbound:** Brokers select vertical, geography, financing product and campaign; Explee provides its *verified supported* prospect discovery/enrichment/GTM functions, supplemented by LeadSniperAI and approved outreach delivery. Campaigns direct business owners to broker-attributed CommercialKonnect landing pages. Broker promotions increase site exposure; direct visits are campaign/referral traffic, **not automatically organic SEO traffic**.
3. **Paid:** Platform-funded and broker-funded Google/Meta campaigns, potentially operated through **Ryze AI**, subject to validation of API/MCP features, account permissions and multitenancy. Broker and platform budgets and resulting lead ownership remain separate.

## Two buyer journeys
- **Business owner:** Research financing → select category/industry/property → conditional assessment → consent → verification/qualification → eligible professional conversation.
- **Broker:** Register/verify → create profile → select vertical and territory → choose Explee outbound, Ryze paid or both → approve targeting/messaging/budget → launch → review attributed traffic, conversations, appointments and pipeline.

## WordPress responsibilities
- Divi Theme Builder global header/footer and responsive design tokens; reusable templates for financing products, industries, property types, locations, broker profiles and campaign landing pages.
- Public IA: **Home | Financing Solutions | Industries | Commercial Properties | Find a Broker | For Brokers**; clear borrower assessment CTA and broker demo/login CTA.
- SEO publishing via Claude Code + WP MCP Ultimate where supported; **verify Divi-specific field/template automation on one draft test before mass creation**. WordPress is not the lead database, ad engine or CRM.
- For structured directory records, plan custom post types/taxonomies and verify support through WordPress REST/MCP or custom integration; don't assume WP MCP Ultimate exposes every Divi field.
- Use redirects/canonicals, schema where appropriate, analytics, accessibility and page performance targets; no thin or duplicated local landing pages.

## Initial content architecture (50 planned pages + legal)
| Section | Count |
|---|---:|
| Home | 1 |
| Financing products | 12 |
| Industry financing | 10 |
| Commercial property types | 10 |
| BC-first geographic pages | 8 |
| Professional directory | 4 |
| Broker solutions | 3 |
| Financing assessment | 1 |
| About / How it works | 1 |
| **Total** | **50** |

Start with BC, then Alberta and Ontario as coverage, validated keyword demand and broker availability justify expansion. Priority product pages: commercial mortgages/refinancing, construction, equipment, business acquisition, working capital, asset-based lending and bridge financing. Publish pages on demonstrated reader utility, not volume alone. The initial three broker pages can be `/brokers/`, `/brokers/gtm-campaigns/`, and `/brokers/demo/`; prospect intelligence and appointment content can be expanded subsequently.

## Homepage blocks
1. Hero: **Find the Right Financing for Your Business or Commercial Property**; CTAs **Explore Financing Options** and **For Brokers**.
2. Financing solutions cards.
3. How assessment/matching works; avoid approval guarantees.
4. Industry and commercial property guides.
5. Verified financing professional directory.
6. Broker value proposition: **Find more relevant business-owner conversations** via GTM, paid acquisition, prospect intelligence and Chief of Staff.
7. Trust, regulatory/financial disclosures, educational resources, FAQ.
8. Financing assessment and footer.

## Lead and attribution model
- Supabase holds canonical prospect, organization, campaign, visit attribution, assessment, consent, assignment, buyer, appointment, suppression and lifecycle records.
- Unique broker ID + campaign ID + channel/UTM parameters and landing page ID. Use server-side records and clear identity resolution/deduplication.
- **Broker-generated:** default exclusive attribution/assignment to originating broker, subject to contract, consent and regulatory rules; do not silently resell.
- **Platform organic/paid:** eligible marketplace distribution and transparent exclusive/shared terms.
- **Partner referral:** separate origin and agreed referral rules.
- Don't conflate ownership/contractual routing with data subject consent and privacy rights.

## Broker campaign marketplace (separate app)
MVP configuration: vertical → geography → financing product → outreach channel → approved creative/template → budget/usage limit → launch → performance. Explee outbound and Ryze paid are adapters behind shared campaign interface; avoid pretending unverified APIs can perform writes or multitenant account orchestration. Include prospect intelligence cards, financing triggers, Chief of Staff suggestions, campaign review/approval, billing and analytics as staged modules.

## Broker-powered flywheel
More verified brokers → more self-service campaigns and promotion → more attributed business visitors → more qualified financing conversations → stronger broker retention/referrals. Aggregate anonymized demand insights guide useful content and paid campaign testing; SEO uplift must be measured through actual organic performance, not assumed from outreach visits.

## Security and compliance
CASL outreach eligibility, identification and unsubscribe requirements; PIPEDA/BC and other applicable privacy obligations; permissions for lead distribution and retargeting; broker licensing/credential verification; financial promotion review and no unsupported approval/rate claims. Role-based tenant isolation; audit campaign launches, spending changes, lead exports and reassignment; keep API credentials out of WordPress content and GitHub.

## Delivery sequence & acceptance criteria
**P0 — Divi foundation:** install/activate licensed Divi on local WP; build global design system, navigation, responsive header/footer; test Claude Code + WP MCP Ultimate draft page and Divi template compatibility.
**P1 — Directory & lead capture:** homepage, priority product/industry/property templates, legal pages, financing assessment → Supabase; attribution, dedupe and consent persisted. Demonstrate end-to-end test.
**P2 — Broker-led GTM:** broker verification/profiles, attributed landing page, campaign wizard, Explee proof-of-capability, compliance review and opportunity dashboard. Demonstrate an actual broker-attributed test.
**P3 — Paid acquisition:** validate Ryze account connection and API/MCP controls, consent-safe tracking, approved budgets, platform vs broker funding, attribution and cost/contribution reporting. Launch only after guardrails.
**P4 — Scale:** expand 50-page roadmap by validated demand; Chief of Staff, buyer marketplace, qualified appointment routing, billing, SEO iteration, conversion experiments.

## Metrics
**North star:** qualified financing conversations per active broker per month.
Supporting: active brokers, campaign activation, organic traffic, campaign-attributed visits, assessment conversion, verified lead rate, appointment rate, cost per qualified conversation, broker retention, per-channel contribution margin.

## Decisions recorded
- **Divi is the chosen WordPress builder; replace prior Astra references.**
- **Self-service broker campaigns are an MVP goal**, not managed-only. Managed GTM is an optional service.
- Both **Explee outbound** and **Ryze paid acquisition** are planned integrations; their precise abilities and tenant/account boundaries require validation.
- **Supabase remains primary records; WordPress remains acquisition/content frontend.**
- Work on the existing local Docker environment first, before production deployment.

---

> **Provenance:** Imported verbatim 2026-10-23 from `github.com/Ksdeng1559/KonstructionComOS/blob/main/docs/COMMERCIALKONNECT_WORDPRESS_EXECUTIVE_PLAN.md`. Kept unmodified for reference. Superseded for implementation by `COMMERCIALKONNECT_FINANCING_DIRECTORY_PLAN.md`.
