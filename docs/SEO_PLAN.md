# CommercialKonnect — SEO Plan & Content Requirements

**Consolidated:** 2026-10-23 · **Canonical domain:** `https://commercialkonnect.ca` · **Brand:** CommercialKonnect (BC-first)
**Status:** 🔴 **NOT CLEARED FOR PUBLICATION** — two legal blockers open (see §1).
**Sources ingested:** `openseo-project` repo (`research/seo-geo-site-plan-2026-10-22.md`, `keyword-strategy-v2-2026-10-21.md`, `r03-bcfsa-msa-compliance-review-2026-10-22.md`, `r04-lending-licence-path-2026-10-22.md`, `landing-pages/README.md`, `_config/project-context.md`), plus a live audit of `commercialkonnect.ca/business-financing` (2026-10-22, schema + general SEO agents).

> This plan consolidates existing research into one actionable document. It does **not** relitigate the keyword math — that work is done and cited. It sequences the work behind a compliance gate and a technical gate, both of which currently block go-live regardless of content quality.

---

## 1. Compliance gate — resolve BEFORE publishing any money page

Commercial mortgage is **YMYL** (financial, highest Google scrutiny) and now regulated in BC under the **Mortgage Services Act (MSA), in force 2026-10-13**. Two blockers need a **BC mortgage lawyer's yes/no** — they cannot be closed by copywriting, by an agent, or by verification. Source: `r03-bcfsa-msa-compliance-review-2026-10-22.md`, `r04-lending-licence-path-2026-10-22.md`.

| ID | Blocker | What it blocks | Owner |
|---|---|---|---|
| **B1 [BLOCKED]** | "Dealing in mortgages" is a licensable activity, and the pages' **"we'll match you with 2–3 lenders"** language describes exactly that. "We're not a lender" is **not** a defence — you can be not-a-lender and still be an unlicensed broker. | Publication of all 9 money pages | **BC lawyer** must pick Route A/B/C (R03 §5) |
| **B2 [BLOCKED]** | `private-lender-bc` page claims **"Every lender listed here is BCFSA-registered"** about 24 un-verified third parties. Likely false (lenders aren't necessarily BCFSA-licensed) and a misrepresentation exposure. | Directory pages | Verify each against BCFSA register, or delete the claim |
| **B3 [BLOCKED]** | Stated goal "become a commercial funding source" is **not achievable by licensing today** — the MSA **`lending` category has no in-force date**. No page may state/imply CommercialKonnect originates/funds/holds loans. | Any "funding source" / lender positioning | Gated on Provincial Government (R04) |

**Penalties now live:** up to $500k (brokerage discipline), $1k–$100k administrative; BCFSA has search/seizure powers over unlicensed activity (R03 §4).

**Safe to do now (no lawyer needed), from R03 §6:**
1. Do **not** publish any page with matching language until B1 resolved.
2. Freeze all **42 rate figures** (`5.25%` is provably false per R02) — source each or replace with "lender-specific, request a quote."
3. **Keep** "CommercialKonnect is not a lender" (true) — but don't treat it as the compliance position.
4. Name the **licensed OpCo** (not the brand/HoldCo) in footer disclosure — a HoldCo does not unlock anything, and the entity operating the site is still unnamed (R04 §8). Broker licence **144231** (Dennis Eng) is asserted, register-unverified; an individual broker licence runs *in relation to a brokerage* and does not by itself license the site operator.

**Recommended track (R04 §5): Path A — broker-first.** Operate as a `dealing` brokerage now (lawful today), signpost the funding-source direction, move to `lending` when BCFSA sets an in-force date. This is what the corpus already does *minus the overclaiming*.

---

## 2. Technical gate — fix FIRST (blocks indexing of every page)

From the live audit (2026-10-22) + site-plan §1. None of the content work below earns anything until these are fixed.

| ID | Severity | Issue | Fix |
|---|---|---|---|
| **T1** | [HIGH] | **Live site canonicalises away from itself.** `commercialkonnect.ca` serves a Lovable SPA whose `<link rel="canonical">` and `og:url` point to `https://clearconnectcom.lovable.app/`. Tells Google the real site is a duplicate of staging → indexing suppressed site-wide. | Fix canonical + og:url to the production domain in the Lovable build. |
| **T2** | [HIGH] | **Sitemap + robots.txt point to the wrong domain.** `robots.txt` declares the Lovable sitemap; `sitemap.xml`'s `<loc>` entries are all `clearconnectcom.lovable.app`. Production domain effectively has no self-referencing sitemap. | Generate sitemap on `commercialkonnect.ca` with same-host `<loc>`s; reference from robots.txt on that domain; decide authoritative-domain status for the Lovable host (noindex + 301 to production). |
| **T3** | [HIGH] | **Client-rendered SPA, no SSR/prerender.** Raw HTML is an empty `<div id="root">` shell; content + any schema only appear after React boots. Non-JS crawlers (and many AI crawlers: GPTBot, ClaudeBot) see nothing. | Re-platform to WordPress (site-plan decision) **or** SSR/prerender the routes. Any JSON-LD must be in the shipped `<head>`, not mounted client-side. |
| **T4** | [HIGH] | **18 dead canonicals** across the 11 built pages declare `kommercialconnect.ca` (NXDOMAIN) + wrong brand string `KommercialConnect`. | Global search/replace → `commercialkonnect.ca` + brand `CommercialKonnect` before any import. |
| **T5** | [HIGH] | **Every lead form is a non-functional `onsubmit` alert.** The site's entire purpose is lead capture — nothing converts. | Wire forms to a real endpoint (`/api/apply` → email + CRM + Slack). Per policy, broker outreach drafts to Gmail, not auto-sent. |
| **T6** | [MED] | No structured data present anywhere; `/business-financing` meta is site-wide-identical (no per-route title/description); viewport/`lang`/robots meta not detected. | Per-page meta; `<html lang="en-CA">`; add schema per §5 once SSR is in place. |

---

## 3. Keyword → URL map (the plan of record)

Source: `keyword-strategy-v2-2026-10-21.md` + `seo-geo-site-plan-2026-10-22.md`. **55 keywords mapped, 0 unresolved, ~9,720/mo total.** Tier 1 (5 pages) = **84% of mapped volume** → ship first.

### Tier 1 — build first (all KD 0–1, high commercial intent)

| URL | Primary KW | Vol/mo | KD | Folds in | Page vol |
|---|---|---|---|---|---|
| `/private-lender/` **(pillar)** | `private lender` | 1,000 | 0 | `private-lender-bc.html` → BC subsection (`private lender bc`, 210/mo) | **1,850** |
| `/bridge-financing/` | `bridge financing` | 1,000 | 0 | +`bridge loan` (1,000, KD 23) as secondary | **2,000** |
| `/commercial-mortgage-broker/` **(pillar)** | `commercial mortgage broker` | 590 | 0 | `commercial-mortgage-broker-vancouver.html` → Vancouver subsection | **1,650** |
| `/aclp-cmhc/` | `aclp cmhc` | 320 | 1 | `cmhc mli select` (1,300/mo) as an **H2 section**, not a page | **2,190** |
| `/construction-mortgage-bc/` | `construction mortgage bc` | 70 | 0 | 20 long-tail H2/H3 | **770** |

### Queued (1,260/mo — do not delay launch)
`/commercial-mortgage/` (740 — holds `commercial mortgage rates` 720/mo KD 16, **highest commercial intent in the set — consider promoting to Tier 1**, open decision), `/mezzanine-financing/` (330), `/purpose-built-rental-vancouver/` (140), `/vancouver-land-assembly/` (50).

### Cannibalization — collapse to one page each (strategy §2)
- `construction financing bc` + `construction loan bc` → one page
- `commercial construction financing` + `commercial construction loan` → one page
- **16 ultra-long-tail terms** (below DataForSEO's Canada reporting floor) → **H2/H3 coverage inside parent pages, zero standalone pages.**

### Rejected — do NOT target (documented for provenance)
- **`bc loans`** (1,300/mo, $9.01 CPC) — SERP-verified **100% student-loan / provincial-aid intent** (18 of 20 results). The #2 term by naive vol×CPC; entirely wrong audience.
- `private lender canada` (KD 46, defended), `vancouver commercial property for sale` (listing intent, wrong funnel), `mezzanine financing` (investment-banking SERP).

---

## 4. Built inventory — what exists vs. what's needed

Source: `landing-pages/README.md`. **11 static HTML pages exist** (5 Tier-1 generated 2026-10-22, 6 hand-authored 2026-10-17). They are a **content/design reference, not deploy-ready files** — nothing is on WordPress, all carry the dead `kommercialconnect.ca` canonical + wrong brand, and all have the demo-stub forms.

Each built page already includes: hero + stat band, AI-citable definition, decision framework, 2026 rate/LTV tables, lender directory, anonymised case studies, numbered process, 5–8-Q `FAQPage` schema, lead form, cross-links. **This is strong raw material** — the gap is compliance clearance + technical re-platform, not content creation.

**5 footer routes are linked but don't exist** (404 on deploy): `/`, `/about/`, `/compliance/`, `/contact/`, `/broker-resources/`. `/compliance/` is **mandatory** (YMYL) — build it.

---

## 5. On-page, technical & schema requirements

**Per-page (site-plan §4):** title keyword-first ≤60c + brand suffix; description 140–160c, one concrete differentiator, no duplication; exactly one H1 with primary KW; 1,500–2,500 words for Tier 1 (depth, not padding); every page links to 3+ siblings with descriptive anchors.

**Fix on `/business-financing` specifically (live audit):** title says "Directory" but page is a guide+form (intent mismatch → retitle); meta description is ~185c (truncates mid-CTA → cut to ~135c); H1 omits the target keyword.

**Schema (JSON-LD, inject into shipped `<head>`):** `Organization`/`FinancialService` + `BreadcrumbList` + `Article` + `FAQPage` on money pages; `ItemList` + `LocalBusiness` on directory pages. **One source of truth per property** — template-generated from content fields, never hand-written per page, and FAQ schema must stay in parity with visible text (drift risks a manual action). ⚠️ WordPress re-platform risk: themes/SEO plugins emit their own schema → duplicates. Disable plugin auto-schema.

**Technical:** absolute self-referencing canonicals on every page; 301 map for the 6 legacy `/financing/*` + `/brokers/*` paths (no chains, no redirect-to-home); CWV targets LCP<2.5s / INP<200ms / CLS<0.1 (WordPress plugin risk); auto XML sitemap + robots.txt; **no hreflang** (single-locale BC).

---

## 6. GEO layer — the higher-leverage half (site-plan §5)

**The wedge:** answer engines are *demonstrably wrong* about BC commercial mortgage (verified vs CMHC 2026-10-22): they say "3+ units / 5.25% / apply through a lender"; CMHC actually requires "≥5 units / ≥$1M loan / publishes no rate / takes the application directly." **Nobody publishes this correctly.** Also: 9 of 10 broader commercial-mortgage queries now return an AI Overview at #1 — being *cited* beats ranking #1.

GEO deliverables: (1) `/llms.txt` at root naming authoritative pages + entity + source policy; (2) **answer-first structure** — each money page opens with a 40–60-word direct answer before marketing; (3) **sourced-facts pattern** — every claim carries source + date inline (*"Minimum loan size $1,000,000 — CMHC, 2024-11-06"*), which is simultaneously the GEO tactic **and** the compliance answer; (4) "last verified" stamps on rates/terms; (5) stable URLs; (6) entity consistency across site + LinkedIn + registries.

---

## 7. Content requirements (audience, trust, constraints)

Source: `_config/project-context.md` §3–7, PRD, R03/R04. CommercialKonnect is the **SEO/lead-gen surface**; KonstructionComOS is the platform it feeds.

**Audience — #1 buyer is commercial mortgage / development-finance brokers**, then GCs/subs, developers/land teams, architects/engineers, private lenders. High-sophistication (they search specific loan types, not "what is X"); BC/Metro Vancouver; English (fr-CA pending). Content must serve two intents: borrowers seeking financing **and** brokers/developers (recruitment + platform subscription).

**Three lead paths, every page maps to one:** A) direct loan application → `/aclp-cmhc/` etc.; B) broker partnership → `/commercial-mortgage-broker/`; C) developer/GC subscription → construction pages.

**Trust / E-E-A-T [MUST] — current pages have ZERO (live audit):** no broker name, no credentials, no BCFSA licence number, no address, no phone. On a YMYL page this is the single biggest content gap. Required: named author + reviewer with credentials on every money page; real business identity (the **licensed OpCo** legal name, not the brand); visible `/compliance/` page; clear "how we're paid" disclosure (86 fee references exist with no payment-model disclosure — R03 C3).

**Content constraints [BLOCKED / MUST]:**
- [BLOCKED] No "matching / we'll introduce you to lenders" language until B1 resolved (R03 §2).
- [BLOCKED] No lender-registration claims until each is BCFSA-verified (B2).
- [BLOCKED] No lender/funding-source positioning until the `lending` category is in force (B3).
- [MUST] 42 rate figures frozen until sourced (R03 C4); `5.25%` deleted (R02).
- [MUST] CASL (consent + unsubscribe on auto-replies), PIPEDA (minimal data).
- [MUST] Provenance for any data-driven content: source URL, publisher, timestamp, licence, verification status, confidence. AI-generated content labeled. Demo/illustrative projects clearly labeled. Never conflate project evidence, inferred funding need, and confirmed client intent (BUILDDATA_INTEGRATION rule). **Do not mix demo records into live tables.**

---

## 8. Build order (compliance + technical gates applied)

- **Phase 0 — Unblock (no build).** Fix T1 (Lovable canonical), T4 (dead canonicals + brand string), T5 (forms), rewrite `/aclp-cmhc/` from verified CMHC facts. **Blocked on B1** for any matching language. Engage BC lawyer for B1/B2/B3.
- **Phase 1 — Platform foundation.** WordPress hosting + editor decision (open), staging subdomain, theme, money-page template, schema strategy, 301 map, T2 sitemap/robots.
- **Phase 2 — Tier 1 migration.** 5 pages, re-verify every claim at import, schema in parity, CWV passing, SSR/prerender (T3) confirmed via `curl` (content in raw HTML).
- **Phase 3 — GEO.** `/llms.txt`, answer-first rewrite, sourced-facts, freshness stamps, entity consistency.
- **Phase 4 — Queued pages + directory.** Directory **only after** BCFSA verification (B2).
- **Phase 5 — Measurement.** GSC + GA4; rank tracking; **citation-rate** tracking (monthly, 20 fixed AI prompts) — the GEO metric that matters.

---

## 9. Open decisions for Dennis (block downstream work)

1. **Legal entity:** OpCo legal name (closes B1 footer disclosure); HoldCo name + relationship; is 144231 the brokerage or individual licence?
2. **Compliance route** A / B / C (R04 §5) — recommend **A (broker-first)**.
3. **Hosting + editor** for WordPress (managed host recommended).
4. **Promote `/commercial-mortgage/` to Tier 1?** It holds `commercial mortgage rates` (720/mo), highest commercial intent.
5. **Compensation model** (drives which lead path is primary) and broker SLA.
6. `.com` defensive redirect (`commercialkonnect.com` is parked).

---

**Top 5, in order:** (1) engage BC lawyer on B1/B2/B3 — nothing publishes without it; (2) fix the Lovable canonical + wrong-domain sitemap (T1/T2) — blocks all indexing; (3) decide WordPress hosting + SSR so crawlers see content (T3); (4) wire the lead forms (T5) — no conversion without them; (5) ship Tier 1 with named-broker E-E-A-T + sourced-facts GEO once the gates clear.
