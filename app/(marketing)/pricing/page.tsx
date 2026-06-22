import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/Card";
import { PricingCard } from "@/components/pricing-card";
import { CREDIT_PACKS } from "@/types";

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-dashboard px-6 py-20">
        <div className="max-w-content">
          <h1 className="text-3xl font-extrabold tracking-tight text-text">Pricing</h1>
          <p className="mt-3 text-subtext">
            Free checks to start. Credit packs for everything else. No subscriptions.
          </p>
        </div>

        <Card className="mt-10 max-w-content">
          <h2 className="text-sm font-semibold text-text">Free</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-subtext">
            <li>3 checks per day</li>
            <li>Single email only</li>
            <li>Basic result (Valid / Invalid / Risky)</li>
          </ul>
        </Card>

        <h2 className="mt-16 text-xl font-bold text-text">Credit packs</h2>
        <p className="mt-2 text-sm text-subtext">
          One-time purchase. Credits never expire.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {CREDIT_PACKS.map((pack) => (
            <PricingCard key={pack.id} pack={pack} />
          ))}
        </div>

        <p className="mt-6 text-xs text-subtext">
          Credits never expire · Secure checkout via Stripe · Receipt emailed automatically
        </p>

        <h2 className="mt-16 text-xl font-bold text-text">What paid credits unlock</h2>
        <ul className="mt-4 max-w-content space-y-2 text-sm text-subtext">
          <li>Unlimited single checks (1 credit each)</li>
          <li>CSV bulk upload (1 credit per email)</li>
          <li>Downloadable verification reports</li>
          <li>Priority processing</li>
        </ul>
      </main>
      <Footer />
    </>
  );
}
