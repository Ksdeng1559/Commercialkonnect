# commercialkonnect-web

Astro 6 marketing site for commercialkonnect.ca. Static site, deployed to Vercel. Separate project
from the Next.js app at the repo root (the two frameworks cannot share one `package.json`).

Stack target: Astro 6 + Sanity + Supabase. This first slice is the **home page only** — static, no
Sanity, no Supabase, no SSR adapter. Those wire in with the `/apply` enquiry funnel and editable
content in later slices.

## Run locally

```sh
cd web
npm install
npm run dev        # http://localhost:4321
```

Other scripts: `npm run build` (static output to `dist/`), `npm run preview`, `npm run check`.

## Deploy (Vercel)

New Vercel project, **root directory = `web`**. Framework preset auto-detects Astro. No adapter
needed while the site is static. Point the `commercialkonnect.ca` domain at this project when ready
to cut over from the current Lovable site.

## Structure

- `src/pages/index.astro` — home page (hero, financing options, how it works, enquiry CTA).
- `src/layouts/Base.astro` — HTML shell: SEO meta, Open Graph, `FinancialService` JSON-LD, header
  nav, footer with licensing + compliance disclaimers. Reused by future money pages.
- `src/styles/global.css` — Tailwind v4 (`@import "tailwindcss"`) + brand tokens.

## Deferred (next slices)

- `/apply` multi-step enquiry form → Supabase `ck.leads` (consent fields) + Resend email and Twilio
  SMS autoresponse. Needs `@astrojs/vercel` adapter for the POST endpoint.
- Sanity CMS for non-dev content editing.
- Real verification/social URLs in the footer (currently `#` placeholders).
- Money pages per the lead-engine spec (`docs/superpowers/specs/2026-11-05-business-funding-lead-engine-design.md`).
