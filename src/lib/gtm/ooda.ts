import type { EnrichmentResult, GtmClaim, GtmProviderId } from "./providers";

/** Pure draft OODA pipeline: no external calls, storage, dispatch or implicit approvals. */
export type Signal = {
  id: string; workspaceId: string; subjectId: string; provider: GtmProviderId;
  field: string; value: string; factStatus: GtmClaim["status"];
  sourceUrl?: string; observedAt?: string; verifiedAt?: string;
  ingestedAt: string; dedupKey: string;
};
export type ClientBrainContext = {
  workspaceId: string; version: string;
  goals: string[]; constraints: string[]; prioritySubjects: string[];
};
export type Orientation = {
  workspaceId: string; signalIds: string[]; clientBrainVersion: string;
  observedFacts: string[]; hypotheses: string[]; unknowns: string[];
  constraints: string[]; risks: string[];
};
export type DecisionProposal = {
  id: string; workspaceId: string; subjectId: string;
  action: "review_enriched_prospect";
  rationale: string; evidenceSignalIds: string[];
  assumptions: string[]; risks: string[];
  status: "needs_review"; approvalRequired: true;
};
export type OodaDraft = { signals: Signal[]; orientation: Orientation; proposals: DecisionProposal[] };

export function draftOodaFromEnrichment(
  workspaceId: string,
  subjectId: string,
  result: EnrichmentResult,
  context: ClientBrainContext,
  timestamp: string,
): OodaDraft {
  if (!workspaceId || !subjectId || context.workspaceId !== workspaceId ||
      result.subjectId !== subjectId || !Number.isFinite(Date.parse(timestamp)))
    throw new Error("OODA workspace/subject/time mismatch");
  if (result.reviewRequired !== true) throw new Error("Human review must remain required");
  const seen = new Set<string>();
  const signals = result.claims.flatMap((claim): Signal[] => {
    if (!claim.field.trim() || !claim.value.trim()) return [];
    const dedupKey = JSON.stringify([workspaceId, subjectId, claim.field.trim().toLowerCase(), claim.value.trim().toLowerCase(), claim.sourceUrl ?? ""]);
    if (seen.has(dedupKey)) return [];
    seen.add(dedupKey);
    return [{
      id: `signal-${signalsIndex(seen.size)}`,
      workspaceId, subjectId, provider: result.provider,
      field: claim.field, value: claim.value,
      factStatus: claim.status,
      sourceUrl: claim.sourceUrl, observedAt: claim.observedAt,
      verifiedAt: claim.verifiedAt, ingestedAt: timestamp, dedupKey,
    }];
  });
  const evidenced = signals.filter(s => s.factStatus === "verified" && !!s.sourceUrl);
  const unknowns = signals.filter(s => s.factStatus === "unknown" || !s.sourceUrl);
  const hypotheses = signals.filter(s => s.factStatus === "inferred");
  const orientation: Orientation = {
    workspaceId, signalIds: signals.map(s => s.id), clientBrainVersion: context.version,
    observedFacts: evidenced.map(s => `${s.field}: ${s.value}`),
    hypotheses: hypotheses.map(s => `${s.field}: ${s.value}`),
    unknowns: unknowns.map(s => `${s.field}: unverified evidence or unknown`),
    constraints: context.constraints,
    risks: ["Financing need is unconfirmed until verified directly", "Provider claims require analyst review"],
  };
  const proposals: DecisionProposal[] = evidenced.length ? [{
    id: `review-${subjectId}`, workspaceId, subjectId, action: "review_enriched_prospect",
    rationale: `Review ${evidenced.length} source-backed claim(s) against Client Brain goals; no financing intent inferred.`,
    evidenceSignalIds: evidenced.map(s => s.id),
    assumptions: ["Source-backed provider claims are not independently sponsor-confirmed"],
    risks: orientation.risks,
    status: "needs_review", approvalRequired: true,
  }] : [];
  return { signals, orientation, proposals };
}
function signalsIndex(number: number): string { return String(number).padStart(3, "0"); }
