# CommercialKonnect — Inbound Enquiry Notifications v1
Status: implementation contract; **not deployed**. Owner of runtime: separate Atomic CRM app (not this KonstructionComOS repo).

## Event
`financing_enquiry.created` (immutable event ID, tenant ID, enquiry ID, created timestamp). Emitted ONLY after saving enquiry and contact successfully.

Minimal payload: `event_id, tenant_id, enquiry_id, contact_id, first_name, email, phone_e164?, sms_service_consent, sms_consent_at?, sms_consent_source?, marketing_consent, financing_type?, broker_assignee_id?, source`. Do not put financial documents, SIN, credit details or other sensitive data into notifications.

## Delivery logic
1. Upsert contact and create enquiry in Atomic CRM with tenant isolation and consent provenance.
2. Enqueue event in durable transactional outbox and return website acknowledgement without relying on external provider availability.
3. Dispatch Resend acknowledgement email (template `enquiry-received-v1`) to address validated from enquiry. Ensure sender domain verified and replies are monitored.
4. If service-SMS consent is affirmatively recorded and phone number validated, dispatch one Twilio text per enquiry ID. Customer message: `Hi {{first_name}}, CommercialKonnect received your financing enquiry (Ref {{enquiry_id}}). We'll review it and follow up. Questions? Reply here. Reply STOP to opt out.`
5. If a broker is assigned and has opted into internal notifications, send internal Twilio alert containing only safe metadata and secure CRM link. Avoid customer name/amount in unencrypted SMS.
6. Log provider identifiers and timestamps as CRM activities. Webhook handlers verify Twilio and Resend signatures on raw request payload, reconcile delivered/failed/replied/opt-out events idempotently.
7. Incoming STOP/START/HELP: update channel-specific suppression/consent records; STOP wins races. Replies route to monitored staff conversation inbox and CRM. Never auto-promise a financing decision.
8. If not acknowledged by assigned staff within 15 minutes **during staffed hours**, create/escalate CRM task (no autonomous marketing sends). Define timezone and staffed hours in tenant settings. On assignment failure notify intake manager.

## Templates
Customer SMS: `Hi {{first_name}}, CommercialKonnect received your financing enquiry (Ref {{enquiry_id}}). We'll review it and follow up. Questions? Reply here. Reply STOP to opt out.`
Broker SMS: `New CommercialKonnect financing enquiry {{enquiry_id}} assigned. View securely: {{authenticated_crm_url}}`
Email subject: `We've received your financing enquiry | CommercialKonnect`; includes reference, next steps, monitored reply address, no guarantee of approval.

## Endpoints (implement in Atomic CRM backend)
- `POST /api/enquiries`: input validation, captcha/abuse control, rate limit, consent audit fields, persist, outbox enqueue.
- `POST /api/internal/events/dispatch`: authenticated worker only; provider calls, outbox state transitions.
- `POST /api/webhooks/twilio/status`: verify provider signature; record status.
- `POST /api/webhooks/twilio/inbound`: verify signature, log reply, process STOP/HELP, route securely.
- `POST /api/webhooks/resend`: verify signature, record events.
- `POST /api/internal/enquiries/escalate`: authenticated scheduled job checking staff-ack SLA.

## Persistence / audit
`enquiry_events(event_id UNIQUE, tenant_id, enquiry_id, event_type, created_at)`;
`notification_outbox(id, tenant_id, enquiry_id, channel, template_version, status, attempt_count, available_at, provider_message_id, idempotency_key UNIQUE)`;
`communication_consent(contact_id, tenant_id, channel, purpose, allowed, obtained_at, source, policy_version, revoked_at)`;
`communication_activity(tenant_id, enquiry_id, contact_id, provider, provider_id UNIQUE, direction, status, timestamp)`.
RLS on all tenant-bearing rows; server-side secrets only.

## Environment (server-side only)
`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_MESSAGING_SERVICE_SID` (or approved sender), `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, `ENQUIRY_EVENTS_WORKER_SECRET`, `PUBLIC_APP_BASE_URL`; do not commit values.
Configure sender identity, verified domain, monitored support replies, webhook destinations, staff notification preferences. Confirm Twilio Canadian sender availability and compliance requirements. No marketing SMS based merely on enquiry submission.

## Acceptance tests / release gates
- With SMS consent: exactly one customer SMS + one email, CRM event present.
- Without SMS consent: email only, no SMS.
- Replayed form/event/webhook: no duplicates.
- STOP before dispatch: suppressed; HELP routes response.
- Invalid webhook signatures: 401/403 and no mutation.
- Twilio/Resend temporary failure: bounded retry, no lost event, no duplicate side effect.
- Cross-tenant references denied; no credentials or financial data leaked.
- Broker assigned/unassigned: routing and 15-minute business-hours escalation tested.
- Production sends OFF until provider credentials, approved sender, webhook verification, staff inbox, consent copy, privacy notice and test cases verified.

## Ownership
This repo documents the cross-system contract. Implement code inside the separate Atomic CRM Vercel project only after identifying its source repository and existing contact/enquiry schema. Do not assume a deployed capability from this contract.
