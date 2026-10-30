import { writeFile } from "node:fs/promises";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  discoveryInput,
  enrichmentInput,
  enquiryDetailsInput,
  enquiryInput,
  publicEnquiryInput,
  qualificationInput,
  opportunityInput,
  completionInput,
  companyFiltersInput,
} from "../src/lib/api-v1/model";
const requestSchemas = {
  DiscoveryInput: discoveryInput,
  EnrichmentInput: enrichmentInput,
  EnquiryInput: enquiryInput,
  EnquiryDetailsInput: enquiryDetailsInput,
  PublicEnquiryInput: publicEnquiryInput,
  QualificationInput: qualificationInput,
  OpportunityInput: opportunityInput,
  CompletionInput: completionInput,
  CompanyFilters: companyFiltersInput,
};
const schemas = Object.fromEntries(
  Object.entries(requestSchemas).map(([name, schema]) => [
    name,
    {
      ...zodToJsonSchema(schema, { $refStrategy: "none", target: "openApi3" }),
      ...(name === "EnquiryDetailsInput" ? { minProperties: 1 } : {}),
    },
  ]),
);
const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
const key = {
  name: "Idempotency-Key",
  in: "header",
  required: true,
  schema: { type: "string", pattern: "^[A-Za-z0-9_-]{16,128}$" },
  description:
    "Use a fresh random key for each logical creation. Retries with the same body return the existing receipt; changed bodies return 409.",
};
const id = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "string", format: "uuid" },
};
const pagination = [
  {
    name: "limit",
    in: "query",
    schema: { type: "integer", minimum: 1, maximum: 100, default: 25 },
  },
  {
    name: "offset",
    in: "query",
    schema: { type: "integer", minimum: 0, maximum: 100000, default: 0 },
  },
];
const response = (name: string) => ({
  description: name,
  content: { "application/json": { schema: ref(name) } },
});
const commonErrors = Object.fromEntries(
  ["400", "401", "403", "404", "409", "413", "415", "503"].map((code) => [
    code,
    response("ErrorEnvelope"),
  ]),
);
const op = (
  operationId: string,
  summary: string,
  scope: string,
  status: string,
  out: string,
  input?: string,
  parameters: unknown[] = [],
) => ({
  operationId,
  summary,
  description: `Required scope: ${scope}. Workspace is derived from verified credentials, never request JSON.`,
  security: [{ ApiToken: [] }, { ClerkSession: [] }],
  parameters,
  ...(input
    ? {
        requestBody: {
          required: true,
          content: { "application/json": { schema: ref(input) } },
        },
      }
    : {}),
  responses: { [status]: response(out), ...commonErrors },
});
const base = {
  type: "object",
  required: ["data"],
  properties: { data: { type: "object" } },
};
const receipt = {
  type: "object",
  required: ["id", "createdAt", "replayed"],
  properties: {
    id: { type: "string", format: "uuid" },
    createdAt: { type: "string", format: "date-time" },
    replayed: { type: "boolean" },
  },
};
const jobReceipt = {
  ...receipt,
  required: [...receipt.required, "status"],
  properties: {
    ...receipt.properties,
    status: {
      type: "string",
      enum: ["queued", "running", "succeeded", "failed"],
    },
  },
};
const company = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    business_name: { type: "string" },
    industry: { type: "string" },
    location: { type: "string" },
    website: { type: "string", nullable: true },
    business_phone: { type: "string", nullable: true },
    business_email: { type: "string", nullable: true },
    summary: { type: "string", nullable: true },
    source: { type: "string" },
    provenance: { type: "object" },
    verification_status: { type: "string", enum: ["unverified"] },
    financing_need_status: {
      type: "string",
      enum: ["unknown", "owner_confirmed"],
    },
  },
};
const list = (item: unknown) => ({
  type: "object",
  required: ["data", "pagination"],
  properties: {
    data: { type: "array", items: item },
    pagination: {
      type: "object",
      properties: { limit: { type: "integer" }, offset: { type: "integer" } },
    },
  },
});
const generic = { type: "object", additionalProperties: true };
const enquiry = {
  ...generic,
  properties: {
    id: { type: "string", format: "uuid" },
    attribution: (schemas.EnquiryInput as { properties: Record<string, unknown> }).properties.attribution,
  },
};
const doc = {
  openapi: "3.0.3",
  info: {
    title: "CommercialKonnect Mission Control API",
    version: "1.0.0",
    description:
      "Business discovery via a scoped Windows CLI worker, funding enquiry intake, human qualification and opportunity review. A reviewed implementation slice, not a claim of live deployment.",
  },
  servers: [{ url: "/", description: "Same deployment as this API" }],
  components: {
    securitySchemes: {
      ApiToken: {
        type: "http",
        scheme: "bearer",
        description:
          "Scoped ck_ID.secret token. Store only its SHA-256 digest in server configuration.",
      },
      ClerkSession: {
        type: "apiKey",
        in: "cookie",
        name: "__session",
        description:
          "Verified Clerk session with an active organization. Browser writes require the same Origin.",
      },
    },
    schemas: {
      ...schemas,
      ReceiptEnvelope: { ...base, properties: { data: receipt } },
      JobReceiptEnvelope: { ...base, properties: { data: jobReceipt } },
      JobEnvelope: {
        ...base,
        properties: {
          data: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              kind: { type: "string", enum: ["discovery", "enrichment"] },
              status: {
                type: "string",
                enum: ["queued", "running", "succeeded", "failed"],
              },
              attempts: { type: "integer" },
              result_count: { type: "integer", nullable: true },
              error_code: { type: "string", nullable: true },
            },
          },
        },
      },
      CompanyList: list(company),
      EnquiryList: list(enquiry),
      EnquiryEnvelope: { ...base, properties: { data: enquiry } },
      OpportunityList: list(generic),
      CompletionEnvelope: base,
      ClaimEnvelope: {
        ...base,
        properties: {
          data: {
            type: "object",
            nullable: true,
            properties: {
              id: { type: "string", format: "uuid" },
              kind: { type: "string", enum: ["discovery", "enrichment"] },
              input: { type: "object" },
              run_id: { type: "string", format: "uuid" },
              lease_until: { type: "string", format: "date-time" },
            },
          },
        },
      },
      QualificationEnvelope: {
        ...base,
        properties: {
          data: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              status: {
                type: "string",
                enum: ["needs_information", "ready_for_review", "closed"],
              },
              financingApproval: { type: "boolean", enum: [false] },
            },
          },
        },
      },
      ErrorEnvelope: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "object",
            required: ["code", "message", "requestId"],
            properties: {
              code: { type: "string" },
              message: { type: "string" },
              requestId: { type: "string", format: "uuid" },
            },
          },
        },
      },
    },
  },
  paths: {
    "/api/v1/companies": {
      get: op(
        "listCompanies",
        "List saved business research candidates",
        "companies:read",
        "200",
        "CompanyList",
        undefined,
        [...pagination, ...Object.entries(
          (schemas.CompanyFilters as { properties: Record<string, unknown> }).properties,
        ).map(([name, schema]) => ({
          name, in: "query", schema,
          description: name === "financingNeed"
            ? "Exact recorded financing-need state; this is not a credit decision."
            : "Case-insensitive literal substring. q searches business name, industry and location.",
        }))],
      ),
    },
    "/api/v1/discovery-jobs": {
      post: op(
        "createDiscoveryJob",
        "Queue ConnectionOS business discovery",
        "discovery:write",
        "202",
        "JobReceiptEnvelope",
        "DiscoveryInput",
        [key],
      ),
    },
    "/api/v1/enrichment-jobs": {
      post: op(
        "createEnrichmentJob",
        "Queue LeadSniper enrichment for a saved company",
        "enrichment:write",
        "202",
        "JobReceiptEnvelope",
        "EnrichmentInput",
        [key],
      ),
    },
    "/api/v1/jobs/{id}": {
      get: op(
        "getJob",
        "Get job progress and result count",
        "jobs:read",
        "200",
        "JobEnvelope",
        undefined,
        [id],
      ),
    },
    "/api/v1/funding-enquiries": {
      get: op(
        "listFundingEnquiries",
        "List private funding enquiries",
        "enquiries:read",
        "200",
        "EnquiryList",
        undefined,
        pagination,
      ),
      post: op(
        "createFundingEnquiry",
        "Record an operator-submitted funding enquiry",
        "enquiries:write",
        "201",
        "ReceiptEnvelope",
        "EnquiryInput",
        [key],
      ),
    },
    "/api/v1/funding-enquiries/{id}": {
      get: op(
        "getFundingEnquiry",
        "Read a private funding enquiry",
        "enquiries:read",
        "200",
        "EnquiryEnvelope",
        undefined,
        [id],
      ),
      patch: op(
        "updateFundingDetails",
        "Add missing qualification details and require renewed review",
        "enquiries:write",
        "200",
        "QualificationEnvelope",
        "EnquiryDetailsInput",
        [id],
      ),
    },
    "/api/v1/funding-enquiries/{id}/qualification": {
      post: op(
        "reviewFundingEnquiry",
        "Record human qualification and broker-review readiness",
        "enquiries:qualify",
        "200",
        "QualificationEnvelope",
        "QualificationInput",
        [id],
      ),
    },
    "/api/v1/opportunities": {
      get: op(
        "listOpportunities",
        "List reviewed opportunities",
        "opportunities:read",
        "200",
        "OpportunityList",
        undefined,
        pagination,
      ),
      post: op(
        "createDiscoveredOpportunity",
        "Promote a business after owner-interest and evidence review",
        "opportunities:write",
        "201",
        "ReceiptEnvelope",
        "OpportunityInput",
        [key],
      ),
    },
    "/api/v1/worker/jobs/claim": {
      post: {
        ...op(
          "claimWorkerJob",
          "Lease one job for the configured organization",
          "jobs:work",
          "200",
          "ClaimEnvelope",
        ),
        security: [{ ApiToken: [] }],
      },
    },
    "/api/v1/worker/jobs/{id}/complete": {
      post: {
        ...op(
          "completeWorkerJob",
          "Return structured CLI results or a safe error code",
          "jobs:work",
          "200",
          "CompletionEnvelope",
          "CompletionInput",
          [id],
        ),
        security: [{ ApiToken: [] }],
      },
    },
    "/api/v1/public/funding-enquiries": {
      post: {
        ...op(
          "submitPublicFundingEnquiry",
          "Receive a website funding enquiry after Turnstile validation",
          "Public Turnstile verification",
          "201",
          "ReceiptEnvelope",
          "PublicEnquiryInput",
          [
            key,
            {
              name: "Origin",
              in: "header",
              required: true,
              schema: { type: "string", format: "uri" },
            },
          ],
        ),
        security: [],
        description:
          "Organization is fixed by server intake configuration. Turnstile action must be funding_enquiry and hostname must match the permitted website. The configured privacy notice must be shown on the form. Returns a receipt without contact data.",
      },
    },
  },
};
// Idempotent creation retries return 200, even if the first request returned 201/202.
for (const path of [
  "/api/v1/discovery-jobs",
  "/api/v1/enrichment-jobs",
  "/api/v1/funding-enquiries",
  "/api/v1/public/funding-enquiries",
  "/api/v1/opportunities",
]) {
  const post = doc.paths[path as keyof typeof doc.paths] as {
    post: { responses: Record<string, unknown> };
  };
  post.post.responses["200"] = response(
    path.includes("jobs") ? "JobReceiptEnvelope" : "ReceiptEnvelope",
  );
}
const output = JSON.stringify(doc, null, 2) + "\n";
await writeFile("openapi.json", output);
