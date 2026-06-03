"use client";

import { useRouter } from "next/navigation";
import type { ICP } from "@/lib/icp-tool/types";
import { DotsIcon } from "./icons";

const MONTHS = [
  "jan",
  "fév",
  "mar",
  "avr",
  "mai",
  "juin",
  "juil",
  "août",
  "sep",
  "oct",
  "nov",
  "déc",
];

function fmtDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

interface IcpCardProps {
  icp: ICP;
  /** Ouvre le menu contextuel à côté du bouton dots. C.2 — pour l'instant juste un placeholder. */
  onMenu?: (icp: ICP, btn: HTMLButtonElement) => void;
}

export function IcpCard({ icp, onMenu }: IcpCardProps) {
  const router = useRouter();

  return (
    <article
      className="icp-card"
      onClick={() => router.push(`/icp/tool/result/${icp.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/icp/tool/result/${icp.id}`);
        }
      }}
    >
      <div className="icp-card__top">
        <span className={`badge ${icp.status === "final" ? "badge--final" : "badge--draft"}`}>
          {icp.status === "final" ? "Finalisé" : "Brouillon"}
        </span>
        <button
          type="button"
          className="card-menu-btn"
          aria-label="Options de l'ICP"
          onClick={(e) => {
            e.stopPropagation();
            onMenu?.(icp, e.currentTarget);
          }}
        >
          <DotsIcon />
        </button>
      </div>
      <div className="icp-card__name">{icp.segment}</div>
      <div className="icp-card__sum">{icp.synthese}</div>
      <div className="icp-card__meta">
        <span>v{icp.version}</span>
        <span className="dotsep" aria-hidden="true" />
        <span>créé le {fmtDate(icp.createdAt)}</span>
      </div>
    </article>
  );
}
