import { config } from "dotenv";
config({ path: ".env.local" });

import { sendEmail } from "../src/lib/email";

// Usage: npm run email:test -- you@example.com
const to = process.argv[2];
if (!to) {
  console.error("Usage: npm run email:test -- you@example.com");
  process.exit(1);
}

sendEmail({
  to,
  subject: "Resend test — KonstructionCommercialOS",
  text: "If you received this, Resend sending works.",
  html: "<p>If you received this, <strong>Resend sending works.</strong></p>",
})
  .then((result) => {
    console.log("Sent. Resend id:", result?.id);
  })
  .catch((err: unknown) => {
    console.error("Failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  });
