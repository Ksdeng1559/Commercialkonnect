import { runCli } from "./cli.mjs";
const base = new URL(
  process.env.CK_API_BASE_URL || "https://configure-api.invalid",
);
if (base.protocol !== "https:" || base.username || base.password)
  throw Error("Configure an HTTPS CK_API_BASE_URL without credentials.");
const token = process.env.CK_WORKER_TOKEN;
if (!token) throw Error("Configure CK_WORKER_TOKEN with jobs:work scope.");
let args;
try {
  args = JSON.parse(process.env.CK_CLI_ARGS_JSON || "[]");
} catch {
  throw Error("CK_CLI_ARGS_JSON must be an array.");
}
const env = Object.fromEntries(
  Object.entries(process.env).filter(([key]) =>
    [
      "PATH",
      "Path",
      "SYSTEMROOT",
      "SystemRoot",
      "WINDIR",
      "TEMP",
      "TMP",
      "HOME",
      "USERPROFILE",
      "APPDATA",
      "LOCALAPPDATA",
    ].includes(key),
  ),
);
for (const key of (process.env.CK_CLI_ENV_KEYS || "")
  .split(",")
  .map((k) => k.trim())
  .filter(Boolean)) {
  if (
    !/^[A-Z][A-Z0-9_]*$/.test(key) ||
    key.startsWith("CK_") ||
    key.includes("DATABASE") ||
    key.includes("CLERK")
  )
    throw Error(
      "Do not pass workspace or database credentials to CLI subprocesses.",
    );
  if (process.env[key]) env[key] = process.env[key];
}
let stopping = false;
process.on("SIGINT", () => {
  stopping = true;
});
process.on("SIGTERM", () => {
  stopping = true;
});
async function post(suffix, body) {
  const url = new URL(base);
  url.pathname = base.pathname.replace(/\/$/, "") + suffix;
  url.search = "";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
    redirect: "error",
  });
  if (!response.ok) throw Error(`API returned ${response.status}`);
  return (await response.json()).data;
}
async function cycle() {
  const job = await post("/worker/jobs/claim", {});
  if (!job) return false;
  let completion;
  try {
    const result = await runCli(job, {
      executable: process.env.CK_CLI_EXECUTABLE,
      args,
      env,
    });
    completion = {
      runId: job.run_id,
      status: "succeeded",
      companies: result.companies,
    };
  } catch (error) {
    completion = {
      runId: job.run_id,
      status: "failed",
      errorCode: [
        "CLI_TIMEOUT",
        "CLI_FAILED",
        "INVALID_OUTPUT",
        "WORKER_CONFIGURATION",
      ].includes(error.code)
        ? error.code
        : "CLI_FAILED",
    };
  }
  try {
    await post(`/worker/jobs/${job.id}/complete`, completion);
  } catch (error) {
    if (
      completion.status === "succeeded" &&
      error.message === "API returned 400"
    ) {
      await post(`/worker/jobs/${job.id}/complete`, {
        runId: job.run_id,
        status: "failed",
        errorCode: "INVALID_OUTPUT",
      });
    } else throw error;
  }
  console.log(`Job ${job.id}: completion submitted.`);
  return true;
}
do {
  try {
    const worked = await cycle();
    if (process.argv.includes("--once")) break;
    if (!worked) await new Promise((r) => setTimeout(r, 5000));
  } catch (error) {
    console.error(error.message);
    if (process.argv.includes("--once")) {
      process.exitCode = 1;
      break;
    }
    await new Promise((r) => setTimeout(r, 10000));
  }
} while (!stopping);
