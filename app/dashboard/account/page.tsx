import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/get-profile";
import { Button } from "@/components/ui/Button";

export default async function AccountPage() {
  const session = await getCurrentProfile();

  async function signOut() {
    "use server";
    const supabase = createClient();
    await supabase.auth.signOut();
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-text">Account</h1>
      <p className="mt-4 text-sm text-subtext">Email</p>
      <p className="text-sm text-text">{session?.profile.email}</p>

      <form action={signOut} className="mt-8">
        <Button variant="secondary" type="submit">
          Log out
        </Button>
      </form>
    </div>
  );
}
