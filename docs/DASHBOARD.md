# Interactive dashboard handoff

The `feature/mock-dashboard` branch is a Next.js demo workspace. The public Lovable frontend remains a separate app. This dashboard uses a light green workspace design; exact Lovable token parity is not asserted.

## Implemented behavior

- Overview: filtered counts and assumed project values, stage distribution and discovery shortcut.
- Project discovery: combined text/stage/municipality/score filters, sorting, empty state and shortlist-only view.
- Stakeholders: project-specific role cards and validation steps; no invented company identities or contact details.
- Capital pipeline: four qualification columns, with per-project stage changes. Values represent assumed project budgets, not requested loans or committed financing.
- Project briefing: native modal dialog, score factor breakdown, financing hypothesis and explicit provenance gaps. Native dialog behavior provides focus containment; Escape dismisses and cleanup restores previous focus.
- CSV: current filtered results, session qualification state and shortlist status; synthetic disclosure on every row.
- Responsive sidebar navigation, horizontally scrolling data table and pipeline, reduced mobile grids, keyboard focus indicators, skip link, accessible labels and download status announcement.

## Code map

| File | Purpose |
| --- | --- |
| `src/components/mock-dashboard.tsx` | View selection, session state and dashboard composition |
| `src/components/project-briefing.tsx` | Modal briefing and source/score disclosure |
| `src/lib/demo.ts` | Eight synthetic fixtures, filtering and CSV serialization |
| `src/app/globals.css` | Workspace styles and responsive breakpoints |
| `tests/demo.test.ts` | Filter combinations, score consistency and CSV escaping/disclosure |
| `eslint.config.mjs` | Next.js ESLint flat config adapter |

Run `npm ci`, `npm run dev`, then visit http://localhost:3000. Credentials are unnecessary for demo use. Use Node 22.18+; CI uses Node 22. The lockfile makes dependency installation reproducible. CI runs typecheck, lint, tests and production build.

## Validation

Typecheck, lint, three data behavior tests and production build were run for this change. Browser automation was attempted but the environment had no Chromium binary and browser downloads returned invalid ZIP archives. Visual rendering, mobile layout and actual browser interactions still require the manual smoke check below; they are not claimed as verified.

Manual smoke check: explore all four views; search Surrey; combine location/stage/score filters; test the no-results state; save and unsave projects; use shortlist-only; inspect a briefing; Tab through it and close with Escape; move a pipeline card; export a filtered CSV and confirm its disclosure; repeat at 390px width; refresh and confirm session changes reset.

## Next production slice for Claude Code

Implement Clerk Organizations and server-verified organization mapping, restrictive Supabase RLS policies, and cross-organization denial tests before adding real project CRUD. Keep synthetic records separate from production data. Add provenance to real records and enforce licensed sources, lawful contact eligibility and human qualification. No auth, database write, CRM sync, outreach or deployment was added by this dashboard change.
