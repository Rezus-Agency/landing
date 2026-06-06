import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ToastHost } from "@/components/icp-tool/ui/ToastProvider";
import { createClient } from "@/lib/supabase/server";
import "../icp/tool/_tool.css";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  // Un utilisateur déjà connecté qui arrive sur /login ou /signup est renvoyé
  // au dashboard. On exclut /reset et /update-password (flux mot de passe oublié,
  // qui s'appuie sur la session de récupération).
  const path = (await headers()).get("x-pathname") || "";
  if (path.startsWith("/login") || path.startsWith("/signup")) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/icp/tool/dashboard");
  }

  return (
    <>
      <main id="main" tabIndex={-1} className="auth">
        {children}
      </main>
      <ToastHost />
    </>
  );
}
