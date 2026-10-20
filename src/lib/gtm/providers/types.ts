/** Shared, vendor-neutral contract. Do not put API keys or raw borrower financial data here. */
export type GtmCapability = "company_enrichment" | "decision_makers" | "contact_verification" | "signals";
export type GtmProviderId = "treg" | "deepline" | "exa" | "tavily" | "parallel" | "manual";
export type ClaimStatus = "verified" | "inferred" | "unknown";
export type GtmClaim = {
  field: string;
  value: string;
  status: ClaimStatus;
  sourceUrl?: string;
  observedAt?: string;
  verifiedAt?: string;
  confidence?: number;
};
export type EnrichmentRequest = {
  tenantId: string;
  subjectId: string;
  subjectType: "company" | "contact" | "project";
  capability: GtmCapability;
  purpose: string;
  jurisdiction: string;
  requestedFields: string[];
  maxCostCad: number;
  /** Approved, non-sensitive source identifiers; never send confidential credit files. */
  publicIdentifiers: Record<string, string>;
};
export type EnrichmentResult = {
  provider: GtmProviderId;
  subjectId: string;
  claims: GtmClaim[];
  costCad: number | null;
  receivedAt: string;
  outcome: "completed" | "no_match";
  reviewRequired: true;
};
export interface GtmEnrichmentProvider {
  readonly id: GtmProviderId;
  readonly capabilities: readonly GtmCapability[];
  enrich(request: EnrichmentRequest): Promise<EnrichmentResult>;
}
export class ProviderUnavailableError extends Error {
  constructor(public readonly provider: GtmProviderId, message: string) {
    super(message);
    this.name = "ProviderUnavailableError";
  }
}
