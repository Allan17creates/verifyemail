import { VerifyInput } from "@/components/verify-input";
import { getCurrentProfile } from "@/lib/get-profile";

export default async function DashboardSinglePage() {
  const session = await getCurrentProfile();
  const credits = session?.profile.credits ?? 0;

  return (
    <div>
      <h1 className="text-xl font-bold text-text">Single Check</h1>
      <p className="mt-1 text-sm text-subtext">{credits} credits remaining</p>
      <div className="mt-8">
        <VerifyInput authenticated />
      </div>
    </div>
  );
}
