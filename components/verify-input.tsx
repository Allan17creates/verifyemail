"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ResultDisplay } from "@/components/result-display";
import { isValidEmailSyntax } from "@/lib/utils";
import type { VerificationResult } from "@/types";

const FREE_LIMIT = 3;
const STORAGE_KEY = "ve_checks";

interface CheckStore {
  count: number;
  date: string;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function readStore(): CheckStore {
  if (typeof window === "undefined") return { count: 0, date: todayKey() };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, date: todayKey() };
    const parsed: CheckStore = JSON.parse(raw);
    if (parsed.date !== todayKey()) return { count: 0, date: todayKey() };
    return parsed;
  } catch {
    return { count: 0, date: todayKey() };
  }
}

function writeStore(store: CheckStore) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function VerifyInput({ authenticated = false }: { authenticated?: boolean }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [checksUsed, setChecksUsed] = useState(0);

  useEffect(() => {
    if (!authenticated) setChecksUsed(readStore().count);
  }, [authenticated]);

  const limitReached = !authenticated && checksUsed >= FREE_LIMIT;

  async function runVerify(targetEmail: string) {
    if (!isValidEmailSyntax(targetEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!authenticated && limitReached) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
        return;
      }

      setResult(data);

      if (!authenticated) {
        const store = readStore();
        const updated = { count: store.count + 1, date: todayKey() };
        writeStore(updated);
        setChecksUsed(updated.count);
      }
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runVerify(email);
  }

  const showBlur = !authenticated && checksUsed > FREE_LIMIT;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={limitReached}
            required
          />
          <Button type="submit" disabled={loading || limitReached}>
            {loading ? "Checking…" : "Verify"}
          </Button>
        </form>

        {!authenticated && (
          <span className="mt-3 inline-flex rounded-input border border-border bg-surface px-2.5 py-1 text-xs text-subtext">
            {FREE_LIMIT - checksUsed > 0
              ? `${FREE_LIMIT - checksUsed} free checks left today · No account needed`
              : "3 free checks · No account needed"}
          </span>
        )}

        {error && <p className="mt-3 text-sm text-error">{error}</p>}

        {limitReached && (
          <div className="mt-4 rounded-card border border-border bg-surface p-4">
            <p className="text-sm text-text">
              You&apos;ve used your 3 free checks today. Upgrade to continue.
            </p>
            <a
              href="/pricing"
              className="mt-2 inline-block text-sm text-accent hover:underline"
            >
              See pricing →
            </a>
          </div>
        )}
      </div>

      <div>
        {result && (
          <ResultDisplay
            result={result}
            locked={showBlur}
            onDidYouMean={(suggested) => {
              setEmail(suggested);
              runVerify(suggested);
            }}
          />
        )}
      </div>
    </div>
  );
}
