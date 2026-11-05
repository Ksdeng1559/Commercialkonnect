# ADR-0002 — Intake persistence is non-atomic (three inserts, not one transaction)

Status: accepted
Date: 2026-11-05
Linked from: [../RECONCILE.md](../RECONCILE.md), [../INTAKE.md](../INTAKE.md)

## Context

`persistTranscriptReview()` in `src/lib/intake/repository.ts` writes a clarification call, then classification rows, then a draft client brief. `supabase-js` has no client-side transaction, so these are three independent statements against PostgREST. A failure on statement 2 or 3 leaves a partial write (a call with no brief).

## Decision

Ship the three-insert version. The intake brief is a draft for broker review, not a financial record; a partial write is visible to the broker (a call with no brief shows as incomplete) and is re-runnable. Atomicity is not worth a Postgres function yet.

The ceiling is marked in code with a `ponytail:` comment and the upgrade path: if partial-failure atomicity ever matters (e.g. briefs become billable artifacts), move the three writes into a single `plpgsql` function / RPC and call it once.

## Consequences

- No data-loss risk: nothing here is a source of truth; the application and transcript are the sources, and both persist first.
- A broker may briefly see an orphaned call row if insert 2/3 fails. Acceptable for a draft; surfaced, not hidden.
- Revisit at MC-04 (persist draft/reviewed/active) when brief immutability-on-acceptance is wired — acceptance is the point atomicity starts to matter.
