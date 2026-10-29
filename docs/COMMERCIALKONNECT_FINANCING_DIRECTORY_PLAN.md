# CommercialKonnect.ca — Financing Offer Directory Plan
**Version:** 2.0 | **Date:** 2026-10-23 | **Status:** Refactor of the v1.1 WordPress Executive Plan, recentered on a directory product

## What this refactor changes
Version 1.1 framed CommercialKonnect as a marketing site plus a broker campaign engine, with a "broker-driven distribution flywheel" as the core growth mechanism. The content architecture was 50 SEO landing pages; the directory was one row in that table.

This version makes the directory the product. The central object is a **financing offer**: a specific, structured financing product a lender or broker is willing to place, described in terms a business owner can filter and compare. Everything else — guides, geographic pages, broker profiles, outbound campaigns — becomes supporting infrastructure around that spine.

The reframe does not discard v1.1. The compliance rules, the Supabase-as-system-of-record decision, the WordPress-plus-Divi stack, and the staged delivery discipline all carry forward. What moves is the center of gravity: from publishing pages to curating a searchable, trustworthy catalog of financing offers that connects two audiences.

## The two audiences and the single connection
- **Business owners and commercial property investors (demand side).** They arrive with a need — buy a building, refinance, fund equipment, bridge a gap — and want to see which financing options realistically fit before talking to anyone. They search and filter the directory, shortlist offers, and request an introduction.
- **Commercial finance brokers (supply side).** They hold relationships with lenders and the ability to place deals. They publish offers into the directory, keep them current, and receive attributed introductions from owners whose needs match what they listed.

The directory is the handshake. An owner filters to offers that fit; a broker's listed offer surfaces in that result; the owner requests contact; the introduction routes to the broker who owns that listing, under consent and attribution rules. No approval or rate is ever promised by the catalog itself.

## Core object: the financing offer
A financing offer is a first-class record, not a paragraph on a page. Each offer carries structured fields so it can be filtered, compared, and governed:

- **Identity:** offer title, owning broker, backing lender (where disclosable), status (draft / under review / published / paused / expired).
- **Product classification:** financing product type (commercial mortgage, refinance, construction, equipment, business acquisition, working capital, asset-based, bridge, CMHC-insured, and so on).
- **Fit criteria:** amount range (min/max), eligible industries, eligible commercial property types, eligible geographies (BC-first), borrower stage or qualifications where appropriate.
- **Indicative terms:** rate type (fixed/variable/indicative range, clearly labeled as indicative and subject to qualification), term length, amortization, LTV ceiling, typical time-to-fund. All presented as ranges or typical values, never guarantees.
- **Provenance and governance:** source of the information, date last verified, who verified it, licensing/disclosure text, and the publication gate state. This mirrors the provenance model already built for the Lender custom post type in `wp/` (see `LENDER_DIRECTORY.md`).

An offer that lacks required provenance or disclosure fields cannot publish. That gate already exists for lenders and extends naturally to offers.

## Data model
Three custom post types and a shared taxonomy set, so offers, the lenders behind them, and the brokers who list them stay normalized rather than duplicated across pages.

- **`lender`** (exists): the institution or capital source. Provenance-gated. Offers reference a lender.
- **`broker`**: the verified commercial finance broker. Holds licence/credential verification state, territory, and specialties. A broker owns the offers they publish.
- **`financing_offer`** (new): the record above. References one broker (owner) and, where disclosable, one lender.

Shared taxonomies used for filtering across all three:
- `product_type` — the financing product
- `industry` — eligible industries
- `property_type` — commercial property categories
- `region` — geography, BC-first (province → region → city)
- `amount_band` — bucketed loan size for coarse filtering

Supabase remains the canonical system of record for anything transactional or personal: introduction requests, consent, attribution, assignment, broker verification state, and audit. WordPress holds the public catalog and its taxonomies. Where an offer's authoritative data lives in Supabase, WordPress renders a synchronized projection, not the master copy. Verify through WordPress REST/MCP what can be written programmatically before assuming the full offer schema is automatable; WP MCP Ultimate exposes posts, pages, taxonomies, and media, but custom offer fields may need a custom integration.

## Two-sided journeys
**Business owner (search → shortlist → introduction):**
Land on the directory → filter by product, amount, industry, property type, region → compare offers side by side → open an offer detail → request an introduction via a short, consented assessment → the request persists to Supabase with attribution to the listing's broker → the owner gets a confirmation and the broker gets a qualified, matched introduction. The owner never receives an approval or a locked rate from the catalog; they receive a relevant conversation.

**Broker (verify → list → maintain → receive):**
Register and pass licence/credential verification → create a broker profile (territory, specialties) → publish one or more financing offers against the structured schema → offers pass the provenance/disclosure gate before going live → offers surface in matching owner searches → the broker receives attributed introductions and manages them in the broker app. Listing an offer is self-service; publishing is gated on verification and provenance.

## WordPress and Divi responsibilities
- Divi Theme Builder supplies the global header/footer, design tokens, and responsive shell.
- Templates to build: the **directory index** (faceted search/filter over `financing_offer`), the **offer detail** template, the **broker profile** template, the **lender profile** template, and supporting product/industry/property/region hub pages that each lead into a filtered directory view rather than standing as thin SEO pages.
- Faceted filtering is the hard part. Decide early whether filtering is served by WordPress query vars over the taxonomies, a search plugin (e.g. FacetWP-class capability), or a Supabase-backed API the front end calls. This is an open decision below; do not assume Divi ships production-grade faceted search.
- Publish and maintain offers via Claude Code + WP MCP Ultimate where the schema allows. Prove the full offer create/update path on one draft offer before any bulk load, exactly as v1.1 required for landing pages.
- WordPress is not the lead database, the matching engine, or the CRM. It is the public catalog and its filters.

## Directory information architecture
Public IA shifts from a flat marketing nav to a directory-first nav:

**Home | Browse Financing Offers | By Product | By Industry | By Property | Find a Broker | For Brokers**

URL structure favors the directory:
- `/offers/` — the faceted directory index
- `/offers/{slug}/` — individual offer detail
- `/financing/{product}/` — product hub → pre-filtered directory view
- `/industries/{industry}/`, `/properties/{type}/`, `/bc/{region}/` — hubs that each resolve to a filtered offer list
- `/brokers/{slug}/` — broker profile with that broker's live offers
- `/lenders/{slug}/` — lender profile (provenance-gated)

Hub pages earn their place by resolving to real, filtered inventory. If a hub would show an empty or near-empty offer list, it does not ship yet. This is the v1.1 "no thin pages" rule applied to a directory: a page with nothing to list is a thin page.

## Offer lifecycle and the publication gate
1. **Draft** — broker enters offer against the schema. Private.
2. **Under review** — submitted; provenance, disclosure, and licensing checks run. A missing required field blocks progress.
3. **Published** — gate passed; offer is live and filterable.
4. **Paused** — broker or platform temporarily hides it (capacity, program closed).
5. **Expired** — passed its last-verified freshness window; auto-drops from public results until re-verified.

The freshness window matters for trust. An indicative rate from eight months ago is a liability. Offers carry a last-verified date and fall out of public view when stale, rather than silently misleading an owner.

## Attribution and lead model
Carried forward from v1.1, scoped to the directory:
- Each introduction request records the originating offer, its owning broker, the owner's filters/intent, channel/UTM, consent state, and timestamp — server-side in Supabase.
- An introduction generated from a broker's own listed offer defaults to that broker, subject to contract, consent, and regulatory rules. Do not silently resell a matched introduction.
- Platform-originated demand (organic search landing on the directory, platform paid) follows transparent, separately-agreed distribution terms.
- Ownership and contractual routing are kept distinct from the data subject's consent and privacy rights. Routing a lead is not the same as having consent to contact.

## Security and compliance
Unchanged in intent from v1.1, sharpened for a catalog of financial offers:
- No unsupported approval or rate claims anywhere in the catalog. Indicative terms are labeled indicative and subject to qualification.
- Broker licensing and credential verification gate the ability to publish offers (note the unresolved BCFSA lending-category question tracked for MB144231).
- CASL outreach eligibility, identification, and unsubscribe; PIPEDA/BC privacy obligations for every introduction request.
- Financial promotion review on offer templates and disclosure text before launch.
- Role-based tenant isolation; audit offer publication, edits, pauses, introduction exports, and reassignment.
- Keep API credentials and lender/broker agreements out of WordPress content and out of GitHub.

## Delivery sequence and acceptance criteria
**P0 — Foundation and schema.** Confirm/activate licensed Divi on local WP (`http://localhost:8090`). Define and register the `financing_offer` and `broker` CPTs and the shared taxonomies alongside the existing `lender` CPT. Extend the provenance publication gate to offers. Acceptance: a single draft offer created via WP MCP Ultimate, passing and then failing the gate on purpose to prove it holds.

**P1 — Browsable directory (demand side).** Build the directory index with real faceted filtering, the offer detail template, and product/industry/property/region hubs that resolve to filtered lists. Seed a small set of verified, provenance-complete BC offers. Acceptance: an owner can filter to a fitting offer and reach a complete, disclosure-correct detail page; no thin hubs shipped.

**P2 — Broker listing and introductions (supply side + handshake).** Broker verification/profiles, self-service offer creation against the gate, and the consented introduction request flow persisting to Supabase with correct attribution to the listing broker. Acceptance: a verified test broker publishes an offer; a test owner requests an introduction; the record lands in Supabase attributed correctly, end to end.

**P3 — Freshness, trust, and reach.** Offer expiry/re-verification, lender profiles, SEO for hubs backed by real inventory, and consent-safe analytics. Optional paid/outbound reach (Explee, Ryze) only after their APIs and tenant boundaries are validated, kept as adapters behind a shared interface.

**P4 — Scale and intelligence.** Expand product/geography coverage by validated demand and available inventory, matching improvements, broker performance reporting, billing, and conversion experiments. Grow the catalog on real offers and real demand, not page count.

## Metrics
**North star:** qualified introductions generated per active broker per month (an introduction where the owner's need matched the offer's fit criteria and consent was captured).

Supporting: published offers per active broker, offer freshness rate (share of live offers verified within window), directory search-to-shortlist rate, shortlist-to-introduction rate, introduction-to-conversation rate, filter coverage (share of searches returning ≥N fitting offers), broker retention, and per-channel contribution margin.

## Decisions carried forward and new
Carried from v1.1:
- WordPress + Divi is the public stack. Supabase is the system of record. Work on local Docker first.
- Self-service for brokers is an MVP goal, not managed-only.
- Explee and Ryze remain planned, validation-pending integrations.

New in v2.0:
- **The financing offer directory is the product.** SEO content and campaigns support it; they are not the center.
- **`financing_offer` and `broker` join `lender` as provenance-gated CPTs.** The existing lender gate is the pattern.
- **Hubs must resolve to real filtered inventory** or they do not ship.
- **Offers expire on a freshness window** and drop from public results until re-verified.

## Open questions
1. **Faceted search engine.** WordPress query vars, a search/facet plugin, or a Supabase-backed API consumed by the front end? Affects P1 heavily. Recommendation: prototype the Supabase-backed path first, since offer truth increasingly lives there.
2. **Offer master location.** Do offers originate in WordPress and sync to Supabase, or originate in Supabase and project to WordPress? Leaning Supabase-as-master for anything an introduction attaches to.
3. **Frontend conflict.** `FRONTEND_INTEGRATION.md` names the Lovable site as the public frontend; this plan names WordPress + Divi. One must govern. Needs an explicit decision before P1 build.
4. **Broker verification depth.** What licence/credential checks gate offer publication, and how is the unresolved BCFSA lending-category question for MB144231 reflected in the gate?

---

> **Provenance:** Refactor of `COMMERCIALKONNECT_WORDPRESS_EXECUTIVE_PLAN.md` (v1.1, imported 2026-10-23 from `github.com/Ksdeng1559/KonstructionComOS`). Builds on `LENDER_DIRECTORY.md`. Supersedes v1.1 for implementation. Conflicts with `FRONTEND_INTEGRATION.md` on public-frontend choice — see open question 3.
