// Discovery/clarification-call transcript adapter — INTAKE.md stages 03→04.
// Scaffold: pure consent gate + silo merge + brief synthesis are real; the model-backed
// extraction (`TranscriptClassifier.classify`) is a boundary left unconfigured (provider = ADR).
// Nothing here verifies facts, confirms funding need, or produces a lending decision. Draft only.

export type Silo =
  | "applicant_entity"
  | "funding_purpose"
  | "amount_use"
  | "business_profile"
  | "financials"
  | "collateral"
  | "timeline"
  | "authority"
  | "financing_need"
  | "consent_contact"
  | "evidence_source";

export const SILOS: readonly Silo[] = [
  "applicant_entity", "funding_purpose", "amount_use", "business_profile",
  "financials", "collateral", "timeline", "authority", "financing_need",
  "consent_contact", "evidence_source",
] as const;

export type FieldSource = "application" | "transcript";

/** One classified field. value === null means unknown — never default it to a passing value. */
export interface ClassifiedField {
  silo: Silo;
  field: string;
  value: string | null;
  source: FieldSource;
  transcriptSpan?: string; // only when source === "transcript"
  confidence: number; // 0..1
  observedAt?: string; // ISO
}

export interface ClassificationResult {
  fields: ClassifiedField[];
  /** same (silo, field) asserted differently by application vs transcript — surfaced, never merged away */
  conflicts: Array<{ silo: Silo; field: string; application: string | null; transcript: string | null }>;
}

export interface TranscriptInput {
  text: string;
  participants: string[];
  observedAt?: string; // ISO
  /** all-party recording consent evidence (BC). Required before a transcript may be processed/stored. */
  recordingConsentEvidence?: unknown;
}

/** Fields already captured on the structured application, fed in alongside the transcript. */
export interface ApplicationFacts {
  fields: ClassifiedField[];
}

export interface ClientBriefDraft {
  summary: string;
  citations: Array<{ silo: Silo; field: string; source: FieldSource; transcriptSpan?: string }>;
  unknowns: Array<{ silo: Silo; field: string }>;
  reviewed: false; // always a draft out of this adapter
}

export class ConsentRequiredError extends Error {
  constructor() {
    super("recording consent evidence is required before a transcript may be processed");
    this.name = "ConsentRequiredError";
  }
}

export class NotConfiguredError extends Error {
  constructor(what: string) {
    super(`${what} is not configured`);
    this.name = "NotConfiguredError";
  }
}

/** Throws unless the transcript carries recording-consent evidence. Call before any processing. */
export function assertRecordingConsent(input: TranscriptInput): void {
  const e = input.recordingConsentEvidence;
  const present = e !== undefined && e !== null && !(typeof e === "string" && e.trim() === "");
  if (!present) throw new ConsentRequiredError();
}

/** The model boundary. Implementations extract silo fields from a consented transcript. */
export interface TranscriptClassifier {
  classify(input: TranscriptInput): Promise<ClassifiedField[]>;
}

/** Default stub: no provider wired. Enforces consent, then refuses rather than fabricating. */
export class NotConfiguredClassifier implements TranscriptClassifier {
  async classify(input: TranscriptInput): Promise<ClassifiedField[]> {
    assertRecordingConsent(input);
    throw new NotConfiguredError("transcript classifier provider");
  }
}

const keyOf = (f: { silo: Silo; field: string }) => `${f.silo}::${f.field}`;

/**
 * Merge application + transcript fields into one classification.
 * Unknown (null) never overwrites a known value; a known transcript value fills an unknown
 * application field; two differing known values are recorded as a conflict, application kept.
 */
export function mergePreservingUnknown(
  applicationFields: ClassifiedField[],
  transcriptFields: ClassifiedField[],
): ClassificationResult {
  const byKey = new Map<string, ClassifiedField>();
  for (const f of applicationFields) byKey.set(keyOf(f), f);

  const conflicts: ClassificationResult["conflicts"] = [];
  for (const t of transcriptFields) {
    const k = keyOf(t);
    const existing = byKey.get(k);
    if (!existing) { byKey.set(k, t); continue; }
    if (existing.value === null) { byKey.set(k, t); continue; } // fill unknown
    if (t.value !== null && t.value !== existing.value) {
      conflicts.push({ silo: t.silo, field: t.field, application: existing.value, transcript: t.value });
      // keep application value; conflict is surfaced, not merged away
    }
  }
  return { fields: [...byKey.values()], conflicts };
}

/**
 * Summarize a classification into a source-linked draft client brief.
 * Every cited claim comes from a known field; unknown fields are listed, not invented;
 * no approval or eligibility wording is produced.
 */
export function summarizeToBrief(classification: ClassificationResult): ClientBriefDraft {
  const known = classification.fields.filter((f) => f.value !== null);
  const unknown = classification.fields.filter((f) => f.value === null);

  const lines = known.map((f) => `- ${f.silo} / ${f.field}: ${f.value} (per ${f.source})`);
  const conflictLines = classification.conflicts.map(
    (c) => `- CONFLICT ${c.silo} / ${c.field}: application "${c.application}" vs transcript "${c.transcript}" — needs broker review`,
  );
  const summary = [
    "Funding request summary (draft — self-reported, unverified):",
    ...lines,
    ...(conflictLines.length ? ["", "Conflicts:", ...conflictLines] : []),
    ...(unknown.length ? ["", `Unknown / to confirm: ${unknown.length} field(s).`] : []),
  ].join("\n");

  return {
    summary,
    citations: known.map((f) => ({ silo: f.silo, field: f.field, source: f.source, transcriptSpan: f.transcriptSpan })),
    unknowns: unknown.map((f) => ({ silo: f.silo, field: f.field })),
    reviewed: false,
  };
}

/**
 * End-to-end scaffold: consent-gate → classify (provider) → merge with application → draft brief.
 * Caller persists the result (clarification_calls, intake_classification, client_briefs) and
 * routes the brief to broker review; this function performs no I/O and no qualification.
 */
export async function reviewTranscriptToBrief(
  input: TranscriptInput,
  application: ApplicationFacts,
  classifier: TranscriptClassifier = new NotConfiguredClassifier(),
): Promise<{ classification: ClassificationResult; brief: ClientBriefDraft }> {
  assertRecordingConsent(input);
  const transcriptFields = await classifier.classify(input);
  const classification = mergePreservingUnknown(application.fields, transcriptFields);
  const brief = summarizeToBrief(classification);
  return { classification, brief };
}
