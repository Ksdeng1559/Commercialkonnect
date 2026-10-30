import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
export class WorkspaceError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export async function workspace(request: NextRequest) {
  if (
    !process.env.CLERK_SECRET_KEY ||
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  )
    throw new WorkspaceError("Workspace sign-in is not configured.", 503);
  const { userId, orgId } = await auth();
  if (!userId || !orgId)
    throw new WorkspaceError(
      "Sign in and select your workspace organization.",
      401,
    );
  if (request.method === "POST") {
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(request.url).origin)
      throw new WorkspaceError("Cross-origin requests are not supported.", 403);
  }
  return { userId, orgId };
}
// Per-process burst control, not a distributed billing quota. Configure hard budgets in OmniRoute.
const bursts = new Map<string, { count: number; until: number }>();
export function limit(key: string) {
  const now = Date.now();
  for (const [k, v] of bursts) if (v.until < now) bursts.delete(k);
  const item = bursts.get(key) ?? { count: 0, until: now + 60000 };
  if (item.count >= 6)
    throw new WorkspaceError(
      "Six provider actions per minute per workspace. Try again shortly.",
      429,
    );
  item.count++;
  bursts.set(key, item);
}
export function serverUrl(value: string | undefined) {
  if (!value)
    throw new WorkspaceError("Provider endpoint is not configured.", 503);
  let u: URL;
  try {
    u = new URL(value);
  } catch {
    throw new WorkspaceError(
      "Provider endpoint configuration is invalid.",
      503,
    );
  }
  if (u.protocol !== "https:" || u.username || u.password || u.hash)
    throw new WorkspaceError(
      "Configure an HTTPS provider endpoint without embedded credentials.",
      503,
    );
  return u;
}
export async function providerJson(url: URL | string, init: RequestInit = {}) {
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(45000),
  });
  if (!response.ok)
    throw new WorkspaceError(
      `Provider request failed (${response.status}). Check the server configuration and quota.`,
      502,
    );
  const reader = response.body?.getReader();
  if (!reader)
    throw new WorkspaceError("Provider returned an empty response.", 502);
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 2_000_000) {
      await reader.cancel();
      throw new WorkspaceError("Provider response exceeded 2 MB.", 502);
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  try {
    return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  } catch {
    throw new WorkspaceError("Provider returned invalid JSON.", 502);
  }
}
