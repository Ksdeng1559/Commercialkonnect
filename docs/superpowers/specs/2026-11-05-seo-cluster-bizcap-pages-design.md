# SEO Cluster Pages + BizCap Featured Product — Design

**Version:** 1.0 | **Date:** 2026-11-05 | **Status:** Design (requirements), NOT cleared to publish

## Context
The Astro site (`web/`) has a home, six niche money pages, and an `/apply` funnel. This spec designs
the next content layer: SEO cluster pages driven by the OpenSEO keyword research, plus a **featured
product** — BizCap fast business funding / business line of credit — as the site's headline offer.

Inputs read: `docs/SEO_PLAN.md`, `docs/OPENSEO_LINKAGE.md` (clusters A–G), `docs/FLOW_CONTENT_PIPELINE.md`,
and BizCap's own scraped copy (`openseo-project/research/scraping/sites/bizcapfunding.ca`).

## HARD GATE — publication blocked
`SEO_PLAN.md §1` holds three open legal blockers (BC mortgage lawyer required):
- **B1** — "match / connect you with a lender" is a licensable dealing activity.
- **B2** — no "BCFSA-registered" lender claims without per-lender verification.
- **B3** — no lender/funding-source positioning (`lending` category not in force).

So: this is a **requirements/design spec only**. Any pages built from it ship **noindex / unpublished
drafts** until a lawyer clears B1–B3. Featuring BizCap does not change this; it adds B2 exposure.

## Featured product: BizCap (adapted, not copied)
BizCap's live copy leads with speed and approval promises ("Apply Now", "secure $50,000 in 24 hours",
"$10K–$2M"). CommercialKonnect **cannot repeat** those — they are approval/speed guarantees (frozen
per `SEO_PLAN §1`, R03 C4) and matching language (B1). Adaptation rules:

- Position BizCap as **one funding option CommercialKonnect can introduce you to**, not as our product
  and not as guaranteed.
- Carry provenance per `FLOW_CONTENT_PIPELINE §3`: `Source: bizcapfunding.ca · Observed: 2026-11-05 ·
  Status: Unverified — pending analyst review`. Never drop the Status line.
- Allowed, attributed framing: short-term business funding, revenue-based financing, line of capital,
  bridging finance; typical range stated as the lender's own published figure, dated, not promised.
- No "24 hours", no "approved", no rate figure, until sourced + legally cleared.
- Disclose the relationship and how CommercialKonnect is paid (referral/partner) — `SEO_PLAN §7`, R03 C3.

Placement: home hero gains a featured-offer band ("Fast business funding and lines of credit for BC
businesses — explore your options"), and a dedicated **`/business-funding/`** hub elevates the BizCap
option alongside the existing `/business-line-of-credit/` niche page.

## Information architecture (pillars + spokes)
Reconcile clusters with the existing six niche pages; collapse overlaps to one canonical page to avoid
cannibalization (`SEO_PLAN §3`).

| New page | Cluster | Primary KW (vol, KD) | Surface | Relation to existing |
|---|---|---|---|---|
| `/business-funding/` **(featured hub)** | — | business funding (brand) | organic + AI | new; features BizCap; links to LOC niche |
| `/private-lender/` **(pillar)** + `/private-lender-bc/` | A | private lender (1000, 0) / bc (210,0) | AI answer + organic | new; highest CPC + highest B1/B2 risk |
| `/commercial-mortgage-broker/` **(pillar)** | B | commercial mortgage broker (590,0) | organic | new; broker-intent, not lender marketing |
| `/bridge-financing/` (+ mezzanine H2) | D | bridge financing (1000,0) | organic + AI | new |
| `/aclp-cmhc/` (CMHC MLI Select H2) | F | aclp cmhc (320,1) | organic + AI | new; verified CMHC facts only |
| existing `/commercial-mortgages/` | C | commercial mortgage (880,9) | organic + AI | fold `commercial mortgage rates` as H2 |
| existing `/construction-financing/` + geo spokes | E, G | construction mortgage bc (70,0) + empty-SERP geo | organic + local | add Vancouver/BC spokes |

Ship order follows `SEO_PLAN §3` Tier 1 (84% of volume): private-lender, bridge-financing,
commercial-mortgage-broker, aclp-cmhc, construction-mortgage-bc — plus the BizCap `/business-funding/`
hub as the featured commercial anchor.

## Per-page requirements (from SEO_PLAN §5–7 + FLOW §4)
- **Answer-first:** 40–60 word direct answer before any marketing (GEO).
- **Sourced-facts:** every number carries inline source + date; unsourced numbers removed.
- **One H1** with primary KW; title keyword-first ≤60c + brand; description 140–160c; 1,500–2,500 words
  for Tier 1; 3+ descriptive internal links per page.
- **Schema (shipped `<head>`):** `FinancialService` + `BreadcrumbList` + `Article` + `FAQPage`;
  `ItemList`/`LocalBusiness` on any directory/lender listing. Template-generated, parity with visible
  text. (Our Astro `Base.astro` + `[slug].astro` already emit these — extend, don't duplicate.)
- **E-E-A-T [MUST]:** named author/reviewer with credentials, licensed OpCo legal name, BCFSA licence,
  address, phone, visible `/compliance/`, "how we're paid" disclosure. Current pages have none.
- **GEO:** answer-first, sourced-facts, "last verified" stamps, stable URLs, `/llms.txt`.
- **Conversion:** one deal-intake action per page → `/apply` (already built). No approval, no guarantee.

## Compliance constraints (carried, non-negotiable)
- No matching/introduction language live until B1 cleared — including the copy already on the built
  home and money pages. Flag: existing pages use "connect you with a financing professional" and need
  the same legal review before go-live.
- No "BCFSA-registered" lender claim without per-lender verification (B2) — applies to BizCap.
- No funding-source/lender positioning (B3).
- Frozen rate figures; `5.25%` deleted. CASL + PIPEDA on all capture. Attribution + Status on every
  lender fact. Demo/illustrative labelled. Never conflate evidence, inferred need, confirmed intent.

## Data sources
- Keyword clusters + volumes: already captured in `OPENSEO_LINKAGE.md`; live refresh via OpenSEO MCP
  (`7f4bbe03-...`) is WSL-only from this Windows host.
- BizCap copy: `openseo-project/.../bizcapfunding.ca` (scraped, unverified, dated).
- Lender evidence for directory clusters: `data/scraped/lenders.json` (unverified until registry-checked).

## Build order (gated)
0. Legal: engage BC lawyer on B1/B2/B3 + confirm BizCap relationship — blocks publish.
1. Scaffold cluster pages as **noindex drafts** reusing `Base.astro` + a cluster data model like
   `niches.ts` (pillar/spoke fields, sources, status).
2. BizCap `/business-funding/` featured hub with adapted, attributed copy.
3. Tier-1 pillars + spokes with answer-first + sourced-facts + FAQ schema + E-E-A-T.
4. Flip noindex → index only after B1–B3 clear and `/compliance/` + named-broker E-E-A-T are live.

## Open questions
1. **BizCap relationship** — referral partner, affiliate, or just a featured lender? Determines whether
   featuring it is lawful under B1 and what the "how we're paid" disclosure says. Blocks the hub.
2. Legal route A/B/C (recommend A, broker-first) — gates all matching language.
3. Licensed OpCo legal name for E-E-A-T + footer (closes B1 disclosure).
4. Keep the six niche pages as-is, or merge the overlapping ones (LOC, commercial-mortgages,
   construction) into the new pillar/spoke structure to avoid cannibalization?
5. Promote `/commercial-mortgage/` (holds `commercial mortgage rates`, 720/mo) to Tier 1?

---
> **Provenance:** 2026-11-05. Builds on `2026-11-05-business-funding-lead-engine-design.md`,
> `SEO_PLAN.md`, `OPENSEO_LINKAGE.md`, `FLOW_CONTENT_PIPELINE.md`, and scraped BizCap copy
> (unverified). Supersedes nothing; extends the lead-engine site with its content layer.
