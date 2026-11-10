# CommercialKonnect — Life Insurance Advisor Referral Partners

Astro 5 + Netlify adapter, with secure server-side Supabase partner enquiry intake.

## Netlify configuration

Existing site: `commercialkonnect-referral-partners`.
Connect GitHub repo `Ksdeng1559/Commercialkonnect`, production branch `main`, **Base directory: `apps/life-insurance-partners`**. The nested `netlify.toml` supplies command and publish path.

Set Netlify environment variables (Functions and Builds): `SUPABASE_URL` and **secret** `SUPABASE_SERVICE_ROLE_KEY`. Do not put privileged keys into source control or client HTML.

Supabase target: `public.ck_life_insurance_partner_enquiries` in `amgknqnhiscryvcfeoyj`. RLS enabled, public read and insert revoked. Database table already exists.

## Verification

`npm install && npm run build`; then verify published page and POST `/api/partner-enquiry`. Do not send real customer details until test passes. Implement rate limiting / CAPTCHA before running paid traffic.

Business-development copy does not promise returns or commissions. Client introductions require explicit permission and appropriate professional disclosures.
