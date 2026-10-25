# CommercialKonnect homepage prototype — engineering handoff

**Reference date:** 2026-10-24  
**Status:** Functional stand-alone HTML demo and consolidated HTML PRD; **not** a WordPress deployment, live application intake, or production marketplace.

## Reference artifacts
- [Interactive homepage demo](../prototype/commercialkonnect-homepage.html) — open locally in a browser. The five-step journey and slider run in the browser; the form does **not** transmit applicant information.
- [Website PRD v3 — HTML](./COMMERCIALKONNECT_WEBSITE_PRD_v3.html) — formatted reference for product/design review.
- [Canonical implementation PRD](./COMMERCIALKONNECT_PRD.md) — sections 15–19 for rate comparison, acquisition, homepage, progressive capture and slider/wizard behavior.
- [Prior frontend integration plan](./FRONTEND_INTEGRATION.md).

## What the prototype demonstrates
Borrower-first homepage; product-specific amount slider and presets; editable financing amount; geographic targeting; financing categories; secured/unsecured education; five-step progressive inquiry and illustrative preliminary results; optional contact collection; financing guides; and a broker-facing discovery path.

## Production handoff — ordered vertical slices
1. **Public CMS:** Implement homepage copy, header/footer, six product cards, resources, comparison and disclaimer as semantic Gutenberg patterns using Astra Free. Confirm WordPress MCP Ultimate actions against a draft, not production.
2. **Interactive module:** Rebuild hero selector and progressive assessment as a reusable `commercialkonnect-components` Gutenberg block in React/shadcn; persist selection and form state across navigation. Preserve manual precision at large amounts; responsive and accessible controls. Keep a no-JS fallback.
3. **Assessment backend:** Server-authenticated/validated anonymous assessment session with TTL, product-specific schema, result rules and trusted first/last-touch attribution in Supabase; implement careful retention/privacy controls. No personal info required for educational results.
4. **Explicit enquiry and permissions:** Name, business, email and phone requested only on opt-in for personalized comparison or professional introduction; separate operational referral/lead sharing consent from optional marketing consent, with notice/version/timestamp and right-to-withdraw tracking.
5. **Qualification and routing:** Verification queue, contactability and interest confirmation, broker buy-box filtering, platform vs broker-originated attribution, contractual exclusive/shared allocation, lead acceptance/rejection and Atomic CRM mapping. Do not classify a business signal as confirmed financing interest.
6. **Commercialization:** Add subscription/lead credit wallet and audited purchasing only after supply, consent, legal review, refund rules and Stripe/Billr integration are tested. Count earned marketplace revenue on fulfilled deliveries rather than wallet purchase alone.
7. **Traffic and optimization:** Launch source-backed SEO/AIO pages and approved paid traffic after measurable attribution, fraud prevention and funnel events exist; audit real rates, sponsored content and Canadian licensing obligations.

## Nonproduction limitations and safeguards
- Slider and assessment logic in the HTML file are demonstration only; they **do not** establish lending eligibility, lender matching, current rates or approval.
- The contact step is a UI demo; **do not use the HTML artifact to solicit, submit or store live applicant data**. A real application requires secure API endpoints, PIPEDA/provincial privacy review, consent capture and backend storage.
- No WordPress theme, Gutenberg plugin, CRM, Supabase schema, lead routing, credit transactions or production website deployment was changed by adding these files.
- No claim of verified third-party lead inventory, lender pricing or real-time search ranking is supported by the prototype.

## MVP acceptance criteria
- Financing amount slider, presets and typed input synchronize, with exact large values and an accessible mobile/keyboard interaction.
- Homepage values prefill the adaptive assessment once, without repeated questions; anonymous comparison remains accessible.
- Buyer contact data is requested at an explicit contact gate, validated server-side and associated with separately audited permissions.
- Source and broker campaign attribution survive handoff, protected from client spoofing.
- Verified qualified leads can be matched by broker buy-box, and no contact is shared outside the authorized tenant/recipient scope.
- Unit metrics distinguish anonymous starts, submitted inquiries, verified financing interests, buyer-accepted leads and funded outcomes.

## Developer note
Use the HTML as a *design reference*, not an import-and-deploy replacement for the Next.js broker portal or the WordPress site. Do not paste an unsafe localStorage or browser-only contact capture directly into production. Keep `docs/COMMERCIALKONNECT_PRD.md` authoritative if simplified HTML exhibits ambiguous behavior.
