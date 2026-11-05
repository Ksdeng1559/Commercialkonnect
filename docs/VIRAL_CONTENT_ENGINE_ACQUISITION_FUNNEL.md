# CommercialKonnect — Viral Content Engine Customer Acquisition Funnel
Updated: 2026-10-29
Status: documented operating workflow and implementation handoff; no plugin API, social publishing, DM automation or CRM integration deployed by this change.

## Role of the Custom Viral Content Engine
Use the user-supplied v10.0 command menu as the content planning framework:
**Problem → Emotion → Framework → CTA → Lead → CRM → Revenue.**

The Custom Viral Content Engine is a creative/research layer. Its commands are prompts executed in its own supported environment; they are not application routes, GitHub Actions or verified API endpoints. No callable integration, plugin identifier, authentication contract or webhook was supplied. Begin with manual export/import of approved campaign briefs. Add an adapter only after actual integration capabilities are verified. Never invent trending audio, viral performance or demand scores.

This extends Track B in [Client Acquisition & Activation SOP](CLIENT_ACQUISITION_CLIENT_BRAIN_SOP.md). Track A continues to acquire paying brokers. Demonstrate this campaign workflow during broker discovery; activate borrower campaigns only against an approved Broker Client Brain, territory, exclusions and capacity. Do not count borrower inquiries as broker subscription wins.

## Command-to-deliverable workflow
| Step | Commands | Required output and decision |
| --- | --- | --- |
| 1 Research | /trendmine | Audience pains, observed posts/audio and dated source links; label original hooks as hypotheses |
| 2 Validate | /demandengine | Evidence, geography, demand/competition assumptions and priority; distinguish measured metrics from editorial judgment |
| 3 Define | /reverse, /pdd | Problem, emotion, desired outcome, objections, educational framework, one offer and CTA |
| 4 Choose channels | /platformscore | Platform roles and rationale; no unsupported performance ranking |
| 5 Create | /contentengine | Approved thesis, hook variants, scripts and claim ledger |
| 6 Adapt/produce | /platformadapt, /instagram, /tiktok, /youtube, /facebook, /videoplan | Native edits, captions, storyboard, narration, licensed audio and destination |
| 7 Capture | /pdffarm | Reviewed checklist/guide, final accessible PDF and matching landing page |
| 8 Convert | /funnel | Resource delivery, optional assessment, consent capture, Atomic CRM handoff and consultation |
| 9 Measure | /analytics | Cohort scorecard, explicit denominators and downstream results |
| 10 Improve | /clone | Evidence-backed variation of a winner; preserve source/variant lineage |

Master prompt: `/workflow CommercialKonnect — BC contractor cash-flow financing`.
Run each stage with reviewable outputs; the master command does not authorize publishing, messaging or external account changes.

## First pilot: BC contractor cash flow
Audience: BC trade and contracting businesses with active work and delayed collections.
Problem: payroll and materials fall due before customer payments.
Outcome: understand the timing gap and prepare for a financing conversation.
Offer: **BC Contractor Cash-Flow Readiness Checklist**.
CTA: **Message CASHFLOW for the checklist**, only where the inbox is staffed or a tested delivery workflow exists. Otherwise use a working checklist-request page.
Proposed landing page: `/contractor-financing`; not verified live.

Test three openings against the same offer, body and CTA:
1. Payroll: “Your crew gets paid Friday. Your customer pays in 60 days. Now what?”
2. Contract: “You won the contract. Can you afford to deliver it?”
3. Invoices: “Profitable on paper. Waiting on invoices. Short on cash.”

These are creative hypotheses, not observed viral posts or statistics. “60 days” is an illustrative scenario. Start with Instagram and Facebook for a shared production process; adapt to TikTok and YouTube Shorts after the core flow works. This operational priority does not supersede the wider playbook's bank-decline and property campaigns.

### Thirty-second script and production
Draft narration; time the actual recording before release:
> Your crew gets paid Friday. Your customer pays in 60 days.
>
> That gap can put pressure on a busy contracting business.
>
> Before borrowing, write down three numbers: what’s due, what cash is coming in, and when it arrives.
>
> Then compare the full repayment cost against your cash flow.
>
> CommercialKonnect helps BC business owners explore financing options and connect with financing professionals.
>
> Message CASHFLOW for the readiness checklist.

Include a legible disclosure: “Financing is subject to lender approval and eligibility.”
| Time | Visual | Caption |
| --- | --- | --- |
| 0–4s | Payroll calendar and invoice | Payroll Friday. Payment in 60 days. |
| 4–10s | Owner reviewing bills | Busy business. Cash-flow pressure. |
| 10–18s | Three-number exercise | What’s due? What’s coming? When? |
| 18–24s | Repayment comparison | Check the full repayment cost. |
| 24–30s | Presenter, logo and CTA | Message CASHFLOW |

Use HeyGen for presenter narration and licensed/owned supporting visuals. Original voiceover with cleared instrumental is the default. Record track, source, check date, region, business-use and placement permissions before release. A track's popularity does not establish commercial permission. Recheck trend evidence close to production; do not carry unverified sound rankings from previous conversations into campaigns.

### Checklist specification
Produce a reviewed PDF from these nine prompts:
- Available business cash.
- Payroll, materials and essential payments due in the next 30 days.
- Expected collections and realistic receipt dates.
- Approved versus disputed invoices.
- Largest cash shortfall before collections arrive.
- Funding purpose, amount and expected repayment source.
- Documents to prepare: recent statements, financials, receivables and existing debt details.
- Comparison: total repayment, payment frequency, fees, security and guarantees.
- Stress test: largest customer pays 30 days late.

Closing CTA: bring the checklist to an optional financing review.
The three-number exercise is a first screen; use dated inflows/outflows to calculate peak shortfall. Distinguish a temporary timing gap from ongoing losses. Never request bank statements through public comments or social DMs. This specification is not a generated PDF.

## Resource request to consultation
| Stage | Action and exit condition |
| --- | --- |
| Request | Capture keyword or form source; do not infer borrowing intent from a view or comment |
| Deliver | Send the requested resource after the link is verified; resource delivery alone grants no ongoing marketing permission |
| Assess | Offer optional questions: location, industry, approximate amount, purpose and timeframe |
| Consent | Record follow-up permission separately from broker-sharing permission and optional marketing; preserve notice/version/timestamp |
| CRM | Authorized server-side adapter upserts company/contact and an opportunity for an actual financing request; deduplicate before creating |
| Review | Human confirms self-reported fit, exclusions, province, permission and broker capacity |
| Introduce | Share minimum necessary data with the approved broker within the recorded permission scope |
| Consult | Record booking, attendance and broker acceptance separately |
| Outcome | Record application/funding only when confirmed; attribute actual fees/revenue separately from loan principal |

Atomic CRM is the intended CRM destination. LeadOS/LeadSniperAI may supply intake and qualification functions when verified; avoid duplicate systems of record. GoHighLevel is optional only if separately connected and explicitly selected. Existing Atomic CRM deployment or MCP availability does not prove this handoff is configured.

For a keyword request, the manual reply should deliver the requested resource and offer an optional assessment. Do not auto-enrol requesters in nurture or email commenters through Harvey/Mystrika. Maintain existing suppression handling and separate permitted B2B outbound from this inbound funnel.

## Campaign and CRM handoff contract
Proposed mapping fields, not a claim these columns exist in Atomic CRM:
- Identity/lineage: campaign_id, creative_id, hook_id, asset_id, lead_id, event_id, client_id, client_brain_version.
- Attribution: platform, source_post_url, utm_source, utm_medium, utm_campaign, utm_content, landing_page, first_touch_at, latest_touch_at.
- Self-reported assessment: business location, industry, purpose, amount band, timing, qualification status and reason.
- Permission: follow_up_scope, broker_sharing_scope, marketing_opt_in, consent_at, notice_version, withdrawal_at.
- Operations: assigned owner, next_action_at, broker_id, broker acceptance, consultation status and outcome.

Derive tenant authorization from verified server identity. Confirm actual CRM schema and API/MCP capabilities before implementation. Keep borrower details in access-controlled CRM/intake storage, never Git, creative prompts or analytics payloads. Use tenant-scoped deduplication, stable event IDs and idempotent retries. Failed writes enter a monitored retry queue without losing the original request. Suppression/withdrawal blocks further contact and sharing outside any independently valid servicing basis. Do not deduplicate unrelated tenants into a shared borrower record.

## Measurement and weekly decisions
Funnel: views → requests → delivered → assessments → qualified inquiries → broker accepted → booked → held → application → funded → attributable revenue.
Keep broker acceptance and appointment events independently timestamped; their order can vary.

| Metric | Calculation |
| --- | --- |
| Qualified inquiries per 1,000 views | Unique qualified inquiries / platform-reported views × 1,000 |
| Assessment completion | Unique submitted assessments / unique assessment starts |
| Booking conversion | Unique inquiries with booking / unique qualified inquiries |
| Attendance | Consultations held / consultations scheduled to occur in cohort |
| Broker acceptance | Accepted referrals / referrals offered to brokers |
| Cost per accepted consultation held | Attributable campaign cost / unique consultations both accepted and held |
| Lead-sale revenue, if applicable | Verified billed lead fees less credits/refunds; never loan principal |

Use campaign × hook × platform × segment cohorts and a consistent window. Define qualified as a self-reported BC business with purpose, approximate amount and timing; this is not lender eligibility or credit approval. Deduplicate inquiries, distinguish repeat plays from unique reach, keep retention comparisons within a platform, and show zero-denominator metrics as unavailable. Separate media-only cost from full production/operating cost.

Review after seven days; the first week establishes a baseline, not a statistical winner. Compare cohorts with enough relevant inquiries to support a decision. Strong reach but weak inquiries → revise offer/CTA. Qualified inquiries but few bookings → inspect response time and scheduling. Poor broker acceptance → revise fit and intake. Clone useful concepts for HVAC, electricians and renovation firms only after quality review. Track application/funding over longer windows; do not judge those outcomes after seven days.

## Build sequence and acceptance
1. Manual pilot: approved brief, one PDF, working page, staffed inbox, consent records, manually recorded CRM handoff and owner.
2. Adapter: verify provider contracts, map CRM schema, authenticate intake, add deduplication/retries, test delivery and appointment attribution.
3. Automation: enable approved DM/CRM actions only after account setup and end-to-end QA.

Before marking connected, demonstrate synthetic cases for resource-only delivery, qualified assessment, duplicate submission, CRM outage/retry, missing sharing consent, opt-out, broker exclusion/capacity rejection and cross-tenant denial. Confirm no real borrower data enters test fixtures or Git. Check captions, CTA, asset links, consent wording, attribution and assigned follow-up owner. Do not publish until the existing playbook's content and launch gates pass.

## Related specifications
- [Client Acquisition & Activation SOP](CLIENT_ACQUISITION_CLIENT_BRAIN_SOP.md)
- [Video Creative Playbook](COMMERCIALKONNECT_CLIENT_ACQUISITION_VIDEO_PLAYBOOK.md)
- [Video Sales Workflow](COMMERCIAL_FINANCING_VIDEO_SALES.md)
- [Planned broker routing](PLANNED_SUBSCRIPTION_ROUND_ROBIN_ROUTING.md)
