# Engineering Standard — Simplicity, Reuse and Evidence

Status: **Required for new development and refactoring**. Applies to humans and AI coding agents working on commercialKonnect / KonstructionComOS.

Inspired by [Ponytail](https://github.com/dietrichgebert/ponytail), but **no external coding plugin is required** to comply. Ponytail installation and commands are optional developer tooling, not runtime dependencies or CI guarantees.

## Development requirements

1. **Understand before editing.** Inspect the current implementation, tests, package scripts, relevant PRD, architecture decisions and related components. Verify what is implemented versus merely planned.
2. **Reuse before introducing.** Prefer existing modules, shadcn-compatible components, established Next.js conventions and approved services. Search for equivalent capabilities before adding abstractions, packages, agents or integrations.
3. **Build the smallest complete vertical slice.** Follow YAGNI/KISS principles. Avoid speculative frameworks and premature generalization, but include the tests, validations, observability and error handling required for a usable feature.
4. **Keep boundaries explicit.** Public Lovable Vite frontend and authenticated Next.js platform are separate applications. Do not conflate their dependencies or codebases. Likewise distinguish the separate Atomic CRM retrofit from this repository's Mortgage Mix workstream.
5. **No simplification of security or compliance.** Never remove or weaken verified Clerk-to-tenant mappings, Supabase row-level security, cross-tenant denial tests, authorization, server-only secrets, audit logs, consent/suppression controls, CASL/PIPEDA review, data provenance or appropriate human approvals merely to reduce line counts.
6. **Avoid duplicated business logic.** Centralize financing rules, qualification logic and lead-routing decisions in tested domain functions where justified by actual reuse; do not create generic frameworks for hypothetical future products.
7. **Work in narrow PRs.** Document the goal, alternatives/reuse considered, notable trade-offs, files changed, verification results, deferred scope and any remaining risks. Separate documentation-only changes from implementation claims.
8. **Verify rather than assert.** Run available `npm run typecheck`, `npm run lint`, `npm run build` and relevant tests before completion; report failures or checks that could not run. Require targeted integration tests for tenancy, RLS, financial calculations and outbound side effects whenever touched.
9. **Do not optimize solely for fewer lines.** Correctness, readability, tenant safety, traceability and maintainability outrank code size or token savings.

## Optional Ponytail workflow

For developers using a supported coding agent, review the project's upstream README and install Ponytail only after inspecting its instructions and hooks. Use an audit or review on a feature branch and evaluate findings manually. Do not execute unfamiliar hooks with production credentials; do not treat upstream benchmarks as guaranteed savings.

## Pull-request review checklist

- [ ] Existing code and relevant specification were inspected; reuse opportunities documented.
- [ ] Scope is the smallest complete approved outcome; no speculative modules or dependencies.
- [ ] Security, tenant isolation, privacy, consent and audit requirements preserved.
- [ ] Changed behavior has proportionate tests, including failure/denial cases where applicable.
- [ ] Typecheck, lint, build and tests are reported truthfully (including not-run reasons).
- [ ] Documentation matches actual implemented status and remaining limitations.
