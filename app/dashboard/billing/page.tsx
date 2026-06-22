import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/get-profile";
import type { CreditPurchase } from "@/types";

export default async function BillingPage() {
  const session = await getCurrentProfile();
  const supabase = createClient();

  const { data: purchases } = session
    ? await supabase
        .from("credit_purchases")
        .select("*")
        .eq("user_id", session.userId)
        .order("created_at", { ascending: false })
    : { data: [] };

  const rows = (purchases ?? []) as CreditPurchase[];

  return (
    <div>
      <h1 className="text-xl font-bold text-text">Credits & Billing</h1>

      <div className="mt-6">
        <span className="text-4xl font-extrabold text-text">
          {session?.profile.credits ?? 0}
        </span>
        <span className="ml-2 text-sm text-subtext">credits</span>
      </div>

      <Link
        href="/pricing"
        className="mt-4 inline-block rounded-input bg-accent px-4 py-2.5 text-sm font-medium text-bg hover:bg-[#dceb6a]"
      >
        Buy more credits
      </Link>

      <h2 className="mt-12 text-base font-semibold text-text">Purchase history</h2>

      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-subtext">No purchases yet.</p>
      ) : (
        <div className="mt-4 overflow-hidden rounded-card border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-subtext">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Pack</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Credits added</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-t border-border text-text">
                  <td className="px-4 py-3">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{p.pack_name}</td>
                  <td className="px-4 py-3">${(p.amount_paid / 100).toFixed(2)}</td>
                  <td className="px-4 py-3">{p.credits_added}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
