# CLAUDE.md — KonstructionComOS Claude Code briefing

You are implementing a **British Columbia-first, multi-tenant B2B construction intelligence and commercial financing SaaS**, not a generic lead list.

## Required reading
1. `AGENTS.md` (model-independent safety and engineering rules)
2. `README.md` (onboarding and current implementation truth)
3. `docs/PRD.md` (scope, priorities and definition of done)
4. `docs/ARCHITECTURE.md` (security, tenant isolation and ingestion pipeline)
5. `docs/FRONTEND_INTEGRATION.md` (approved public frontend and design mapping)

## Public frontend is already chosen
Use **https://clearconnectcom.lovable.app/** as the marketing and demo frontend. Lovable editor/source: `https://lovable.dev/projects/136ade9c-5e7f-4aea-95d7-de34af9aabc0`. Preserve its UX and navigation.

**Important:** Lovable source is Vite/React Router/Tailwind 3, while this repository is Next.js App Router/React 19/Tailwind 4. Do not claim they share a codebase or transfer dependencies blindly. Prefer public frontend + linked authenticated Next.js app, then progressively align design and port components. The front-end integration remains documentation/planning, not a connected deployment.

## Current files
- `src/app/page.tsx`: synthetic executive dashboard
- `src/lib/demo.ts`: synthetic projects
- `supabase/schema.sql`: organization/project/stakeholder/opportunity schema; RLS enabled but not wired to Clerk
- `docs/`: requirements, architecture and frontend integration
- `.github/workflows/ci.yml`: basic checks; not evidence that checks passed

## First coding workstream
Implement **Clerk Organizations + verified server-side org mapping + complete Supabase RLS policies + project CRUD + denial tests across two organizations**. Keep demo records clearly labeled and avoid mixing them into live tables. Only then wire production project listings and public CTAs.

## Working style
- Inspect the file tree, status and package scripts before changing code.
- Follow existing TypeScript/Next.js conventions; validate inputs at trust boundaries.
- Prioritize one end-to-end slice at a time over speculative architecture.
- Explain any authentication, schema, adapter or design-system decisions in docs.
- Run typecheck/lint/build/tests where available. Do not claim unexecuted checks pass.
- Never log or commit secrets/PII. CASL/PIPEDA and lending/security obligations require explicit review.
- End each task with changes, test evidence, limitations and exact next step.

## Mission Control MVP handoff — 2026-10-17

The user selected the Mission Control + Client Brain wireframe as the first commercial mortgage/finance broker MVP experience. Read `docs/mission-control/README.md`, `SYSTEM_DESIGN.md`, `CLIENT_BRAIN.md`, `IMPLEMENTATION.md` and `START_HERE.md` in that directory before continuing this work. Runnable synthetic reference: `docs/mission-control/prototype/index.html`.

Preserve the Next.js app and public Lovable frontend. For the approved Mortgage Mix track, **`workspace_id` via existing `workspaces.clerk_org_id` is the tenant key**, while `organization_id` denotes a company relationship; this clarifies the generic organization terminology above. Inspect actual migrations and existing rows before schema work. Do not resurrect the abandoned isolated schema or mix the separate Atomic CRM project into this implementation.

The new handoff expands the target MVP experience beyond the earlier mock-only GTM queue; ingestion/security remain production dependencies. Reconcile parallel PRs instead of overwriting or silently merging them. Prototype fit numbers are specialization indicators, separate from categorical GTM readiness and evidence/contact/approval gates. Draft Client Brain edits cannot change active priorities until reviewed activation. Actual profiles and lender relationships remain private per workspace, never committed to Git. Follow the ticket acceptance criteria and report exact test evidence and gaps.

## Chief of Staff agent coordinator

The MVP now includes a Chief of Staff operating layer. Read [the orchestration contract](docs/mission-control/CHIEF_OF_STAFF.md). It coordinates discovery, enrichment, financing qualification, GTM, appointment and quality roles from the active Client Brain, with dependency-aware tasks, output review, bounded retries/resources and reporting. The checked-in prototype adds a `#chief` manual dry-run view; no real agents or integrations execute. Preserve human activation and action approval gates; the coordinator cannot grant itself permissions or approve its own outbound. Implement MC-13–MC-16 alongside the existing backlog dependencies.

## Agency Agents source and team adoption

Read [Agency Agents adoption](docs/mission-control/AGENCY_AGENTS.md), the pinned [source manifest](docs/mission-control/agent-sources.lock.json) and [workflow registry](docs/mission-control/workflow-registry.json). The synchronized `Ksdeng1559/agency-agents` fork is referenced at reviewed commit `652b2692f8d8ec2b1f1a38e559073e287dfdc469`. Begin with Chief of Staff, Workflow Architect, Discovery Coach and Evidence Collector; distinguish engineering and broker-operations teams. These are reference contracts, not installed agents. Keep runtime dispatch disabled until the existing MC security, orchestration and integration gates pass. Recheck upstream deliberately; preserve project permission rules and Canadian/lender-specific review over generic source instructions.
