import {
  ApiError,
  completionInput,
  companyFiltersInput,
  discoveryInput,
  enquiryDetailsInput,
  enquiryInput,
  enrichmentInput,
  hash,
  idempotency,
  opportunityInput,
  paging,
  parse,
  publicEnquiryInput,
  qualificationInput,
  readJson,
  requireScope,
  uuid,
  type Actor,
  type Scope,
} from "./model";
import type { Repository } from "./repository";
export interface Dependencies {
  repository: Repository;
  authenticate: (request: Request) => Promise<Actor>;
  publicActor: (request: Request) => Actor;
  verifyPublic: (token: string, request: Request) => Promise<void>;
  privacyVersion: () => string | undefined;
  discoveryEnabled: () => boolean;
}
export function createHandler(deps: Dependencies) {
  return async (request: Request): Promise<Response> => {
    const requestId = crypto.randomUUID();
    let cors: Record<string, string> = {};
    const respond = (data: unknown, status = 200) =>
      Response.json(data, {
        status,
        headers: {
          "Cache-Control": "no-store",
          "X-Request-Id": requestId,
          ...cors,
        },
      });
    try {
      const url = new URL(request.url);
      const path = url.pathname.replace(/\/$/, "");
      const method = request.method;
      const publicPath = path === "/api/v1/public/funding-enquiries";
      if (publicPath) {
        deps.publicActor(request);
        cors = {
          "Access-Control-Allow-Origin": request.headers.get("origin")!,
          Vary: "Origin",
        };
        if (method === "OPTIONS")
          return new Response(null, {
            status: 204,
            headers: {
              ...cors,
              "Access-Control-Allow-Methods": "POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Idempotency-Key",
              "Cache-Control": "no-store",
            },
          });
      }
      const a = publicPath
        ? deps.publicActor(request)
        : await deps.authenticate(request);
      const permit = (scope: Scope) => requireScope(a, scope);
      if (
        (path === "/api/v1/funding-enquiries" || publicPath) &&
        method === "POST"
      ) {
        permit("enquiries:write");
        const key = idempotency(request);
        const body = await readJson(request);
        const publicParsed = publicPath
          ? parse(publicEnquiryInput, body)
          : undefined;
        const parsed = publicParsed ?? parse(enquiryInput, body);
        const input = parse(
          enquiryInput,
          Object.fromEntries(
            Object.entries(parsed).filter(([key]) => key !== "turnstileToken"),
          ),
        );
        const privacy = deps.privacyVersion();
        if (!privacy)
          throw new ApiError(
            503,
            "INTAKE_NOT_CONFIGURED",
            "A privacy notice version must be configured.",
          );
        const prior = await deps.repository.enquiryReceipt(a, key, hash(input));
        if (prior) return respond({ data: prior }, 200);
        if (publicParsed)
          await deps.verifyPublic(publicParsed.turnstileToken, request);
        const result = await deps.repository.submitEnquiry(
          a,
          input,
          key,
          privacy,
        );
        return respond({ data: result }, result.replayed ? 200 : 201);
      }
      if (path === "/api/v1/funding-enquiries" && method === "GET") {
        permit("enquiries:read");
        const p = paging(url);
        return respond({
          data: await deps.repository.enquiries(a, p.limit, p.offset),
          pagination: p,
        });
      }
      let match = /^\/api\/v1\/funding-enquiries\/([^/]+)$/.exec(path);
      if (match && method === "GET") {
        permit("enquiries:read");
        return respond({
          data: await deps.repository.enquiries(a, 1, 0, uuid(match[1])),
        });
      }
      if (match && method === "PATCH") {
        permit("enquiries:write");
        const input = parse(enquiryDetailsInput, await readJson(request));
        return respond({
          data: await deps.repository.updateDetails(a, uuid(match[1]), input),
        });
      }
      match = /^\/api\/v1\/funding-enquiries\/([^/]+)\/qualification$/.exec(
        path,
      );
      if (match && method === "POST") {
        permit("enquiries:qualify");
        const input = parse(qualificationInput, await readJson(request));
        return respond({
          data: await deps.repository.qualify(
            a,
            uuid(match[1]),
            input.decision,
            input.note,
          ),
        });
      }
      if (path === "/api/v1/companies" && method === "GET") {
        permit("companies:read");
        const p = paging(url);
        const filters = parse(companyFiltersInput, Object.fromEntries(
          Object.entries(companyFiltersInput.shape).flatMap(([key]) =>
            url.searchParams.has(key) ? [[key, url.searchParams.get(key)]] : [],
          ),
        ));
        return respond({
          data: await deps.repository.companies(a, p.limit, p.offset, filters),
          pagination: p,
        });
      }
      if (
        (path === "/api/v1/discovery-jobs" ||
          path === "/api/v1/enrichment-jobs") &&
        method === "POST"
      ) {
        const discovery = path.endsWith("/discovery-jobs");
        permit(discovery ? "discovery:write" : "enrichment:write");
        if (!deps.discoveryEnabled())
          throw new ApiError(
            503,
            "WORKER_NOT_ENABLED",
            "Configure and enable the Windows CLI worker before submitting jobs.",
          );
        const key = idempotency(request);
        const body = await readJson(request);
        const input = discovery
          ? parse(discoveryInput, body)
          : parse(enrichmentInput, body);
        const result = await deps.repository.enqueue(
          a,
          discovery ? "discovery" : "enrichment",
          input,
          key,
        );
        return respond({ data: result }, result.replayed ? 200 : 202);
      }
      match = /^\/api\/v1\/jobs\/([^/]+)$/.exec(path);
      if (match && method === "GET") {
        permit("jobs:read");
        return respond({ data: await deps.repository.job(a, uuid(match[1])) });
      }
      if (path === "/api/v1/worker/jobs/claim" && method === "POST") {
        permit("jobs:work");
        if (a.kind !== "machine")
          throw new ApiError(
            403,
            "MACHINE_TOKEN_REQUIRED",
            "Worker actions require a scoped machine token.",
          );
        return respond({ data: await deps.repository.claim(a) });
      }
      match = /^\/api\/v1\/worker\/jobs\/([^/]+)\/complete$/.exec(path);
      if (match && method === "POST") {
        permit("jobs:work");
        if (a.kind !== "machine")
          throw new ApiError(
            403,
            "MACHINE_TOKEN_REQUIRED",
            "Worker actions require a scoped machine token.",
          );
        const input = parse(completionInput, await readJson(request, 512000));
        return respond({
          data: await deps.repository.complete(a, uuid(match[1]), input),
        });
      }
      if (path === "/api/v1/opportunities" && method === "GET") {
        permit("opportunities:read");
        const p = paging(url);
        return respond({
          data: await deps.repository.opportunities(a, p.limit, p.offset),
          pagination: p,
        });
      }
      if (path === "/api/v1/opportunities" && method === "POST") {
        permit("opportunities:write");
        const key = idempotency(request);
        const input = parse(opportunityInput, await readJson(request));
        const result = await deps.repository.promote(a, input, key);
        return respond({ data: result }, result.replayed ? 200 : 201);
      }
      throw new ApiError(404, "NOT_FOUND", "API operation not found.");
    } catch (error) {
      if (error instanceof ApiError)
        return respond(
          { error: { code: error.code, message: error.message, requestId } },
          error.status,
        );
      const code = (error as { code?: string })?.code;
      if (code === "23505")
        return respond(
          {
            error: {
              code: "CONFLICT",
              message: "A conflicting record already exists.",
              requestId,
            },
          },
          409,
        );
      return respond(
        {
          error: {
            code: "SERVICE_UNAVAILABLE",
            message: "The service could not complete this request.",
            requestId,
          },
        },
        503,
      );
    }
  };
}
