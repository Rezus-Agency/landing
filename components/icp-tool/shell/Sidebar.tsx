"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useToolStore } from "@/lib/icp-tool/store";
import { confirmModal } from "@/components/icp-tool/ui/ConfirmModal";
import { toast } from "@/components/icp-tool/ui/ToastProvider";
import {
  GridIcon,
  LogoutIcon,
  SparkIcon,
  UserIcon,
} from "@/components/icp-tool/ui/icons";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const user = useToolStore((s) => s.auth);
  const logout = useToolStore((s) => s.logout);
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [menuOpen]);

  const dashActive = pathname?.startsWith("/icp/tool/dashboard");

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <Link className="sidebar__brand" href="/icp/tool/dashboard" onClick={onClose}>
        <span className="logo__mark">Rezus</span>
        <span className="logo__word">ICP&nbsp;Discovery</span>
      </Link>
      <div className="sidebar__cta">
        <Link href="/icp/tool/new" className="btn btn--primary" onClick={onClose}>
          <SparkIcon />
          Nouvelle session
        </Link>
      </div>
      <Link
        href="/icp/tool/dashboard"
        className={`side-link ${dashActive ? "active" : ""}`}
        onClick={onClose}
      >
        <GridIcon />
        Mes ICPs
      </Link>
      <div className="sidebar__spacer" />
      <div className="sidebar__hint">
        <SparkIcon />
        <span>
          ICP discovery.
          <br />
          Pas ICP validation.
        </span>
      </div>
      <div ref={wrapRef} style={{ position: "relative" }}>
        <button
          type="button"
          className="user-chip"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          <span className="avatar">{user?.initials || "?"}</span>
          <span className="user-chip__meta">
            <span className="user-chip__name">{user?.name || ""}</span>
            <span className="user-chip__mail">{user?.email || ""}</span>
          </span>
        </button>
        <div className={`user-chip__menu ${menuOpen ? "open" : ""}`} role="menu">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onClose();
              router.push("/icp/tool/profile");
            }}
          >
            <UserIcon /> Profil
          </button>
          <button
            type="button"
            onClick={async () => {
              setMenuOpen(false);
              const ok = await confirmModal({
                title: "Se déconnecter ?",
                body: "Votre travail est sauvegardé.",
                confirm: "Se déconnecter",
              });
              if (ok) {
                logout();
                toast("À bientôt.");
                onClose();
                router.push("/login");
              }
            }}
          >
            <LogoutIcon /> Se déconnecter
          </button>
        </div>
      </div>
    </aside>
  );
}
