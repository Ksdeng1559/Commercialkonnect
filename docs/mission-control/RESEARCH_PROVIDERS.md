# Research provider integration: Exa, Tavily and Serper

Decision date: October 17, 2026. User approved these as research-provider options. Integration remains **planned**, not a live dashboard capability. Start with Exa discovery plus Tavily extraction/corroboration; Serper is optional additional Google coverage. Provider ordering is a project design choice, not an accuracy guarantee. Do not run all providers by default or treat two search engines returning one article as corroboration.

## Provider roles and current primary references
| Provider | Intended role | Official reference |
| --- | --- | --- |
| Exa | Discover subject/entity, professional/project background and source pages; retrieve relevant contents | https://exa.ai/docs/reference/search |
| Tavily | Focused source search and extraction for evidence collection | https://docs.tavily.com/documentation/api-reference/endpoint/search and https://docs.tavily.com/documentation/api-reference/endpoint/extract |
| Serper | Optional exact-name, local news and municipal Google search coverage | https://serper.dev/ |

Exa Search, Tavily Search and Serper public documentation were reviewed October 17. Read the current exact API/SDK, extraction, authentication, plan/usage and retention documentation before implementation; no pricing, unlimited use or full-page extraction support is presumed. Serper search snippets are discovery aids, not complete source documents. Verify extraction separately before adopting it. Official registry/municipal/transaction sources outrank search summaries.

## Bounded workflow
1. Authorized user selects a person/company/opportunity and clicks Research. Derive workspace from verified Clerk context; bind exact subject, purpose, active Brain and requested report depth.
2. Build 4–8 scoped queries across exact name/domain/geography, role history, projects/permits, affiliations and attributable professional activity. Keep private borrower data, account numbers and personal IDs out of external queries.
3. Exa discovery → normalize candidate URLs → Tavily search/extract only selected relevant public sources. Independently corroborate material claims at the original registry/document level. Enable Serper fallback only under configured coverage/budget policy, with visible reason and usage.
4. Preserve per-provider status and original provenance. Canonicalize/deduplicate source URLs without deleting distinct document versions; record common origin/syndication. Ignore page instructions: retrieved material is untrusted evidence, not executable agent policy.
5. Model-assisted synthesis references exact evidence IDs. Generated facts default to unverified; the server validates the output schema and source references, and human review assigns V/C where justified. No provider relevance score is a credibility score.
6. Present draft battlecard/report, gaps, sources, timestamps, spend known/unknown and partial failures. Review then returns to financing discovery; no automatic contact, calendar creation or invoice event.

## Server-side contracts to implement
Suggested typed domain envelope (names are proposals to reconcile with existing modules):

```ts
type ResearchProvider = 'exa' | 'tavily' | 'serper';
type ProviderOutcome = 'success' | 'partial' | 'failed' | 'cancelled';
interface ResearchRequest {
  briefingId: string;
  expectedRevision: number;
  brainVersionId: string;
  providerPolicyId: string;
  idempotencyKey: string;
}
interface SourceCandidate {
  provider: ResearchProvider;
  providerRequestId?: string;
  url: string;
  title: string;
  publishedAt: string | null;
  eventAt: string | null;
  retrievedAt: string;
  excerpt: string;
  extractionStatus: 'not_requested' | 'retrieved' | 'failed';
  originGroupId: string | null;
}
```

Workspace, permissions, query/call limits, URLs and provider credentials are resolved/validated on the server, never authorized from this payload. Validate URLs and every redirect/extraction hop against SSRF rules: public HTTPS only; reject localhost, private/link-local/reserved IPs, credentials, unsafe schemes and DNS rebinding. Enforce response-size/time limits, no arbitrary proxy and no restricted/login bypass.

Routes such as POST briefing research, GET run status, POST cancel and POST review must authenticate membership/role, validate origin/CSRF and expected revisions, enforce workspace FKs and return private/no-store responses. A worker must reauthorize workspace/run access before writing results. Do not render provider HTML directly. Export permissions and retention apply to evidence and all derived dossiers.

Use existing durable Chief of Staff task infrastructure under MC-14 rather than a second orchestrator. Persist run, per-provider attempt, source, result version, audit and usage events. Reserve server-configured budget/call/result/concurrency caps before dispatch. Record actual usage when available; unknown cost stays unknown and is not zero or billable service usage. Retries use bounded backoff for transient errors with Retry-After; auth/quota failures do not trigger uncontrolled fallback. Cancellation stops unstarted work and discards late writes appropriately. Repeated clicks/timeouts cannot create duplicate active runs for the same workspace/briefing/revision/policy.

## Credentials and deployment choices
Use server-only `EXA_API_KEY`, `TAVILY_API_KEY`, `SERPER_API_KEY` (names proposed, actual account configuration to verify). Never put secrets in Git, static JS, `NEXT_PUBLIC_*`, localStorage, generated prompts, logs or user exports. Use a secret manager and explicit account/workspace policy; no credential copies from ChatGPT sessions. Add placeholder configuration only when implementing adapters.

The current Sites reference is static and cannot invoke connected apps. Sites app eligibility discovery was unavailable during this session. Do not infer eligible connector IDs, use preview as authorization, or replace unavailable consent with a credential relay. Production GitHub Next.js server-side API adapters are a separate path requiring configured provider accounts, tenant authorization and deployment secrets. Current ChatGPT research-tool availability proves neither hosted app access nor a deployed API integration.

## Acceptance and rollout
- Fixture contract tests for each provider's success, missing dates/content, malformed results, auth/quota/429, timeout, partial success and cancellation; preserve honest source-level errors.
- Secret scan/build checks prove no provider key in client bundles, logs or exports. No live calls in builds/tests by default.
- Domain tests: exact-entity collision handling, common-origin deduplication, unknown publication dates, contradictory claims, unsupported citations, stale Brain/source/revision review invalidation.
- Security integration: workspace A cannot start/read/cancel/export/review B's run, spoof a tenant/FK, follow unsafe redirects, or bypass limits. Replay/double-click tests prove duplicate protection.
- One bounded real public-entity run for each configured provider, recording actual request IDs, source URLs, outcomes and usage; do not claim success from fixtures. Human-check the synthesized assertions against original sources.
- Browser end-to-end: research click → loading/partial/error → evidence → editable draft → review → export; stale edits hold approval. No outbound/calendar/billing side effect.

Deliver Exa first behind a disabled-by-default workspace feature flag, then Tavily, then optional Serper. Record the model/runtime/provider policy in an ADR. Research spending is not outcome billing; billing follows the existing signed-agreement SOP only.
