# CommercialKonnect Australia — Secondary-Market Funding Pipeline Blueprint
**Status:** Implementation handoff / pre-launch. **Primary market:** Canada (BC pilot). **Secondary:** Australia (NSW discovery pilot). **Source:** user-supplied *Commercial Pipeline Blueprint* (15 pages, November 2026). Companion research: [Australia market expansion](./AUSTRALIA_BUSINESS_FUNDING_MARKET_EXPANSION.md).

## Objective and market isolation
Treat Australia as a **second jurisdiction**, not an extension of Canadian finance offers. The shared application should use jurisdiction-specific currency, locale, eligibility, disclosures, provider agreements, contact permissions, reporting and assignment rules. Canada stays the default. The current prototype home page is an illustrative BC project dashboard, not CommercialKonnect's live public site. The AU route `/markets/australia` is an informational pre-launch page.

## Blueprint-derived product taxonomy (pages 4–7)
| AU product key | Public label | Indicative amount from blueprint | Required qualification dimensions |
|---|---|---|---|
| `working_capital` | Business loans & working capital | A$5k–A$250k | Purpose, turnover, cash-flow gap, time-to-funds, security |
| `asset_finance` | Equipment & asset finance | A$20k–A$500k+ | Asset type, quote, deposit, supplier, term, existing obligations |
| `invoice_finance` | Invoice & debtor finance | Receivables-linked | Eligible unpaid B2B invoices, debtors, terms and concentration |
| `commercial_property` | Commercial property finance | A$500k–A$50m+ | Property, valuation, LVR, debt service, equity and project purpose |
| `revolving_credit` | Overdrafts & lines of credit | A$10k–A$150k | Liquidity profile, seasonality, projected usage and security |

All amounts are **illustrative from supplied material** and must not be presented as actual lender terms. The earlier research strategy prioritizes working-capital/LOC, term loan and invoice finance for NSW; the full five-product list is a taxonomy, not a simultaneous product launch.

## Demand generation (pages 8–11)
Three acquisition pillars:
1. **Organic inbound:** educational local SEO, useful product guidance, verified search-intent and permissioned assessments.
2. **Partner referrals (COI):** accountants/bookkeepers, business consultants, commercial real estate professionals and lawyers, with relationship ownership, attribution and documented permitted compensation.
3. **Qualified paid and sales outreach:** paid inbound and lawful outbound discovery; no harvested public contacts auto-enrolled into campaigns.

Distinguish `aged_data`, `shared_realtime`, `exclusive_realtime`, `live_transfer`, and `coi_referral` acquisition categories. Blueprint page 11 lists indicative lead price/contact-rate ranges, **not verified AU pricing**. Do not convert these into public offers without partner evidence.

## Conversion and unit economics (page 12)
`CPFD = total_acquisition_and_qualification_cost / funded_deals` across a defined cohort, with no division by zero. Track contact, qualification, partner acceptance, funded and collected-fee rates separately.
- Hypothetical aged lead: 100 × A$3 = A$300; 10% × 10% × 10% = 0.1 expected funded deals; modelled CPFD A$3,000.
- Hypothetical exclusive: 1 × A$90, 50% × 50% × 50% = 0.125 expected funded deals; modelled CPFD A$720.
These are **model examples only**, not observed AU economics. In addition report cost per **partner-accepted** lead, gross margin, refunds, rejection cohorts and cash collected.

## Target orchestration (pages 13–14)
`AU lead -> source/provenance -> consent proof -> canonicalize/dedupe -> confirm borrower intent (BANT plus finance-specific fields) -> jurisdiction/product gate -> eligibility matching -> human approval -> partner acceptance -> appointment/funding status -> Billr reconciliation -> outcome feedback`.

- **LeadSniperAI / Harvey:** external business signals and evidence-backed research, **never** equate signal with borrowing permission.
- **Sales Bird:** relationship-based Australian accountant/broker partner development, human-approved compliant communication.
- **Sanity / OpenSEO / Astro proposal:** AU en-AU content, local intent, citations, editorial approval, jurisdiction-specific disclosures.
- **Supabase:** canonical opportunities, consent records, provider mandates, audited transitions, strict tenant RLS.
- **Hermes / ICM:** approve-before-send gates; no autonomous partner distribution or lender decision.
- **CommercialKonnect CRM / Billr:** single opportunity record, acceptance/decline reason, authorized billing.

## Candidate database entities (not yet migrated)
- `markets`: country ISO code, locale, currency, state vocabulary, launch/status flags.
- `finance_products`: market scope, standardized category key, status and disclaimer.
- `partner_mandates`: legal identity / ABN, states, verified product appetite, funding limits, accreditation evidence, SLA, effective date and signed contract reference.
- `funding_enquiries`: originating tenant, country/state, borrower entity, purpose, AUD amount, funding timeline, evidence, status and provenance.
- `consent_events`: disclosure version, lawful purpose, recipient scope, timestamp, capture evidence, withdrawal.
- `route_decisions`: eligible partners, rule snapshot, human reviewer, approval timestamp, accepted/rejected status and reasons.
- `funding_outcomes` and `billing_events`: funded amount, actual verified status, fee type, fee authorization and payments.

**Invariants:** verify server-side organization identity and RLS; no cross-market campaign audience by default; consent may restrict specific partner recipients; idempotent handoff; never expose financial statements in analytics/ad pixels; respect retention and deletion. No migration is authorized merely by this document.

## Australia regulatory and launch gates
Australian legal counsel must review the proposed introducer, referral, credit and compensation activities across business-purpose products; assess ASIC/ACL requirements where relevant, Privacy Act/APPs, overseas disclosure and data transfers, Spam Act and Do Not Call compliance. Require signed partner agreements, approved advertising claims, tested consent capture, organization isolation and human authorization **before** production routing, payments or financing submissions.

## MVP delivery sequence
1. **Now (this PR):** register Australia as visible pre-launch secondary market, publish informational AU route and blueprint handoff; leave BC demo and production logic unchanged.
2. **P0 research:** partner interviews and legal clearance; verify product ranges and state coverage.
3. **P1 architecture:** localised assessment + consent/event model + user/tenant restrictions + automated tests.
4. **P2 pilot:** one NSW construction working-capital cohort, verified partners, human-reviewed introductions and measured acceptance.
5. **P3 expansion:** more Australian states and products based on funded outcomes and positive unit economics.

## Acceptance criteria for later functional implementation
- Canadian visitors remain in CAD/en-CA; AU views use AUD/en-AU and explicit launch status.
- Funding enquiries cannot route without Australian partner mandate, verified consent, and human approval.
- No lender rate/approval/commission or contact-rate statistics are fabricated.
- RLS denies cross-tenant access and market-specific outreach suppression applies.
- Outcome dashboard separates qualified, partner-accepted, funded and paid events.
- Cross-jurisdiction privacy review and partner approval are recorded before launch.

## Source references
- User-uploaded *Commercial Pipeline Blueprint*, pages 2–3 (demand/supply and market composition), pages 4–7 (five products and matching), pages 8–12 (lead source tiers and conversion examples), pages 13–15 (routing and operations).
- [Existing Australia Market Expansion Plan](./AUSTRALIA_BUSINESS_FUNDING_MARKET_EXPANSION.md): evidence caveats, NSW-first pilot, compliance and unit economics.
- [CommercialKonnect PRD](./COMMERCIALKONNECT_PRD.md): original Canadian acquisition and broker/CRM requirements.

**Evidence caution:** presentations include approximate market numbers, lead-price/contact-rate assumptions and loan size ranges. Their underlying sources have not been validated as part of this feature. No Australian production connectivity or licensed partner arrangement is claimed.
