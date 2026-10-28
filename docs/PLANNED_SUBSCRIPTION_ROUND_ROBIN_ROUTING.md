# Planned Feature — Subscription Weighted Round-Robin Broker Routing

**Status:** Planned / not implemented · 2026-10-27 · **Dependency:** jurisdiction-specific mortgage/referral/privacy/telemarketing review and brokerage approval before compensated lead routing.

## Objective
Eliminate founder review as a dependency for routine administrative processing of consented, phone-verified preliminary commercial-financing inquiries. Use eligibility-first weighted round-robin to offer **one inquiry to one broker at a time**, with capped allocations, response SLAs and auditability. Dennis may optionally review a **separate high-value co-broker candidate queue**; no automatic co-broker engagement.

## End-to-end planned workflow
1. Borrower completes minimal preliminary commercial-financing intake with recipient/consent disclosures. Store proof, disclosure version, time, purpose, jurisdiction and allowed recipients. No credit inquiry or underwriting implied.
2. Consent-compliant telephone follow-up (human or appropriately disclosed/authorized AI) validates contact, decision-maker, stated financing purpose/amount/timing and missing information; record verification status, not a creditworthiness decision.
3. Intake is deduplicated and checked for security, freshness, complete consent, province/product scope and required human/regulatory review. Leads without confirmed intent never become qualified borrower inquiries.
4. Broker pool filters on current authorized brokerage/registration, jurisdiction, specialty, deal-size acceptance, capacity, active subscription, remaining allowance and permitted compensation structure.
5. **Weighted fair allocator** selects next eligible broker according to tier weight and prior accepted allocations; **caps are hard limits**, not guaranteed inventory. Use transaction locking/idempotency to avoid double assignments. Rotation occurs inside compatible province/product pools, not across incompatible businesses.
6. Broker receives time-limited **exclusive offer/reservation**; accept/decline/expire states are recorded. On decline/expiry, release reservation and sequentially offer next eligible broker, respecting the consented recipient scope. Charge quota only for accepted, contract-qualified inquiries; reversals/credits restore entitlement according to documented rules.
7. CRM records consent provenance, source/UTM, call verification, offers, acceptance, timestamps, response SLA, outcome, disputes and invoice/credit events. If no eligible broker, place in **unassigned/operations exception queue**—never leak or auto-sell elsewhere.
8. Separately flag high-value dossiers for Dennis/authorized brokerage **review consideration only**; no implied mandate, shared duty or commission entitlement. Once explicitly accepted as co-brokered, lock out lead resale/reallocation and follow brokerage disclosures and agreements.

## Tier experiments (CAD, unvalidated and contingent on legal approval)
| Tier | Proposed monthly fee | Max accepted leads per cycle | Weight |
|---|---:|---:|---:|
| Founding | $999 | 3 | 1 |
| Growth | $1,995 | 6 | 2 |
| Regional | $3,495 | 12 | 4 |

Weights influence ordering **only among qualified eligible brokers** and must not override jurisdiction/consent/product matching. Do not guarantee a minimum unless backed by proven inventory and remedies. Monthly subscription revenue must be segregated from per-lead sales, services and co-broker commissions. Paid inquiry allocation itself may constitute regulated referral remuneration regardless of the 'subscription' label.

## State and data model (planned)
- **BrokerSubscription:** broker_org_id, brokerage_id, verified_license/jurisdiction, specialties, accepted loan_min/max, territory, paused/status, plan, billing_cycle, lead_cap, weight, quota_used, version, regulatory approval flag.
- **BorrowerInquiry:** inquiry_id, tenant/owner, purpose/product, property location, requested amount band, timeframe, contact_verified, financing_intent_confirmed, soft_application_status, source, consent_id, sensitivity_class.
- **ConsentRecord:** subject, purpose, disclosure_version, capture_channel/time, named/defined recipients, marketing/call permissions, revocation status/time, evidence.
- **RoutingOffer:** inquiry_id, eligible_pool_version, broker_org_id, offered_at, expires_at, status (reserved/accepted/declined/expired/credited), routing_reason, idempotency_key, audit_event_ids.
- **AllocationLedger:** broker_org_id, billing_period, inquiry_id, accepted_at, debit_or_credit, dispute_reason; transactionally consistent with active reservation.
- **CoBrokerCandidate:** inquiry reference, high-value trigger, human-review status, brokerage authorization and engagement/disclosure record (only after human acceptance).

## Acceptance criteria / tests
- Ineligible, unlicensed, wrong province/product, paused, exhausted, consent-incompatible brokers receive **zero** offers.
- Same inquiry cannot be simultaneously offered/allocated to different buyers, absent specifically approved shared-lead product and explicit borrower consent; default exclusive.
- Under identical eligibility and sufficient inventory, relative allocations approach 1:2:4 before caps; once capped, spillover redistributes among eligible remaining buyers. No starvation across cycles.
- Accept before expiry creates one immutable accepted allocation and one quota debit; repeated requests/timeouts cannot double bill.
- Decline/expiry moves to next eligible buyer or exception queue; refund/credit is logged and quota adjusted as authorized.
- Consent withdrawal stops future offers and triggers applicable data retention/notification workflow.
- Every routing action has an explainable reason, consent evidence, eligibility snapshot, timestamps and audit actor.
- Tenant isolation prevents brokers seeing other brokers' leads, pricing or confidential CRM notes.
- Co-broker queue is review-only and never automatically assigns Dennis a regulated role.
- Load test 200+ accepted leads/month without manual review of routine cases; **90% administrative automation is a target, not an achieved claim**.
- Simulate two identical concurrent assignments and broker response racing expiry to prove atomic reservation and exactly-once ledger writes.

## Delivery phases
- **P0 (safe prototype):** simulated inquiries, broker profiles, tier limits, deterministic eligibility-first weighted allocator, queue states, audit log, admin controls; no real compensated routing.
- **P1 (consented pilot):** real consented intake, compliant follow-up, brokerage verification, broker portal accept/decline, manual exception review and reporting; activate only flows approved by counsel/brokerages.
- **P2 (scale):** billing entitlements, refunds/credits, concurrency hardening, route performance, localized compliance policy, province-by-province rollout and operational alerting.

## Dependencies and stop conditions
BC BCFSA Mortgage Services Act, brokerage accounting/disclosure, real estate lead-generation licensing if applicable; Alberta RECA, Ontario FSRA and other jurisdictions; privacy legislation, CASL, CRTC automated-call consent. Before monetizing subscription allocations obtain counsel and brokerage approval by province and product. **No regulatory approval => no paid lead routing**. Human broker retains financing-advice, application assessment, underwriting and client-engagement responsibilities.
