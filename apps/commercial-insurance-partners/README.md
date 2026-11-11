# CommercialKonnect — Commercial Insurance Broker Referral Partners

Standalone Astro site located at `apps/commercial-insurance-partners`, built for Netlify SSR.

## Environment (Netlify, server side)
- `SUPABASE_URL=https://amgknqnhiscryvcfeoyj.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` — secret, never committed to Git

The dedicated `public.ck_commercial_insurance_partner_enquiries` table exists in the CommercialKonnect Supabase project with RLS enabled and no public grants. No credentials have been inserted in source code. API route: `POST /api/partner-enquiry`.

## Deploy
Netlify Git integration: repository `Ksdeng1559/Commercialkonnect`, base directory `apps/commercial-insurance-partners`, build command `npm run build`, publish directory `dist`. Use `@astrojs/netlify` for server-side form functions.

## Compliance
Client consent for any introduction is separate from the broker's permission for CommercialKonnect to answer the partner enquiry. Do not disclose client insurance, claims, or financial information without permission. Avoid guaranteeing funding, business growth, coverage approval, or compensation.

## Local
`npm install && npm run build`. Production POST testing requires environment variables and rate-limiting / anti-spam controls.
