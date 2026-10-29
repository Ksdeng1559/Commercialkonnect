/**
 * Node-side wrapper around Scrapling.
 *
 * Scrapling is a Python library, so the crawler drives it through
 * `scripts/_scrapling_fetch.py` — a one-request bridge that returns status,
 * post-redirect URL and extracted content together.
 *
 * Environment notes that matter:
 *   - The Scrapling venv lives on the Windows G: drive, mounted at
 *     /mnt/g in WSL. Override with SCRAPLING_VENV.
 *   - The Hermes runtime exports PYTHONPATH pointing at its own 3.14
 *     site-packages. Left in place, the bridge resolves `greenlet` from the
 *     wrong interpreter and dies with ModuleNotFoundError. Every spawn here
 *     strips PYTHONPATH.
 */

import { execFile } from "node:child_process";
import path from "node:path";
import type { FetchedPage } from "./types";

/** Root of the Scrapling virtualenv. Override with SCRAPLING_VENV. */
export const SCRAPLING_VENV =
  process.env.SCRAPLING_VENV ?? "/mnt/g/AI-Applications/Scrapling/.venv";

/** Absolute path to the Scrapling interpreter. */
export const SCRAPLING_PYTHON = path.join(SCRAPLING_VENV, "bin", "python");

/** Path to the one-request bridge. */
export const BRIDGE_SCRIPT = path.resolve(
  process.cwd(),
  "scripts/_scrapling_fetch.py"
);

/**
 * Crawler identification sent with every request.
 *
 * A descriptive token with a contact URL is the convention that keeps a
 * crawler welcome; the same token is used for the robots.txt lookup so the
 * policy resolved is the policy that applies to us.
 */
export const USER_AGENT =
  process.env.SCRAP_USER_AGENT ??
  "CommercialKonnectResearch/1.0 (+https://commercialkonnect.com/bot)";

interface BridgeResult {
  ok: boolean;
  status: number | null;
  url: string;
  final_url: string;
  markdown: string;
  bytes: number;
  reason: string | null;
  error: string | null;
}

/**
 * Spawn the bridge with a cleaned environment.
 *
 * PYTHONPATH is removed because the Hermes runtime's 3.14 site-packages
 * shadow the Scrapling venv's dependencies and break the import.
 */
function runBridge(
  args: string[],
  timeoutMs: number
): Promise<{ stdout: string; stderr: string }> {
  const env = { ...process.env };
  delete env.PYTHONPATH;

  return new Promise((resolve, reject) => {
    execFile(
      SCRAPLING_PYTHON,
      [BRIDGE_SCRIPT, ...args],
      {
        env,
        timeout: timeoutMs,
        maxBuffer: 32 * 1024 * 1024,
      },
      (error, stdout, stderr) => {
        if (error && !stdout) {
          reject(new Error(`${error.message}\n${stderr}`.trim()));
          return;
        }
        resolve({ stdout, stderr });
      }
    );
  });
}

export interface FetchOptions {
  /** Per-request timeout in seconds. Default 45. */
  timeoutSeconds?: number;
  /** Restrict extraction to a CSS selector. */
  cssSelector?: string;
  /** Browser profile to impersonate. */
  impersonate?: string;
  /**
   * Return the undecorated body instead of Markdown.
   * Required for XML: the Markdown conversion is HTML-aware and strips the
   * tags out of a sitemap, leaving nothing to parse.
   */
  raw?: boolean;
}

/**
 * Fetch one URL through Scrapling.
 *
 * Never throws for an HTTP-level failure — a 404 or 500 is a completed
 * request and is returned as `ok: false` with the status preserved. Only an
 * inability to run the bridge at all surfaces as a rejected promise.
 */
export async function fetchPage(
  url: string,
  options: FetchOptions = {}
): Promise<FetchedPage> {
  const timeoutSeconds = options.timeoutSeconds ?? 45;
  const args = [url, "--timeout", String(timeoutSeconds)];

  if (options.cssSelector) args.push("--css-selector", options.cssSelector);
  if (options.impersonate) args.push("--impersonate", options.impersonate);
  if (options.raw) args.push("--raw");
  args.push("--header", `User-Agent: ${USER_AGENT}`);

  const fetchedAt = new Date().toISOString();

  try {
    const { stdout } = await runBridge(args, (timeoutSeconds + 20) * 1000);
    const parsed = JSON.parse(stdout) as BridgeResult;

    return {
      requested_url: url,
      final_url: parsed.final_url || url,
      status: parsed.status,
      markdown: parsed.markdown ?? "",
      bytes: parsed.bytes ?? 0,
      fetched_at: fetchedAt,
      ok: parsed.ok === true && parsed.status !== null && parsed.status < 400,
      error: parsed.error ?? undefined,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      requested_url: url,
      final_url: url,
      status: null,
      markdown: "",
      bytes: 0,
      fetched_at: fetchedAt,
      ok: false,
      error: message,
    };
  }
}

/**
 * Fetch a URL that is expected to return plain text (robots.txt, sitemaps).
 * Returns the body as a string, or null when the request failed.
 */
export async function fetchText(
  url: string,
  options: FetchOptions = {}
): Promise<string | null> {
  const page = await fetchPage(url, { raw: true, ...options });
  if (!page.ok || page.bytes === 0) return null;
  return page.markdown;
}

/**
 * Check that the Scrapling venv is reachable and functional.
 * Run before a crawl so a broken environment fails fast with a clear message
 * rather than as 60 identical per-URL errors.
 */
export async function verifyScrapling(): Promise<{
  ok: boolean;
  version?: string;
  error?: string;
}> {
  try {
    const env = { ...process.env };
    delete env.PYTHONPATH;

    return await new Promise((resolve) => {
      execFile(
        SCRAPLING_PYTHON,
        ["-c", "import scrapling; print(scrapling.__version__)"],
        { env, timeout: 60000 },
        (error, stdout) => {
          if (error) {
            resolve({ ok: false, error: error.message });
            return;
          }
          resolve({ ok: true, version: stdout.trim() });
        }
      );
    });
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
