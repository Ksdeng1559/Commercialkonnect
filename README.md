# KonstructionComOS

**Construction Intelligence & Capital Origination OS** — a multi-tenant B2B SaaS for discovering early construction opportunities, identifying project stakeholders, and managing financing outreach.

## Latest additions — 2026-10-17

| Addition | Available now | Implementation boundary |
| --- | --- | --- |
| Mission Control and Client Brain | Browser-local MVP reference with reviewed interview activation, specialization matching, GTM and appointment/outcome planning | Production authentication, tenant persistence, live feeds and calendar integrations remain engineering work |
| Chief of Staff | Checked-in manual dry-run agent roster, task dependencies, output reviews, retries and stand-up view | No live agent dispatch or background scheduling |
| Agency Agents | 15 pinned source-role references and six design-only workflows; engineering and broker-operations teams | Role installation and authenticated runtime adapters are not implemented |
| Purpose-led Content Bible | 12 topic/CTA/diagnostic candidates, three drafted content assets and three resource/checklist drafts in Notion | No publishing, automated DMs, campaigns or paid promotion enabled |
| Billing SOP | Contract-based lead, appointment, setup, custom-build, subscription and metered-service billing requirements | No Billr/Stripe connection, invoice issuance or payment collection activated |

### Client Briefings, research providers and latest dashboard

The [latest source/status map](docs/mission-control/LATEST_REFERENCE.md) and refreshed [runnable prototype](docs/mission-control/prototype/index.html) now include Client Briefings, Market Intelligence and PMF pilot validation alongside content/billing/data-readiness views. [Client Briefings](docs/mission-control/CLIENT_BRIEFINGS.md) adopts the October 12 Social Intelligence skill v1.1 for source-backed meeting preparation, evidence classification and reviewed exports.

[Exa, Tavily and Serper research integration](docs/mission-control/RESEARCH_PROVIDERS.md) is the next engineering extension: Exa discovery, Tavily source search/extraction, optional Serper coverage. These are **planned server-side adapters**, not connected dashboard capabilities. No credentials, automated research, outreach or billing are enabled. Implement MC-17–MC-20 with existing workspace security and Chief of Staff dependencies; keep the Next.js application and approved tenancy unchanged.

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

**2026-10-17 planning update.** Live Supabase check confirmed zero implementation of the spec above: no `construction_projects` table, no `workspace_id` on any `mix_*` table, no `clerk_org_id` on `workspaces`, no `current_workspace_id()` helper. Two corrections to the spec's own assumptions: (1) `mix_leads` (4 rows) and `mix_opportunities` (16 rows) are **not** empty as the spec claimed — the Phase 0 backfill-to-default-workspace step needs to actually run against this real data, not treat it as a no-op; (2) a stale, abandoned `konstruction` schema (RLS enabled, zero policies, dead) remains from the superseded schema-isolation plan — flagged for cleanup, not yet dropped. Decided next concrete slice: wire the real BuildData API (`https://api.builddata.ca`, free tier, BC construction permits) into the approved `construction_projects`/`mix_opportunities` schema — chosen over building a command-center/pipeline UI first, since real data should exist before building a UI to show it. A detailed implementation plan for this slice is in progress. The broker-facing landing-page pilot-signup capture (Klick2Client/Notion spec) is confirmed explicitly gated behind internal-pilot readiness per that product doc — intentionally not being built yet.

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
