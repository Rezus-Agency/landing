/**
 * Types pour l'outil ICP Discovery.
 * Port TypeScript du modèle vanilla JS de icp2/store.js + data.js.
 */

export type User = {
  name: string;
  email: string;
  company?: string;
  initials: string;
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
};

export type Psychology = {
  prose: string[];
  vocab_yes: string[];
  vocab_no: string[];
  autorites: string;
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
};

export type Challenge = {
  t: string;
  d: string;
};

export type Hook = {
  t: string;
  d: string;
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
  identite?: Identity;
  psychologie?: Psychology;
  marche?: MarketAnalysis;
  challenges?: Challenge[];
  avantages?: Challenge[]; // même shape t/d
  salesnav?: SalesNavFilter;
  clay?: ClayFilter;
  qualification?: QualificationCriterion[];
  hooks?: Hook[];
};

export type ShareEntry = {
  shareId: string;
  enabled: boolean;
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
  registered: RegisteredUser[];
  session: SessionDraft | null;
  spec: SpecDraft | null;
  shares: Record<string, ShareEntry>;
  notify: string[];
};
