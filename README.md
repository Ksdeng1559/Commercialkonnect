# KonstructionComOS

**Construction Intelligence & Capital Origination OS** — a multi-tenant B2B SaaS for discovering early construction opportunities, identifying project stakeholders, and managing financing outreach.

## Planned MVP: British Columbia
- Project intelligence registry with construction stage, estimated budget, source provenance, and confidence
- Pipeline for commercial mortgage/financing opportunities
- Stakeholder and company directory (developers, contractors, architects, property owners)
- Tenant-isolated workspace data with Clerk authentication and Supabase Postgres RLS
- Qualified project ranking, dashboard, and CSV import/export
- Account-based outreach workflows with compliance review (CASL/PIPEDA)

## Application stack and planned services
- Next.js App Router, TypeScript, Tailwind CSS
- Clerk authentication and Organizations
- Supabase PostgreSQL with row-level security (RLS)
- shadcn/ui compatible component architecture
- Vercel (frontend), Supabase (database); optional Railway workers

## Interactive dashboard

**Private live demo:** https://konstructionos-dashboard.dennis-klicksmartai.chatgpt.site  
**Development branch:** `feature/mock-dashboard`  
**Draft pull request:** https://github.com/Ksdeng1559/KonstructionComOS/pull/1

The dashboard contains eight fictional BC projects. All budgets, signals, scores and stakeholder roles are illustrative; each exported CSV row includes a synthetic-data disclosure. Shortlists and qualification changes are held in memory and reset on refresh.

### Views and controls

| View | Available behavior |
| --- | --- |
| Overview | Filtered project counts, assumed project value, high-priority counts, shortlist count and construction-stage distribution |
| Project discovery | Search project/city/signal, combine construction-stage/location/score filters, sort results, save or remove shortlist items, and open intelligence briefings |
| Stakeholders | Review roles to identify, project-specific validation steps and evidence gaps; expand each project into its intelligence briefing |
| Capital pipeline | Drag project cards between **Discovered**, **Reviewing**, **Qualified** and **On hold**; use direct move buttons on mobile or with a keyboard |
| CSV export | Download the currently filtered projects with qualification and shortlist state, explicitly labeled as synthetic |

Construction-stage filters describe the project lifecycle. Kanban columns describe your qualification workflow; moving a card does not change its construction stage.

### Expandable cards

- Project and stakeholder cards have expand controls that open the project intelligence briefing.
- Briefings support **80–140% magnification**, a full-width toggle and reset to the default size.
- Metric and summary cards expand into larger modal views; the opportunities panel and full Kanban board also support expansion.
- Dialogs support Escape dismissal, native modal focus containment and focus restoration.
- Kanban columns show project counts and total assumed project value. These figures represent illustrative budgets, not requested loans or committed financing.

### Demo boundaries

The dashboard currently has no connected live permit sources, verified company/contact identities, authenticated tenant access, production database persistence, CSV import, CRM synchronization or outbound messaging. Clerk and Supabase dependencies and the initial schema are present, but production integration remains planned. The private preview's owner-only access is separate from future application-level organization authentication.

The deployed preview is a separate static export of the demo. GitHub remains the application source of truth; GitHub commits do not automatically synchronize the hosted preview. Site-specific static-export configuration is maintained in the preview checkout.

## Run locally

Use **Node.js 22.18+** and npm. Credentials are unnecessary for the demo.

```bash
git clone --branch feature/mock-dashboard https://github.com/Ksdeng1559/KonstructionComOS.git
cd KonstructionComOS
npm ci
npm run dev
```

Open http://localhost:3000.

If you already have a checkout, commit or stash your current work before switching branches; then switch to `feature/mock-dashboard`, pull the latest changes, and run `npm ci`.

### Validation

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Typecheck, lint, the three automated data tests and production build passed for the dashboard implementation. The tests cover combined filters, score-factor totals and CSV escaping/disclosures. Browser drag-and-drop, responsive rendering, expansion and keyboard interactions remain unverified in this environment because browser tooling was unavailable; passing data tests does not verify those interactions.

Manual smoke check: move a project by dragging and by its move buttons, including into an empty column; confirm column counts and export state; expand project, stakeholder, metric and summary cards; magnify, reduce and reset a briefing; close dialogs with Escape; repeat on mobile; refresh to confirm session changes reset.

## Coding-agent handoff

Read [AGENTS.md](AGENTS.md), [CLAUDE.md](CLAUDE.md), [docs/PRD.md](docs/PRD.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/FRONTEND_INTEGRATION.md](docs/FRONTEND_INTEGRATION.md) before implementation. [docs/DASHBOARD.md](docs/DASHBOARD.md) describes the initial dashboard handoff; the controls above reflect the subsequent card-expansion and Kanban updates.

| File | Responsibility |
| --- | --- |
| `src/components/mock-dashboard.tsx` | Dashboard views, shared filters, shortlist and qualification state |
| `src/components/project-kanban.tsx` | Drag-and-drop qualification board, direct move buttons and move announcements |
| `src/components/project-briefing.tsx` | Project intelligence dialog, score explanation, evidence gaps and magnification |
| `src/components/expandable-card.tsx` | Reusable larger modal view for dashboard cards and panels |
| `src/lib/demo.ts` | Synthetic fixtures, filter logic and CSV serialization |
| `src/app/globals.css` | Dashboard, Kanban, responsive and expanded-card styles |
| `tests/demo.test.ts` | Data behavior checks |

Next production slice: implement Clerk Organizations, verified server-side organization mapping, restrictive Supabase RLS and cross-organization denial tests before real project CRUD. Configure secrets via `.env.example`, keep service-role credentials server-only, and review the initial `supabase/schema.sql` before use. Merely adding credentials or running the schema does not complete production integration.

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

## BuildData API — planned verified BC source adapter

**Implementation spec:** [docs/BUILDDATA_INTEGRATION.md](docs/BUILDDATA_INTEGRATION.md)  
**Provider contract:** https://www.builddata.ca/openapi.json

BuildData is the proposed initial provider for planning applications, major projects, development permits, building permits and contractor intelligence. The implementation must measure per-dataset city coverage, retain record-level provenance, avoid same-address false merges and distinguish verified activity from hypothesized commercial demand. Server-only API credentials, rate/quota handling and licensing review are required. Client-specific scoring via `client.brain.md` supports finance brokers, contractors and commercial real estate teams. **No BuildData ingestion has been implemented or authenticated API calls performed on this branch.** Finish tenant isolation before exposing real records in SaaS.

Claude Code should follow the work packages and acceptance criteria in the integration spec, in addition to the existing RLS-first project priorities.
