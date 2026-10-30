# CommercialKonnect API v1 — discovery and funding enquiries

Status: implementation branch for review. No production database migration, deployment, Windows installation, or real CLI connection has been performed.

## Responsibilities

- CommercialKonnect is Mission Control and owns this API, workspaces, jobs, received enquiries, qualification reviews and opportunities.
- ConnectionOS finds businesses. LeadSniper 3.0 is the user's locally installed CLI and GMB business research/enrichment source. Its actual Windows executable and command/output contract still need verification.
- A Windows worker pulls jobs over HTTPS, invokes an explicitly configured local wrapper, and returns structured results. The web server never executes user-provided terminal commands.
- OmniRoute remains the separate AI model gateway. Existing `/api/mission-control` draft generation is retained; this slice does not create a new content endpoint or migrate content drafts into the database.

The two entry paths remain distinct: discovered companies start as unverified prospects with unknown financing need; inbound funding enquiries start as received requests. A company can become an opportunity only after operator attestation of owner interest and reviewed evidence. An enquiry needs funding purpose, amount and timing plus a human qualification decision before broker review. None of these states is financing approval or permission to distribute data.

## Implemented endpoints

| Method        | Path                                           | Required scope                                             |
| ------------- | ---------------------------------------------- | ---------------------------------------------------------- |
| GET           | `/api/v1/companies`                            | `companies:read`                                           |
| POST          | `/api/v1/discovery-jobs`                       | `discovery:write`                                          |
| POST          | `/api/v1/enrichment-jobs`                      | `enrichment:write`                                         |
| GET           | `/api/v1/jobs/{id}`                            | `jobs:read`                                                |
| POST          | `/api/v1/worker/jobs/claim`                    | Machine token with `jobs:work`                             |
| POST          | `/api/v1/worker/jobs/{id}/complete`            | Machine token with `jobs:work`                             |
| GET, POST     | `/api/v1/funding-enquiries`                    | `enquiries:read`, `enquiries:write` respectively           |
| GET, PATCH    | `/api/v1/funding-enquiries/{id}`               | `enquiries:read`, `enquiries:write` respectively           |
| POST          | `/api/v1/funding-enquiries/{id}/qualification` | `enquiries:qualify`                                        |
| GET, POST     | `/api/v1/opportunities`                        | `opportunities:read`, `opportunities:write` respectively   |
| POST, OPTIONS | `/api/v1/public/funding-enquiries`             | Explicit origin, configured intake workspace and Turnstile |
| GET           | `/api/v1/openapi.json`                         | Public API documentation only                              |

List endpoints accept `limit` (1–100) and `offset`. Creation endpoints require a random `Idempotency-Key` (16–128 letters, digits, underscores or hyphens). Repeat the same key/body after a network failure; changed bodies return 409. Worker completion is guarded by the lease/run ID; a second completion after success returns 409 without repeating writes. The worker may rerun a provider request after a crash or expired lease; processing is not exactly once and provider charges may repeat.

### Business research search

`GET /api/v1/companies?q=fabricator&industry=manufacturing&location=Burnaby&financingNeed=unknown&limit=25`

Optional `q`, `industry` and `location` use case-insensitive literal substring matching. `q` searches business name, industry and location. Filters combine with AND and apply before pagination, within the authenticated workspace. `%` and `_` are literal characters, not wildcards. Text filters must have 1–200 characters. `financingNeed` accepts only `unknown` or `owner_confirmed`; it is a recorded state, never a prediction or credit approval. This searches saved businesses, not a live directory/provider.

### Content-to-enquiry attribution

The existing `attribution` object now also accepts optional `content` (UTM content), `campaignId`, `creativeId`, `hookId`, `assetId`, `variantId`, and `clientBrainVersion` (1–200 characters each). Existing source, medium, campaign and HTTPS landingPage inputs remain compatible. Attribution persists in the existing JSONB column and is included in authenticated enquiry list/detail responses. Public intake responses remain receipts only.

Use opaque campaign/asset identifiers, never borrower details. These fields are caller-reported tracking labels: they do not authorize access to a broker/client, prove campaign ownership, or establish referral consent. No new schema, content publishing or analytics aggregation is introduced. Replaying an idempotency key with changed attribution returns 409.

See [project-folder requirements review](API_PROJECT_REVIEW.md) for the source mapping and remaining integration priorities.

Responses use `{ "data": ... }` or `{ "error": { "code", "message", "requestId" } }`. Internal reads require authentication and return no-store responses. SQL/provider errors and CLI stderr are not sent to clients. Public submission returns only a receipt, never contact details.

## Storage and isolation

`db/api-v1.sql` is a reviewed SQL schema proposal, **not** an automatically applied migration. It creates a private `ck_api` schema with workspace links, jobs, companies, enquiries, opportunities and audit events. It does not change `public.workspaces` or the existing Mortgage Mix/RIOS records.

A read-only metadata check confirmed the existing Supabase project has `public.workspaces.id` (UUID) and `clerk_org_id`. The private mapping references that canonical workspace ID; it does not create another workspace system. Apply nothing to the shared live project until the SQL and intended workspace mapping have been reviewed and an isolated target passes validation.

RLS is enabled and forced on every new table. Runtime operations use a dedicated server-only PostgreSQL login, not the Supabase service role or table owner. The API obtains the organization from verified Clerk authentication or a server-configured hashed machine credential, sets it transaction-locally, and derives the workspace through the restricted database mapping. Request-supplied tenant/workspace fields are rejected. Transactions reset the context before the pooled connection is reused.

Production setup requires a restricted login with NOINHERIT, NOBYPASSRLS, NOSUPERUSER, NOCREATEDB and NOCREATEROLE. The API rejects privileged logins and unsafe target roles. An administrator should grant the runtime group to its login and the intake group to a separate intake login. Use an interactive password facility or secret manager, never a password committed into SQL or a command argument. Example role structure (passwords omitted deliberately):

```sql
create role ck_api_login login nosuperuser nocreatedb nocreaterole noinherit nobypassrls;
grant ck_api_runtime to ck_api_login;
create role ck_api_intake_login login nosuperuser nocreatedb nocreaterole noinherit nobypassrls;
grant ck_api_intake to ck_api_intake_login;
```

The schema proposal creates the two NOLOGIN group roles first. Configure passwords privately. Insert a `ck_api.workspace_links` row for the existing canonical workspace and its verified Clerk organization. Only an administrator provisions this mapping. The public intake role can insert received enquiries, read receipt columns for replay, and append audit events; it cannot read email/contact columns or qualify enquiries.

Remote database connections require certificate-verified TLS. If the provider uses a private CA, supply `CK_DATABASE_CA_CERT`; do not disable certificate verification. The schema uses PostgreSQL directly and is not exposed through the Supabase Data API.

## Server configuration

```env
# Dedicated restricted logins, stored only in hosting secrets.
CK_API_DATABASE_URL=postgresql://API_LOGIN:SECRET@DB_HOST:5432/postgres
CK_API_INTAKE_DATABASE_URL=postgresql://INTAKE_LOGIN:SECRET@DB_HOST:5432/postgres
CK_DATABASE_CA_CERT=
CK_API_TOKENS_JSON={}
CK_CLI_WORKER_ENABLED=false
CK_PRIVACY_NOTICE_VERSION=

# Public intake stays unavailable until all of these are configured.
CK_INTAKE_ORG_ID=
CK_INTAKE_ORIGINS_JSON=[]
TURNSTILE_SECRET_KEY=
```

Existing Clerk keys enable dashboard-session requests. Machine API calls use `Authorization: Bearer ck_ID.SECRET` and can operate independently of browser sign-in. The hash configuration maps each credential to an organization, explicit scopes and an expiry. Rotate/revoke by replacing/removing the configuration entry. No raw API token is stored on the server.

Generate a credential privately with `scripts/create-api-token.mjs`, passing a public ID (`ck_windows`), the real Clerk organization ID, a comma-separated scope list (`jobs:work` for the worker), and a future ISO expiry. It prints a new token once and a separate hash configuration entry. Keep the raw token only on the intended client. Never paste real tokens into issues, PRs, agent prompts or this public repository.

The per-workspace Windows worker token should have **only `jobs:work`**. A Printing Press client can receive its own narrower read/job scopes. Browser sessions have the defined workspace scopes except worker access. Fine-grained organization role policies can be added before inviting broader teams.

## Windows worker

Requires Node 22.18+ or 24+ and this repository checkout. It makes outbound HTTPS requests; no incoming Windows port is required. First configure:

```powershell
$env:CK_API_BASE_URL = "https://YOUR_API_HOST/api/v1"
$env:CK_WORKER_TOKEN = "SET_PRIVATELY"
$env:CK_CLI_EXECUTABLE = "C:\Program Files\nodejs\node.exe"
$env:CK_CLI_ARGS_JSON = '["C:\\YOUR_PATH\\connectionos-wrapper.mjs"]'
$env:CK_CLI_ENV_KEYS = ""
npm run worker:windows -- --once
```

The executable path must be absolute; argument arrays are operator configuration. The example points to a wrapper **that still needs to be written for the verified local CLI**, not an existing supplied ConnectionOS command. A native `.exe`, Python executable plus a fixed script path, or Node executable plus a fixed script path can be used. `.cmd`/`.bat` commands are not run through a shell. Provider credentials required by the wrapper may be explicitly allowlisted through `CK_CLI_ENV_KEYS`; database, Clerk and CK\_\* credentials are never passed into the CLI environment.

The wrapper reads one JSON line from stdin:

```json
{
  "version": 1,
  "jobId": "UUID",
  "kind": "discovery",
  "input": {
    "industry": "manufacturing",
    "location": "Burnaby, BC",
    "limit": 10
  }
}
```

For enrichment, `input` contains the selected saved `companyId`, `sourceKey`, `businessName`, `industry`, `location` and `website`. The wrapper must preserve the selected source key and return exactly one result. Discovery output must not exceed the requested limit or duplicate source keys.

It writes JSON only to stdout:

```json
{
  "companies": [
    {
      "sourceKey": "stable-provider-place-id",
      "businessName": "Example Business",
      "industry": "manufacturing",
      "location": "Burnaby, BC",
      "website": "https://example.com",
      "provenance": {
        "url": "https://example.com/about",
        "publisher": "Company website",
        "observedAt": "2026-10-29T12:00:00Z",
        "license": "Document the actual permitted source/use",
        "confidence": "low"
      }
    }
  ]
}
```

Optional `businessPhone`, `businessEmail` and `summary` fields are supported. Format validation is not verification. Output cannot set financing status, claim verified qualification, or promote a company. Each source needs actual provenance and documented permitted retention/use; the schema records the declaration, not independent license approval. Do not invent source evidence to satisfy the contract.

Run `npm run worker:windows` without `--once` only after the single-job test succeeds. Each CLI run has a two-minute timeout and bounded stdout; stderr is drained without logging. Jobs have five-minute leases and at most three attempts. Running jobs can be reclaimed after lease expiry. The API validates completion before making atomic, tenant-scoped writes.

## Public funding form

Keep the existing public form and routing unchanged until the new intake is deployed and tested. To use the new route, the form must display the configured privacy notice, explicitly collect permission to respond, keep referral permission separate (false by default), render Turnstile with action `funding_enquiry`, and send the Turnstile token with the request. The server validates Turnstile success, action and matching permitted hostname. Only explicit HTTPS origins are accepted; there is no wildcard CORS.

A replay with the same request/key returns the saved non-sensitive receipt before revalidating the one-use challenge token. An unrelated new submission always needs valid verification. Edge request-rate limits must be configured at deployment; Turnstile is not a replacement for distributed rate controls. There is no referral, outbound messaging, automatic underwriting or funded-loan decision in this slice.

## Verification and handoff

```bash
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run api:spec
```

Tests use an embedded PostgreSQL engine (PGlite), real SQL/RLS policies and separate synthetic workspace identities. They cover HTTP handler behavior, forbidden cross-workspace reads/writes/reassignment, public column restrictions, idempotency, job leases/retries, qualification, promotion, persistence after reopen, token expiry/scope, worker input isolation, and OpenAPI validity. CLI tests execute only a synthetic fixture. The external Clerk, database network, Turnstile and actual local CLI have not been exercised as a live combined system.

`openapi.json` is generated from the input schemas and served at `/api/v1/openapi.json`. It can be supplied to Printing Press after a configured staging deployment is verified. The existing Mission Control UI still uses its earlier in-memory workspace; wiring its views to these durable endpoints is a subsequent UI change. This API slice does not silently migrate browser snapshots, replace public forms, or claim CRM synchronization.

### Checks recorded on this branch

- `npm test`: 18 tests passed, including the retained Mission Control tests, PostgreSQL/RLS request flows, persistence, token handling, CLI containment and OpenAPI validation.
- `npm run typecheck`, `npm run lint` and `npm run build`: passed. ESLint now has a working configuration; generated Next.js declarations are excluded and the existing demo navigation is preserved.
- `npm run test:smoke`: 10 local HTTP checks passed against the production build, verifying page availability, public schema access, invalid token rejection, scope denial and unavailable-service failures. Only synthetic credentials were used.
- No live Clerk sign-in, external database connection, Turnstile challenge, Windows process-tree termination, or real ConnectionOS/LeadSniper execution was tested. Those are deployment acceptance checks, not implied by local test success.
