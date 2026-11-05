import type { APIRoute } from "astro";

// Search engine discovery: application and API pages are excluded from XML sitemap
// and marked noindex at response/page level; robots.txt must not block noindex crawling.
export const GET: APIRoute = ({ site }) => {
  const url = new URL("sitemap-index.xml", site ?? "https://commercialkonnect.ca/");
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${url.href}\n`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
};
