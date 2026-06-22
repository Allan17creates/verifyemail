import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { verifyEmail } from "@/lib/zerobounce";
import { isValidEmailSyntax } from "@/lib/utils";

const CHUNK_SIZE = 200;

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const fileName: string | undefined = body?.fileName;
  const emails: string[] | undefined = body?.emails;

  if (!fileName || !Array.isArray(emails) || emails.length === 0) {
    return NextResponse.json({ error: "No emails found in this file." }, { status: 400 });
  }

  const cleanEmails = emails.map((e) => e.trim()).filter((e) => e.length > 0 && isValidEmailSyntax(e));

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", userData.user.id)
    .single();

  if (!profile || profile.credits < cleanEmails.length) {
    return NextResponse.json(
      { error: `You need ${cleanEmails.length} credits but only have ${profile?.credits ?? 0}.` },
      { status: 402 }
    );
  }

  const { data: job, error: jobError } = await supabase
    .from("bulk_jobs")
    .insert({
      user_id: userData.user.id,
      file_name: fileName,
      total_emails: cleanEmails.length,
      status: "pending",
      credits_used: cleanEmails.length,
    })
    .select("*")
    .single();

  if (jobError || !job) {
    return NextResponse.json({ error: "Couldn't start the job. Try again." }, { status: 500 });
  }

  await supabase
    .from("profiles")
    .update({ credits: profile.credits - cleanEmails.length })
    .eq("id", userData.user.id);

  // Fire-and-forget: Vercel serverless functions don't support true background
  // work past the response, so a production deploy should hand this off to a
  // queue (e.g. QStash, Inngest) instead of relying on this promise running to completion.
  processJob(job.id, cleanEmails).catch((err) => console.error("bulk job failed", err));

  return NextResponse.json({ jobId: job.id });
}

async function processJob(jobId: string, emails: string[]) {
  const admin = createAdminClient();
  await admin.from("bulk_jobs").update({ status: "processing" }).eq("id", jobId);

  let processed = 0;
  let validCount = 0;
  let invalidCount = 0;
  let riskyCount = 0;

  for (let i = 0; i < emails.length; i += CHUNK_SIZE) {
    const chunk = emails.slice(i, i + CHUNK_SIZE);

    const results = await Promise.all(
      chunk.map(async (email) => {
        try {
          return await verifyEmail(email);
        } catch {
          return {
            result: "risky" as const,
            email,
            reason: "Verification failed for this address.",
            risk: "medium" as const,
            domain: email.split("@")[1] ?? "",
            disposable: false,
          };
        }
      })
    );

    await admin.from("verification_results").insert(
      results.map((r) => ({
        job_id: jobId,
        email: r.email,
        status: r.result,
        reason: r.reason,
        risk_level: r.risk,
        domain: r.domain,
        disposable: r.disposable,
        mx_found: r.mx_found ?? false,
      }))
    );

    for (const r of results) {
      if (r.result === "valid") validCount++;
      else if (r.result === "invalid") invalidCount++;
      else riskyCount++;
    }

    processed += chunk.length;

    await admin
      .from("bulk_jobs")
      .update({ processed, valid_count: validCount, invalid_count: invalidCount, risky_count: riskyCount })
      .eq("id", jobId);
  }

  await admin
    .from("bulk_jobs")
    .update({ status: "complete", completed_at: new Date().toISOString() })
    .eq("id", jobId);
}
