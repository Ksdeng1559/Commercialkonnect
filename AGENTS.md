# AGENTS.md — instructions for Claude Code, Codex, Gemini and other coding agents

## Product mission
Build **KonstructionComOS**, a multi-tenant Construction Intelligence & Capital Origination SaaS. British Columbia is the first market; later Canada and US expansion require source licensing and jurisdiction-specific adapters.

## First read
Before coding, read `README.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, and **`docs/FRONTEND_INTEGRATION.md`**. Claude Code should also read `CLAUDE.md`. Inspect actual files: do not assume planned functionality exists.

## Canonical frontend decision
**Public website:** https://clearconnectcom.lovable.app/  
**Lovable source:** https://lovable.dev/projects/136ade9c-5e7f-4aea-95d7-de34af9aabc0  
**Authenticated SaaS:** build in this GitHub repository; URL TBD.

The Lovable project uses **Vite + React Router + Tailwind 3**, while this repo uses **Next.js App Router + Tailwind 4**. They are separate apps. Never copy entire Vite source over Next.js or claim code sync. Preserve existing public routes, demo lead routing and SEO. Use the Lovable site as the public-facing UX/design authority, and explicitly migrate reusable components and flows via tested adapters.

The Lovable header currently says Klick2Client and links sign-in to a separate CRM; confirm product branding and new SaaS auth destination before changing either. Keep demo projects illustrative. Do not automatically send sample opportunities to production CRM.

## Coding priorities
1. P0 Clerk Organizations and Supabase verified tenant mapping/RLS.
2. P0 BC project registry with source provenance, manual/CSV ingestion, people/companies and opportunities.
3. P0 cross-tenant denial tests, audits and evidence validation.
4. P1 source adapters, enrichment, saved alerts, subscriptions and CRM integrations.
5. P2 AI briefings and human-reviewed outreach. Use explainable scores, not invented verification.

## Security invariants
- Never accept a client-supplied tenant ID as authorization; derive from verified identity and enforce in the database.
- Keep service-role and provider secrets server-only; never in `NEXT_PUBLIC_*` values.
- Postgres RLS must have tested, restrictive policies before production CRUD.
- Store originating source URL, publisher, observation timestamp, license, verification status and confidence.
- Separate illustrative fixtures from verified real project records, with explicit UI disclosure.
- Respect CASL and applicable privacy laws; no outbound marketing from scraped public contacts without lawful authorization and suppression handling.
- No automated credit approval, funding guarantee, or unreviewed investor solicitation.
- Use idempotent external writes, input validation, logging and least privilege.

## Completion protocol
Before claiming a feature is finished, run applicable `npm run typecheck`, `npm run lint`, `npm run build`, and tests. If checks cannot run, clearly state why. Report files changed, behavior implemented, checks actually executed, follow-on work and unresolved security constraints. Keep PRs narrow and source-cited.

## Current baseline
`src/app/page.tsx` is a demo dashboard using `src/lib/demo.ts`. Supabase schema is an initial outline only with RLS enabled but no tenant access policies. Clerk, live ingestion, billing, APIs and Lovable-to-SaaS navigation are not yet integrated.

## Mission Control MVP handoff — 2026-10-17

The user selected the Mission Control + Client Brain wireframe as the first commercial mortgage/finance broker MVP experience. Read `docs/mission-control/README.md`, `SYSTEM_DESIGN.md`, `CLIENT_BRAIN.md`, `IMPLEMENTATION.md` and `START_HERE.md` in that directory before continuing this work. Runnable synthetic reference: `docs/mission-control/prototype/index.html`.

Preserve the Next.js app and public Lovable frontend. For the approved Mortgage Mix track, **`workspace_id` via existing `workspaces.clerk_org_id` is the tenant key**, while `organization_id` denotes a company relationship; this clarifies the generic organization terminology above. Inspect actual migrations and existing rows before schema work. Do not resurrect the abandoned isolated schema or mix the separate Atomic CRM project into this implementation.

The new handoff expands the target MVP experience beyond the earlier mock-only GTM queue; ingestion/security remain production dependencies. Reconcile parallel PRs instead of overwriting or silently merging them. Prototype fit numbers are specialization indicators, separate from categorical GTM readiness and evidence/contact/approval gates. Draft Client Brain edits cannot change active priorities until reviewed activation. Actual profiles and lender relationships remain private per workspace, never committed to Git. Follow the ticket acceptance criteria and report exact test evidence and gaps.

## Chief of Staff agent coordinator

The MVP now includes a Chief of Staff operating layer. Read [the orchestration contract](docs/mission-control/CHIEF_OF_STAFF.md). It coordinates discovery, enrichment, financing qualification, GTM, appointment and quality roles from the active Client Brain, with dependency-aware tasks, output review, bounded retries/resources and reporting. The checked-in prototype adds a `#chief` manual dry-run view; no real agents or integrations execute. Preserve human activation and action approval gates; the coordinator cannot grant itself permissions or approve its own outbound. Implement MC-13–MC-16 alongside the existing backlog dependencies.

## Agency Agents source and team adoption

Read [Agency Agents adoption](docs/mission-control/AGENCY_AGENTS.md), the pinned [source manifest](docs/mission-control/agent-sources.lock.json) and [workflow registry](docs/mission-control/workflow-registry.json). The synchronized `Ksdeng1559/agency-agents` fork is referenced at reviewed commit `652b2692f8d8ec2b1f1a38e559073e287dfdc469`. Begin with Chief of Staff, Workflow Architect, Discovery Coach and Evidence Collector; distinguish engineering and broker-operations teams. These are reference contracts, not installed agents. Keep runtime dispatch disabled until the existing MC security, orchestration and integration gates pass. Recheck upstream deliberately; preserve project permission rules and Canadian/lender-specific review over generic source instructions.


## Client Briefings and research providers — 2026-10-17
Read `docs/mission-control/LATEST_REFERENCE.md`, `CLIENT_BRIEFINGS.md` and `RESEARCH_PROVIDERS.md`. Static reference includes client-briefing evidence/review/export, dated market context and pilot validation; Exa/Tavily/Serper remain planned server adapters (MC-17–MC-20), with no keys or live runtime configured. Preserve existing workspace security/tenancy and Chief of Staff dependencies. Distinguish supplied/self-reported/inferred facts, namesakes, common-origin sources and stale profile-bound reviews. Never treat a generated report or provider result as verified financing need, permission to contact or a billable outcome. No production Next.js build/integration success follows from static reference checks.
