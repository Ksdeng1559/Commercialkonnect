// Server-only. Outbound lead-magnet delivery — the first CRM-connected
// email event. Reads the Readiness Checklist PDF and sends it via Resend.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { sendEmail } from "./email";

const MAGNET_PATH = path.join(
  process.cwd(),
  "marketing/lead-magnets/BC-Commercial-Financing-Readiness-Checklist.pdf",
);
const MAGNET_FILENAME = "BC-Commercial-Financing-Readiness-Checklist.pdf";

export const leadSchema = z.object({
  email: z.string().email(),
  // Reject angle brackets and control chars so a name can't inject markup.
  name: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[^<>\x00-\x1f]+$/, "name contains disallowed characters")
    .optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

// Escape for safe interpolation into HTML email bodies.
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Deliver the BC Commercial Financing Readiness Checklist to a lead who
 * requested it. Transactional/implied-consent under CASL (the recipient
 * asked for this specific resource); any follow-up marketing sequence
 * needs separate express consent + an unsubscribe mechanism.
 */
export async function sendLeadMagnet(input: LeadInput) {
  const { email, name } = leadSchema.parse(input);
  const greeting = name ? `Hi ${name},` : "Hi,";
  const htmlGreeting = name ? `Hi ${escapeHtml(name)},` : "Hi,";
  const pdf = await readFile(MAGNET_PATH);

  return sendEmail({
    to: email,
    subject: "Your BC Commercial Financing Readiness Checklist",
    text: `${greeting}\n\nYour checklist is attached. It walks through what lenders look for before funding a BC commercial project.\n\n— CommercialKonnect`,
    html: `<p>${htmlGreeting}</p><p>Your checklist is attached. It walks through what lenders look for before funding a BC commercial project.</p><p>— CommercialKonnect</p>`,
    attachments: [{ filename: MAGNET_FILENAME, content: pdf.toString("base64") }],
  });
}
