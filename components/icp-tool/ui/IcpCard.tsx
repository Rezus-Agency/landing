"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ICP } from "@/lib/icp-tool/types";
import { useToolStore } from "@/lib/icp-tool/store";
import { confirmModal } from "./ConfirmModal";
import { toast } from "./ToastProvider";
import { DotsIcon } from "./icons";

const MONTHS = [
  "jan", "fév", "mar", "avr", "mai", "juin",
  "juil", "août", "sep", "oct", "nov", "déc",
];

function fmtDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

interface IcpCardProps {
  icp: ICP;
}

export function IcpCard({ icp }: IcpCardProps) {
  const router = useRouter();
  const renameIcp = useToolStore((s) => s.renameIcp);
  const duplicateIcp = useToolStore((s) => s.duplicateIcp);
  const removeIcp = useToolStore((s) => s.removeIcp);
  const clearSession = useToolStore((s) => s.clearSession);

  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(icp.segment);
  const cardRef = useRef<HTMLElement>(null);

  // Click hors carte → ferme le menu
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const goToResult = () => {
    if (renaming || menuOpen) return;
    router.push(`/icp/tool/result/${icp.id}`);
  };

  const onRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    setRenameValue(icp.segment);
    setRenaming(true);
  };

  const submitRename = () => {
    const v = renameValue.trim();
    if (v && v !== icp.segment) {
      renameIcp(icp.id, v);
      toast("ICP renommé.", "success");
    }
    setRenaming(false);
  };

  const onDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    const newId = duplicateIcp(icp.id);
    if (newId) {
      toast("ICP dupliqué.", "success");
      router.push(`/icp/tool/result/${newId}`);
    }
  };

  const onIterate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    clearSession();
    router.push(`/icp/tool/session/${icp.id}`);
  };

  const onDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    const ok = await confirmModal({
      title: "Supprimer cet ICP ?",
      body: `« ${icp.segment} » sera supprimé définitivement. Cette action est irréversible.`,
      confirm: "Supprimer",
      cancel: "Annuler",
      danger: true,
    });
    if (ok) {
      removeIcp(icp.id);
      toast("ICP supprimé.", "info");
    }
  };

  return (
    <article
      ref={cardRef}
      className="icp-card"
      onClick={goToResult}
      role={renaming || menuOpen ? undefined : "button"}
      tabIndex={renaming ? -1 : 0}
      onKeyDown={(e) => {
        if (renaming || menuOpen) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToResult();
        }
      }}
      style={{
        position: "relative",
        // Quand le menu est ouvert, on remonte l'article au-dessus des sections
        // suivantes (Bientôt disponible) pour éviter qu'elles passent au-dessus.
        zIndex: menuOpen ? 100 : undefined,
      }}
    >
      <div className="icp-card__top">
        <span
          className={`badge ${icp.status === "final" ? "badge--final" : "badge--draft"}`}
        >
          {icp.status === "final" ? "Finalisé" : "Brouillon"}
        </span>
        <button
          type="button"
          className="card-menu-btn"
          aria-label="Options"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
        >
          <DotsIcon />
        </button>
        {menuOpen && (
          <div
            role="menu"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              right: 0,
              minWidth: 200,
              background: "#1a1410",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 10,
              padding: 5,
              display: "flex",
              flexDirection: "column",
              zIndex: 50,
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.5)",
            }}
          >
            <MenuItem label="Renommer" onClick={onRename} />
            <MenuItem label="Dupliquer" onClick={onDuplicate} />
            <MenuItem label="Itérer cet ICP" onClick={onIterate} />
            <div
              aria-hidden
              style={{
                height: 1,
                background: "rgba(255,255,255,0.06)",
                margin: "4px 0",
              }}
            />
            <MenuItem label="Supprimer" onClick={onDelete} danger />
          </div>
        )}
      </div>

      {renaming ? (
        <input
          type="text"
          autoFocus
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Enter") submitRename();
            else if (e.key === "Escape") setRenaming(false);
          }}
          onBlur={submitRename}
          className="icp-card__name"
          style={{
            background: "transparent",
            border: "1px solid var(--accent, #d99543)",
            borderRadius: 6,
            padding: "4px 8px",
            color: "inherit",
            font: "inherit",
            width: "100%",
            outline: "none",
          }}
        />
      ) : (
        <div className="icp-card__name">{icp.segment}</div>
      )}
      <div className="icp-card__sum">{icp.synthese}</div>
      <div className="icp-card__meta">
        <span>v{icp.version}</span>
        <span className="dotsep" aria-hidden="true" />
        <span>créé le {fmtDate(icp.createdAt)}</span>
      </div>
    </article>
  );
}

function MenuItem({
  label,
  onClick,
  danger,
}: {
  label: string;
  onClick: (e: React.MouseEvent) => void;
  danger?: boolean;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover
          ? danger
            ? "rgba(232, 115, 106, 0.12)"
            : "rgba(255, 255, 255, 0.06)"
          : "transparent",
        border: "none",
        textAlign: "left",
        padding: "9px 12px",
        borderRadius: 6,
        cursor: "pointer",
        font: "inherit",
        color: danger ? "#e8736a" : "var(--text-1, #f0e8de)",
        fontSize: 13,
        transition: "background 100ms ease",
      }}
    >
      {label}
    </button>
  );
}
