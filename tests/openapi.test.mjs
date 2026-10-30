import { test } from "node:test";
import assert from "node:assert/strict";
import SwaggerParser from "@apidevtools/swagger-parser";
import { readFile } from "node:fs/promises";
test("OpenAPI document validates and describes both lead-entry paths plus worker permissions", async () => {
  const api = await SwaggerParser.validate(
    JSON.parse(await readFile("openapi.json", "utf8")),
  );
  assert.ok(api.paths["/api/v1/discovery-jobs"]);
  assert.ok(api.paths["/api/v1/public/funding-enquiries"]);
  assert.deepEqual(api.paths["/api/v1/worker/jobs/claim"].post.security, [
    { ApiToken: [] },
  ]);
  const ids = Object.values(api.paths).flatMap((path) =>
    Object.values(path)
      .filter((op) => op && typeof op === "object" && "operationId" in op)
      .map((op) => op.operationId),
  );
  assert.equal(new Set(ids).size, ids.length);
});
