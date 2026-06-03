"use client";

/**
 * Client-side wrapper for /icp/tool/* pages.
 * - Adds body.app class for fullscreen layout (no scroll on body).
 * - Auth gate: si pas connecté, redirect vers /login.
 * - Mounts ToastHost + ConfirmHost.
 * - Manages mobile sidebar state.
 */

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
    pathname.startsWith("/icp/tool/session/") || pathname.startsWith("/icp/tool/result/")
  );
}

export function ToolShell({ children }: { children: React.ReactNode }) {
  const isAuthed = useToolStore((s) => !!s.auth);
  const [hydrated, setHydrated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
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

  useEffect(() => {
    if (hydrated && !isAuthed) router.replace("/login");
  }, [hydrated, isAuthed, router]);

  // Avant l'hydratation, on rend rien (évite un flash de contenu auth-gated).
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
