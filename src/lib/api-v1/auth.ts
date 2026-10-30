import { auth } from "@clerk/nextjs/server";
import { ApiError, scopes, type Actor } from "./model";
import { machineActor } from "./tokens";
export async function authenticate(request: Request): Promise<Actor> {
  const authorization = request.headers.get("authorization");
  if (authorization)
    return machineActor(authorization, process.env.CK_API_TOKENS_JSON);
  if (
    !process.env.CLERK_SECRET_KEY ||
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  )
    throw new ApiError(
      503,
      "AUTH_NOT_CONFIGURED",
      "Workspace sign-in is not configured.",
    );
  const { userId, orgId } = await auth();
  if (!userId || !orgId)
    throw new ApiError(
      401,
      "UNAUTHENTICATED",
      "Sign in and select a workspace.",
    );
  if (
    !["GET", "HEAD", "OPTIONS"].includes(request.method) &&
    request.headers.get("origin") !== new URL(request.url).origin
  )
    throw new ApiError(
      403,
      "ORIGIN_DENIED",
      "Browser writes must come from the application origin.",
    );
  return {
    kind: "session",
    id: userId,
    orgId,
    scopes: scopes.filter((s) => s !== "jobs:work"),
  };
}
