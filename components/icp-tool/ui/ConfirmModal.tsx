"use client";

/**
 * Confirm modal système pour l'outil ICP.
 * - <ConfirmHost /> à mount une seule fois.
 * - confirmModal({title, body, confirm, cancel, danger}) → Promise<boolean>
 *
 * Pattern : événement module-level. Pas de Radix Dialog (déjà installé mais
 * overkill ici). Focus trap basique, ESC pour annuler.
 */

import { useEffect, useState } from "react";
import { InfoIcon, XIcon } from "./icons";

type Options = {
  title: string;
  body?: string;
  confirm?: string;
  cancel?: string;
  danger?: boolean;
};

type Resolver = (v: boolean) => void;

let activeOpts: Options | null = null;
let activeResolver: Resolver | null = null;
const listeners = new Set<(o: Options | null) => void>();

function emit() {
  for (const l of listeners) l(activeOpts);
}

export function confirmModal(opts: Options): Promise<boolean> {
  return new Promise((resolve) => {
    if (activeResolver) activeResolver(false);
    activeOpts = opts;
    activeResolver = resolve;
    emit();
  });
}

function close(value: boolean) {
  const r = activeResolver;
  activeOpts = null;
  activeResolver = null;
  emit();
  if (r) r(value);
}

export function ConfirmHost() {
  const [opts, setOpts] = useState<Options | null>(activeOpts);

  useEffect(() => {
    const l = (o: Options | null) => setOpts(o);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  useEffect(() => {
    if (!opts) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [opts]);

  if (!opts) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) close(false);
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="cf-title">
        <div className={`modal__icon ${opts.danger ? "modal__icon--danger" : ""}`}>
          {opts.danger ? <XIcon /> : <InfoIcon />}
        </div>
        <h3 id="cf-title">{opts.title}</h3>
        {opts.body && <p>{opts.body}</p>}
        <div className="modal__actions">
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() => close(false)}
          >
            {opts.cancel || "Annuler"}
          </button>
          <button
            type="button"
            className={`btn btn--sm ${opts.danger ? "btn--danger" : "btn--primary"}`}
            onClick={() => close(true)}
            autoFocus
          >
            {opts.confirm || "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );
}
