import { Pool } from "pg";
import { ApiError, type Actor } from "./model";
import type { InWorkspace, Sql } from "./repository";
const pools = new Map<string, Pool>();
function poolFor(intake: boolean) {
  const key = intake ? "CK_API_INTAKE_DATABASE_URL" : "CK_API_DATABASE_URL";
  const value = process.env[key];
  if (!value)
    throw new ApiError(
      503,
      "STORAGE_NOT_CONFIGURED",
      "Persistent API storage is not configured.",
    );
  const cached = pools.get(key);
  if (cached) return cached;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new ApiError(
      503,
      "STORAGE_NOT_CONFIGURED",
      "Database configuration is invalid.",
    );
  }
  if (!["postgres:", "postgresql:"].includes(url.protocol))
    throw new ApiError(
      503,
      "STORAGE_NOT_CONFIGURED",
      "Use a PostgreSQL connection.",
    );
  for (const option of ["sslmode", "sslcert", "sslkey", "sslrootcert"])
    url.searchParams.delete(option);
  const local =
    process.env.NODE_ENV !== "production" &&
    ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  const pool = new Pool({
    connectionString: url.href,
    max: 3,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 10000,
    ssl: local
      ? false
      : {
          rejectUnauthorized: true,
          ...(process.env.CK_DATABASE_CA_CERT
            ? { ca: process.env.CK_DATABASE_CA_CERT }
            : {}),
        },
  });
  pool.on("error", () => {});
  pools.set(key, pool);
  return pool;
}
export const inWorkspace: InWorkspace = async <T>(
  actor: Actor,
  fn: (sql: Sql, workspaceId: string) => Promise<T>,
): Promise<T> => {
  const pool = poolFor(actor.kind === "intake");
  const client = await pool.connect();
  try {
    // Reject owner/admin connections before making tenant queries.
    const target = actor.kind === "intake" ? "ck_api_intake" : "ck_api_runtime";
    const roles = (
      await client.query(
        "select rolsuper,rolbypassrls,rolcreatedb,rolcreaterole,rolinherit from pg_roles where rolname=session_user or rolname=$1",
        [target],
      )
    ).rows;
    if (
      roles.length !== 2 ||
      roles.some(
        (role) =>
          role.rolsuper ||
          role.rolbypassrls ||
          role.rolcreatedb ||
          role.rolcreaterole ||
          role.rolinherit,
      )
    )
      throw new ApiError(
        503,
        "UNSAFE_DATABASE_ROLE",
        "Configure a dedicated NOINHERIT, NOBYPASSRLS API login.",
      );
    await client.query("begin");
    await client.query(
      actor.kind === "intake"
        ? "set local role ck_api_intake"
        : "set local role ck_api_runtime",
    );
    await client.query(
      "select set_config('ck_api.clerk_org_id',$1,true),set_config('statement_timeout','5000',true)",
      [actor.orgId],
    );
    const result = await client.query(
      "select ck_api.current_workspace_id() as id",
    );
    const workspaceId = result.rows[0]?.id;
    if (!workspaceId)
      throw new ApiError(
        403,
        "WORKSPACE_UNMAPPED",
        "This organization has no active API workspace mapping.",
      );
    const output = await fn(client, workspaceId);
    await client.query("commit");
    return output;
  } catch (error) {
    await client.query("rollback").catch(() => {});
    throw error;
  } finally {
    client.release();
  }
};
