import { NextRequest, NextResponse } from "next/server";
import { verifyEmail } from "@/lib/zerobounce";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { isValidEmailSyntax } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = body?.email;

  if (!email || typeof email !== "string" || !isValidEmailSyntax(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (userData.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userData.user.id)
      .single();

    if (!profile || profile.credits < 1) {
      return NextResponse.json(
        { error: "Not enough credits. Buy more to keep verifying.", insufficientCredits: true },
        { status: 402 }
      );
    }

    try {
      const result = await verifyEmail(email.trim());
      await supabase
        .from("profiles")
        .update({ credits: profile.credits - 1 })
        .eq("id", userData.user.id);
      return NextResponse.json(result);
    } catch (err) {
      console.error("verify error", err);
      return NextResponse.json(
        { error: "Couldn't verify this email right now. Try again." },
        { status: 502 }
      );
    }
  }

  const ip = getClientIp(req.headers);
  const { allowed } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many checks from this connection. Try again later.", limitReached: true },
      { status: 429 }
    );
  }

  try {
    const result = await verifyEmail(email.trim());
    return NextResponse.json(result);
  } catch (err) {
    console.error("verify error", err);
    return NextResponse.json(
      { error: "Couldn't verify this email right now. Try again." },
      { status: 502 }
    );
  }
}
