/**
 * Types partagés pour le moteur LLM ICP Discovery.
 * Le CLI et la route API Next.js consomment le même protocole d'événements.
 */

/** Une source web réelle, jamais hallucinée. */
export type WebSource = {
  title: string;
  url: string;
  /** Domaine ou nom de site (ex: "les-echos.fr"). */
  site: string;
  /** Extrait court de contenu, peut être null si non disponible. */
  snippet?: string;
  /** "linkup" ou "tavily" — pour transparence. */
  provider: "linkup" | "tavily";
};

/** Résultat d'un appel search_web. */
export type SearchResult = {
  query: string;
  language: "fr" | "en";
  depth: "fast" | "deep";
  results: WebSource[];
  /** Provider effectivement utilisé (peut être différent du primaire si fallback). */
  provider: "linkup" | "tavily" | "none";
  latencyMs: number;
  /** Coût estimé en USD. */
  costUsd: number;
  /** Présent si tout a échoué — Claude doit dire "aucune source", jamais halluciner. */
  error?: string;
};

/** Confiance d'une section du panel ICP en construction. */
export type PanelConfidence = "verified" | "inferred" | "hypothesis";

/** Patch sur une section du panel droit. */
export type PanelPatch = {
  section: "synthese" | "identite" | "psychologie" | "marche" | "challenges" | "avantages";
  bullets: string[];
  confidence: PanelConfidence;
  sources: string[];
};

/** Type de message classifié par le router Haiku. */
export type TurnIntent =
  | "greeting"
  | "discovery"
  | "weak_claim"
  | "research_request"
  | "ready_to_finalize";

/** Événements émis par l'agent pendant un tour. Consommés par CLI + route API. */
export type AgentEvent =
  | { type: "turn_start"; model: string; intent: TurnIntent }
  | { type: "thinking"; delta: string }
  | { type: "text"; delta: string }
  | { type: "search_start"; query: string; language: "fr" | "en"; reason: string }
  | { type: "search_result"; result: SearchResult }
  | { type: "panel_patch"; patch: PanelPatch }
  | {
      type: "finalize_signal";
      segment_summary: string;
      synthese: string;
      /** Document final structuré complet (toutes les sections rich). */
      doc: Record<string, unknown>;
    }
  | { type: "cost"; turnUsd: number; sessionUsd: number; tokens: TokenUsage }
  | { type: "error"; code: string; message: string }
  | { type: "turn_done"; stopReason: string };

export type TokenUsage = {
  input: number;
  output: number;
  cachedInput: number;
  cacheCreation: number;
  thinking?: number;
};

/** État d'une session ICP en construction. */
export type SessionState = {
  id: string;
  scenario?: string;
  startedAt: number;
  /** Tableau de messages au format Anthropic (role + content). */
  messages: Array<{ role: "user" | "assistant"; content: unknown }>;
  /** État du panel droit (6 sections). */
  panel: Partial<Record<PanelPatch["section"], Omit<PanelPatch, "section">>>;
  /** Cumul des tool calls. */
  toolCalls: Array<{ name: string; input: unknown; result?: unknown }>;
  /** Cumul des coûts. */
  totalUsd: number;
  /** Nombre de searches effectuées. */
  searchCount: number;
  /** True quand finalize_icp a été appelé. */
  finalized: boolean;
};
