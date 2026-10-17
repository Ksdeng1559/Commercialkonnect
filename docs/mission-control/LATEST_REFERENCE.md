# Latest reference status — October 17, 2026

Private UX reference: https://broker-mission-control.dennis-klicksmartai.chatgpt.site

GitHub static reference is synchronized from Sites source revision `0a7ad2f735a7141523fee0eac179cba49b094ac3`. It contains no browser-state exports or secrets. This is not a port into production Next.js.

| Area | Working reference behavior | Production dependency / limit |
| --- | --- | --- |
| Client Briefings | Four modes, report sections, evidence labels/dates, stable IDs, Brain snapshot, draft/review/export, opportunity entry, Chief stand-up summary | Manual research only; see CLIENT_BRIEFINGS.md and RESEARCH_PROVIDERS.md |
| Research providers | Skill-derived downloadable research prompt | Exa/Tavily/Serper adapters not implemented; no API credentials configured or live run claimed |
| Market Intelligence | Curated dated financing/news/zoning notes, source links/status, profile relevance, saved context/content prompts, on-demand Bank of Canada yield refresh | Not an automatic news feed. Official API HTTP/CORS check passed; hosted-browser refresh unverified. Yields are government closes, not mortgage quotes |
| Pilot validation | PMF plan, pricing experiments, assumptions and empty paid-team evidence register; segment totals separate from sample CRM | Manual assertions, not verified payments/usage/PMF. Broker-first; contractor/CRE specialist CRM workflows remain planned |
| Data readiness | Dated aggregate ClearClose inventory audit note | No live tenant project/contact feed or source-refresh connection. Counts are not current guarantees |
| Content & billing | Local drafts/review notes and contract-rule simulation | No publication, DMs, invoices, Stripe/Billr or payment collection |

PMF plan is supplied October 14 research, with its source copy at `prototype/pmf-source.md`. Expanded core subscription models ($125.22m Canadian TAM / $12.72m planned BC SAM) and $500/month pricing are assumptions, not measured software spend or traction. Separate broker pool is unverified. Interview 28 prospects, test eight mixed-segment paid pilots (3 broker/3 contractor/2 CRE), and evaluate proposed activation/usage/renewal/meeting/data-quality gates by segment; see the source plan for definitions. No customer results were imported into the prototype.

Verification: source syntax plus six reference/chief/latest/market/pilot/briefing domain/DOM-stub suites passed. Browser QA unavailable due managed preview infrastructure. No Next.js or provider/backend integration checks are claimed from these results.

Port behavior into typed React components and durable tenant-aware records under the existing MC dependencies. The newer reference fixes earlier sample-period outcome filtering and held-date handling; its local scheduling and cancellation shortcuts still require production redesign. Parallel branches/PRs remain subject to MC-00 reconciliation; this update does not merge them or perform database migrations.
