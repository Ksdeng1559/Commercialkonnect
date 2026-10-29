// Server-only. Never import this from a Client Component — it reads
// TWILIO_AUTH_TOKEN, which must stay off the client.
import twilio from "twilio";
import type { Twilio } from "twilio";
import { z } from "zod";

// E.164: a leading + and up to 15 digits, first digit non-zero.
const e164 = z
  .string()
  .regex(/^\+[1-9]\d{1,14}$/, "Must be an E.164 phone number, e.g. +16045551234");

const sendSmsSchema = z.object({
  to: e164,
  // Twilio hard-limits a single message to 1600 chars (it segments past 160).
  body: z.string().min(1).max(1600),
  // Override the default sender (TWILIO_PHONE_NUMBER) when needed.
  from: e164.optional(),
});

export type SendSmsInput = z.infer<typeof sendSmsSchema>;

let client: Twilio | null = null;

function getClient(): Twilio {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid) throw new Error("TWILIO_ACCOUNT_SID is not set");
  if (!token) throw new Error("TWILIO_AUTH_TOKEN is not set");
  if (!client) client = twilio(sid, token);
  return client;
}

/**
 * Send one SMS through Twilio. Inputs are validated at this trust
 * boundary; `from` defaults to TWILIO_PHONE_NUMBER (a number owned by
 * this account) unless overridden per-call.
 */
export async function sendSms(input: SendSmsInput) {
  const data = sendSmsSchema.parse(input);
  const from = data.from ?? process.env.TWILIO_PHONE_NUMBER;
  if (!from) throw new Error("TWILIO_PHONE_NUMBER is not set");

  const message = await getClient().messages.create({
    to: data.to,
    from,
    body: data.body,
  });

  return message;
}
