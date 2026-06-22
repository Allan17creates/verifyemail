"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { CreditPack } from "@/types";

export function PricingCard({ pack }: { pack: CreditPack }) {
  const [loading, setLoading] = useState(false);
  const perCredit = (pack.price / pack.credits).toFixed(4).replace(/0+$/, "").replace(/\.$/, "");

  async function handleBuy() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId: pack.id }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      if (data.error === "unauthenticated") {
        window.location.href = "/login";
        return;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-text">{pack.name}</h3>
        <p className="text-xs text-subtext">{pack.credits.toLocaleString()} credits</p>
      </div>
      <div>
        <span className="text-3xl font-extrabold text-text">${pack.price}</span>
        <p className="mt-1 text-xs text-subtext">${perCredit} per credit</p>
      </div>
      <Button onClick={handleBuy} disabled={loading}>
        {loading ? "Redirecting…" : `Buy ${pack.name}`}
      </Button>
    </Card>
  );
}
