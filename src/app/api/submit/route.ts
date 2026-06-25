import { NextRequest, NextResponse } from "next/server";

// Fallback so production works even if Vercel env var is missing
const DEFAULT_WEBHOOK_URL =
  "https://hook.eu1.make.com/e91p1b1vlr3d52iwofp6o1521s2v75u3";

export async function POST(request: NextRequest) {
  const webhookUrl =
    process.env.MAKE_WEBHOOK_URL ||
    process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL ||
    DEFAULT_WEBHOOK_URL;

  try {
    const body = await request.json();

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Webhook request failed" },
        { status: res.status }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 }
    );
  }
}
