import Link from "next/link";

export function Nav() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-dashboard items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-bold tracking-tight text-text">
          verifyemail<span className="text-accent">.app</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-subtext">
          <Link href="/pricing" className="hover:text-text">
            Pricing
          </Link>
          <Link href="/blog" className="hover:text-text">
            Blog
          </Link>
          <Link href="/login" className="hover:text-text">
            Log in
          </Link>
          <Link
            href="/login"
            className="rounded-input bg-accent px-3.5 py-1.5 text-bg hover:bg-[#dceb6a]"
          >
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}
