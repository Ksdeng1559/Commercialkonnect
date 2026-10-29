import { NextResponse } from "next/server";
import { sendLeadMagnet, leadSchema } from "@/lib/leads";

// Needs the Node runtime: reads the PDF off disk and holds RESEND_API_KEY.
export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const result = await sendLeadMagnet(parsed.data);
    return NextResponse.json({ ok: true, id: result?.id }, { status: 202 });
  } catch (err) {
    console.error("Lead-magnet send failed:", err);
    return NextResponse.json({ error: "Send failed" }, { status: 502 });
  }
}
