import { ApiError, type Actor } from "./model";
export function intakeOrigins() {
  let values: unknown;
  try {
    values = JSON.parse(process.env.CK_INTAKE_ORIGINS_JSON || "[]");
  } catch {
    throw new ApiError(
      503,
      "INTAKE_NOT_CONFIGURED",
      "Intake origins are not configured.",
    );
  }
  if (
    !Array.isArray(values) ||
    !values.length ||
    !values.every(
      (v) =>
        typeof v === "string" &&
        new URL(v).origin === v &&
        new URL(v).protocol === "https:",
    )
  )
    throw new ApiError(
      503,
      "INTAKE_NOT_CONFIGURED",
      "Configure explicit HTTPS intake origins.",
    );
  return values as string[];
}
export function publicActor(request: Request): Actor {
  const origin = request.headers.get("origin");
  if (!origin || !intakeOrigins().includes(origin))
    throw new ApiError(
      403,
      "ORIGIN_DENIED",
      "This website is not permitted to submit enquiries.",
    );
  const orgId = process.env.CK_INTAKE_ORG_ID;
  if (!orgId || !/^org_[A-Za-z0-9_-]+$/.test(orgId))
    throw new ApiError(
      503,
      "INTAKE_NOT_CONFIGURED",
      "Public enquiry routing is not configured.",
    );
  return {
    orgId,
    id: "public-funding-form",
    kind: "intake",
    scopes: ["enquiries:write"],
  };
}
export async function verifyTurnstile(token: string, request: Request) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret)
    throw new ApiError(
      503,
      "INTAKE_NOT_CONFIGURED",
      "Enquiry verification is not configured.",
    );
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token }),
      signal: AbortSignal.timeout(10000),
      redirect: "error",
    },
  );
  if (!response.ok)
    throw new ApiError(
      503,
      "VERIFICATION_UNAVAILABLE",
      "Enquiry verification is unavailable.",
    );
  const data = await response.json();
  const hostname = new URL(request.headers.get("origin")!).hostname;
  if (
    data.success !== true ||
    data.hostname !== hostname ||
    data.action !== "funding_enquiry"
  )
    throw new ApiError(
      400,
      "VERIFICATION_FAILED",
      "Complete the enquiry verification again.",
    );
}
