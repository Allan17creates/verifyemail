import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const pack = session.metadata?.pack;
    const credits = Number(session.metadata?.credits ?? 0);

    if (userId && credits > 0) {
      const admin = createAdminClient();

      const { data: profile } = await admin
        .from("profiles")
        .select("credits")
        .eq("id", userId)
        .single();

      if (profile) {
        await admin
          .from("profiles")
          .update({ credits: profile.credits + credits })
          .eq("id", userId);
      }

      await admin.from("credit_purchases").insert({
        user_id: userId,
        stripe_payment_id: session.payment_intent as string,
        credits_added: credits,
        amount_paid: session.amount_total ?? 0,
        pack_name: pack ?? "Unknown",
      });
    }
  }

  return NextResponse.json({ received: true });
}
