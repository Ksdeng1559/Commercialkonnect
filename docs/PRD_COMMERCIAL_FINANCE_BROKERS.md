# Product Requirements — Commercial Finance Broker Workspace

**Product:** KonstructionComOS operating intelligence platform; KommercialConnect is the proposed borrower-facing brand  
**Primary user:** Commercial mortgage and development-finance broker teams; business-financing broker teams are an adjacent workflow  
**Launch geography:** British Columbia, beginning only in regions and project types where source coverage can be demonstrated  
**Status:** Proposed segment PRD for discovery and phased delivery. The current application is an MVP scaffold with synthetic data; most capabilities in this document are planned.

## 1. Product objective

Help a commercial finance broker team move from an early, source-backed project or business signal to a prepared, sponsor-confirmed financing conversation, while preserving evidence and follow-up history.

The product must make it easier to:

1. Find and review project or business signals relevant to the team’s territory and mandate.
2. Establish what is known about the project, sponsor and company, and where information came from.
3. Prepare client intelligence, a battlecard and a meeting plan without presenting inference as fact.
4. Draft optional broker-reviewed email and video introductions.
5. Track replies, qualification, mandate progress and outcomes in the broker’s team pipeline.

The product is research and workflow support. It does not determine creditworthiness, approve financing, promise lender appetite, or turn a public signal into a confirmed funding need.

## 2. Problem and validation hypothesis

**Problem hypothesis:** Commercial finance teams often assemble project, sponsor and company context from fragmented sources, then prepare outreach and track follow-up across separate tools. A project signal alone does not establish financing need, sponsor authority, timing or mandate fit.

**Solution hypothesis:** A source-backed project record, client intelligence profile, conversation battlecard and broker-controlled origination workflow can reduce duplicated research and help the team conduct more relevant, well-documented conversations.

This hypothesis is not validated. The available PMF research supports testing the problem; it does not establish adoption, retention, willingness to pay, campaign performance or product-market fit. Validate the broker cohort separately from contractors and commercial real estate users.

## 3. Target users and jobs

| Role | Main job | Product need |
|---|---|---|
| Brokerage principal / team lead | Choose markets, mandates and pursuit priorities; oversee team activity | Team-level filters, assignments, pipeline visibility, permissions and outcome reporting |
| Commercial mortgage / development-finance broker | Find sponsors and qualify project financing conversations | Project and sponsor context, financing questions, lender-mandate reference, meeting prep and follow-up |
| Business-financing broker / advisor | Identify and qualify business financing conversations | Business signals, use-of-funds intake and business-specific qualification fields |
| Researcher / coordinator | Verify facts and prepare broker-ready research | Source tracking, verification queue, entity links, confidence and corrections |
| Admin | Manage users, access and workspace settings | Organization roles, audit trail, export and retention controls |

**Primary buyer:** Independent brokerage principal or commercial-finance team lead.  
**Primary user:** Broker/originator, with researcher support where available.  
**Buyer unit:** Independent buying organization or team subscription, not an individual loan or project.

## 4. Core user journey

1. **Set a team profile:** The team records geography, property/business focus, deal types, lender mandates, minimum/maximum ranges and exclusions.
2. **Discover a signal:** A user searches or reviews available projects/business signals in the covered area.
3. **Check the evidence:** The user sees source, publisher, observation date, last verification, coverage limitations, confidence and conflicts.
4. **Review sponsor/client context:** The user examines linked people and organizations and records what is confirmed, inferred or still unknown.
5. **Qualify the conversation:** The user records project stage, participant authority, financing status, use of funds, timing, amount range and missing information. Financing need defaults to unknown.
6. **Prepare:** The user creates a client briefing, battlecard, question list, meeting agenda and suggested next step.
7. **Reach out (optional):** The broker edits and approves a personalized email or video script and intended recipient before sending through an authorized provider or external workflow.
8. **Follow up:** Delivery, replies, opt-outs, meeting bookings and next actions are recorded separately. Engagement signals do not qualify an opportunity.
9. **Progress the opportunity:** A qualified conversation can be moved through the capital pipeline. Only verified events change the financing stage.
10. **Record outcome:** The team records mandate status and outcome, including no need, not a fit, nurture, lender submission, commitment, funded, declined or lost, with appropriate reasons.

## 5. MVP scope and delivery phases

### Phase 0 — Research and operational readiness

- Interview commercial mortgage and development-finance brokers using a recent, real origination workflow.
- Define pilot coverage area and lawful data sources; measure coverage and freshness before describing it publicly.
- Confirm existing public demo-request routing and internal-pilot readiness gate.
- Validate privacy, CASL, broker advertising and record-retention requirements with the responsible compliance owner.
- Establish a baseline for research/preparation time and the current method of attributing opportunities.

**Exit gate:** A specific broker segment, source-coverage boundary, buyer, measurable workflow and pilot offer are agreed. No new public signup route is released until the readiness gate is met.

### Phase 1 — Evidence-backed broker workspace

- BC project registry with authorized manual/CSV or licensed-source ingestion.
- Project search/filter by region, type, stage and available attributes.
- Source provenance, observation/verification dates, confidence, missing data and correction flow.
- Stakeholder/company relationships with role and match confidence.
- Broker team profile and saved shortlist.
- Capital origination pipeline and interaction history.
- Tenant-scoped roles, audit events, exports and cross-tenant isolation tests.
- Synthetic demo fixtures visibly separated from real records.

### Phase 2 — Client intelligence and conversation preparation

- Client/project briefing with source-linked facts and explicit unknowns.
- Client goals and financing context based on user or client statements.
- Battlecard generation from approved, traceable inputs.
- Discovery questions, meeting agenda, missing-information checklist and follow-up draft.
- User corrections and provenance retained; AI-created text remains a draft.

### Phase 3 — Human-reviewed outreach activation

- Provider-neutral email and video draft model linked to contact, organization and opportunity.
- Audience-specific templates for commercial mortgage/development finance, business finance and referral partners.
- Approval state, approved recipient/channel, send status and message version.
- CASL contact eligibility, consent/contact basis, unsubscribe, suppression and frequency handling before sending.
- Engagement/reply event capture only where supported and permitted.
- A concierge/manual pilot may test the service before any provider integration.

No email or video is automatically sent in the initial release. Provider integration requires separate assessment of API rights, tenant separation, privacy/data processing, event reliability, security, support and total cost.

### Deferred

- Automated credit assessment or eligibility decisions.
- Guaranteed lender matching, terms, approvals, funding or success fees.
- Autonomous outbound prospecting or sending.
- Full underwriting, document collection, borrower portal, lender marketplace or credit bureau integration.
- Comprehensive national coverage, property feasibility, construction estimating or takeoff.
- AI-written conclusions about intent, creditworthiness, objections or lender appetite without evidence and human confirmation.

## 6. Functional requirements

| ID | Requirement | Priority | Acceptance evidence |
|---|---|---:|---|
| BR-01 | Team profile stores territory, focus, deal types, mandate criteria and exclusions | P1 | Authorized user can create/edit profile; values scope shortlist and filters |
| BR-02 | Project records show status, source URL/publisher, observed date, verified date, confidence and unknowns | P0 | User can inspect provenance for every critical displayed assertion |
| BR-03 | Stakeholder/company matches include role, match basis and confidence | P0 | Uncertain matches are visibly labeled and can be corrected or rejected |
| BR-04 | Financing need and timing default to unknown | P0 | No public activity automatically changes financing status to confirmed |
| BR-05 | Qualification captures participant authority, project/business context, purpose, timing, amount range and missing information | P1 | Broker can save partial qualification; unknown fields remain distinct from negative answers |
| BR-06 | Client intelligence separates client-stated facts, sourced facts, broker notes and system inference | P1 | Each field displays source/type; user can edit, correct or remove supported content |
| BR-07 | Battlecard assembles sourced facts, open questions, possible angles and next actions | P1 | Generated card labels hypotheses and unknowns; user can review/edit before export or use |
| BR-08 | Capital pipeline supports discovered → sponsor verification → financing discussion → qualified mandate → lender review → outcome | P0 | Each stage change has actor/time and required evidence; project stage remains a separate field |
| BR-09 | Interaction history records calls, notes, referrals, meeting, next action and owner | P0 | Authorized team member can review history; audit metadata is retained |
| BR-10 | Personalized email/video drafts use approved facts and templates | P2 | Draft cites personalization inputs and stays unsent until authorized approval |
| BR-11 | Outreach action enforces contact eligibility, suppression, opt-out and frequency policies | P2 / launch blocker for sending | Ineligible or suppressed recipient cannot be sent; decision is logged |
| BR-12 | Outreach and video events remain distinct from qualification/outcome | P2 | Open/view/click/reply/booking cannot alone move an opportunity to qualified |
| BR-13 | Reports show activity and attributed outcome by team, segment and source | P2 | Reports show denominator and sample size; assisted discoveries labeled separately |
| BR-14 | Organization data is isolated with verified identity-to-tenant mapping and restrictive RLS | P0 | Automated tests deny cross-tenant reads and writes for each supported resource |

## 7. Data and state model requirements

Minimum conceptual entities:

- **Workspace / organization:** tenant, settings, members, role.
- **Team profile:** geography, segment, mandate criteria, exclusions, version history.
- **Project / business signal:** normalized entity, stage, type, location, first-seen, last-checked, status.
- **Source assertion:** field/value, source URL, publisher, observed time, licensed basis, confidence, verification state, reviewer and correction history.
- **Person / organization:** identity, role, relationship to project, match basis/confidence, contact eligibility state.
- **Client profile:** client-stated goals, business/project context, financing status, open questions, responsible broker and access controls.
- **Opportunity:** workspace, project/client links, pipeline stage, qualification fields, owner, next action, stage evidence and outcome.
- **Brief / battlecard:** versioned content, source/assertion references, creator, review state and edits.
- **Outreach draft / campaign:** channel, template, recipient, source inputs, contact basis, approval, message version, delivery provider/status.
- **Engagement event:** delivery, view/watch threshold, reply, opt-out, CTA, booking; event time, provider and external ID.
- **Audit event:** actor, organization, action, target, time and relevant metadata.

Keep project lifecycle stage distinct from financing lifecycle stage. Keep requested amount, estimated project budget, verified financing need and committed financing in separate fields. Do not infer contact permission from a publicly visible email address.

## 8. Non-functional requirements and safeguards

- Enforce tenant identity server-side and restrictive Postgres RLS on every tenant-owned row. Do not accept browser-supplied tenant IDs as authorization.
- Keep secrets and privileged credentials server-side; do not use service-role access for ordinary tenant CRUD.
- Store source license/basis, provenance, freshness, confidence and human corrections.
- Encrypt transport, apply least privilege, log access and define retention/deletion controls.
- Use idempotency for provider writes, retries and webhooks; validate signatures and inputs.
- Keep sensitive borrower documents out of marketing email/video pages and synthetic fixtures.
- Use CASL contact eligibility, unsubscribe/suppression, PIPEDA and applicable provincial privacy controls; obtain legal/compliance review for regulated broker workflows.
- Provide user review for all AI-generated summaries, battlecards and outreach.
- Offer correction and deletion paths for inaccurate personal or organization data.
- Do not describe a score as a probability or guarantee. Explain signal relevance and limitations.

## 9. Success metrics and pilot gates

Measure by segment and team; do not combine broker outcomes with contractor or commercial real estate results.

**Activation:** Team saves five verified relevant projects and creates one opportunity within seven days. This is a proposed activation definition, not an achieved result.

**Pilot measures:**
- Weekly active pilot teams and workflow use in weeks of the pilot.
- Share of records reviewed that meet the freshness and provenance standard.
- Broker-verified stakeholder match precision from an independently audited sample.
- Median project/client briefing preparation time against a measured within-team baseline.
- Qualified sponsor/decision-maker-confirmed financing conversations attributable to platform-supported discovery.
- Paid conversion and renewal at a disclosed price.
- Manual verification, enrichment, outreach and support cost per active team.
- Outreach compliance incidents, opt-outs, complaints and suppressed-send attempts.

**Proposed 90-day validation gates:** Interview six commercial mortgage/development-finance teams as an initial broker cohort; run three broker team paid pilots as part of the wider multi-segment plan; review retention and outcomes independently. Use the existing PMF plan’s gates as experiment targets, not public claims. Small samples justify another test, not a PMF declaration.

Define a qualified broker conversation as one where an authorized sponsor confirms a credible project/business context and discusses financing purpose or timing. A meeting is not a mandate, approval, commitment or funded loan.

## 10. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Project/public signal is mistaken for financing intent | Default need to unknown; require sponsor confirmation and stage evidence |
| Stale or weak source data damages broker trust | Display dates, source, confidence and coverage; support corrections; measure freshness |
| Wrong stakeholder association | Show match confidence and basis; require verification before sensitive outreach |
| Client intelligence invents intent or personal traits | Restrict to relevant business/project context; source and label every assertion; broker review |
| Outreach violates contact rules or damages sender reputation | Eligibility gate, suppression, contact-frequency limits, human approval and channel/provider review |
| Product scope expands into a full CRM or underwriting system | Keep the first release focused on research-to-conversation workflow and defer full credit/document functions |
| Product-market fit is inferred from market-size data | Report market assumptions separately from actual usage, paid retention and attributable outcomes |

## 11. Dependencies and open decisions

- Confirm final public brand, terminology and demo CTA destination.
- Confirm pilot geography and actual permitted source coverage.
- Decide which lender-mandate information is maintained by each team and how it is updated.
- Confirm which user-reported client data may be retained, shared within the tenant and deleted.
- Choose whether outreach services begin as concierge support or provider integrations.
- Assess video/email providers only after tenant, privacy, event, security and cost requirements are documented.
- Confirm organization roles and retention policy with product/compliance owners.

## 12. Release acceptance checklist

A broker pilot is ready only when:

- Real pilot records are distinguishable from synthetic examples.
- Every critical project/stakeholder assertion has traceable source or is clearly marked unverified.
- Financing status remains unknown until directly confirmed.
- Pipeline actions and interaction history are auditable.
- Tenant isolation passes read/write denial tests.
- Outreach remains draft-only unless recipient eligibility, required consent, suppression checks and explicit human approval all pass.
- Secure intake and privacy notices are ready before collecting sensitive borrower information.
- Coverage, pricing and product claims match what the team can actually deliver.
- Pilot success measures and baseline collection are agreed before the pilot begins.

## References within the repository

- General product scope: docs/PRD.md
- Security and data boundaries: docs/ARCHITECTURE.md
- Evidence and validation hypotheses: docs/PRODUCT_MARKET_FIT_EVIDENCE.md
- Video sales requirements: docs/COMMERCIAL_FINANCING_VIDEO_SALES.md
- Broker features and benefits: docs/FEATURES_AND_BENEFITS.md
- Public frontend integration boundary: docs/FRONTEND_INTEGRATION.md
