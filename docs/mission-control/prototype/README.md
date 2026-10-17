> Archived reference notes. For implementation authority use ../README.md and ../SYSTEM_DESIGN.md. The approved repository tenant key is workspace_id; the original reference uses generic organization terminology. No hosting manifest, private profile data or Site identity is copied here.

# KommercialOS — Broker Mission Control

Broker-first interactive application and SaaS wireframe, based on the supplied October 14, 2026 KonstructionComOS TAM/SAM/PMF document.

## Current implementation
Buildless HTML/CSS/JavaScript, responsive workspace, synthetic opportunities, expandable briefs, search/type/need filters, editable qualification and next action, drag-and-drop financing Kanban, six editable GTM playbooks, appointment planning, meeting outcomes, funnel scenario planner, broker profile, activity log and JSON export. Data persists in browser localStorage. The SaaS blueprint is available inside the app.

No real prospect claims, source feeds, calendar integrations, invitations, outbound messages, financing commitments, login, shared team persistence, subscriptions or tenant authorization are implemented. Hosted owner-private access protects the prototype link; it is not application multi-tenancy. Fit scores and financing estimates are synthetic. Avoid sensitive borrower information in the prototype.

## Product workflow
Verified signal → entity resolution → sponsor/authority verification → financing qualification → reviewed outreach → appointment → held qualified conversation → engagement/mandate. Keep project lifecycle separate from financing relationship stage. Budget, estimated debt, confirmed need, requested debt and lender commitment must remain separate fields.

North star: unique held qualified financing meetings per organization per reporting month. Bookings, show rate, qualification rate and mandates support this outcome. Record net-new versus assisted origin, primary source/playbook and next action. Sample metrics in the prototype derive from sample records; proposed pilot gates remain targets.

## GTM strategies
1. Project milestone: verified planning/permit/acquisition event → relevant capital readiness conversation.
2. Refinance readiness: owner-confirmed maturity or stabilization → debt review.
3. Referral partners: permissioned accountant/CRE/lawyer introductions → joint discovery.
4. Business expansion: verified space/property plans → owner-occupied financing discussion.
5. Evidence-led inbound: useful local property-type pages → qualified consultation request.
6. Permissioned reactivation: relationship history and agreed follow-up → updated financing plans.

No live outreach is authorized or performed by this application. Drafts require personalized facts and human review. Production needs jurisdiction-appropriate contact-basis evidence, suppression checks and licensed-broker routing.

## SaaS implementation contract
- Organization and membership: owner, broker, analyst; server-side access checks on every request.
- Every business entity has organization_id; enforce tenant isolation and add cross-tenant authorization checks before a paid pilot.
- Entities: Organization, Membership, BrokerProfile, Project, SourceEvidence, Company, Contact, Opportunity, Playbook, OutreachReview, Appointment, Outcome, AuditEvent, Subscription and Entitlement.
- Project: source URL, source date, first_seen_at, last_verified_at, construction stage, location, property type, project budget and provenance.
- Opportunity: financing purpose, requested/estimated amount, need status, authority evidence, current lender status if supplied, timing, owner, relationship stage, next action, origin and exclusion reason.
- Contact: entity match confidence, role/authority, verified date, communication basis and suppression state.
- Appointment: opportunity_id, contact_id, primary playbook, Vancouver-aware start and duration, provider event ID, idempotency key, status, qualification evidence, outcome and next action.
- BrokerProfile/client.brain: mandate, territory, amount range, strengths, weaknesses/gaps, preferred opportunities, exclusions and outcome goals.
- Audit events: immutable actor, timestamp, tenant, action and changed record references.

## Integrations to implement
LeadSniperAI discovers bounded signals; business-data enrichment resolves companies/contacts; Harvey supports qualification and proposes appointments; CRM stores relationship history; calendar provides actual availability and confirmed event creation. These are integration boundaries, not connected services. Use authenticated server adapters, dated provenance, error states, deduplication, idempotent writes, rate limits and human approval for outreach. Never send invitations based on guessed availability.

## Release stages and acceptance
1. Verified-data pilot: bounded Metro Vancouver/Fraser Valley sources, real source dates, entity verification, persisted tenant data, audit trail, qualification and exports.
2. Appointment pilot: live calendar availability, agreed invitation workflow, duplicate-safe booking, CRM linking, suppression and meeting outcome attribution.
3. Paid SaaS: billing/entitlements, role administration, onboarding, support, backup/restore and export/deletion lifecycle. Test CAD $299–$799 per team/month as a hypothesis, not established pricing.

Before paid launch: demonstrate tenant isolation, dated source evidence, sponsor-confirmed financing need, reviewed contact basis, approved outreach, correct timezones, idempotent event creation and full signal-to-held-meeting attribution.

## Local development
Serve dist/ with a static server. No build dependencies. `node --check dist/app.js` validates JavaScript syntax. Browser layout QA must be performed when preview infrastructure is available.

## Client Brain interview and dashboard personalization
The Client Brain tab provides a five-step client interview: practice/ideal borrower; financing specialties/property/territory/size; strengths, gaps, lender access and qualification; appointment strategy/goals/capacity; review and activation. The client here is the broker team subscribing to Mission Control. Individual borrower discovery is a separate opportunity workflow with specialty-specific discovery prompts.

Interview drafts persist separately from the active version and do not change matching. Activation validates required inputs and requires explicit client-review confirmation, creates a timestamped version and updates the meeting target. Previously saved browser workspaces are retained. Active profiles export as client.brain.md; JSON workspace export includes both draft and active profiles.

Implemented matching: financing purpose 40 points, property/asset type 25, province 15, amount range 20. All four must match and be known for the personalized shortlist. Preferred city breaks ties. The full opportunity list retains outside-mandate records and labels their status. Missing fields prompt review. Scores measure declared specialization, not credit quality or funding probability. Financing need confirmation remains independent. Preferred GTM channels and specialties order playbooks; each playbook includes profile context. Dashboard actions use the broker's qualification requirements.

Supports construction/development, acquisition/bridge, commercial refinance, owner-occupied property, working capital, equipment, receivables/ABL and business acquisition. Non-property opportunities can be entered with purpose and province in Add opportunity. BC sample data remains synthetic; province selections do not expand live coverage. Lender relationships, experience, exclusions and contact restrictions remain self-reported briefing context requiring human review, not automated eligibility or authorization rules.

Production: store versioned tenant-scoped ClientBrainDraft, ClientBrainVersion and interview review metadata; implement reviewed provenance, permissions and change history. Matching must be tested against actual source schemas before live discovery; calendar capacity is planning context, not an availability constraint in this prototype.
