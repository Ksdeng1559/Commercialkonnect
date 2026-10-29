# CommercialKonnect — Lender Directory (source of record)

**Purpose:** Single source of truth for the lender/directory content that the WordPress `lender` CPT (per `SEO_PLAN.md` §4) will consume. Compiling this list is safe now; **publishing** any entry is gated on per-lender BCFSA verification (Blocker B2) and the B1 product decision.
**Last updated:** 2026-10-23 · **Verification method (proven):** BCFSA *Find an Individual / Find a Brokerage* register renders in a real browser (JS) — WebFetch/curl get 403, but the live Chrome session returns records (confirmed 2026-10-23 for licence MB144231). Use that path, or phone (604) 660-3555 / MortgageBrokers@bcfsa.ca.

> ⚠️ **B2 gate:** Do not publish "BCFSA-registered" (or any regulatory-status) claim about a third party until that party is checked against the live register. BCFSA licenses *brokers*, not necessarily *lenders* — many legitimate private/commercial lenders are not BCFSA-licensed because they originate directly. Status column below is explicit.

---

## Confirmed operator identity (from BCFSA register, 2026-10-23)

| Field | Value |
|---|---|
| Licensee | Dennis Stewart Ka-Fei Eng (Dennis Eng) |
| Licence | **MB144231** · **Licensed** · expiry **2028-05-13** |
| Categories | Dealing, Trading, **Mortgage Lending**, Administering |
| Brokerage | **Dominion Lending Centres Clear Trust Mortgages – Dare 2 Dream**, Vancouver |

**Consequence:** the site's licensed capacity is Dennis brokering **under DLC Clear Trust**, not a standalone CommercialKonnect brokerage. Footer disclosure must name DLC Clear Trust. The "Mortgage Lending" category on this record **conflicts with R04's "lending category has no in-force date"** — flag for counsel before any lender/funding-source positioning (B3). Do not resolve off a register line.

---

## Lender records (seed — verify before publish)

Sourced from the Notion "CommercialKonnect OpenSEO — Project Knowledge Hub" (checked 2026-10-22) plus repo `landing-pages/financing/private-lender-bc.html`. **All rate/LTV figures are lender marketing, dated, and must be re-confirmed at publish (claim register + "last verified" stamp per GEO/§6).**

### 1. Fraction (Fraction Technologies Inc.)
- **Regulator:** FSRA #13439 (**Ontario** regulator — *not* BCFSA). BC lending registration must be independently validated before any BC-facing claim.
- **Territory:** BC, AB, ON · **first mortgage only** · 660+ Beacon
- **Products (rate sheet eff. 2026-10-15, marketing, re-confirm):**
  - Interest-Only 12mo 5.16% / 18mo 5.23%; $100k–$1.5M; max 65% LTV purchase, 60% refi; condo 60%
  - No-Payment (capitalized interest): 24mo ≤55% LTV @5.94%, 36mo ≤51%, 60mo ≤45%; $100k–$1.5M — **not interest-free; balance compounds**
  - Jumbo $1.5M–$5M: 5.63%–6.58% by band, LTV 60–65%
  - **Holdco/Opco title eligible** (IO/No-Payment/Jumbo): +25 bps, shareholder personal guarantees, 100 bps broker fee
- **Contact:** Vimal Singh (BC/AB BDM), Vimal@fraction.com, (236) 801-1027
- **Status:** [UNVERIFIED — FSRA not BCFSA]. Source: lender marketing email, not underwriting guidelines.

### 2. Glasslake Funding
- **Source:** glasslake.ca, glasslake.ca/broker-resources (checked 2026-10-22)
- **Products:** residential bank-statement (6 months) for self-employed/investors; residential interest-only (conditions); **small commercial** subject-property approach, advertised ≤75% LTV, min DSCR 1.00x on qualifying deals
- **Caveat:** does NOT establish the commercial product uses the 6-month bank-statement program. Confirm guidelines/rate sheet/fees + BC licence directly.
- **Status:** [UNVERIFIED — BCFSA check pending]

### 3. BC credit unions
- **Source:** ClearClose brief → Central 1 BC credit-union directory link (not underwriting rules). Vancity named in SERP research as the one BC CU with commercial-mortgage presence.
- **Status:** [DIRECTORY LINK ONLY — individual CUs not compiled/verified]

### 4. Repo directory (24 entries)
- **Source:** `landing-pages/financing/private-lender-bc.html` — 24 lenders written **without verification** (R03 Blocker 2; R05 task).
- **Status:** [UNVERIFIED — must verify each against BCFSA register or delete the "every lender is BCFSA-registered" claim]. **Highest-exposure item in the build.**

---

## Build-out actions (WordPress `lender` CPT)

1. **Schema the CPT** with fields that force provenance: `name`, `regulator` (BCFSA / FSRA / none), `licence_no`, `verification_status` (verified / unverified / not-applicable), `verified_date`, `source_url`, `territory`, `products[]`, `ltv`, `dscr`, `rate_asof`, `contact`. No entry renders publicly unless `verification_status = verified` OR the page carries the "directory, not a registration claim" disclaimer approved by counsel.
2. **Run the SOP — Lender Due Diligence Checklist** (Notion page `3f59e94c…`) against each of the 24 repo entries + Glasslake + Fraction before any go-live.
3. **Pull remaining lender data** from the Notion hub (Content Bible `4029e94cf0a481faae91d3498b6c06eb`, Holdco/Opco brief `4029e94c-f0a4-8147…`) into this file as the directory is built.
4. **Claim register + freshness:** every rate/LTV/DSCR gets a source + date; monthly review for rates/directories, quarterly for CMHC program terms.

---

## Open items

- [ ] Verify the 24 repo lenders against the BCFSA register (B2) — or drop the blanket registration claim.
- [ ] Counsel: reconcile the MB144231 "Mortgage Lending" category vs R04 (B3) before lender positioning.
- [ ] Confirm Fraction's BC registration (FSRA ≠ BCFSA).
- [ ] Compile BC credit unions from the Central 1 directory.
