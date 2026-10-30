import { createHandler } from "@/lib/api-v1/handler";
import { Repository } from "@/lib/api-v1/repository";
import { inWorkspace } from "@/lib/api-v1/database";
import { authenticate } from "@/lib/api-v1/auth";
import { publicActor, verifyTurnstile } from "@/lib/api-v1/intake";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const handler = createHandler({
  repository: new Repository(inWorkspace),
  authenticate,
  publicActor,
  verifyPublic: verifyTurnstile,
  privacyVersion: () => process.env.CK_PRIVACY_NOTICE_VERSION,
  discoveryEnabled: () => process.env.CK_CLI_WORKER_ENABLED === "true",
});
export const GET = handler;
export const POST = handler;
export const OPTIONS = handler;
export const PATCH = handler;
