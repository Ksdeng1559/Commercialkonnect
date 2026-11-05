import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client using the SERVICE ROLE key. This bypasses RLS and
// MUST never run in the browser. It is imported only by the SSR endpoint
// (src/pages/api/apply.ts). Reads secrets from the runtime environment.
//
// Returns null when env is not configured so local dev / builds don't crash;
// the endpoint degrades gracefully and logs instead.

const url = process.env.SUPABASE_URL ?? import.meta.env.SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export function getServiceClient(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: "ck" }, // so .from("leads") targets ck.leads
  });
}
