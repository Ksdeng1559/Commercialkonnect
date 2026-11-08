// Server-only. Reads CALCOM_WEBHOOK_SECRET and sends mail via Resend —
// never import from a Client Component.
import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { sendSms } from "@/lib/sms";

/**
 * Verify a Cal.com webhook. Cal signs the raw request body with
 * HMAC-SHA256 (hex) using the webhook secret and sends it in the
 * `X-Cal-Signature-256` header. Pass the RAW body string (not re-
 * serialized JSON) or the HMAC won't match. Fails closed: no secret or
 * no signature → false.
 */
export function verifyCalSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.CALCOM_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  // timingSafeEqual throws on length mismatch; guard first.
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signature, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// Cal payloads carry far more than this; parse defensively and keep only
// what the confirmation needs. Unknown keys are ignored.
const attendeeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  timeZone: z.string().optional(),
  phoneNumber: z.string().optional(),
});

const bookingSchema = z.object({
  triggerEvent: z.string(),
  payload: z.object({
    title: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    organizer: z
      .object({ email: z.string().email().optional(), name: z.string().optional() })
      .optional(),
    attendees: z.array(attendeeSchema).default([]),
    location: z.string().optional(),
    metadata: z.object({ videoCallUrl: z.string().optional() }).partial().optional(),
    // Custom booking fields (incl. attendeePhoneNumber) land here.
    responses: z.record(z.string(), z.unknown()).optional(),
    uid: z.string().optional(),
  }),
});

export type CalWebhook = z.infer<typeof bookingSchema>;

export function parseCalWebhook(body: unknown): CalWebhook {
  return bookingSchema.parse(body);
}

// Booking fields (name, title, location) are filled by the booker — an
// untrusted third party. The signature proves Cal relayed them, not that
// they're safe. Escape before putting any into the HTML email.
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Only allow http(s) links in the href; anything else (javascript:, data:)
// is dropped.
function safeUrl(u: string | undefined): string | undefined {
  if (!u) return undefined;
  try {
    const parsed = new URL(u);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? u : undefined;
  } catch {
    return undefined;
  }
}

// Pull the attendee phone from wherever Cal put it: the attendee object or
// the custom-field responses. Normalize to E.164 (strip spaces/dashes/
// parens). Returns undefined if it isn't a usable +<digits> number — we
// never guess a country code.
function extractPhone(
  attendeePhone: string | undefined,
  responses: Record<string, unknown> | undefined,
): string | undefined {
  let raw = attendeePhone;
  if (!raw && responses) {
    const r = responses["attendeePhoneNumber"];
    if (typeof r === "string") raw = r;
    else if (r && typeof r === "object" && "value" in r) {
      const v = (r as { value: unknown }).value;
      if (typeof v === "string") raw = v;
    }
  }
  if (!raw) return undefined;
  const cleaned = raw.replace(/[\s\-().]/g, "");
  return /^\+[1-9]\d{1,14}$/.test(cleaned) ? cleaned : undefined;
}

function fmtWhen(startTime: string | undefined, tz: string | undefined): string {
  if (!startTime) return "your scheduled time";
  const d = new Date(startTime);
  if (Number.isNaN(d.getTime())) return startTime;
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: tz || "America/Vancouver",
  }).format(d);
}

/**
 * Handle one verified Cal.com booking event. Sends a branded email to the
 * attendee for created / rescheduled / cancelled. Returns a short tag for
 * logging. Unhandled triggers are a no-op.
 */
export async function handleCalBooking(hook: CalWebhook): Promise<string> {
  const { triggerEvent, payload } = hook;
  const attendee = payload.attendees[0];
  if (!attendee) return "no-attendee";

  const when = fmtWhen(payload.startTime, attendee.timeZone);
  const title = payload.title ?? "your meeting";
  const link = safeUrl(payload.metadata?.videoCallUrl ?? payload.location);
  const name = attendee.name ?? "there";

  let subject: string;
  let lead: string;
  switch (triggerEvent) {
    case "BOOKING_CREATED":
      subject = `Confirmed: ${title}`;
      lead = `You're booked. Here are the details:`;
      break;
    case "BOOKING_RESCHEDULED":
      subject = `Rescheduled: ${title}`;
      lead = `Your meeting moved. New details:`;
      break;
    case "BOOKING_CANCELLED":
      subject = `Cancelled: ${title}`;
      lead = `Your meeting was cancelled. To rebook, reply to this email.`;
      break;
    default:
      return `ignored:${triggerEvent}`;
  }

  const cancelled = triggerEvent === "BOOKING_CANCELLED";
  const text = [
    `Hi ${name},`,
    "",
    lead,
    "",
    `What: ${title}`,
    `When: ${when}`,
    ...(link && !cancelled ? [`Where: ${link}`] : []),
    "",
    "— CommercialKonnect",
  ].join("\n");

  const safeName = escapeHtml(name);
  const safeTitle = escapeHtml(title);
  const safeLink = link ? escapeHtml(link) : undefined;
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:480px">
      <p>Hi ${safeName},</p>
      <p>${lead}</p>
      <table style="border-collapse:collapse">
        <tr><td style="padding:4px 12px 4px 0"><strong>What</strong></td><td>${safeTitle}</td></tr>
        <tr><td style="padding:4px 12px 4px 0"><strong>When</strong></td><td>${escapeHtml(when)}</td></tr>
        ${safeLink && !cancelled ? `<tr><td style="padding:4px 12px 4px 0"><strong>Where</strong></td><td><a href="${safeLink}">${safeLink}</a></td></tr>` : ""}
      </table>
      <p style="color:#666">— CommercialKonnect</p>
    </div>`;

  await sendEmail({ to: attendee.email, subject, html, text });

  // Confirm-only transactional SMS (created / rescheduled), sent to the
  // attendee's own number that they entered when booking. Cancellations go
  // by email only. SMS failure must NOT fail the webhook — the email already
  // sent, and a 502 would make Cal retry and double-send it. Twilio handles
  // STOP opt-out on the sending number automatically.
  let smsTag = "no-sms";
  if (!cancelled) {
    const phone = extractPhone(attendee.phoneNumber, payload.responses);
    if (phone) {
      const verb = triggerEvent === "BOOKING_RESCHEDULED" ? "Rescheduled" : "Confirmed";
      try {
        await sendSms({
          to: phone,
          body: `${verb}: ${title} on ${when}. Reply STOP to opt out. — CommercialKonnect`,
        });
        smsTag = "sms-sent";
      } catch (err) {
        console.error("Cal confirm SMS failed:", err);
        smsTag = "sms-failed";
      }
    }
  }

  return `sent:${triggerEvent}:${smsTag}`;
}
