/**
 * The target sites for the lender-directory evidence run.
 *
 * Each entry is a publisher we intend to read, with the constraints that
 * keep the crawl respectful and bounded:
 *
 *   seedUrls  pages known to carry lending facts — always read first
 *   maxPages  hard cap on pages read from the site in one run
 *   include   path patterns worth reading (empty = any path)
 *   exclude   path patterns never worth reading
 *
 * robots.txt is evaluated per site at run time; these entries do not
 * override it.
 */

export interface TargetSite {
  /** Publisher name used in the provenance block. */
  publisher: string;
  /** Registrable domain. */
  domain: string;
  /** Maximum pages to read from this site in a single run. */
  maxPages: number;
  /** Pages known to carry lending facts. Read first, in this order. */
  seedUrls: string[];
  /** Path patterns a page must match to be read. Empty means any path. */
  include: RegExp[];
  /** Path patterns that disqualify a page. */
  exclude: RegExp[];
}

/** Paths that never carry lending facts. */
const NOISE = [
  /^\/blog(\/|$)/i,
  /^\/news(\/|$)/i,
  /^\/post(\/|$)/i,
  /^\/category(\/|$)/i,
  /^\/tag(\/|$)/i,
  /^\/author(\/|$)/i,
  /^\/job(\/|$)/i,
  /^\/careers?(\/|$)/i,
  /^\/videos?(\/|$)/i,
  /^\/wp-/i,
  /^\/feed(\/|$)/i,
  /^\/privacy/i,
  /^\/terms/i,
  /^\/disclaimer/i,
  /^\/cookie/i,
  /^\/unsubscribe/i,
  /^\/sitemap(\/|$)/i,
  /^\/social-media(\/|$)/i,
  /thanks?-you/i,
  /\.(pdf|jpg|jpeg|png|gif|svg|webp|zip|doc|docx|xls|xlsx)$/i,
];

/** French-language duplicates. The directory publishes in English. */
const FRENCH = [/^\/fr(\/|$)/i];

export const TARGET_SITES: TargetSite[] = [
  {
    publisher: "Accord Financial",
    domain: "accordfinancial.com",
    maxPages: 8,
    seedUrls: [
      "https://accordfinancial.com/",
      "https://accordfinancial.com/solutions/",
      "https://accordfinancial.com/services/",
      "https://accordfinancial.com/expertise/",
      "https://accordfinancial.com/apply-now/",
    ],
    include: [
      /^\/$/,
      /^\/(solutions|services|expertise|apply-now|company|sectors?)(\/|$)/i,
    ],
    exclude: [...NOISE, ...FRENCH],
  },
  {
    publisher: "Kingsmen Capital",
    domain: "kingsmencapital.ca",
    maxPages: 10,
    seedUrls: [
      "https://kingsmencapital.ca/",
      "https://kingsmencapital.ca/what-we-do/",
      "https://kingsmencapital.ca/what-we-do/business-term-loans/",
      "https://kingsmencapital.ca/asset-based-line-of-credit/",
      "https://kingsmencapital.ca/what-we-do/revenue-based-line-of-credit/",
      "https://kingsmencapital.ca/what-we-do/equipment-financing/",
      "https://kingsmencapital.ca/our-company/about/",
    ],
    include: [
      /^\/$/,
      /^\/(what-we-do|our-company|resources|solutions|services|financing|asset-based-line-of-credit)(\/|$)/i,
    ],
    exclude: [
      ...NOISE,
      /^\/our-company\/kingsmen-capital-team\//i,
      /^\/loan-application/i,
      /^\/our-company\/careers/i,
    ],
  },
  {
    publisher: "Glasslake",
    domain: "glasslake.ca",
    maxPages: 8,
    seedUrls: [
      "https://glasslake.ca/",
      "https://glasslake.ca/products/",
      "https://glasslake.ca/about/",
      "https://glasslake.ca/broker-resources/",
      "https://glasslake.ca/contact/",
    ],
    include: [
      /^\/$/,
      /^\/(products|about|broker-resources|contact|solutions|expertise)(\/|$)/i,
    ],
    exclude: [...NOISE, /^\/home-bu(\/|$)/i, /^\/mortgageautomator(\/|$)/i],
  },
  {
    publisher: "Fraction",
    domain: "fraction.com",
    maxPages: 8,
    // fraction.com declares a sitemap that 404s, so the run falls back to
    // homepage link discovery.
    seedUrls: ["https://fraction.com/"],
    include: [
      /^\/$/,
      /^\/(solutions?|products?|financing|loans?|capital|commercial|rates|funding-calendar)(\/|$)/i,
    ],
    exclude: [...NOISE],
  },
];

/**
 * The user-agent token whose robots.txt rules apply to us.
 * Kept in one place so the robots lookup and the fetch use the same token.
 */
export const ROBOTS_USER_AGENT = "CommercialKonnectResearch";
