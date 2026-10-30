import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
const token = "ck_smoke." + "s".repeat(43);
const tokenConfig = JSON.stringify({
  ck_smoke: {
    sha256: createHash("sha256").update(token).digest("hex"),
    clerkOrgId: "org_synthetic",
    scopes: ["companies:read", "discovery:write"],
    expiresAt: "2099-01-01T00:00:00Z",
  },
});
const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3107",
  ],
  {
    env: {
      ...process.env,
      CLERK_SECRET_KEY: "",
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "",
      CK_API_DATABASE_URL: "",
      CK_API_INTAKE_DATABASE_URL: "",
      CK_API_TOKENS_JSON: tokenConfig,
      CK_CLI_WORKER_ENABLED: "false",
      CK_INTAKE_ORIGINS_JSON: "[]",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
let logs = "";
child.stdout.on("data", (x) => {
  logs += x;
});
child.stderr.on("data", (x) => {
  logs += x;
});
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(Error("Test server did not start.")),
      15000,
    );
    child.stdout.on("data", () => {
      if (logs.includes("Ready in")) {
        clearTimeout(timer);
        resolve();
      }
    });
    child.on("exit", (code) => {
      clearTimeout(timer);
      reject(Error("Test server exited " + code));
    });
  });
  const base = "http://127.0.0.1:3107";
  let count = 0;
  const check = async (path, status, options) => {
    const r = await fetch(base + path, options);
    assert.equal(r.status, status, path);
    count++;
    return r;
  };
  await check("/", 200);
  await check("/mission-control", 200);
  const schema = await (await check("/api/v1/openapi.json", 200)).json();
  assert.ok(schema.paths["/api/v1/discovery-jobs"]);
  assert.ok(schema.paths["/api/v1/public/funding-enquiries"]);
  await check("/api/v1/companies", 503);
  await check("/api/v1/companies", 401, {
    headers: { Authorization: "Bearer invalid" },
  });
  await check("/api/v1/companies", 503, {
    headers: { Authorization: "Bearer " + token },
  });
  await check("/api/v1/funding-enquiries", 403, {
    headers: { Authorization: "Bearer " + token },
  });
  await check("/api/v1/discovery-jobs", 503, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      "Idempotency-Key": "smoke-idempotency-01",
    },
    body: JSON.stringify({ industry: "synthetic", location: "BC" }),
  });
  await check("/api/v1/public/funding-enquiries", 503, {
    method: "POST",
    headers: {
      Origin: "https://site.example",
      "Content-Type": "application/json",
    },
    body: "{}",
  });
  await check("/api/v1/public/funding-enquiries", 503, {
    method: "OPTIONS",
    headers: { Origin: "https://site.example" },
  });
  console.log(
    `${count} production HTTP smoke checks passed. Synthetic credentials only; no provider or database calls.`,
  );
} finally {
  child.kill("SIGTERM");
}
