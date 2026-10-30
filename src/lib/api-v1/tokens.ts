import { createHash, timingSafeEqual } from "node:crypto";
import { ApiError, scopes, type Actor, type Scope } from "./model";
export function machineActor(
  header: string,
  raw: string | undefined,
  now = Date.now(),
): Actor {
  const match = /^Bearer (ck_[A-Za-z0-9_-]{1,50})\.([A-Za-z0-9_-]{43,})$/.exec(
    header,
  );
  if (!match)
    throw new ApiError(401, "UNAUTHENTICATED", "Invalid API credential.");
  let config: Record<string, unknown>;
  try {
    config = JSON.parse(raw || "{}");
    if (!config || typeof config !== "object" || Array.isArray(config))
      throw Error();
  } catch {
    throw new ApiError(
      503,
      "AUTH_NOT_CONFIGURED",
      "Machine authentication is not configured correctly.",
    );
  }
  const item = config[match[1]] as Record<string, unknown> | undefined;
  const valid =
    item &&
    typeof item.sha256 === "string" &&
    /^[a-f0-9]{64}$/.test(item.sha256) &&
    typeof item.clerkOrgId === "string" &&
    /^org_[A-Za-z0-9_-]+$/.test(item.clerkOrgId) &&
    typeof item.expiresAt === "string" &&
    Number.isFinite(Date.parse(item.expiresAt)) &&
    Date.parse(item.expiresAt) > now &&
    Array.isArray(item.scopes) &&
    item.scopes.length > 0 &&
    item.scopes.every((s) => scopes.includes(s as Scope));
  const digest = createHash("sha256").update(header.slice(7)).digest();
  if (
    !valid ||
    !timingSafeEqual(digest, Buffer.from(item.sha256 as string, "hex"))
  )
    throw new ApiError(
      401,
      "UNAUTHENTICATED",
      "Invalid or expired API credential.",
    );
  return {
    kind: "machine",
    id: match[1],
    orgId: item.clerkOrgId as string,
    scopes: item.scopes as Scope[],
  };
}
