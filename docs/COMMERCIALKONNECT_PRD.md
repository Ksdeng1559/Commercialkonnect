# CommercialKonnect — Public Website & Broker Growth PRD
**Version 2.0 | 2026-10-24 | Status: implementation specification**

> This PRD covers CommercialKonnect's financing directory, broker GTM growth application and shared acquisition/lead infrastructure. The legacy construction-intelligence product requirements remain in `docs/PRD.md` and are not superseded for that product. Executive context: `docs/COMMERCIALKONNECT_WORDPRESS_EXECUTIVE_PLAN.md` (its earlier Divi selection is superseded here).

## 1. Product objective
CommercialKonnect.ca connects Canadian business owners and commercial property investors with verified financing professionals, while enabling brokers to acquire prospects through three engines: (1) organic financing-directory SEO, (2) broker-led vertical outbound GTM using supported Explee capabilities, and (3) platform- or broker-funded paid acquisition using supported Ryze capabilities. Broker promotion drives attributable site traffic and may indirectly inform SEO; campaign visits must never be counted as organic traffic.

**North star:** qualified financing conversations per active broker per month.

## 2. Approved architecture
- **Public CMS:** WordPress + **Astra Free** + native **Gutenberg** editor. This supersedes the prior Divi decision because standard WordPress content/block structures are more straightforward to automate through WP MCP Ultimate. Divi license remains available but is not required.
- **WordPress automation:** Claude Code + WP MCP Ultimate for documented WP actions; no assumption that MCP can edit arbitrary custom fields or build React apps.
- **Interactive public components:** React + shadcn/ui (with scoped Tailwind CSS) packaged as a **custom WordPress Gutenberg block plugin**, `commercialkonnect-components`. Prefer server-rendered/semantic HTML for indexable directory content. React is for interactions, not a replacement for the public CMS.
- **Broker portal:** separate Next.js + React + shadcn/ui application, provisionally `app.commercialkonnect.ca`, deployed via Vercel/Railway. Reuse shared schemas/design tokens and pure UI components where compatible; avoid importing WordPress runtime dependencies into the portal.
- **System of record:** Supabase PostgreSQL with row-level security, tenant separation and consent/attribution audit.
- **Pipeline:** Atomic CRM integration, with explicit sync mapping and error handling.
- **Campaign adapters:** Explee for validated outbound/prospecting functions; Ryze for validated paid advertising functions. API/MCP availability, permissions, rate limits, tenant boundaries and write operations must be proven in a spike before promising launch.
- **Identity:** broker organization authentication and roles, e.g. Clerk if retained from existing app architecture; validate integration before implementation.

## 3. User roles and journeys
**Borrower:** search financing → view product/industry/property/location pages → use assessment wizard → review privacy/consent → submit → receive appropriate next step.
**Broker:** verify identity/credentials → publish profile → choose industry/region/product → configure outbound and/or paid campaign → review compliant audience and creative → approve → send traffic to attributed landing page → manage opportunities and appointments.
**Admin:** approve profiles and claims; manage lead marketplace, campaigns, costs, suppression and compliance.

## 4. Public information architecture
Home; Financing Solutions; Industries; Commercial Properties; Find a Broker; For Brokers; Financing Assessment; educational resources; legal/trust pages.

**50-page initial roadmap:** 1 homepage, 12 financing products, 10 industries, 10 property types, 8 BC-first geographic pages, 4 professional directory pages, 3 broker pages, 1 assessment, 1 about/how-it-works. Legal pages additional. Expand AB/ON based on keyword demand and verified coverage. Avoid near-duplicate location doorway pages.

## 5. Gutenberg React component backlog
| Component | Technology | Priority | Acceptance criteria |
|---|---|---|---|
| Financing Assessment Wizard | React/shadcn Gutenberg block | P0 | Conditional fields by financing type, accessible keyboard flow, validation, explicit consent, attribution preservation, secure API submission, duplicate protection, success/error states |
| Financing Product CTA | Native Gutenberg block/pattern | P0 | Reusable on all templates, attribution preserved |
| Directory Search & Filters | React Gutenberg block | P1 | Filter financing products and verified brokers; meaningful server-rendered results, URL query state, empty states |
| Broker Profile Card | Gutenberg/React where interactive | P1 | Verified status, specialty, geography, transparent featured disclosure |
| Financing Comparison | React block | P1 | Clear qualification caveats, sourced claims, no implied approval |
| Commercial Mortgage Calculator | React block | P1 | Transparent assumptions, accessible output, not financial advice |
| Campaign Attribution Widget | React or native block | P1 | Secure broker/campaign token, no client-controlled ownership changes |

**Technical contract:** register blocks via `block.json`; compile JS/CSS with WordPress tooling; use WordPress REST endpoints for public content and a protected backend API for lead submissions; nonce is not authorization; rate limit and bot-protect public submissions. Never embed Supabase service-role keys or provider API secrets in browser JS. Scope Tailwind styles to avoid theme/editor conflicts. Test theme and editor compatibility, accessibility, responsive layouts and Core Web Vitals.

## 6. Financing assessment P0
Inputs: financing purpose/product, requested amount, business/property context, region, timeline, contact details, separate privacy and communication/lead-sharing permissions as legally required. Persist source/medium/campaign/content, broker ID, landing-page ID, consent version/time and form version. Use server-side validation, idempotency, dedupe and audit trail. Display no guaranteed approvals or unverified rates. Conditional questions may be staged.

**Lead routing:** broker-generated inquiries default to originating broker, subject to consent/contract; platform-generated inquiries enter marketplace eligibility rules; referrals have distinct origin. Record assignment and reassignments. Consent/data subject rights are separate from commercial attribution.

## 7. Broker campaign marketplace P0/P1
Workflow: select vertical → geography → financing product → channel (Explee outbound / Ryze paid / both) → template and landing page → audience/budget review → approval → launch → performance. P0 includes broker profile, campaign draft/approval, broker-attributed landing page and a tested Explee discovery workflow; P1 includes Ryze integration, paid budgets, conversions and cross-channel analytics. Managed service remains optional; self-service is the target experience.

**Controls:** compliant outreach eligibility, suppression/unsubscribe, no automatic emailing merely because a contact is publicly listed; ad account permissions, spend ceilings and approval gates. Display only verified capabilities from vendor integrations.

## 8. SEO and content operations
Astra/Gutenberg templates and patterns for financing products, industries, property types, locations and broker profiles. Claude Code drafts content using verified evidence and sources; WP MCP Ultimate creates/updates supported WP pages. Verify custom post type/SEO metadata support before automation. Use semantic markup, canonical URLs, internal links, page speed monitoring, accessibility and editorial review. Campaign data may suggest new content topics; organic search performance measured separately.

## 9. Data model (Supabase)
Minimum entities: `organizations`, `users`, `broker_profiles`, `financing_products`, `campaigns`, `campaign_channels`, `landing_pages`, `prospects`, `assessments`, `consent_events`, `lead_attribution`, `lead_assignments`, `appointments`, `outreach_suppression`, `campaign_spend`, `billing_events`, `audit_events`. Enforce organization-level RLS; ensure secure, auditable ingestion and CRM synchronization. WordPress public pages are not the canonical lead database.

## 10. Non-functional and compliance
CASL, applicable Canadian privacy laws, provincial mortgage/financial marketing and licensing requirements, accessible forms (WCAG 2.2 AA target), responsive mobile UX, server-side input validation, secrets management, least privilege, tenant isolation, backup/restore and observability. Advertising retargeting and analytics must honor appropriate consent and avoid exposing sensitive financing data to ad networks. Verify broker licenses and clearly distinguish paid placements.

## 11. Delivery phases
**P0A — foundation:** install Astra Free; set Gutenberg patterns, design tokens, header/footer; confirm local Docker WP and WP MCP Ultimate; test automated creation/update of a draft page.
**P0B — conversion:** ship `commercialkonnect-components` plugin and Financing Assessment Wizard; connect secure API to Supabase; verify consent, attribution, dedupe and routing.
**P0C — distribution:** publish core directory pages and broker pages; verified profiles, campaign-attributed landing pages and Explee capability spike.
**P1 — broker growth:** Next.js broker portal, self-service campaign drafts, prospect intelligence, approval, CRM pipeline; Ryze paid campaign spike and spend safeguards.
**P2 — scale:** advanced directory filters, comparison/calculators, Chief of Staff, appointment/billing, full 50-page SEO rollout, testing and optimization.

## 12. Acceptance / definition of done
1. Claude Code via WP MCP Ultimate can create/update a standard Gutenberg page without corrupting its layout.
2. A React Gutenberg block renders in Astra on mobile and desktop and is editable/inserter-visible.
3. A financing assessment saves validated data and separate consent evidence to Supabase through a secure endpoint, preserving channel and broker attribution.
4. Broker-generated submissions cannot be reassigned to another buyer without an authorized audited process.
5. Tenant RLS prevents cross-broker access; secrets remain server-side.
6. A broker can create and approve an attributed vertical campaign draft and view associated qualified conversations; live Explee/Ryze execution only after validated integrations.
7. Analytics report organic, outbound, and paid separately, plus qualified conversations, appointments, cost and contribution margin.

## 13. KPIs
Organic traffic; attributed campaign visits; paid spend; cost per verified/qualified conversation; assessment completion; verification and broker acceptance; appointments; broker activation and retention; revenue per broker; contribution margin; consent/compliance incidents.

## 14. Explicit decisions and open validation
**Decision:** Astra Free + Gutenberg for public SEO pages; React/shadcn custom Gutenberg blocks for interactive tools; Next.js/shadcn for broker app. This replaces Divi in the executive plan.
**Validation:** Explee and Ryze external write APIs, multi-tenant account model, WP MCP Ultimate custom field/block support, Clerk identity integration, Atomic CRM sync contract, legal review of Canadian outreach/lead-sharing and advertising.


## 15. Component PRD — Business Financing Rate Comparison Guide (P0)
**Component ID:** CK-RATE-001. **Public label:** Compare Business Financing Rates & Options in Canada. **Owner:** Public acquisition/conversion. **Status:** Approved for implementation planning; no lender rates published until verified.

### Problem and outcome
Business owners search for rates but commercial finance pricing is not consistently comparable across term loans, LOCs, mortgages, equipment finance, ABL, factoring, construction finance, government-backed products and merchant cash advances. Provide transparent pricing education and a structured route to a suitable broker, without implying guaranteed lender quotes.

**Success:** visitors understand available financing categories and costs, then start a qualified assessment. Track organic landings, guide engagement, product-filter usage, comparison-to-assessment CTR, completed assessments, broker-accepted conversations, and freshness of displayed rate data.

### P0 user experience
1. Indexable landing page `/business-loan-rates-canada/` with editorial explanations, publication/update dates, pricing caveats and methodology.
2. React + shadcn/ui Gutenberg block `commercialkonnect/rate-comparison` with accessible controls: purpose, requested amount, province, business age, annual revenue band, collateral availability and optional property type.
3. Show eligible **product categories**, not purported personalized lender approvals. Each result has product type, pricing basis (APR/annual interest, benchmark + spread, factor, discount fee or quote required), fees, repayment cadence, eligibility considerations, verified date and source. Do not sort unlike pricing types by a single nominal number.
4. Contextual CTA **Check Eligibility / Request a Financing Comparison** launches the existing assessment wizard, carrying product selections and trusted campaign attribution.
5. Where no current verified rate exists, display **Custom quote required**. No fabricated rate bands, guaranteed approvals, or lender logos without authorization.
6. Mobile-first, keyboard navigable, screen-reader labels, useful empty/loading/error states; preserve usable content if JavaScript fails.

### P0 data and editorial contract
Supabase tables or equivalent: `lenders` (internal/public visibility controls), `financing_product_offers`, `rate_observations`, `rate_sources`, `rate_review_events`, `comparison_events`. Key fields: product category, jurisdiction, amount/term bounds, rate value/range **only when documented**, rate unit and structure, benchmark, spread, effective date, expiration/review due, fees, assumptions, eligibility, source URL/document reference, verification status, last verified, publication permission, reviewer and audit timestamps. A public offer must have source, reviewed status and applicable conditions. Hide stale or withdrawn observations pending re-verification. Keep non-public lender identity concealed unless authorized for publication; clearly mark sponsored listings.

### P0 technical design
- Implement in `commercialkonnect-components` using Gutenberg `block.json`, React and scoped shadcn/Tailwind styling.
- Render indexable educational copy and comparison methodology in native WordPress/Gutenberg or server-rendered HTML; hydrate interactive filters progressively.
- Read rate/product data from a **public, sanitized, cacheable API**; never expose Supabase privileged credentials, internal lender terms or broker-only data.
- Apply product suitability filters with documented deterministic rules; do not claim credit underwriting or personalized approvals.
- Use secure cross-component state handoff to the assessment wizard; server validates attribution and broker ownership.
- Provide admin rate-entry/review process with explicit publish approval, source traceability and scheduled freshness checks. Automated scraping alone never authorizes publication.

### P0 acceptance tests
- With no verified rate, the UI displays “Custom quote required,” never an invented estimate.
- Unlike pricing structures are labeled and not directly ranked as equivalent APR.
- An expired/withdrawn rate is excluded from public results; updated rate shows source, assumptions and verified date.
- A visitor can filter products and launch an assessment without losing financing context or validated campaign attribution.
- The guide is usable on mobile, keyboard accessible and does not block indexation of core explanatory text.
- Public API cannot disclose private lender records, service-role secrets or other brokers' data.
- Editorial reviewer can approve, reject and audit an offer before publication.

### P1 extensions
Verified lender-specific comparison where contracts permit; total borrowing-cost/payment calculator with disclosed assumptions; product-specific SEO guides (`/commercial-mortgage-rates-canada/`, `/business-line-of-credit-rates/`, `/equipment-financing-rates/`, `/construction-financing-rates/`); rate change history; benchmark reference feeds; admin alerts; opt-in saved comparisons. Do not present fee/factor products as APR without a sound, disclosed calculation methodology.

### Compliance and boundaries
Canadian financial advertising, mortgage brokerage licensing, provincial requirements, privacy/CASL, consent for referral/marketing and sponsored placement disclosures require review. Display an educational-information disclaimer, not a promise of funding. Rate feeds are **not assumed available**: lender/API agreements, rate usage rights and update cadence are dependencies to validate.

### Build order
**Sprint 1:** Gutenberg page + static, source-reviewed category comparison and CTA (works before live rate feeds). **Sprint 2:** React filtering block, sanitized API, Supabase rate schema and reviewer workflow. **Sprint 3:** Assessment handoff, attribution analytics, QA and first validated rate observations. **Later:** calculators and lender-specific live comparisons.
