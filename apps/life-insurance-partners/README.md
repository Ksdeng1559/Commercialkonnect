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


## Accountant referral page

New page: `/accountants` (Astro route `src/pages/accountants.astro`).
Form POST: `/api/accountant-enquiry` (Astro server route `src/pages/api/accountant-enquiry.ts`).
Database: `public.ck_referral_partner_enquiries` in Supabase project `amgknqnhiscryvcfeoyj` (existing project).

The database table was created independently as a Supabase migration. RLS is enabled, and public `anon`/`authenticated` privileges are revoked. The endpoint performs server-side validation, a basic honeypot and same-origin check, and uses the server-only `SUPABASE_SERVICE_ROLE_KEY` for writes. It intentionally rejects public direct writes.

The existing life insurance partner form continues writing to `ck_life_insurance_partner_enquiries`, unchanged.

**Deployment requirements:** Confirm `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured for Netlify Functions. Add production-grade bot protection and rate limiting before sending paid traffic. Submit a consented synthetic test through the deployed form and verify the resulting `partner_type='accountant'` row in Supabase. CRM pipeline assignment and notifications are not yet wired.
