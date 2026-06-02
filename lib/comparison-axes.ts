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
 * Sources : placeholder, à remplacer par les vérifiées (Instantly 2026, Validity 2026, etc.).
 */
export const COMPARISON_AXES: ComparisonAxis[] = [
  {
    axis: "Approche",
    them: "Envoyer 10 000 emails par mois et espérer que le volume fasse le travail.",
    us: "Cibler ~200 comptes vraiment qualifiés et traiter chacun comme un compte clé.",
    src: "Étude délivrabilité B2B, 2024",
    url: "#",
  },
  {
    axis: "Message",
    them: "Un seul template, copié-collé, envoyé à toute la liste.",
    us: "Un angle écrit à la main par segment, ancré sur un signal réel.",
    src: "Benchmark personnalisation outbound",
    url: "#",
  },
  {
    axis: "Rédaction",
    them: "100 % automatisé : l'IA génère, personne ne relit.",
    us: "Rédigé et relu par des humains. L'outil assiste, il ne remplace pas.",
    src: "Rapport sur l'IA en prospection",
    url: "#",
  },
  {
    axis: "Données",
    them: "Listes achetées, données périmées, emails devinés au hasard.",
    us: "Comptes choisis sur des déclencheurs d'intention vérifiables.",
    src: "Qualité des bases de données B2B",
    url: "#",
  },
  {
    axis: "Infrastructure",
    them: "Tout part de votre domaine principal, jusqu'à le cramer.",
    us: "Domaines secondaires dédiés, warmup progressif, SPF/DKIM/DMARC.",
    src: "Guide délivrabilité & réputation",
    url: "#",
  },
  {
    axis: "Mesure",
    them: "On vous vend du taux d'ouverture et des « impressions ».",
    us: "On pilote au seul indicateur qui compte : le rendez-vous qualifié.",
    src: "Vanity metrics vs revenue metrics",
    url: "#",
  },
  {
    axis: "Promesses",
    them: "« 500 leads garantis dès le premier mois. »",
    us: "Des objectifs réalistes, calibrés sur votre marché et votre ticket.",
    src: "Taux de conversion outbound réels",
    url: "#",
  },
  {
    axis: "Relances",
    them: "Relances forcées, agressives, jusqu'à 8 fois la même personne.",
    us: "Deux relances maximum. De la valeur d'abord, jamais de harcèlement.",
    src: "Étude sur la pression commerciale",
    url: "#",
  },
  {
    axis: "Transparence",
    them: "Boîte noire : vous ne voyez ni les séquences, ni ce qui part.",
    us: "Accès complet aux listes, aux messages et aux statistiques en direct.",
    src: "Attentes clients en agence",
    url: "#",
  },
  {
    axis: "Engagement",
    them: "Contrat de 12 mois minimum pour vous retenir de force.",
    us: "Sans engagement. On reste parce que ça marche, pas par contrat.",
    src: "Modèles de facturation agences",
    url: "#",
  },
];
