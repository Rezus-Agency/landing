"use client";

import { useEffect } from "react";
import { CopyButton } from "./CopyButton";
import { icpToClaySpec } from "@/lib/icp-tool/clay-export";
import { toast } from "@/components/icp-tool/ui/ToastProvider";
import type { ICP } from "@/lib/icp-tool/types";

interface Props {
  icp: ICP;
  open: boolean;
  onClose: () => void;
}

export function ClayExportDialog({ icp, open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const spec = icpToClaySpec(icp);

  const onDownload = () => {
    const blob = new Blob([spec], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const slug =
      (icp.segment || "icp")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-zA-Z0-9-_]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 50) || "icp";
    a.download = `clay-table-${slug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast("Spec téléchargée.", "success");
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal modal--wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="clay-title"
      >
        <h3 id="clay-title">Exporter la table Clay</h3>
        <p>
          Une spec prête à coller dans Clay (Claygent) ou dans un LLM pour bâtir ta table
          de leads : sourcing, colonnes d&apos;enrichissement, signaux de timing et
          scoring. À filtrer et qualifier ensuite, ce n&apos;est pas une liste finale.
        </p>

        <textarea
          className="clay-spec"
          readOnly
          value={spec}
          onFocus={(e) => e.currentTarget.select()}
          aria-label="Spec table Clay"
        />

        <div className="modal__actions">
          <CopyButton text={spec} label="Copier la spec" className="btn btn--primary btn--sm" />
          <button type="button" className="btn btn--secondary btn--sm" onClick={onDownload}>
            Télécharger .md
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
