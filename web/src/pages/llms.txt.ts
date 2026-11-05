import type { APIRoute } from "astro";
import { niches } from "../data/niches";

// Optional machine-readable directory; does not guarantee AI search indexing.
export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL("https://commercialkonnect.ca/")).origin;
  const lines = [
    "# CommercialKonnect",
    "",
    "> Canadian commercial and business financing education and professional introductions; not a lender.",
    "",
    "## Financing guides",
    ...niches.map((n) => `- [${n.name}](${origin}/${n.slug}/): ${n.cardSummary}`),
    "",
    "## Enquiries",
    `- [Financing enquiry](${origin}/apply): Request a connection; not a financing approval.`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
