# Intake contract — application → clarification call → classification → client brief

Status: spec, not built. This is the front of the funnel that feeds [QUALIFICATION.md](QUALIFICATION.md). It turns a submitted funding application plus a clarification call (optionally a transcribed Google Meet) into a classified, source-linked funding-request summary in the client brief. No step here verifies facts, confirms funding need, or produces any lending decision; classification and the brief are drafts for broker review.

A funding application is self-reported. A clarification-call transcript is self-reported. Neither is verified evidence until a broker confirms it. Keep "applicant stated" separate from "verified" everywhere.

## Pipeline (five stages, each ends at a check)

```
01_application → 02_clarification_call → 03_classification → 04_brief → 05_handoff(QUALIFICATION)
```

### 01 Application capture
A structured funding application. **Applicant type varies** — capture it first because it sets required fields and documents:

`applicant_type`: sole_proprietor · incorporated (CCPC) · partnership · franchise · startup_under_2yr · established_operator · commercial_property_owner · developer · holdco_opco.

Capture: applicant identity + entity structure, funding purpose/product, amount requested, industry, geography, timeline, declared use of funds, contact + **consent basis** (CASL: what the applicant agreed to; a submitted application is not blanket marketing permission). Record source = application, `submitted_at`, UTM/landing page. Deduplicate by business domain + contact. Persist field provenance; unknown stays unknown.
Check: required-by-applicant-type fields present or flagged; consent recorded; dedup resolved.

### 02 Clarification call
A broker (or authorized agent) confirms the funding requirements by call. The call **may be a transcribed Google Meet**.

Transcript handling (when used):
- Transcript is a **source record**: participants, `observed_at`, recording/transcription **consent basis** (BC — all-party consent for a recording; store the consent evidence, not just a flag), provider, and the raw transcript stored server-side.
- No recording or transcription without recorded participant agreement. If consent is missing, the call still happens; only the transcript artifact is withheld.
- The transcript is input to classification, never an authorization or a verified fact on its own.

Check: consent evidence present before any transcript is stored; transcript linked to the application and opportunity.

### 03 Classification into silos
An agent extracts from the application **and** the transcript into fixed **classification silos**, with per-field provenance (which source, which transcript span), confidence, and `observed_at`. Unknown fields remain unknown — never defaulted.

| Silo | Holds |
|---|---|
| Applicant & entity | legal name, structure, ownership, years operating, licensing |
| Funding purpose | product/vertical (maps to `funding_verticals` in QUALIFICATION) |
| Amount & use of funds | requested amount (CAD), itemized use |
| Business profile | industry, operations, location(s) |
| Financials | revenue, margins, existing obligations, DSCR inputs (as stated) |
| Collateral / security | assets offered, as stated |
| Timeline & urgency | when funds needed |
| Authority | who can commit the business |
| Financing need status | unknown / hypothesis / sponsor-confirmed (default unknown) |
| Consent & contact basis | CASL basis, recording consent, suppression state |
| Evidence & source | per-field: application vs transcript-derived, confidence, span |

Conflicts between application and transcript are preserved and surfaced, not silently merged. Classification is a draft assertion set; it does not change relationship/need state on its own.
Check: every silo field tagged with source + confidence; conflicts flagged; no transcript statement promoted to "verified"; two-tenant isolation.

### 04 Client brief synthesis
The agent summarizes the funding request into the **client brief** — a source-linked, confidence-tagged summary: applicant + entity, the ask (product, amount, use of funds), business/financial snapshot as stated, collateral, timeline, authority, financing-need status, open unknowns, and source citations (application fields + transcript spans). Draft only.

The brief uses no approval or eligibility language. It is the artifact a broker reviews and the package that later feeds the HITL-before-underwriting gate in QUALIFICATION. It is distinct from `client.brain.md` (the brokerage's own profile) and from the research briefings in [CLIENT_BRIEFINGS.md](CLIENT_BRIEFINGS.md).
Check: brief is source-linked (no uncited claim); unknowns listed explicitly; no approval/eligibility wording; immutable version on broker acceptance.

### 05 Handoff to qualification
The classified silos + brief become the opportunity's input to [QUALIFICATION.md](QUALIFICATION.md): automated verdict (`auto_qualified` / `out_of_mandate` / `needs_review`), then broker review, then the HITL gate before underwriting. Intake never qualifies or submits anything itself.

## Data (proposed, reconcile under MC-00)
- `funding_applications`: id, workspace_id, applicant_type, product, amount_cad, industry, geo, use_of_funds, consent_basis, source, submitted_at, dedup_key, status.
- `clarification_calls`: id, application_id, workspace_id, participants, observed_at, recording_consent_evidence, transcript_source_id, provider.
- `intake_classification`: id, application_id, silo, field, value, source (application|transcript), transcript_span, confidence, observed_at, review_status.
- `client_briefs`: id, opportunity_id, workspace_id, version, summary, citations, unknowns, reviewed_by/at, immutable.

Transcripts and briefs hold borrower PII — workspace-scoped RLS, encryption, redaction in logs, retention/residency policy, and export controls. Never commit real applications, transcripts or briefs to Git. Classification/summary models are an ADR; provider fixtures do not prove live integration.

## Checks to add (none exist yet)
Required-field-by-applicant-type; consent recorded before transcript storage; unknown preserved through classification; application/transcript conflict surfaced; brief fully source-linked with no approval language; brief version immutable on acceptance; two-tenant isolation on applications, transcripts, classifications and briefs.
