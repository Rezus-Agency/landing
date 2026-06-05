import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ToolShell } from "@/components/icp-tool/shell/ToolShell";
import { AuthSync } from "@/components/icp-tool/auth/AuthSync";
import { createClient } from "@/lib/supabase/server";
import "./_tool.css";

/**
 * Gate serveur de l'outil ICP. Ne s'exécute que pour les routes /icp/tool/*
 * qui existent réellement (sinon Next rend la page 404 sans passer par ce
 * layout). Un visiteur non connecté est redirigé vers /login ; les routes
 * inconnues affichent la vraie 404.
 */
export default async function ICPToolLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = (await headers()).get("x-pathname") || "/icp/tool/dashboard";

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(path)}`);
  }

  // Nouveau compte (Google ou email) pas encore passé par l'onboarding :
  // on l'y envoie. On exempte la page d'onboarding elle-même (sinon boucle).
  const onboarded = user.user_metadata?.onboarded === true;
  if (!onboarded && !path.startsWith("/icp/tool/onboarding")) {
    redirect("/icp/tool/onboarding");
  }

  return (
    <>
      <AuthSync />
      <ToolShell>{children}</ToolShell>
    </>
  );
}
