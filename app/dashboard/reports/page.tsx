import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/get-profile";
import { Badge } from "@/components/ui/Badge";
import type { BulkJob } from "@/types";

export default async function ReportsPage() {
  const session = await getCurrentProfile();
  const supabase = createClient();

  const { data: jobs } = session
    ? await supabase
        .from("bulk_jobs")
        .select("*")
        .eq("user_id", session.userId)
        .order("created_at", { ascending: false })
    : { data: [] };

  const rows = (jobs ?? []) as BulkJob[];

  return (
    <div>
      <h1 className="text-xl font-bold text-text">My Reports</h1>
      <p className="mt-1 text-sm text-subtext">Reports are kept for 30 days.</p>

      {rows.length === 0 ? (
        <p className="mt-8 text-sm text-subtext">
          No reports yet. Upload a CSV from Bulk Upload to create one.
        </p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-card border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-subtext">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">File</th>
                <th className="px-4 py-3 font-medium">Emails</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Download</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((job) => (
                <tr key={job.id} className="border-t border-border text-text">
                  <td className="px-4 py-3">
                    {new Date(job.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{job.file_name}</td>
                  <td className="px-4 py-3">{job.total_emails}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        job.status === "complete"
                          ? "success"
                          : job.status === "failed"
                            ? "error"
                            : "neutral"
                      }
                    >
                      {job.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {job.status === "complete" ? (
                      <a
                        href={`/api/download/${job.id}`}
                        className="text-accent hover:underline"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-subtext">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
