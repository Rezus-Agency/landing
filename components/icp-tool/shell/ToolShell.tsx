"use client";

/**
 * Client-side wrapper for /icp/tool/* pages.
 * - Adds body.app class for fullscreen layout (no scroll on body).
 * - Affiche un état neutre tant que la session Supabase n'est pas hydratée
 *   (la protection réelle est faite côté serveur par middleware.ts ; AuthSync
 *   alimente `store.auth`).
 * - Mounts ToastHost + ConfirmHost.
 * - Manages mobile sidebar state.
 */

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useToolStore } from "@/lib/icp-tool/store";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Scrim } from "./Scrim";
import { ToastHost } from "@/components/icp-tool/ui/ToastProvider";
import { ConfirmHost } from "@/components/icp-tool/ui/ConfirmModal";

/** Routes qui prennent tout l'écran (pas de sidebar). */
function isFullApp(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname.startsWith("/icp/tool/session/") ||
    pathname.startsWith("/icp/tool/result/") ||
    pathname.startsWith("/icp/tool/onboarding")
  );
}

export function ToolShell({ children }: { children: React.ReactNode }) {
  const isAuthed = useToolStore((s) => !!s.auth);
  const [hydrated, setHydrated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const fullApp = isFullApp(pathname);

  useEffect(() => {
    document.documentElement.classList.add("app");
    document.body.classList.add("app");
    return () => {
      document.documentElement.classList.remove("app");
      document.body.classList.remove("app");
    };
  }, []);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Tant que la session Supabase n'est pas hydratée par AuthSync, on rend un
  // état neutre. Pas de redirect ici : le middleware serveur a déjà garanti
  // qu'un utilisateur non connecté n'atteint jamais cette page.
  if (!hydrated || !isAuthed) {
    return (
      <>
        <ToastHost />
        <ConfirmHost />
      </>
    );
  }

  if (fullApp) {
    return (
      <>
        <main id="main" tabIndex={-1} style={{ height: "100vh", display: "contents" }}>
          {children}
        </main>
        <ToastHost />
        <ConfirmHost />
      </>
    );
  }

  return (
    <>
      <Scrim show={mobileOpen} onClick={() => setMobileOpen(false)} />
      <Topbar onMenuClick={() => setMobileOpen(true)} />
      <div className="shell">
        <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
        <main className="main" id="main" tabIndex={-1}>
          {children}
        </main>
      </div>
      <ToastHost />
      <ConfirmHost />
    </>
  );
}
