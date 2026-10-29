# FLOW Content Pipeline

How a verified lender record becomes a publishable page in CommercialKonnect.

**Framework source:** `https://github.com/Ksdeng1559/flow` (clone at
`/home/denni/repos/flow`) — 72 documents, 42 ready-to-run prompts.
**Demand source:** live OpenSEO MCP — see `docs/OPENSEO_LINKAGE.md`.
**Evidence source:** `data/scraped/` — see `docs/EVIDENCE_RUN.md`.

---

## 1. The four stages, and what supplies each one

| FLOW stage | Question it answers | Input in this project |
|---|---|---|
| **Find** | What is the demand? | OpenSEO saved keywords — 65 keywords, 43 with volume, 7 clusters |
| **Leverage** | Where else does the brand get corroborated? | Lender directories, broker networks, the scraped lender corpus |
| **Optimize** | Can the asset be extracted and trusted? | GEO formatting, independence/attribution rules, provenance blocks |
| **Win** | Does discovery turn into a qualified lead? | B2B lead-generation playbook, lender claim forms, broker intake |

The pipeline does not run linearly. It loops: a page that wins traffic but
fails to convert sends you back to Find, and a page that reads well but
cannot be extracted sends you back to Optimize.

### The loop as it actually runs here

```
OpenSEO keyword cluster
        │
        ▼
  Which lenders can serve this cluster?   ← data/scraped/lenders.json
        │
        ▼
  Page brief (one cluster, one page)      ← FLOW Find
        │
        ▼
  Draft with FLOW prompt                  ← FLOW Optimize
        │
        ▼
  GEO format + attribution                ← FLOW Optimize
        │
        ▼
  Verification checklist                   ← FLOW Win
        │
        ▼
  Publish (only verified facts)           ← WordPress lender CPT
```

**The direction of travel matters.** Scraping came first. A directory cannot
be populated from keyword data, and content cannot be written until you know
which lenders can back which cluster. Research-and-evidence mode inverts the
usual order, and that is the whole point of this pipeline.

---

## 2. The four rules that govern every asset

These come from FLOW's `How To Apply` section, which is identical across the
framework documents. They are not stylistic preferences — they are the
acceptance criteria.

1. **Name the search surface before writing.** Organic result, AI answer,
   local pack, community discussion, paid landing page, or sales-assisted
   page. A broker-intent page ("commercial mortgage broker bc") is an AI
   answer candidate. A rate table is not.
2. **Separate observable evidence from assumptions.** Every claim with a
   number must trace to the bibliography or be removed. This is the rule
   that keeps the `unverified` / `verified` distinction meaningful.
3. **Write from buyer language first.** Then add entity clarity, internal
   links, proof, and conversion next steps. Not the other way round.
4. **Review as an AI-readable document.** Clear headings, direct answers,
   concise tables where useful, source labels, no hidden dependence on
   private examples.

FLOW's stated failure modes to avoid:

- Publishing a statistic because it sounds familiar instead of because the
  source was loaded and dated.
- Treating AI visibility as a formatting trick while ignoring brand
  evidence and off-site corroboration.
- Writing pages around company preferences instead of buyer questions and
  decision risk.
- Optimizing for traffic without defining the next qualified action.
- Reusing old examples when a generic or newly created one would be cleaner.

---

## 3. Independence and attribution

`docs/01-framework/independence-and-attribution.md` is the governing document.
In this project it resolves to a concrete rule:

> **A scraped lender fact is a claim made by the lender's own website,
> observed by us on a date. It is never presented as an independently
> verified fact, and it never appears in a published page without naming
> its source and date.**

That maps directly onto the WordPress gate. `wp/mu-plugins/ck-lender-cpt.php`
makes only `verified` records publicly publishable. A scraped record enters
as `unverified` and stays there until a human checks it against a regulator
or licensing registry.

**Attribution format for a published page:**

```
Accord Financial — Business Financing in Canada
Source: accordfinancial.com/solutions/
Observed: 2026-10-24
Products: Equipment Financing, Business Line of Credit, Term Loan
Status: Unverified — pending analyst review
```

Never drop the `Status` line. A directory that mixes verified and
unverified facts without distinguishing them is worse than one that publishes
nothing.

---

## 4. GEO formatting

`docs/05-optimize/geo-formatting-and-extraction.md`. The point is that an AI
answer engine must be able to lift a fact out of the page without the
surrounding prose.

For a lender page, the extractable unit is a **lender card**:

```
| Lender | Products | Territory | Contact | Source | Observed | Status |
|---|---|---|---|---|---|---|
| Kingsmen Capital | Term Loan, Line of Credit, Equipment Financing | Canada | apps@kingsmencapital.ca | kingsmencapital.ca/what-we-do/ | 2026-10-24 | Unverified |
```

Rules that follow from the framework:

- Answer the buyer's question in the first two sentences, then the table.
- One table, not five — an extractor reads the first complete table.
- Label every source inline. An unattributed table is not evidence.
- Headings must be questions the buyer would type, not internal names.

---

## 5. B2B lead generation

`docs/08-playbooks/b2b-lead-generation.md` governs conversion. The
commercial intent in the keyword set is explicit:

| Keyword | Volume | CPC |
|---|---|---|
| private lender | 1000 | $15.26 |
| private lender bc | 210 | $15.60 |
| commercial mortgage broker | 590 | $11.66 |
| bc loans | 1300 | $9.01 |

A CPC of $15 on "private lender" is a market telling you what a qualified
lead costs. The conversion path must match that price: a broker handing over
a deal is not a newsletter subscriber.

The conversion action for this vertical is a **deal-intake form** — the
visitor describes the deal, the lender directory responds. Everything else
on the page exists to make that form feel like the obvious next step.

**Critical constraint from AGENTS.md:** no automated credit approval, no
funding guarantee, no unreviewed investor solicitation. Intake collects a
deal description and routes it to a human. It does not decide anything.

---

## 6. Page briefs derived from the clusters

Each cluster maps to one page. The brief names the surface, the evidence,
and the claims needing verification.

### Cluster A — Private lender
- **Surface:** AI answer + organic result.
- **Target:** `private lender bc` (210, KD 0, $15.60)
- **Evidence:** lender corpus — who in BC actually calls themselves a
  private lender, stated on their own site.
- **Verification needed:** every lender listed must be checked against a
  licensing registry before publishing as a private lender. This is the
  highest-risk cluster — "private lender" is a regulatory term.

### Cluster B — Broker phrase gap
- **Surface:** organic result.
- **Target:** `commercial mortgage broker bc` (10, $5.26)
- **Evidence:** scraped lender corpus; the directory is the answer.
- **Verification needed:** none for the directory mechanics. The page must
  not rank for "commercial mortgage broker" while reading like a lender's
  own marketing — it must read like a broker's comparison resource.

### Clusters C–F — Product and financing pages
- **Surfaces:** organic result + AI answer.
- **Evidence:** product terms as stated by each lender's own pages, cited.
- **Verification needed:** rate and LTV/DSCR figures are the highest-risk
  numbers. They change without notice. Any figure carries the observation
  date and is refreshed on a schedule, or removed.

### Cluster G — BC local / empty SERP
- **Surface:** local pack + organic result.
- **Targets:** `commercial construction financing vancouver`,
  `vancouver purpose built rental financing`,
  `multifamily construction loan vancouver` — all three carry `empty-serp`.
- **Evidence:** BC-specific lender coverage from the corpus.
- **Verification needed:** these pages lean on local geography. Claims
  about BC programs must cite the programme source, not a lender's marketing.

---

## 7. The verification checklist

FLOW's `blog-post-writing-prompt.md` ends every deliverable with a
verification checklist, and so does this pipeline. A page cannot ship
without every box either ticked or explicitly waived.

- [ ] Every number traces to a source in the evidence table, with a date.
- [ ] Every lender fact carries its source URL and observation date.
- [ ] No lender appears as `verified` without a registry check on file.
- [ ] Every product label matches what the lender's own page says.
- [ ] The search surface is named in the brief.
- [ ] The buyer question is answered in the first two sentences.
- [ ] The next qualified action (deal intake) is present and one click away.
- [ ] No credit approval, funding guarantee, or automated solicitation.
- [ ] Nothing in the page depends on a private example.
- [ ] Measurement events are defined before launch, not after.

---

## 8. Running the pipeline

```bash
# 1. Refresh demand
cd /home/denni/repos/openseo-project
python3 research/_openseo_call.py list_saved_keywords \
  '{"projectId":"7f4bbe03-f30f-4eeb-b648-d64985be70a1","limit":100}'

# 2. Refresh evidence
npm run scrape:sites          # fetch, honour robots.txt, write data/scraped/
npm run scrape:extract        # re-derive lender records from captured pages

# 3. Draft using FLOW
#    docs/09-prompts/optimize/blog-post-writing-prompt.md
#    docs/09-prompts/optimize/blog-post-outline-prompt.md
```

Step 3 is deliberately not automated. FLOW's `AI Agent Prompt` blocks are
designed for an agent to execute against organised evidence, and the
verification checklist is a human gate. A drafted page that has not been
through the checklist is a draft, not an asset.
