# GTM provider adapter — implementation slice

**Branch:** `feature/gtm-provider-adapter`
**State:** Vendor-neutral TypeScript scaffold only. No live API integrations, persistence, approval UI, unit tests, billing instrumentation, or credentials.

## Included
- `src/lib/gtm/providers/types.ts`: request/response schema, claim provenance, review flag, pluggable interface and provider IDs.
- `src/lib/gtm/providers/registry.ts`: explicit provider registration, capability checks, basic validation, fail-closed opt-in flags and request cost caps.
- `src/lib/gtm/providers/index.ts`: exports.

## Example (server-side only)
```ts
import { GtmProviderRegistry } from "@/lib/gtm/providers";
const registry = new GtmProviderRegistry();
// registry.register(new ReviewedRealProviderAdapter(...)); // not implemented yet
// process.env.GTM_PROVIDER_TREG_ENABLED = "true"; // deploy via secure configuration
// await registry.enrich("treg", request); // fails closed until a real adapter is registered
```

## Mandatory next steps before use
1. Validate vendor API contract, data-use rights, rate limits, financial terms, API identity, and Canadian coverage.
2. Implement provider-specific adapters as server-only modules; secret storage, timeouts, retries and structured errors.
3. Move tenant authorization, per-tenant budget ledger, persistent usage/audit/provenance, and RLS into the authenticated service layer. Request tenant IDs alone do **not** establish authorization.
4. Add regression tests for flag-disabled, unsupported capability, budget exceeded, mismatched subject, incomplete provenance and bad responses.
5. Add a 50-project/company BC evaluation harness and side-by-side accuracy/cost report, including a manual baseline.
6. Add a human approval gate and suppression/consent checks before any CRM promotion, email or lead routing.

**Critical:** This contract is not a complete security boundary; no external invocation route should be exposed until authenticated tenancy and outbound data policies are enforced.
