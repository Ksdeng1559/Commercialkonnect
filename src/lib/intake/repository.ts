// Supabase repository for the intake/funding tables (20261105_intake_funding.sql).
// Dependency-injected: the caller (a Server Action) passes an RLS-bound SupabaseClient
// from `@/lib/supabase/server` (createRlsClient) and the Clerk-verified organization id.
// This module never resolves the tenant itself — never trust a client-supplied org id.
// Pure row mappers are exported for testing; the insert fns are thin I/O.
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ConsentRequiredError,
  type ClassifiedField,
  type ClassificationResult,
  type ClientBriefDraft,
} from "./transcript-adapter";

export interface ApplicationInput {
  applicantType: string;
  product?: string;
  amountCad?: number;
  industry?: string;
  geo?: string;
  useOfFunds?: unknown[];
  consentBasis?: Record<string, unknown>;
  source?: string;
  submittedAt?: string;
  dedupKey?: string;
}

export interface ClarificationCallInput {
  applicationId: string;
  participants: unknown[];
  observedAt?: string;
  recordingConsentEvidence?: unknown;
  transcriptSourceId?: string;
  provider?: string;
}

export interface ClientBriefInput {
  applicationId: string;
  opportunityId?: string;
  version?: number;
  summary: string;
  citations: unknown[];
  unknowns: unknown[];
}

// ---- pure row mappers (snake_case columns; organization_id is the tenant key) ----

export function applicationRow(orgId: string, i: ApplicationInput) {
  return {
    organization_id: orgId,
    applicant_type: i.applicantType,
    product: i.product ?? null,
    amount_cad: i.amountCad ?? null,
    industry: i.industry ?? null,
    geo: i.geo ?? null,
    use_of_funds: i.useOfFunds ?? [],
    consent_basis: i.consentBasis ?? {},
    source: i.source ?? null,
    submitted_at: i.submittedAt ?? null,
    dedup_key: i.dedupKey ?? null,
  };
}

/** Mirrors the DB `transcript_requires_consent` check: a transcript needs recording consent. */
export function clarificationCallRow(orgId: string, i: ClarificationCallInput) {
  const consentPresent =
    i.recordingConsentEvidence !== undefined &&
    i.recordingConsentEvidence !== null &&
    !(typeof i.recordingConsentEvidence === "string" && i.recordingConsentEvidence.trim() === "");
  if (i.transcriptSourceId && !consentPresent) throw new ConsentRequiredError();
  return {
    organization_id: orgId,
    application_id: i.applicationId,
    participants: i.participants ?? [],
    observed_at: i.observedAt ?? null,
    recording_consent_evidence: i.recordingConsentEvidence ?? null,
    transcript_source_id: i.transcriptSourceId ?? null,
    provider: i.provider ?? null,
  };
}

export function classificationRows(orgId: string, applicationId: string, fields: ClassifiedField[]) {
  return fields.map((f) => ({
    organization_id: orgId,
    application_id: applicationId,
    silo: f.silo,
    field: f.field,
    value: f.value, // null = unknown, preserved
    source: f.source,
    transcript_span: f.transcriptSpan ?? null,
    confidence: f.confidence ?? null,
    observed_at: f.observedAt ?? null,
  }));
}

export function clientBriefRow(orgId: string, i: ClientBriefInput) {
  return {
    organization_id: orgId,
    application_id: i.applicationId,
    opportunity_id: i.opportunityId ?? null,
    version: i.version ?? 1,
    summary: i.summary,
    citations: i.citations ?? [],
    unknowns: i.unknowns ?? [],
    immutable: false, // set true only on broker acceptance, elsewhere
  };
}

// ---- thin I/O (RLS enforces the tenant; policies land in MC-03) ----

async function insertOne<T>(supabase: SupabaseClient, table: string, row: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.from(table).insert(row).select().single();
  if (error) throw error;
  return data as T;
}

export async function insertApplication(supabase: SupabaseClient, orgId: string, input: ApplicationInput) {
  return insertOne(supabase, "funding_applications", applicationRow(orgId, input));
}

export async function insertClarificationCall(supabase: SupabaseClient, orgId: string, input: ClarificationCallInput) {
  return insertOne(supabase, "clarification_calls", clarificationCallRow(orgId, input));
}

export async function insertClassification(
  supabase: SupabaseClient,
  orgId: string,
  applicationId: string,
  fields: ClassifiedField[],
) {
  const rows = classificationRows(orgId, applicationId, fields);
  if (rows.length === 0) return [];
  const { data, error } = await supabase.from("intake_classification").insert(rows).select();
  if (error) throw error;
  return data ?? [];
}

export async function insertClientBrief(supabase: SupabaseClient, orgId: string, input: ClientBriefInput) {
  return insertOne(supabase, "client_briefs", clientBriefRow(orgId, input));
}

/**
 * Persist a completed transcript review: clarification call → classification rows → draft brief.
 * ponytail: these are three separate statements, not one transaction (supabase-js has no client-side
 * transaction). If partial-failure atomicity matters, move this into a Postgres function / RPC and
 * call it once. Returns the ids written.
 */
export async function persistTranscriptReview(
  supabase: SupabaseClient,
  orgId: string,
  call: ClarificationCallInput,
  result: { classification: ClassificationResult; brief: ClientBriefDraft },
): Promise<{ callId: string; classificationCount: number; briefId: string }> {
  const callRow = (await insertClarificationCall(supabase, orgId, call)) as { id: string };
  const cls = await insertClassification(supabase, orgId, call.applicationId, result.classification.fields);
  const brief = (await insertClientBrief(supabase, orgId, {
    applicationId: call.applicationId,
    summary: result.brief.summary,
    citations: result.brief.citations,
    unknowns: result.brief.unknowns,
  })) as { id: string };
  return { callId: callRow.id, classificationCount: cls.length, briefId: brief.id };
}
