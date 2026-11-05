# ADR-0003 — Classifier provider is a stub that throws, not a fabricator

Status: accepted
Date: 2026-11-05
Linked from: [../RECONCILE.md](../RECONCILE.md), [../INTAKE.md](../INTAKE.md)

## Context

Stage 03 classification turns an application + transcript into silo'd, provenance-tagged fields. The model that does the extraction is not wired. The question is what the default `TranscriptClassifier` does when nothing is configured.

## Decision

`NotConfiguredClassifier.classify()` throws `NotConfiguredError`. It never returns invented fields. The pure parts of the adapter are real and tested without a model: the consent gate (`assertRecordingConsent`), unknown-preserving merge (`mergePreservingUnknown`), and the source-linked draft (`summarizeToBrief`). Only the model boundary is stubbed.

This keeps a hard line between "we have no classification" and "here is a (fabricated) classification". A funding brief that silently invents applicant financials is worse than one that refuses to run.

## Consequences

- A real classifier is injected via the `classifier?` parameter on `reviewClarificationTranscript` — the call site chooses the provider; the adapter stays provider-agnostic.
- Wiring a provider (e.g. a Google Meet transcript model) is a separate ADR: it must preserve per-field provenance, confidence, and the unknown-stays-unknown rule, and it must keep "applicant stated" distinct from "verified".
- Provider fixtures prove parsing, not live integration — do not treat a passing fixture as evidence the model is connected.
