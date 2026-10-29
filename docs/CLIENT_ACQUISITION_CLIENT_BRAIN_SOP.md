# CommercialKonnect — Client Acquisition & Activation SOP v1.0

**Status:** Proposed implementation specification; not a claim that the workflows are deployed. **Date:** 2026-10-28. **Product name:** CommercialKonnect.ca; GitHub repo retains historical name KonstructionComOS.

## Purpose and two acquisition tracks
CommercialKonnect is both a broker-facing origination/marketing system and a borrower-facing financing discovery channel. Keep **paying-client acquisition** distinct from **borrower lead acquisition** and link them using a versioned Client Brain, campaign IDs and LeadOS attribution.

### Track A — Acquire commercial financing professionals
1. **ICP and territory:** Commercial mortgage brokers, business financing specialists, development finance advisors and commercial broker teams in BC, AB and ON. Filter for transaction fit, decision-maker, territory, prospecting capacity and ability to serve inquiries.
2. **Prospect discovery:** Referrals, directories, approved outreach and business/project intelligence. Record source URL/date and avoid treating a public listing as permission for marketing.
3. **Enrichment:** Verify professional identity, brokerage and commercial specialization; map problems, service verticals and relevant marketing opportunities. Never infer a lender mandate or customer funding need from weak public signals.
4. **Human-reviewed positioning:** Select offer: targeted lead intelligence; broker growth content; PDF/VSL/landing-page campaign; LeadOS qualification and client briefing. Create a factual tailored battlecard.
5. **Outreach and booking:** Use permitted channels and CASL/PIPEDA-aware contact/consent rules. Human approval of campaign copy, suppressed contacts and stopping rules. Track outbound, replies, booked demos and qualified demos.
6. **Discovery:** Capture current acquisition channels, lead-to-appointment rate, average deal quality, sales capacity, geography, loan types, differentiation and existing systems.
7. **Demonstration:** Show *illustrative* prospect intelligence, a sample Client Brain, a branded PDF creative and the actual workflow. Clearly distinguish live capabilities from demo/planned features.
8. **Offer and close:** State setup, monthly management/technology retainer, media budget, any compliant lead pricing, deliverables, acceptance criteria and privacy/data ownership; do not imply guaranteed leads or funding.
9. **Onboarding and activation:** Obtain approval for the Client Brain; provision tenant access and brand assets; configure first campaign, CTA, intake and scheduling; complete test lead and broker acceptance. Activation requires a validated end-to-end test.
10. **Review and retention:** Weekly pipeline/quality review, monthly attribution and renew/expand based on accepted consultations and client results.

**Broker CRM states:** Discovered → Verified → Fit reviewed → Contact approved → Contacted → Engaged → Demo booked → Demo completed → Proposal → Won/Lost → Client Brain approved → Campaign pilot → Active → Renew/Expand/Churn.

### Track B — Acquire and qualify borrower financing opportunities
1. Select real borrower trigger: bank decline, working capital, commercial property purchase/refinance, expansion or construction.
2. Match approved broker Client Brain (offer, ICP, geography, exclusions, availability) to campaign eligibility.
3. Assemble source-backed *neutral* financing master content. Draft broker variant with only verified claims and approved branding.
4. Human financial/compliance gate; design the PDF, video/VSL and WordPress landing page from one campaign brief. Use the [Creative PDF Production SOP](https://app.notion.com/p/4079e94cf0a481468803f94977f6aa4a).
5. Publish to permitted channels with consistent promise and campaign/variant identifiers. Separate delivery opt-in from marketing consent.
6. Route voluntary assessment to LeadOS; deduplicate; record requested financing purpose, range, jurisdiction, timing and security as *self-reported*, not verified.
7. Human-review suitability and permitted sharing before broker introduction. No automatic credit decision, promised approval or unverifiable “prequalified” label.
8. Track accepted referrals, attended consultations and downstream outcomes. Feed de-identified objection and fit trends back into a proposed Client Brain update.

**Borrower states:** Visitor → PDF requested → Delivered → Assessment started → Submitted → Consent verified → Fit reviewed → Broker offered → Broker accepted/declined → Booked → Attended → Outcome.

## Viral Content Engine extension — October 29, 2026

Track B now includes the [Custom Viral Content Engine workflow](VIRAL_CONTENT_ENGINE_ACQUISITION_FUNNEL.md): research → problem definition → platform-native video → checklist → optional assessment → Atomic CRM → human-reviewed broker introduction → consultation → outcome. Start with BC contractor cash flow and the CASHFLOW checklist CTA. The specification maps all 16 commands and /workflow, campaign attribution, consent, CRM deduplication, failure handling and validation.

Track A uses the sample campaign in broker demos and activates it against an approved Client Brain. Borrower inquiries remain distinct from paying-client acquisition. This is a documented manual-first process; plugin/API, publishing, DM and CRM automations remain unconnected until verified.

## Client Brain contract and separation

| Brain | Contains | Can affect |
| --- | --- | --- |
| Content Brain | Approved financing education, evidence, disclaimers, master assets | Reusable neutral content |
| **Broker Client Brain** | Verified specialties, ideal client profile, territory, preferred financing types, exclusions, capacity, branding, CTA, approved proof points, targets | Broker-specific campaigns, fit and assignment |
| Borrower Opportunity Brain | Consented assessment facts, provenance, status, owner, next action | Restricted qualification and broker servicing only |

**Required versioned fields:** client_id, tenant_id, client_brain_version, owner, review_date, approved_by, evidence_status, jurisdictions, specialties, funding_range_preferences, target_industries, exclusions, approved_claims, brand_assets, consultation_url, response_sla, broker_capacity, marketing_permissions.

Maintain `client.brain.md` as a **schema/template only** in the repo. **Never commit actual clients' business secrets, personal borrower data, CRM exports, API keys or underwriting records.** Store production records in tenant-isolated authorization-controlled systems with audit logs. Reconfirm any licensing/claims that change.

## Cross-system handoff

```text
Prospect discovery / LeadSniperAI → broker acquisition CRM → discovery/demo
→ proposal / agreement → approved broker Client Brain
→ content brief + verified claims → PDF / HeyGen VSL / advertorial / landing page
→ traffic + consented assessment → LeadOS dedup and qualification
→ fit + consent + capacity review → broker introduction → consultation
→ outcome dashboard → proposed Client Brain updates (human approved)
```

Core IDs: `tenant_id`, `client_id`, `client_brain_version`, `campaign_id`, `creative_id`, `pdf_asset_id`, `pdf_variant_id`, `lead_id`, `broker_id`, `consent_scope`, `event_id`. Protect sensitive borrower details; do not propagate them into creative prompts or analytics logs.

## Metrics and economics

**Broker acquisition:** verified prospects, permitted outreach rate, positive response, demos booked/held, proposals, wins, activation time, cost to acquire client, monthly recurring revenue, pilot renewal and gross margin.

**Borrower funnel:** unique landing visitors, PDF requests/deliveries, assessment starts/submissions, consent verification, qualified requests, broker acceptance, booked and attended consultations, time-to-first-contact, cost per *accepted* or *attended* consultation, downstream funded outcome when verifiable.

Use explicit denominators, cohorts and campaign-level attribution. Proposed pilot goals are *hypotheses*, not actual traction. Report negative-match reasons, opt-outs, false-positive signals and research cost.

## Operational controls and gates

- **A0 prospect permitted:** contact source, identity, legal contact basis, suppression check, suitable ICP.
- **A1 demo qualified:** broker authority, service territory and acquisition problem confirmed.
- **A2 client activated:** signed commercial terms, verified Client Brain, consent/branding authorization, tested lead and broker routing.
- **B0 content approved:** financing source register + dated claims, no false lender guarantees.
- **B1 launch approved:** creative/CTA QA, current disclosures, working consent and unsubscribe, CRM UAT.
- **B2 referral approved:** borrower permission, fit, available broker and human-reviewed introduction.
- **B3 learning approved:** sanitized outcomes and Client Brain changes explicitly approved by client owner.

Disallow autonomous outreach and any multi-broker sharing without a specific lawful basis and scope. Revoke/expire stale claims and suppression overrides. Maintain rollback procedure for an invalid PDF, landing page or routing rule.

## First buildable slice (avoid overscoping)
1. **Schema and sample:** versioned broker Client Brain fields and two fully synthetic profiles with opposing ICP/exclusions.
2. **Review queue:** manually approve broker prospect, message and Client Brain; capture reasons for rejection.
3. **Campaign template:** connect one Client Brain snapshot to PDF-01 and one landing-page CTA without modifying shared financial claims.
4. **LeadOS event model:** instrument test events, consent scope, qualified-lead disposition, broker acceptance and appointment.
5. **Human test:** run one synthetic case matched to a broker and a second rejected by exclusions. Confirm no tenant-data leakage.

**Out of scope until verified:** autonomous outreach, real loan underwriting, live lender matching, guaranteed lead delivery and automated funding decisions. Existing repo README documents unimplemented GTM and Supabase tracks; this SOP does not override those boundaries.

## Rollout and ownership
- Sprint 1: schema/consent contract, synthetic profiles, acquisition pipeline SOP and QA requirements.
- Sprint 2: broker acquisition demo and Client Brain onboarding checklist.
- Sprint 3: PDF-01 campaign mapping, landing page and test LeadOS handoff.
- Sprint 4: pilot feedback, metrics, broker renewal decision and change log.

**Definition of done:** a documented broker acquisition path; a client-approved versioned Brain; controlled content variants; reproducible lead handoff with consent; measured accepted consultations; failure/rollback and audit trail.

## Related reference material
- [CommercialKonnect PRD](COMMERCIALKONNECT_PRD.md)
- [Commercial financing video sales](COMMERCIAL_FINANCING_VIDEO_SALES.md)
- [LeadSniperAI directory enrichment SOP](LEADSNIPER_DIRECTORY_ENRICHMENT_SOP.md)
- [Notion PDF Intelligence Factory](https://app.notion.com/p/4079e94cf0a481aab36cc2126e747848)
- [Notion Creative PDF SOP + Client Brain integration](https://app.notion.com/p/4079e94cf0a481468803f94977f6aa4a)
