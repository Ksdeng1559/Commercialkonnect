import type { APIRoute } from 'astro';

export const prerender = false;
const json = (body: object, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
});
const clean = (value: unknown, max: number) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';
const provinces = new Set([
  'British Columbia', 'Alberta', 'Ontario', 'Saskatchewan', 'Manitoba', 'Quebec',
  'Nova Scotia', 'New Brunswick', 'Newfoundland and Labrador',
  'Prince Edward Island', 'Yukon', 'Northwest Territories', 'Nunavut'
]);

export const POST: APIRoute = async ({ request }) => {
  if (Number(request.headers.get('content-length') || 0) > 12000) return json({ error: 'Request too large' }, 413);
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && host) {
    try { if (new URL(origin).host !== host) return json({ error: 'Invalid origin' }, 403); }
    catch { return json({ error: 'Invalid origin' }, 403); }
  }

  let data: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('invalid');
    data = parsed as Record<string, unknown>;
  } catch { return json({ error: 'Invalid request' }, 400); }

  // Honeypot: ignore suspected bot submissions without persisting.
  if (data.website) return json({ ok: true }, 201);
  const full_name = clean(data.full_name, 120);
  const email = clean(data.email, 254);
  const agency = clean(data.agency, 160);
  const phone = clean(data.phone, 40);
  const province = clean(data.province, 70);
  const client_focus = clean(data.client_focus, 100);
  const message = clean(data.message, 1200);
  if (!full_name || !agency || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !provinces.has(province) || data.consent !== 'on') {
    return json({ error: 'Complete all required fields and consent.' }, 400);
  }

  const url = import.meta.env.SUPABASE_URL;
  const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return json({ error: 'Partner intake is temporarily unavailable' }, 503);

  try {
    const response = await fetch(url.replace(/\/$/, '') + '/rest/v1/ck_referral_partner_enquiries', {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: 'Bearer ' + key,
        'content-type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        full_name, email, agency, phone: phone || null, province,
        partner_type: 'accountant', client_focus: client_focus || null,
        message: message || null, consented_at: new Date().toISOString(),
        consent_purpose: 'partner_enquiry_reply',
        source: 'accountant-referral-landing', status: 'new'
      })
    });
    if (!response.ok) {
      console.error('Accountant intake status', response.status);
      return json({ error: 'Unable to accept enquiry right now' }, 502);
    }
    return json({ ok: true }, 201);
  } catch {
    return json({ error: 'Unable to connect right now' }, 502);
  }
};
