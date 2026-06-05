"use client";

import { useEffect, useRef } from "react";
import { useToolStore } from "@/lib/icp-tool/store";
import { CopyButton } from "./CopyButton";
import { toast } from "@/components/icp-tool/ui/ToastProvider";
import { ExternalIcon, LockIcon } from "@/components/icp-tool/ui/icons";

interface Props {
  icpId: string;
  open: boolean;
  onClose: () => void;
}

export function ShareDialog({ icpId, open, onClose }: Props) {
  const enableShare = useToolStore((s) => s.enableShare);
  const disableShare = useToolStore((s) => s.disableShare);
  // On suit l'ICP lui-même (référence stable du tableau) : le partage est
  // porté par ses champs shareId / shared, mis à jour en write-through DB.
  const icp = useToolStore((s) => s.icpById(icpId));
  const inputRef = useRef<HTMLInputElement>(null);

  // Ensure share is enabled when dialog opens.
  useEffect(() => {
    if (open) enableShare(icpId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const info = icp && icp.shareId ? { shareId: icp.shareId, enabled: !!icp.shared } : null;
  const url =
    typeof window !== "undefined" && info
      ? `${window.location.origin}/icp/public/${info.shareId}`
      : "";

  const onDisable = () => {
    disableShare(icpId);
    toast("Partage désactivé.", "info");
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="share-title">
        <h3 id="share-title">Partager cette analyse</h3>
        <p>
          Toute personne avec ce lien pourra consulter l&apos;analyse en lecture seule, sans
          compte.
        </p>

        <div className="share-link">
          <input
            ref={inputRef}
            type="text"
            readOnly
            value={url}
            onClick={(e) => e.currentTarget.select()}
            aria-label="URL de partage"
          />
          <CopyButton
            text={url}
            label="Copier"
            className="btn btn--primary btn--sm"
          />
        </div>

        <div className="share-opts">
          {info && (
            <a
              className="share-opt"
              href={`/icp/public/${info.shareId}`}
              target="_blank"
              rel="noopener"
            >
              <ExternalIcon /> Ouvrir la page publique
            </a>
          )}
          <button type="button" className="share-opt danger" onClick={onDisable}>
            <LockIcon /> Désactiver le partage
          </button>
        </div>

        <div className="modal__actions">
          <button type="button" className="btn btn--ghost btn--sm" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
