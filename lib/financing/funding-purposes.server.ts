import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { FUNDING_USE_CASES } from "@/components/financing/FinancingUseCaseCard";

export type FundingPurposeCode = (typeof FUNDING_USE_CASES)[number]["code"];
export type EvidenceStatus = "inferred" | "self_reported" | "verified";

const validCodes = new Set<string>(FUNDING_USE_CASES.map((item) => item.code));

/**
 * Server-only adapter. Caller MUST authenticate and authorize the lead's workspace
 * before calling. Never expose the service-role key to browser code.
 * Database tables currently have RLS enabled with no client policies.
 */
export function createFundingPurposeAdminClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Server-side Supabase configuration missing");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function saveLeadFundingPurposes(
  db: SupabaseClient,
  leadId: string,
  codes: string[],
  evidenceStatus: EvidenceStatus,
  assertLeadAccess: (leadId: string) => Promise<void>,
) {
  if (!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(leadId)) throw new Error("Invalid lead ID");
  if (!codes.every((code) => validCodes.has(code))) throw new Error("Unknown financing purpose");
  if (!["inferred", "self_reported", "verified"].includes(evidenceStatus)) throw new Error("Invalid evidence status");
  await assertLeadAccess(leadId);
  // Read/replace is not atomic: wrap in a database transaction/RPC before production.
  const { error: deleteError } = await db.from("ck_lead_funding_purposes").delete().eq("lead_id", leadId);
  if (deleteError) throw deleteError;
  const rows = [...new Set(codes)].map((use_case_code) => ({
    lead_id: leadId, use_case_code, evidence_status: evidenceStatus,
  }));
  if (!rows.length) return;
  const { error } = await db.from("ck_lead_funding_purposes").insert(rows);
  if (error) throw error;
}
