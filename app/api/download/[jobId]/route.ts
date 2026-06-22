import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { VerificationRow } from "@/types";

function toCsv(rows: VerificationRow[]): string {
  const header = "Email,Status,Reason,Risk Level,Domain,Disposable,MX Found";
  const lines = rows.map((r) => {
    const status = r.status.charAt(0).toUpperCase() + r.status.slice(1);
    const risk = r.risk_level.charAt(0).toUpperCase() + r.risk_level.slice(1);
    const escapedReason = `"${r.reason.replace(/"/g, '""')}"`;
    return [
      r.email,
      status,
      escapedReason,
      risk,
      r.domain,
      r.disposable ? "Yes" : "No",
      r.mx_found ? "Yes" : "No",
    ].join(",");
  });
  return [header, ...lines].join("\n");
}

export async function GET(req: NextRequest, { params }: { params: { jobId: string } }) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { data: job } = await supabase
    .from("bulk_jobs")
    .select("*")
    .eq("id", params.jobId)
    .eq("user_id", userData.user.id)
    .single();

  if (!job || job.status !== "complete") {
    return NextResponse.json({ error: "Report not ready." }, { status: 404 });
  }

  const { data: rows } = await supabase
    .from("verification_results")
    .select("*")
    .eq("job_id", params.jobId);

  const csv = toCsv((rows ?? []) as VerificationRow[]);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${job.file_name.replace(/\.csv$/, "")}-report.csv"`,
    },
  });
}
