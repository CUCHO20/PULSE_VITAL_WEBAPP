import { redirect } from 'next/navigation';
import { createClient } from "@/lib/server";
import { Dashboard } from "@/components/dashboard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_completed) {
    redirect("/dashboard/onboarding");
  }

  return <Dashboard user={user} profile={profile} />;
}
