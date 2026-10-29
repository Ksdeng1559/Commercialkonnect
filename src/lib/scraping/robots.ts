/**
 * robots.txt parsing and enforcement.
 *
 * The crawler is bound by the target's robots.txt. This module is pure so it
 * can be unit-tested without network access, and so the enforcement decision
 * is auditable independently of the fetching code.
 *
 * Standard implemented (per RFC 9309 and the de-facto Google/Bing rules):
 *   - Groups of one or more consecutive `User-agent` lines share one rule set.
 *   - The most specific matching user-agent group wins; `*` is the fallback.
 *   - Within a group, the longest matching path wins. On a tie, `Allow` wins.
 *   - `Disallow:` with an empty value imposes no restriction.
 *   - `*` matches any run of characters; a trailing `$` anchors to the end.
 */

export interface RobotsRule {
  type: "allow" | "disallow";
  path: string;
}

export interface RobotsPolicy {
  /** False when the requested path is disallowed. */
  allowed: boolean;
  /** `Crawl-delay` in seconds for the matched group. 0 when unset. */
  crawlDelaySeconds: number;
  /** `Sitemap:` directives found anywhere in the file. */
  sitemaps: string[];
  /** Rules from the matched group only. */
  rules: RobotsRule[];
  /** The user-agent token whose group was used, or null when none matched. */
  matchedUserAgent: string | null;
}

interface RobotsGroup {
  agents: string[];
  rules: RobotsRule[];
  crawlDelay: number | null;
}

const DIRECTIVE = /^\s*([A-Za-z-]+)\s*:\s*(.*)$/;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Compile a robots path pattern into a RegExp.
 * `*` becomes `.*`; a trailing `$` anchors the match to the end of the path.
 */
export function patternToRegExp(pattern: string): RegExp {
  const anchored = pattern.endsWith("$");
  const body = anchored ? pattern.slice(0, -1) : pattern;
  const source = body.split("*").map(escapeRegExp).join(".*");
  return new RegExp(`^${source}${anchored ? "$" : ""}`);
}

/**
 * Decide whether a path may be fetched under the given rules.
 * Returns true when no rule matches (no restriction).
 */
export function isPathAllowed(path: string, rules: RobotsRule[]): boolean {
  let best: { length: number; allow: boolean } | null = null;

  for (const rule of rules) {
    // "Disallow:" with no value means "allow everything".
    if (rule.path === "") continue;
    if (!patternToRegExp(rule.path).test(path)) continue;

    const length = rule.path.length;
    if (
      !best ||
      length > best.length ||
      (length === best.length && rule.type === "allow")
    ) {
      best = { length, allow: rule.type === "allow" };
    }
  }

  return best ? best.allow : true;
}

/**
 * Parse a robots.txt body and resolve the policy for one user-agent.
 *
 * @param raw         the robots.txt body
 * @param userAgent   the crawler token to match (case-insensitive)
 * @param path        the path being requested, used to decide allowed
 */
export function parseRobots(
  raw: string,
  userAgent = "*",
  path = "/"
): RobotsPolicy {
  const groups: RobotsGroup[] = [];
  const sitemaps: string[] = [];
  let current: RobotsGroup | null = null;

  for (const line of raw.split(/\r?\n/)) {
    const match = DIRECTIVE.exec(line);
    if (!match) continue;

    const name = match[1].toLowerCase();
    const value = match[2].trim();

    if (name === "sitemap") {
      if (value) sitemaps.push(value);
      continue;
    }

    if (name === "user-agent") {
      // A new group starts when there is no current group, or the current
      // group already carries rules (meaning its user-agent list is closed).
      if (!current || current.rules.length > 0 || current.crawlDelay !== null) {
        current = { agents: [], rules: [], crawlDelay: null };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      continue;
    }

    // Rules before any user-agent line belong to the implicit wildcard group.
    // Real sites do this — WordPress sites commonly put "Crawl-delay: 10" on
    // line 1, above the "User-agent: *" line.
    if (!current) {
      current = { agents: ["*"], rules: [], crawlDelay: null };
      groups.push(current);
    }

    if (name === "disallow") {
      current.rules.push({ type: "disallow", path: value });
    } else if (name === "allow") {
      current.rules.push({ type: "allow", path: value });
    } else if (name === "crawl-delay") {
      const delay = Number(value);
      if (Number.isFinite(delay) && delay >= 0) current.crawlDelay = delay;
    }
  }

  const target = userAgent.toLowerCase();
  const specific = groups.find((group) => group.agents.includes(target));
  const wildcard = groups.find((group) => group.agents.includes("*"));
  const matched = specific ?? wildcard ?? null;

  const rules = matched ? matched.rules : [];
  const crawlDelaySeconds = matched?.crawlDelay ?? 0;

  return {
    allowed: isPathAllowed(path, rules),
    crawlDelaySeconds,
    sitemaps,
    rules,
    matchedUserAgent: matched ? (specific ? target : "*") : null,
  };
}

/**
 * Resolve the policy for a path against an already-parsed robots body.
 * Kept separate so a caller can parse once and then ask about many paths.
 */
export function checkPath(raw: string, path: string, userAgent = "*"): RobotsPolicy {
  return parseRobots(raw, userAgent, path);
}
