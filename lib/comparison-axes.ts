export type ComparisonAxis = {
  axis: string;
  them: string;
  us: string;
  src: string;
  url: string;
};

/**
 * 5 axes outcome-focused. Pas une liste de process, mais les 5 zones où
 * la qualité du travail change ce que le client touche : pipeline, deals,
 * réputation, ROI mesuré, contrôle.
 * Chaque source soutient soit la critique du « la plupart » soit la
 * démarche Rezus — directement, pas par approximation.
 */
export const COMPARISON_AXES: ComparisonAxis[] = [
  {
    axis: "Adéquation des prospects",
    them: "Listes de 10 000 contacts achetées, 90% hors-cible. Vos commerciaux passent leur temps à les filtrer.",
    us: "Comptes choisis sur signaux d'intention vérifiables : financement récent, recrutement tech, projets en cours. Seuls les bons comptes entrent en pipeline.",
    src: "Lead411 — B2B Targeting Analysis 2026",
    url: "https://www.lead411.com/blog/why-most-b2b-companies-are-targeting-the-wrong-accounts-in-2026/",
  },
  {
    axis: "Pertinence du message",
    them: "Un template copié-collé, ou de l'IA brute qui invente. Le prospect reconnaît en trois secondes.",
    us: "IA pour la recherche et l'extraction de faits. Humain pour l'angle et la validation. +32,7% de réponses avec une personnalisation construite.",
    src: "Backlinko — 12M Email Outreach Study",
    url: "https://backlinko.com/email-outreach-study",
  },
  {
    axis: "Protection de votre réputation",
    them: "Tout part de votre domaine principal. 16,5% des emails légitimes n'atteignent jamais l'inbox. Au mois 6, votre domaine est grillé.",
    us: "Infrastructure dédiée, multi-domaines secondaires. Votre domaine principal n'est jamais exposé. SPF / DKIM / DMARC complets dès le premier envoi.",
    src: "Validity — 2026 Email Deliverability Benchmark",
    url: "https://www.validity.com/resource-center/2026-email-deliverability-benchmark-report/",
  },
  {
    axis: "Ce qu'on mesure",
    them: "Taux d'ouverture, emails envoyés, « impressions ». 83% des SDRs ratent leur quota parce qu'ils mesurent ce qui ne paye personne.",
    us: "Un seul indicateur compte : le rendez-vous qualifié transformé en opportunité. Le reste, c'est du bruit.",
    src: "LeadRiver — State of B2B Outbound 2026",
    url: "https://www.leadriver.io/blog/state-of-b2b-outbound-2026",
  },
  {
    axis: "Comment on pilote",
    them: "« Let it run. » Contrat 12 mois, vous découvrez la baisse au mois 6, et il est trop tard pour ajuster.",
    us: "Revue hebdomadaire, ajustement continu de l'angle et du ciblage. Sans engagement. Vous voyez ce qui marche et ce qu'on change, chaque semaine.",
    src: "ORRJO — State of B2B Outbound 2026",
    url: "https://orrjo.com/research/state-of-b2b-outbound-2026",
  },
];
