# docs/mission-control — entry

Where am I: the Broker Mission Control MVP handoff — a spec + static UX reference for a commercial-financing brokerage console. BC-first. Not built; `_status.md` is the ground truth on what exists. This file routes; it holds no content.

Repo root `AGENTS.md` / `CLAUDE.md` and `docs/` (PRD, ARCHITECTURE, FRONTEND_INTEGRATION) come first — read them before anything here.

## Where do I go for task X

| I need to… | Read |
|---|---|
| Kick off as a coding agent | [START_HERE.md](START_HERE.md) |
| Understand the handoff + read order | [README.md](README.md) |
| See what's actually done vs planned | [_status.md](_status.md) |
| Build the domain model, RLS, state machines, server ops | [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) |
| Work the backlog (MC-00…MC-20) | [IMPLEMENTATION.md](IMPLEMENTATION.md) |
| Qualify a deal: verticals, automation, broker review, underwriting gate | [QUALIFICATION.md](QUALIFICATION.md) |
| Build the Client Brain interview + matching | [CLIENT_BRAIN.md](CLIENT_BRAIN.md) |
| Add the agent coordinator | [CHIEF_OF_STAFF.md](CHIEF_OF_STAFF.md) |
| Adopt the agency agents / workflows | [AGENCY_AGENTS.md](AGENCY_AGENTS.md) · [agent-sources.lock.json](agent-sources.lock.json) · [workflow-registry.json](workflow-registry.json) |
| Build briefings / research providers | [CLIENT_BRIEFINGS.md](CLIENT_BRIEFINGS.md) · [RESEARCH_PROVIDERS.md](RESEARCH_PROVIDERS.md) |
| Populate sales intelligence from BuildData | [SALES_INTELLIGENCE.md](SALES_INTELLIGENCE.md) |
| Phase the broker rollout | [BROKER_MVP_ROLLOUT.md](BROKER_MVP_ROLLOUT.md) |
| Check latest sync state | [LATEST_REFERENCE.md](LATEST_REFERENCE.md) |
| Run the UX reference + its checks | [prototype/](prototype/) · `node prototype/verify-*.cjs` |

## Roles (logical, not folders — catalog-only pass, nothing moved)
- **Catalog**: this file, README, START_HERE, LATEST_REFERENCE, _status.md
- **Contracts**: SYSTEM_DESIGN, QUALIFICATION, CLIENT_BRAIN, CHIEF_OF_STAFF, IMPLEMENTATION
- **Factory (stable reference)**: AGENCY_AGENTS, RESEARCH_PROVIDERS, agent-sources.lock.json, workflow-registry.json
- **Briefings**: CLIENT_BRIEFINGS, SALES_INTELLIGENCE, BROKER_MVP_ROLLOUT
- **Product (reference)**: prototype/ + its verify-*.cjs checks

## Two financing-qualification layers (the point of this console)
1. **Deal qualification (core)** — a prospect → held, qualified financing meeting → underwriting-ready file. Automated where rules are clean; broker review for the rest; human gate before underwriting. Contract: [QUALIFICATION.md](QUALIFICATION.md).
2. **Company financing-readiness (rollup)** — the brokerage/business itself reaching a fundable state (revenue, auditable invoices, unit economics). Fed by Layer 1 outcomes. Stub in [QUALIFICATION.md](QUALIFICATION.md) §Layer 2; full contract is later work.

## Invariants here
No lending approval or funding guarantee is produced by any agent or automation. Specialization fit is never creditworthiness, funding intent, or contact eligibility. Nothing goes to underwriting without a recorded human approval. Real client interviews, lender relationships and credentials stay out of Git.
