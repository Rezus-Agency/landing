/**
 * Construit un ICP applicatif à partir du document structuré produit par
 * finalize_icp (côté LLM). Partagé entre la session de chat et le wizard pour
 * garantir un rendu identique.
 */
import type { ICP, ICPSection, Source } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Doc = Record<string, any>;

/** Coupe une chaîne à `max` chars sans casser un mot, suffixe par "…" si tronqué. */
export function truncateAtWord(s: string, max: number): string {
  const clean = (s || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut) + "…";
}

export function icpFromDoc(params: {
  doc: Doc;
  segmentSummary?: string;
  synthese?: string;
  sources?: Source[];
  panel?: Record<string, ICPSection>;
  version?: number;
  /** Segment de repli si segment_summary absent. */
  fallbackSegment?: string;
  /** id imposé (sinon généré). */
  id?: string;
}): ICP {
  const doc = params.doc || {};
  const rawSegment =
    params.segmentSummary || params.fallbackSegment || "Cible non-évidente";
  const synthese =
    (params.synthese && params.synthese.trim()) ||
    "Synthèse non générée.";

  return {
    id: params.id ?? "icp_" + Date.now().toString(36),
    segment: truncateAtWord(rawSegment, 78),
    status: "final",
    version: params.version ?? 1,
    createdAt: new Date().toISOString().slice(0, 10),
    synthese,
    panel: params.panel,
    sources: params.sources ?? doc.marche?.sources ?? [],
    identite: doc.identite,
    psychologie: doc.psychologie,
    marche: doc.marche,
    challenges: doc.challenges,
    avantages: doc.avantages,
    salesnav: doc.salesnav,
    clay: doc.clay,
    qualification: doc.qualification,
    hooks: doc.hooks,
    reframe: doc.reframe,
    angles: doc.angles,
    triggers: doc.triggers,
    enrichment: doc.enrichment,
    antifit: doc.antifit,
    scorecard: doc.scorecard,
  };
}
