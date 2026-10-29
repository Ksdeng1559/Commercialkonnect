/**
 * Sitemap discovery.
 *
 * Sitemaps are the polite way to find a site's pages: the publisher has
 * already declared what exists, so the crawler does not have to guess paths
 * or enumerate directory listings.
 */

/** Extract every <loc> value from a sitemap or sitemap index. */
export function extractLocs(xml: string): string[] {
  const locs: string[] = [];
  const pattern = /<loc>\s*([^<\s][^<]*?)\s*<\/loc>/gi;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(xml)) !== null) {
    locs.push(match[1].trim());
  }

  return locs;
}

/**
 * A sitemap index points at more sitemaps; a urlset points at pages.
 */
export function isSitemapIndex(xml: string): boolean {
  return /<sitemapindex[\s>]/i.test(xml);
}

/**
 * Return the child sitemap URLs, or an empty array when the document is a
 * urlset rather than an index.
 */
export function extractChildSitemaps(xml: string): string[] {
  if (!isSitemapIndex(xml)) return [];
  return extractLocs(xml);
}

/**
 * Filter a list of URLs down to those worth reading.
 *
 * @param urls           candidate URLs
 * @param include        patterns a URL must match to be kept
 * @param exclude        patterns that disqualify a URL even if it matched
 * @param limit          maximum number of URLs to return
 */
export function selectUrls(
  urls: string[],
  include: RegExp[],
  exclude: RegExp[],
  limit: number
): string[] {
  const seen = new Set<string>();
  const selected: string[] = [];

  for (const raw of urls) {
    if (selected.length >= limit) break;

    let parsed: URL;
    try {
      parsed = new URL(raw);
    } catch {
      continue;
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") continue;

    const path = parsed.pathname;
    if (exclude.some((pattern) => pattern.test(path))) continue;
    if (include.length > 0 && !include.some((pattern) => pattern.test(path))) {
      continue;
    }

    // Collapse to path+query so tracking parameters do not create duplicates.
    const key = `${parsed.origin}${parsed.pathname}${parsed.search}`;
    if (seen.has(key)) continue;
    seen.add(key);

    selected.push(key);
  }

  return selected;
}

/**
 * Turn a URL into a safe filename stem.
 */
export function urlToSlug(url: string): string {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.replace(/^\/+|\/+$/g, "");
    const stem = path ? path.replace(/[^a-z0-9]+/gi, "-").toLowerCase() : "index";
    return `${stem.slice(0, 100)}`;
  } catch {
    return "index";
  }
}

/**
 * Extract same-origin links from a page body.
 *
 * Used as the fallback when a publisher declares a sitemap that does not
 * resolve — fraction.com points at /sitemap.xml, which returns a 404 page.
 * In that case the homepage's own navigation is the only map of the site we
 * have, and it is one the publisher built for exactly this purpose.
 *
 * Markdown conversion preserves links as [text](href), but some pages also
 * carry raw HTML anchors, so both forms are matched.
 */
export function extractLinks(body: string, origin: string): string[] {
  const links = new Set<string>();
  const patterns = [
    // Markdown link targets, absolute or relative. Scrapling's Markdown
    // conversion rewrites every anchor, so raw HTML href attributes rarely
    // survive — the Markdown form is the one that must work.
    /\]\(\s*([^)\s]+)/gi,
    /href\s*=\s*["']([^"']+)["']/gi,
  ];

  const base = new URL(origin);

  for (const pattern of patterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(body)) !== null) {
      const href = match[1].trim();
      try {
        const parsed = new URL(href, base);
        if (parsed.origin !== base.origin) continue;
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") continue;
        links.add(`${parsed.origin}${parsed.pathname}`);
      } catch {
        continue;
      }
    }
  }

  return [...links];
}
