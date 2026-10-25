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

## 16. Content Creation & Acquisition Engine PRD (SEO + AEO/AIO + Paid) — 2026-10-24
**Module:** CK-CONTENT-001 | **Status:** Approved for staged implementation planning; no content automation, ad platform write integration, ranking or lead volumes are claimed as delivered.

### 16.1 Objective and boundaries
Build an editorially reviewed, measurable borrower-acquisition system that generates **qualified financing conversations** for participating professionals. Preserve the dual origination model:
- **Inbound demand capture:** organic search, AI-answer discovery, paid search, paid social, and permissioned partner referrals → financing assessment → contact/intent verification → buy-box matching → broker-attributed routing or marketplace.
- **Proactive opportunity discovery:** LeadSniperAI and licensed/public business and project signals → evidence-backed intelligence → human confirmation of any financing need → broker prospecting workflow. A public business signal is **not** a financing lead.
Maintain separate acquisition attribution and unit economics for inbound, outbound, paid and referrals. The content module does not supersede existing construction-intelligence, rate-comparison, consent, lead-ownership, or CRM specifications.

### 16.2 Audiences, conversions and content intent
| Audience | Intent | Primary CTA | Handoff |
|---|---|---|---|
| Business owner | Working capital, term loan, LOC, asset-based or equipment finance | Compare financing / check options | Conditional borrower assessment |
| Commercial property owner/investor | Acquisition, refinance, secured financing | Explore commercial mortgage options | Property-specific assessment |
| Developer | Land, servicing, construction/development capital | Discuss development financing | Project-stage assessment |
| Contractor/manufacturer/transport operator | Vertical financing constraints | Compare relevant financing options | Industry-specific assessment |
| Broker/lender/financial professional | Qualified demand, outbound intelligence, GTM services | Book demo / join professionals | Verified broker onboarding |

All external pages must distinguish informational content from firm offers, approval decisions, regulated advice and paid/sponsored placements.

### 16.3 Content taxonomy and initial information architecture
Six **topic clusters** with a canonical pillar, linked supporting guides, FAQs, comparisons, and relevant forms/tools:
1. `/business-financing/`: business loans, business LOC, working capital, secured vs unsecured, bank vs alternative lending.
2. `/commercial-mortgages/`: commercial refinancing, eligibility, property-secured business financing and rates education.
3. `/construction-financing/`: development finance, LTC vs LTV, land acquisition, multifamily and servicing.
4. `/equipment-financing/` and `/asset-based-lending/`: equipment loans/leasing, receivables, factoring and collateral.
5. `/industries/`: construction, manufacturing, transportation, commercial real estate; hospitality and other sectors after observed demand.
6. `/compare-financing/`: financing comparison methodology, calculators and the existing `/business-loan-rates-canada/` component (CK-RATE-001).

Reuse the approved **50-page plan** as the long-term information architecture, not a mandatory immediate publishing quota. BC-first; expand Alberta/Ontario when verified service coverage, useful original content and keyword evidence exist. Avoid duplicate city/province doorway pages; do not mass-generate unreviewed content. Keep the professional-facing `/brokers/` journey separate from borrower paths.

### 16.4 Editorial workflow and requirements
**Pipeline:** opportunity/keyword backlog → search intent & SERP analysis → source research → structured brief → AI-assisted draft → qualified human financial review → compliance/legal check when applicable → staging & technical QA → publish → indexation/performance review → refresh/archive.

Each content brief records: canonical topic/URL, intended reader, intent and conversion target, keyword cluster and evidence of demand, original angle, primary/secondary sources, content owner/reviewer, required disclosures, related pages, schema candidate, planned review date, and status. Each published page includes byline or accountable reviewer, date reviewed, verifiable financing claims, visible assumptions, internal links, accessible CTA and source references as appropriate. Never invent lender rates, approval probabilities, government program conditions, testimonials, provider affiliations or lender availability. Sponsored rankings and conflicts are identified clearly.

**State machine:** `idea → researched → brief_approved → drafted → financial_review → compliance_review (if required) → ready_to_publish → published → monitoring → refresh_due/archived`. Publishing or a change to regulated financial claims requires designated human approval. Provider APIs may assist research and drafting but do not independently validate facts.

### 16.5 SEO and AI answer visibility (AEO/AIO)
- Render substantive pillar/FAQ/comparison copy as indexable semantic WordPress/Gutenberg HTML with descriptive headings, canonical URLs, relevant internal links, XML sitemaps, crawl/index diagnostics, responsive performance and accessible markup.
- Use appropriate validated schema types (e.g., Organization, BreadcrumbList, Article when eligible); structured data must reflect visible content and is not a guarantee of rich results or AI citations.
- Give concise direct answers, explain financing terminology and underwriting limitations, show worked examples/calculator assumptions, and cite authoritative Canadian sources. Verify dates/rates before publication.
- Measure Google Search Console queries, impressions, CTR, indexed pages, landing-page organic sessions and qualified conversions; measure observable AI referrer traffic and a **repeatable, sampled citation/prompt audit** with prompts, locale, date and result capture. Do not claim AI citation counts are comprehensive or guaranteed.
- Maintain an internal link graph and refresh queue for stale rates, expired programs, broken citations and shifting lender terms.

### 16.6 Paid acquisition and landing pages
- Google Search: segmented campaigns for business finance, LOC, equipment, commercial mortgages and construction finance; product/intent-specific landing pages, conversion event testing and negatives; use Keyword Planner to validate volumes and CPCs.
- Meta: educational/problem-based vertical campaigns for contractors, manufacturers, transport and property owners; avoid misleading approvals and prohibited sensitive financial targeting.
- Consent-appropriate retargeting only after legal/platform review. No financing data or application contents are passed to pixels or ad tools.
- Each landing page supports matching headline/ad intent, financing CTA, trust/explanation, relevant disclosures, mobile speed, form friction tests, and safe attribution.
- **P0:** manual ads and offline import of campaign results permitted. **P1:** Ryze adapter only after audited proof of permissions, budget caps, approval workflow, account separation and APIs. Never automatically launch or spend without broker/platform approval.
- Separate broker-funded campaigns from platform-funded acquisition; broker-originated enquiries follow existing contractual assignment rules and consent constraints.

### 16.7 WordPress/content technology contract
**Authoritative current stack is Astra Free + Gutenberg + WP MCP Ultimate;** the earlier Divi executive plan is superseded by section 2 of this PRD. Publishing automation should use supported standard WordPress actions and validate custom types, SEO metadata and Gutenberg blocks in a test draft before scaling. React/shadcn Gutenberg blocks (under `commercialkonnect-components`) power assessment, interactive comparisons and calculators, while native/server-rendered semantic content remains readable without JS. Supabase is the lead and attribution system of record; WordPress holds editorial content, not canonical leads or sensitive borrower applications.

Proposed editorial records (WP metadata/custom post types or Supabase editorial schema after spike): `content_briefs`, `content_sources`, `content_reviews`, `content_links`, `content_refresh_jobs`, `content_experiments`. Persist stable `content_id`, `landing_page_id`, `canonical_url`, `topic_cluster`, `review_status`, `reviewed_at`, `claim_source`, `form_version`, and `attribution_id`. Use restricted audit logs and role approvals, not client-provided attribution ownership.

### 16.8 Conversion, attribution and broker marketplace contract
Carry `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, initial/referring content page, click ID when authorized, and trusted landing page ID through the assessment. Preserve **first known** and **last touch** separately; classify organic search, AI referral, paid search, paid social, partner referral, broker outbound and direct without rebranding campaign traffic as organic. Consented lead data routes via secure APIs into Supabase, validated qualification, CRM and permitted marketplace. A purchase-credit transaction may occur only on a defined, appropriately consented marketplace-eligible record. Keep discovered prospects, verified contacts and intent-confirmed financing leads as distinct states.

Funnel: `content/ad impression → landing session → comparison engagement → assessment start → completed assessment → verified inquiry → qualified lead → broker acceptance → booked/held conversation → application → funded outcome`. Pipeline and revenue metrics must not confuse prepaid credit purchases with recognized fulfilled lead revenue.

### 16.9 90-day delivery and gates
| Window | Scope | Gate/evidence |
|---|---|---|
| Days 1–30 | Technical indexation/analytics baseline; taxonomy and template; first 2 pillar pages; rate comparison/assessment CTA; content brief, financial review and draft-publish test | Source-backed pages published after approval; attribution & consent verified end-to-end |
| Days 31–60 | Core commercial mortgage, construction, equipment and secured/unsecured guides; initial comparison page; Google Search pilot and limited Meta creative tests; weekly AIO sampling | Cost per verified/accepted lead by channel; no leaked personal data or unapproved spending |
| Days 61–90 | Up to ~24 substantial assets total as warranted by quality and team capacity; internal links and refresh monitoring; vertical optimization; broker marketplace attribution and acceptance loop | Evidence of accepted conversations, lead quality, channel contribution margin and repeat broker purchasing |

**Budget hypothesis:** CAD $3,000/month for paid acquisition/creative testing ($1,500 Google Search, $750 Meta, $250 retargeting, $500 creative/experiments) subject to approvals and real cost evidence. Not a performance forecast; content and engineering costs excluded. Start smaller or pause channels if economics/compliance gates fail.

### 16.10 Analytics, optimization and OODA Chief of Staff
**North star remains:** qualified financing conversations per active broker per month. Segment by source, product, industry, province, broker and content cluster.
Supporting metrics: non-branded organic impressions/clicks, pages indexed, organic-to-assessment conversion, AI-referred visits and sampled citations, paid CPC/CPL, verification/acceptance rate, cost per broker-accepted lead, show rate, appointment-to-funded lag, realized revenue per delivered lead, broker repurchase/retention and channel contribution margin. Instrument Google Search Console, privacy-safe web analytics, tagged campaign conversion, CRM status changes and marketplace wallet fulfillment.

Run a weekly **Observe → Orient → Decide → Act** review: identify pages/campaigns with quality demand; analyze sourced conversion/lead acceptance and cost; recommend top-three improvements; require human approval for publication or ad spend changes; audit executed actions and outcomes.

### 16.11 Acceptance criteria
1. Content manager can create, review, stage and publish one Gutenberg financing pillar with source and editorial audit trail using validated WordPress MCP actions.
2. At least one borrower landing page and one product comparison page render indexable, accessible content and hand off to a secure conditional financing assessment.
3. First/last source, content URL, UTM/campaign and broker attribution survive the assessment with correct consent and tenant isolation; server rejects spoofed broker ownership.
4. Broker-owned versus platform-owned lead routing is tested; lead qualification does not equate mere expansion signals to interest-confirmed financing requests.
5. Analytics show separate organic, AI referral, paid, broker outbound and referral conversions, with qualified/accepted leads and conversion cost.
6. Expired financial claims/rates are hidden or flagged for editorial review, and unverified rates render “Custom quote required” where applicable.
7. Unapproved content publishing, ad spend, external outreach, cross-tenant access and sensitive-data transmission to ad platforms are blocked in tests.
8. Review a 30/60/90-day channel performance report and expand only where verified quality, compliance and economics justify investment.

### 16.12 Dependencies and non-goals
Dependencies: existing financing assessment and rate comparison components; approved WordPress integration; verified research/SEO tools (DataForSEO, Exa/Tavily, OpenSEO are candidates, not guaranteed configured); privacy/legal review; broker coverage; genuine account access to Google Search Console and paid media; secure Supabase/Atomic CRM handoff.

Non-goals for this phase: publishing 50 AI-generated pages without review, guaranteed ranking or AI-answer placement, unverified “live” rates, automated underwriting/approval, unconsented mass outreach, direct lender offers without authorization, or automatic ad campaign launches based on unvalidated vendor capabilities.

## 17. Borrower-facing Homepage PRD — 2026-10-24
**Component:** CK-HOME-001 | **Status:** Approved content and UX specification; implementation and publication pending.

### 17.1 Audience, positioning and conversion
The commercialKonnect.ca homepage is **borrower-first**: Canadian business owners, commercial property owners/investors, contractors and developers exploring financing. Financial professionals have a visible secondary path to `/brokers/`. The site educates and enables informed financing comparisons and introductions; it does not guarantee approval, lowest rates, lender participation or personalized quotes.

**Recommended hero:** “Business Financing. More Options. Better Decisions.”
**Support copy:** “Explore business loans, commercial mortgages, construction and equipment financing across Canada. Understand your options and request an introduction to a participating financing professional.”
**Primary CTA:** “Compare Financing Options” → conditional assessment selector.
**Secondary CTA:** “Explore Financing Solutions” → product hub.
**Professional nav/CTA:** “For Financial Professionals” → `/brokers/`.

Trust requirement: claims about partner counts, lead volumes, savings, rates, turnaround or license status cannot appear without documented verification.

### 17.2 Homepage information hierarchy (desktop and mobile)
| Order | Section and recommended headline | Content/UI | Action |
|---|---|---|---|
| 1 | Hero — Business Financing. More Options. Better Decisions. | Plain-language promise; prominent 3-input financing selector (type, amount, province); product strip | Continue to assessment |
| 2 | Find the Right Financing for Your Business | Six cards: Business Loans & Working Capital, Business LOC, Commercial Mortgages, Construction & Development, Equipment, Asset-Based Lending | Individual pillar pages |
| 3 | Compare Your Options in Three Simple Steps | Tell us your needs → explore suitable product categories → request professional introduction | Get Started |
| 4 | More Than One Way to Finance Your Business | Bank, alternative, property-secured, unsecured, equipment/asset-backed options; clarify trade-offs | Secured vs Unsecured |
| 5 | Compare Business Financing Rates & Options | Source-reviewed educational comparison table; method, caveats; link CK-RATE-001 | Compare Business Financing Rates |
| 6 | Financing Solutions for Your Industry | Construction, manufacturing, transportation, commercial real estate; later hospitality/professional services | Industry hub |
| 7 | Commercial Real Estate & Development Financing | Acquisition, refinance, multifamily, industrial, retail/mixed-use, land, construction, bridge | Commercial mortgage and construction assessments |
| 8 | Guides & Resources | Five helpful guides: commercial mortgage rates, secured vs unsecured, borrowing capacity, construction financing, LOC vs term loan | Resources |
| 9 | For Financial Professionals | Qualified inbound leads + proactive opportunity intelligence + Atomic CRM/AI Chief of Staff + credit marketplace, marked planned until live | Broker landing page/demo |
| 10 | Final CTA and disclosure | “Ready to Explore Your Financing Options?”; realistic privacy, matching, licensing and approval caveats | Compare Financing Options |

Recommended header: logo; Financing Solutions; Industries; Commercial Properties; Compare Financing; Resources; For Professionals; primary Compare Financing CTA. Footer: About, Contact, Privacy, Terms, Disclosures and financing category links. Mobile navigation and sticky form CTA must not obscure disclosures.

### 17.3 Hero Financing Selector — P0
Three inputs above the fold:
- **Financing type:** Business loan / Commercial mortgage / Construction & development / Equipment financing / Other.
- **Amount:** Under $50K / $50K–$250K / $250K–$1M / $1M–$5M / $5M+ (amount ranges configurable, not underwriting decisions).
- **Province:** BC / Alberta / Ontario / Other Canadian provinces.

On “Continue”, pass allowed selection data and trusted landing/campaign attribution to the financing assessment wizard in the current PRD. Keep referral/broker identity server-verified. Selector itself does not collect personally identifying or sensitive financial information, perform credit assessment, advertise approval or imply a lender quote. Provide accessible labels, error handling, back navigation and no-JS fallback.

### 17.4 Six financing cards — P0
Each card includes product name, one plain-language benefit, a qualification caveat when needed, and a unique canonical pillar URL. No generic “best rate” promises. Pillar destinations:
`/business-financing/`, `/business-line-of-credit/`, `/commercial-mortgages/`, `/construction-financing/`, `/equipment-financing/`, `/asset-based-lending/`.
Preserve existing URLs via mapping/redirects if a published URL differs; avoid duplicate competing canonicals.

### 17.5 Comparison, resources and AIO — P0/P1
Homepage should link prominently to `/business-loan-rates-canada/` CK-RATE-001 and compare secured/unsecured financing using a **product-category** table (purpose, typical collateral structure, pricing basis, trade-offs), not unverified current rate figures. “Custom quote required” applies where a rate is not verified and publishable. Resource cards link to source-reviewed substantive guides and show real review dates. The homepage targets broad branded and business/commercial finance intent; deeper keyword queries belong on product pillars. Proposed SEO title: “Business Loans & Commercial Mortgage Financing Canada | commercialKonnect”; proposed meta description: “Explore Canadian business loans, commercial mortgages, lines of credit, equipment and construction financing. Compare options and connect with financing professionals.” Validate SERP fit and length before launch. Use Organization/BreadcrumbList markup only when applicable and consistent with visible content. No fabricated FAQs or AI search ranking guarantees.

### 17.6 Financial professional secondary funnel — P0
Keep a compact below-the-fold module: “More Opportunities. Better Intelligence. Stronger Relationships.” Route to broker-facing subscription, inbound qualified leads, proactive opportunity intelligence, and demo pages. Differentiate **confirmed borrower inquiry** from **unverified expansion signal** and label proposed marketplace/Chief-of-Staff features as upcoming until deployed. Do not promote $500/month or lead-credit inventory as live without checkout, terms and available supply. Broker CTA and acquisition tracking remain separate from borrower lead attribution.

### 17.7 WordPress implementation and content model
Use **Astra Free + native Gutenberg + WP MCP Ultimate** as specified in this PRD (not the superseded Divi plan). Prefer reusable Gutenberg patterns for hero, card grids, steps, comparison, guides, broker module and final CTA. The interactive selector is a scoped React/shadcn `commercialkonnect-components` block, with static accessibility fallback. Core page text and comparison methodology must be present in semantic HTML for indexing; do not rely on client-only JS. WordPress hosts public copy and page metadata; conditional assessment submissions and related consent/attribution belong in protected Supabase APIs and Atomic CRM handoff, not public WordPress forms. Ensure mobile responsive layout, performance budgets and WCAG 2.2 AA target.

### 17.8 Measurement and experiments
Measure first/last-touch channel, hero selector engagement, assessment starts/completions, verified and broker-accepted leads, appointments, per-product and per-province conversion, cost per accepted inquiry, professional CTA-to-demo, and content engagement. Track organic, AI referral, paid, referral and broker-led traffic distinctly. Prioritize A/B testing hero headline, CTA label, selector friction and placement of secured/unsecured comparison **after** instrumentation and enough sample volume. Reject unconsented pixel transmission of financial inputs.

### 17.9 Priority and acceptance criteria
**P0 launch:** hero + selector; six financing cards; three-step explanation; secured/unsecured education; clear comparison link; final assessment CTA; separate professional path; legal disclosures; attribution, consent and mobile QA.
**P1:** richer industry cards, commercial real estate module, verified guide collection, comparison/calculator blocks.
**P2:** personalized content routing only with permitted data; verified customer proof; deeper interactive tools.
Acceptance:
1. Borrower identifies financing purpose in the first viewport on mobile and desktop and reaches relevant assessment in two actions or fewer.
2. Selector carries selections through assessment securely without allowing client-side broker-ownership spoofing; consent event is stored and tested.
3. All six card destinations resolve or have intentional staged fallbacks, and links/canonicals are checked.
4. Indexable semantic content and accessible nav/cards/selector work on mobile/desktop, keyboard and with JS unavailable.
5. Financial claims, rate data, provider listings, testimonials and badges cannot publish without source/permission review.
6. Distinct broker journey does not interfere with borrower conversion, lead routing or privacy.
7. End-to-end test records content and acquisition source → assessment → verified lead → eligible broker routing, including error and duplicate cases.

**Explicit non-goals:** auto-credit decisions, guaranteed rates/approvals, publishing fictional social proof, live lender pricing without verification, and claiming future SaaS/marketplace capabilities are already launched.

## 18. Progressive Data Capture, Buyer-First PPL and Rate-Gating Refactor — 2026-10-24
**Component:** CK-INTAKE-002 | **Status:** PRD amendment; not implemented. **Source:** user-supplied "Pay-Per-Lead (PPL) SOP — According to Alex Fuller" (Pay Per Lead Secrets — 2026 Edition), plus user decision to run both inbound demand capture and proactive opportunity discovery.

### 18.1 Change from the prior homepage and application flow
**Replace the assumption that the homepage hero selector immediately leads to a long contact-gated application.** The three-input hero is an optional entry into an anonymous, useful comparison flow. Publish useful, source-reviewed product descriptions, indicative rate ranges where verified and licensed for display, unsecured/secured comparisons, and a basic calculator **without registration**. Capture business qualification data *progressively* during a short assessment; show truthful, non-binding category guidance before requesting personal identity. Request contact details and specific lead-sharing consent when the visitor opts to obtain a personalized financing comparison, pricing discussion or broker introduction. A consultation request is not a guaranteed quote or approval.

**Core path:**
`Organic/Paid/AIO/Referral → public rate/product guide or homepage → free comparison/calculator → anonymous 5-step business assessment → preliminary category results → request personalized financing options / broker contact → identity + separate consents → verify interest/contact promptly → qualify → eligible broker buy-box → reserved/delivered lead with wallet transaction → Atomic CRM → buyer outcome and consent-governed requalification`.

Visitors can exit with general educational results; do not block access to public facts merely to obtain an email address. Do not display personalized lender offers when no lender-authorized, current eligibility/rate data exists; use **Custom quote required** and a request-to-connect.

### 18.2 Capture exactly what is needed, when needed
| Moment | Visitor sees | Data collected | Storage/consent condition |
|---|---|---|---|
| Public browse (S0) | SEO pillar, verified indicative ranges, financing explanations, basic calculator | Only privacy-respecting, allowed analytics/session data; no personal finance profile required | Consent rules apply to analytics/ads; no broker lead created |
| Hero/guide quick selector (S1) | Choice of product, amount band, province, education links | `financing_type`, `amount_band`, `province`, optional `source_page` | Anonymous short-lived assessment session with trusted first/last attribution; no purchaser-visible lead |
| Assessment step 1 | What financing is for / type and amount | `purpose`, `requested_amount`, property/project purpose if relevant | Anonymous draft server-side with TTL, minimize retention |
| Assessment step 2 | Business profile | Industry, `operating_months`, business type, province | No contact details |
| Assessment step 3 | Financial context | Annual revenue **band**, approximate available security, optionally property type/value and current debt only when relevant | No documents, credit report, SIN, exact bank details or sensitive files in P0 |
| Assessment step 4 | Timing and needs | `timeframe`, current lender situation optionally, preferred category/secured-unsecured interest | Provisional category matching; **do not claim approval or verified demand at this stage** |
| Assessment step 5 / preliminary results | Eligible financing **categories** and trade-offs using documented rules; rates only if sourced and suitable | Optional answers to clarify matching | Results available without name/email; no lender-specific individualized claim |
| Contact & permission gate (S2) | "See options for my business" / "Have a financing professional contact me" | Name, business name, email, phone, preferred callback time; contact verification; separate transactional sharing and optional marketing consent, plus disclosures of recipients/exclusivity where applicable | Lead record created only following explicit submission; consent version/time/purpose, source, verified destination and security audit stored |
| Verification/qualification (S3) | Confirmation and expected follow-up | Staff/approved call verifies business, contactability, financing interest/amount, readiness and eligible buyer constraints | Only **confirmed interested** records promoted to qualified marketplace leads; prefer immediate call, operational target under two hours during supported hours |
| Purchase/hand-off (S4) | Relevant broker(s) receive permitted details | Buyer matched on product/region/amount/eligibility/capacity, exclusive/shared rights, price, assignment | Log allocation, delivery, wallet debit or invoice under order terms, buyer acceptance/rejection; no unconsented reselling |
| Outcome/second use (S5) | Optional permissioned follow-up | Accepted/rejected, contacted, meeting, application, funded, unsuccessful reason, future intent | Consent/contractual restrictions and suppression enforced; requalify interest before re-offering |

**Form ergonomics:** progress indication, back/edit answers, a clear save-and-resume policy only with permission, mobile validation, short field labels, branch by product; no arbitrary six-step burden when fewer questions suffice. Show *why* a requested field improves comparison quality. Allow an earlier contact request at any time.

### 18.3 Conditional branching by financing product
- **Business loans / unsecured LOC:** revenue band, months operating, amount, purpose, timing and broad credit/asset context only if necessary and lawful. Do not use reported credit score as approval.
- **Commercial mortgages/refinance:** property type, province, value band, existing debt band, purchase vs refinance, occupancy/income context where relevant.
- **Construction/development:** site/property type, approximate development budget, development stage, requested capital and timeline; optional collateral/equity band; financing status unknown until confirmed.
- **Equipment / ABL:** equipment/asset category, amount, receivables/inventory/equipment context and timing.
Route unsuitable or unready applicants to educational content or consented follow-up, not a fabricated qualified lead.

### 18.4 Buyer-first supply and quality gate
Before large ad spend, identify 10–15 potential lead buyers, study 3–4 competitors, collect lender/broker **buy-boxes** (province, financing product, min/max size, revenue/operating history criteria, capacity, exclusivity, acceptance rules), and obtain paid trial commitments. Proposed validation: recruit 5–10 brokers and secure 3–5 trial buyers; test 50 opportunities and report cost, verified intent, accept/reject and contribution margins. **Alex Fuller case study** in supplied source reports £12 CPL, £45 sale, six buyers, 400–500 monthly volume and ~73% margin before other costs; these are author-reported figures, not Canadian benchmarks or commercialKonnect forecasts.

Marketplace offer classes:
- `discovered_signal` (proactive research, no verified financing intent; intelligence product only);
- `unverified_inquiry` (submitted contact data, unconfirmed intent; internal);
- `contact_verified` (contactable; not necessarily interested);
- `financing_interest_confirmed` (potential qualified lead);
- `buy_box_qualified` (ready for allowed distribution);
- `delivered/accepted/rejected/refunded` (sale and post-sale states).
Never conflate a company expansion permit with a funding request. Distinguish intelligence credits from transactional lead-wallet debits and preserve broker-generated vs platform-generated attribution. Exclusive/shared allocation rules and number of recipients must be contractually defined and disclosed as necessary.

### 18.5 Second-use lifecycle (permissioned)
Source SOP proposes day 0 initial delivery, month 3 review, month 4 recontact, month 6 follow-up, month 9 final scheduled attempt. Treat these as **review triggers**, not an authorization to contact or resell. Before each attempt, check lawful outreach basis, consent purpose/duration, suppression, original buyer exclusivity, contract terms, prior outcomes and freshness. Record new interest and consent before routing to a Tier-2 buyer or financing alternative. Do not re-charge for duplicate or non-qualifying enquiries.

### 18.6 Technical changes to implement
- WordPress (Astra/Gutenberg) renders public guide/rate/comparison content and starts the React/shadcn `commercialkonnect-components` assessment; existing CK-RATE-001 is the educational comparison component.
- Supabase canonical entities: `assessment_sessions` (anonymous ID, TTL and status), `assessment_answers` (minimal typed answers), `assessment_result_snapshots` (category logic/rule version), `contact_submissions`, `verification_events`, `buyer_buy_boxes`, `lead_qualification_events`, `lead_distributions`, `lead_purchase_events`, `buyer_disputes`, `lead_requalification_schedules`, `consent_events`, `attribution_events`, plus existing prospects/leads/organizations and audits. Align actual schema rather than blindly create duplicate tables.
- Use a one-time opaque session token and server-enforced ownership binding when converting an anonymous assessment into an identified lead; separate PII from anonymous browsing analytics; encryption, TTL, server validation, rate limiting/bot controls, idempotent form submissions and tenant RLS.
- **No PII, assessment answers or sensitive commercial-finance details passed to ad pixels or AI-search telemetry.** Store consent evidence with purpose, broker-sharing scope, timestamp and notice version. Separate marketing opt-in from operational referral/contact requests.
- Match a lead only after confirmed intent and lawful sharing rights. The assigned broker sees the disclosed package; other tenants see neither buyer-specific records nor private applicant data. Atomic CRM receives acceptance-ready opportunities with attribution, provenance and audit history.
- Preserve financial rate source, effective/review dates, fees, rate types, eligibility assumptions and "Custom quote required" for unverified personalized offers.

### 18.7 UX tracking and acceptance tests
Events: `guide_viewed`, `comparison_used`, `assessment_started`, `assessment_step_completed`, `preliminary_results_viewed`, `contact_gate_opened`, `contact_submitted`, `consent_recorded`, `contact_verified`, `interest_confirmed`, `buyer_matched`, `lead_delivered`, `buyer_accepted/rejected`, `wallet_redeemed`, `meeting_held`, `funded`, `recontact_due/blocked/completed`.
Report anonymous-to-assessment, assessment completion, results-to-opt-in, speed-to-contact, qualified lead percentage, buyer accept/reject, contact and meeting rate, CAC per **accepted** lead, sale price, contribution margin, refunds and repeat buying by channel.

**Definition of done (incremental):**
1. Anonymous visitor can view rate guide, comparison and educational results without name/email; unattributed and no-contact sessions cannot be sold.
2. Hero selector prefills assessment without losing initial/source/page UTM; optional questions branch correctly for commercial, business, construction, equipment and ABL.
3. Contact permission gate explicitly identifies requested handoff purpose, preserves separate marketing consent, and logs audit events; server rejects spoofed ownership and duplicate submissions.
4. A timely verification task is queued, with follow-up SLA clock; broker matching blocked until confirmed qualification and lawful sharing.
5. Admin can verify a buyer buy-box, accept paid trial commitments, route eligible exclusive/shared opportunities and apply refunds without double-billing.
6. Contact details remain private across organizations; ad tracking excludes PII and financing answers; tests cover consent withdrawal and blocked recontact.
7. Older leads cannot be recycled based on date alone; second use requires fresh purpose/interest check and permitted contact/distribution.
8. Dashboards distinguish organic/paid/AIO/outbound, assessed vs verified vs sold leads, money collected vs revenue recognized, and accepted-lead economics.

**Build order:** P0 public information and anonymous assessment → S2 consent/contact & verification queue → buy-box match and internal delivery → wallet/billing tests → conditional extensions/second-use schedule → automation and scaling. Integrate into existing Section 17 homepage; do not create a second inconsistent form or funnel.

## 19. Homepage Financing Amount Slider & Adaptive Inquiry Wizard — 2026-10-24
**Component:** CK-INTAKE-003 | **Status:** Approved UI/requirements specification; not yet implemented. **Supersedes:** Section 17's amount-band-only hero control where inconsistent. **Extends:** Section 18's anonymous progressive data capture, five-step qualification and contact/consent gate.

### 19.1 Objective
Make the financing amount selector the primary interactive homepage conversion element, using an **accessible slider synchronized with an editable currency amount field** and convenient tap-to-select presets. The visitor can explore categories before disclosing identity. On Continue, open the existing conditional financing assessment with selected type/amount/province preserved. This is a single intake journey, not a separate lead form.

### 19.2 Hero layout and user flow
- Left: “Business Financing. More Options. Better Decisions.”, concise borrower value proposition, links to financing/product/rate information.
- Right: “Find Your Financing Options” selector card: **financing type**, large formatted **requested financing amount**, slider, editable currency field, 3–5 product-specific preset buttons, province selector, primary **Continue** button.
- On mobile: show clear amount and selectable presets near thumb; controls at least 44px touch targets, keyboard-accessible, readable at 320px.
- Flow: `Homepage or SEO/rate guide → financing type + amount slider + province → Continue → anonymous conditional assessment → preliminary financing category results → optional personalized-comparison / broker-introduction contact + purpose-specific consent → prompt verification call → broker buy-box match → permitted delivery and CRM`.
- Public guides, comparisons, and source-verified indicative rates remain ungated. Moving slider or viewing preliminary results does **not** itself create a saleable financing lead.

### 19.3 Configurable initial slider bands (CAD; not lender eligibility criteria)
| Financing product | Initial range | Example presets | Step design |
|---|---|---|---|
| Business loans / working capital | $25,000–$1,000,000 | $50K / $100K / $250K / $500K | $5K then $25K as magnitude rises |
| Business lines of credit | $25,000–$2,000,000 | $50K / $100K / $250K / $1M | $5K–$25K by magnitude |
| Equipment financing | $25,000–$5,000,000 | $50K / $250K / $500K / $1M | $5K–$50K by magnitude |
| Commercial mortgages | $250,000–$25,000,000 | $500K / $1M / $5M / $10M | $25K–$250K by magnitude |
| Construction & development | $500,000–$50,000,000 | $1M / $5M / $10M / $20M | $50K–$500K by magnitude |
| Asset-based lending | $100,000–$20,000,000 | $250K / $500K / $1M / $5M | $25K–$250K by magnitude |

**Product taxonomy:** Maintain stable product IDs distinct from labels; “Other / Not sure” shows a broad amount input and educational guidance rather than forcing an incorrect category. Ranges, preset values, currency format and validation messages are administrative configuration, not hardcoded lender rules. Slider range is for usability only: **if someone needs an amount outside the range, allow manual valid CAD entry and flag it for review instead of silently clamping or rejecting qualified demand.**

### 19.4 Interaction and validation rules
1. Keep slider, preset buttons, amount field and formatted display in two-way synchronization; updates never change another field unexpectedly.
2. Store amounts as integer CAD or minor units, not floating-point currency; locale-format the display. Accept reasonable pasted formats (e.g. $1,250,000), reject non-numeric/negative/zero, clarify unusually large amounts, and preserve exact entered amounts.
3. A slider may use a **piecewise/logarithmic mapped position** for large ranges; ensure direction, thresholds and announced value remain understandable. Add sensible increments, keyboard arrow/home/end handling and semantic labels; an ordinary native range with clear scale may be preferable for the MVP.
4. Changing financing type updates allowed presets/ranges without erasing an intentionally entered out-of-range amount; show a transparent warning and permit the visitor to continue for manual review.
5. Persist financing type, requested amount and province in a short-lived anonymous assessment session; server accepts only validated enums and normalized amount, uses opaque session ID/TTL and preserves trusted attribution. No PII in URL, analytics, ad pixels, search query or client logs.
6. On Continue, route to assessment step 1 or prefilled next relevant step, avoiding asking financing type and amount a second time. Provide editable summary, back navigation, progress indicator, non-JS fallback and accessible errors.
7. Explain that requested financing amount is exploratory and does not indicate borrowing eligibility, a rate quotation or lender approval.

### 19.5 Adaptive assessment requirements
Preserve Section 18's five-step borrower assessment, using conditional fields:
- **Step 1:** purpose + exact requested amount (prefilled); project/property purpose only when relevant.
- **Step 2:** industry, operating history/business type and province.
- **Step 3:** revenue band, secured/unsecured preference and broad asset/property/equipment information as applicable; no SIN, precise bank records or upload in MVP.
- **Step 4:** timeframe, readiness and optional current financing context.
- **Step 5:** anonymous preliminary financing category comparison and trade-offs; no unsupported lender-specific personalized quote.
**Optional contact gate:** “See options for my business” / “Have a financing professional contact me” → name, company, email, phone, callback preference + clearly disclosed sharing permission and separate marketing consent. Route only after contact and financing interest are verified, as required by the broker's buy-box and agreed quality definition.

### 19.6 Engineering contract
Implement as a reusable scoped **React/shadcn Gutenberg block** in `commercialkonnect-components`, compatible with **Astra Free + Gutenberg + WP MCP Ultimate** and the secure Supabase assessment endpoints. Keep public informational text indexable native/server-rendered HTML. Use product configuration from a versioned, auditable public-safe API or locally bundled validated config, not scraped live-rate values. Avoid third-party slider scripts unless approved. Respect tenant permissions, request idempotency, rate limiting, bot protection and audit trails. Atomic CRM receives verified permitted opportunities, not anonymous slider interactions.

Analytics events: `financing_selector_viewed`, `financing_type_selected`, `amount_slider_changed` (aggregated/bucketed; avoid sensitive amounts), `amount_preset_selected`, `manual_amount_entered`, `selector_continue`, `assessment_started`, `preliminary_results_viewed`, `contact_submitted`, `verified_interest_confirmed`, `broker_accepted`. Avoid duplicate triggering and record content/campaign attribution separately.

### 19.7 Acceptance tests / rollout gate
- Slider, input, presets, currency display and product changes stay synchronized on desktop/mobile, keyboard and screen reader; no inadvertent loss of manual values.
- A $12,000,000 commercial mortgage and a $75,000 business loan can both be entered precisely; out-of-range manual requests have a clear review state rather than silent truncation.
- Selecting amount/province then continuing does not re-ask those fields, and attribution survives page transitions.
- Anonymous visitor receives educational category results without surrendering contact details; only explicit opt-in creates an identifiable inquiry.
- Contact/sharing and optional marketing permissions are independently captured, auditable and respected for routing, suppression and withdrawal.
- Tests verify invalid numbers, browser back, reload/expiry, duplicate submissions, analytics privacy, edge-case financing types and display with JavaScript unavailable.
- Cross-tenant isolation, secure server validation and broker-owner attribution remain enforced.
- A lightweight A/B test can compare slider + presets versus simple amount input on **qualified completed inquiries**, not merely interaction rate.

**Delivery:** P0 homepage reusable slider/control & secure prefill; P0 conditional assessment & free preliminary results; P0 optional consent/contact + prompt verification workflow; P1 advanced sliders and friction tests; P2 adaptive suggestions informed by actual accepted-lead quality. No claim of live implementation until coded, tested and deployed.

## 20. Interest Savings & Financing Professional Value Proposition — 2026-10-24
**Module:** CK-SAVINGS-001 | **Status:** Approved requirements for planning; no calculator implementation or actual lender rate feed is asserted. **Extends:** Sections 15–19.

### 20.1 Purpose and positioning
Add an educational **potential interest savings** message to the borrower-first homepage and a transparent rate/total-financing-cost calculator. Position commercialKonnect as a way to **compare different financing structures and understand borrowing costs**, not as a service guaranteeing cheaper credit. A commercial mortgage broker may specialize in property-secured lending and lender/terms comparison; a business finance consultant may specialize in operating-company debt, working capital, equipment and ABL. Professional qualifications and applicable licenses must be verified by product and province. Do not claim one profession universally offers better terms or savings.

**Suggested headline:** "Could You Be Paying More Interest Than Necessary?"
**Suggested subheadline:** "Different financing options can involve different rates, fees, collateral requirements and repayment terms. Explore how those differences could affect your borrowing costs."
**CTA:** "Calculate Potential Interest Savings" → savings calculator; secondary "Compare Financing Options" → existing financing slider/assessment.

### 20.2 Homepage placement and conversion logic
Keep financing slider as primary hero conversion. Add a concise source-backed **Financing by the Numbers** context block and **Why Work With a Financing Professional?** explainer below the hero, where supported by verified Canadian evidence. Position a compact savings calculator near the secured-vs-unsecured comparison and before the "How It Works" or financing categories as responsive layout permits. Avoid competing simultaneous forms: calculator and slider must hand off to **the same** progressive assessment in Section 18, prefilled with financing amount, category and any user-authorized comparison assumptions. No contact gate to view educational savings.

**Professional benefits to explain:** broader access to options depending on each professional's network; specialization by product/property/industry; comparison of repayment costs, rates, fees, guarantees and collateral; help with assembling financing documentation. Claim actual comparative lender availability only when verified. Disclose broker/consultant fees, referral interests, and paid placements where relevant.

### 20.3 Calculator inputs and outputs
| Input | Requirement |
|---|---|
| Principal | CAD amount; sync from financing slider; precise typed amount allowed |
| Current/proposed rate | User-supplied annual nominal rate (%) and clearly labelled illustrative status |
| Comparison rate | User-supplied annual nominal rate (%); **not** a promised available rate |
| Structure | Interest-only or amortizing installment loan; do not mix conventions |
| Amortization | Years/months; for amortizing case, specify payment frequency and compounding convention |
| Comparison period | 1/3/5 years or entered interval not exceeding modeled term, as applicable |
| Fees | Origination/broker/appraisal/legal/discharge/penalty where known; user-entered and optional |

Results:
1. Current vs comparator periodic payment and difference.
2. Total interest paid **over the selected period**, accounting for amortizing balance declines or constant principal for interest-only.
3. Outstanding principal at period end for **each** scenario, and net financing cost comparison that does not portray smaller payments from lengthening amortization as overall savings.
4. Itemized fees and indicative net cost difference; separate ongoing payment savings from total interest differences; disclosure that refinancing fees, credit/security risk, tax implications and rate changes may alter outcomes.
5. A clearly identified illustrative estimate, not a personalized lending decision or verified current lender offer. Handle equal or higher comparator rates as $0 savings or a potential additional cost, never force a positive result.

**Correctness example:** $1,000,000 outstanding at 8.0% vs 7.0%, interest-only, identical $1M outstanding for one year → $80,000 vs $70,000 interest, **$10,000 illustrative annual interest difference** before fees. For a 5-year constant-balance interest-only comparison, this becomes $50,000 before costs; never reuse that number for a normal amortizing loan.

### 20.4 Rate-source and claims controls
- Published indicative rate ranges must have documented lender/source, dated verification, pricing basis, conditions, geographic applicability, fee disclosures and publication permission. Missing/stale information displays **"Custom quote required"** per CK-RATE-001.
- Do not use government survey changes in average rates across years to imply a **broker-caused savings** amount. Government statistics can establish financing-market context only after source/denominator/date checks.
- Never advertise "save up to X%" or "broker clients save $Y" without defensible comparable outcome data, assumptions and compliance approval.
- Regulatory and financial advertising review is required for claims of rates, savings, product suitability, licensing and compensation.
- Calculator may not suggest a specific eligible lender or quote until authorized rate products, eligibility checks and appropriate human oversight exist.

### 20.5 Technical implementation
- Implement a reusable `commercialkonnect/interest-savings-calculator` React/shadcn Gutenberg block in `commercialkonnect-components`, compatible with Astra Free + Gutenberg; provide indexable narrative, comparison methodology and worked example in native/server-rendered HTML.
- Shared validated configuration and typed calculation library (integer cents where appropriate; deterministic payment schedule with explicit periodic rate convention). Unit-test rounding, payment schedules, residual balances, zero interest, 100%-rate edge cases, zero/negative amount rejection, fee inclusion and periods shorter than amortization.
- Keep calculations in-browser for anonymous educational visitors; do **not** transmit comparison amounts/rates, personal finances or calculated profile information to ad pixels, generic analytics or third-party AI APIs. Events capture only non-sensitive engagement and permitted attribution.
- Existing financing slider/wizard can accept validated prefills from calculator without altering broker ownership or creating a marketplace lead. User must knowingly proceed to the contact and permission gate; broker routing follows Section 18.

### 20.6 Measurement and definition of done
Track `savings_calculator_viewed`, `savings_calculator_completed`, `savings_to_assessment`, assessment completion and **broker-accepted verified enquiries**, segmented by permissible channel/product. Do not optimize solely for big displayed savings.

Acceptance tests:
1. Calculator reproduces the $1M interest-only example and accurate amortizing examples across specified rate and term conventions.
2. Changing rates, payment frequency, term or fees updates both payment and total-period comparison correctly; when new rate is higher, the UI indicates additional cost.
3. Explanatory text clarifies hypothetical rates, fees, principal balances, interest-only vs amortizing methods, and that lower payments do not necessarily mean lower total borrowing costs.
4. Calculator results render without contact details; visitor can then transfer validated principal/product into the **existing** progressive assessment without repeating entered fields.
5. Rate/marketing copy cannot publish unsupported numerical savings claims; finance reviewer signs off before release.
6. Responsive/accessible keyboard and mobile interaction; safe numeric formatting and no exposure of sensitive amounts to pixels or third-party tracking.

**Delivery priority:** P1 after P0 slider/assessment/consent; first release uses user-entered hypothetical rates only. Verified lender rate feeds, comparison of complex variable-rate products, refinance penalties and more sophisticated net-present-value analysis are P2 subject to evidence and legal/product review.

## 21. Canadian Financing Statistics & Consumer Education — 2026-10-24
**Component:** CK-TRUST-001 | **Status:** approved content specification; not published. **Purpose:** frame the problem and why comparing financing options matters, without creating unsupported fear or broker-performance claims.

### 21.1 Verified evidence and display rules
**Source:** Innovation, Science and Economic Development Canada (ISED), *Credit Conditions Survey 2025*, survey of 1,812 Canadian small enterprises (1–99 employees), fielded January–March 2026 on 2025 activity: https://ised-isde.canada.ca/site/sme-research-statistics/en/survey-data-and-analysis/credit-conditions-survey/credit-conditions-survey-2025

| Figure | Precise homepage claim | Population/denominator | Source table |
|---|---|---|---|
| **20%** | Small enterprises surveyed requested debt financing in 2025 | Surveyed small businesses | Table 1 |
| **45%** | Working or operating capital was the primary intended use of debt financing | Businesses seeking debt financing; distribution of main intended uses | Table 5 |
| **76%** | Collateral was required for debt financing in the 2025 survey | Overall debt-financing observations, as defined by ISED | Table 2 |

**Caution:** A separate ISED longitudinal trends report rounds collateral prevalence to ~75%. Use **76%** only when explicitly citing the 2025 Credit Conditions Survey Table 2; do not mix sources as if the figures were identical. Survey samples, eligibility and intended use differ from commercial-mortgage-only borrowers. Do not imply these figures describe commercialKonnect customers, that a particular percentage was rejected, or that brokers reduce borrowing rates. The same survey reports a **97% full-or-partial approval rate for debt financing requests**, making an "80% rejected" message false.

### 21.2 Homepage section and placement
Immediately below borrower-first hero/slider, display compact 3-card block:
- **Headline:** "Business Financing Isn't One-Size-Fits-All."
- **20%** — "of surveyed Canadian small businesses requested debt financing in 2025."
- **45%** — "of intended small-business debt financing was for working or operating capital."
- **76%** — "of small-business debt financing involved collateral requirements."
- **Transition:** "Different goals, security and repayment structures call for different financing approaches. Explore options based on what your business needs."
- **CTA:** "Compare Financing Options" → existing financing comparison/assessment.

Provide visible source attribution, survey year, accessible source link and a concise scope note ("Canadian small enterprises with 1–99 employees; figures use different denominators"). The number must be accurate but not dominate the hero or force visitors to read a statistical wall. On mobile use stacked cards.

### 21.3 Supporting content and evidence lifecycle
Create linked, human-reviewed articles on working capital, property-secured vs unsecured, lender fees/cost of borrowing, and why different specialist finance professionals matter. Maintain a verified claim record: claim_id, canonical source URL, table/line, survey population, denominator, period, last checked, legal/editor reviewer, allowed display surfaces and review_due. Re-review annual ISED updates and correct/remove stale or disputed statistics. Schema reflects visible page content; no invented performance case studies, unverifiable rankings or lender-specific savings.

**Acceptance:** every statistic resolves to source methodology; tablet/mobile/accessibility checks; stats cannot be published without source and reviewer; click-through maintains legitimate campaign attribution; editorial tests block misinformation about rejection rates or broker-caused savings.

## 22. Borrower-Facing Broker Discovery, Selection & Consented Matching — 2026-10-24
**Component:** CK-MATCH-001 | **Status:** proposed P0/P1 matching and directory module; no verified broker inventory or production scheduling claimed. **Goal:** help business owners select an appropriately qualified professional rather than forcing a blind lead sale.

### 22.1 Value proposition
**Headline:** "Find the Right Financing Professional for Your Business."
**Supporting copy:** "Explore verified professional profiles, compare financing specialties and request an introduction to someone whose experience matches your needs." Avoid "independent" unless independently confirmed for each provider, and avoid implying the highest-paying broker is best suited. Make clear that the directory includes participating professionals, not all providers in Canada.

**Two expertise types:** commercial mortgage professionals for property-secured, land, construction, bridge and refinance transactions; business finance consultants for working capital, unsecured credit, equipment, receivables, leasing and acquisition funding. Specialists overlap; no universal licensing standard attaches to the term "business finance consultant." Verify actual regulated activities, provincial license/exemption, entity identities and permitted representations with competent review.

### 22.2 Consumer journey
`Homepage/product guide → slider + anonymous assessment → category guidance → preview 2–3 relevant professional profiles (if verified supply exists) → borrower selects preferred professional or requests assisted matching → explicit contact, introduction/lead-sharing scope & separate marketing consent → verification → broker notification and accepted referral → appointment → CRM outcome`.
- Provide **Browse Professionals** and **Find a Financing Professional** navigation accessible without application or login. Filter by province, commercial/business product, property type/industry, transaction size eligibility and specialty.
- Preview public, approved professional profiles without requiring personal details; avoid listing unverified participants or implying live availability. If matching candidates are not yet verified, present a clearly described manual matching request instead of fabricated cards.
- Choice: borrower can **select a professional**, compare a small shortlist, or **request matching assistance**. Disclose when a lead may be shared with more than one recipient and ensure legal/consent review of timing and recipient categories.
- A broker-attributed campaign retains contractual routing rights, but disclose when that limits provider choice; do not silently override borrower selection or transfer an exclusive lead without an authorized process.
- Broker purchase/marketplace operations are internal and need not expose credits/pricing to borrowers. Sponsored placement is labeled and **is not** presented as a suitability score.

### 22.3 Profile schema and evidence
Public display (only with provider permission): professional and brokerage identity, verified licensing status in applicable province (and status last checked), product specialties, regions served, financing amount/transaction preferences if publishable, industries/property types handled, languages, consultation method, compensation/fees disclosure, firm website/contact method, verified claims and last-updated date. Never invent lender partnerships, completed deals, client savings, reviews or endorsements.

**Matching rules:** deterministic filters for location, product expertise, permitted transaction size, broker buy-box, professional licensing status and buyer capacity → optional quality/relevance tie-breaker using verified evidence; show understandable matching rationale (“Works with BC commercial refinance enquiries”). Exclude stale/unverified profiles from "verified" results. Sponsored payments/credits never automatically trump eligibility. Record rule version, availability evidence, selection type (borrower_chosen / assisted / broker_originated), disclosure text, referral permission, buyer and matching audit.

### 22.4 Required architecture and routing behavior
- Reuse WordPress/Astra/Gutenberg directory/profile content and secure public-safe read API. Add verified professional search cards and filter UX; no private buy-box or lender contract terms in browser.
- Supabase canonical entities (align existing actual schema): `professional_profiles`, `professional_credentials`, `professional_specialties`, `professional_availability`, `match_recommendations`, `borrower_preferences`, `introduction_requests`, `broker_assignment_events`, `consent_events`. Where possible map existing `broker_profiles` and `lead_assignments` rather than duplicating tables.
- Connect opt-in introduction to Section 18's contact/verification funnel; unauthenticated profile browsing remains allowed; prevent user-side forgery of verified status, routing owner or selected recipient.
- Leads delivered to Atomic CRM only after lawfully permitted sharing and interest verification, according to the order's defined qualification standard; product recommendation is not underwriting or credit approval.
- Define manual administration / fallback route for no-match, license pending, paused buyer capacity, unknown applicant category and withdrawal of permission. Track SLA for live responses, with after-hours disclosure.

### 22.5 Priority and acceptance
**P0:** content section "Why Work With a Financing Professional?"; non-fictional broker/consultant benefits; verified profile schema and admin onboarding; optional manual matching CTA/consent, preserving existing application and broker attribution.
**P1:** consumer browse/filter, verified professional profiles, shortlist and voluntary selection, deterministic eligibility match, explanation, appointment request and status.
**P2:** availability scheduling, user feedback and trusted reviews with moderation, richer ranking, analytics-informed matching and opt-in follow-up.

Acceptance:
1. A visitor sees the difference between commercial mortgage broker and business finance consultant, associated competencies and appropriate fee/licensing disclosures.
2. A visitor can browse only real, authorized profiles without surrendering contact data, compare professional specialties and see current credential-verification date.
3. On selection, recipient/purpose disclosure and legal sharing consent are captured independently of marketing consent; consent withdrawal blocks further unpermitted distribution.
4. Broker campaign ownership, borrower choice and exclusive/shared commercial terms reconcile through a transparent, audited routing policy (no silent resale).
5. No verified candidate → honest assisted-matching fallback, never a fabricated profile or guaranteed callback.
6. Backend rejects client-forged assignment/credentials; only intended approved recipients receive applicant data.
7. Measure profile view → shortlist → contact request → verification → accepted meeting and borrower preference, plus post-referral complaints and compliance incidents.

**North star:** qualified, borrower-consented professional introductions accepted by an eligible financial professional, with marketplace profitability measured separately.

## 23. Planned Feature — Financing Mix Optimization Engine (CK-MIX-001)

**Status:** Planned, not implemented. **Detailed feature specification:** [Financing Mix Optimizer](planned-features/financing-mix-optimizer.md).

After the anonymous progressive assessment (Sections 18–19), an explainable rules-first financing mix engine will evaluate whether single-product or multi-facility structures might address borrower requirements. It will capture financing uses and allocations, assess mandatory product/cash-flow/security constraints, construct feasible candidate structures, compare cost/fees/payment burden/collateral/flexibility/timeline and show up to three labeled educational scenarios. Outputs feed borrower-consented matching to verified commercial mortgage brokers and business finance specialists under Section 22.

**Delivery:** P0 enhanced purpose/amount/asset capture; P1 deterministic scenario engine, what-if UX and specialty matching; P2 sourced/authorized lender criteria and rate feeds; P3 verified outcomes and feedback-informed rankings. Initial weighted priorities (cost 30%, cash-flow 25%, collateral 20%, flexibility 15%, timeline 10%) are *hypotheses*; disqualifying hard constraints always apply first. No underwriting, guaranteed eligibility, invented lender rates, or automated broker sharing. See detailed planned-feature file for schema, security controls, intercreditor/collateral-conflict detection, mathematics and acceptance tests.

### 23.1 Clarification — multiple products selected during the financing assessment (2026-10-25)
Borrowers must be able to select **multiple financing products** **inside the assessment wizard**, independently of the already-supported multi-select **uses/purposes**. These are distinct sets: e.g., purposes = [equipment purchase, working capital]; requested products = [equipment financing, business line of credit, commercial mortgage]. Preselect the financing product initially chosen on the homepage, then allow it to be added to, edited or removed during the first assessment step. Require at least one selected product and at least one stated purpose before advancing; display all choices on the preliminary-results summary. Do not represent exploratory selections as separate binding applications or imply that product suitability/eligibility has been determined. The P1 mix engine may subsequently assess feasibility, create multiple facility scenarios and optionally assign indicative amounts by product with borrower control and no duplicate count of total requested amount. Preserve each product selection and purpose independently in the assessment session and eventual consented CRM payload; broker matching must accommodate multiple specialty types without unsolicited multi-recipient sharing. Product selection in the frontend prototype is interactive; production persistence and underwriting remain unimplemented.

## 24. Residential Self-Employed Mortgage Options — 2026-10-25

**Status:** Consumer-facing prototype capability and planned underwriting/lender directory feature. **Audience:** Canadian self-employed homeowners, contractors, sole proprietors, shareholders and business owners seeking **residential** mortgage financing. This is a separate lending track from commercial real estate and business-purpose credit, while permitting multi-product exploratory assessment.

### Borrower proposition and discovery
- Add a **Self-Employed Residential Mortgages** solution card and product option to the homepage, with borrower-friendly copy: "Explore home purchase, renewal and refinancing options when you are self-employed. Income verification and lender requirements vary."
- Include home purchase, mortgage renewal, refinance, home-equity access and rental-property inquiry routes; classify property use and occupancy *before* eligibility or quote matching.
- Distinguish traditional documented-income mortgages, insurer-supported business-for-self programs, and lender-specific alternative-documentation products (e.g., bank statements, financial statements). **Do not** advertise no-document loans, universal eligibility, guaranteed rates or approval.

### Public reference categories (examples, not partner relationships or live rates)
- **CMHC Self-Employed** — documentation flexibility based on borrower circumstances, including tax returns/NOAs, business statements and other documents; https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/mortgage-loan-insurance-homeownership-programs/self-employed
- **Sagen Business for Self (Alt. A)** — insurer product for eligible self-employed purchasers who may not have conventional income documentation; https://www.sagen.ca/products-and-services/business-for-self/
- **Canada Guaranty Low Doc Advantage** — insured self-employed purchase category with defined limits and conditions; https://www.canadaguaranty.ca/low-doc-advantage/
- **B2B Bank Business for Self** — lender examples of bank-statement, conventional and alternative mortgage products; https://b2bbank.com/en/mortgages/business-for-self
- **Equitable Bank Business-for-self** — lender alternative underwriting examples including purchases/refinances; https://www.equitablebank.ca/resources/broker-resources/alternative-mortgages-resources/product-specs/bfs

Sources are educational program examples, not endorsements, integrated lender APIs, partner access, confirmed rate quotes or real-time program eligibility. Annual maintenance must verify program terms and geographic/product restrictions. Availability varies by lender, province, occupancy and underwriting, and insurers are not direct retail lenders.

### Adaptive assessment
- Preserve **multiple products** within Step 1 of assessment; selecting residential additionally triggers a context-aware path:
  - Step 2 self-employment tenure (including under 2 years).
  - Step 3 residential mortgage purpose + documentation route (T1/NOA, financial statements, bank statements, combination/unsure).
  - Future enhancement: property location/type, owner-occupied vs rental, purchase price/current value, down payment/equity, existing mortgage balance, credit/arrears self-report and broad personal income/cash-flow bands with appropriate privacy protections.
- A mixed residential+commercial product exploration may need a separated assessment subflow in production, rather than treating household debt service as equivalent to business revenue. MVP prototype prioritizes residential questions if a residential product is selected; document that limitation.
- No upload of sensitive tax returns or bank statements in unprotected public/demo forms.

### Routing and compliance
- Route residential enquiries to **appropriately licensed mortgage professionals**, distinct from business financing consultants. Use validated province, license status, specialty, appointment capacity and borrower preference.
- Maintain separate consent, verified interest, introduction audit trail and broker attribution consistent with Sections 18 and 22.
- Do not automatically route residential inquiries to business lending buyers or assume that the mortgage quote provider mentioned in the footer is the only available provider.
- Disclose mortgage default insurance, lender/broker fees, stress-test/qualification assumptions and property risk where relevant. No claims that a self-employed mortgage necessarily costs more, that home equity is suitable for business needs, or that tax write-offs imply qualifying income.

### Delivery and acceptance
**P0:** Homepage entry/category, adaptive residential assessment choices, educational disclaimers and transparent quote-contact route. **P1:** Dedicated self-employed residential SEO landing page, data model and licensed professional matching, secure CRM intake. **P2:** Program-by-program rules, verified lender access/pricing, dynamic qualification assistance and document intake under privacy/legal review.

Acceptance: category appears in both homepage and multi-select wizard; purpose/income documents persist through wizard and preliminary results; non-residential assessment remains functional; no invented current rates or insurer approvals; accessible mobile controls; no sensitive form submission from the HTML prototype.

## 25. Investment Property & Corporate Holding Acquisition Financing — 2026-10-25

**Status:** Homepage and assessment prototype; lender/product matching remains planned. Add two distinct selections to product exploration: **Investment Property Purchase** and **Holding Company / Business Property Purchase**. These selections may coexist with commercial mortgage, self-employed residential mortgage, business loan and other product choices without implying that a business acquisition is itself a mortgage.

**Coverage:** individual residential rental property purchases (including self-employed borrowers), non-owner-occupied residential investment, commercial income property, mixed-use assets, property acquired by a holdco or operating company, and operating-business acquisitions involving real estate or share/asset purchase. Distinguish whether the **borrower is an individual or legal entity**, the underlying property use, and whether the proposed acquisition concerns land/buildings, a going concern, or shares of a company.

**Assessment changes:** Include multi-select products in Step 1. Conditional Step 3 asks property/acquisition category and intended ownership (person, holding corporation, operating company, partnership, unknown). Later production underwriting gathers number of units, occupancy, rental income/NOI, lease terms, appraisal/value/purchase price, down payment/equity, debt service, existing encumbrances, corporate financials, guarantees, purchase structure and time to close. Distinguish residential investment financing criteria from commercial investment underwriting, insured/uninsured limits, legal entities and legal/tax advice. Multiple products may require a branching multi-track assessment; the demo currently prioritizes an investment/holding context when selected and does not establish suitability.

**Potential channels (not live offers):** regulated residential investment mortgage lenders, commercial mortgage lenders, credit unions, alternative/private property lenders, commercial bridge finance, and business acquisition lenders/ABL where appropriate. Never imply that an individual residential rental product is automatically offered to a holdco or that mortgage insurance is eligible for a corporation. Validate lender/entity eligibility and applicable licensing, property and ownership rules per province.

**Professional matching:** distinguish residential licensed mortgage expert, commercial mortgage broker, business acquisition finance specialist and legal/accounting adviser. Consent before transmitting any financing assessment, respect investor vs owner-occupied cases, and keep professional credentials and published lender relationships verified.

**Acceptance:** homepage card and product options visible; borrower can select investment, holding company and other financing products together; conditional ownership/property questions required in investment pathway; preliminary summary retains answers; no fabricated rates or lender approval; anonymous educational journey remains functional.

**Delivery:** P0 prototype information capture, P1 full subtype-specific intake and consented routing, P2 verified lender product criteria and scenario optimization.
