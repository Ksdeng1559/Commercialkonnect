# docs/ — catalog

Routing for the planning and design docs. This file points; it holds no content. Code lives in `src/`, `supabase/`, `scripts/`, `wp/` and is out of scope for this catalog. Project-wide entry and rules are in the repo-root `AGENTS.md` and `CLAUDE.md`.

ICM applied in catalog-only mode (2026-11-04): docs were indexed in place, not moved, because `CLAUDE.md` hardcodes several of these paths as required reading. Group labels below are logical, not folders.

## Product (contracts — read first)
- [PRD.md](PRD.md) — product requirements for KonstructionComOS: scope, priorities, definition of done.
- [ARCHITECTURE.md](ARCHITECTURE.md) — architecture and security boundaries: tenant isolation, ingestion pipeline, RLS.

## Integrations
- [BUILDDATA_INTEGRATION.md](BUILDDATA_INTEGRATION.md) — BuildData API BC project-intelligence ingestion plan (planned; not yet implemented).
- [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md) — ClearConnect public frontend integration plan (Lovable SPA; documentation, not a connected deploy).
- [OPENSEO_LINKAGE.md](OPENSEO_LINKAGE.md) — OpenSEO → CommercialKonnect linkage; research lives in the private openseo-project repo.

## GTM / marketing
- [SEO_PLAN.md](SEO_PLAN.md) — CommercialKonnect SEO plan and content requirements.
- [FLOW_CONTENT_PIPELINE.md](FLOW_CONTENT_PIPELINE.md) — FLOW content pipeline.
- [COMMERCIALKONNECT_FINANCING_DIRECTORY_PLAN.md](COMMERCIALKONNECT_FINANCING_DIRECTORY_PLAN.md) — financing offer directory plan.
- [COMMERCIALKONNECT_WORDPRESS_EXECUTIVE_PLAN.md](COMMERCIALKONNECT_WORDPRESS_EXECUTIVE_PLAN.md) — WordPress (Divi) executive plan.

## Reference (stable)
- [LENDER_DIRECTORY.md](LENDER_DIRECTORY.md) — lender directory, source of record.

## superpowers/ — specs → plans pipeline (dated)
Design specs precede implementation plans; filenames carry the date.
- `superpowers/specs/` — design specs:
  - [clerk-orgs-rls-crud-design](superpowers/specs/2026-10-14-clerk-orgs-rls-crud-design.md) · [mortgage-mix-commercial-financing-design](superpowers/specs/2026-10-14-mortgage-mix-commercial-financing-design.md) · [gtm-lead-source-engine-design](superpowers/specs/2026-10-15-gtm-lead-source-engine-design.md)
- `superpowers/plans/` — implementation plans:
  - [mortgage-mix-tenancy-clerk](superpowers/plans/2026-10-14-mortgage-mix-tenancy-clerk.md) · [atomic-crm-construction-intelligence-retrofit](superpowers/plans/2026-10-15-atomic-crm-construction-intelligence-retrofit.md) · [builddata-mortgage-mix-ingestion-plan](superpowers/plans/2026-10-17-builddata-mortgage-mix-ingestion-plan.md) · [builddata-pr4-reconciled-plan](superpowers/plans/2026-10-17-builddata-pr4-reconciled-plan.md)

## Moved out (2026-11-04)
Openseo/marketing research artifacts relocated from the repo root to `marketing/` (gitignored; canonical copy in the private openseo-project repo): `build-plan.md`, `private-lender.html`.
