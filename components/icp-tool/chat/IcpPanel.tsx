"use client";

import type { ICPSection } from "@/lib/icp-tool/types";
import { CheckIcon, SparkIcon } from "@/components/icp-tool/ui/icons";

export const PANEL_SECTIONS: { key: string; name: string }[] = [
  { key: "synthese", name: "Synthèse" },
  { key: "identite", name: "Identité du décideur" },
  { key: "psychologie", name: "Psychologie du décideur" },
  { key: "marche", name: "Marché ciblé" },
  { key: "challenges", name: "Challenges identifiés" },
  { key: "avantages", name: "Avantages concurrentiels" },
];

interface Props {
  panel: Record<string, ICPSection>;
  isFinal: boolean;
  onGenerate: () => void;
}

export function IcpPanel({ panel, isFinal, onGenerate }: Props) {
  const progress = PANEL_SECTIONS.reduce(
    (acc, s) => acc + (panel[s.key]?.status === "done" ? 1 : 0),
    0,
  );

  return (
    <aside className="icp-panel">
      <div className="icp-panel__head">
        <span className="eyebrow">ICP en construction</span>
        <h3>
          <span>Le profil se dessine</span>
          <span className="icp-panel__progress">
            {progress}/{PANEL_SECTIONS.length}
          </span>
        </h3>
      </div>
      <div className="icp-panel__body">
        {PANEL_SECTIONS.map((sec) => {
          const v = panel[sec.key];
          const status = v?.status;
          return (
            <div key={sec.key} className={`psec ${status || ""}`}>
              <div className="psec__head">
                <span className="psec__pill" aria-hidden="true">
                  <CheckIcon />
                </span>
                <span className="psec__name">{sec.name}</span>
              </div>
              <div className={`psec__body ${v ? "" : "empty-body"}`}>
                {v?.text || "En attente des éléments de la conversation…"}
              </div>
            </div>
          );
        })}
      </div>
      <div className="icp-panel__foot">
        <button
          type="button"
          className="btn btn--primary"
          onClick={onGenerate}
          disabled={!isFinal}
        >
          <SparkIcon /> Générer l&apos;analyse
        </button>
        <p className="hint">
          {isFinal
            ? "L'ICP est prêt à être analysé."
            : "Disponible quand l'ICP est assez construit."}
        </p>
      </div>
    </aside>
  );
}
