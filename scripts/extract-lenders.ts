/**
 * Rebuild lender records from the captured evidence.
 *
 * The captured Markdown in data/scraped/<domain>/ is the durable artefact.
 * This script re-reads it and regenerates data/scraped/lenders.json without
 * touching the network, so the extraction rules can be revised and replayed
 * against evidence already in hand.
 *
 * Usage:
 *   npm run scrape:extract
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildLender } from "../src/lib/scraping/extract";
import type { ScrapedLender } from "../src/lib/scraping/types";

const OUTPUT_ROOT = path.resolve(process.cwd(), "data", "scraped");

interface CaptureMeta {
  requested_url: string;
  final_url: string;
  status: number;
  bytes: number;
  fetched_at: string;
  publisher: string;
  domain: string;
  robots_crawl_delay_seconds: number;
}

async function main() {
  let domains: string[];
  try {
    domains = await readdir(OUTPUT_ROOT, { withFileTypes: true });
  } catch {
    console.error(`No evidence directory at ${OUTPUT_ROOT}. Run npm run scrape:sites first.`);
    process.exit(1);
  }

  const lenders: ScrapedLender[] = [];

  for (const entry of domains) {
    if (!entry.isDirectory()) continue;

    const siteDir = path.join(OUTPUT_ROOT, entry.name);
    const files = await readdir(siteDir);

    for (const file of files) {
      if (!file.endsWith(".md")) continue;

      const slug = file.replace(/\.md$/, "");
      const metaPath = path.join(siteDir, `${slug}.json`);

      let meta: CaptureMeta;
      try {
        meta = JSON.parse(await readFile(metaPath, "utf-8")) as CaptureMeta;
      } catch {
        console.warn(`  skip ${entry.name}/${file} — no metadata sidecar`);
        continue;
      }

      const markdown = await readFile(path.join(siteDir, file), "utf-8");

      const lender = buildLender({
        markdown,
        sourceUrl: meta.final_url || meta.requested_url,
        publisher: meta.publisher,
        domain: meta.domain,
        observedAt: meta.fetched_at,
      });

      lenders.push(lender);
      console.log(
        `  ${lender.name} — ${lender.page_title.slice(0, 46).padEnd(46)} conf=${lender.provenance.confidence.toFixed(2)}  ${lender.territory || "—"}  [${lender.products.length} products]`
      );
    }
  }

  lenders.sort((a, b) =>
    a.provenance.source_url.localeCompare(b.provenance.source_url)
  );

  await writeFile(
    path.join(OUTPUT_ROOT, "lenders.json"),
    JSON.stringify(lenders, null, 2),
    "utf-8"
  );

  console.log(`\n${lenders.length} lender records written to ${OUTPUT_ROOT}/lenders.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
