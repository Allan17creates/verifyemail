"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { VerificationResult } from "@/types";

const STATUS_CONFIG = {
  valid: { label: "Valid", variant: "success" as const, icon: "✓" },
  invalid: { label: "Invalid", variant: "error" as const, icon: "✗" },
  risky: { label: "Risky", variant: "warning" as const, icon: "⚠" },
};

export function ResultDisplay({
  result,
  onDidYouMean,
  locked,
}: {
  result: VerificationResult;
  onDidYouMean?: (email: string) => void;
  locked?: boolean;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const config = STATUS_CONFIG[result.result];

  return (
    <Card
      className={`animate-slide-in-right ${locked ? "pointer-events-none select-none blur-sm" : ""}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-text">{result.email}</span>
        <Badge variant={config.variant}>
          {config.icon} {config.label}
        </Badge>
      </div>
      <p className="mt-3 text-sm text-subtext">{result.reason}</p>

      {result.did_you_mean && (
        <button
          onClick={() => onDidYouMean?.(result.did_you_mean!)}
          className="mt-3 text-sm text-accent hover:underline"
        >
          Did you mean {result.did_you_mean}? Verify instead →
        </button>
      )}

      <button
        onClick={() => setShowDetails((s) => !s)}
        className="mt-4 text-xs font-medium text-subtext hover:text-text"
      >
        {showDetails ? "Hide details" : "Show details"}
      </button>

      {showDetails && (
        <div className="mt-3 space-y-1.5 border-t border-border pt-3 font-mono text-xs text-subtext">
          <div>Domain: {result.domain}</div>
          <div>MX found: {result.mx_found ? "Yes" : "No"}</div>
          {result.mx_record && <div>MX record: {result.mx_record}</div>}
          <div>Disposable: {result.disposable ? "Yes" : "No"}</div>
          <div>Risk: {result.risk}</div>
        </div>
      )}
    </Card>
  );
}
