"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });

    setLoading(false);

    if (error) {
      setError("Couldn't send the link. Check the address and try again.");
      return;
    }

    setSent(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-sm">
        <Link href="/" className="text-sm font-bold text-text">
          verifyemail<span className="text-accent">.app</span>
        </Link>

        <h1 className="mt-6 text-xl font-bold text-text">Log in</h1>
        <p className="mt-1 text-sm text-subtext">
          We&apos;ll email you a link. No password needed.
        </p>

        {sent ? (
          <p className="mt-6 text-sm text-text">
            Check your inbox, we sent you a login link.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <Input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending…" : "Send login link"}
            </Button>
            {error && <p className="text-sm text-error">{error}</p>}
          </form>
        )}
      </Card>
    </main>
  );
}
