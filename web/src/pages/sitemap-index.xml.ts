import type { APIRoute } from "astro";

// Native static sitemap index keeps npm lockfile unchanged.
export const GET: APIRoute = ({ site }) => {
  const location = new URL("sitemap-0.xml", site ?? "https://commercialkonnect.ca/");
  const xml = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    '<sitemap><loc>' + location.href + '</loc></sitemap></sitemapindex>';
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
