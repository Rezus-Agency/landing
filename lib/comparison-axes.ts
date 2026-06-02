export type ComparisonAxis = {
  axis: string;
  them: string;
  us: string;
  src: string;
  url: string;
};

/**
 * Les 10 axes de la comparaison "La plupart" vs "Rezus".
 * Le contraste se joue par la hiérarchie et l'opacité, jamais par la couleur.
 * Chaque axe est sourcé sur une étude vérifiable 2026.
 */
export const COMPARISON_AXES: ComparisonAxis[] = [
  {
    axis: "Approche",
    them: "Envoyer 10 000 emails par mois et espérer que le volume compense l'absence de ciblage.",
    us: "Cibler 100 à 200 comptes vraiment qualifiés, et traiter chacun comme un compte clé.",
    src: "Lead411 — B2B Targeting Analysis 2026",
    url: "https://www.lead411.com/blog/why-most-b2b-companies-are-targeting-the-wrong-accounts-in-2026/",
  },
  {
    axis: "Message",
    them: "Un seul template, copié-collé, envoyé à toute la liste.",
    us: "Un angle rédigé à la main par segment, ancré sur un signal réel. +32,7% de réponses.",
    src: "Backlinko — 12M Email Outreach Study",
    url: "https://backlinko.com/email-outreach-study",
  },
  {
    axis: "Rédaction",
    them: "100% automatisé : l'IA génère, personne ne relit. Le contenu IA régresse au mois 3.",
    us: "L'IA fait le travail invisible (recherche, vérification). Un humain valide chaque message.",
    src: "LeadRiver — State of B2B Outbound 2026",
    url: "https://www.leadriver.io/blog/state-of-b2b-outbound-2026",
  },
  {
    axis: "Données",
    them: "Listes achetées, données périmées, emails devinés au hasard, signaux invisibles.",
    us: "Comptes choisis sur des déclencheurs d'intention vérifiables : levées, hires, stack moves.",
    src: "ORRJO — State of B2B Outbound 2026",
    url: "https://orrjo.com/research/state-of-b2b-outbound-2026",
  },
  {
    axis: "Infrastructure",
    them: "Tout part du domaine principal. 16,5% des emails légitimes n'atteignent jamais l'inbox.",
    us: "Domaines secondaires dédiés, warmup progressif, SPF / DKIM / DMARC complets.",
    src: "Validity — 2026 Email Deliverability Benchmark",
    url: "https://www.validity.com/resource-center/2026-email-deliverability-benchmark-report/",
  },
  {
    axis: "Mesure",
    them: "On vous vend des taux d'ouverture et des « impressions ». 83% des SDRs ratent leur quota.",
    us: "On pilote au seul indicateur qui compte : le rendez-vous qualifié.",
    src: "LeadRiver — State of B2B Outbound 2026",
    url: "https://www.leadriver.io/blog/state-of-b2b-outbound-2026",
  },
  {
    axis: "Promesses",
    them: "« 500 leads garantis dès le premier mois. » Reply rate moyen 2026 : 3,4%.",
    us: "Des objectifs réalistes, calibrés sur votre marché, votre ticket et votre cycle.",
    src: "Instantly — Cold Email Benchmark Report 2026",
    url: "https://instantly.ai/cold-email-benchmark-report-2026",
  },
  {
    axis: "Relances",
    them: "Relances forcées, jusqu'à 8 fois la même personne sans nouvel angle.",
    us: "Deux relances maximum. De la valeur d'abord, un angle de plus si pertinent, jamais après.",
    src: "Backlinko — 12M Email Outreach Study",
    url: "https://backlinko.com/email-outreach-study",
  },
  {
    axis: "Approche IA",
    them: "Full AI SDR autonome. Coût par opportunité qualifiée : 487 $.",
    us: "Pods hybrides (IA invisible + humain). 1,9x à 2,4x le ROI. 224 $ par opp.",
    src: "Digital Applied — AI SDR Statistics 2026",
    url: "https://www.digitalapplied.com/blog/ai-sdr-statistics-2026-outbound-sales-data-points",
  },
  {
    axis: "Engagement",
    them: "Contrat de 12 mois minimum pour vous retenir. Reply rate en chute libre : 8,5% (2019) → 3,4% (2026).",
    us: "Sans engagement. On reste parce que ça marche, pas parce qu'un contrat vous retient.",
    src: "Martal — B2B Cold Email Statistics 2026",
    url: "https://martal.ca/b2b-cold-email-statistics-lb/",
  },
];
