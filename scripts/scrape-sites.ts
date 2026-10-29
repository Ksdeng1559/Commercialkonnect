/**
 * Evidence-gathering crawler.
 *
 * Reads the target publishers' public pages, keeps robots.txt and crawl-delay
 * rules, and writes the captured evidence into the workspace so it can be
 * reviewed, cited and later turned into directory records and content.
 *
 * Usage:
 *   npm run scrape:sites                # full run
 *   npm run scrape:sites -- --site glasslake.ca
 *   npm run scrape:sites -- --dry-run   # discover URLs, fetch nothing
 *
 * Output layout:
 *   data/scraped/<domain>/<slug>.md     captured page text
 *   data/scraped/<domain>/<slug>.json   capture metadata
 *   data/scraped/manifest.json          run manifest and per-URL audit log
 *   data/scraped/lenders.json           extracted lender records
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildLender } from "../src/lib/scraping/extract";
import { fetchPage, fetchText, USER_AGENT, verifyScrapling } from "../src/lib/scraping/scrapling";
import { parseRobots } from "../src/lib/scraping/robots";
import {
  extractChildSitemaps,
  extractLinks,
  extractLocs,
  selectUrls,
  urlToSlug,
} from "../src/lib/scraping/sitemap";
import { ROBOTS_USER_AGENT, TARGET_SITES } from "../src/lib/scraping/sites";
import type {
  ScrapeLogEntry,
  ScrapeRun,
  ScrapedLender,
} from "../src/lib/scraping/types";

const OUTPUT_ROOT = path.resolve(process.cwd(), "data", "scraped");

/** Minimum pause between two requests to the same publisher. */
const DEFAULT_CRAWL_DELAY_SECONDS = 2;

/** Cap on how long we wait for a site's robots.txt before giving up. */
const ROBOTS_TIMEOUT_SECONDS = 20;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseArgs(argv: string[]): { site?: string; dryRun: boolean } {
  const args = { site: undefined as string | undefined, dryRun: false };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--site" && argv[i + 1]) {
      args.site = argv[i + 1];
      i += 1;
    } else if (argv[i] === "--dry-run") {
      args.dryRun = true;
    }
  }
  return args;
}

/**
 * Fetch robots.txt for a site and resolve the policy.
 * A missing or unreachable robots.txt is treated as "no restrictions stated",
 * which is the standard reading, but the crawl-delay falls back to a
 * conservative default rather than to zero.
 */
async function loadRobots(domain: string): Promise<{
  raw: string;
  crawlDelaySeconds: number;
  sitemaps: string[];
}> {
  const url = `https://${domain}/robots.txt`;
  const body = await fetchText(url, { timeoutSeconds: ROBOTS_TIMEOUT_SECONDS });

  if (body === null) {
    return { raw: "", crawlDelaySeconds: DEFAULT_CRAWL_DELAY_SECONDS, sitemaps: [] };
  }

  const policy = parseRobots(body, ROBOTS_USER_AGENT, "/");
  return {
    raw: body,
    crawlDelaySeconds:
      policy.crawlDelaySeconds > 0
        ? policy.crawlDelaySeconds
        : DEFAULT_CRAWL_DELAY_SECONDS,
    sitemaps: policy.sitemaps,
  };
}

/**
 * Discover candidate URLs for a site: declared sitemaps first, then the
 * conventional locations.
 */
async function discoverUrls(
  domain: string,
  declaredSitemaps: string[]
): Promise<{ urls: string[]; sitemapsRead: string[]; strategy: string }> {
  const candidates = [
    ...declaredSitemaps,
    `https://${domain}/sitemap_index.xml`,
    `https://${domain}/sitemap.xml`,
  ];

  const seen = new Set<string>();
  const urls: string[] = [];
  const sitemapsRead: string[] = [];

  for (const candidate of candidates) {
    if (seen.has(candidate)) continue;
    seen.add(candidate);

    const xml = await fetchText(candidate, { timeoutSeconds: ROBOTS_TIMEOUT_SECONDS });
    if (xml === null) continue;

    // A declared sitemap that answers with an HTML 404 page is not a sitemap.
    // Detect that rather than treating the page as an empty sitemap.
    if (!/<(?:urlset|sitemapindex)[\s>]/i.test(xml)) continue;

    sitemapsRead.push(candidate);
    const children = extractChildSitemaps(xml);

    if (children.length > 0) {
      for (const child of children) {
        const childXml = await fetchText(child, { timeoutSeconds: ROBOTS_TIMEOUT_SECONDS });
        if (childXml === null) continue;
        if (!/<(?:urlset|sitemapindex)[\s>]/i.test(childXml)) continue;
        sitemapsRead.push(child);
        urls.push(...extractLocs(childXml));
      }
      continue;
    }

    urls.push(...extractLocs(xml));
  }

  if (urls.length > 0) {
    return { urls, sitemapsRead, strategy: "sitemap" };
  }

  // Fallback: the publisher's own navigation. fraction.com declares
  // /sitemap.xml, which answers with a 404 page — there is no sitemap to
  // read, so the homepage links are the only map of the site available.
  const home = await fetchText(`https://${domain}/`, {
    timeoutSeconds: ROBOTS_TIMEOUT_SECONDS,
  });
  if (home === null) return { urls: [], sitemapsRead, strategy: "none" };

  return {
    urls: extractLinks(home, `https://${domain}/`),
    sitemapsRead,
    strategy: "homepage-links",
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const health = await verifyScrapling();
  if (!health.ok) {
    console.error(
      `Scrapling is not usable at ${process.env.SCRAPLING_VENV ?? "/mnt/g/AI-Applications/Scrapling/.venv"}: ${health.error}`
    );
    console.error(
      "Set SCRAPLING_VENV to the virtualenv that has scrapling installed, or install it with:"
    );
    console.error(
      '  cd "/mnt/g/AI-Applications/Scrapling" && uv venv --python 3.12 .venv && VIRTUAL_ENV="$PWD/.venv" uv pip install -e ".[ai]"'
    );
    process.exit(1);
  }
  console.log(`Scrapling ${health.version} ready.`);

  const sites = args.site
    ? TARGET_SITES.filter((site) => site.domain.includes(args.site!))
    : TARGET_SITES;

  if (sites.length === 0) {
    console.error(`No target site matches "${args.site}".`);
    process.exit(1);
  }

  const runId = new Date().toISOString().replace(/[:.]/g, "-");
  const startedAt = new Date().toISOString();
  const lenders: ScrapedLender[] = [];
  const log: ScrapeLogEntry[] = [];

  await mkdir(OUTPUT_ROOT, { recursive: true });

  for (const site of sites) {
    console.log(`\n=== ${site.publisher} (${site.domain}) ===`);

    const robots = await loadRobots(site.domain);
    console.log(
      `  robots: crawl-delay ${robots.crawlDelaySeconds}s, ${robots.sitemaps.length} declared sitemaps`
    );

    const { urls: candidates, sitemapsRead, strategy } = await discoverUrls(
      site.domain,
      robots.sitemaps
    );
    console.log(
      `  discovery: ${strategy}, ${sitemapsRead.length} sitemaps read, ${candidates.length} URLs found`
    );

    // Seeds first — they are the pages known to carry lending facts — then
    // anything else discovery turned up that passes the filters.
    const discovered = selectUrls(candidates, site.include, site.exclude, site.maxPages);
    const selected = [...new Set([...site.seedUrls, ...discovered])].slice(
      0,
      site.maxPages
    );
    console.log(`  selected ${selected.length} URLs (cap ${site.maxPages})`);

    if (args.dryRun) {
      for (const url of selected) console.log(`    [dry] ${url}`);
      continue;
    }

    const siteDir = path.join(OUTPUT_ROOT, site.domain);
    await mkdir(siteDir, { recursive: true });

    for (const url of selected) {
      const pathname = new URL(url).pathname;
      const policy = parseRobots(robots.raw, ROBOTS_USER_AGENT, pathname);

      if (!policy.allowed) {
        console.log(`    SKIP (robots disallowed): ${url}`);
        log.push({
          url,
          final_url: url,
          status: null,
          ok: false,
          bytes: 0,
          robots_allowed: false,
          crawl_delay_applied: robots.crawlDelaySeconds,
          fetched_at: new Date().toISOString(),
          error: "disallowed by robots.txt",
        });
        continue;
      }

      await sleep(robots.crawlDelaySeconds * 1000);

      const page = await fetchPageWithRetry(url);
      const slug = urlToSlug(url);

      log.push({
        url,
        final_url: page.final_url,
        status: page.status,
        ok: page.ok,
        bytes: page.bytes,
        robots_allowed: true,
        crawl_delay_applied: robots.crawlDelaySeconds,
        fetched_at: page.fetched_at,
        error: page.error,
      });

      if (!page.ok || page.bytes === 0) {
        console.log(`    FAIL (${page.status ?? "no response"}): ${url}`);
        continue;
      }

      // Capture the evidence, plus the metadata needed to cite it later.
      await writeFile(path.join(siteDir, `${slug}.md`), page.markdown, "utf-8");
      await writeFile(
        path.join(siteDir, `${slug}.json`),
        JSON.stringify(
          {
            requested_url: url,
            final_url: page.final_url,
            status: page.status,
            bytes: page.bytes,
            fetched_at: page.fetched_at,
            user_agent: USER_AGENT,
            publisher: site.publisher,
            domain: site.domain,
            robots_crawl_delay_seconds: robots.crawlDelaySeconds,
          },
          null,
          2
        ),
        "utf-8"
      );

      const lender = buildLender({
        markdown: page.markdown,
        sourceUrl: page.final_url,
        publisher: site.publisher,
        domain: site.domain,
        observedAt: page.fetched_at,
      });
      lenders.push(lender);

      console.log(
        `    OK ${page.bytes}b  conf=${lender.provenance.confidence.toFixed(2)}  ${lender.name}  ${url}`
      );
    }
  }

  if (args.dryRun) {
    console.log("\nDry run complete — nothing fetched, nothing written.");
    return;
  }

  const finishedAt = new Date().toISOString();
  const run: ScrapeRun = {
    run_id: runId,
    started_at: startedAt,
    finished_at: finishedAt,
    user_agent: USER_AGENT,
    lenders,
    log,
  };

  await writeFile(
    path.join(OUTPUT_ROOT, "manifest.json"),
    JSON.stringify(run, null, 2),
    "utf-8"
  );
  await writeFile(
    path.join(OUTPUT_ROOT, "lenders.json"),
    JSON.stringify(lenders, null, 2),
    "utf-8"
  );

  const ok = log.filter((entry) => entry.ok).length;
  console.log(
    `\nDone. ${ok}/${log.length} pages captured, ${lenders.length} lender records extracted.`
  );
  console.log(`Evidence written to ${OUTPUT_ROOT}`);
}

/**
 * Fetch with one retry. A single retry covers the transient failures that
 * actually happen (connection reset, 429); repeated failure is recorded
 * rather than retried indefinitely.
 */
async function fetchPageWithRetry(url: string) {
  const { fetchPage } = await import("../src/lib/scraping/scrapling");
  const first = await fetchPage(url, { timeoutSeconds: 45 });
  if (first.ok) return first;

  await sleep(2000);
  const second = await fetchPage(url, { timeoutSeconds: 45 });
  return second.ok ? second : first;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
