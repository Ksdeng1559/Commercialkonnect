import { config } from "dotenv";
config({ path: ".env.local" });

import { sendSms } from "../src/lib/sms";

// Usage: npm run sms:test -- +16045551234
const to = process.argv[2];
if (!to) {
  console.error("Usage: npm run sms:test -- +16045551234");
  process.exit(1);
}

sendSms({
  to,
  body: "Twilio test — KonstructionCommercialOS. If you got this, SMS sending works.",
})
  .then((message) => {
    console.log("Sent. Twilio sid:", message.sid, "status:", message.status);
  })
  .catch((err: unknown) => {
    console.error("Failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  });
