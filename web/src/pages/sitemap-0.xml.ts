import type { APIRoute } from "astro";
import { niches } from "../data/niches";

// Approved, public, canonical pages only. Do not include forms, API endpoints,
// private records, or unreviewed city × niche combinations.
export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL("https://commercialkonnect.ca/");
  const paths = ["/", "/business-funding/", ...niches.map(n => "/" + n.slug + "/")];
  const esc = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const unique = [...new Set(paths)];
  const xml = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    unique.map(path => '<url><loc>' + esc(new URL(path, origin).href) + '</loc></url>').join("") +
    '</urlset>';
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
