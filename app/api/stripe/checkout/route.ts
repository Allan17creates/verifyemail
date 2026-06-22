import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { CREDIT_PACKS } from "@/types";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const packId = body?.packId;
  const pack = CREDIT_PACKS.find((p) => p.id === packId);

  if (!pack) {
    return NextResponse.json({ error: "Unknown credit pack." }, { status: 400 });
  }

  const priceId = process.env[pack.priceId];
  if (!priceId) {
    return NextResponse.json({ error: "This pack isn't configured yet." }, { status: 500 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?success=true`,
    cancel_url: `${appUrl}/pricing`,
    customer_email: userData.user.email,
    // Lets Stripe show whichever methods are enabled in the Dashboard
    // (cards, Link, PayPal, Apple/Google Pay, Alipay, iDEAL, etc.) based
    // on the buyer's currency and location, instead of hardcoding a list.
    automatic_payment_methods: { enabled: true },
    metadata: {
      userId: userData.user.id,
      pack: pack.name,
      credits: String(pack.credits),
    },
  });

  return NextResponse.json({ url: session.url });
}
