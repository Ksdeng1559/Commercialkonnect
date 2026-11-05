import type { APIRoute } from "astro";
import { enquirySchema } from "../../lib/enquiry";
import { getServiceClient } from "../../lib/supabase";
import { sendLeadEmails, sendLeadSms } from "../../lib/notify";

// On-demand (SSR) route. Everything else in the site stays prerendered.
export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const raw = Object.fromEntries(form);
  const parsed = enquirySchema.safeParse(raw);

  if (!parsed.success) {
    return redirect("/apply?error=1", 303);
  }
  const v = parsed.data;

  // Honeypot tripped: silently accept and drop (don't store, don't notify).
  if (v.company_website) {
    return redirect("/thank-you", 303);
  }

  const now = new Date().toISOString();
  const lead = {
    source_page: v.source_page,
    product: v.product,
    purpose: v.purpose,
    amount_band: v.amount,
    timing: v.timing,
    name: v.name,
    business: v.business || null,
    email: v.email,
    phone: v.phone || null,
    email_consent: true,
    email_consent_at: now,
    sms_consent: v.sms_consent,
    sms_consent_at: v.sms_consent ? now : null,
    status: "new",
  };

  const supabase = getServiceClient();
  let leadId: string | null = null;

  if (supabase) {
    const { data, error } = await supabase.from("leads").insert(lead).select("id").single();
    if (error) {
      console.error("[apply] ck.leads insert failed:", error.message);
      return redirect("/apply?error=2", 303);
    }
    leadId = data?.id ?? null;
  } else {
    console.warn("[apply] Supabase not configured; enquiry not persisted.");
  }

  // Autoresponses are best-effort and never block the redirect.
  const notice = {
    name: v.name,
    email: v.email,
    phone: v.phone,
    product: v.product,
    smsConsent: v.sms_consent,
  };

  try {
    const [emailRes, smsRes] = await Promise.all([sendLeadEmails(notice), sendLeadSms(notice)]);
    const resendId = "id" in emailRes ? emailRes.id : null;
    const twilioSid = "sid" in smsRes ? smsRes.sid : null;
    if (supabase && leadId && (resendId || twilioSid)) {
      await supabase
        .from("leads")
        .update({ resend_message_id: resendId, twilio_message_sid: twilioSid })
        .eq("id", leadId);
    }
  } catch (err) {
    console.error("[apply] autoresponse failed:", err);
  }

  return redirect("/thank-you", 303);
};
