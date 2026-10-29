# KommercialConnect — Build Plan & Research Backlog

**Compiled:** 2026-10-24 · **Canonical source:** `research/keyword-strategy-v2-2026-10-21.md (59-kw live OpenSEO pull, 2026-10-21)`
**Generator:** `research/_compile_build_plan.py` (re-run after any keyword or page change)

**Domain:** https://commercialkonnect.ca (canonical domain, confirmed by client)

## At a glance

| Metric | Value |
|---|---|
| Keywords mapped | **257** (177 quantified + 80 no-Labs-data) |
| Unresolved / orphans | **0** — every keyword has a destination |
| Total addressable volume | **23,730 vol/mo** |
| Already built (Tier 1) | **12,380 vol/mo** (52% of addressable) |
| Pages | 5 built · 11 queued · 16 total |
| Research tasks | 18 (see §5) |

## ⚠️ Provenance — the 267-keyword set is rejected as a build driver

The 2026-10-17 file `research/openseo-project-file-2026-10-17.json` holds **267** deduped keywords, but
**122 of them (45.7%) are off-topic** for a B2B BC commercial-mortgage
marketplace — they bleed in from unrelated finance clusters. Per the OpenSEO project-file rule
(*don't push a contaminated dedup just because it's a bigger number*), it is retained for
provenance only and **must not** drive page builds. Off-topic clusters:

- `BFC: Commercial Intent`
- `Line of Credit`
- `Unsecured`
- `Term Length`
- `Working Capital / Cash Flow`
- `MCA / Factoring`
- `Inventory / Supplier`
- `Refinance / Consolidation`
- `Tariff Trigger (separate cluster — spike/news-anchored)`
- `Growth / Expansion`

> REJECTED as a build driver — 45% off-topic. Retained for provenance only.

The canonical set is the **2026-10-21 live OpenSEO pull** (58 terms), which is BC/marketplace-scoped.

## 1. Pages — build status

### ✅ Built (2026-10-22)

| Slug | Primary KW | Vol/mo | Sections | Merges in | Long-tail H2s |
|---|---|---:|---:|---:|---:|
| `/private-lender/` | `private lender` | 1,000 | 8 | `financing/private-lender-bc.html` | 2 |
| `/commercial-mortgage-broker/` | `commercial mortgage broker` | 590 | 6 | `brokers/commercial-mortgage-broker-vancouver.html` | 2 |
| `/bridge-financing/` | `bridge financing` | 1,000 | 7 | — | 3 |
| `/aclp-cmhc/` | `aclp cmhc` | 320 | 7 | `financing/apartment-construction-loan-program-bc.html` | 4 |
| `/construction-mortgage-bc/` | `construction mortgage bc` | 70 | 7 | `financing/commercial-construction-financing-vancouver.html` | 18 |

**`/private-lender/`** — private lender  ·  PILLAR

- Sections: definition · decision tree · 24+ BC private lender directory · rate table 8-15% · 6 case studies · FAQ x8 · form · BCFSA disclosure
- Secondary KWs: `private lender bc`, `private lender vancouver`, `private lender canada`
- Long-tail H2 coverage (2): private lender bc, private lender vancouver
- Merges in / supersedes: `financing/private-lender-bc.html` — needs a 301 (see R06)
- Internal links →: /commercial-mortgage-broker/, /bridge-financing/, /aclp-cmhc/, /construction-mortgage-bc/

**`/commercial-mortgage-broker/`** — commercial mortgage broker  ·  PILLAR

- Sections: definition · decision tree · broker fee table · BCFSA/Mortgage Services Act registration · FAQ x8 · form
- Secondary KWs: `commercial mortgage`, `commercial mortgage broker vancouver`, `commercial mortgage broker canada`, `commercial mortgage canada`, `commercial mortgage broker bc`
- Long-tail H2 coverage (2): commercial mortgage broker vancouver, commercial mortgage broker canada
- Merges in / supersedes: `brokers/commercial-mortgage-broker-vancouver.html` — needs a 301 (see R06)
- Internal links →: /private-lender/, /aclp-cmhc/

**`/bridge-financing/`** — bridge financing

- Sections: definition · bridge vs construction decision tree · 9-18 month duration · exit options · extension risk · FAQ x8 · form
- Secondary KWs: `bridge loan`, `bridge loan bc`, `bridge loan commercial`, `bridge loan vancouver`
- Long-tail H2 coverage (3): bridge loan bc, bridge loan commercial, bridge loan vancouver
- Internal links →: /private-lender/, /construction-mortgage-bc/

**`/aclp-cmhc/`** — aclp cmhc

- Sections: definition · CMHC ACLP explained · eligibility · approved-lender process · ~5.25% vs 12-15% cost gap · FAQ x8 · form
- Secondary KWs: `cmhc aclp`, `apartment construction loan program`, `cmhc apartment construction loan program`, `cmhc mli select`
- Long-tail H2 coverage (4): cmhc apartment construction loan program, apartment construction loan program bc, cmhc apartment construction loan, cmhc rental construction financing initiative
- Merges in / supersedes: `financing/apartment-construction-loan-program-bc.html` — needs a 301 (see R06)
- Retargets: financing/apartment-construction-loan-program-bc.html (210/mo KD16 -> 320/mo KD1)
- Internal links →: /construction-mortgage-bc/, /private-lender/

**`/construction-mortgage-bc/`** — construction mortgage bc

- Sections: definition · progress draws · 5-facility BC rate/LTV table · cost-to-complete · construction-to-permanent · FAQ x8 · form
- Secondary KWs: `construction to permanent financing`, `construction loan bc`, `construction financing bc`, `commercial construction loan`, `commercial construction financing`
- Long-tail H2 coverage (18): construction loan bc, construction financing bc, construction to permanent financing, commercial construction loan vancouver, construction financing canada, construction loan canada, cmhc construction financing, apartment construction loan, multifamily construction loans, multifamily loan, construction financing vancouver, development financing vancouver, multifamily construction loans vancouver, multifamily construction loan vancouver, commercial construction financing vancouver, construction loan vancouver, purpose built rental construction financing loans, apartment construction loan vancouver
- Merges in / supersedes: `financing/commercial-construction-financing-vancouver.html` — needs a 301 (see R06)
- Internal links →: /aclp-cmhc/, /bridge-financing/

### ⏳ Queued — not yet built

| Slug | Primary KW | Vol/mo | Sections | Merges in | Long-tail H2s |
|---|---|---:|---:|---:|---:|
| `/commercial-mortgage/` | `commercial mortgage rates` | 720 | 5 | — | 2 |
| `/cmhc-mli-select/` | `cmhc mli select` | — | 5 | — | 1 |
| `/purpose-built-rental-vancouver/` | `purpose built rental vancouver` | 110 | 5 | `financing/vancouver-purpose-built-rental-loan.html` | 5 |
| `/mezzanine-financing/` | `mezzanine financing` | 320 | 4 | — | 1 |
| `/vancouver-land-assembly/` | `vancouver land assembly` | 50 | 4 | — | 1 |
| `/tools/commercial-loan-calculator/` | `commercial mortgage calculator` | 1,300 | 9 | — | 8 |
| `/tools/bridge-loan-calculator/` | `bridge loan calculator` | — | 8 | — | 3 |
| `/compare/financing-options/` | `commercial financing options comparison` | — | 8 | — | 9 |
| `/commercial-mortgage-rates/` | `commercial mortgage rates canada` | — | 9 | — | 11 |
| `/vancouver-commercial-real-estate-market/` | `vancouver commercial real estate market` | — | 9 | — | 6 |
| `/become-a-lender/` | `how to become a private lender in canada` | 20 | 9 | — | 7 |

**`/commercial-mortgage/`** — commercial mortgage rates  ·  PILLAR

- Sections: definition · rate table by asset class · decision tree lender selection · FAQ x8 · form
- Secondary KWs: `commercial mortgage`, `commercial mortgage bc`, `commercial mortgage vancouver`
- Long-tail H2 coverage (2): commercial mortgage rates, commercial mortgage bc
- Internal links →: /commercial-mortgage-broker/, /private-lender/

**`/cmhc-mli-select/`** — cmhc mli select

- Sections: definition · MLI Select vs Select for Sales · eligibility · rate advantage · FAQ x8
- Long-tail H2 coverage (1): cmhc mli select
- Internal links →: /aclp-cmhc/

**`/purpose-built-rental-vancouver/`** — purpose built rental vancouver

- Sections: definition · Vancouver PBR demand data · CMHC RCF eligibility · FAQ x8 · form
- Secondary KWs: `rental construction financing initiative`, `cmhc purpose built rental`
- Long-tail H2 coverage (5): vancouver purpose built rental financing, vancouver purpose built rental loan, purpose built rental construction financing, rental construction financing initiative, cmhc purpose built rental
- Merges in / supersedes: `financing/vancouver-purpose-built-rental-loan.html` — needs a 301 (see R06)
- Internal links →: /aclp-cmhc/, /construction-mortgage-bc/

**`/mezzanine-financing/`** — mezzanine financing

- Sections: definition · mezz vs bridge vs private · stack position · FAQ x8
- Secondary KWs: `mezzanine financing vancouver`
- Long-tail H2 coverage (1): mezzanine financing vancouver
- Internal links →: /bridge-financing/, /private-lender/

**`/vancouver-land-assembly/`** — vancouver land assembly

- Sections: definition · site acquisition strategy · assembly financing · FAQ x8
- Long-tail H2 coverage (1): vancouver land assembly
- Internal links →: /private-lender/

**`/tools/commercial-loan-calculator/`** — commercial mortgage calculator

- Sections: what it calculates (principal + interest + amortization) · input assumptions (rate, term, LTV, fees) · interactive calculator (client-side, no lead gate) · downloadable spreadsheet version · worked BC examples: $500k / $1M / $2.5M · rate-source table with as-of date · FAQ x8 · form · C1/C5 disclosure
- Secondary KWs: `commercial real estate loan calculator`, `commercial mortgage calculator canada`, `commercial loan payment calculator`, `monthly commercial mortgage calculator`, `simple commercial loan calculator`, `bridge loan calculator`, `commercial mortgage calculator excel`, `construction mortgage calculator`
- Long-tail H2 coverage (8): commercial mortgage calculator excel, simple commercial mortgage calculator, 25 year commercial mortgage calculator, 30 year commercial mortgage calculator, 20 year commercial mortgage calculator, 15 year commercial mortgage calculator, construction loan interest rates calculator, current commercial loan rates calculator
- Internal links →: /commercial-mortgage/, /construction-mortgage-bc/, /bridge-financing/, /commercial-mortgage-rates/

**`/tools/bridge-loan-calculator/`** — bridge loan calculator

- Sections: what it calculates (interest-only period + takeout) · monthly interest-only payment + extension cost · interactive calculator · bridge cost-of-capital comparison vs construction/permanent · rate-source table with as-of date · FAQ x6 · form · C1/C5 disclosure
- Secondary KWs: `bridge financing calculator`, `bridge loan calculator canada`, `bridge financing calculator canada`, `bridge financing canada calculator`, `bridge loan canada calculator`
- Long-tail H2 coverage (3): bridge loan interest rate calculator, bridge loan fees calculator, bridge loan extension cost calculator
- Internal links →: /bridge-financing/, /compare/financing-options/, /tools/commercial-loan-calculator/

**`/compare/financing-options/`** — commercial financing options comparison

- Sections: master comparison table (9 options x 8 attributes) · when each option fits (decision tree) · cost-of-capital comparison · speed-to-close comparison · recourse and recourse-free comparison · comparison FAQ x10 · form · C1/C5 disclosure
- Long-tail H2 coverage (9): bridge loan vs construction loan, private lender vs bank, private lender vs cmhc, bridge loan vs private lender, commercial mortgage vs residential mortgage, commercial mortgage broker vs lender, mezzanine financing vs preferred equity, mezzanine financing vs convertible bond, alternatives to bridge financing canada
- Internal links →: /bridge-financing/, /private-lender/, /aclp-cmhc/, /mezzanine-financing/, /commercial-mortgage-broker/

**`/commercial-mortgage-rates/`** — commercial mortgage rates canada

- Sections: as-of date + methodology on every rate block · rates by asset class (office / retail / industrial / multifamily / land) · construction financing rates · bridge and mezzanine rates · CMHC indicative rates (source + date) · rate history chart (original data) · FAQ x10 · form · C1/C5 disclosure
- Secondary KWs: `current commercial mortgage rates canada`, `5 year commercial mortgage rates canada`, `best commercial mortgage rates canada`, `commercial lending rates canada`, `construction mortgage rates`, `construction mortgage rates canada`, `construction mortgage rates bc`, `best construction mortgage rates canada`, `cmhc indicative 10-year fixed rate`, `cmhc indicative rate`, `cmhc rental construction financing rates`
- Long-tail H2 coverage (11): commercial mortgage rates canada, current commercial mortgage rates canada, bridge loan rates canada, bridge financing interest rates, private lender mortgage rates canada, mezzanine financing rates, construction loan rates canada, cmhc indicative rate, cmhc mli select interest rate, cmhc interest rates, bridge loan interest rates
- Internal links →: /commercial-mortgage/, /construction-mortgage-bc/, /bridge-financing/, /mezzanine-financing/, /tools/commercial-loan-calculator/

**`/vancouver-commercial-real-estate-market/`** — vancouver commercial real estate market

- Sections: annual market report (original data, dated) · vacancy + absorption by asset class · cap rate trends · transaction volume · what this means for financing (the broker's actual point of view) · methodology + data sources · FAQ x8 · form · C5 disclosure
- Secondary KWs: `bc commercial mortgage rates 2026`
- Long-tail H2 coverage (6): vancouver commercial real estate market, vancouver commercial property market report, vancouver office vacancy rate, vancouver industrial vacancy rate, vancouver retail vacancy rate, vancouver multifamily vacancy rate
- Internal links →: /commercial-mortgage/, /commercial-mortgage-rates/, /construction-mortgage-bc/, /vancouver-land-assembly/

**`/become-a-lender/`** — how to become a private lender in canada

- Sections: regulatory framework (A-lender / B-lender / private lender — what each is) · licensing: who needs what, and when · the MSA s.5 payment rule and the ss.39-40 exemption · economics of private lending (sourced, dated) · CommercialKonnect's role: we connect borrowers to lenders — we do not lend · how to work with a commercial mortgage broker · FAQ x10 · form · C1/C8 disclosure
- Secondary KWs: `do you need a license to be a private lender`, `how to become a lender in canada`, `is private lending profitable`, `how much do private lenders make`, `who are b lenders in canada`, `list of a and b lenders in canada`
- Long-tail H2 coverage (7): how to become a private lender in canada, do you need a license to be a private lender, who are b lenders in canada, list of a and b lenders in canada, is private lending profitable, how much do private lenders make, how to become a lender in canada
- Internal links →: /private-lender/, /commercial-mortgage-broker/, /compare/financing-options/

## 2. Rejected keywords — documented, not silently dropped

| Keyword | Vol/mo | KD | CPC | Why dropped |
|---|---:|---:|---:|---|
| `bc loans` | 1,300 | 6 | $9.01 | SERP-verified 100% student-loan intent despite 1,300/mo at $9.01 CPC. Wrong audience. |
| `opco` | 320 | 3 | $14.08 | SERP intent mismatch, verified live BC 2026-10-23 + re-verified 2026-10-24. Top 3 of 5 slots are FRENCH 'OPCO' = operateurs de competences (vocational-training funding bodies) + a pitchbook.com company profile. 'OP' also resolves to OP Mortgage Bank plc (Finland). Cannot compete. NOT a difficulty argument — KD is only 3. The rejection is INTENT: OpenSEO classifies both head terms as NAVIGATIONAL (searchers want a specific named entity, not financing research). _(vol: vol/kd/cpc hydrated via OpenSEO 2026-10-24; intent=navigational)_ — source: `research/r15-opco-holdco-keyword-feasibility-2026-10-23.md` |
| `vancouver commercial property for sale` | 480 | 8 | $1.15 | Brokerage/listing intent, not financing. Wrong funnel — no lead to match. |
| `construction business loan` | 70 | 13 | $7.36 | Working-capital intent (equipment/inventory), not construction finance. Lowest CPC in cluster. |
| `holdco` | 320 | 10 | — | SERP intent mismatch, verified live BC 2026-10-23 + re-verified 2026-10-24. All results are holding-company explainers from accountants/tax/wealth firms (avalonaccounting, LexisNexis, Legacy Wealth). Corporate-formation audience, zero financing intent. Intent classified NAVIGATIONAL by OpenSEO. _(vol: vol/kd hydrated via OpenSEO 2026-10-24; intent=navigational)_ — source: `research/r15-opco-holdco-keyword-feasibility-2026-10-23.md` |
| `opco mortgage` | — | — | — | Resolves to OP Mortgage Bank plc (Finnish issuer, Nasdaq Helsinki) and UK banks. Not Operating Company. Abbreviation collision is permanent. _(vol: no Labs record — term is not in the index (verified via OpenSEO 2026-10-24))_ — source: `research/r15-opco-holdco-keyword-feasibility-2026-10-23.md` |
| `holdco mortgage` | — | — | — | Reddit/Facebook threads on buying property through a holding company. Zero commercial-brokerage intent. _(vol: no Labs record — term is not in the index (verified via OpenSEO 2026-10-24))_ — source: `research/r15-opco-holdco-keyword-feasibility-2026-10-23.md` |
| `opco mortgage canada` | — | — | — | ZERO results. The qualified phrase has no search demand; the unqualified phrase has the wrong meaning. No viable middle. _(vol: no Labs record — term is not in the index (verified via OpenSEO 2026-10-24))_ — source: `research/r15-opco-holdco-keyword-feasibility-2026-10-23.md` |
| `opco loan bc` | — | — | — | Residential CPL student-loan and social-housing content (gov.bc.ca, CBC, UBC). Same contamination pattern that made 122/267 of the 2026-10-17 file unusable. _(vol: no Labs record — term is not in the index (verified via OpenSEO 2026-10-24))_ — source: `research/r15-opco-holdco-keyword-feasibility-2026-10-23.md` |
| `private mortgage lenders ontario` | 390 | 5 | $17.24 | Verified off-market during the 2026-10-24 PAA/expansion harvest. Ontario geo — wrong jurisdiction _(vol: hydrated via OpenSEO get_keyword_metrics 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/paa-aeo-harvest-2026-10-24.json` |
| `private lending ontario` | 880 | 0 | $12.31 | Verified off-market during the 2026-10-24 PAA/expansion harvest. Ontario geo — wrong jurisdiction _(vol: hydrated via OpenSEO get_keyword_metrics 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/paa-aeo-harvest-2026-10-24.json` |
| `private lenders in ontario` | 720 | 0 | $14.75 | Verified off-market during the 2026-10-24 PAA/expansion harvest. Ontario geo — wrong jurisdiction _(vol: hydrated via OpenSEO get_keyword_metrics 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/paa-aeo-harvest-2026-10-24.json` |
| `private mortgage lenders toronto` | 140 | 4 | $15.49 | Verified off-market during the 2026-10-24 PAA/expansion harvest. Ontario geo — wrong jurisdiction _(vol: hydrated via OpenSEO get_keyword_metrics 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/paa-aeo-harvest-2026-10-24.json` |
| `private lenders toronto` | 170 | 0 | $14.66 | Verified off-market during the 2026-10-24 PAA/expansion harvest. Ontario geo — wrong jurisdiction _(vol: hydrated via OpenSEO get_keyword_metrics 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/paa-aeo-harvest-2026-10-24.json` |
| `commercial mortgage rates ontario` | 260 | 9 | $5.09 | Verified off-market during the 2026-10-24 PAA/expansion harvest. Ontario geo — wrong jurisdiction _(vol: hydrated via OpenSEO get_keyword_metrics 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/paa-aeo-harvest-2026-10-24.json` |
| `direct private lenders for personal loans canada` | 320 | 21 | $3.96 | Personal-loan product intent, not commercial real estate. Wrong product. _(vol: hydrated via OpenSEO research_keywords related expansion 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/aeo-geo-serp-bc-2026-10-24.json` |
| `construction mortgage ontario` | 170 | 0 | $11.47 | Verified off-market during the 2026-10-24 PAA/expansion harvest. Ontario geo — wrong jurisdiction _(vol: hydrated via OpenSEO get_keyword_metrics 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/paa-aeo-harvest-2026-10-24.json` |
| `private lenders alberta` | 90 | 0 | $20.08 | Alberta geo. Wrong province. _(vol: hydrated via OpenSEO research_keywords related expansion 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/aeo-geo-serp-bc-2026-10-24.json` |
| `construction loan ontario` | 210 | 0 | $8.10 | Verified off-market during the 2026-10-24 PAA/expansion harvest. Ontario geo — wrong jurisdiction _(vol: hydrated via OpenSEO get_keyword_metrics 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/paa-aeo-harvest-2026-10-24.json` |
| `commercial mortgage ontario` | 140 | 10 | $6.69 | Verified off-market during the 2026-10-24 PAA/expansion harvest. Ontario geo — wrong jurisdiction _(vol: hydrated via OpenSEO get_keyword_metrics 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/paa-aeo-harvest-2026-10-24.json` |
| `list of b lenders in ontario` | 70 | 0 | $8.01 | Verified off-market during the 2026-10-24 PAA/expansion harvest. Ontario-specific list; superseded by the Canada-wide term _(vol: hydrated via OpenSEO get_keyword_metrics 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/paa-aeo-harvest-2026-10-24.json` |
| `commercial mortgage broker toronto` | 20 | 44 | $17.05 | Toronto geo. Wrong city — a BC site competing for Toronto broker intent has no path. _(vol: hydrated via OpenSEO research_keywords related expansion 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/aeo-geo-serp-bc-2026-10-24.json` |
| `commercial mortgage broker calgary` | 20 | 35 | $8.90 | Calgary geo. Wrong province. _(vol: hydrated via OpenSEO research_keywords related expansion 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/aeo-geo-serp-bc-2026-10-24.json` |
| `bdc commercial mortgage calculator` | 20 | — | $7.68 | Competitor brand navigational. Same reason as above. _(vol: hydrated via OpenSEO research_keywords related expansion 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/aeo-geo-serp-bc-2026-10-24.json` |
| `private lenders moncton` | 10 | — | $7.98 | New Brunswick geo. Wrong province. _(vol: hydrated via OpenSEO research_keywords related expansion 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/aeo-geo-serp-bc-2026-10-24.json` |
| `bdc commercial mortgage rates` | 40 | 35 | $1.39 | BDC is a named competitor with its own rate product. Ranking for a competitor's brand+product term is not winnable and is not a broker use case. _(vol: hydrated via OpenSEO research_keywords related expansion 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/aeo-geo-serp-bc-2026-10-24.json` |
| `commercial mortgage calculator alberta` | 20 | 50 | $3.54 | Alberta geo. Wrong province. _(vol: hydrated via OpenSEO research_keywords related expansion 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/aeo-geo-serp-bc-2026-10-24.json` |
| `bdc commercial real estate financing` | 10 | — | $1.22 | Competitor brand navigational. _(vol: hydrated via OpenSEO research_keywords related expansion 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/aeo-geo-serp-bc-2026-10-24.json` |
| `what is the $20,000 home grant in ohio` | — | — | — | Verified off-market during the 2026-10-24 PAA/expansion harvest. US-only program; zero Canadian relevance _(vol: no Labs record — term is not in the index (verified via OpenSEO 2026-10-24; cross-checked against the independent research_keywords related endpoint))_ — source: `research/paa-aeo-harvest-2026-10-24.json` |
| `what are fannie mae's current 5% down multifamily loan guidelines` | — | — | — | Verified off-market during the 2026-10-24 PAA/expansion harvest. US GSE; not applicable to BC _(vol: no Labs record — term is not in the index (verified via OpenSEO 2026-10-24; cross-checked against the independent research_keywords related endpoint))_ — source: `research/paa-aeo-harvest-2026-10-24.json` |
| `what does dave ramsey say about bridge loans` | — | — | — | Verified off-market during the 2026-10-24 PAA/expansion harvest. US personal-finance brand; wrong audience and jurisdiction _(vol: no Labs record — term is not in the index (verified via OpenSEO 2026-10-24; cross-checked against the independent research_keywords related endpoint))_ — source: `research/paa-aeo-harvest-2026-10-24.json` |
| `what is a 538 loan` | — | — | — | Verified off-market during the 2026-10-24 PAA/expansion harvest. US payday product; unrelated to commercial mortgage _(vol: no Labs record — term is not in the index (verified via OpenSEO 2026-10-24; cross-checked against the independent research_keywords related endpoint))_ — source: `research/paa-aeo-harvest-2026-10-24.json` |
| `how to become a private lender in ontario` | 30 | 0 | — | Verified off-market during the 2026-10-24 PAA/expansion harvest. Ontario-specific licensing; wrong jurisdiction for a BC site _(vol: hydrated via OpenSEO get_keyword_metrics 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/paa-aeo-harvest-2026-10-24.json` |
| `how to register a private mortgage in ontario` | 10 | — | — | Verified off-market during the 2026-10-24 PAA/expansion harvest. Ontario registry; wrong jurisdiction _(vol: hydrated via OpenSEO get_keyword_metrics 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/paa-aeo-harvest-2026-10-24.json` |
| `commercial mortgage calculator usa` | 10 | — | — | Explicit USA intent ('usa' in the query). US market, wrong jurisdiction — a BC site cannot serve it and should not attempt to. _(vol: hydrated via OpenSEO research_keywords related expansion 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/aeo-geo-serp-bc-2026-10-24.json` |
| `commercial mortgage td` | 40 | 9 | — | Bank-brand navigational query ('td' = TD Bank). Searchers want TD's own product, not a broker. _(vol: hydrated via OpenSEO research_keywords related expansion 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/aeo-geo-serp-bc-2026-10-24.json` |
| `private lenders for bad credit` | — | 45 | — | Consumer bad-credit intent. Wrong audience for a commercial brokerage. _(vol: hydrated via OpenSEO research_keywords related expansion 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/aeo-geo-serp-bc-2026-10-24.json` |
| `bridge loan in french` | 10 | — | — | French-language residential bridge financing. A BC commercial site is English-language; no French commercial demand is evidenced. _(vol: hydrated via OpenSEO research_keywords related expansion 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/aeo-geo-serp-bc-2026-10-24.json` |
| `bridge loan reddit` | 10 | — | — | Reddit-thread navigational intent, and residential. Not a page a broker should publish. _(vol: hydrated via OpenSEO research_keywords related expansion 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/aeo-geo-serp-bc-2026-10-24.json` |
| `bridge loan canada reddit` | — | — | — | Reddit-thread navigational intent. _(vol: hydrated via OpenSEO research_keywords related expansion 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/aeo-geo-serp-bc-2026-10-24.json` |
| `commercial mortgage rates canada 2022` | 0 | 22 | — | Stale-year query. Rate pages that reference a superseded year attract no current demand and dilute the topical set. _(vol: hydrated via OpenSEO research_keywords related expansion 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/aeo-geo-serp-bc-2026-10-24.json` |
| `best private lenders toronto` | 10 | 40 | — | Toronto geo. Wrong city. _(vol: hydrated via OpenSEO research_keywords related expansion 2026-10-24 (location_code=2124, Canada-wide))_ — source: `research/aeo-geo-serp-bc-2026-10-24.json` |

## 3. All 58 keywords → destination

Sorted by opportunity score `(vol × CPC / 10) × (100−KD)/100`. `role` = how the term is served.

| Keyword | Cluster | Vol/mo | KD | CPC | Opp | Role | Served by |
|---|---|---:|---:|---:|---:|---|---|
| `bc loans` | Mezzanine / other | 1,300 | 6 | $9.01 | 1,101 | rejected | `— dropped —` |
| `commercial mortgage` | Commercial mortgage | 880 | 9 | $11.53 | 923 | page-secondary | `/commercial-mortgage-broker/` |
| `bridge loan` | Bridge | 1,000 | 23 | $10.61 | 817 | page-secondary | `/bridge-financing/` |
| `private lender` | Private lender | 1,000 | 0 | $15.26 | 763 | page-primary | `/private-lender/` |
| `opco` | OpCo / HoldCo | 320 | 3 | $14.08 | 437 | rejected | `— dropped —` |
| `private lender canada` | Private lender | 590 | 46 | $12.10 | 386 | page-secondary | `/private-lender/` |
| `aclp cmhc` | CMHC / PBR / ACLP | 320 | 1 | $11.46 | 363 | page-primary | `/aclp-cmhc/` |
| `bridge financing` | Bridge | 1,000 | 0 | $6.98 | 349 | page-primary | `/bridge-financing/` |
| `commercial mortgage broker` | Commercial mortgage | 590 | 0 | $11.66 | 344 | page-primary | `/commercial-mortgage-broker/` |
| `commercial mortgage rates` | Commercial mortgage | 720 | 16 | $4.52 | 273 | page-primary | `/commercial-mortgage/` |
| `cmhc mli select` | CMHC / PBR / ACLP | 1,300 | 0 | $3.61 | 235 | page-secondary | `/aclp-cmhc/` |
| `mezzanine financing` | Mezzanine / other | 320 | 7 | $5.51 | 164 | page-primary | `/mezzanine-financing/` |
| `private lender bc` | Private lender | 210 | 0 | $15.60 | 164 | page-secondary | `/private-lender/` |
| `commercial mortgage canada` | Commercial mortgage | 140 | 3 | $10.51 | 143 | page-secondary | `/commercial-mortgage-broker/` |
| `apartment construction loan program` | CMHC / PBR / ACLP | 210 | 16 | $6.99 | 123 | page-secondary | `/aclp-cmhc/` |
| `commercial construction financing` | Construction / apartment / multifamily | 90 | 8 | $7.62 | 63 | page-secondary | `/construction-mortgage-bc/` |
| `commercial construction loan` | Construction / apartment / multifamily | 90 | 8 | $7.62 | 63 | page-secondary | `/construction-mortgage-bc/` |
| `construction financing canada` | Construction / apartment / multifamily | 110 | 1 | $4.86 | 53 | h2-longtail | `/construction-mortgage-bc/` |
| `vancouver commercial property for sale` | Mezzanine / other | 480 | 8 | $1.15 | 51 | rejected | `— dropped —` |
| `construction loan canada` | Construction / apartment / multifamily | 110 | 8 | $4.86 | 49 | h2-longtail | `/construction-mortgage-bc/` |
| `construction business loan` | Construction / apartment / multifamily | 70 | 13 | $7.36 | 45 | rejected | `— dropped —` |
| `cmhc construction financing` | Construction / apartment / multifamily | 70 | 35 | $8.43 | 38 | h2-longtail | `/construction-mortgage-bc/` |
| `construction mortgage bc` | Construction / apartment / multifamily | 70 | 0 | $9.02 | 32 | page-primary | `/construction-mortgage-bc/` |
| `construction financing bc` | Construction / apartment / multifamily | 50 | 9 | $6.42 | 29 | page-secondary | `/construction-mortgage-bc/` |
| `construction loan bc` | Construction / apartment / multifamily | 50 | 9 | $6.42 | 29 | page-secondary | `/construction-mortgage-bc/` |
| `cmhc apartment construction loan program` | CMHC / PBR / ACLP | 90 | 4 | $1.33 | 12 | page-secondary | `/aclp-cmhc/` |
| `purpose built rental vancouver` | CMHC / PBR / ACLP | 110 | 0 | $1.49 | 8 | page-primary | `/purpose-built-rental-vancouver/` |
| `commercial mortgage broker vancouver` | Commercial mortgage | 20 | — | $7.66 | 8 | page-secondary | `/commercial-mortgage-broker/` |
| `private lender vancouver` | Private lender | 50 | 0 | $2.56 | 6 | page-secondary | `/private-lender/` |
| `commercial mortgage broker bc` | Commercial mortgage broker | 10 | — | $5.26 | 3 | page-secondary | `/commercial-mortgage-broker/` |
| `commercial mortgage broker canada` | Commercial mortgage | 20 | — | $1.43 | 1 | page-secondary | `/commercial-mortgage-broker/` |
| `commercial mortgage vancouver` | Commercial mortgage | 10 | 38 | — | — | page-secondary | `/commercial-mortgage/` |
| `commercial mortgage bc` | Commercial mortgage | 10 | — | — | — | page-secondary | `/commercial-mortgage/` |
| `cmhc aclp` | CMHC / PBR / ACLP | 260 | 0 | — | — | page-secondary | `/aclp-cmhc/` |
| `cmhc purpose built rental` | CMHC / PBR / ACLP | 10 | — | — | — | page-secondary | `/purpose-built-rental-vancouver/` |
| `cmhc rental construction financing initiative` | CMHC / PBR / ACLP | 10 | — | — | — | h2-longtail | `/aclp-cmhc/` |
| `rental construction financing initiative` | CMHC / PBR / ACLP | 20 | 2 | — | — | page-secondary | `/purpose-built-rental-vancouver/` |
| `construction to permanent financing` | Construction / apartment / multifamily | 90 | 0 | — | — | page-secondary | `/construction-mortgage-bc/` |
| `apartment construction loan` | Construction / apartment / multifamily | 10 | — | — | — | h2-longtail | `/construction-mortgage-bc/` |
| `multifamily construction loans` | Construction / apartment / multifamily | 10 | — | — | — | h2-longtail | `/construction-mortgage-bc/` |
| `multifamily loan` | Construction / apartment / multifamily | 10 | — | — | — | h2-longtail | `/construction-mortgage-bc/` |
| `construction financing vancouver` | Construction / apartment / multifamily | 10 | — | — | — | h2-longtail | `/construction-mortgage-bc/` |
| `mezzanine financing vancouver` | Mezzanine / other | 10 | — | — | — | page-secondary | `/mezzanine-financing/` |
| `vancouver land assembly` | Mezzanine / other | 50 | 0 | — | — | page-primary | `/vancouver-land-assembly/` |
| `bridge loan commercial` | no-labs | — | — | — | — | page-secondary | `/bridge-financing/` |
| `apartment construction loan program bc` | no-labs | — | — | — | — | h2-longtail | `/aclp-cmhc/` |
| `cmhc apartment construction loan` | no-labs | — | — | — | — | h2-longtail | `/aclp-cmhc/` |
| `development financing vancouver` | no-labs | — | — | — | — | h2-longtail | `/construction-mortgage-bc/` |
| `multifamily construction loans vancouver` | no-labs | — | — | — | — | h2-longtail | `/construction-mortgage-bc/` |
| `bridge loan vancouver` | no-labs | — | — | — | — | page-secondary | `/bridge-financing/` |
| `bridge loan bc` | no-labs | — | — | — | — | page-secondary | `/bridge-financing/` |
| `commercial construction financing vancouver` | no-labs | — | — | — | — | h2-longtail | `/construction-mortgage-bc/` |
| `vancouver purpose built rental financing` | no-labs | — | — | — | — | h2-longtail | `/purpose-built-rental-vancouver/` |
| `commercial construction loan vancouver` | no-labs | — | — | — | — | h2-longtail | `/construction-mortgage-bc/` |
| `construction loan vancouver` | no-labs | — | — | — | — | h2-longtail | `/construction-mortgage-bc/` |
| `purpose built rental construction financing` | no-labs | — | — | — | — | h2-longtail | `/purpose-built-rental-vancouver/` |
| `purpose built rental construction financing loans` | no-labs | — | — | — | — | h2-longtail | `/construction-mortgage-bc/` |
| `apartment construction loan vancouver` | no-labs | — | — | — | — | h2-longtail | `/construction-mortgage-bc/` |
| `vancouver purpose built rental loan` | no-labs | — | — | — | — | h2-longtail | `/purpose-built-rental-vancouver/` |
| `multifamily construction loan vancouver` | no-labs | — | — | — | — | h2-longtail | `/construction-mortgage-bc/` |
| `holdco` | OpCo / HoldCo | 320 | 10 | — | — | rejected | `— dropped —` |
| `opco mortgage` | OpCo / HoldCo | — | — | — | — | rejected | `— dropped —` |
| `holdco mortgage` | OpCo / HoldCo | — | — | — | — | rejected | `— dropped —` |
| `opco mortgage canada` | OpCo / HoldCo | — | — | — | — | rejected | `— dropped —` |
| `opco loan bc` | OpCo / HoldCo | — | — | — | — | rejected | `— dropped —` |
| `private lenders canada` | GEO-ENTITY | 590 | 5 | $12.10 | 678 | page-secondary | `/private-lender/` |
| `private mortgage lenders ontario` | AEO-DEF | 390 | 5 | $17.24 | 639 | rejected | `— dropped —` |
| `private lending ontario` | AEO-DEF | 880 | 0 | $12.31 | 542 | rejected | `— dropped —` |
| `private lenders in ontario` | AEO-DEF | 720 | 0 | $14.75 | 531 | rejected | `— dropped —` |
| `private lending in canada` | GEO-ENTITY | 590 | 46 | $12.10 | 386 | h2-longtail | `/private-lender/` |
| `private loan lenders canada` | Private lender | 590 | 49 | $12.10 | 364 | h2-longtail | `/private-lender/` |
| `commercial mortgage calculator` | Commercial mortgage rates | 1,300 | 12 | $2.89 | 331 | page-primary | `/tools/commercial-loan-calculator/` |
| `private mortgage lenders rates` | GEO-ENTITY | 320 | 8 | $9.85 | 290 | h2-longtail | `/private-lender/` |
| `private mortgage lenders toronto` | AEO-DEF | 140 | 4 | $15.49 | 208 | rejected | `— dropped —` |
| `bridge loan canada` | Bridge financing | 260 | 0 | $12.96 | 168 | page-secondary | `/bridge-financing/` |
| `commercial lending rates canada` | Commercial mortgage rates | 110 | 9 | $13.15 | 132 | h2-longtail | `/commercial-mortgage-rates/` |
| `private mortgage lenders bc` | GEO-ENTITY | 170 | 0 | $15.43 | 131 | page-secondary | `/private-lender/` |
| `private lenders toronto` | AEO-DEF | 170 | 0 | $14.66 | 125 | rejected | `— dropped —` |
| `commercial mortgage rates ontario` | AEO-DEF | 260 | 9 | $5.09 | 120 | rejected | `— dropped —` |
| `direct private lenders for personal loans canada` | Private lender | 320 | 21 | $3.96 | 100 | rejected | `— dropped —` |
| `construction mortgage ontario` | AEO-DEF | 170 | 0 | $11.47 | 98 | rejected | `— dropped —` |
| `commercial real estate loan calculator` | AEO-TOOL | 320 | 13 | $3.35 | 93 | tool-page | `/tools/commercial-loan-calculator/` |
| `commercial mortgage rates canada` | Commercial mortgage rates | 260 | 16 | $4.17 | 91 | page-secondary | `/commercial-mortgage-rates/` |
| `private lenders alberta` | Private lender | 90 | 0 | $20.08 | 90 | rejected | `— dropped —` |
| `construction loan ontario` | AEO-DEF | 210 | 0 | $8.10 | 85 | rejected | `— dropped —` |
| `commercial mortgage ontario` | AEO-DEF | 140 | 10 | $6.69 | 84 | rejected | `— dropped —` |
| `what is cmhc insurance` | AEO-DEF | 390 | 26 | $2.18 | 63 | glossary-term | `/aclp-cmhc/` |
| `list of private lenders in canada` | Private lender | 90 | 4 | $7.19 | 62 | h2-longtail | `/private-lender/` |
| `cmhc approved lenders list` | GEO-ENTITY | 70 | 2 | $8.13 | 56 | h2-longtail | `/aclp-cmhc/` |
| `bridge financing calculator canada` | Bridge financing | 70 | 1 | $6.18 | 43 | page-secondary | `/tools/bridge-loan-calculator/` |
| `bridge financing canada calculator` | Bridge financing | 70 | 1 | $6.18 | 43 | page-secondary | `/tools/bridge-loan-calculator/` |
| `best commercial mortgage rates canada` | Commercial mortgage rates | 50 | 7 | $7.12 | 33 | h2-longtail | `/commercial-mortgage-rates/` |
| `list of b lenders in ontario` | GEO-ENTITY | 70 | 0 | $8.01 | 28 | rejected | `— dropped —` |
| `bridge loan calculator` | AEO-TOOL | 140 | 0 | $3.82 | 27 | tool-page | `/tools/bridge-loan-calculator/` |
| `current commercial mortgage rates canada` | Commercial mortgage rates | 110 | 0 | $4.67 | 26 | h2-longtail | `/commercial-mortgage-rates/` |
| `bridge financing without firm offer` | Bridge financing | 20 | 10 | $13.43 | 24 | h2-longtail | `/bridge-financing/` |
| `who are b lenders in canada` | GEO-ENTITY | 90 | 0 | $5.14 | 23 | h2-longtail | `/become-a-lender/` |
| `commercial mortgage calculator canada` | Commercial mortgage rates | 170 | 36 | $2.12 | 23 | page-secondary | `/tools/commercial-loan-calculator/` |
| `5 year commercial mortgage rates canada` | Commercial mortgage rates | 50 | 7 | $4.91 | 23 | h2-longtail | `/commercial-mortgage-rates/` |
| `bridge loan calculator canada` | Bridge financing | 70 | 0 | $6.18 | 22 | page-secondary | `/tools/bridge-loan-calculator/` |
| `commercial mortgage broker near me` | Commercial mortgage broker | 50 | 37 | $6.57 | 21 | h2-longtail | `/commercial-mortgage-broker/` |
| `cmhc mli select update` | CMHC / PBR / ACLP | 40 | 6 | $5.25 | 20 | h2-longtail | `/cmhc-mli-select/` |
| `commercial mortgage broker toronto` | Commercial mortgage broker | 20 | 44 | $17.05 | 19 | rejected | `— dropped —` |
| `construction loan rates canada` | Construction mortgage | 40 | 3 | $4.79 | 19 | h2-longtail | `/construction-mortgage-bc/` |
| `bridge financing calculator` | AEO-TOOL | 110 | 0 | $3.35 | 18 | tool-page | `/tools/bridge-loan-calculator/` |
| `how does bridge financing work` | AEO-DEF | 140 | 5 | $1.33 | 18 | glossary-term | `/bridge-financing/` |
| `minimum down payment for commercial property in canada` | Commercial mortgage | 20 | 5 | $8.89 | 17 | h2-longtail | `/commercial-mortgage/` |
| `construction mortgage rates` | Construction mortgage | 140 | 0 | $2.37 | 17 | h2-longtail | `/commercial-mortgage-rates/` |
| `construction loan interest rates` | GEO-ENTITY | 70 | 16 | $2.42 | 14 | h2-longtail | `/construction-mortgage-bc/` |
| `what is a construction mortgage` | AEO-DEF | 70 | 16 | $2.04 | 12 | glossary-term | `/construction-mortgage-bc/` |
| `commercial mortgage broker calgary` | Commercial mortgage broker | 20 | 35 | $8.90 | 12 | rejected | `— dropped —` |
| `bridge loan rates` | GEO-ENTITY | 40 | 2 | $2.92 | 11 | h2-longtail | `/bridge-financing/` |
| `list of a and b lenders in canada` | GEO-ENTITY | 30 | 0 | $7.43 | 11 | h2-longtail | `/become-a-lender/` |
| `cmhc interest rates` | GEO-ENTITY | 50 | 33 | $3.13 | 10 | h2-longtail | `/cmhc-mli-select/` |
| `alternatives to bridge financing canada` | Bridge financing | 30 | 0 | $7.01 | 10 | h2-longtail | `/compare/financing-options/` |
| `cmhc construction loan` | CMHC / PBR / ACLP | 30 | — | $5.79 | 9 | h2-longtail | `/aclp-cmhc/` |
| `commercial mortgage lenders canada` | Commercial mortgage broker | 20 | 25 | $5.63 | 8 | h2-longtail | `/commercial-mortgage-broker/` |
| `commercial real estate financing canada` | Commercial mortgage broker | 10 | 44 | $14.51 | 8 | h2-longtail | `/commercial-mortgage-broker/` |
| `bdc commercial mortgage calculator` | Commercial mortgage rates | 20 | — | $7.68 | 8 | rejected | `— dropped —` |
| `best bridge loan lenders` | Bridge financing | 10 | — | $10.81 | 5 | h2-longtail | `/bridge-financing/` |
| `construction to perm financing canada` | Construction mortgage | 20 | — | $4.98 | 5 | h2-longtail | `/construction-mortgage-bc/` |
| `mezzanine financing example` | Mezzanine / other | 10 | — | $8.72 | 4 | faq-block | `/mezzanine-financing/` |
| `commercial mortgage down payment` | Commercial mortgage rates | 10 | 43 | $7.06 | 4 | h2-longtail | `/commercial-mortgage/` |
| `best construction mortgage rates canada` | Construction mortgage | 10 | — | $7.96 | 4 | h2-longtail | `/commercial-mortgage-rates/` |
| `who offers bridge loans` | Bridge financing | 10 | — | $8.05 | 4 | faq-block | `/bridge-financing/` |
| `private lenders moncton` | Private lender | 10 | — | $7.98 | 4 | rejected | `— dropped —` |
| `bdc commercial mortgage rates` | Commercial mortgage rates | 40 | 35 | $1.39 | 4 | rejected | `— dropped —` |
| `commercial mortgage calculator alberta` | Commercial mortgage rates | 20 | 50 | $3.54 | 4 | rejected | `— dropped —` |
| `construction mortgage calculator` | AEO-TOOL | 50 | 51 | $1.36 | 3 | tool-page | `/tools/commercial-loan-calculator/` |
| `private lender mortgage rates canada` | Private lender | 10 | — | $5.83 | 3 | h2-longtail | `/private-lender/` |
| `private lenders list` | Private lender | 10 | — | $5.43 | 3 | h2-longtail | `/private-lender/` |
| `cmhc rental construction financing rates` | CMHC / PBR / ACLP | 10 | — | $4.97 | 2 | h2-longtail | `/commercial-mortgage-rates/` |
| `simple commercial loan calculator` | Commercial mortgage rates | 10 | — | $4.34 | 2 | h2-longtail | `/tools/commercial-loan-calculator/` |
| `construction mortgage rates bc` | Construction mortgage | 10 | 17 | $2.49 | 2 | h2-longtail | `/commercial-mortgage-rates/` |
| `commercial construction loan calculator` | Construction mortgage | 10 | — | $4.22 | 2 | h2-longtail | `/tools/commercial-loan-calculator/` |
| `monthly commercial mortgage calculator` | Commercial mortgage rates | 10 | — | $3.50 | 2 | page-secondary | `/tools/commercial-loan-calculator/` |
| `construction mortgage calculator canada` | Construction mortgage | 10 | 32 | $2.10 | 1 | h2-longtail | `/tools/commercial-loan-calculator/` |
| `bridge loan rates canada` | Bridge financing | 10 | 31 | $1.84 | 1 | h2-longtail | `/bridge-financing/` |
| `private lender mortgage calculator` | Private lender | 10 | 62 | $3.27 | 1 | h2-longtail | `/tools/commercial-loan-calculator/` |
| `construction loan calculator canada` | Construction mortgage | 20 | 31 | $0.78 | 1 | h2-longtail | `/tools/commercial-loan-calculator/` |
| `cost of bridge financing canada` | Bridge financing | 10 | — | $1.58 | 1 | faq-block | `/bridge-financing/` |
| `commercial loan payment calculator` | AEO-TOOL | 10 | — | $1.36 | 1 | tool-page | `/tools/commercial-loan-calculator/` |
| `how much do private lenders charge` | AEO-QA | 10 | — | $1.25 | 1 | faq-block | `/private-lender/` |
| `commercial mortgage broker course` | Commercial mortgage broker | 10 | — | $1.23 | 1 | h2-longtail | `/commercial-mortgage-broker/` |
| `bdc commercial real estate financing` | Commercial mortgage broker | 10 | — | $1.22 | 1 | rejected | `— dropped —` |
| `how much would a $100,000 construction loan cost per month` | AEO-QA | — | — | — | — | faq-block | `/construction-mortgage-bc/` |
| `what is the payment on a $1,000,000 commercial loan` | AEO-QA | — | — | — | — | faq-block | `/commercial-mortgage/` |
| `what is the monthly payment on a $400,000 loan at 7%` | AEO-QA | — | — | — | — | faq-block | `/commercial-mortgage/` |
| `how much is a $500,000 mortgage payment per month` | AEO-QA | — | — | — | — | faq-block | `/commercial-mortgage/` |
| `what is the interest rate for a commercial mortgage` | AEO-QA | — | — | — | — | faq-block | `/commercial-mortgage/` |
| `what are the current interest rates for commercial loans` | AEO-QA | — | — | — | — | faq-block | `/commercial-mortgage/` |
| `what is the current rate on a commercial mortgage` | AEO-QA | — | — | — | — | faq-block | `/commercial-mortgage/` |
| `what is the typical interest rate for a mezzanine loan` | AEO-QA | — | — | — | — | faq-block | `/mezzanine-financing/` |
| `do i need 20% down for a construction loan` | AEO-QA | — | — | — | — | faq-block | `/construction-mortgage-bc/` |
| `do you need 20% down for a commercial loan` | AEO-QA | — | — | — | — | faq-block | `/commercial-mortgage/` |
| `do i have to put 20% down on a construction loan` | AEO-QA | — | — | — | — | faq-block | `/construction-mortgage-bc/` |
| `do you have to put 20% down on a commercial loan` | AEO-QA | — | — | — | — | faq-block | `/commercial-mortgage/` |
| `how much deposit do you need for a commercial mortgage` | AEO-QA | 10 | — | — | — | faq-block | `/commercial-mortgage/` |
| `how much do you put down on a bridge loan` | AEO-QA | — | — | — | — | faq-block | `/bridge-financing/` |
| `is it difficult to qualify for a bridge loan` | AEO-QA | — | — | — | — | faq-block | `/bridge-financing/` |
| `is it difficult to get a construction loan` | AEO-QA | 10 | — | — | — | faq-block | `/construction-mortgage-bc/` |
| `how hard is it to get a commercial construction loan` | AEO-QA | — | — | — | — | faq-block | `/construction-mortgage-bc/` |
| `what credit score is needed for a construction loan` | AEO-QA | — | — | — | — | faq-block | `/construction-mortgage-bc/` |
| `how hard is it to get a loan for a rental property` | AEO-QA | — | — | — | — | faq-block | `/purpose-built-rental-vancouver/` |
| `is it hard to get a loan for an apartment building` | AEO-QA | — | — | — | — | faq-block | `/aclp-cmhc/` |
| `is it easier to get a loan for multifamily property` | AEO-QA | — | — | — | — | faq-block | `/construction-mortgage-bc/` |
| `is it hard to get a construction loan to build a house` | AEO-QA | — | — | — | — | faq-block | `/construction-mortgage-bc/` |
| `is it hard to get bridge financing` | AEO-QA | — | — | — | — | faq-block | `/bridge-financing/` |
| `is it a good idea to get a bridge loan` | AEO-QA | — | — | — | — | faq-block | `/bridge-financing/` |
| `is a bridge loan ever a good idea` | AEO-QA | — | — | — | — | faq-block | `/bridge-financing/` |
| `is cmhc insurance worth it` | AEO-QA | 20 | — | — | — | faq-block | `/aclp-cmhc/` |
| `can you get rid of cmhc insurance` | AEO-QA | — | — | — | — | faq-block | `/aclp-cmhc/` |
| `why use a commercial mortgage broker` | AEO-QA | 0 | — | — | — | faq-block | `/commercial-mortgage-broker/` |
| `what is the downside to using a mortgage broker` | AEO-QA | — | — | — | — | faq-block | `/commercial-mortgage-broker/` |
| `how much does a mortgage broker make on a $500,000 loan` | AEO-QA | — | — | — | — | faq-block | `/commercial-mortgage-broker/` |
| `how much do private lenders charge in canada` | AEO-QA | — | — | — | — | faq-block | `/private-lender/` |
| `do llcs get better mortgage rates` | AEO-QA | — | — | — | — | faq-block | `/commercial-mortgage/` |
| `can a mortgage broker do commercial loans` | AEO-QA | — | — | — | — | faq-block | `/commercial-mortgage-broker/` |
| `can cmhc deny a mortgage` | AEO-QA | 10 | 40 | — | — | faq-block | `/aclp-cmhc/` |
| `is private lending legal in canada` | AEO-QA | — | — | — | — | faq-block | `/private-lender/` |
| `can i get a 30 year mortgage on a commercial property` | AEO-QA | — | — | — | — | faq-block | `/commercial-mortgage/` |
| `can i get a construction loan in bc` | AEO-QA | — | — | — | — | faq-block | `/construction-mortgage-bc/` |
| `can you give me an example of mezzanine financing` | AEO-QA | — | — | — | — | faq-block | `/mezzanine-financing/` |
| `what is the current state of the vancouver commercial real estate market` | AEO-QA | — | — | — | — | faq-block | `/vancouver-land-assembly/` |
| `what is a commercial mortgage broker` | AEO-DEF | 10 | — | — | — | glossary-term | `/commercial-mortgage-broker/` |
| `what is a commercial mortgage` | AEO-DEF | 20 | 43 | — | — | glossary-term | `/commercial-mortgage/` |
| `what is a bridge loan and how does it work` | AEO-DEF | — | — | — | — | glossary-term | `/bridge-financing/` |
| `what is bridge financing and how does it work` | AEO-DEF | — | — | — | — | glossary-term | `/bridge-financing/` |
| `what do you mean by bridge finance` | AEO-DEF | — | — | — | — | glossary-term | `/bridge-financing/` |
| `what is mezzanine financing in simple terms` | AEO-DEF | — | — | — | — | glossary-term | `/mezzanine-financing/` |
| `what is a cmhc insured mortgage` | AEO-DEF | — | — | — | — | glossary-term | `/cmhc-mli-select/` |
| `what does cmhc mli select stand for and what does it offer` | AEO-DEF | — | — | — | — | glossary-term | `/cmhc-mli-select/` |
| `what is the cmhc minimum down payment` | AEO-DEF | — | — | — | — | glossary-term | `/aclp-cmhc/` |
| `what are the disadvantages of a bridging loan` | AEO-DEF | — | — | — | — | glossary-term | `/bridge-financing/` |
| `what are the downsides of a bridge loan` | AEO-DEF | — | — | — | — | glossary-term | `/bridge-financing/` |
| `what are the downsides of mezzanine finance` | AEO-DEF | — | — | — | — | glossary-term | `/mezzanine-financing/` |
| `is there such a thing as a commercial mortgage` | AEO-DEF | — | — | — | — | glossary-term | `/commercial-mortgage/` |
| `bridge loan vs construction loan` | AEO-CMP | 10 | — | — | — | h2-longtail | `/bridge-financing/` |
| `private lender vs bank` | AEO-CMP | 10 | — | — | — | h2-longtail | `/private-lender/` |
| `private lender vs cmhc` | AEO-CMP | — | — | — | — | h2-longtail | `/private-lender/` |
| `bridge loan vs private lender` | AEO-CMP | — | — | — | — | h2-longtail | `/bridge-financing/` |
| `commercial mortgage vs residential mortgage` | AEO-CMP | 10 | — | — | — | h2-longtail | `/commercial-mortgage/` |
| `cmhc mli select vs select for sales` | AEO-CMP | — | — | — | — | h2-longtail | `/cmhc-mli-select/` |
| `mezzanine vs bridge vs private financing` | AEO-CMP | — | — | — | — | h2-longtail | `/mezzanine-financing/` |
| `commercial mortgage broker vs lender` | AEO-CMP | — | — | — | — | h2-longtail | `/commercial-mortgage-broker/` |
| `bc commercial mortgage rates 2026` | GEO-ENTITY | — | — | — | — | page-primary | `/vancouver-commercial-real-estate-market/` |
| `vancouver commercial real estate market` | GEO-ENTITY | 10 | 44 | — | — | page-primary | `/vancouver-commercial-real-estate-market/` |
| `cmhc mli select interest rate` | GEO-ENTITY | 50 | 3 | — | — | h2-longtail | `/cmhc-mli-select/` |
| `how to become a private lender in canada` | GEO-ENTITY | 20 | 19 | — | — | page-primary | `/become-a-lender/` |
| `do you need a license to be a private lender` | GEO-ENTITY | 10 | — | — | — | h2-longtail | `/become-a-lender/` |
| `how to become a lender in canada` | GEO-ENTITY | 10 | 40 | — | — | h2-longtail | `/become-a-lender/` |
| `is private lending profitable` | GEO-ENTITY | 10 | — | — | — | h2-longtail | `/become-a-lender/` |
| `how much do private lenders make` | GEO-ENTITY | 10 | — | — | — | h2-longtail | `/become-a-lender/` |
| `what is the $20,000 home grant in ohio` | AEO-QA | — | — | — | — | rejected | `— dropped —` |
| `what are fannie mae's current 5% down multifamily loan guidelines` | AEO-QA | — | — | — | — | rejected | `— dropped —` |
| `what does dave ramsey say about bridge loans` | AEO-QA | — | — | — | — | rejected | `— dropped —` |
| `what is a 538 loan` | AEO-QA | — | — | — | — | rejected | `— dropped —` |
| `how to become a private lender in ontario` | GEO-ENTITY | 30 | 0 | — | — | rejected | `— dropped —` |
| `how to register a private mortgage in ontario` | GEO-ENTITY | 10 | — | — | — | rejected | `— dropped —` |
| `commercial mortgage calculator excel` | Commercial mortgage rates | 10 | — | — | — | h2-longtail | `/tools/commercial-loan-calculator/` |
| `commercial mortgage down payment canada` | Commercial mortgage rates | 10 | 6 | — | — | h2-longtail | `/commercial-mortgage/` |
| `can i get a residential mortgage on a commercial property` | Commercial mortgage | 10 | — | — | — | faq-block | `/commercial-mortgage/` |
| `commercial mortgage requirements canada` | Commercial mortgage | 10 | — | — | — | h2-longtail | `/commercial-mortgage/` |
| `commercial mortgage broker license` | Commercial mortgage broker | 10 | — | — | — | h2-longtail | `/commercial-mortgage-broker/` |
| `commercial mortgage broker salary` | Commercial mortgage broker | 10 | 44 | — | — | h2-longtail | `/commercial-mortgage-broker/` |
| `commercial construction loan canada` | Construction mortgage | — | — | — | — | h2-longtail | `/construction-mortgage-bc/` |
| `construction mortgage rates canada` | Construction mortgage | 20 | 20 | — | — | h2-longtail | `/commercial-mortgage-rates/` |
| `how does a construction mortgage work canada` | Construction mortgage | 10 | 39 | — | — | faq-block | `/construction-mortgage-bc/` |
| `bridge financing interest rates` | Bridge financing | 10 | 1 | — | — | h2-longtail | `/bridge-financing/` |
| `aclp program` | CMHC / PBR / ACLP | 70 | 1 | — | — | h2-longtail | `/aclp-cmhc/` |
| `aclp financing` | CMHC / PBR / ACLP | 30 | — | — | — | h2-longtail | `/aclp-cmhc/` |
| `aclp requirements` | CMHC / PBR / ACLP | 10 | — | — | — | h2-longtail | `/aclp-cmhc/` |
| `cmhc mli select calculator` | CMHC / PBR / ACLP | 20 | 14 | — | — | h2-longtail | `/tools/commercial-loan-calculator/` |
| `cmhc mli select requirements` | CMHC / PBR / ACLP | 30 | — | — | — | h2-longtail | `/cmhc-mli-select/` |
| `cmhc indicative 10-year fixed rate` | CMHC / PBR / ACLP | 10 | 16 | — | — | h2-longtail | `/commercial-mortgage-rates/` |
| `cmhc indicative rate` | CMHC / PBR / ACLP | 10 | — | — | — | h2-longtail | `/commercial-mortgage-rates/` |
| `cmhc mli select broker` | CMHC / PBR / ACLP | 10 | — | — | — | h2-longtail | `/cmhc-mli-select/` |
| `cmhc mli select application` | CMHC / PBR / ACLP | 10 | — | — | — | h2-longtail | `/cmhc-mli-select/` |
| `cmhc rcfi` | CMHC / PBR / ACLP | 10 | 0 | — | — | h2-longtail | `/aclp-cmhc/` |
| `cmhc rcfi application` | CMHC / PBR / ACLP | — | — | — | — | h2-longtail | `/aclp-cmhc/` |
| `cmhc financing rental property` | CMHC / PBR / ACLP | 10 | — | — | — | h2-longtail | `/purpose-built-rental-vancouver/` |
| `mezzanine financing real estate` | Mezzanine / other | 10 | 39 | — | — | h2-longtail | `/mezzanine-financing/` |
| `mezzanine financing rates` | Mezzanine / other | 10 | — | — | — | h2-longtail | `/mezzanine-financing/` |
| `mezzanine financing vs preferred equity` | Mezzanine / other | 10 | — | — | — | h2-longtail | `/compare/financing-options/` |
| `mezzanine financing vs convertible bond` | Mezzanine / other | 10 | — | — | — | h2-longtail | `/compare/financing-options/` |
| `mezzanine financing pronunciation` | Mezzanine / other | 10 | — | — | — | h2-longtail | `/mezzanine-financing/` |
| `apartment construction loan program canada` | CMHC / PBR / ACLP | 10 | — | — | — | h2-longtail | `/aclp-cmhc/` |
| `apartment construction financing` | CMHC / PBR / ACLP | 10 | — | — | — | h2-longtail | `/aclp-cmhc/` |
| `commercial mortgage agent course` | Commercial mortgage broker | — | — | — | — | h2-longtail | `/commercial-mortgage-broker/` |
| `commercial mortgage calculator usa` | Commercial mortgage rates | 10 | — | — | — | rejected | `— dropped —` |
| `commercial mortgage td` | Commercial mortgage broker | 40 | 9 | — | — | rejected | `— dropped —` |
| `private lenders for bad credit` | Private lender | — | 45 | — | — | rejected | `— dropped —` |
| `bridge loan in french` | Bridge financing | 10 | — | — | — | rejected | `— dropped —` |
| `bridge loan reddit` | Bridge financing | 10 | — | — | — | rejected | `— dropped —` |
| `bridge loan canada reddit` | Bridge financing | — | — | — | — | rejected | `— dropped —` |
| `commercial mortgage rates canada 2022` | Commercial mortgage rates | 0 | 22 | — | — | rejected | `— dropped —` |
| `best private lenders toronto` | Private lender | 10 | 40 | — | — | rejected | `— dropped —` |

## 4. Coverage check

| Page | Terms served | Built? |
|---|---:|---|
| `/private-lender/` | 17 | ✅ |
| `/commercial-mortgage-broker/` | 19 | ✅ |
| `/bridge-financing/` | 26 | ✅ |
| `/aclp-cmhc/` | 23 | ✅ |
| `/construction-mortgage-bc/` | 36 | ✅ |
| `/commercial-mortgage/` | 22 | ⏳ |
| `/cmhc-mli-select/` | 9 | ⏳ |
| `/purpose-built-rental-vancouver/` | 8 | ⏳ |
| `/mezzanine-financing/` | 11 | ⏳ |
| `/vancouver-land-assembly/` | 2 | ⏳ |
| `/tools/commercial-loan-calculator/` | 13 | ⏳ |
| `/tools/bridge-loan-calculator/` | 5 | ⏳ |
| `/compare/financing-options/` | 3 | ⏳ |
| `/commercial-mortgage-rates/` | 12 | ⏳ |
| `/vancouver-commercial-real-estate-market/` | 2 | ⏳ |
| `/become-a-lender/` | 7 | ⏳ |

## 5. Research tasks — work to complete later

### 🔴 P0 — blocks publishing

| ID | Task | Blocks | Cost | Effort | Tool |
|---|---|---|---:|---|---|
| **R17** | Live domain audit + OpenSEO project sync — canonical, sitemap, SPA rendering, IA mismatch | all indexation of commercialkonnect.ca, the IA decision | $0.0 | done | openseo run_site_audit + get_keyword_metrics + direct HTTP probes |
| **R16** | Funding-source licensing path — BCFSA 'lending' category + HoldCo/OpCo structure | any 'funding source' positioning, any origination or lender-advances copy | $0.0 | done | web_search + web_extract (bcfsa.ca, bclaws.gov.bc.ca) |
| **R01** | Decide brand + register domain (PRD §15) | publish all pages | $0 | 15 min | manual decision |
| **R02** | Verify CMHC ACLP claims against current CMHC sources | publish aclp-cmhc.html | $0 | 45 min | web_extract cmhc-schl.gc.ca |
| **R03** | BCFSA / Mortgage Services Act compliance review of all 11 pages | publish private-lender.html + commercial-mortgage-broker.html | $0 | 2-3 h | bcfsa.ca + BC Laws + legal review |
| **R05** | Verify the 24-lender private-lender directory (ELEVATED by R03) | publish private-lender.html, directory credibility | $0 | 3 h | BCFSA registrant lookup |
| **R18** | WordPress AEO/GEO implementation — answer blocks, structured data, entity graph, AI-crawler access | AEO answer-engine visibility, GEO generative citation, the WordPress implementation spec, any rate-table or calculator publication | $0.0 | research complete — implementation is external | Serper PAA + OpenSEO get_keyword_metrics + OpenSEO get_serp_results (BC 20114) |

**R17 · Live domain audit + OpenSEO project sync — canonical, sitemap, SPA rendering, IA mismatch**  `✅ COMPLETE (audit) — 6 blocking fixes + 1 owner decision outstanding`
DONE 2026-10-24 -> research/r17-live-domain-audit-2026-10-24.md (12.2 KB). OpenSEO audit d7c7e9fc (FIRST audit ever run on this project): crawled 1/1 page, 6 issues (missing-h1, no-outgoing-links, thin-content wordCount=0, canonicalized-page -> https://clearconnectcom.lovable.app/, meta-desc 182 chars, title 65 chars). LIVE SITE IS A CLIENT-RENDERED SPA: server HTML 3,050 bytes, 0 h1, Googlebot HTML byte-identical to regular UA (no prerender), every route incl. /zzz-nonexistent-12345/ returns HTTP 200 with identical body (soft-404 / infinite-URL risk). CRITICAL: canonical points to clearconnectcom.lovable.app, robots.txt Sitemap directive points to clearconnectcom.lovable.app/sitemap.xml, and all 13 served <loc> entries are clearconnectcom.lovable.app. The domain is instructing search engines to index a different domain under a different product name. IA MISMATCH: live sitemap has 13 paths (/, /product, /pricing, /request-demo, /for-brokers, /landing-pages, ...) and the plan has 10 (/private-lender/, /bridge-financing/, /commercial-mortgage-broker/, ...) — ZERO URL OVERLAP. Live structure is a SaaS product; plan structure is search-intent. OWNER DECISION REQUIRED — cannot coexist. METRIC VERIFICATION: all 64 plan terms re-hydrated via OpenSEO's own DataForSEO creds (Labs IS provisioned there; the direct cred 404s on all 4 Labs endpoints while user_data returns 20000) — 42 exact matches, ZERO drift, 2 newly filled (opco 320/mo KD3 navigational, holdco 320/mo KD10 navigational), 20 still no Labs data. Search Console NOT connected: no first-party performance data exists; all figures are third-party modelled. 6 blocking fixes listed in the artifact for the external WordPress team.
- 🚩 **Risk:** CRITICAL — wrong-domain canonical + wrong-domain sitemap + 0-word server HTML means the domain cannot currently index

**R16 · Funding-source licensing path — BCFSA 'lending' category + HoldCo/OpCo structure**  `✅ COMPLETE (research) — BLOCKER OPEN (entity + lending category)`
DONE 2026-10-22/23 -> research/r04-lending-licence-path-2026-10-22.md (8.3 KB, 169 lines). HARD CONSTRAINT C1: BCFSA 'lending' category has NO in-force date (only dealing/trading/administering live 2026-10-13). No page may state or imply CommercialKonnect funds commercial loans until that category is live AND the operating entity is licensed in it. 'CommercialKonnect is not a lender' stays. §8: HoldCo/OpCo — BCFSA 'No matter what kind of corporate structure a mortgage brokerage has, anyone carrying on the business of providing mortgage services must have a licence.' OpCo must hold the brokerage licence + a licensed principal broker (Rules s.3); HoldCo may not carry on mortgage services nor be paid for them (MSA s.5); 1 principal broker covers max 4 affiliated brokerages (Rules s.4); trade name likely to confuse can be refused. §8 audit: 0 of 11 pages name a legal entity while 5 assert BCFSA registration. Broker credential 144231 on file (stated by client, register verification pending — BCFSA register is client-rendered JS, automated access blocked). OUTSTANDING: OpCo legal name, HoldCo legal name, whether 144231 is the OpCo brokerage licence or the individual broker licence.
- 🚩 **Risk:** CRITICAL — a funding-source claim without a lending licence is an unlicensed-activity representation

**R01 · Decide brand + register domain (PRD §15)**  `open`
Canonicals hardcode kommercialconnect.ca. A different domain requires find/replace across all 11 pages + 200+ internal links.

**R02 · Verify CMHC ACLP claims against current CMHC sources**  `✅ COMPLETE — 5 errors, rewrite required`
DONE 2026-10-22 → research/r02-aclp-claim-verification-2026-10-22.md. 5 ERRORS FOUND: E1 application is made DIRECTLY to CMHC via its portal (not via an approved lender — that is take-out only); E2 min is 5 rental units not 3; E3 $1M min loan size missing entirely; E4 ACLP funds new build + conversion, not general renovation; E5 the 5.25% hero rate is unsourced. Missing: 20%-of-units ≤30% MTI affordability test held 10 years, 100%/75% LTC, 50-yr amortization, no-premium fact. Page must be rewritten before publish.
- 🚩 **Risk:** HIGH — resolved as a finding; page still needs the rewrite

**R03 · BCFSA / Mortgage Services Act compliance review of all 11 pages**  `✅ COMPLETE — 2 unresolved blockers, counsel required`
DONE 2026-10-22 → research/r03-bcfsa-msa-compliance-review-2026-10-22.md. 2 BLOCKERS, both needing a BC lawyer, NOT research-resolvable. B1: pages describe 'dealing in mortgages' (BCFSA licensable — 'providing prospective borrower information to a prospective lender… negotiating or arranging a mortgage'), i.e. the site matches borrowers to lenders. Existing 'CommercialKonnect is not a lender' disclaimer does NOT cure it — false comfort. B2: 'Every lender listed here is BCFSA-registered' is an unverified claim about 24 third parties and is likely wrong (BCFSA licenses brokers; 'mortgage lending' is a separate category many private lenders don't hold). Also C2 footer 'BCFSA-registered brokerage partnerships', C3 no fee disclosure (86 fee refs), C4 42 rate claims incl. provably-unsourced 5.25%. MSA in force 2026-10-13 (verified) — bclaws snapshot 'current to 2026-10-12' is stale, not a contradiction. 3 routes offered: (A) licensed brokerage, (B) passive directory, (C) partner brokerage. Draft disclosure language prepared in §7, NOT for publication.
- 🚩 **Risk:** CRITICAL — publish blocker. Cannot be closed by research; needs (1) BC lawyer, (2) Dennis's route decision, (3) counsel sign-off

**R05 · Verify the 24-lender private-lender directory (ELEVATED by R03)**  `open — BLOCKED on register access (client-rendered JS, no API)`
Directory lists 24 BC private lenders. Per skill rule: confirm (a) licensed in BC, (b) actually fund the claimed deal size, (c) active in 2026. Stale directory = credibility killer. ELEVATED P1→P0: R03 Blocker 2 found the on-page claim 'Every lender listed here is BCFSA-registered' is very likely FALSE because BCFSA licenses brokers/brokerages while 'mortgage lending' is a separate category many legitimate private lenders do not hold. Verify each entry or delete the sentence. Note MSAs converted registrations→licences on 2026-10-13, so any status must be checked against the post-transition register.

**R18 · WordPress AEO/GEO implementation — answer blocks, structured data, entity graph, AI-crawler access**  `🟡 RESEARCH COMPLETE — implementation pending external WordPress team`
The 2026-10-22 controlled plan (65 terms) is entirely commercial-TRANSACTIONAL — commercial-transactional noun phrases for 8 clusters and 10 pages. That is the correct shape for ranking a commercial page and the WRONG shape for AEO/GEO, which reward extractable answers, definitional clarity, comparison tables, original data and entity corroboration. This task defines the second layer.

EVIDENCE BASE (all pulled 2026-10-24, not invented):
• Serper People-Also-Ask harvest: 84 questions applied / 60 unique classified, from Tier-1 + secondary commercial seeds. gl=ca returned 0 PAA; the gl=us global fallback was used (the same pattern OpenSEO itself uses in src/server/lib/serper/client.ts). Serper PAA is non-deterministic between runs — the applied artifact is the record.
• OpenSEO get_keyword_metrics over 104 authored AEO/GEO candidates: 50 hydrated, 54 with no Labs record. The 54 were cross-checked against the independent research_keywords 'related' endpoint — ZERO appear there either, so 'no Labs record' means genuinely not in the index, not a lookup artefact.
• OpenSEO get_serp_results at BC (location_code=20114 — the SERP namespace accepts provincial codes; the Labs namespace does not, and 2124 is therefore the correct Labs default): AI Overviews present on the majority of the verified terms. AIO text is unavailable on the current DataForSEO tier (R13), so AIO CONTENT remains unverified — presence is verified, what the AI actually says is not.
• Key new volume found in the related-keyword expansion that was NOT in the 2026-10-21 strategy pull: 'commercial mortgage calculator' 1,300/mo KD12 CPC 2.89 — the single largest commercial term found outside the controlled plan. Also 'commercial real estate loan calculator' 320/mo KD13, 'bridge loan calculator' 140/mo KD0, 'bridge financing calculator' 110/mo KD0, 'commercial mortgage rates canada' 260/mo KD16, 'bridge loan canada' 260/mo KD0.

DELIVERABLE: 6 new pages (2 calculators, 1 comparison hub, 1 rates hub, 1 original-data market hub, 1 supply-side page), a new keyword population of ~170 terms across 5 AEO/GEO clusters, and a compliance_gate on every single new term (publish / needs-rate-source / needs-legal-review / needs-directory-verify / blocked). No new term ships without a gate.

WORDPRESS IMPLEMENTATION REQUIREMENTS (for the external WP team):
1. ANSWER BLOCKS — each FAQ block must open with a 40-60 word self-contained answer, then supporting detail. Generative engines extract the first paragraph far more reliably than mid-page prose. No answer may depend on the previous section for meaning.
2. STRUCTURED DATA — FAQPage on every page with an FAQ block (the existing corpus already emits Question schema); SoftwareApplication on the calculators; Dataset on the market-report page; Organization + LocalBusiness on the broker pages. Note: Google restricted FAQ rich results to authoritative government/health sites in 2023 — the FAQ schema here targets LLM ingestion, NOT rich-result eligibility. Do not promise rich results.
3. RATE FRESHNESS — every rate, LTV, fee and rate-indicator figure needs a source URL and an as-of date, and the rates hub must republish on a schedule. A stale rate page is worse than no page: generative engines cite it.
4. ENTITY GRAPH — Organization schema with the licensed OpCo legal name (UNKNOWN — C6/C8), consistent NAP, and the BCFSA licence number (client-stated 144231) in a visible disclosure, not buried. Entity consistency is a ranking factor for the knowledge graph, and 'CommercialKonnect' alone is not an entity Google can attach a licence to.
5. AI-CRAWLER ACCESS — robots.txt must allow GPTBot, ClaudeBot, PerplexityBot, Google-Extended and CCBot while keeping the commercial directories and rate tables open. A blocked AI crawler forfeits AEO/GEO entirely, and the cost of that is invisible in Search Console.
6. CANONICAL + IA — this overlaps R17. The live site canonicalises to clearconnectcom.lovable.app and serves a client-rendered shell, so none of the above can be indexed. R17's fixes are prerequisites, not parallel work.
7. NO LEAD GATE ON TOOLS — the calculators must be usable without submitting a form. Gating the highest-citation asset behind a lead form defeats the entire AEO/GEO purpose.
8. llms.txt / machine-readable index — publish an llms.txt and a machine-readable glossary endpoint so LLM crawlers can resolve CommercialKonnect's definitions without scraping the whole site.

OPEN: AIO content on the current tier is unreadable, so we cannot yet confirm WHAT the AI says about these terms (R13). Retest when a tier with AIO text is available — that retest is what turns 'GEO is plausible' into a measured position. Also open: whether the 4 existing FAQ-count pages should carry their FAQ blocks on-page or in a dedicated /faq/ hub.
- 🚩 **Risk:** HIGH — without R17's canonical/prerender fixes none of the AEO/GEO layer can be indexed, and the calculators/rates pages carry live regulated-claim exposure (C5) if they publish numbers without sources and as-of dates.

### 🟠 P1 — blocks deploy/quality

| ID | Task | Blocks | Cost | Effort | Tool |
|---|---|---|---:|---|---|
| **R15** | OpCo / HoldCo keyword clusters — REJECTED on live SERP evidence | opco/holdco cluster build | $0.0 | done | serp/google/organic/live/advanced |
| **R04** | Re-source 2026 BC rate + LTV tables to citable published sources | accurate rate/LTV tables | $0 | 2 h | web_search + manual |
| **R06** | Decide canonical/redirect strategy for the 5 superseded pages | internal link graph | $0 | 30 min | manual |
| **R07** | Create the 5 missing footer stub pages | deploy | $0 | 1 h | build |
| **R08** | Wire forms to a backend endpoint + CRM | lead capture | $0 | 2-4 h | build |
| **R13** | Obtain AI Overview content for the 6 target queries (GEO verification) | GEO positioning, GEO claims in copy | $0 | 1-2 h | DataForSEO tier upgrade OR manual AIO capture |
| **R14** | Google Business Profile + LocalBusiness/MortgageBroker schema | local pack visibility | $0 | 2 h | manual + schema |

**R15 · OpCo / HoldCo keyword clusters — REJECTED on live SERP evidence**  `✅ COMPLETE — clusters rejected, /compliance/ alternative proposed`
DONE 2026-10-23 -> research/r15-opco-holdco-keyword-feasibility-2026-10-23.md. Requested as clusters; live BC SERPs (location_code=20114) show both terms are unusable: bare 'opco' returns FRENCH operateurs de competences + PitchBook; 'opco mortgage' returns OP Mortgage Bank plc (Finland); 'holdco' returns accountant/tax explainers; 'opco mortgage canada' returns ZERO results; 'opco loan bc' returns CPL student loans. No volumes recorded because DataForSEO Labs returns 40400 on this account (auth valid, SERP works — Labs product not provisioned) and fabricating metrics would corrupt the plan. RECOMMENDED ALTERNATIVE: build /compliance/ (already referenced in nav on all 11 pages but never created) to carry the structure + licensing explanation, and name the licensed OpCo in the footer per R04 §8.
- 🚩 **Risk:** LOW as rejected; MEDIUM if built — would target French training bodies and a Finnish bank

**R04 · Re-source 2026 BC rate + LTV tables to citable published sources**  `open`
All rate tables (8-15% private, 55-65% LTV, 12-15% construction, ~5.25% CMHC, $3,400-$15,000 broker fees) are editorial estimates. Each needs a named source + 'as of' date or must be labelled indicative.
- 🚩 **Risk:** MEDIUM — unsupported numbers are a trust and E-E-A-T liability

**R06 · Decide canonical/redirect strategy for the 5 superseded pages**  `open`
aclp-cmhc.html vs financing/apartment-construction-loan-program-bc.html; private-lender.html vs private-lender-bc.html; commercial-mortgage-broker.html vs brokers/commercial-mortgage-broker-vancouver.html. Each pair needs a 301 decision.

**R07 · Create the 5 missing footer stub pages**  `open`
/, /about/, /compliance/, /contact/, /broker-resources/ all 404. /compliance/ should carry the full BCFSA/CASL disclosure — it is the natural home for R03's output.

**R08 · Wire forms to a backend endpoint + CRM**  `open`
All 11 forms are onsubmit alert() stubs. Needs /api/apply, field validation, CASL consent checkbox, spam protection, and routing into the CRM deal table.

**R13 · Obtain AI Overview content for the 6 target queries (GEO verification)**  `open — BLOCKED on DataForSEO tier`
AIO is served on 5 of 6 target keywords (all except 'commercial mortgage') — the generative surface is real. But AIO TEXT is not retrievable: /serp/google/ai_overview/live/advanced returns empty at $0.00 on all 5, and the main SERP endpoint lists 'ai_overview' in item_types but returns an empty object. Current DataForSEO tier appears not to include AIO content. Until this is closed, the GEO hypothesis ('answer engines get BC commercial mortgage wrong') is UNVERIFIED for these queries — it is proven only for CMHC ACLP via R02. Options: (a) upgrade DataForSEO tier, (b) test live AI surfaces directly and record answers manually, (c) drop the GEO claim and market on accuracy-as-differentiator without asserting AI behaviour.

**R14 · Google Business Profile + LocalBusiness/MortgageBroker schema**  `open — awaiting Dennis decision`
Live BC SERP audit found a LOCAL PACK of 3 results on 3 of 6 target keywords: 'commercial mortgage' (3), 'commercial mortgage broker' (3), 'private lender' (3). Not present on 'commercial mortgage rates', 'bridge financing', 'aclp cmhc'. CommercialKonnect has no GBP presence and no local schema — a separate ranking channel from organic that no current task covers. Needs: GBP creation (requires a real BC address + verified phone), LocalBusiness/MortgageBroker JSON-LD sitewide, NAP consistency. Note: GBP requires a physical BC presence, which interacts with the R03 entity/licence question.

### 🟡 P2 — improves accuracy

| ID | Task | Blocks | Cost | Effort | Tool |
|---|---|---|---:|---|---|
| **R09** | Optional: DataForSEO BC-only metrics re-run (location_code 20114) | BC-accurate metrics | $3 | 20 min | mcp__dataforseo__api_request |
| **R10** | Competitor depth audit — live SERP done, named targets superseded | content depth modeling | $0 | 15 min | DataForSEO REST API |
| **R11** | PAA harvest for FAQ expansion on the 5 Tier 1 pages | [] | $1 | 20 min | mcp__openseo__get_serp_results |

**R09 · Optional: DataForSEO BC-only metrics re-run (location_code 20114)**  `open (needs approval)`
2026-10-17 pull used Canada 2124 and is contaminated with Toronto/Ottawa/Hamilton/Windsor terms. A 20114 (BC) re-run of the top ~40 keywords would firm up geo-targeted volumes. Cost ~$1-5.
- ℹ️ Approve with 'yes' to run.

**R10 · Competitor depth audit — live SERP done, named targets superseded**  `✅ SERP audit COMPLETE — on-page depth modelling outstanding`
PARTIALLY DONE 2026-10-22 → research/competitive-serp-intelligence-bc-2026-10-22.md. Live BC SERP pulled for 6 head keywords, 51 organic slots, 38 domains, $0.024. The two originally-named competitors (satbirbhullar.ca, lendcity.ca) do NOT appear in any BC top-10 — only lendcity.ca ranks, and only for aclp cmhc / commercial mortgage rates, as an Ontario broker. Actual BC field is dominated by banks (bdc, rbc, cibc, bmo, firstnational, vancity), national marketplaces (mcap, cmls, ratehub), CMHC itself, and Ontario brokers (outline.ca ranks #3 in BC for 'commercial mortgage broker'). REMAINING: on-page depth modelling (word count, section coverage, directory size, schema) of the specific pages now confirmed to rank.

**R11 · PAA harvest for FAQ expansion on the 5 Tier 1 pages**  `open (needs approval)`
Current FAQs are 8 each, built from domain knowledge. Live People-Also-Ask would let us match the actual AI Overview pattern and add 2-4 more Q&A per page.

### 🔵 P3 — post-deploy

| ID | Task | Blocks | Cost | Effort | Tool |
|---|---|---|---:|---|---|
| **R12** | Set up rank tracking for the 11 published routes | ranking measurement | $0 | 30 min | mcp__openseo__get_rank_tracker |

**R12 · Set up rank tracking for the 11 published routes**  `blocked on deploy`
Post-deploy, track the Tier 1 primaries + long-tail set in OpenSEO rank tracker to measure the 60-90 day outcome.

**Total paid-tool cost if everything runs: $4.0** (R01–R08 are $0 — manual/build effort only)

## 6. File inventory

**Tier 1 (generated, 2026-10-22):** 

**Original 6 (hand-authored, 2026-10-17):** `commercial-mortgage-broker.html`, `bridge-financing.html`, `construction-mortgage-bc.html`, `aclp-cmhc.html`, `private-lender.html`, `brokers/commercial-mortgage-broker-vancouver.html`, `brokers/join-as-broker.html`, `financing/commercial-construction-financing-vancouver.html`, `financing/apartment-construction-loan-program-bc.html`, `financing/private-lender-bc.html`, `financing/vancouver-purpose-built-rental-loan.html`

**Generators:** `research/_build_tier1.py`, `research/_build_cluster_html.py`, `research/_render_project_file.py`


## 7. Open questions

1. **Brand + domain (PRD §15)** — 6 further decisions open (legal entity, compensation model, brokerage relationship, CRM/CMS stack, data licensing, broker SLA). Blocks all deploy.
2. **`cmhc mli select` is the single highest-volume term at 1,300/mo, KD 0** — currently queued as `/cmhc-mli-select/`. Should it outrank the current Tier 1 order? It has the lowest CPC ($3.61) so conversion value is low, but volume is 22% of the whole set.
3. **301 strategy for the 5 superseded pages** — R06.

