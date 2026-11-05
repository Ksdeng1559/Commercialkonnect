# Mission Control browser-local reference

Synced October 17, 2026 from Sites source revision `0a7ad2f735a7141523fee0eac179cba49b094ac3`.

Serve this directory with a static server and open `index.html`. This is a buildless reference using localStorage `kommercial-v1`, not the production Next.js app. Do not enter private borrower records. No Sites manifests, credentials or visitor state are included.

Views include Client Brain, opportunities/qualification, capital Kanban, GTM, local appointments/outcomes, Chief of Staff manual planning, a dated ClearClose aggregate inventory note, Content Bible drafts, billing simulation, Market Intelligence, PMF pilot validation and Client Briefings. The briefing workflow uses the October 12 Social Intelligence skill v1.1: four formats, eleven report sections, evidence labels/dates, stable claim IDs, Brain snapshots, manual review and text exports. Exa/Tavily/Serper calls remain unimplemented; research handoff downloads are prompts only.

Market news is curated and dated, not an automatic feed. Bank of Canada yields use an explicit refresh against its public endpoint; seeded closes have their own observation date. The endpoint returned HTTP 200 with CORS during development, but hosted browser refresh is unverified. Zoning proposal/adoption/effect and broker interpretation remain distinct. Pilot evidence starts empty, with manually asserted paid-team outcomes separate from synthetic CRM totals. Billing simulation issues no invoices or payments. No CRM/database/calendar/outbound adapter is connected.

Checks (limited domain and DOM stubs, not real-browser or provider integration):

```sh
node --check app.js
node verify-reference.cjs
node verify-chief.cjs
node verify-latest.cjs
node verify-market.cjs
node verify-pilot.cjs
node verify-briefing.cjs
```

Managed preview could not start because the container could not mount `/proc`; no browser/end-to-end success is claimed. Prototype source is a UX reference to port into typed Next.js modules, not code to copy wholesale into the application.
