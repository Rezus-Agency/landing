/**
 * Types pour l'outil ICP Discovery.
 * Port TypeScript du modèle vanilla JS de icp2/store.js + data.js.
 */

export type User = {
  name: string;
  email: string;
  company?: string;
  role?: string;
  website?: string;
  initials: string;
  /** Photo de profil (ex. Google avatar_url). Absent pour les comptes email/password. */
  avatarUrl?: string;
  /** Providers d'auth liés (ex. ["email"], ["google"]). Sert à l'UI du profil. */
  providers?: string[];
};

export type RegisteredUser = {
  email: string;
  password: string;
  profile: User;
};

export type Source = {
  title: string;
  site: string;
  url: string;
};

/** Niveau de confiance d'un bloc, repris des update_panel_* (badge au rendu). */
export type Confidence = "verified" | "inferred" | "hypothesis";

export type ICPSectionStatus = "draft" | "done";

export type ICPSection = {
  status: ICPSectionStatus;
  text: string;
};

export type PanelPatch = Partial<Record<string, ICPSection>>;

export type ChatEvent =
  | {
      from: "bot";
      text: string;
      sources?: Source[];
      quick?: string[];
      panel?: PanelPatch;
      final?: boolean;
    }
  | { from: "user"; text: string }
  | {
      research: {
        label: string;
        steps: string[];
        sources: Source[];
      };
    };

export type SessionDraft = {
  id: string;
  idx: number;
  panel: Record<string, ICPSection>;
  log: ChatEvent[];
  awaiting: boolean;
  final: boolean;
  pendingQuick: string[] | null;
  iterateId: string | null;
  startedAt: number;
  /**
   * Conversation au format Anthropic (source de vérité pour le LLM).
   * Le `log` est la version dérivée pour l'UI.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages?: Array<{ role: "user" | "assistant"; content: any }>;
  /** Coût session en USD, mis à jour à chaque tour. */
  totalUsd?: number;
  /** Nombre de recherches effectuées. */
  searchCount?: number;
  /** Phrase de cible passée par le LLM via finalize_icp.segment_summary. */
  finalSegmentSummary?: string;
  /** Synthèse prose produite par le LLM via finalize_icp.synthese. Paragraphe unique. */
  finalSynthese?: string;
  /** Document final structuré complet (identite, psychologie, marche, challenges, avantages, salesnav, clay, qualification, hooks). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  finalDoc?: Record<string, any>;
  /** Sources web uniques collectées au cours de la session (dedupées par URL). */
  allSources?: Source[];
};

export type SpecDraft = {
  step: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
};

export type SalesNavFilter = {
  jobTitles: string[];
  headcount: string[];
  industry: string[];
  geography: string[];
  keywords: string[];
};

export type ClayFilter = {
  company_size_min: number;
  company_size_max: number;
  industries: string[];
  country: string;
  cities: string[];
  funding_stage: string[];
  funding_recency_months: number;
  decision_maker_titles: string[];
  tech_stack_any: string[];
  exclude_keywords: string[];
};

export type Identity = {
  role: string;
  seniority: string;
  team: string;
  geo: string;
  industry: string;
  size: string;
  tenure: string;
  /** Ce sur quoi le décideur est mesuré (utile messaging + qualif). */
  kpis?: string;
  /** Rôle dans l'achat : economic buyer / champion / utilisateur. */
  buying_role?: string;
};

/** Une douleur priorisée du décideur (brief messaging). */
export type Pain = {
  pain: string;
  driver: string;
  intensite: "haute" | "moyenne";
};

/**
 * Psychologie du décideur. Champs historiques (prose/vocab/autorites) =
 * VOLET PROFIL (profond, client). Champs additifs (douleurs/status_quo/
 * preuves/resistances/registre/biais) = VOLET BRIEF (messaging, Rezus).
 * Tout est optionnel pour rester compatible avec les ICP déjà stockés.
 */
export type Psychology = {
  prose: string[];
  vocab_yes: string[];
  vocab_no: string[];
  autorites: string;
  // Volet profil
  biais?: string;
  // Volet brief messaging
  douleurs?: Pain[];
  status_quo?: string;
  preuves?: string[];
  resistances?: string[];
  registre?: string;
};

export type MarketAnalysis = {
  tam: string;
  sam: string;
  som: string;
  concurrence: string;
  maturite: string;
  cycle: string;
  budget: string;
  saisonnalite: string;
  tendances: string;
  sources: Source[];
  /** Valeur annuelle moyenne d'un contrat (économie du deal). */
  acv?: string;
  /** Une ligne : ce que cette analyse implique pour la prospection. */
  outbound_note?: string;
  /** Niveau de confiance global du bloc marché (badge au rendu). */
  conf?: Confidence;
};

export type Challenge = {
  t: string;
  d: string;
  conf?: Confidence;
};

export type Hook = {
  t: string;
  d: string;
};

/** Angle de message (ex-hook), rebranché sur la psychologie. Pas de copy écrit. */
export type Angle = {
  angle: string;
  /** Le ressort psychologique actionné (réf une douleur). */
  ressort: string;
  /** La preuve mobilisée. */
  preuve: string;
  /** Ce qu'il ne faut surtout pas dire (réf vocab_no). */
  eviter: string;
};

/** Signal d'achat : quand contacter un compte. */
export type Trigger = {
  event: string;
  source: string;
  window: string;
  priority: "haute" | "moyenne";
};

/** Variable d'enrichissement à pull par prospect. */
export type EnrichmentVar = {
  variable: string;
  usage: string;
  source: string;
};

/** Exclusion dure au niveau compte. */
export type AntiFit = {
  signal: string;
  reason: string;
};

/** Filtre bloquant de qualification (hard disqualifier). */
export type BlockCriterion = {
  signal: string;
  condition: string;
  dataPoint: string;
};

/** Critère de scoring pondéré pour prioriser un compte. */
export type ScoreCriterion = {
  label: string;
  condition: string;
  weight: number;
};

/** Scorecard de qualification opérationnelle (remplace la checklist binaire). */
export type Scorecard = {
  bloquants: BlockCriterion[];
  scoring: ScoreCriterion[];
  threshold?: number;
};

export type QualificationCriterion = {
  label: string;
  checked: boolean;
};

export type ICP = {
  id: string;
  segment: string;
  status: "draft" | "final";
  version: number;
  createdAt: string;
  synthese: string;
  /**
   * Sections du panel discovery, telles que renseignées par le LLM
   * pendant la session (bullets + status). C'est la source de vérité
   * pour le rendu du document tant que la synthèse Opus 4.8 (Phase 3)
   * n'est pas branchée.
   */
  panel?: Record<string, ICPSection>;
  /** Sources web uniques collectées pendant la session (toutes recherches confondues). */
  sources?: Source[];
  identite?: Identity;
  psychologie?: Psychology;
  marche?: MarketAnalysis;
  challenges?: Challenge[];
  avantages?: Challenge[]; // même shape t/d
  salesnav?: SalesNavFilter;
  clay?: ClayFilter;
  qualification?: QualificationCriterion[];
  hooks?: Hook[];
  /** Le résultat non-évident acté : cible de départ -> cible affinée + pourquoi. */
  reframe?: Reframe;
  /** Angles de message dérivés de la psychologie (ex-hooks enrichis). */
  angles?: Angle[];
  /** Signaux d'achat : quand contacter. */
  triggers?: Trigger[];
  /** Variables à enrichir par prospect. */
  enrichment?: EnrichmentVar[];
  /** Exclusions dures au niveau compte. */
  antifit?: AntiFit[];
  /** Scorecard de qualification (remplace `qualification` binaire). */
  scorecard?: Scorecard;
  /** Identifiant de partage public (colonne `share_id` en DB). Absent si jamais partagé. */
  shareId?: string;
  /** Partage public actif (colonne `shared` en DB). */
  shared?: boolean;
};

/** Le reframe avant -> après : la trace du résultat non-évident de la session. */
export type Reframe = {
  /** Cible générique d'arrivée du fondateur (tours 1-3). */
  from: string;
  /** Cible affinée actée. */
  to: string;
  /** Pourquoi la cible affinée est plus défendable (1-2 phrases). */
  why: string;
};

export type ShareEntry = {
  shareId: string;
  enabled: boolean;
};

/** Profil persisté en DB (table public.profiles) : miroir queryable des données
 * profil + onboarding pour le business. */
export type Profile = {
  id: string;
  email: string | null;
  name: string | null;
  company: string | null;
  role: string | null;
  website: string | null;
  avatar_url: string | null;
  company_size: string | null;
  heard_from: string | null;
  notify: string[];
  onboarded: boolean;
};

export type ComingSoonFeature = {
  id: string;
  icon: string;
  title: string;
  desc: string;
};

export type ToolState = {
  auth: User | null;
  icps: ICP[];
  /** false tant que les ICP ne sont pas chargés depuis la DB (état de chargement UI). */
  icpsLoaded: boolean;
  session: SessionDraft | null;
  /** false tant que la session ouverte n'est pas chargée depuis la DB. */
  sessionLoaded: boolean;
  spec: SpecDraft | null;
  notify: string[];
};
