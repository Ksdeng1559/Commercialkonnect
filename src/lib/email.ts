// Server-only. Never import this from a Client Component — it reads
// RESEND_API_KEY, which must stay off the client.
import { Resend, type CreateEmailOptions } from "resend";
import { z } from "zod";

const sendEmailSchema = z
  .object({
    to: z.union([z.string().email(), z.array(z.string().email()).min(1)]),
    subject: z.string().min(1).max(200),
    html: z.string().min(1).optional(),
    text: z.string().min(1).optional(),
    replyTo: z.string().email().optional(),
    // content is base64-encoded file data; Resend accepts a base64 string.
    attachments: z
      .array(z.object({ filename: z.string().min(1), content: z.string().min(1) }))
      .optional(),
  })
  .refine((d) => d.html || d.text, {
    message: "Provide at least one of `html` or `text`.",
  });

export type SendEmailInput = z.infer<typeof sendEmailSchema>;

let client: Resend | null = null;

function getClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  if (!client) client = new Resend(key);
  return client;
}

/**
 * Send one email through Resend. Inputs are validated at this trust
 * boundary; `from` comes from EMAIL_FROM and must be an address on the
 * verified domain (mail.commercialkonnect.ca).
 */
export async function sendEmail(input: SendEmailInput) {
  const data = sendEmailSchema.parse(input);
  const from = process.env.EMAIL_FROM;
  if (!from) throw new Error("EMAIL_FROM is not set");

  // zod guarantees html or text is present; omit undefined keys so the
  // SDK's discriminated-union type resolves to the html/text branch.
  const payload = {
    from,
    to: data.to,
    subject: data.subject,
    ...(data.html ? { html: data.html } : {}),
    ...(data.text ? { text: data.text } : {}),
    ...(data.replyTo ? { replyTo: data.replyTo } : {}),
    ...(data.attachments ? { attachments: data.attachments } : {}),
  } as CreateEmailOptions;

  const { data: result, error } = await getClient().emails.send(payload);

  if (error) throw new Error(`Resend send failed: ${error.message}`);
  return result;
}
