import {
  type EnrichmentRequest, type EnrichmentResult, type GtmEnrichmentProvider,
  type GtmProviderId, ProviderUnavailableError,
} from "./types";

/** Opt-in allowlist; all external integrations disabled by default. */
const configuredFlags: Record<GtmProviderId, string> = {
  treg: "GTM_PROVIDER_TREG_ENABLED",
  deepline: "GTM_PROVIDER_DEEPLINE_ENABLED",
  exa: "GTM_PROVIDER_EXA_ENABLED",
  tavily: "GTM_PROVIDER_TAVILY_ENABLED",
  parallel: "GTM_PROVIDER_PARALLEL_ENABLED",
  manual: "GTM_PROVIDER_MANUAL_ENABLED",
};
const IDs = Object.keys(configuredFlags) as GtmProviderId[];
export function isProviderId(value: string): value is GtmProviderId {
  return IDs.some((id) => id === value);
}
export function validateEnrichmentRequest(input: EnrichmentRequest): void {
  if (!input.tenantId?.trim() || !input.subjectId?.trim() || !input.purpose?.trim() ||
      !input.jurisdiction?.trim()) throw new Error("Missing required enrichment context");
  if (!Number.isFinite(input.maxCostCad) || input.maxCostCad < 0) throw new Error("Invalid spend cap");
  if (!["company", "contact", "project"].includes(input.subjectType)) throw new Error("Invalid subject type");
  if (!["company_enrichment", "decision_makers", "contact_verification", "signals"].includes(input.capability))
    throw new Error("Unsupported capability");
  if (!Array.isArray(input.requestedFields) || input.requestedFields.length === 0)
    throw new Error("At least one requested field is required");
  if (!input.publicIdentifiers || typeof input.publicIdentifiers !== "object" || Array.isArray(input.publicIdentifiers))
    throw new Error("Invalid public identifiers");
}

/** Supply actual vendor adapters after API/terms review. No implicit external requests or fallback. */
export class GtmProviderRegistry {
  private providers = new Map<GtmProviderId, GtmEnrichmentProvider>();
  register(provider: GtmEnrichmentProvider): void {
    if (!isProviderId(provider.id)) throw new Error("Unknown provider ID");
    if (this.providers.has(provider.id)) throw new Error("Duplicate provider ID");
    this.providers.set(provider.id, provider);
  }
  available(): GtmProviderId[] {
    return IDs.filter((id) => process.env[configuredFlags[id]] === "true" && this.providers.has(id));
  }
  async enrich(id: GtmProviderId, request: EnrichmentRequest): Promise<EnrichmentResult> {
    validateEnrichmentRequest(request);
    if (process.env[configuredFlags[id]] !== "true")
      throw new ProviderUnavailableError(id, "Provider disabled by feature flag");
    const provider = this.providers.get(id);
    if (!provider) throw new ProviderUnavailableError(id, "No implemented adapter registered");
    if (!provider.capabilities.includes(request.capability))
      throw new ProviderUnavailableError(id, "Provider does not support requested capability");

    const result = await provider.enrich(request);
    if (result.provider !== id || result.subjectId !== request.subjectId ||
        result.reviewRequired !== true || !Number.isFinite(result.costCad ?? NaN) && result.costCad !== null ||
        result.costCad !== null && (result.costCad < 0 || result.costCad > request.maxCostCad))
      throw new Error("Provider response violates contract or budget");
    if (!Array.isArray(result.claims) || !result.claims.every((claim) =>
      Boolean(claim.field?.trim()) && Boolean(claim.value?.trim()) &&
      ["verified", "inferred", "unknown"].includes(claim.status) &&
      (claim.confidence === undefined || (Number.isFinite(claim.confidence) && claim.confidence >= 0 && claim.confidence <= 1))
    )) throw new Error("Invalid provider claims");
    return result;
  }
}
