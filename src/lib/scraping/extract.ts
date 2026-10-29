/**
 * Extracts structured lender facts from scraped page text.
 *
 * The extractor is deliberately conservative. A field is populated only when
 * the page literally states it. Absence means "not stated on this page" —
 * which is different from "not applicable" and must never be guessed.
 * This mirrors the provenance contract in AGENTS.md and the publication gate
 * in wp/mu-plugins/ck-lender-cpt.php.
 */

import type { Regulator, ScrapedLender, ScrapedProvenance } from "./types";

/**
 * Strip the parts of a converted page that are not prose.
 *
 * This is not cosmetic. A phone regex run over raw Markdown happily matches
 * the digits inside an image filename (`fallen-jar-of-coins-e1642019860700.png`
 * yielded the phone number "16420198607"), and a country regex matches the
 * word "Us" in "Contact Us". Both produced false positives before cleaning.
 *
 * @param markdown the converted page
 */
export function cleanMarkdown(markdown: string): string {
  let text = markdown;

  // Inline base64 images — thousands of characters of noise.
  text = text.replace(/data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+/g, " ");

  // Markdown images and links: keep the visible text, drop the target.
  // `![alt](url)` -> `alt`, `[text](url)` -> `text`.
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1");
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");

  // Autolinks.
  text = text.replace(/<https?:\/\/[^>]+>/g, " ");

  // Accessibility skip links that survive conversion.
  text = text.replace(/\[?\s*skip to content\s*\]?/gi, " ");
  text = text.replace(/\[?\s*skip to main content\s*\]?/gi, " ");

  return text;
}

/**
 * Product vocabulary for Canadian commercial and business finance.
 * Matching is on word boundaries so "term loan" does not fire on
 * "interterm" and "sba" does not fire inside a longer word.
 */
export const PRODUCT_VOCABULARY: { label: string; pattern: RegExp }[] = [
  // "Commercial & Residential Mortgages" and "Commercial Real Estate Mortgage"
  // sit between the two words, so match on proximity rather than adjacency.
  { label: "Commercial Mortgage", pattern: /\bcommercial\b[\s\S]{0,40}?\bmortgages?\b|\bmortgages?\b[\s\S]{0,40}?\bcommercial\b/i },
  { label: "Bridge Financing", pattern: /\bbridge\s+(?:financing|loans?|financings?)\b/i },
  { label: "SBA Financing", pattern: /\bsba\b/i },
  { label: "Equipment Financing", pattern: /\bequipment\s+(?:financing|loans?|leases?)\b/i },
  { label: "Asset Based Line of Credit", pattern: /\basset[\s-]?based\b/i },
  { label: "Revenue Based Line of Credit", pattern: /\brevenue[\s-]?based\b/i },
  { label: "Business Line of Credit", pattern: /\b(?:line\s+of\s+credit|lines\s+of\s+credit|working\s+capital)\b/i },
  { label: "Construction Financing", pattern: /\bconstruction\s+(?:financing|loans?)\b/i },
  { label: "Development Financing", pattern: /\bdevelopment\s+(?:financing|loans?)\b/i },
  { label: "Land Acquisition", pattern: /\bland\s+(?:acquisition|financing|loans?)\b/i },
  { label: "Term Loan", pattern: /\bterm\s+loans?\b/i },
  { label: "Mezzanine Financing", pattern: /\bmezzanine\b/i },
  { label: "Private Lender", pattern: /\bprivate\s+(?:lender|lending|financing|credit)\b/i },
  { label: "Private Equity", pattern: /\bprivate\s+equity\b/i },
  { label: "Refinancing", pattern: /\bre-?financ(?:ing|ings)\b/i },
  { label: "Interest-Only", pattern: /\binterest[-\s]?only\b/i },
  { label: "Real Estate Financing", pattern: /\breal\s+estate\s+financing\b/i },
  { label: "Business Loan", pattern: /\bbusiness\s+loans?\b/i },
  { label: "Invoice Financing", pattern: /\binvoice\s+(?:financing|factoring)\b/i },
  { label: "Sale Leaseback", pattern: /\bsale[-\s]?leaseback\b/i },
];

/**
 * Geographic scope markers, most specific first.
 *
 * "United States" requires the spelled-out name or the dotted abbreviation.
 * A bare word-boundary "US" matches "Contact Us" and "About Us", which every
 * site has, and previously turned every Canadian lender into a US lender.
 */
const TERRITORY_MARKERS: { label: string; pattern: RegExp }[] = [
  { label: "British Columbia", pattern: /\bbritish\s+columbia\b/i },
  { label: "Vancouver", pattern: /\bvancouver\b/i },
  { label: "Calgary", pattern: /\bcalgary\b/i },
  { label: "Toronto", pattern: /\btoronto\b/i },
  { label: "Ontario", pattern: /\bontario\b/i },
  { label: "Alberta", pattern: /\balberta\b/i },
  { label: "Canada", pattern: /\bcanada\b|\bcanadian\b/i },
  { label: "United States", pattern: /\bunited\s+states\b|\bU\.S\.A?\b/i },
];

/** Regulator markers. FSRA and BCFSA are the BC registries. */
const REGULATOR_MARKERS: { value: Regulator; pattern: RegExp }[] = [
  { value: "BCFSA", pattern: /\bbcfs[ao]\b/i },
  { value: "FSRA", pattern: /\bfsra\b/i },
];

/**
 * Search a window of text around a keyword for a value.
 *
 * Proximity beats precision here: pages say "Loan-to-Value (LTV) of up to
 * 75%", "debt service coverage of 1.25x", "rates starting at 8.5%". A
 * regex that demands a rigid sentence shape misses most of them.
 *
 * Value patterns are tried in priority order, not in positional order. This
 * matters: Glasslake's broker page lists "LTV: Up to 75%" and then
 * "Qualifying: DSCR as low as 1.00x". Taking whichever value appears first
 * in the window gave DSCR the 75%, because the LTV figure sits closer to
 * the left edge of the window. Trying the multiplier form first gives DSCR
 * "1.00x" and leaves the percentage to LTV.
 */
function findValueNear(
  text: string,
  keyword: RegExp,
  valuePatterns: RegExp[],
  window = 160
): string | null {
  const keywordMatch = keyword.exec(text);
  if (!keywordMatch) return null;

  const start = Math.max(0, keywordMatch.index - window);
  const end = Math.min(text.length, keywordMatch.index + keywordMatch[0].length + window);
  const vicinity = text.slice(start, end);

  for (const pattern of valuePatterns) {
    const valueMatch = pattern.exec(vicinity);
    if (valueMatch) return valueMatch[0].trim();
  }

  return null;
}

const LTV_KEYWORD = /\b(?:ltv|loan[-\s]?to[-\s]?value)\b/i;
const LTV_VALUE = /\b\d{2,3}(?:\.\d+)?\s?%/;

const DSCR_KEYWORD = /\b(?:dscr|debt[-\s]?service\s+coverage(?:\s+ratio)?)\b/i;
/** A coverage ratio is stated as a multiplier ("1.25x"). Percentages are a fallback. */
const DSCR_VALUE_MULTIPLIER = /\b\d\.\d{1,2}\s?x\b/;
const DSCR_VALUE_PERCENT = /\b\d{1,2}\s?%/;

const RATE_KEYWORD = /\b(?:interest\s+rates?|rates?\s+(?:start(?:ing)?\s+at|from)|apr\b)/i;
const RATE_VALUE = /\b\d\.\d{1,3}\s?%/;

const EMAIL = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;

/**
 * A phone number.
 *
 * Two guards, both learned from real pages:
 *
 * 1. A separator (or a leading "+") is required. A bare 10-digit run is far
 *    more likely an identifier — "Alberta Broker Licence No. 2124490851" on
 *    glasslake.ca was being captured as a phone number.
 * 2. The number cannot be glued to surrounding word characters, which keeps
 *    digits inside image alt-text filenames out. "fallen jar of coins
 *    e1642019860700" yielded "16420198607" before this guard existed.
 */
const PHONE =
  /(?<![a-z0-9])(?:\+\d{1,3}[-.\s]?)?(?:\(\d{3}\)[-.\s]?|\d{3}[-.\s])\d{3}[-.\s]\d{4}(?![a-z0-9])/i;

/**
 * A licence or registration number: a label followed by an alphanumeric token.
 * The "no." / "number" qualifier must be matched before the number, or
 * "Alberta Broker Licence No. 2124490851" parses as licence -> "No".
 */
const LICENCE =
  /\b(?:licen[cs]e|registration)\s*(?:no\.?|number|#)?\s*[:#]?\s*([A-Z0-9][A-Z0-9\-/]{3,})\b/i;

/**
 * Extract the page's own title.
 * Used for evidence provenance — the organisation name comes from the
 * publisher configuration, not from the page, because a page title names a
 * page ("What We Do - Kingsmen Capital Investments"), not the organisation.
 */
export function extractPageTitle(markdown: string): string {
  const lines = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 2);

  for (const line of lines.slice(0, 5)) {
    if (line.startsWith("#")) {
      return line.replace(/^#+\s*/, "").trim();
    }
    if (!line.startsWith("[") && !line.startsWith("!") && !line.startsWith("*")) {
      return line.slice(0, 160);
    }
  }

  return "";
}

/**
 * Extract every product label the page mentions.
 */
export function extractProducts(markdown: string): string[] {
  const found: string[] = [];
  for (const { label, pattern } of PRODUCT_VOCABULARY) {
    if (pattern.test(markdown)) found.push(label);
  }
  return found;
}

/**
 * Extract the territory the lender serves.
 * Returns the most specific marker that matches, or "" when the page does
 * not state one.
 */
export function extractTerritory(markdown: string): string {
  const all = extractTerritories(markdown);
  return all[0] ?? "";
}

/**
 * Extract every territory the page mentions.
 *
 * The single most-specific marker is not enough for program matching. A
 * national lender states "British Columbia", "Alberta" and "Ontario" across
 * one page; collapsing that to the first match understates where the
 * program actually operates. The full list is what a term's geography has
 * to be checked against.
 */
export function extractTerritories(markdown: string): string[] {
  const found: string[] = [];
  for (const { label, pattern } of TERRITORY_MARKERS) {
    if (pattern.test(markdown)) found.push(label);
  }
  return found;
}

/**
 * Extract the regulator, only when the page names one.
 */
export function extractRegulator(markdown: string): Regulator {
  for (const { value, pattern } of REGULATOR_MARKERS) {
    if (pattern.test(markdown)) return value;
  }
  return "none";
}

/**
 * Extract a licence number, only when the page labels one.
 */
export function extractLicenceNo(markdown: string): string {
  const match = LICENCE.exec(markdown);
  return match ? match[1].trim() : "";
}

/**
 * Extract the LTV range as stated, e.g. "75%".
 */
export function extractLtv(markdown: string): string {
  return findValueNear(markdown, LTV_KEYWORD, [LTV_VALUE]) ?? "";
}

/**
 * Extract the DSCR as stated, e.g. "1.00x".
 */
export function extractDscr(markdown: string): string {
  return (
    findValueNear(markdown, DSCR_KEYWORD, [DSCR_VALUE_MULTIPLIER, DSCR_VALUE_PERCENT]) ?? ""
  );
}

/**
 * Extract the contact as published. Email is preferred over phone because a
 * directory listing is more useful for a broker than a phone number alone.
 */
export function extractContact(markdown: string): string {
  const email = EMAIL.exec(markdown);
  if (email) return email[0].toLowerCase();

  const phone = PHONE.exec(markdown);
  if (phone) return phone[0].trim();

  return "";
}

/**
 * Extract a rate as a confidence signal only — the published rate itself is
 * not stored as a lender fact, because a rate scraped on one day is not a
 * fact about the lender, it is a fact about a page on that day.
 */
export function extractRateSignal(markdown: string): string {
  return findValueNear(markdown, RATE_KEYWORD, [RATE_VALUE]) ?? "";
}

/**
 * Confidence in the extracted record, 0..1.
 *
 * Derived from how many independent signals the page agreed on. Nothing
 * reaches 1.0, because scraping is observation, not verification —
 * `ck_verification_status` carries that distinction, and a scraped record is
 * always "unverified".
 */
export function scoreConfidence(evidence: {
  publisherCorroborated: boolean;
  products: string[];
  territory: string;
  ltv: string;
  dscr: string;
  contact: string;
  rate: string;
}): number {
  const signals = [
    evidence.publisherCorroborated ? 1 : 0,
    evidence.products.length >= 3 ? 1 : evidence.products.length >= 1 ? 0.5 : 0,
    evidence.territory ? 1 : 0,
    evidence.ltv ? 1 : 0,
    evidence.dscr ? 1 : 0,
    evidence.contact ? 1 : 0,
    evidence.rate ? 1 : 0,
  ].reduce((sum, value) => sum + value, 0);

  // 7 possible signals; map onto 0.3..0.9 so a record is never "certain".
  return Math.round((0.3 + (signals / 7) * 0.6) * 100) / 100;
}

/**
 * Build a complete scraped lender record from a page.
 *
 * `name` is the organisation — taken from the publisher configuration, not
 * guessed out of the page title. `page_title` keeps the page's own heading
 * for provenance.
 *
 * `rate_asof` is the observation date: the page is the only evidence we
 * have of when the terms were last confirmed, so the observation date is the
 * honest answer.
 */
export function buildLender(params: {
  markdown: string;
  sourceUrl: string;
  publisher: string;
  domain: string;
  observedAt: string;
  license?: string;
}): ScrapedLender {
  const { markdown: raw, sourceUrl, publisher, domain, observedAt } = params;

  const markdown = cleanMarkdown(raw);
  const pageTitle = extractPageTitle(markdown);
  const products = extractProducts(markdown);
  const territories = extractTerritories(markdown);
  const territory = territories[0] ?? "";
  const regulator = extractRegulator(markdown);
  const licence_no = extractLicenceNo(markdown);
  const ltv = extractLtv(markdown);
  const dscr = extractDscr(markdown);
  const contact = extractContact(markdown);
  const rate = extractRateSignal(markdown);

  // The organisation is named on the page when the publisher's name appears
  // in it. This corroborates that we captured the page we intended to.
  const publisherCorroborated = new RegExp(
    publisher.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    "i"
  ).test(markdown);

  const provenance: ScrapedProvenance = {
    source_url: sourceUrl,
    publisher,
    observed_at: observedAt,
    license: params.license ?? "unknown",
    // Scraping is observation, never verification.
    verification_status: "unverified",
    confidence: scoreConfidence({
      publisherCorroborated,
      products,
      territory,
      ltv,
      dscr,
      contact,
      rate,
    }),
  };

  return {
    name: publisher,
    page_title: pageTitle,
    domain,
    products,
    territory,
    territories,
    regulator,
    licence_no,
    ltv,
    dscr,
    rate_asof: observedAt.slice(0, 10),
    contact,
    provenance,
  };
}
