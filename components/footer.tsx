import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-dashboard px-6 py-10">
        <nav className="mb-4 flex flex-wrap gap-6 text-sm text-subtext">
          <Link href="/" className="hover:text-text">
            Home
          </Link>
          <Link href="/pricing" className="hover:text-text">
            Pricing
          </Link>
          <Link href="/blog" className="hover:text-text">
            Blog
          </Link>
          <Link href="/terms" className="hover:text-text">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-text">
            Privacy
          </Link>
        </nav>
        <p className="text-xs text-subtext">
          verifyemail.app, full mailbox verification, built for people who
          care about deliverability.
        </p>
      </div>
    </footer>
  );
}
