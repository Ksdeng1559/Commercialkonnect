import { NextResponse } from "next/server";
import { verifyCalSignature, parseCalWebhook, handleCalBooking } from "@/lib/calcom";

// Node runtime: uses node:crypto and holds CALCOM_WEBHOOK_SECRET / RESEND_API_KEY.
export const runtime = "nodejs";

export async function POST(req: Request) {
  // Read the RAW body first — the HMAC is over these exact bytes.
  const raw = await req.text();
  const signature = req.headers.get("x-cal-signature-256");

  if (!verifyCalSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let hook;
  try {
    hook = parseCalWebhook(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const result = await handleCalBooking(hook);
    return NextResponse.json({ ok: true, result }, { status: 200 });
  } catch (err) {
    console.error("Cal webhook handling failed:", err);
    // 502 → Cal retries. The signature already checked out, so a failure
    // here is our side (Resend, bad data), worth retrying.
    return NextResponse.json({ error: "Handling failed" }, { status: 502 });
  }
}
