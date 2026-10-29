import { config } from "dotenv";
config({ path: ".env.local" });

import { sendEmail } from "../src/lib/email";

// Usage: tsx scripts/send-welcome.ts you@example.com "John"
const to = process.argv[2];
const name = process.argv[3] ?? "there";
if (!to) {
  console.error('Usage: tsx scripts/send-welcome.ts you@example.com "John"');
  process.exit(1);
}

const subject = "Welcome to CommercialKonnect — we received your inquiry";
const text = `Hi ${name},

Thanks for reaching out to CommercialKonnect about your financing inquiry.

We've received it and a specialist will contact you about your enquiry within the next 48 hours to discuss terms, timelines, and next steps.

While you wait, here's a short guide to business alternative financing so you can see which options may fit.

A QUICK GUIDE TO BUSINESS ALTERNATIVE FINANCING

Alternative financing covers funding outside the traditional bank term loan. It's often faster to arrange and more flexible on credit, which suits growing businesses, project-based work, and situations a bank turns down.

Common options:

- Business line of credit: Revolving funds you draw on as needed and repay. Best for managing cash flow gaps and short-term working capital.
- Term loan (private/non-bank): A lump sum repaid over a fixed period. Best for expansion, equipment, or one-time investments.
- Construction and bridge financing: Short-term funding tied to a project or property, repaid on completion or refinance. Best for builds, renovations, and timing gaps between purchase and long-term financing.
- Equipment financing: The equipment itself secures the loan. Best for vehicles, machinery, and tools without tying up other capital.
- Invoice factoring: Advance against unpaid invoices. Best for businesses with slow-paying clients that need cash now.
- Merchant cash advance: A lump sum repaid from a share of daily sales. Fast, but costs more, so treat it as a short-term bridge.

How to choose: match the term of the money to the life of what you're buying. Short-term needs get short-term tools (line of credit, factoring); long-lived assets get longer-term financing (term loans, equipment, construction).

What we'll need from you: the amount, the purpose, your province, roughly how fast you need it, and recent business financials. The more detail you share, the sharper the options we bring back.

Reply with your project details (location, stage, timeline) and we'll tailor this to your situation.

Talk soon,
The CommercialKonnect Team`;

const html = `<p>Hi ${name},</p>
<p>Thanks for reaching out to CommercialKonnect about your financing inquiry.</p>
<p>We've received it and a specialist will <strong>contact you about your enquiry within the next 48 hours</strong> to discuss terms, timelines, and next steps.</p>
<p>While you wait, here's a short guide to business alternative financing so you can see which options may fit.</p>
<h2>A quick guide to business alternative financing</h2>
<p>Alternative financing covers funding outside the traditional bank term loan. It's often faster to arrange and more flexible on credit, which suits growing businesses, project-based work, and situations a bank turns down.</p>
<p><strong>Common options:</strong></p>
<ul>
  <li><strong>Business line of credit</strong> — revolving funds you draw on as needed and repay. Best for cash flow gaps and short-term working capital.</li>
  <li><strong>Term loan (private/non-bank)</strong> — a lump sum repaid over a fixed period. Best for expansion, equipment, or one-time investments.</li>
  <li><strong>Construction and bridge financing</strong> — short-term funding tied to a project or property, repaid on completion or refinance. Best for builds, renovations, and timing gaps.</li>
  <li><strong>Equipment financing</strong> — the equipment itself secures the loan. Best for vehicles, machinery, and tools without tying up other capital.</li>
  <li><strong>Invoice factoring</strong> — an advance against unpaid invoices. Best for businesses with slow-paying clients that need cash now.</li>
  <li><strong>Merchant cash advance</strong> — a lump sum repaid from a share of daily sales. Fast, but costs more, so treat it as a short-term bridge.</li>
</ul>
<p><strong>How to choose:</strong> match the term of the money to the life of what you're buying. Short-term needs get short-term tools (line of credit, factoring); long-lived assets get longer-term financing (term loans, equipment, construction).</p>
<p><strong>What we'll need from you:</strong> the amount, the purpose, your province, roughly how fast you need it, and recent business financials. The more detail you share, the sharper the options we bring back.</p>
<p>Reply with your project details (location, stage, timeline) and we'll tailor this to your situation.</p>
<p>Talk soon,<br/>The CommercialKonnect Team</p>`;

sendEmail({ to, subject, text, html })
  .then((result) => {
    console.log("Sent. Resend id:", result?.id);
  })
  .catch((err: unknown) => {
    console.error("Failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  });
