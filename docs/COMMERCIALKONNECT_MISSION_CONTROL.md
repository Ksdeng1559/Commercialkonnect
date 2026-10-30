# CommercialKonnect Mission Control

## Product ownership — October 29, 2026

Dennis clarified the operating model:

- **CommercialKonnect.ca is Mission Control** for generating leads and opportunities, running research and enrichment, reviewing financing signals, and creating acquisition content.
- **LeadSniper 3.0 is the GMB-derived business database** from which Mission Control draws research candidates. It is not the primary operator dashboard.
- **OmniRoute is the model gateway**, not the database, CRM, source of research truth, or code execution workspace.

The authenticated product stays in this Next.js repository. This change does not modify the separate Lovable public frontend or move its forms/sign-in destinations.

## Implemented first slice

`/mission-control` provides:

1. Three clearly illustrative businesses for interface exploration; provider actions disabled for them.
2. LeadSniper CSV/JSON import with quote-aware CSV parsing, field normalization, deduplication, file/record limits, and an explicit real-data/use-rights attestation. Actual LeadSniper CSV column names are supported. Guessed email variants and review-based revenue buckets are deliberately not imported as verified intelligence.
3. An optional server-configured, organization-specific LeadSniper business feed. The endpoint must return a flat array or `{ "leads": [...] }` in the supported business format.
4. Company research through one explicit Tavily basic search per click, with up to six references, retrieval timestamps, and individual source review controls. Retrieval timestamps are not publisher dates or verification.
5. A connection to LeadSniper's existing `/api/v1/enrich-tavily-full` endpoint, if configured for the verified organization. Company summary, candidate email/phone details and growth hypotheses remain unverified. Existing provider enrichment may issue several upstream calls per click.
6. Operator-entered business-detail enrichment and supporting source URL.
7. A Research / Review / Opportunity / Hold board. Opportunity promotion requires reviewed evidence, an operator-recorded owner conversation, and an explicit interest attestation. These are workflow gates, not independently verified consent, credit approval, or CRM qualification.
8. SEO article, social post, video script and PDF-checklist **manuscripts** through OmniRoute from selected reviewed research. Outputs remain drafts, with Markdown export; this does not render a PDF or automatically publish content.
9. JSON workspace snapshot export. Workspace state is browser memory only and is lost on refresh/close; restoring snapshots is not yet implemented. Export is a backup for inspection and handoff, not database persistence.

The homepage links to Mission Control. Existing executive and Client Brain pages are retained.

## Server configuration

Keep every credential in hosting environment variables, never in browser-visible variables or repository files.

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<Clerk publishable key>
CLERK_SECRET_KEY=<Clerk secret key>
TAVILY_API_KEY=<research key>
OMNIROUTE_BASE_URL=https://your-private-gateway.example/v1
OMNIROUTE_API_KEY=<scoped inference key>
OMNIROUTE_MODEL=auto/cheap
LEADSNIPER_FEEDS_JSON={"org_REPLACE":{"url":"https://your-leadsniper.example/approved-business-feed","enrichmentUrl":"https://your-leadsniper.example/api/v1/enrich-tavily-full","token":"<optional backend bearer token>"}}
```

`url` and `enrichmentUrl` are independent and optional. Organization IDs are matched only against Clerk's verified active organization. No fallback to another organization's feed is allowed. Provider URLs must use HTTPS and cannot embed credentials. The configured backend token, if present, is sent only server-to-server. Protect the source service itself; this dashboard does not add authorization to existing LeadSniper endpoints.

**Important source finding:** LeadSniper's currently inspected `/api/v1/batch/{batch_id}/leads` implementation reads transient in-memory batch arrays, not its persistent GMB database. Do not describe that endpoint as durable database synchronization. Configure a real, scoped feed from the deployed data store, or use the existing CSV export for the first pilot. This PR does not create a feed or migrate LeadSniper's database.

To enable live actions, configure Clerk and create/select the appropriate organization. The Mission Control layout includes Clerk sign-in and organization switching; middleware covers only Mission Control and its API. Without keys, local import, browsing and board exploration work; API requests fail closed with 503. No provider token is entered into the browser.

`Check configuration` reports the presence of settings, not provider health. Successful live connectivity must be tested with deployment credentials and permitted records.

## Boundaries and operational limits

- API operations require a verified Clerk user and active organization; POST requests also require a matching Origin.
- This slice does **not** read or write Supabase, bypass RLS, establish Clerk-to-Supabase tenant mapping, or make a production multi-tenant database claim.
- Provider requests have bounded fields, outputs, timeouts and no redirect following. Six provider actions per minute per organization are allowed per process; this is a burst guard, not a distributed quota. Set hard spending budgets and an approved provider/fallback allowlist in OmniRoute before use.
- Source rights and financing interest require operator review. Directory records are research candidates, not proof of financing need. Source URLs, observation time and operator notes are retained in the snapshot; licensed retention, publisher attribution and durable audit enforcement require the persistence workstream.
- Approved research snippets are sent to OmniRoute and its selected upstream model. Drafts require human review for personal details, unsupported claims, current terms, and source accuracy. No automatic outbound messages, broker referrals, website publishing or CRM writes occur.
- Content uses a basic CommercialKonnect editorial brief. It does not claim to have synced the Notion Content Bible, Sanity, WordPress, Astro, Chatwoot or Atomic CRM.
- The public dashboard shell contains illustrative fixtures only. Imported records and drafts remain in the user's browser tab until explicitly exported.

## Validation

Run with Node 22.18+ or 24+ (native TypeScript stripping for the domain tests):

```bash
node --test tests/mission-control.test.mjs
npm run typecheck
npm run lint
npm run build
```

The domain tests cover the actual CSV format, escaping/deduplication, malformed imports, unsafe links, simulation flags, opportunity gates, editorial boundaries and organization feed isolation. Live Clerk/provider calls require configured accounts; passing local checks does not establish a deployed connection.

## Next production slice

Connect the actual LeadSniper persistent business store through a read-only organization-scoped feed. Then implement server-verified Clerk-to-database tenant mapping, restrictive RLS, durable research/draft storage, cross-tenant persistence tests and audit trails. Finally connect a reviewed content queue to the chosen CommercialKonnect publishing workflow and capture enquiry-to-opportunity attribution.

## Verification recorded for this branch

- Six domain tests passed.
- `npm run typecheck` passed.
- `npm run build` passed with the Mission Control page, protected API and scoped middleware compiled.
- Eight local HTTP smoke checks passed: existing homepage, Client Brain, Mission Control all return 200; unconfigured status, feed, research, enrichment and content endpoints all fail closed with 503.
- `npm run lint` could not execute because the baseline repository has no `eslint.config.js`, `.mjs` or `.cjs` for its ESLint 9 script. No lint success is claimed.
- Browser interaction/visual QA and authenticated live provider tests were not performed. No production deployment, feed connection or database isolation claim is made.
