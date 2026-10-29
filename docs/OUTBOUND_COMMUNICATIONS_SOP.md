# CommercialKonnect — Outbound Communications SOP v1.0

**Status:** Proposed operational SOP — not deployed; no live sends enabled.  
**Owner:** CommercialKonnect LeadOS / Atomic CRM operator  
**Channels:** Resend email, Twilio SMS, broker notifications  
**Scope:** Inbound financing enquiries, financing-guide fulfilment, opted-in follow-ups and appointment confirmations. Prospecting/cold outreach is a separate consent-reviewed campaign process.  
**Companion contract:** [Inbound Enquiry Notifications](./INBOUND_ENQUIRY_NOTIFICATIONS_V1.md)

## 1. Objective and system of record

Convert legitimate enquiries and financing-guide requests into timely, helpful communications, qualified conversations and broker appointments while maintaining clear audit trails. **Atomic CRM is the system of record** for contacts, consent, enquiries, campaign membership, ownership, activities and suppression status. Resend delivers email; Twilio delivers SMS and captures replies. All changes must be tenant-isolated.

## 2. Trigger / template matrix

| ID | Trigger | Channel | Recipient | Timing | Template | Preconditions |
|---|---|---|---|---|---|---|
| E01 | `financing_enquiry.created` | Resend | Enquirer | Immediately after CRM save | Enquiry received | Valid email, applicable transactional/service-message basis |
| S01 | `financing_enquiry.created` | Twilio | Enquirer | Immediately after CRM save | Enquiry received SMS | Valid E.164 phone, recorded affirmative service-SMS consent; not suppressed |
| S02 | `financing_enquiry.assigned` | Twilio | Assigned broker | Immediately | New lead alert | Broker opted into internal alerts and has CRM access |
| E02 | `financing_guide.requested` | Resend | Requester | Immediately | Guide ready | Verified request; authorized guide link; valid email |
| E03 | `financing_enquiry.followup_due` | Resend | Enquirer | Next business day | Next steps | Permissible message basis; no reply, meeting, or suppression |
| E04 | `financing_guide.followup_due` | Resend | Guide requester | Day 3 | Compare financing options | Marketing consent / documented CASL basis; no suppression or meeting |
| E05 | `consultation.booked` | Resend | Attendee | Immediately | Booking confirmed | Confirmed appointment; valid calendar link/timezone |
| E06 | `financing_enquiry.incomplete` | Resend | Enquirer | After 24 h | Additional information | Relevant to active requested enquiry, valid secure update link |
| T01 | `lead.not_acknowledged` | CRM task/internal alert | Assigned broker / intake manager | At 15 minutes of staffed working time | Follow-up escalation | Enquiry still unacknowledged |

Operational distinctions: service confirmations must not be repurposed for advertising; an enquiry does **not** by itself permit marketing SMS. Send follow-ups only where a documented lawful basis exists. Stop campaigns on a relevant human reply, booked meeting, withdrawal of consent, complaint, or delivery suppression.

## 3. Standard operating procedure

1. **Intake and validate.** Accept website forms only through rate-limited, abuse-protected endpoints. Validate fields, normalize phone to E.164, record privacy-policy and consent text/version, source page, timestamps, and separate SMS purposes. Do not precheck consent boxes.
2. **Persist first.** Deduplicate/upsert contact within tenant, create enquiry or guide-request record, assign responsible broker when possible, and commit a durable outbox event. Never send before persistence succeeds.
3. **Determine permissions.** For each channel/purpose, check consent or documented legally reviewed basis, suppression and STOP status at dispatch time, not only when queued. No inferred SMS consent from phone submission.
4. **Generate personalized content.** Use only verified fields; apply template version, sender identity, monitored reply-to and approved URLs. Avoid credit/approval guarantees, invented rates, or personal financial details in messages.
5. **Dispatch idempotently.** Send through Resend/Twilio server-side with unique key per tenant+enquiry+template+recipient; persist provider IDs and bounded retry states. Serialize concurrent dispatches; flag uncertain delivery for reconciliation rather than blind duplicate retries.
6. **Capture results.** Verify inbound provider webhook signatures against raw request bodies. Record message sent/delivered/failed/replied/bounced/complained; update CRM activities. Immediately apply STOP/unsubscribe suppression; provide HELP handling.
7. **Assign and escalate.** Internal SMS contains enquiry reference and authenticated CRM link, not confidential financing detail. Start 15-minute acknowledgement timer during staffed hours; create an escalation task and notify designated intake owner if unacknowledged. Do not treat message delivery as broker acknowledgement.
8. **Close the loop.** On meeting booked, pause nurture; on broker acceptance, update assignment; on no consent, fall back to service email only where permissible; on missing contact details, queue a manual task.
9. **Quality review.** Daily check failed deliveries, orphaned assignments, opt-outs, bounced addresses and SLA exceptions; weekly review conversion metrics and compliance logs.

## 4. Approved draft copy

### E01 — Enquiry received (email)
**Subject:** We've received your financing enquiry | CommercialKonnect

Hi {{first_name}},

Thank you for contacting CommercialKonnect. We've received your financing enquiry (**Ref: {{enquiry_id}}**).

We'll review the information you provided and contact you if additional details are needed. Depending on your needs, we may help connect you with an appropriate financing professional.

You can reply to this email with general questions. Please don't send sensitive financial documents by email.

CommercialKonnect Team  
CommercialKonnect.ca

*An enquiry is not an approval or guarantee of financing.*

### S01 — Enquiry received (SMS)
Hi {{first_name}}, CommercialKonnect received your financing enquiry (Ref {{enquiry_id}}). We'll review it and follow up. Questions? Reply here. Reply STOP to opt out.

### S02 — Internal assigned-broker SMS
New CommercialKonnect enquiry {{enquiry_id}} assigned. Review securely: {{authenticated_crm_url}}

### E02 — Financing guide delivery (email)
**Subject:** Your {{guide_title}} is ready

Hi {{first_name}},

Thanks for requesting **{{guide_title}}**.

Access your guide: {{guide_download_url}}

The guide explains general financing options and considerations. If you'd like help understanding which options may apply to your business, you can request a consultation: {{booking_url}}

CommercialKonnect Team  
CommercialKonnect.ca

*General information only; rates, eligibility and terms vary by lender and applicant.*

### E03 — Next steps (email)
**Subject:** What happens next with your financing enquiry?

Hi {{first_name}},

For your financing conversation, it helps to know the purpose of your request, the approximate funding requirement, your timeline and whether business assets or commercial property are involved. There is no need to email sensitive documents.

If you'd like to arrange a conversation, use {{booking_url}}.

CommercialKonnect Team

### E04 — Guide follow-up (consent-gated email)
**Subject:** Questions about your financing options?

Hi {{first_name}},

Did the **{{guide_title}}** guide help you identify questions about your financing options?

If you'd like to compare possible approaches for your situation, you can request a consultation at {{booking_url}}.

CommercialKonnect Team  
{{business_contact_details}}  
Unsubscribe: {{unsubscribe_url}}

### E05 — Booking confirmation (email)
**Subject:** Your financing consultation is confirmed

Hi {{first_name}},

Your financing consultation is booked for **{{appointment_date}} at {{appointment_time}} {{timezone}}** with {{advisor_name}}.

Meeting details: {{meeting_details}}  
Manage booking: {{appointment_management_url}}

CommercialKonnect Team

### E06 — Missing information (email)
**Subject:** A quick follow-up on your financing enquiry

Hi {{first_name}},

We need a little more information to review your enquiry (Ref {{enquiry_id}}).

Items needed: {{missing_information_summary}}

Please use the secure update link: {{secure_enquiry_url}}. Avoid emailing financial statements, identification or banking credentials.

CommercialKonnect Team

## 5. Financing guide catalogue

Map `guide_slug` to a versioned `guide_title`, access-controlled/expiring `guide_download_url`, corresponding landing page, and booking CTA. Initial candidates:

| Slug | Guide title | CTA |
|---|---|---|
| bank-declined | Bank Said No? | Explore Alternative Financing |
| business-line-of-credit | Business Line of Credit | Compare Working Capital Options |
| commercial-mortgage | Commercial Mortgage Guide | Discuss Commercial Mortgages |
| business-expansion | Business Expansion Financing | Finance Your Expansion |
| construction-financing | Construction Financing Guide | Discuss Project Financing |
| commercial-refinancing | Commercial Refinancing Guide | Explore Refinancing Options |

Guide requests require resource-delivery consent/notice; add marketing enrollment only with a separate documented legal basis. Do not claim a PDF is ready until its asset and URL have passed quality review.

## 6. Workflow invariants and security

- Secrets in Vercel server-only environment: Twilio credentials, Resend API key/webhook secret, event-worker secret; no secret values in Git.
- Use provider-approved sender identity, verified Resend domain, working reply inbox, authenticated booking/CRM URLs, scoped access and tenant RLS.
- Build deduplication, queue recovery, dead-letter alerts, signed webhook validation and chronological consent history.
- Track consent by purpose (service SMS versus marketing SMS); apply opt-outs at the contact+channel level across active campaigns.
- Internal escalation only during configurable staffed hours in `America/Vancouver` or tenant-configured timezone; no unsupported response-time promises to customers.
- Review CASL, PIPEDA, Canadian telecommunications and provider-specific requirements with appropriate counsel before live activation.

## 7. Acceptance and go-live checklist

- [ ] Atomic CRM source repository and Vercel environment identified; existing schema/permissions inspected.
- [ ] Test enquiry persists once and emits one durable event.
- [ ] E01 and E02 arrive with correct names, links, sender, reference and reply handling.
- [ ] S01 sends only for recorded SMS consent; no-consent test sends zero SMS.
- [ ] S02 routes only to authorized assigned broker.
- [ ] Simulated duplicate events and webhook deliveries produce no duplicate customer communications.
- [ ] STOP, reply, bounce, complaint, booking and unsubscribe halt eligible follow-ups.
- [ ] 15-minute staffed-hours escalation creates one CRM task and records acknowledgement independently of delivery.
- [ ] Tenant isolation, secrets, webhook signatures, rate limits and retry/failed-send dashboards verified.
- [ ] Legal/compliance and template approvals documented.
- [ ] Controlled production test approved; only then enable sending.

## 8. KPIs

Time to confirmation; delivery success by channel; percentage of enquirers with verified SMS consent; broker acknowledgement within staffed-hours SLA; enquiry-to-booking conversion; guide download-to-booking conversion; opt-out rate; complaint rate; duplicate-send rate (target zero). Report by campaign/guide/tenant with no fabricated performance claims.

## 9. Ownership and rollout

This file is the **SOP/source specification**, not implementation. The separate Atomic CRM deployment should implement the event handlers and persistence; CommercialKonnect web forms emit the events. Launch in phases: internal test data → controlled customer confirmation → internal broker alert and escalation → consent-eligible nurture. Keep outbound sends disabled until all release gates pass.
