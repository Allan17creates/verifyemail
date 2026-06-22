import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";

export async function getCurrentProfile(): Promise<{ userId: string; profile: Profile } | null> {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .single();

  if (!profile) {
    const { data: created } = await supabase
      .from("profiles")
      .insert({ id: userData.user.id, email: userData.user.email })
      .select("*")
      .single();
    return created ? { userId: userData.user.id, profile: created as Profile } : null;
  }

  return { userId: userData.user.id, profile: profile as Profile };
}
