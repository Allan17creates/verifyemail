import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata = { title: "Privacy Policy, verifyemail.app" };

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-content px-6 py-20">
        <h1 className="text-3xl font-extrabold tracking-tight text-text">Privacy Policy</h1>
        <p className="mt-2 text-sm text-subtext">Last updated: January 2026</p>

        <div className="prose-article mt-10">
          <h2>1. What we collect</h2>
          <p>
            When you use a free check, we process the email address you submit to verify
            it, we don't require any personal information beyond that. If you create an
            account, we collect your email address for authentication and billing
            purposes.
          </p>

          <h2>2. Email addresses you submit for verification</h2>
          <p>
            Single-check addresses are processed to return a result and are not stored
            beyond what's needed for rate limiting. Bulk-uploaded lists are stored
            temporarily to generate your verification report, and reports are
            automatically deleted from our storage after 30 days.
          </p>

          <h2>3. How we use your data</h2>
          <p>
            We use your account email to send login links, purchase receipts, and
            service-related updates. We do not sell your data or the email lists you
            upload to third parties.
          </p>

          <h2>4. Third-party services</h2>
          <p>
            We use Supabase for authentication and data storage, Stripe for payment
            processing, and ZeroBounce for the underlying mailbox verification checks.
            Each of these providers has its own privacy practices governing how they
            handle data passed to them.
          </p>

          <h2>5. Data retention</h2>
          <p>
            Bulk verification reports and their underlying results are kept for 30 days
            and then permanently deleted. Account data is retained as long as your
            account is active.
          </p>

          <h2>6. Your rights</h2>
          <p>
            You can request deletion of your account and associated data at any time by
            contacting us. We'll process deletion requests within a reasonable time
            frame.
          </p>

          <h2>7. Security</h2>
          <p>
            We use industry-standard practices to protect your data, including encrypted
            connections and access controls on stored data. No system is perfectly
            secure, but we take reasonable steps to protect what you share with us.
          </p>

          <h2>8. Changes to this policy</h2>
          <p>
            We may update this policy as our service evolves. We'll post updates here
            with a revised date.
          </p>

          <h2>9. Contact</h2>
          <p>Questions about this policy can be sent to privacy@verifyemail.app.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
