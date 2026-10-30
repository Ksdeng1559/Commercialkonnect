import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";
import {
  Repository,
  type InWorkspace,
  type Sql,
} from "../src/lib/api-v1/repository";
import { createHandler } from "../src/lib/api-v1/handler";
import { ApiError, scopes, type Actor } from "../src/lib/api-v1/model";
import { machineActor } from "../src/lib/api-v1/tokens";
const aId = "11111111-1111-4111-8111-111111111111",
  bId = "22222222-2222-4222-8222-222222222222";
const actor = (orgId: string): Actor => ({
  id: "test-operator",
  orgId,
  kind: "session",
  scopes: scopes.filter((s) => s !== "jobs:work"),
});
const worker = (orgId: string): Actor => ({
  id: "ck_worker",
  orgId,
  kind: "machine",
  scopes: ["jobs:work"],
});
const candidate = {
  sourceKey: "source-1",
  businessName: "Synthetic Fabricator",
  industry: "manufacturing",
  location: "Burnaby, BC",
  website: "https://example.com",
  provenance: {
    url: "https://example.com/about",
    publisher: "Synthetic fixture",
    observedAt: "2026-10-29T12:00:00Z",
    license: "Synthetic test data",
    confidence: "low",
  },
};
const enquiry = {
  businessName: "Synthetic Business",
  contactName: "Test Contact",
  email: "test@example.com",
  province: "BC",
  consentToContact: true,
  consentToRefer: false,
};
const fullEnquiry = {
  ...enquiry,
  purpose: "equipment",
  amountCad: 50000,
  timeline: "within_90_days",
};
function req(
  path: string,
  body?: unknown,
  key = "test-idempotency-0001",
  method?: string,
) {
  return new Request("https://api.example/api/v1/" + path, {
    method: method ?? (body === undefined ? "GET" : "POST"),
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": key,
      Origin: "https://site.example",
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}
async function result(response: Response) {
  return { status: response.status, ...(await response.json()) };
}
async function setup(directory?: string) {
  const db = new PGlite(directory);
  await db.exec("create table public.workspaces(id uuid primary key);");
  await db.exec(await readFile("db/api-v1.sql", "utf8"));
  await db.query("insert into public.workspaces(id) values($1),($2)", [
    aId,
    bId,
  ]);
  await db.query(
    "insert into ck_api.workspace_links(workspace_id,clerk_org_id) values($1,$2),($3,$4)",
    [aId, "org_a", bId, "org_b"],
  );
  const tx: InWorkspace = async <T>(
    a: Actor,
    fn: (sql: Sql, w: string) => Promise<T>,
  ): Promise<T> =>
    db.transaction(async (sql) => {
      await sql.exec(
        a.kind === "intake"
          ? "set local role ck_api_intake"
          : "set local role ck_api_runtime",
      );
      await sql.query("select set_config('ck_api.clerk_org_id',$1,true)", [
        a.orgId,
      ]);
      const found = await sql.query<{ id: string | null }>(
        "select ck_api.current_workspace_id() as id",
      );
      if (!found.rows[0]?.id)
        throw new ApiError(403, "WORKSPACE_UNMAPPED", "Unmapped workspace");
      return fn(sql, found.rows[0].id);
    });
  const repository = new Repository(tx);
  const handler = (a: Actor) =>
    createHandler({
      repository,
      authenticate: async () => a,
      publicActor: () => ({
        ...actor("org_a"),
        kind: "intake",
        id: "public-test",
      }),
      verifyPublic: async () => {},
      privacyVersion: () => "test-v1",
      discoveryEnabled: () => true,
    });
  return { db, repository, handler };
}

test("discovery jobs persist, replay safely, stay isolated, and return only unverified business prospects", async () => {
  const { db, handler } = await setup();
  try {
    const api = handler(actor("org_a"));
    const response = await result(
      await api(
        req("discovery-jobs", {
          industry: "manufacturing",
          location: "BC",
          limit: 2,
        }),
      ),
    );
    assert.equal(response.status, 202);
    const id = response.data.id;
    assert.equal(
      (
        await result(
          await api(
            req("discovery-jobs", {
              industry: "manufacturing",
              location: "BC",
              limit: 2,
            }),
          ),
        )
      ).data.id,
      id,
    );
    assert.equal(
      (
        await result(
          await api(
            req("discovery-jobs", { industry: "different", location: "BC" }),
          ),
        )
      ).status,
      409,
    );
    assert.equal(
      (await result(await handler(actor("org_b"))(req("jobs/" + id)))).status,
      404,
    );
    const w = handler(worker("org_a"));
    const claim = await result(await w(req("worker/jobs/claim", {})));
    assert.equal(claim.data.id, id);
    assert.equal(
      (
        await result(
          await handler(worker("org_b"))(
            req(`worker/jobs/${id}/complete`, {
              runId: claim.data.run_id,
              status: "succeeded",
              companies: [candidate],
            }),
          ),
        )
      ).status,
      409,
    );
    assert.equal(
      (
        await result(
          await w(
            req(`worker/jobs/${id}/complete`, {
              runId: claim.data.run_id,
              status: "succeeded",
              companies: [candidate],
            }),
          ),
        )
      ).status,
      200,
    );
    const companies = await result(await api(req("companies")));
    assert.equal(companies.data.length, 1);
    assert.equal(companies.data[0].financing_need_status, "unknown");
    assert.equal(companies.data[0].verification_status, "unverified");
    assert.equal(
      (await result(await handler(actor("org_b"))(req("companies")))).data
        .length,
      0,
    );
    assert.equal(
      (await result(await api(req("opportunities")))).data.length,
      0,
    );
    assert.equal(
      (await result(await api(req("worker/jobs/claim", {})))).status,
      403,
    );
  } finally {
    await db.close();
  }
});

test("enquiries require consent, do not leak tenant data, and need details plus human qualification", async () => {
  const { db, handler } = await setup();
  try {
    const api = handler(actor("org_a"));
    assert.equal(
      (
        await result(
          await api(
            req("funding-enquiries", { ...enquiry, consentToContact: false }),
          ),
        )
      ).status,
      400,
    );
    assert.equal(
      (
        await result(
          await api(req("funding-enquiries", { ...enquiry, workspaceId: bId })),
        )
      ).status,
      400,
    );
    const received = await result(await api(req("funding-enquiries", enquiry)));
    assert.equal(received.status, 201);
    assert.equal(received.data.email, undefined);
    const id = received.data.id;
    const replay = await result(await api(req("funding-enquiries", enquiry)));
    assert.equal(replay.status, 200);
    assert.equal(replay.data.id, id);
    assert.equal(
      (
        await result(
          await handler(actor("org_b"))(req("funding-enquiries/" + id)),
        )
      ).status,
      404,
    );
    assert.equal(
      (
        await result(
          await api(
            req(`funding-enquiries/${id}/qualification`, {
              decision: "ready_for_review",
              note: "Reviewed owner request.",
            }),
          ),
        )
      ).status,
      409,
    );
    assert.equal(
      (await result(await api(req("opportunities")))).data.length,
      0,
    );
    const full = await result(
      await api(req("funding-enquiries", fullEnquiry, "test-idempotency-full")),
    );
    const review = await result(
      await api(
        req(`funding-enquiries/${full.data.id}/qualification`, {
          decision: "ready_for_review",
          note: "Reviewed owner request.",
        }),
      ),
    );
    assert.equal(review.status, 200);
    assert.equal(review.data.financingApproval, false);
    assert.equal(
      (await result(await api(req("opportunities")))).data.length,
      1,
    );
    await api(
      req(`funding-enquiries/${full.data.id}/qualification`, {
        decision: "closed",
        note: "Owner asked to close request.",
      }),
    );
    assert.equal(
      (await result(await api(req("opportunities")))).data[0].status,
      "closed",
    );
    assert.equal(
      (await result(await handler(actor("org_unmapped"))(req("companies"))))
        .status,
      403,
    );
  } finally {
    await db.close();
  }
});

test("public intake validates first submission and retries return only a receipt without repeating verification", async () => {
  const { db, repository } = await setup();
  let verified = 0;
  try {
    const api = createHandler({
      repository,
      authenticate: async () => {
        throw Error("not public");
      },
      publicActor: () => ({ ...actor("org_a"), kind: "intake", id: "public" }),
      verifyPublic: async () => {
        verified++;
      },
      privacyVersion: () => "test-v1",
      discoveryEnabled: () => false,
    });
    const response = await result(
      await api(
        req("public/funding-enquiries", {
          ...enquiry,
          turnstileToken: "one-use-token",
        }),
      ),
    );
    assert.equal(response.status, 201);
    const replay = await result(
      await api(
        req("public/funding-enquiries", {
          ...enquiry,
          turnstileToken: "new-token",
        }),
      ),
    );
    assert.equal(replay.status, 200);
    assert.equal(replay.data.id, response.data.id);
    assert.equal(verified, 1);
    assert.deepEqual(Object.keys(response.data).sort(), [
      "createdAt",
      "id",
      "replayed",
    ]);
    const failed = createHandler({
      repository,
      authenticate: async () => actor("org_a"),
      publicActor: () => ({ ...actor("org_a"), kind: "intake", id: "public" }),
      verifyPublic: async () => {
        throw new ApiError(400, "VERIFICATION_FAILED", "verification failed");
      },
      privacyVersion: () => "test-v1",
      discoveryEnabled: () => false,
    });
    assert.equal(
      (
        await result(
          await failed(
            req(
              "public/funding-enquiries",
              { ...enquiry, turnstileToken: "bad" },
              "test-idempotency-bad0",
            ),
          ),
        )
      ).status,
      400,
    );
    assert.equal(
      ((await repository.enquiries(actor("org_a"), 25, 0)) as unknown[]).length,
      1,
    );
  } finally {
    await db.close();
  }
});

test("PostgreSQL RLS denies direct cross-workspace reads, inserts, reassignment, and public PII reads", async () => {
  const { db, repository } = await setup();
  try {
    const received = await repository.submitEnquiry(
      actor("org_a"),
      { ...enquiry, attribution: {} } as never,
      "hash1",
      "v1",
    );
    await db.transaction(async (sql) => {
      await sql.exec("set local role ck_api_runtime");
      await sql.query("select set_config('ck_api.clerk_org_id','org_b',true)");
      assert.equal(
        (await sql.query("select * from ck_api.funding_enquiries")).rows.length,
        0,
      );
    });
    await assert.rejects(
      db.transaction(async (sql) => {
        await sql.exec("set local role ck_api_runtime");
        await sql.query(
          "select set_config('ck_api.clerk_org_id','org_a',true)",
        );
        await sql.query(
          "update ck_api.funding_enquiries set workspace_id=$1 where id=$2",
          [bId, received.id],
        );
      }),
    );
    await assert.rejects(
      db.transaction(async (sql) => {
        await sql.exec("set local role ck_api_runtime");
        await sql.query(
          "select set_config('ck_api.clerk_org_id','org_a',true)",
        );
        await sql.query(
          "insert into ck_api.jobs(workspace_id,kind,input,idempotency_key,payload_hash,created_by)values($1,'discovery','{}','bad','hash','test')",
          [bId],
        );
      }),
    );
    await assert.rejects(
      db.transaction(async (sql) => {
        await sql.exec("set local role ck_api_intake");
        await sql.query(
          "select set_config('ck_api.clerk_org_id','org_a',true)",
        );
        await sql.query("select email from ck_api.funding_enquiries");
      }),
    );
    await assert.rejects(
      db.transaction(async (sql) => {
        await sql.exec("set local role ck_api_runtime");
        await sql.query(
          "select set_config('ck_api.clerk_org_id','org_a',true)",
        );
        await sql.query(
          "update ck_api.funding_enquiries set status='ready_for_review',reviewed_by='test' where id=$1",
          [received.id],
        );
      }),
    );
  } finally {
    await db.close();
  }
});

test("worker leases reject stale completion, bound retries, and avoid replayed result writes", async () => {
  const { db, repository } = await setup();
  try {
    const a = actor("org_a"),
      w = worker("org_a");
    const job = await repository.enqueue(
      a,
      "discovery",
      { industry: "trades", location: "BC", limit: 1 },
      "jobkey",
    );
    const claim = await repository.claim(w);
    assert.ok(claim);
    await db.query(
      "update ck_api.jobs set lease_until=now()-interval '1 second' where id=$1",
      [job.id],
    );
    const next = await repository.claim(w);
    assert.ok(next);
    assert.notEqual(next.run_id, claim.run_id);
    await assert.rejects(
      repository.complete(w, String(job.id), {
        runId: String(claim.run_id),
        status: "succeeded",
        companies: [candidate],
      } as never),
    );
    assert.equal(
      (
        await repository.complete(w, String(job.id), {
          runId: String(next.run_id),
          status: "failed",
          errorCode: "CLI_FAILED",
        })
      ).status,
      "queued",
    );
    const third = await repository.claim(w);
    assert.ok(third);
    assert.equal(
      (
        await repository.complete(w, String(job.id), {
          runId: String(third.run_id),
          status: "failed",
          errorCode: "CLI_FAILED",
        })
      ).status,
      "failed",
    );
    assert.equal(await repository.claim(w), null);
  } finally {
    await db.close();
  }
});

test("hashed machine tokens enforce scope, expiry, and organization binding", () => {
  const token = "ck_worker." + "a".repeat(43);
  const entry = {
    sha256: createHash("sha256").update(token).digest("hex"),
    clerkOrgId: "org_a",
    scopes: ["jobs:work"],
    expiresAt: "2099-01-01T00:00:00Z",
  };
  const raw = JSON.stringify({ ck_worker: entry });
  assert.equal(machineActor("Bearer " + token, raw).orgId, "org_a");
  assert.throws(() => machineActor("Bearer " + token + "x", raw));
  assert.throws(() =>
    machineActor(
      "Bearer " + token,
      JSON.stringify({
        ck_worker: { ...entry, expiresAt: "2000-01-01T00:00:00Z" },
      }),
    ),
  );
  assert.throws(() =>
    machineActor(
      "Bearer " + token,
      JSON.stringify({ ck_worker: { ...entry, scopes: ["admin"] } }),
    ),
  );
});

test("missing qualification details can be supplied and still require a new human review", async () => {
  const { db, handler } = await setup();
  try {
    const api = handler(actor("org_a"));
    const saved = await result(await api(req("funding-enquiries", enquiry)));
    const updated = await result(
      await api(
        req(
          `funding-enquiries/${saved.data.id}`,
          { purpose: "equipment", amountCad: 20000, timeline: "exploring" },
          "unused-patch-key01",
          "PATCH",
        ),
      ),
    );
    assert.equal(updated.status, 200);
    assert.equal(updated.data.reviewRequired, true);
    assert.equal(
      (await result(await api(req("opportunities")))).data.length,
      0,
    );
    assert.equal(
      (
        await result(
          await api(
            req(`funding-enquiries/${saved.data.id}/qualification`, {
              decision: "ready_for_review",
              note: "Operator reviewed updated details.",
            }),
          ),
        )
      ).status,
      200,
    );
    assert.equal(
      (
        await result(
          await handler(actor("org_b"))(
            req(
              `funding-enquiries/${saved.data.id}`,
              { amountCad: 100 },
              "unused-patch-key02",
              "PATCH",
            ),
          ),
        )
      ).status,
      404,
    );
  } finally {
    await db.close();
  }
});

test("enrichment binds results to the selected saved company and promotion requires explicit owner interest", async () => {
  const { db, handler } = await setup();
  try {
    const api = handler(actor("org_a")),
      w = handler(worker("org_a"));
    const first = await result(
      await api(
        req("discovery-jobs", {
          industry: "manufacturing",
          location: "BC",
          limit: 1,
        }),
      ),
    );
    const claim = await result(await w(req("worker/jobs/claim", {})));
    await w(
      req(`worker/jobs/${first.data.id}/complete`, {
        runId: claim.data.run_id,
        status: "succeeded",
        companies: [candidate],
      }),
    );
    const company = (await result(await api(req("companies")))).data[0];
    const job = await result(
      await api(
        req(
          "enrichment-jobs",
          { companyId: company.id },
          "enrichment-key-0001",
        ),
      ),
    );
    assert.equal(job.status, 202);
    const enrichClaim = await result(await w(req("worker/jobs/claim", {})));
    const wrong = await result(
      await w(
        req(`worker/jobs/${job.data.id}/complete`, {
          runId: enrichClaim.data.run_id,
          status: "succeeded",
          companies: [{ ...candidate, sourceKey: "wrong-company" }],
        }),
      ),
    );
    assert.equal(wrong.status, 400);
    assert.equal(
      (
        await result(
          await w(
            req(`worker/jobs/${job.data.id}/complete`, {
              runId: enrichClaim.data.run_id,
              status: "succeeded",
              companies: [candidate],
            }),
          ),
        )
      ).status,
      200,
    );
    assert.equal((await result(await api(req("companies")))).data.length, 1);
    assert.equal(
      (
        await result(
          await api(
            req("opportunities", {
              companyId: company.id,
              ownerInterestConfirmed: false,
              conversationNote: "No owner conversation yet.",
              reviewedSources: ["https://example.com"],
            }),
          ),
        )
      ).status,
      400,
    );
    const promoted = await result(
      await api(
        req("opportunities", {
          companyId: company.id,
          ownerInterestConfirmed: true,
          conversationNote: "Owner requested an equipment discussion.",
          reviewedSources: ["https://example.com"],
        }),
      ),
    );
    assert.equal(promoted.status, 201);
    const visible = (await result(await api(req("opportunities")))).data;
    assert.equal(visible.length, 1);
    assert.equal(visible[0].status, "needs_broker_review");
    assert.equal(
      (await result(await api(req("companies")))).data[0].financing_need_status,
      "owner_confirmed",
    );
  } finally {
    await db.close();
  }
});

test("SQL records survive closing and reopening the local PostgreSQL engine", async () => {
  const { mkdtemp, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const directory = await mkdtemp(join(tmpdir(), "ck-api-persistence-"));
  let db: PGlite | undefined;
  try {
    const fixture = await setup(directory);
    db = fixture.db;
    const receipt = await fixture.repository.submitEnquiry(
      actor("org_a"),
      { ...enquiry, attribution: {} } as never,
      "restart-key",
      "v1",
    );
    await db.close();
    db = new PGlite(directory);
    const saved = await db.query("select id from ck_api.funding_enquiries");
    assert.equal(saved.rows.length, 1);
    assert.equal((saved.rows[0] as { id: string }).id, receipt.id);
  } finally {
    await db?.close();
    await rm(directory, { recursive: true, force: true });
  }
});
