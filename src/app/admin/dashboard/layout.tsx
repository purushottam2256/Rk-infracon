import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ClientLayout from "./ClientLayout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Strict server-side auth check
  if (!user) {
    redirect("/admin");
  }

  return <ClientLayout>{children}</ClientLayout>;
}
