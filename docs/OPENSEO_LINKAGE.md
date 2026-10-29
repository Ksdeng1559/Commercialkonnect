# OpenSEO → CommercialKonnect Linkage

**Source of truth:** live OpenSEO MCP (`http://127.0.0.1:3005/mcp`), project
`7f4bbe03-f30f-4eeb-b648-d64985be70a1`.
**Pulled:** 2026-10-24 via `list_saved_keywords` with `{"projectId": "...", "limit": 100}`.

> The DuckDB mirror at
> `/home/denni/wiki/clients/open-seo/.local_tier/clients/open-seo.duckdb` does
> **not** contain this project. It is stale. The live MCP is authoritative and
> everything below comes from it.

---

## 1. What the live pull returned

| Metric | Value |
|---|---|
| Saved keywords | **65** |
| With search volume | **43** |
| No volume data | 22 |
| Explicitly rejected (2026-10-23) | 6 |

### Tag distribution

| Tag | Count | Meaning |
|---|---|---|
| `serp-scanned-2026-10-17` | 35 | SERP reviewed |
| `kommercial-connect-2026-10-17` | 33 | Kommercial Connect research set |
| `blue-ocean-priority` | 20 | Blue-ocean targets |
| `broker-phrase-gap` | 20 | Broker-phrase gaps |
| `bc` | 14 | BC geo |
| `construction` | 14 | Construction vertical |
| `fresh-metrics` | 14 | Metrics refreshed 2026-10-17 |
| `broader-search` | 10 | Broad head terms |
| `commercial-mortgage` | 10 | Commercial mortgage cluster |
| `bc-local` | 10 | BC local intent |
| `pbr-multifamily` | 9 | Purpose-built rental |
| `commercialkonnect-2026-10-24` | 6 | Latest CommercialKonnect set |
| `rejected-2026-10-23` | 6 | Rejected |
| `multifamily` | 5 | Multifamily |
| `empty-serp` | 3 | Empty SERP |
| `long-tail-only` | 3 | Long-tail only |
| `blue-ocean` | 2 | Blue ocean |
| `commercial-intent` | 2 | Commercial intent |
| `highest-opportunity` | 2 | Highest opportunity |

### Rejected — do not target

`holdco mortgage` · `opco loan bc` · `holdco` · `opco mortgage` ·
`opco mortgage canada` · `opco`

These were rejected on 2026-10-23 and carry no volume. The holdco/opco
structure is a deal-engineering concept, not a search behaviour. Targeting
them would build pages nobody searches for. **Excluded from every cluster
below.**

---

## 2. Cluster architecture

### Cluster A — Private lender (commercial intent)

| Keyword | Volume | KD | CPC |
|---|---|---|---|
| private lender | 1000 | 0 | $15.26 |
| private lender bc | 210 | 0 | $15.60 |
| private lender canada | 590 | 46 | $12.10 |

Highest CPC in the set, zero difficulty on the BC variant. This is the
monetisation anchor — the term a broker actually pays for.

### Cluster B — Broker phrase gap

| Keyword | Volume | KD | CPC |
|---|---|---|---|
| commercial mortgage broker | 590 | 0 | $11.66 |
| commercial mortgage broker vancouver | 20 | ? | $7.66 |
| commercial mortgage broker bc | 10 | ? | $5.26 |
| commercial mortgage broker canada | 20 | ? | $1.43 |

Low volume, high intent, zero difficulty. The gap is that incumbents rank
for the *product* term and not for the *broker* phrase.

### Cluster C — Commercial mortgage (head terms)

| Keyword | Volume | KD | CPC |
|---|---|---|---|
| commercial mortgage | 880 | 9 | $11.53 |
| commercial mortgage rates | 720 | 16 | $4.52 |
| commercial mortgage canada | 140 | 3 | $10.51 |

### Cluster D — Bridge & mezzanine

| Keyword | Volume | KD | CPC |
|---|---|---|---|
| bridge financing | 1000 | 0 | $6.98 |
| bridge loan | 1000 | 23 | $10.61 |
| mezzanine financing | 320 | 7 | $5.51 |

Zero difficulty on the two biggest terms. A gap that closes fast if left.

### Cluster E — Construction financing (BC + national)

| Keyword | Volume | KD | CPC |
|---|---|---|---|
| bc loans | 1300 | 6 | $9.01 |
| commercial construction financing | 90 | 8 | $7.62 |
| construction financing canada | 110 | 1 | $4.86 |
| construction mortgage bc | 70 | 0 | $9.02 |
| construction financing bc | 50 | 9 | $6.42 |
| construction loan bc | 50 | 9 | $6.42 |
| construction to permanent financing | 90 | 0 | ? |
| cmhc construction financing | 70 | 35 | $8.43 |
| vancouver commercial property for sale | 480 | 8 | $1.15 |
| vancouver land assembly | 50 | 0 | ? |

### Cluster F — CMHC / PBR multifamily

| Keyword | Volume | KD | CPC |
|---|---|---|---|
| cmhc mli select | 1300 | 0 | $3.61 |
| aclp cmhc | 320 | 1 | $11.46 |
| cmhc aclp | 260 | 0 | ? |
| apartment construction loan program | 210 | 16 | $6.99 |
| purpose built rental vancouver | 110 | 0 | $1.49 |
| cmhc apartment construction loan program | 90 | 4 | $1.33 |
| rental construction financing initiative | 20 | 2 | ? |

### Cluster G — BC local / empty SERP

Three keywords carry `empty-serp` **and** `long-tail-only`:

- `commercial construction financing vancouver`
- `vancouver purpose built rental financing`
- `multifamily construction loan vancouver`

No volume data, no competing results. These are the cheapest wins on the
board — a page can rank here because nothing else has tried.

---

## 3. Linkage into this repository

| Cluster | Lands in | Existing artefact |
|---|---|---|
| A, B | `/lenders` directory + broker landing pages | `docs/LENDER_DIRECTORY.md`, `wp/mu-plugins/ck-lender-cpt.php` |
| C, D | `/financing/*` product pages | `docs/COMMERCIALKONNECT_FINANCING_DIRECTORY_PLAN.md` |
| E | `/blog` construction-finance content | `docs/SEO_PLAN.md` |
| F | CMHC/PBR content + lender profiles | `docs/SEO_PLAN.md` |
| G | Geo landing pages | `docs/SEO_PLAN.md` |

### The linking insight

The lender directory is the supply side; the keyword clusters are the demand
side. Each scraped lender is scored against the clusters it can actually
serve:

- A lender whose pages mention **commercial mortgage** + **British Columbia**
  can serve Clusters A, B, C, E.
- A lender whose pages mention **bridge financing** serves Cluster D.
- A lender whose pages mention **CMHC / rental construction** serves Cluster F.

This is why scraping was done before writing content: the directory cannot be
populated from keyword data, and the content cannot be written without knowing
which lenders can back which cluster. Scraping first resolves the circularity.

---

## 4. Evidence gathered

Scraped with Scrapling 0.5 (fork `Ksdeng1559/Scrapling` @ `82180a1`), under
each publisher's `robots.txt`:

| Publisher | robots.txt | Crawl-delay |
|---|---|---|
| Accord Financial | `User-agent: *` / `Disallow:` | 2s (default) |
| Kingsmen Capital | `User-agent: *` / `Disallow:` | 2s (default) |
| Glasslake | `Crawl-delay: 10` **above** `User-agent: *` | **10s** |
| Fraction | `User-agent: *` / `Disallow:` | 2s (default) |

Captured pages land in `data/scraped/<domain>/` as raw Markdown plus a JSON
sidecar. The run manifest is `data/scraped/manifest.json`; extracted lender
records are `data/scraped/lenders.json`.

Every extracted record carries `verification_status: "unverified"` with a
confidence score. Scraping is observation; only a human reviewing the source
can set `verified`, and only `verified` records publish — see
`wp/mu-plugins/ck-lender-cpt.php`.

---

## 5. How to reproduce

```bash
# Live keyword pull
cd /home/denni/repos/openseo-project
python3 research/_openseo_call.py list_saved_keywords \
  '{"projectId":"7f4bbe03-f30f-4eeb-b648-d64985be70a1","limit":100}'

# Discovery only — resolves robots.txt and sitemaps, fetches nothing
npm run scrape:sites -- --dry-run

# Full evidence capture
npm run scrape:sites
```
