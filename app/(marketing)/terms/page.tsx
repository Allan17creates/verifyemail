import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata = { title: "Terms of Service, verifyemail.app" };

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-content px-6 py-20">
        <h1 className="text-3xl font-extrabold tracking-tight text-text">Terms of Service</h1>
        <p className="mt-2 text-sm text-subtext">Last updated: January 2026</p>

        <div className="prose-article mt-10">
          <h2>1. What we do</h2>
          <p>
            verifyemail.app provides email address verification services, including
            single-address checks and bulk verification of uploaded lists. We check
            whether an email address is likely to be real, deliverable, and low-risk
            to send to.
          </p>

          <h2>2. Using the service</h2>
          <p>
            You can use a limited number of free checks per day without an account.
            Bulk verification and unlimited single checks require an account and
            available credits. You agree to use the service only for lawful purposes
            and not to verify lists obtained through illegal means.
          </p>

          <h2>3. Credits</h2>
          <p>
            Credits are purchased in packs and do not expire. Credits are non-refundable
            once used. If you believe you were charged in error, contact us and we'll
            look into it.
          </p>

          <h2>4. Accuracy of results</h2>
          <p>
            We verify email addresses using third-party mail server checks. While we aim
            for high accuracy, no verification service can guarantee 100% correctness -
            mail servers change, mailboxes get created or deleted, and some servers
            don't respond to verification attempts in a way that gives a definitive
            answer. Results should be treated as a strong signal, not an absolute
            guarantee.
          </p>

          <h2>5. Acceptable use</h2>
          <p>
            You may not use verifyemail.app to verify lists for spam campaigns, to
            harass individuals, or to circumvent another service's rate limits or
            terms of service. We reserve the right to suspend accounts that we
            reasonably believe are violating this.
          </p>

          <h2>6. Data handling</h2>
          <p>
            Uploaded lists and verification results are stored only as long as needed
            to provide the service. See our{" "}
            <a href="/privacy">Privacy Policy</a> for details on how we handle your data.
          </p>

          <h2>7. Limitation of liability</h2>
          <p>
            verifyemail.app is provided as-is. We are not liable for indirect damages
            arising from bounced emails, lost business, or decisions made based on
            verification results.
          </p>

          <h2>8. Changes to these terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the service
            after changes means you accept the updated terms.
          </p>

          <h2>9. Contact</h2>
          <p>Questions about these terms can be sent to support@verifyemail.app.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
