# CommercialKonnect.ca — Business-Funding Lead Engine (+ rank-and-rent)

**Version:** 1.0 | **Date:** 2026-11-05 | **Status:** Design, pending implementation plan

## Summary

A lean WordPress (Astra) lead-generation site that ranks for high-intent BC business-funding
terms, captures consented funding inquiries from local business owners, and persists them to the
Supabase `ck` schema as canonical lead records. Autoresponse is dual-channel: email (Resend) always,
SMS (Twilio) on explicit consent. Phase 2 converts the ranked money pages into rentable assets,
exclusive lead flow per niche and geography rented to one broker for recurring rent.

North star: business funding leads generated.

## What this is not

Not a two-sided marketplace at launch. Broker self-serve, the `financing_offer` CPT, Clerk
organizations, and the attribution engine from `COMMERCIALKONNECT_FINANCING_DIRECTORY_PLAN.md` (v2.0)
stay shelved. Renting lead flow does not require that machinery, and building it first delays the
first lead. The v2.0 marketplace remains a valid later direction, not a dependency here.

## Stack

- **Astro 6 on Vercel.** Static-first content site; superb Core Web Vitals and SEO, the whole point
  of a rankable asset. Tailwind v4 via `@tailwindcss/vite`. The `@astrojs/vercel` adapter is added
  only when a route needs SSR/API (the `/apply` POST). This supersedes the earlier WordPress + Astra
  idea: Astra is a WordPress theme and cannot run on Vercel; "Astro" was the intended framework.
- **Sanity** as headless CMS for non-developer content editing of money pages and copy. Deferred
  until content needs editing outside git.
- **Supabase `ck` schema** is the canonical lead store. RLS is already live on `ck`
  (project `amgknqnhiscryvcfeoyj`, ClearCloseDesk).
- **Server-side form endpoint.** The inquiry form posts to an Astro server endpoint (Vercel adapter)
  that validates, rate-limits, and writes to Supabase. The Supabase key stays server-side.
- **Resend** for email autoresponse to the owner and alert to the operator.
- **Twilio** (sender +16043305638, Vancouver number) for SMS autoresponse to the owner on consent,
  and for operator/renter alerts and two-way reply handling.

This supersedes, for this product, the WordPress + Astra and Divi decisions and the Lovable
public-frontend choice in `FRONTEND_INTEGRATION.md`. Astro on Vercel governs the public surface.

## Page architecture (the rentable unit)

Launch with 5 to 8 deep, genuinely useful money pages, BC-first. Each page targets one high-intent
funding niche in one geography and is itself the unit rented in Phase 2.

```
/business-loans-vancouver/            money page = one rentable territory
/equipment-financing-bc/
/commercial-mortgage-vancouver/
/working-capital-bc/
/business-acquisition-financing-bc/
  + /apply/   shared inquiry funnel
  + /blog/    supporting content, internal links into money pages
```

Each money page carries intent-matched content, trust signals (MB144231 licence display,
disclosures), and one clear inquiry CTA. Expansion to more products and cities happens only after
the first set ranks and produces leads. This holds the existing "no thin pages" rule: a page with
nothing real to say does not ship. A programmatic product-by-city matrix is explicitly rejected for
thin-content and cannibalization risk.

The exact first targets are confirmed against OpenSEO keyword data before the P1 build (see open
questions).

## Data flow

```
Owner → money page → /apply form (consent checkboxes, UTM captured)
   → server endpoint (validate, rate-limit)
   → Supabase ck.leads  (canonical record)
   → Resend: email autoresponder to owner + alert to operator
   → Twilio: SMS autoresponder to owner IF sms_consent, + operator/renter alert
Phase 2: lead (niche, geo) → routing rule → assigned renter broker
```

## Lead record (Supabase `ck`)

A `ck.leads` table (new, or an extension of an existing intake table), tenant-scoped under the live
RLS model. Fields:

- Source: page slug, niche, geography.
- Intent: funding product, amount band, timeframe.
- Contact: name, business, email, phone.
- Consent: `email_consent` (bool + timestamp), `sms_consent` (bool + timestamp), kept separate.
- Channel: UTM and referrer.
- Delivery audit: Resend message id, Twilio message SID.
- Assignment: renter broker, null until Phase 2.

This record is the attribution backbone that makes rank-and-rent routing possible later.

## Rank-and-rent layer (Phase 2, designed for now)

- **Exclusivity:** one renter per (niche × geo) page. Flat monthly rent, not pay-per-lead. Simpler
  to sell and bill, and the classic rank-and-rent model.
- **Routing:** on lead insert, match (niche, geo) to the active renter and forward the lead by SMS
  or webhook, then mark the lead assigned. Fast broker response raises conversion, which raises the
  page's rentable value.
- **Pooling fallback:** a page with no current renter pools its leads to the operator. The page
  still ranks and accrues value.
- **Swappable renter:** assignment is data, not code. Changing the assignment redirects the lead
  flow with no deploy.

## Compliance

Carried from the existing plans, sharpened for SMS:

- No approval or rate guarantees anywhere. Indicative terms only, labeled as such.
- **CASL, email:** consent, sender identification, and unsubscribe on every email.
- **CASL, SMS:** SMS consent is separate from email consent. The form carries an explicit "text me"
  checkbox; a typed phone number is not treated as consent. Twilio STOP and opt-out is honored
  automatically and persisted; sending after STOP is a violation. Every autoresponder SMS identifies
  the sender (CommercialKonnect) and carries opt-out.
- **PIPEDA and BC privacy** on every stored lead.
- Licence display tied to MB144231. The unresolved BCFSA lending-category question remains open and
  must be reflected in any licence-based claims.
- Supabase key and Twilio and Resend credentials stay server-side. Never in WordPress content, never
  in git.

## Delivery sequence

- **P0 — Foundation.** Astro site skeleton (home page shipped), SEO/schema, `ck.leads` table,
  server form endpoint, Resend and Twilio wiring. Acceptance: one test inquiry lands in Supabase and
  both the email and (on consent) SMS autoresponses fire, with delivery ids stored.
- **P1 — Money pages and funnel.** Build the 5 to 8 money pages with real content, the `/apply`
  funnel, schema markup, and reviewed consent and compliance copy. Acceptance: pages live and
  indexable, inquiry works end to end, SMS fires only with the consent box ticked.
- **P2 — Rank-and-rent routing.** Assignment table, (niche, geo) to renter forwarding, pooling
  fallback. Acceptance: a test lead routes to a test renter; reassignment redirects the flow with no
  deploy.
- **P3 — Expand and tune.** Add pages by proven demand, rank tracking, conversion tuning.

## Metrics

North star: qualified funding leads per month. Supporting: organic impressions and position for the
money-page terms, page-to-inquiry rate, inquiry-to-contact rate, SMS consent rate, autoresponse
delivery rate, and (Phase 2) leads routed per rented territory and renter retention.

## Approaches considered

- **Chosen:** lean Astro-on-Vercel funnel, prove leads, then add the rent layer.
- Rejected: full v2.0 marketplace first (heavy, slow to first lead, mostly unused if the goal is
  renting lead flow). Programmatic city-by-product matrix (thin-content risk, violates the no-thin-pages
  rule). Lovable SPA (weak SEO, prior audit found client-side-only rendering and duplicate meta).

## Open questions

1. **Form endpoint host.** A Next.js API route in this repo, or a standalone serverless function.
   Leaning toward a small Next.js route already deployable here.
2. **First money-page targets.** Confirm the exact 5 to 8 niche-and-city pages against OpenSEO
   keyword data before the P1 build. The slugs above are defaults.
3. **Rent pricing and terms.** Flat monthly range per territory. Deferrable to Phase 2.
4. **Domain and licensing optics.** Rank-and-rent on commercialkonnect.ca itself versus brand
   separation from the licence holder. Check any BCFSA advertising implications of renting a
   licensed-broker-presenting site to a different broker.

---

> **Provenance:** New direction, 2026-11-05. Relates to and partially supersedes
> `COMMERCIALKONNECT_FINANCING_DIRECTORY_PLAN.md` (v2.0 marketplace, now deferred) and the Divi and
> Lovable choices in `COMMERCIALKONNECT_WORDPRESS_EXECUTIVE_PLAN.md` and `FRONTEND_INTEGRATION.md`.
> Builds on `LENDER_DIRECTORY.md`, the live `ck` schema, and the Twilio and Resend integrations.
