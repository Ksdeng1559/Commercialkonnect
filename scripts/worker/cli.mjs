import { spawn } from "node:child_process";
import path from "node:path";
export class CliError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}
export function runCli(job, config) {
  if (
    !config.executable ||
    !path.isAbsolute(config.executable) ||
    !Array.isArray(config.args) ||
    !config.args.every((a) => typeof a === "string")
  )
    throw new CliError("WORKER_CONFIGURATION");
  return new Promise((resolve, reject) => {
    const child = spawn(config.executable, config.args, {
      shell: false,
      windowsHide: true,
      detached: process.platform !== "win32",
      env: config.env,
      stdio: ["pipe", "pipe", "pipe"],
    });
    let ended = false,
      size = 0;
    const chunks = [];
    const finish = (error, result) => {
      if (ended) return;
      ended = true;
      clearTimeout(timer);
      if (error) reject(error);
      else resolve(result);
    };
    const stopTree = () => {
      if (!child.pid) return;
      if (process.platform === "win32") {
        const killer = spawn(
          path.join(
            process.env.SystemRoot || "C:\\Windows",
            "System32",
            "taskkill.exe",
          ),
          ["/pid", String(child.pid), "/t", "/f"],
          { shell: false, windowsHide: true, stdio: "ignore" },
        );
        killer.on("error", () => child.kill());
      } else {
        try {
          process.kill(-child.pid, "SIGKILL");
        } catch {
          child.kill();
        }
      }
    };
    const timer = setTimeout(() => {
      stopTree();
      finish(new CliError("CLI_TIMEOUT"));
    }, config.timeoutMs ?? 120000);
    child.stdout.on("data", (chunk) => {
      size += chunk.length;
      if (size > 500000) {
        stopTree();
        finish(new CliError("INVALID_OUTPUT"));
      } else chunks.push(chunk);
    });
    // Drain but never log stderr: it may contain provider credentials or customer data.
    child.stderr.resume();
    child.stdin.on("error", () => {});
    child.on("error", () => finish(new CliError("CLI_FAILED")));
    child.on("close", (code) => {
      if (code !== 0) {
        finish(new CliError("CLI_FAILED"));
        return;
      }
      try {
        const result = JSON.parse(Buffer.concat(chunks).toString("utf8"));
        if (
          !result ||
          !Array.isArray(result.companies) ||
          result.companies.length > 50
        )
          throw Error();
        finish(null, result);
      } catch {
        finish(new CliError("INVALID_OUTPUT"));
      }
    });
    child.stdin.end(
      JSON.stringify({
        version: 1,
        jobId: job.id,
        kind: job.kind,
        input: job.input,
      }) + "\n",
    );
  });
}
