# Chatwoot Conversation Inbox Integration

**Status:** planned integration specification; no live connection, webhook, credentials, or end-to-end test is established by this document.

## Purpose and system boundaries

Use Chatwoot as the shared inbox for human conversations with people who contact CommercialKonnect through its website or approved social channels. It supports response handling and conversation assignment; it does not replace the financing intake, consent ledger, or CRM.

- **CommercialKonnect intake / Supabase:** authoritative inquiry record, consent evidence, attribution, and restricted borrower information.
- **Atomic CRM:** intended business development and broker opportunity system of record, subject to verifying its schema and actual integration capabilities.
- **Chatwoot:** conversation channel, assignment, response, and conversation-level operational status.
- **Broker:** receives or handles an inquiry only within the borrower's recorded consent and an approved routing process.

Do not create a second authoritative lead record in Chatwoot. Link a conversation to the existing inquiry using an opaque inquiry ID and a stable external reference. Sync only fields needed to identify and respond to the conversation.

## Initial inbound flow

1. A visitor submits the financing assessment or starts an approved website/social conversation.
2. The intake service validates required fields, records the notice and consent version, timestamp, source/UTM attribution, and inquiry ID, then stores sensitive details in the authorized intake system.
3. A server-side adapter creates or updates a Chatwoot contact/conversation using the minimum necessary contact details and a reference to the inquiry. Include the source channel and broad financing purpose only when needed for triage.
4. Assign the conversation to the authorized CommercialKonnect operations user/team. If a broker is to be assigned, verify eligibility and consent scope first; otherwise keep it in the operations queue.
5. Staff reply in Chatwoot, then update disposition and next action through a verified CRM/inquiry workflow. Do not treat a Chatwoot conversation as proof of borrower qualification, broker acceptance, appointment, application, or funding.
6. Record response and disposition events with timestamps against the canonical inquiry reference for reporting.

For a public website widget or social DM, distinguish a general conversation from a financing inquiry. Do not create a broker referral or share data merely because a visitor sends a message.

## Minimum data and privacy controls

- Keep bank statements, tax returns, account numbers, detailed financial information, and application documents out of Chatwoot notes, tags, and custom attributes unless a documented security/privacy review explicitly approves that processing.
- Avoid putting sensitive loan details in notification previews or conversation titles. Use a generic title and opaque inquiry reference.
- Obtain the appropriate permission before broker sharing or follow-up. Resource delivery, a website chat, and optional marketing consent are separate purposes.
- Respect withdrawal/suppression events across any follow-up workflow; do not infer marketing permission from a contact record or a prior conversation.
- Set role-based access, retention/deletion, export, audit, backup, and incident procedures for Chatwoot before production personal data is used.
- Store Chatwoot API credentials and webhook secrets in server-side secret storage only. Verify webhook signatures, use idempotency keys, validate payloads, limit retries, and log failures without logging sensitive message bodies.
- Confirm applicable privacy terms, hosting/data-residency requirements, and brokerage policies before processing borrower conversations.

## Events and status mapping

Proposed mapping; confirm actual provider fields and CRM schema during implementation.

| Event | Canonical handling |
| --- | --- |
| `inquiry.created` | Create/update intake record; create linked Chatwoot conversation if channel requires human follow-up |
| `conversation.assigned` | Record assignee and timestamp; does not mean a broker referral was accepted |
| `first_response.sent` | Record first-response time for SLA reporting |
| `conversation.resolved` | Record conversation closure; retain the separate inquiry and business outcome |
| `consent.withdrawn` | Block future contact/sharing under the withdrawn scope and trigger the approved suppression workflow |
| CRM sync failure | Keep the intake record; queue an idempotent retry and alert operations |

Keep distinct funnel measures: response time, contact reached, broker acceptance, appointment booked/held, application, confirmed funding, and attributable revenue. Chatwoot metrics alone cannot establish lead quality or commercial performance.

## Delivery gates

1. Confirm the Chatwoot workspace, hosting model, permitted channels, user roles, retention, and account/API capabilities.
2. Confirm Atomic CRM and intake schemas, ownership of each field, consent semantics, and the opaque reference strategy.
3. Build a server-side adapter; do not expose API credentials in browser code or public environment variables.
4. Test synthetic cases for website inquiry, general chat, duplicate submission, ineligible/no-consent broker routing, consent withdrawal, webhook replay, provider outage/retry, and cross-tenant access.
5. Run a human-reviewed pilot with no automatic broker sharing until brokerage and legal workflows are approved.
6. Enable production personal data only after end-to-end security, privacy, consent, and operational checks pass.

## Out of scope until separately approved

- Automatic financing advice, underwriting, lender matching, or funding decisions.
- Automatic broadcast of borrower data to brokers.
- Selling or charging per Chatwoot conversation.
- Treating subscription status or weighted routing as a substitute for consent, eligibility, or regulatory approval.
- Claiming Chatwoot is already connected or that it will independently generate website traffic or leads.

Related documents: [CommercialKonnect PRD](COMMERCIALKONNECT_PRD.md), [Client Acquisition & Activation SOP](CLIENT_ACQUISITION_CLIENT_BRAIN_SOP.md), [Viral Content Engine Acquisition Funnel](VIRAL_CONTENT_ENGINE_ACQUISITION_FUNNEL.md), and [planned subscription routing](PLANNED_SUBSCRIPTION_ROUND_ROBIN_ROUTING.md).
