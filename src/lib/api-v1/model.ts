import { z } from "zod";
import { createHash } from "node:crypto";
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
export const scopes = [
  "companies:read",
  "discovery:write",
  "enrichment:write",
  "jobs:read",
  "jobs:work",
  "enquiries:read",
  "enquiries:write",
  "enquiries:qualify",
  "opportunities:read",
  "opportunities:write",
] as const;
export type Scope = (typeof scopes)[number];
export interface Actor {
  orgId: string;
  id: string;
  kind: "session" | "machine" | "intake";
  scopes: readonly Scope[];
}
const short = z.string().trim().min(1).max(200);
const httpsUrl = z
  .string()
  .max(2048)
  .url()
  .refine((v) => {
    const u = new URL(v);
    return u.protocol === "https:" && !u.username && !u.password;
  }, "Use an HTTPS URL without credentials");
export const discoveryInput = z
  .object({
    industry: short,
    location: short,
    limit: z.number().int().min(1).max(50).default(10),
  })
  .strict();
export const enrichmentInput = z
  .object({ companyId: z.string().uuid() })
  .strict();
export const enquiryInput = z
  .object({
    businessName: short,
    contactName: short,
    email: z
      .string()
      .trim()
      .email()
      .max(254)
      .transform((v) => v.toLowerCase()),
    phone: z.string().trim().min(5).max(50).optional(),
    province: z.enum([
      "BC",
      "AB",
      "SK",
      "MB",
      "ON",
      "QC",
      "NB",
      "NS",
      "PE",
      "NL",
      "YT",
      "NT",
      "NU",
    ]),
    purpose: z
      .enum([
        "working_capital",
        "equipment",
        "property_purchase",
        "refinance",
        "construction",
        "acquisition",
      ])
      .optional(),
    amountCad: z.number().positive().max(100000000).multipleOf(0.01).optional(),
    timeline: z
      .enum(["within_30_days", "within_90_days", "later", "exploring"])
      .optional(),
    consentToContact: z.literal(true),
    consentToRefer: z.boolean().default(false),
    attribution: z
      .object({
        source: z.string().max(100).optional(),
        medium: z.string().max(100).optional(),
        campaign: z.string().max(200).optional(),
        landingPage: httpsUrl.optional(),
      })
      .strict()
      .default({}),
  })
  .strict();
export type EnquiryInput = z.infer<typeof enquiryInput>;
export const publicEnquiryInput = enquiryInput
  .extend({ turnstileToken: z.string().min(1).max(2048) })
  .strict();
export const qualificationInput = z
  .object({
    decision: z.enum(["needs_information", "ready_for_review", "closed"]),
    note: z.string().trim().min(10).max(2000),
  })
  .strict();
export const opportunityInput = z
  .object({
    companyId: z.string().uuid(),
    ownerInterestConfirmed: z.literal(true),
    conversationNote: z.string().trim().min(10).max(2000),
    reviewedSources: z.array(httpsUrl).min(1).max(10),
  })
  .strict();
export const companyOutput = z
  .object({
    sourceKey: z.string().trim().min(1).max(500),
    businessName: short,
    industry: short,
    location: short,
    website: httpsUrl.optional(),
    businessPhone: z.string().trim().min(5).max(50).optional(),
    businessEmail: z.string().trim().email().max(254).optional(),
    summary: z.string().trim().max(3000).optional(),
    provenance: z
      .object({
        url: httpsUrl,
        publisher: short,
        observedAt: z.string().datetime({ offset: true }),
        license: z.string().trim().min(1).max(500),
        confidence: z.enum(["low", "medium", "high"]),
      })
      .strict(),
  })
  .strict();
export type CompanyOutput = z.infer<typeof companyOutput>;
export const completionInput = z.discriminatedUnion("status", [
  z
    .object({
      runId: z.string().uuid(),
      status: z.literal("succeeded"),
      companies: z
        .array(companyOutput)
        .max(50)
        .refine(
          (rows) =>
            new Set(rows.map((row) => row.sourceKey)).size === rows.length,
          "Each company sourceKey must be unique.",
        ),
    })
    .strict(),
  z
    .object({
      runId: z.string().uuid(),
      status: z.literal("failed"),
      errorCode: z.enum([
        "CLI_TIMEOUT",
        "CLI_FAILED",
        "INVALID_OUTPUT",
        "WORKER_CONFIGURATION",
      ]),
    })
    .strict(),
]);
export type CompletionInput = z.infer<typeof completionInput>;
export function parse<S extends z.ZodTypeAny>(
  schema: S,
  value: unknown,
): z.output<S> {
  const result = schema.safeParse(value);
  if (!result.success)
    throw new ApiError(
      400,
      "INVALID_INPUT",
      result.error.issues
        .map((i) => `${i.path.join(".") || "body"}: ${i.message}`)
        .join("; ")
        .slice(0, 600),
    );
  return result.data;
}
export function hash(value: unknown) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
export function idempotency(request: Request) {
  const key = request.headers.get("idempotency-key");
  if (!key || !/^[A-Za-z0-9_-]{16,128}$/.test(key))
    throw new ApiError(
      400,
      "IDEMPOTENCY_REQUIRED",
      "Provide a unique Idempotency-Key with 16–128 letters, numbers, hyphens or underscores.",
    );
  return hash(key);
}
export function paging(url: URL) {
  const n = (key: string, def: number, max: number) => {
    const value = Number(url.searchParams.get(key) ?? def);
    if (!Number.isInteger(value) || value < 0 || value > max)
      throw new ApiError(400, "INVALID_INPUT", `Invalid ${key}`);
    return value;
  };
  const limit = n("limit", 25, 100);
  if (!limit)
    throw new ApiError(400, "INVALID_INPUT", "limit must be positive");
  return { limit, offset: n("offset", 0, 100000) };
}
export function uuid(value: string) {
  return parse(z.string().uuid(), value);
}
export function requireScope(actor: Actor, scope: Scope) {
  if (!actor.scopes.includes(scope))
    throw new ApiError(
      403,
      "SCOPE_DENIED",
      "This credential does not permit that action.",
    );
}
export async function readJson(request: Request, max = 65536) {
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
    throw new ApiError(415, "JSON_REQUIRED", "Send application/json.");
  const reader = request.body?.getReader();
  if (!reader)
    throw new ApiError(400, "INVALID_INPUT", "Request body is required.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > max) {
      await reader.cancel();
      throw new ApiError(413, "BODY_TOO_LARGE", "Request body is too large.");
    }
    chunks.push(value);
  }
  const buffer = Buffer.concat(chunks);
  try {
    return JSON.parse(buffer.toString("utf8")) as unknown;
  } catch {
    throw new ApiError(400, "INVALID_JSON", "Invalid JSON.");
  }
}

export const enquiryDetailsInput = enquiryInput
  .pick({ purpose: true, amountCad: true, timeline: true })
  .strict()
  .refine(
    (v) => Object.keys(v).length > 0,
    "Supply at least one qualification detail.",
  );
