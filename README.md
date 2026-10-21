# KonstructionComOS

**Construction Intelligence & Capital Origination OS** — a multi-tenant B2B SaaS for discovering early construction opportunities, identifying project stakeholders, and managing financing outreach.

## Latest additions — 2026-10-20

| Addition | Available now | Implementation boundary |
| --- | --- | --- |
| Mission Control and Client Brain | Browser-local MVP reference with reviewed interview activation, specialization matching, GTM and appointment/outcome planning | Production authentication, tenant persistence, live feeds and calendar integrations remain engineering work |
| Chief of Staff | Checked-in manual dry-run agent roster, task dependencies, output reviews, retries and stand-up view | No live agent dispatch or background scheduling |
| Agency Agents | 15 pinned source-role references and six design-only workflows; engineering and broker-operations teams | Role installation and authenticated runtime adapters are not implemented |
| Client Briefings | Quick brief, Standard, Investor-grade and Battlecard drafts; evidence register, source dates, Client Brain snapshots, review and Markdown export | Manual research and operator-assessed evidence; no automated due diligence or provider dispatch |
| Research providers | Exa, Tavily and Serper integration contract and MC-17–MC-20 engineering tasks | Server adapters, configured provider accounts, usage controls and live verification remain to build |
| Market Intelligence | Curated source-linked news/zoning, status and effective dates, profile relevance, saved briefing context and on-demand Bank of Canada yield refresh | News is not an automatic feed; hosted yield refresh remains browser-unverified; government yields are not mortgage quotes |
| Pilot validation | 90-day PMF plan, segment offers, planning assumptions and empty manual paid-team evidence register | No independently verified customer traction, payments, usage or renewal results |
| Purpose-led Content Bible | 12 topic/CTA/diagnostic candidates, three drafted content assets and three resource/checklist drafts in Notion | No publishing, automated DMs, campaigns or paid promotion enabled |
| Billing SOP | Contract-based lead, appointment, setup, custom-build, subscription and metered-service billing requirements | No Billr/Stripe connection, invoice issuance or payment collection activated |

### Client Briefings, research providers and latest dashboard

The [latest source/status map](docs/mission-control/LATEST_REFERENCE.md) and refreshed [runnable prototype](docs/mission-control/prototype/index.html) now include Client Briefings, Market Intelligence and PMF pilot validation alongside content/billing/data-readiness views. [Client Briefings](docs/mission-control/CLIENT_BRIEFINGS.md) adopts the October 12 Social Intelligence skill v1.1 for source-backed meeting preparation, evidence classification and reviewed exports.

[Exa, Tavily and Serper research integration](docs/mission-control/RESEARCH_PROVIDERS.md) is the next engineering extension: Exa discovery, Tavily source search/extraction, optional Serper coverage. These are **planned server-side adapters**, not connected dashboard capabilities. No credentials, automated research, outreach or billing are enabled. Implement MC-17–MC-20 with existing workspace security and Chief of Staff dependencies; keep the Next.js application and approved tenancy unchanged.

### Client Briefings → better financing conversations

Use **Prepare client briefing** inside an opportunity, or open [Client Briefings](https://broker-mission-control.dennis-klicksmartai.chatgpt.site/#briefing). The workflow adopts the **Social Intelligence & Counterparty Due Diligence skill v1.1 (October 12, 2026)**.

- Capture the exact person/company, domain, jurisdiction, purpose and known relationship; keep namesakes and cross-company identity bridges explicit.
- Organize professional background, offering, relationships, project/transaction history, evidence gaps and three next actions.
- Classify claims as verified, corroborated, self-reported, user-supplied, analyst inference, not verified or excluded namesake (V/C/S/U/A/N/X). Preserve stable evidence IDs and separate published, event and retrieved dates.
- Prepare financing questions and talking points using the active Client Brain. Property financing and business financing use different discovery questions; a project signal alone does not establish borrowing intent.
- Save and review the exact report revision. Claim/report/context changes invalidate review; a changed Client Brain requires refreshed context. Download the report or a research-handoff prompt.

The four output modes are Quick brief, Standard, Investor-grade and Battlecard. These are working templates: missing evidence remains unknown, and an Investor-grade export does not certify completed diligence. Current reviews are local operator records, not independent verification or permission to contact.

### Research-provider implementation order

| Phase | Deliverable | Backlog |
| --- | --- | --- |
| Foundation | Workspace-authorized briefing records, source/claim relationships, immutable revisions, review and private exports | MC-17 |
| Exa | Bounded discovery gateway with server-only credentials, idempotent jobs, quotas and source provenance | MC-18 |
| Tavily / Serper | Tavily search/extraction and optional Serper coverage, with explicit fallback policy and common-origin deduplication | MC-19 |
| Synthesis and review | Source-referenced report drafts, Chief of Staff visibility, stale-review holds and browser verification | MC-20 |

These depend on the existing tenant security, Client Brain persistence and durable Chief of Staff task contracts. Keep provider secrets server-only; use public professional queries, safe source retrieval, bounded spend and honest partial-failure states. Multiple search providers returning the same article do not establish independent corroboration. A research result does not create a financing confirmation, outreach approval, appointment or billable event.

### Market context and pilot evidence

[Market Intelligence](https://broker-mission-control.dennis-klicksmartai.chatgpt.site/#market) brings dated financing news, government bond yields and municipal zoning context into meeting preparation. Keep proposed, adopted and effective zoning changes separate; distinguish published facts from broker interpretation. Saved items can inform Chief of Staff briefings and content drafts. Source dates and coverage limits remain visible.

[Pilot validation](https://broker-mission-control.dennis-klicksmartai.chatgpt.site/#validation) follows the supplied October 14 PMF plan: broker-first launch, with adjacent contractor and commercial real estate pilots. Proposed targets include 28 interviews and eight paid team pilots (three broker, three contractor, two CRE), with activation, recurring usage, renewal, qualified-meeting and data-quality gates. Actual team evidence starts empty and stays separate from synthetic CRM totals. Pricing, TAM/SAM and acquisition scenarios are assumptions, not achieved results. [Read the source plan](docs/mission-control/prototype/pmf-source.md).

### Run and verify the refreshed reference

Serve `docs/mission-control/prototype/` with a static server and open `index.html`. No build dependencies are required. The reference saves changes in this browser under `kommercial-v1`; use non-sensitive demonstration inputs.

```sh
cd docs/mission-control/prototype
node --check app.js
node verify-reference.cjs
node verify-chief.cjs
node verify-latest.cjs
node verify-market.cjs
node verify-pilot.cjs
node verify-briefing.cjs
```

**Latest verification:** syntax and all six limited domain/DOM-stub suites passed on October 17, 2026. These checks cover interview/matching, coordinator policies, content/billing boundaries, meeting-date attribution, market parsing, pilot evidence and briefing review/exports. Browser QA remains unavailable because the managed preview could not start. Hosted research/provider, database, calendar and billing integrations were not verified. Production Next.js code/dependencies were unchanged, so its typecheck/lint/build were not rerun for this reference update.

For the next engineering session, read [START_HERE.md](docs/mission-control/START_HERE.md), reconcile current main and parallel PRs under MC-00, then follow the dependency-ordered [implementation backlog](docs/mission-control/IMPLEMENTATION.md). The refreshed static reference is the UX guide; port behavior into typed Next.js components and tenant-aware services.

### Content Bible → qualified appointments

[Notion GTM playbook and Content Bible](https://app.notion.com/p/3fa9e94cf0a481498623c0fdcd866571) applies the existing Content Bible, Get Clients and evidence-backed Power Content methods:

**One specific problem → useful teaching/process evidence → practical resource → relevant CTA → diagnostic conversation → qualified next step → recorded outcome.**

Keep two commercial motions separate:

- **Broker origination:** broker-authored content attracts suitable developers, commercial owners and business-finance prospects into a financing discovery conversation.
- **Platform acquisition:** KommercialOS content attracts commercial-finance broker teams into a product/pilot discussion. Public SaaS acquisition remains gated by internal-pilot readiness.

The initial drafts cover construction capital readiness, commercial refinance preparation and project-to-conversation intelligence for brokers. Associated worksheets support practical conversations rather than promises of financing approval. Client Brain selects audience, specialty, territory, financing range, qualification questions and the appropriate offer. Chief of Staff assigns content/research/review roles; a human approves claims and release.

Preserve content asset, campaign, CTA, resource, conversation and opportunity identifiers through **qualified conversation → booked → held qualified → evidenced mandate**. Separate borrower and platform-sales reporting, deduplicate appointment attribution and distinguish net-new from assisted outcomes. Actual performance, keyword demand and conversion baselines are not yet established. Sample projects, role prompts and scenario sliders are not proof of results.

### Verified outcomes → agreement-based billing

[Canonical Billr outcome-based billing SOP](https://app.notion.com/p/3fc9e94cf0a481fcbae9d36363e39f4f) is linked to the project-specific billing section in the [GTM playbook](https://app.notion.com/p/3fa9e94cf0a481498623c0fdcd866571).

- Define signed product/price/currency, qualification and acceptance criteria, source rights, uniqueness/allocation rules, dispute window, tax mapping and credit/refund terms before billing.
- Qualified leads require evidenced delivery and the agreed acceptance process. The **proposed appointment-product default is held, qualified and accepted**; any other trigger must be explicit in the contract.
- Setup/custom-build charges follow agreed deposits or accepted milestones. Subscriptions follow a valid billing period. Agent usage is billable only under an explicit rate/meter/acceptance agreement.
- Resource requests, engagement, synthetic prospects, completed sample tasks and unverified agent claims are not automatically billable.
- Use an append-only billing ledger, deterministic operation identity and database uniqueness. Prevent duplicate lead-plus-appointment charges unless the agreement explicitly defines separate fees, upgrades or credits. Rescheduling and charge revisions must not silently create new entitlements.
- Prepare draft invoices, route exceptions to an authorized billing reviewer and reconcile actual provider payment/refund events. Chief of Staff can propose candidates and assign reviews; it cannot self-approve disputed charges or change prices.
- Verify Billr capabilities, payment-provider account/tenant mapping, webhook handling and one authoritative invoice/collection path before integration. Avoid duplicate billing by independent adapters.
- Keep platform/service billing separate from regulated mortgage-broker compensation and financing success-fee arrangements; the latter require their own reviewed agreement and applicable approvals.

For Claude Code/Codex: carry these requirements into the existing MC-08–MC-10 content-to-outcome flow, MC-12 billing/entitlements and MC-13–MC-16 orchestration work. These links extend the engineering brief; they do not mark those tickets complete or change the approved stack. Notion is the operating-document source; the authenticated tenant-aware backend remains the application record.

## Broker Mission Control — first MVP experience (2026-10-17)

The user selected the interactive Mission Control + Client Brain wireframe as the first broker-focused MVP reference. [Open the private prototype](https://broker-mission-control.dennis-klicksmartai.chatgpt.site) or run the [checked-in static source](docs/mission-control/prototype/index.html). It covers opportunity intelligence, capital Kanban, appointment-focused GTM, outcomes and a reviewed client interview that customizes priorities, matching, playbooks and goals.

**Claude Code / Codex: start with [the engineering handoff](docs/mission-control/README.md), [system design](docs/mission-control/SYSTEM_DESIGN.md), [Client Brain contract](docs/mission-control/CLIENT_BRAIN.md), [acceptance backlog](docs/mission-control/IMPLEMENTATION.md) and [starting prompt](docs/mission-control/START_HERE.md).**

This is a functional browser-local reference, not integrated production SaaS. Preserve the Next.js application, approved Mortgage Mix workspace tenancy, existing data and public Lovable frontend. The broader MVP experience does not cancel ingestion/security dependencies or merge the parallel PRs. Numeric reference scores express specialization only; reconcile production GTM categorical readiness separately. Live data, RLS, calendar, sending, billing and browser QA remain engineering work.

## MVP: British Columbia
- Project intelligence registry with construction stage, estimated budget, source provenance, and confidence
- Pipeline for commercial mortgage/financing opportunities
- Stakeholder and company directory (developers, contractors, architects, property owners)
- Tenant-isolated workspace data with Clerk authentication and Supabase Postgres RLS
- Qualified project ranking, dashboard, and CSV import/export
- Account-based outreach workflows with compliance review (CASL/PIPEDA)

## Stack
- Next.js App Router, TypeScript, Tailwind CSS
- Clerk authentication and Organizations
- Supabase PostgreSQL with row-level security (RLS)
- shadcn/ui compatible component architecture
- Vercel (frontend), Supabase (database); optional Railway workers

## Local setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and add credentials.
3. Run `supabase start` (Supabase CLI, requires Docker) to bring up the local Postgres/Auth/Studio stack for development and tests. The CLI is **not** linked to the remote project — no personal access token available in this environment — so `supabase link`/`db push` are not used.
   - **If Docker/local stack isn't available or has port conflicts:** point `NEXT_PUBLIC_SUPABASE_URL` at the live project (`https://amgknqnhiscryvcfeoyj.supabase.co`) instead and skip `supabase start`. This project hosts a live multi-tenant platform (Mortgage Mix + RIOS) under `public` — KonstructionComOS now builds directly on that schema (see workstream below). Still never run untargeted SQL or migrations against it outside the Supabase MCP tool's `apply_migration`.
4. Apply `supabase/schema.sql` to the local stack via `supabase db reset`, or to the live Supabase project via the Supabase MCP tool's `apply_migration`. Do not paste schema SQL into the dashboard SQL editor for the live project.
5. Run `npm run dev`.
6. Configure Clerk organizations. Keep the database service-role key **server-only**.

The dashboard and demo dataset work without connected credentials. Production persistence requires authenticated API endpoints, JWT validation and RLS policies described in `docs/ARCHITECTURE.md`.

## Current workstream
Refactoring Mortgage Mix (`mix_*` tables in the live `amgknqnhiscryvcfeoyj` Supabase project) into the commercial-financing opportunity engine, fed by BC construction-project data as a new lead source — design approved, implementation **not yet started**. See `docs/superpowers/specs/2026-10-14-mortgage-mix-commercial-financing-design.md` for the tenancy unification, FK-convention decisions, and local-test harness (Vitest against the Supabase CLI's local stack). This supersedes the earlier `2026-10-14-clerk-orgs-rls-crud-design.md` schema-isolation plan, kept for history only.

**Earlier 2026-10-17 planning snapshot — historical, not current database verification.** Reinspect the actual schema and the [latest reference/status map](docs/mission-control/LATEST_REFERENCE.md) before engineering. At that check, the spec was not implemented: no `construction_projects` table, no `workspace_id` on any `mix_*` table, no `clerk_org_id` on `workspaces`, no `current_workspace_id()` helper. Two corrections to the spec's own assumptions: (1) `mix_leads` (4 rows) and `mix_opportunities` (16 rows) are **not** empty as the spec claimed — the Phase 0 backfill-to-default-workspace step needs to actually run against this real data, not treat it as a no-op; (2) a stale, abandoned `konstruction` schema (RLS enabled, zero policies, dead) remains from the superseded schema-isolation plan — flagged for cleanup, not yet dropped. Decided next concrete slice: wire the real BuildData API (`https://api.builddata.ca`, free tier, BC construction permits) into the approved `construction_projects`/`mix_opportunities` schema — chosen over building a command-center/pipeline UI first, since real data should exist before building a UI to show it. A detailed implementation plan for this slice is in progress. The broker-facing landing-page pilot-signup capture (Klick2Client/Notion spec) is confirmed explicitly gated behind internal-pilot readiness per that product doc — intentionally not being built yet.

## Parallel track: Atomic CRM construction-intelligence retrofit (separate repo)
A Notion product-definition doc (§26, locked 2026-10-14) specifies a *different* build — forking the existing Atomic CRM app at `G:\AI-Applications\atomic-crm` into a multi-tenant (`tenant_id`/RLS, Supabase Auth) construction-intelligence CRM for two internal pilot tenants (Eng & Associates financing workflow, GPC Development contractor-bid workflow), fed by the BuildData API. This does **not** target this repository and does not touch the Mortgage Mix workstream above — documented here only because the conflict with this repo's own stack was discovered during a Notion review. Full phased plan (Phase 0 Contract → Phase 5 Real-data gate, with explicit blocking gates for unresolved BuildData licence/key/scoring questions): `docs/superpowers/plans/2026-10-15-atomic-crm-construction-intelligence-retrofit.md`.

## In-progress design: GTM lead-source review queue
A doc-only branch (`docs/gtm-lead-source-playbook`, open PR #2) hands off a client-brain + offer + strategy-matching + review-queue workflow for converting construction-project signals into evidence-backed, human-reviewed opportunities. Source docs: `client.brain.md`, `docs/GTM_LEAD_SOURCE_PLAYBOOK.md`, `docs/GTM_ENRICHMENT.md`, `docs/GTM_WIREFRAME.md`, `docs/GTM_EXECUTION_LOOP.md`, `docs/GTM_GOALS_SUCCESS.md` (on that branch, not yet on `main`).

Brainstorming is underway on this repo's `main` to scope and design the first buildable slice. Scoped so far (not yet approved/implemented):
- First slice = pure TS strategy engine (`src/lib/gtm/`, CAP-01/02/03 only, categorical Research/Review/Ready/Hold output, no numeric scoring) + a review-queue UI (`/gtm`) — entirely mock-mode, two contrasting synthetic client-brain profiles, no persistence.
- Explicitly deferred: fact-confirmation forms, capital qualification Kanban, internal opportunity promotion, Today view, outcome/feedback capture — all named in the source docs as later steps.
- Depends on nothing from the Mortgage Mix or Atomic CRM tracks above; reuses none of their tenancy work since this slice has no DB yet.
- No spec file exists yet — this section is a status pointer for other sessions/tools picking up context, not a committed plan.

## Roadmap
See `docs/PRD.md` and `docs/ARCHITECTURE.md`. This is an MVP scaffold, **not** a production-ready financing, compliance or data-enrichment platform.

## Approved public frontend: ClearConnect (Lovable)

**Source website:** https://clearconnectcom.lovable.app/  
**Editable Lovable project:** https://lovable.dev/projects/136ade9c-5e7f-4aea-95d7-de34af9aabc0

**Product decision:** Use the existing ClearConnect/"Klick2Client Construction Intelligence" Lovable application as the **public-facing frontend and design source** for KonstructionComOS. Preserve its navigation and UX: Product, How It Works, Opportunities, For Brokers, Coverage, Resources, Pricing, Request Demo, Privacy and Terms. Preserve its Opportunity Explorer, illustrated BC financing journeys, demo/early-access conversion and existing lead handling unless explicitly migrated and tested.

**Verified Lovable source stack:** Vite + React 18 + TypeScript + Tailwind 3 + shadcn/ui + React Router, with existing Supabase integration files. **Current GitHub scaffold stack:** Next.js 15 + React 19 + Tailwind 4. These are *different* apps; a published URL alone is not an importable frontend. **Do not claim integration, code synchronization, unified auth or deployment is complete.**

**Integration strategy (recommended):**
1. Treat ClearConnect as the public marketing / demo frontend. Retain its existing code and publication while the SaaS backend is built.
2. Use the GitHub KonstructionComOS repository as the source of truth for the authenticated B2B SaaS product and domain model; do not replace the existing Next.js project with the Lovable/Vite project by copying files wholesale.
3. Link public "Sign In" / "Launch App" CTAs to the future authenticated app URL once deployed, not an unrelated CRM destination. Keep existing production CTAs working until transition.
4. Move shared design tokens, typography, brand assets, UI patterns and reusable opportunity concepts from the Lovable project to Next.js incrementally, reconciling Vite/React Router dependencies and Tailwind versions.
5. If a **single codebase** is preferred, plan and test a deliberate Vite-to-Next.js migration as a separate change; compare the risk/cost with keeping separate public app and SaaS app.
6. Validate organization isolation, Clerk/Supabase integration, demo vs verified data boundaries, lawful contact handling, analytics and cross-domain navigation before marking integrated.

**Implementation reference:** [docs/FRONTEND_INTEGRATION.md](docs/FRONTEND_INTEGRATION.md). Coding agents should read it alongside [AGENTS.md](AGENTS.md) and [CLAUDE.md](CLAUDE.md).

## Chief of Staff agent coordinator

The MVP now includes a Chief of Staff operating layer. Read [the orchestration contract](docs/mission-control/CHIEF_OF_STAFF.md). It coordinates discovery, enrichment, financing qualification, GTM, appointment and quality roles from the active Client Brain, with dependency-aware tasks, output review, bounded retries/resources and reporting. The checked-in prototype adds a `#chief` manual dry-run view; no real agents or integrations execute. Preserve human activation and action approval gates; the coordinator cannot grant itself permissions or approve its own outbound. Implement MC-13–MC-16 alongside the existing backlog dependencies.

## Agency Agents source and team adoption

Read [Agency Agents adoption](docs/mission-control/AGENCY_AGENTS.md), the pinned [source manifest](docs/mission-control/agent-sources.lock.json) and [workflow registry](docs/mission-control/workflow-registry.json). The synchronized `Ksdeng1559/agency-agents` fork is referenced at reviewed commit `652b2692f8d8ec2b1f1a38e559073e287dfdc469`. Begin with Chief of Staff, Workflow Architect, Discovery Coach and Evidence Collector; distinguish engineering and broker-operations teams. These are reference contracts, not installed agents. Keep runtime dispatch disabled until the existing MC security, orchestration and integration gates pass. Recheck upstream deliberately; preserve project permission rules and Canadian/lender-specific review over generic source instructions.


## Chief of Staff OODA reference — October 20, 2026

[Open Today briefing](https://broker-mission-control.dennis-klicksmartai.chatgpt.site/#today). Based on current main's [OODA specification](https://github.com/Ksdeng1559/KonstructionComOS/blob/main/docs/OODA_CHIEF_OF_STAFF.md) and the provider-branch phased plan, the refreshed reference adds Observe → Orient → Decide → Act, at most three expandable recommendations, source/freshness context, active Client Brain constraints, reasoned approval/rejection, a scoped internal preparation-note action, local audit and operator outcome feedback. Prior cycles are retained; changed inputs/profile/day hold approvals. Existing agent-management tasks remain separate and available.

This is an **on-demand browser-local reference**, not daily scheduled or live provider/agent execution. No outreach, CRM promotion, lender submission or payments occur. Ranking is an explicit ordinal heuristic; source presence is not verification or confirmed financing intent. Feedback does not activate Client Brain or count as a held qualified meeting. See [Chief of Staff details and verification](docs/mission-control/CHIEF_OF_STAFF.md#ooda-executive-reference-update--october-20-2026).

Latest checks: syntax plus all seven domain/DOM-stub suites passed, including `node verify-ooda.cjs` from the prototype directory. Managed preview recovered this session: desktop browser testing covered synthetic profile activation → briefing → evidence detail → scoped approval → local preparation/audit → outcome review. Mobile/accessibility, production tenancy, hosted providers and scheduling remain unverified. Older browser-unavailable statements above describe the prior October 17 check. Production security and real-source engineering dependencies remain as specified on `feature/gtm-provider-adapter`; no production backend implementation or merge is claimed.


## Broker-first version: three screens

The [Mission Control dashboard](https://broker-mission-control.vercel.app/#today) now defaults to **Today / Opportunities / My Pipeline**. Chief of Staff priorities appear on Today. Source and financing context expands inside an opportunity; concise client briefing, preparation notes and call planning are available there. Saved opportunities and call outcomes stay in My Pipeline. Client Brain is reached from onboarding/preferences. Illustrative fit scores and potential financing volume are removed from the broker list/summary.

Advanced GTM, content, billing, data-readiness, full market/research, analytics and agent-management views remain in the optional **Builder tools** display mode under preferences. This switch is not administrator authorization or tenant security. Existing records, deep links and earlier prototypes are retained; removing an item from My Pipeline does not delete it. The current product remains a browser-local demonstration with synthetic records, not an authenticated real-data pilot.

[Phased rollout and acceptance gates](docs/mission-control/BROKER_MVP_ROLLOUT.md):
1. **Now:** focused three-screen broker preview and contextual call preparation.
2. **First working pilot:** tenant security, one licensed BC source, provenance/freshness, persistent profile/shortlist/notes and reliable outcomes, with two-tenant denial and end-to-end verification before paid access.
3. **Next:** one reviewed research provider, durable Chief of Staff approval/audit and then one calendar adapter; scheduling only after reliability/security gates.
4. **Later:** content/video, broader market alerts/providers, billing and analytics based on retained pilot value. **Dashboard feedback, Slack routing and Google Meet interviews are deferred; nothing is connected, sent or scheduled.**

Verification: source syntax and all eight reference/chief/latest/market/pilot/briefing/OODA/broker domain/DOM-stub suites passed. Desktop browser checks covered the three-screen navigation, opportunity detail, concise briefing save, shortlist save, pipeline/outcomes and preferences/rollout. Mobile/accessibility, secure backend and live integrations remain unverified. Run `node verify-broker.cjs` with the other prototype checks. Current Sites source: `6d87de456c95f4309130bf389cf4274a38673d36`. No production Next.js build or migration was performed.
