"use client";

import { useCallback, useRef, useState } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/progress-bar";

const EMAIL_HEADER_CANDIDATES = ["email", "Email", "EMAIL", "e-mail"];

function extractEmails(rows: Record<string, string>[], fields: string[] | undefined): string[] {
  const headerField = fields?.find((f) => EMAIL_HEADER_CANDIDATES.includes(f));
  const key = headerField ?? fields?.[0];
  if (!key) return [];

  return rows
    .map((row) => (row[key] ?? "").trim())
    .filter((email) => email.length > 0);
}

export function BulkUploader({ creditsAvailable }: { creditsAvailable: number }) {
  const [emails, setEmails] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "complete" | "failed">("idle");
  const [progress, setProgress] = useState({ processed: 0, total: 0 });
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    setError(null);
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const extracted = extractEmails(results.data, results.meta.fields);
        setEmails(extracted);
      },
      error: () => setError("Couldn't parse this file. Make sure it's a valid CSV."),
    });
  }, []);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  const insufficientCredits = emails.length > creditsAvailable;

  async function startVerification() {
    if (!fileName || emails.length === 0) return;
    setStatus("uploading");
    setError(null);

    try {
      const res = await fetch("/api/bulk-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, emails }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Couldn't start verification.");
        setStatus("failed");
        return;
      }

      setJobId(data.jobId);
      setStatus("processing");
      poll(data.jobId);
    } catch {
      setError("Couldn't reach the server. Try again.");
      setStatus("failed");
    }
  }

  function poll(id: string) {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/job-status/${id}`);
      const data = await res.json();
      setProgress({ processed: data.processed, total: data.total_emails });

      if (data.status === "complete" || data.status === "failed") {
        clearInterval(interval);
        setStatus(data.status);
      }
    }, 2000);
  }

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-card border border-dashed p-10 text-center transition-colors duration-100 ${
          dragOver ? "border-accent bg-surface" : "border-border bg-surface"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <p className="text-sm text-text">Drop a CSV file here, or click to select one</p>
        <p className="mt-1 text-xs text-subtext">
          A single column of emails, or a CSV with an email column.
        </p>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      {emails.length > 0 && status === "idle" && (
        <Card>
          <p className="text-sm text-text">
            {emails.length} emails detected · This will use {emails.length} credits
          </p>

          <div className="mt-4 overflow-hidden rounded-input border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg text-subtext">
                <tr>
                  <th className="px-3 py-2 font-medium">Email</th>
                </tr>
              </thead>
              <tbody className="font-mono text-text">
                {emails.slice(0, 10).map((email, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-3 py-2">{email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {insufficientCredits ? (
            <div className="mt-4">
              <p className="text-sm text-error">
                You need {emails.length} credits but only have {creditsAvailable}.
              </p>
              <a href="/pricing" className="mt-1 inline-block text-sm text-accent hover:underline">
                Buy more credits →
              </a>
            </div>
          ) : (
            <Button className="mt-4" onClick={startVerification}>
              Verify all emails
            </Button>
          )}
        </Card>
      )}

      {(status === "uploading" || status === "processing") && (
        <Card>
          <p className="mb-3 text-sm text-text">
            {status === "uploading" ? "Starting verification…" : "Verifying emails…"}
          </p>
          <ProgressBar value={progress.processed} max={progress.total || emails.length} />
        </Card>
      )}

      {status === "complete" && jobId && (
        <Card>
          <p className="text-sm text-text">Verification complete.</p>
          <a
            href={`/api/download/${jobId}`}
            className="mt-3 inline-block text-sm text-accent hover:underline"
          >
            Download report →
          </a>
        </Card>
      )}

      {status === "failed" && (
        <Card>
          <p className="text-sm text-error">Verification failed. Try uploading again.</p>
        </Card>
      )}
    </div>
  );
}
