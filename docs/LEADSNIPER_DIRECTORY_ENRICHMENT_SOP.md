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

## Automated cold-email outreach and appointment workflow — planned extension (2026-10-22)

### Objective and provider boundary
Use Explee AutoGTM as a candidate campaign and inbox engine for **authorized, human-approved** B2B outreach to decision-makers discovered from Yelp, Google Business Profile/Places, and Yellow Pages, after identity resolution, enrichment and growth-signal research. LeadSniperAI orchestrates eligibility, personalized briefs, suppressions and attribution; Explee handles campaign delivery only when controls and contracts have been verified. Explee is not currently connected; no emails are sent by this document.

### Explee documented API surfaces (verify schema before coding)
- `GET /public/api/v1/autogtm/projects`: identify correct project and project-level settings.
- `GET /public/api/v1/autogtm/campaigns` and `GET /public/api/v1/autogtm/campaigns/{campaign_id}`: inspect existing campaigns, targets, offer, email/follow-up instructions and schedule.
- `POST /public/api/v1/autogtm/campaigns`: create discovery campaign, initially in `discovery` state; inspect and edit before `POST .../campaigns/{campaign_id}/start`.
- `POST /public/api/v1/autogtm/campaigns/import`: import user-sourced leads (up to 30,000) and receive async task ID. **Warning: imported campaigns may automatically send once live. Treat import as an irreversible activation risk; do not call it until all checks, approvals and project-level controls are validated.** Poll the import task as documented.
- Campaign controls: budget patch, start/stop, campaign inbox and analytics endpoints; `POST .../campaigns/{campaign_id}/inbox/{person_id}/reply` replies within an established lead thread. Reconcile API fields and lifecycle to the live OpenAPI JSON before implementation; avoid invented payloads.
- Documentation: https://api.explee.com/public/api/docs and https://api.explee.com/public/api/openapi.json.

### Pre-launch compliance gate — mandatory
1. Confirm permitted collection, retention and outreach use for each source platform and enrichment vendor; maintain the source contract and deletion rules. Public listing is not blanket consent.
2. For each Canadian recipient, record documented CASL express consent or an applicable, reviewed implied-consent/exemption basis; record the precise facts, source, time and relationship to the recipient's business role. Published business emails do **not** automatically create consent. Record sender identity, postal address, required contact information and functional unsubscribe procedure; honour opt-outs within statutory timelines and suppress immediately in local operations.
3. Verify PIPEDA/applicable provincial privacy obligations, data-sharing permissions and any cross-border transfer/service-provider terms. Validate broker/licensing and data-sharing authority separately from sending permission.
4. Suppression and do-not-contact checks occur before campaign creation/import, before each scheduled send where provider permits, and immediately on replies. Stop/pause campaigns if Explee cannot enforce timely global suppression, sender requirements or approval controls.
5. Human approves campaign target set, material personalization assertions, initial template, follow-ups, sending identity, schedule, daily cap, budget, and compliance evidence. Authorization is scoped by tenant + campaign + version, expiring on a material campaign change. **Default campaign state is draft/disabled; never auto-import into a live project.**

### Personalization process
- Select business based on dated and cited growth evidence, verified owner/company match and financing relevance. Assign one research angle only: expansion site, equipment, working-capital cycle, commercial-property acquisition/refinance, new contracts or construction capex.
- Generate a short first message: accurate business reference → factual observation (optional) → relevant financing-conversation value → one low-friction question or meeting CTA. Do not claim approval, lender offer, financial distress, funding need, prequalification, endorsement or inside knowledge.
- Create 1–2 restrained follow-ups **only when legally permitted**, with new relevant value; no fabricated urgency, deceptive subjects or pressure. Reply and opt-out must stop follow-ups automatically; timeout/uncertain state triggers a safe stop.
- Parameterize by `client.brain.md`, broker geography, permitted products, capacity and calendar. Log model/prompt version, citations, copy revision and approval identity.

### Reply classification and booking
Classify inbound replies: `interested`, `later`, `not_relevant`, `wrong_contact`, `opt_out`, `question`, `out_of_office`, `delivery_error`, `human_review`. Use a deterministic suppression rule for opt-out; do not treat AI sentiment as verified borrowing intent. Positive replies become **owner-interest-review** tasks requiring a person to confirm role, stated need, timing, financing type, location and permission for broker introduction.
- Draft a human-approved response; offer broker calendar availability from connected calendar only when actually checked. Create or confirm an appointment only after recipient agreement. Record meeting ID, time zone, attendee consent/identity, owning broker, provenance and no-show or reschedule events.
- Bookable statuses: `positive_reply` → `intent_verification_pending` → `interest_confirmed` → `intro_permission_received` → `broker_match_approved` → `appointment_proposed` → `appointment_confirmed` → `meeting_held` → `accepted_or_nurture`. A positive reply alone cannot be sold or routed as qualified borrower interest.
- Forward the vetted intelligence card to commercialKonnect Mission Control; Chief of Staff surfaces approved next actions, not autonomous sends or unconsented broker transfers.

### Campaign operating model and engineering contracts
New Supabase entities (tenant-isolated): `outreach_campaign` (provider/project/campaign IDs, approved version, settings, budget, sending status); `campaign_membership` (contact, eligibility basis, source, import/sent status); `message_event` (provider message/thread IDs, direction, timestamps, reply label); `outreach_approval` (reviewer, checks, evidence, expiration); `suppression` (global scoped constraints, reason, timestamp); `appointment` (confirmed participants, broker, calendar reference, attendance); `outreach_outcome` (conversation/held meeting/accepted lead/revenue attribution). Use RLS, encryption/least privilege, retention limits, deterministic idempotency and audited webhooks/polling.
Proposed adapters: `draftSequence`, `verifyComplianceBasis`, `approveCampaign`, `stageCampaign`, `activateCampaign`, `pauseCampaign`, `syncReplies`, `classifyReply`, `approveReply`, `confirmIntent`, `checkCalendarSlots`, `bookAppointment`, `recordOutcome`. Separate Explee protocol implementations from canonical data schema, to preserve future Mystrika fallback. Resolve campaign timeout by listing campaigns before retry to avoid duplicate creates.

### Pilot, performance and release gates
Start with at most 25 fully verified and individually approved BC prospect contacts in a controlled project; **do not bulk-import before proving safety**. Gate 1: provider API/lifecycle verified by sandbox/manual checks; Gate 2: legal and privacy review approved; Gate 3: suppression/unsubscribe/identity/reply-stop tests pass; Gate 4: zero unattended sends and budget cap verified; Gate 5: calendar-confirmed meetings and broker authorization traced end-to-end. Then scale to 200 business prospects using per-tenant spend limits and a kill switch.
Track: eligible contacts, delivered emails, bounces, opt-outs, replies, meaningful positive replies, qualified owner conversations, held appointments, broker acceptance, contact-to-meeting rate, human review time, and cost per held qualified meeting. Maintain a manual/no-send control group where practical. **Success targets are proposed, not observed.**

**Implementation status:** documented plan only. Campaigns, actual Explee keys, scheduling, automated replies and booking are **not activated**.


## Proposed GTM experiment: signal-led personalized video outbound (October 2026)

**Status:** Strategy hypothesis for the commercialKonnect founding-broker beta; not implemented or a proven conversion uplift.

### Thesis
LeadSniperAI discovers companies showing *verifiable* expansion, new contracts, capex, receivables, inventory or property activity. An analyst maps the observation to one or two **possible** financing instruments and creates a 45–60 second, factual personalized video. A CASL-reviewed Explee email carries a video link and offers a brief discovery call with a suitable commercial-finance broker. Never infer borrowing need, preapproval, distress or eligibility from a public signal.

### Finance-product hypothesis matrix
| Verified signal | Educational financing angle | Validate with owner |
|---|---|---|
| Large invoices or receivable growth | ABL against eligible receivables, factoring, or revolving working-capital facility | AR quality, concentration, debtor terms, existing liens |
| New contracts / project backlog | Operating line of credit or purchase-order / contract finance where appropriate | Cash conversion cycle, margins, use of funds, lender restrictions |
| Equipment expansion | Equipment lease/loan or asset-backed term facility | Asset type, vendor quote, cash flow and security |
| Inventory expansion | Inventory-supported revolving credit subject to eligibility | Inventory quality, seasonality, reporting capacity |
| Commercial premises acquisition or refinance | Commercial mortgage / bridge financing | Property, equity, cash flow, timeline |

### Proposed process
1. **Discover and verify:** Yelp/GMB/Yellow Pages company → match domain/legal entity → Explee decision-maker enrichment → dated cited business signal.
2. **Research and fit:** Match signal to financing education angle and broker's documented geography/mandate. Record uncertainty and citation.
3. **Video brief:** Generate script with accurate observation, practical business benefit, neutral product education and a low-pressure question. Human reviews factual assertions, regulated claims, brand, and use of any AI avatar. Do not falsely suggest a personal relationship.
4. **Produce:** Pilot a reusable presenter clip with personalized intro/text overlay or approved synthetic presenter. Compare HeyGen versus video-link tools already tracked (Dubb, Sendspark, Hippo); validate rights, event webhooks and all-in cost. Avoid spending on bespoke clips for unqualified contacts.
5. **Distribute:** Embed a trackable landing-page/video link in an Explee email rather than a bulky attachment. Apply the SOP's explicit CASL basis, sender identity, unsubscribe, source-provider usage rights, suppression and human approval *before* importing contacts. Videos do not create a CASL exemption.
6. **Follow up and qualify:** Explee reply classification and restrained permitted follow-up; owner confirms need, timing and introduction permission before broker routing.
7. **Measure and learn:** Record message/video versions, company evidence, sends, video starts/completions where lawfully measured, positive replies, verified financing conversations, appointments held, broker acceptance and actual finance outcomes.

### 45–60 second sample script (illustrative; use only when signal is verified)
“Hi [First name]. I saw [Company] announced [verified expansion/activity] in [source/date]. Businesses undertaking projects like this sometimes consider an operating line of credit for timing gaps, or asset-based lending where eligible receivables or inventory support financing. Neither option is automatically appropriate—it depends on your cash cycle and existing facilities. At commercialKonnect, we connect owners with commercial-finance brokers who can help assess the alternatives. Would a 15-minute conversation about your plans be useful?”

### Cohort experiment and decision rules
- Run a randomized A/B comparison on **eligible, approved recipients**: (A) tailored plain-text email and (B) same core angle with a personalized video link. Hold audience, sending identity, compliance screening and cadence comparable.
- Start with no more than 25 fully reviewed BC contacts before scaling; proposed five-broker / 30-day founding cohort; up to US$1,500 **ceiling**, released in stages, not an automatic campaign spend.
- Primary measure: **cost per broker-accepted, qualified financing meeting held**. Secondary: incremental positive-reply and meeting lift, video production cost/time, deliverability, complaints and unsubscribe rate.
- Treat vendor claims like US$9 per hot lead as marketing benchmarks, **not** forecasts of qualified Canadian finance leads or meetings. No guaranteed appointment volume.
- Stop/pause if sender compliance, source rights, unsubscribes, erroneous personalization or unauthorized financing claims fail review.

### Architecture handoff
LeadSniperAI research → `financing_angle` (signal URL/date, product hypothesis, confidence) → `video_asset` (provider, template, script version, URL, approval) → Explee approved `outreach_campaign` / `message_event` → `reply_classification` → `intent_verification` → `appointment` → commercialKonnect Mission Control. Supabase is authoritative; per-tenant isolation, spend limits, provenance and approval audit required.

**Implementation status:** documentation only; no automated video creation, email sends or Explee/HeyGen provider connection activated.
