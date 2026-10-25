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
