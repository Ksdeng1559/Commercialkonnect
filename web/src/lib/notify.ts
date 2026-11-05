import { Resend } from "resend";
import twilio from "twilio";

// Autoresponse senders. Each degrades gracefully: if its env is not configured,
// it returns { skipped: true } rather than throwing, so a missing channel never
// blocks a lead from being captured.

export interface LeadNotice {
  name: string;
  email: string;
  phone: string;
  product: string;
  smsConsent: boolean;
}

const env = (k: string) => process.env[k] ?? (import.meta.env as Record<string, string>)[k];

export async function sendLeadEmails(lead: LeadNotice) {
  const apiKey = env("RESEND_API_KEY");
  const from = env("RESEND_FROM"); // e.g. "CommercialKonnect <enquiries@commercialkonnect.ca>"
  const notifyTo = env("ENQUIRY_NOTIFY_TO"); // operator inbox
  if (!apiKey || !from) return { skipped: true as const };

  const resend = new Resend(apiKey);

  // Transactional autoresponse to the enquirer (reply to their own request).
  const toEnquirer = await resend.emails.send({
    from,
    to: lead.email,
    subject: "We received your CommercialKonnect enquiry",
    text: [
      `Hi ${lead.name},`,
      "",
      "Thanks for your enquiry. We'll review it and, with your permission, connect you with a relevant financing professional.",
      "",
      "This is not an approval or an offer of financing. CommercialKonnect does not lend money or guarantee financing.",
      "",
      "If you did not make this enquiry, reply to let us know.",
      "",
      "CommercialKonnect",
    ].join("\n"),
  });

  // Operator alert (only if an inbox is configured).
  if (notifyTo) {
    await resend.emails.send({
      from,
      to: notifyTo,
      subject: `New enquiry: ${lead.product} — ${lead.name}`,
      text: `Name: ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone || "—"}\nProduct: ${lead.product}\nSMS consent: ${lead.smsConsent ? "yes" : "no"}`,
    });
  }

  return { skipped: false as const, id: toEnquirer.data?.id ?? null };
}

export async function sendLeadSms(lead: LeadNotice) {
  if (!lead.smsConsent || !lead.phone) return { skipped: true as const };
  const sid = env("TWILIO_ACCOUNT_SID");
  const token = env("TWILIO_AUTH_TOKEN");
  const from = env("TWILIO_FROM"); // +16043305638
  if (!sid || !token || !from) return { skipped: true as const };

  const client = twilio(sid, token);
  const msg = await client.messages.create({
    to: lead.phone,
    from,
    body: "CommercialKonnect: we received your enquiry and will be in touch. Not an approval or offer of financing. Reply STOP to opt out.",
  });

  return { skipped: false as const, sid: msg.sid };
}
