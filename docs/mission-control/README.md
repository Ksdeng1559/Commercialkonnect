# Broker Mission Control — MVP engineering handoff

Date: 2026-10-17. Status: user-selected first MVP experience; engineering handoff, not a production launch.

The user requested a broker-first Mission Control SaaS, appointment-focused GTM, and a Client Brain interview that customizes the dashboard. The user then selected the resulting wireframe as the first MVP and asked for this repository handoff so Claude Code or Codex can finish system design and engineering.

Private prototype: https://broker-mission-control.dennis-klicksmartai.chatgpt.site
Client Brain: https://broker-mission-control.dennis-klicksmartai.chatgpt.site/#brain

Runnable source: [prototype/index.html](prototype/index.html). Serve `docs/mission-control/prototype/` with a static server. The HTML references its adjacent CSS and JavaScript. No build dependencies. The source uses browser localStorage under `kommercial-v1`. It contains only synthetic demonstration records and a default demo brokerage label; client interview answers live in the user's browser, not in these files.

## Read in this order
1. Repository `AGENTS.md`, `CLAUDE.md`, README and existing architecture/PRD/frontend integration documents.
2. This handoff and [system design](SYSTEM_DESIGN.md).
3. [Client Brain contract](CLIENT_BRAIN.md).
4. [implementation backlog and acceptance criteria](IMPLEMENTATION.md).
5. [Chief of Staff orchestration contract](CHIEF_OF_STAFF.md).
6. [starting prompt](START_HERE.md).
7. The prototype source; then current active branches and the actual application code.

## What is implemented in the reference
- Mission Control, opportunity search, expandable briefs and financing Kanban.
- Six appointment-focused GTM playbooks, editable drafts and internal appointment records.
- Held/no-show/cancelled meeting outcomes, scenario funnel and planning goals.
- Five-step Client Brain interview, draft isolation, reviewed activation and versioning.
- Rules-based specialization ranking, shortlist, matching reasons, specialty questions, preferred playbooks and meeting goal.
- Browser-local activity history, JSON export, active `client.brain.md` download and SaaS blueprint.

## What is still engineering work
Authenticated multi-tenant persistence; verified source ingestion and enrichment; source evidence and contact permission enforcement; tested calendar availability/event creation; external CRM/Harvey adapters; subscription entitlements; complete analytics, accessible responsive QA and operational readiness. No live invitation, outbound message or financing commitment is produced by the reference.

Prototype checks were run against a lightweight JavaScript DOM stub: ten view renders, interview required fields, review gate, draft isolation, activation/goal change, purpose/property/province/amount matching, preferred plays, business-finance matching and missing-data review. JavaScript syntax passed `node --check`. These are limited behavior checks, not browser or end-to-end evidence. Visual browser QA remains unverified because the managed preview failed to start. This handoff does not claim the Next.js application build or CI passed.

## Relationship to ongoing work
| Existing work | How this handoff fits |
|---|---|
| Main: Mortgage Mix / RIOS tenancy and BuildData plan | Keep the approved `workspaces` tenant mapping and existing company/contact entities. The prototype does not change the database design or ingest-first dependency. |
| PR #1 / feature/mock-dashboard | Reuse useful components and tests after inspecting the actual diff; do not overwrite blindly. |
| PR #2 / docs/gtm-lead-source-playbook | Reconcile the existing client brain, offer, enrichment and outcome contracts. This adds a concrete interview and working UX reference. |
| PR #3 / broker-console prototype | Reconcile useful inbox/coverage patterns. This user-selected reference governs initial MVP interaction coverage; final brand tokens should align with the public frontend contract. |
| PR #4 / feature/builddata-integration-spec | Reuse ingestion contract and coverage/licensing gates. No live source access is implied here. |
| PR #5 / feature/gtm-outreach-system | Reuse the dry-run planner and categorical review outcomes. Numeric prototype fit is a specialization indicator, never a readiness decision. |
| PR #6 / feature/harvey-outreach-integration | Harvey source inclusion is separate from integration. Adapt through tenant-aware backend contracts; do not enable sending merely by adding the worker. |
| Separate Atomic CRM retrofit | Remains a different repo and auth/tenancy track; no cross-project schema or source migration in this handoff. |

PR numbers/branch states are a 2026-10-17 repository snapshot, not a claim they remain open. Recheck before merging or implementing.

This handoff adds the broader broker-first MVP destination beyond the previously proposed mock-only strategy queue. It does not declare previously deferred features complete, merge other PRs, replace Next.js with static HTML, change the public website, choose final branding, or authorize destructive database changes.

## Chief of Staff addition

[Chief of Staff](CHIEF_OF_STAFF.md) coordinates the agent team against the active Client Brain and held-qualified-meeting goal. The prototype's `#chief` screen is a manual simulation of task planning, dependencies, output review, failure/retry and stand-up reporting. It does not run LeadSniperAI, Harvey, providers, background agents or external actions. Production orchestration is MC-13–MC-16, with durable state, leases, budgets, tenant authorization and independent approval enforcement.
