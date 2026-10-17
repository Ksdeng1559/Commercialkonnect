# Commercial & Business Financing Video Sales Workflow

**Status:** GTM playbook and product requirements; not yet implemented in the application.  
**Product:** KonstructionComOS / ClearConnect  
**Launch market:** British Columbia  
**Audience:** Licensed commercial mortgage and business-financing brokers, financing advisors, borrowers/developers/business owners, and referral partners.

## Objective

Use short, relevant video sales letters (VSLs) to help a broker earn a qualified conversation, explain the discovery process, and guide a prospect to a clear next step. VSLs support human-reviewed selling. A public project signal, growth indicator, video view, or prioritization score does not establish financing need, borrower eligibility, lender appetite, or approval.

## Buyer and audience tracks

| Audience | VSL job | Suggested call to action |
|---|---|---|
| Commercial mortgage and development-finance brokers | Show how early project intelligence, sponsor verification, financing-stage questions, and follow-up can support origination | Book a 15-minute working session using one target project or territory |
| Business-financing brokers and advisors | Show how verified growth signals can prompt a timely conversation about working capital, equipment, acquisition, receivables, or expansion financing | Review one opportunity and its qualification workflow |
| Borrowers, developers, and business owners | Explain the information-gathering process, possible financing routes, and next steps without implying eligibility or approval | Book a confidential discovery call or complete secure intake |
| Referral partners | Explain which situations merit an introduction and how consent, follow-up, and status updates work | Discuss a consent-based referral workflow |

Do not infer that a company needs financing just because it is growing, hiring, acquiring property, or advancing a project. Record financing need as **unknown** until confirmed directly by an authorized participant.

## Sales sequence

1. **Select and verify the account.** Confirm organization, role, territory, financing segment, signal source, source date, and whether the signal is public or permissioned. Keep source provenance attached.
2. **Choose an audience-specific template.** Draft from approved CRM facts only. A licensed broker or authorized seller reviews the script, personalization, disclosure, CTA, and destination before external delivery.
3. **Send a concise introduction and tracked video.** Use the recipient's appropriate channel and contact basis. Provide a plain-text or live-call alternative. Apply suppression and contact-frequency rules.
4. **Capture engagement.** Attach delivery, video, campaign, contact, organization, and opportunity identifiers. Store supported events such as started, watch threshold, replay, CTA, reply, and booked meeting. Views inform follow-up priority; they are not qualification.
5. **Follow up personally.** Use engagement together with fit, recency, expressed intent, relationship, and opportunity context. Stop or adjust outreach when a recipient responds, opts out, or is suppressed.
6. **Qualify in discovery.** Confirm participant authority; project or business context; purpose and timing; use of funds; approximate amount range; existing financing/obligations; requested structure; security/assets where applicable; and documentation readiness. Do not collect sensitive documents over an unsecured video page.
7. **Record the verified stage and next action.** Distinguish borrower-stated need, broker-verified request, lender-submitted file, conditional approval, commitment, funding, and decline. Agree the next step and use approved secure intake/document channels.

## Video structure and script templates

Use roughly **45–75 seconds** for broker/referral prospecting and **60–90 seconds** for borrower process explanations. Keep one clear CTA. Use names and company details only when accurate and appropriate; avoid fabricated familiarity.

### Commercial mortgage / development-finance broker

> Hi [Name], Dennis here. I work with commercial and development-finance opportunities in [region]. I’m reaching out because [verified project signal] may be relevant to the kind of financing conversations your team handles. The signal itself doesn’t confirm a financing need. The useful next step is to verify the sponsor, project stage, timing, and what capital structure, if any, is being considered. KonstructionComOS is designed to organize project signals, research, and follow-up in one workflow. Would a 15-minute working session using one opportunity from your market be useful?

### Business-financing broker

> Hi [Name], Dennis here. I noticed [verified business signal] at [company]. That can be a reason to learn more, though it doesn’t tell us whether the business is looking for capital. We help organize relevant business context and the follow-up needed to determine whether a financing conversation makes sense. If you work with [working capital/equipment/acquisition/receivables] opportunities, would you be open to reviewing one example and the qualification steps?

### Borrower, developer, or business owner

> Hi [Name], thanks for speaking with us about [project or business objective]. Before discussing potential financing routes, we need to understand the purpose and timing of funds, the people and entities involved, the asset or business context, and the information available. We have not determined eligibility, lender fit, terms, or approval. If you’d like to proceed, book a confidential discovery call or use our secure intake link. We’ll confirm the next steps before requesting documents.

### Referral partner

> Hi [Name], Dennis here. I work on commercial and business-financing opportunities in [region]. When a client is considering [project acquisition, construction, expansion, equipment, or working capital], an early financing conversation can help clarify what information is needed and which routes may be worth assessing. We only follow up when the client has agreed to the introduction. Would it be useful to compare a simple referral and update process?

Templates require review before use. Do not state rates, leverage, approval likelihood, lender appetite, timelines, exclusivity, guaranteed financing, or guaranteed jobs unless the claim is current, substantiated, authorized, and properly qualified. Do not promise referral compensation unless permitted and documented.

## VSL test and reporting

Test matched account cohorts by audience and financing type: VSL-assisted outreach versus the same message, offer, channel, and follow-up without video. Track assignment before first contact. Keep list quality, sender, timing, offer, and cadence as consistent as practical. Report sample sizes and segment results; small early samples are directional, not causal proof.

**Primary measures**
- Qualified financing meetings per contacted organization.
- Confirmed financing requests per qualified meeting.
- Paid pilot or broker mandate progression, where applicable.

**Downstream measures**
- Application/intake started.
- Lender submission.
- Conditional approval.
- Commitment.
- Funded transaction.
- Attributable commission or revenue.

Treat these as distinct stages; do not combine them into one “conversion.” Separate first-touch, assisted-touch, and primary attribution where multiple channels contributed.

**Diagnostics**
- Delivery and video start rates.
- Supported watch thresholds/completion, replay, and CTA click.
- Replies, attended meetings, opt-outs/suppression, and time to next stage.
- Broker follow-up time and qualified-opportunity rate per 100 accounts contacted.

Do not count a video view as pipeline, financing intent, or customer demand. Revise conversion assumptions only when repeatable, sufficiently sized tests show better qualified outcomes without worse meeting quality or increased opt-outs.

## CRM and product requirements

Normalize provider events and keep business logic in the application/CRM system of record. Proposed fields:

- audience_type, financing_segment, campaign_id, template_id, video_provider
- signal_source, signal_observed_at, signal_verified_at, signal_verification_status
- contact_basis, suppression_status, human_reviewed_at
- financing_need_status (unknown, stated, confirmed, not pursuing)
- borrower_authority_status, project_or_business_stage, use_of_funds, requested_amount_range, timing
- engagement_event, occurred_at, provider_event_id, cta_type
- qualification_status, secure_intake_status, financing_outcome

Store only what is needed. Never put account numbers, personal identifiers, credit documents, or confidential borrower details in scripts, tracking URLs, analytics payloads, or general-purpose event logs. Use tenant isolation, least-privilege access, retention controls, audit logging, consent/contact suppression, and secure document handling. Apply CASL and applicable privacy requirements before outbound communication; obtain appropriate legal/compliance review for regulated workflows.

## Provider rollout

- **Initial validation:** Use the current Dubb + Zapier + Convex + Slack pilot pattern for authentic one-to-one broker videos, recipient-specific tracking, and tested event capture. Keep opportunity and workflow logic in the CRM. Confirm provider event payloads before relying on them.
- **Scale:** Consider Sendspark for API-driven personalization only after a specific audience, script, and offer show qualified-meeting value and the additional cost is justified.
- **Embedded product:** Assess Hippo Video SDK/API for a native KonstructionComOS recorder, branded prospect page, CTA, and engagement webhooks after written confirmation of SaaS embedding, multi-tenant use, white-label/custom-domain rights, data processing, event analytics, security, support, and total cost.
- **Provider portability:** Use a provider-neutral video/event model so a vendor change does not change qualification, consent, attribution, or pipeline rules.

No provider is selected as the permanent platform by this playbook. Do not claim a conversion lift before measuring it.

## Implementation boundary

This document defines a GTM workflow and product requirements. It does **not** mean video recording, tracking, CRM event ingestion, automated follow-up, broker compliance review, or Hippo Video integration is implemented. Any application work must follow AGENTS.md, docs/PRD.md, and docs/ARCHITECTURE.md; keep secrets server-side and do not introduce sensitive borrower data into synthetic/demo records.
