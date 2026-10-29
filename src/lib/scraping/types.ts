/**
 * Types for the lender-scraping pipeline.
 *
 * These mirror the WordPress `lender` CPT meta contract in
 * wp/mu-plugins/ck-lender-cpt.php. Field names are deliberately the
 * `ck_`-stripped versions of the meta keys so the importer is a straight
 * mapping with no per-field translation table.
 *
 * Source of record for the fields: docs/LENDER_DIRECTORY.md
 * Source of record for the gate: ck_lender_is_publishable() in the CPT plugin.
 */

/**
 * Mirrors `ck_verification_status`. The CPT defaults this to "unverified"
 * and only "verified" is publicly publishable.
 *
 * Scraping NEVER produces "verified". A scraped record is a claim made by the
 * source site, observed by us at a point in time. Verification is a separate
 * human/analyst action against a regulator or licensing registry.
 */
export type VerificationStatus = "verified" | "unverified" | "not-applicable";

/** Mirrors `ck_regulator`. */
export type Regulator = "BCFSA" | "FSRA" | "none";

/**
 * The provenance block required by AGENTS.md ("Store originating source URL,
 * publisher, observation timestamp, license, verification status and
 * confidence").
 */
export interface ScrapedProvenance {
  /** Originating page the fields were read from. Mirrors `ck_source_url`. */
  source_url: string;
  /** Publisher of the source page — the organisation that owns the domain. */
  publisher: string;
  /** ISO 8601 timestamp of when we observed the page. */
  observed_at: string;
  /**
   * Licence or terms governing reuse of the captured content. Website copy is
   * captured for factual directory purposes only; we record the site's own
   * terms of use when present, otherwise "unknown".
   */
  license: string;
  /** Mirrors `ck_verification_status`. Always "unverified" for scraped data. */
  verification_status: VerificationStatus;
  /**
   * Confidence in the extracted record, 0..1. Derived from how many
   * independent signals on the page agreed — not from how plausible the
   * result sounds.
   */
  confidence: number;
}

/**
 * A scraped lender record. Every field except `name`, `domain` and
 * `provenance` is optional: absence of a signal means "not stated on the
 * source page", which is different from "not applicable" and must not be
 * guessed at.
 */
export interface ScrapedLender {
  /** Organisation name as published. */
  name: string;
  /**
   * The heading of the specific page the facts were read from.
   * Kept separate from `name` because a page title names a page
   * ("What We Do - Kingsmen Capital Investments"), not the organisation.
   */
  page_title: string;
  /** Registrable domain, e.g. "kingsmencapital.ca". */
  domain: string;
  /** Product labels found on the page (mirrors `ck_products`). */
  products: string[];
  /** Geographic scope the lender serves (mirrors `ck_territory`). */
  territory: string;
  /** Regulator if named on the page (mirrors `ck_regulator`). */
  regulator: Regulator;
  /** Licence/registration number if published (mirrors `ck_licence_no`). */
  licence_no: string;
  /** Loan-to-value range as stated (mirrors `ck_ltv`). */
  ltv: string;
  /** Debt-service-coverage ratio as stated (mirrors `ck_dscr`). */
  dscr: string;
  /**
   * Date the rate/terms were last confirmed (mirrors `ck_rate_asof`).
   * For scraped data this is the observation date, because the page is the
   * only evidence we have.
   */
  rate_asof: string;
  /** Contact as published (mirrors `ck_contact`). */
  contact: string;
  /** Full provenance block. */
  provenance: ScrapedProvenance;
}

/** A site to crawl, with the specific pages we intend to read. */
export interface ScrapeSeed {
  /** Publisher identity used for provenance. */
  publisher: string;
  /** Pages to read. Must be within the publisher's robots.txt permission. */
  urls: string[];
}

/** The outcome of fetching one URL through Scrapling. */
export interface FetchedPage {
  requested_url: string;
  /** URL after redirects. */
  final_url: string;
  /** HTTP status, or null when the fetch failed before a response. */
  status: number | null;
  /** Cleaned markdown of the main content. */
  markdown: string;
  /** Byte length of the markdown. */
  bytes: number;
  /** ISO 8601 fetch timestamp. */
  fetched_at: string;
  ok: boolean;
  error?: string;
}

/** Per-URL audit record written alongside every scrape run. */
export interface ScrapeLogEntry {
  url: string;
  final_url: string;
  status: number | null;
  ok: boolean;
  bytes: number;
  robots_allowed: boolean;
  crawl_delay_applied: number;
  fetched_at: string;
  error?: string;
}

/** The full result of a scrape run, persisted for audit and import. */
export interface ScrapeRun {
  run_id: string;
  started_at: string;
  finished_at: string;
  user_agent: string;
  lenders: ScrapedLender[];
  log: ScrapeLogEntry[];
}
