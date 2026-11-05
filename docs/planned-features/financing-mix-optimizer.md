# Planned Feature — Financing Mix Optimizer (CK-MIX-001)

**Status:** Planned / discovery; no algorithm, lender pricing, underwriting engine, or automatic advice implemented.  
**Product:** commercialKonnect borrower-facing financing comparison + financial-professional marketplace; broker workspace/Atomic CRM.  
**Priority:** P0 data capture → P1 explainable scenarios → P2 verified lender data → P3 outcome feedback.

## Objective

Help a Canadian business owner understand whether one product or a **mix of financing facilities** may fit their borrowing needs, before selecting appropriate financing professionals. Optimize a *potential financing strategy*, not credit approval. Connect to the existing progressive assessment, interest savings calculator, and consent-based specialist matching.

## Illustrative borrower problem

A company seeks $1,000,000: $300K equipment, $250K working capital, $350K property improvements, $100K inventory. A candidate combination could include equipment financing $300K, business LOC $250K, property-secured financing $350K, and inventory/ABL $100K. **This is a teaching example, not an available offer or assurance that a facility can finance those uses.** Multiple facilities may conflict via cross-defaults, general security agreements, lien priority or intercreditor consent.

## User journey

`Homepage slider / public guide → anonymous adaptive assessment → purpose-and-amount allocations → cash-flow/collateral context → candidate financing structures → compare three explainable scenarios → borrower adjusts preferences → preview relevant verified professionals → opt-in introduction + separate permissions → contact/intent verification → specialist matching → Atomic CRM`.

Keep anonymous education available without contact gating. If there is not enough information, display **insufficient data** and request only the next material question. Never declare eligibility or publish actual lender-specific pricing without verified data and authorized presentation.

## Five-layer processing pipeline

1. **Business assessment:** financing purpose, amount allocation by use, province, timing, months operating, industry, revenue band, working-capital seasonality, property and equipment availability, broad cash-flow/repayment information. Avoid unnecessary sensitive data, SIN, bank credentials and bank statements in MVP.
2. **Feasibility and constraints:** minimum/maximum facility sizes; purpose restrictions; maturity/refinancing risk; indicative debt-service affordability; requested liquidity; collateral value bands and ownership; existing encumbrances; cumulative collateral allocation; security priority and borrower guarantees. Unknowns are explicitly flagged, not assumed true.
3. **Generate candidates:** single-facility baseline plus feasible combinations of commercial mortgages/refinancing, term debt, revolving business credit, equipment finance, receivables/inventory ABL, construction/development or other suitable products.
4. **Compare outcomes:** projected total interest and fees over the same horizon, payment/DSCR or cash-flow burden, collateral/guarantee exposure, flexibility, funding-timeline suitability and complexity. Evaluate alternatives under transparent rate/fee scenarios; avoid comparing unlike factor rates and annual rates without a disclosed conversion.
5. **Specialist matching:** suggest licensed commercial mortgage professionals, business finance consultants, equipment/ABL specialists, or a permitted combination, using validated jurisdiction, expertise, buyer capacity, availability and consent; no automatic multi-recipient resale.

## Scenario recommendations

Show up to three **illustrative scenarios**, where feasible:
- **Lower estimated all-in financing cost:** prioritize modeled interest and fees while respecting mandatory constraints.
- **Greater cash-flow flexibility:** prioritize payment/working-capital liquidity, disclose possible higher total costs.
- **Reduced collateral exposure:** minimize pledged assets/guarantees, disclose potential rate and availability trade-offs.

For each: facility mix, allocated amount, purpose mapping, terms and assumptions, modeled payment / total-period interest + fees, remaining balance, security exposure, open underwriting questions, rationale, uncertainty, and actions to validate with a professional. If fewer than three genuinely differentiated feasible scenarios exist, show fewer. Always include a **single-facility baseline** when a comparable one is available.

### Proposed scoring — hypotheses only

A multi-objective weighted model may start with **30% all-in cost, 25% cash-flow burden, 20% collateral/guarantee exposure, 15% flexibility, 10% timeline**. These weights are exploratory and must be validated against broker and borrower preferences. **Apply hard constraints first**; never let an attractive score override a disqualifying restriction. Permit user preference adjustments and visibly explain trade-offs.

## Design contracts

**Inputs:** `assessment_session_id`, `requested_total_cad`, `purpose_allocations[]`, `province`, `requested_timeline`, `borrower_profile`, `asset_bands[]`, `existing_debt_context`, `preferences`.

**Outputs:** `mix_scenario_id`, `rule_version`, `price_source_version`, `assumptions[]`, `facilities[]`, `uses_covered[]`, `unfunded_amount`, `hard_constraint_failures[]`, `cost_comparison`, `collateral_exposure`, `risk_flags[]`, `confidence_or_unknowns`, `professional_specialties[]`, `reason_codes[]`, `review_required`.

**Persistence (proposed; align actual Supabase schema first):** `financing_purpose_allocations`, `financing_rule_sets`, `financing_product_constraints`, `financing_mix_scenarios`, `financing_mix_facilities`, `scenario_assumptions`, `scenario_feedback`, `scenario_audit_events`. Maintain session TTL, versioning, per-tenant RLS and consent boundaries; don't copy anonymous assessment data into broker-accessible tables by default.

**Computation:** deterministic and testable rule engine/optimizer; reproducible inputs and outputs; positive financing amounts sum to requested total within a documented rounding tolerance; no double-pledging collateral; security priority/intercreditor conflicts flagged; debt-service and cost comparisons use consistent terms/horizon and include fees. AI may help explain results and research sources, but must not invent rates, eligibility, approvals or legal conclusions.

**Security/compliance:** results educational, not financial advice or a binding quote; Canadian provincial licensing and referral rules to be confirmed; protect applicant data; do not transmit sensitive financing profiles to ad networks. A broker must independently validate suitability and a lender independently approves financing.

## Implementation roadmap

- **P0 — Enhanced assessment:** capture purposes, budget allocations and broad collateral/repayment preferences; validate totals and completeness; do not make automated financing recommendations.
- **P1 — Explainable mix MVP:** fixed product definitions, transparent assumptions, scenario generation, cost/cash-flow comparison, what-if allocation UI, professional specialty matching; require a human review gate for personalized recommendations.
- **P2 — Real lender criteria and pricing:** contractually permitted, sourced and timestamped lender product catalog with eligibility and rate observation lifecycle, pricing/fee comparisons, validity controls, and audit.
- **P3 — Learning and optimization:** verified broker outcomes, borrower feedback, scenario effectiveness and calibrated ranking; no automated approval or unreviewed ML-based suitability decisions.

## Test and acceptance gates

1. Allocate a $1M requirement across multiple purposes and produce internally consistent scenarios; detect unfunded needs, facility overlap and conflicting collateral.
2. Hard constraints (jurisdiction, product use, repayment, collateral and minimum size) eliminate or mark invalid candidates before scoring.
3. Show cost/fees, interest-only vs amortizing schedules, payment burden and collateral exposure with traceable assumptions. No invented lender rates or guaranteed savings.
4. User can compare one-product baseline to feasible mixes and see understandable reasons for each; if not feasible, honest incomplete assessment with review path.
5. Borrower can view anonymous scenarios without providing identity; contact+referral and marketing consents remain separate, with explicit broker selection and a governed handoff.
6. Deterministic results are reproducible under the same rule/pricing version, with audit, accessibility, tenant isolation and privacy tests.
7. A lead is not marketplace-eligible until financing intent/contact is confirmed and permissioned matching requirements are satisfied.

## KPIs

Scenario engagement; percentage of assessments with usable purpose allocation; opt-in-to-verified conversation; specialist match/acceptance; funded-outcome feedback rate; cost and time to create reviewed scenario; satisfaction, error/override and compliance incidents. **Do not optimize for complex structures or lead revenue at the expense of borrower suitability.**

## Related documents

- [Website PRD, Sections 17–22](../COMMERCIALKONNECT_PRD.md)
- [Homepage implementation handoff](../HOMEPAGE_IMPLEMENTATION_HANDOFF.md) (on feature branch pending merge)
