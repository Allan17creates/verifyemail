import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { VerifyInput } from "@/components/verify-input";
import { AffiliateCard } from "@/components/affiliate-card";
import { Card } from "@/components/ui/Card";

const FEATURES = [
  {
    title: "Mailbox existence",
    description: "We check that the mailbox is real, not just the domain.",
  },
  {
    title: "MX record and DNS validation",
    description: "We confirm the domain can actually receive mail.",
  },
  {
    title: "Disposable email detection",
    description: "We flag temporary and throwaway addresses.",
  },
  {
    title: "Spam trap and risk scoring",
    description: "We score addresses likely to harm your sender reputation.",
  },
];

const STEPS = [
  { step: "1", title: "Enter an email address", description: "No account needed for your first checks." },
  { step: "2", title: "We check the mailbox, domain, and risk level", description: "Full verification, not a guess." },
  { step: "3", title: "Get a clear result", description: "Valid, Invalid, or Risky, with a reason." },
];

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <section className="mx-auto max-w-dashboard px-6 py-20">
          <div className="max-w-content">
            <h1 className="animate-fade-up text-4xl font-extrabold tracking-tight text-text md:text-5xl">
              Know before you send.
            </h1>
            <p className="mt-4 max-w-content text-lg text-subtext">
              Verify any email address in seconds. Full mailbox verification, not
              just domain checks.
            </p>
          </div>

          <div className="mt-10 max-w-dashboard">
            <VerifyInput />
          </div>
        </section>

        <section className="mx-auto max-w-dashboard px-6 py-16 border-t border-border">
          <h2 className="text-2xl font-bold text-text">How it works</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.step}>
                <span className="font-mono text-sm text-accent">{s.step}</span>
                <h3 className="mt-2 text-base font-semibold text-text">{s.title}</h3>
                <p className="mt-1 text-sm text-subtext">{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-dashboard px-6 py-16 border-t border-border">
          <h2 className="text-2xl font-bold text-text">What we check</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {FEATURES.map((f) => (
              <Card key={f.title}>
                <h3 className="text-sm font-semibold text-text">{f.title}</h3>
                <p className="mt-1 text-sm text-subtext">{f.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-dashboard px-6 py-16 border-t border-border">
          <Card className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-text">Need to verify a list?</h2>
              <p className="mt-1 text-sm text-subtext">From $3 per 100 emails. Credits never expire.</p>
            </div>
            <Link
              href="/pricing"
              className="rounded-input bg-accent px-4 py-2.5 text-sm font-medium text-bg hover:bg-[#dceb6a]"
            >
              See pricing →
            </Link>
          </Card>
        </section>

        <section className="mx-auto max-w-dashboard px-6 py-16 border-t border-border">
          <h2 className="text-lg font-medium text-subtext">
            Ready to send? Use a trusted email platform.
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <AffiliateCard
              name="Mailchimp"
              description="For newsletters and campaigns"
              href="https://mailchimp.com"
            />
            <AffiliateCard
              name="ConvertKit"
              description="For creators with an audience"
              href="https://convertkit.com"
            />
            <AffiliateCard
              name="ActiveCampaign"
              description="For teams that need automation"
              href="https://activecampaign.com"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
