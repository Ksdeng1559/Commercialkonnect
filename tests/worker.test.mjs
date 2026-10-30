import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { runCli } from "../scripts/worker/cli.mjs";
const config = {
  executable: process.execPath,
  args: [path.resolve("tests/fixtures/cli-wrapper.mjs")],
  env: {},
  timeoutMs: 2000,
};
test("worker passes JSON through stdin and does not invoke a shell", async () => {
  const result = await runCli(
    {
      id: "synthetic",
      kind: "discovery",
      input: { industry: "manufacturing; echo injection", location: "BC" },
    },
    config,
  );
  assert.equal(result.companies.length, 1);
});
test("worker contains invalid output, errors, timeout and relative executable paths", async () => {
  for (const [industry, code] of [
    ["invalid", "INVALID_OUTPUT"],
    ["fail", "CLI_FAILED"],
    ["timeout", "CLI_TIMEOUT"],
  ])
    await assert.rejects(
      runCli(
        { input: { industry } },
        { ...config, timeoutMs: industry === "timeout" ? 50 : 2000 },
      ),
      (e) => e.code === code && !e.message.includes("PRIVATE_TEST_VALUE"),
    );
  assert.throws(
    () => runCli({ input: {} }, { ...config, executable: "relative.cmd" }),
    (e) => e.code === "WORKER_CONFIGURATION",
  );
});
