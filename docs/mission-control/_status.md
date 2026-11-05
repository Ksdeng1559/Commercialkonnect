# Mission Control — status ledger

Ground truth for what exists. ICM invariant 9: status lives on disk. Hand-maintained until a script generates it.

**Overall:** spec + static UX reference only. No Next.js build, backend, auth, ingestion, calendar, billing or external action is implemented or verified. Reference checks are DOM-stub behavior checks, not browser/E2E/production evidence.

Legend: `spec` = contract written, not built · `scaffold` = typed code/schema landed, not wired to a provider/live DB, checks not run · `ref` = demonstrated in the static prototype only · `todo` = not started · `blocked` = waiting on a dependency.

Intake schema: `supabase/migrations/20261105_intake_funding.sql` (scaffold) — funding_verticals, funding_applications, clarification_calls, intake_classification, client_briefs; RLS on, no permissive policies (MC-03).

## Intake pipeline (feeds Layer 1) — [INTAKE.md](INTAKE.md)

| Stage | State | Note |
|---|---|---|
| 01 application capture (varied applicant types + consent) | spec | funding_applications |
| 02 clarification call (optional transcribed Google Meet) | spec | consent evidence before transcript storage |
| 03 classification into silos (app + transcript, provenance) | scaffold | `src/lib/intake/transcript-adapter.ts` — merge real, classifier provider stubbed |
| 04 client brief synthesis (source-linked, draft) | scaffold | `summarizeToBrief` real; no approval language; broker reviews |
| 05 handoff → QUALIFICATION | spec | feeds the verdict + HITL gate |

## Deal-qualification backlog (Layer 1)

| Ticket | State | Depends on | Note |
|---|---|---|---|
| MC-00 reconcile main + PRs #1–#6 | in-progress | docs/branch inspection | main merged into this branch (brings current app/src + `src/lib/supabase/server.ts`); intake code typechecks (`tsc --noEmit`: 0 errors in `src/lib/intake`). Still todo: PR #1–#6 actual-vs-planned map + ADRs |
| MC-01 port app shell + Mission Control view | ref | MC-00 | prototype only; no live claims |
| MC-02 typed Client Brain matching/qualification engine | spec | MC-00 | categorical match/out_of_mandate/needs_review |
| MC-03 workspace security + RLS foundation | todo | MC-00, Mortgage Mix spec | two-tenant denial tests |
| MC-04 persist draft/reviewed/active Brain | todo | MC-02, MC-03 | |
| MC-05 bounded real ingestion + evidence | todo | MC-03, BuildData plan | no fixture leakage |
| MC-06 real priorities/briefs/qualification | todo | MC-01,02,04,05 | |
| MC-07 pipeline/tasks/engagement evidence | todo | MC-06 | |
| MC-08 GTM review queue + drafts | todo | MC-06; PR #5 | dispatch disabled by default |
| MC-09 appointment planning + 1 calendar adapter | todo | MC-07, MC-08 | |
| MC-10 held-qualified outcomes + attribution | todo | MC-09 | north-star metric |
| MC-11 internal pilot hardening | todo | MC-03–10 | |
| MC-12 subscription/entitlements | blocked | pilot + plan | |

## Chief of Staff orchestration

| Ticket | State | Depends on |
|---|---|---|
| MC-13 coordinator planner + role/tool contracts | spec | MC-00, MC-02 |
| MC-14 durable task execution + resource accounting | todo | MC-03, MC-04, MC-13 |
| MC-15 control view + human review queue | todo | MC-01, MC-14 |
| MC-16 connect specialist adapters + verify outcomes | todo | MC-05–10, 14, 15 |

## Briefings / research

| Ticket | State | Depends on |
|---|---|---|
| MC-17 typed briefing domain + evidence/reviews | spec | MC-01–04 |
| MC-18 bounded research gateway + Exa adapter | todo | MC-03/04/14/17 |
| MC-19 Tavily adapter + optional Serper policy | todo | MC-18 |
| MC-20 source-backed synthesis + review UI | todo | MC-15/17/18(/19) |

## Workflow registry (WF ↔ MC)
Dispatch disabled. WF-01→MC-02/04 · WF-02→MC-05/06/08 · WF-03→MC-05/06 · WF-04→MC-08/09/10/16 · WF-05→engineering backlog · WF-06→MC-10/13/15.

## Company financing-readiness (Layer 2)

| Item | State | Note |
|---|---|---|
| Vertical registry | spec | [QUALIFICATION.md](QUALIFICATION.md) §Verticals |
| Automated deal qualification | spec | [QUALIFICATION.md](QUALIFICATION.md) §Automation — rides MC-02 |
| Broker-review queue | spec | everything not auto-cleared |
| HITL gate before underwriting | spec | mandatory; no auto-submit |
| Company-readiness rollup (revenue/invoices/unit economics) | todo | fed by MC-10 outcomes + Billr; later contract |

## Checks present
`prototype/verify-*.cjs` (8): reference, chief, latest, market, pilot, briefing, ooda, broker, sales-card — DOM-stub only. No qualification-engine or underwriting-gate check exists yet (add with MC-02 / QUALIFICATION).
