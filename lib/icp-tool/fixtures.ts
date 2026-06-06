/**
 * Fixtures de DEV pour itérer sur le rendu de la page de résultat sans passer
 * par une vraie session LLM (10-15 tours + coût). Utilisées uniquement par les
 * scripts CLI (`scripts/icp-cli/test-pdf.tsx`, `seed-test-user.ts`), jamais
 * importées dans une page de prod.
 *
 * `golden` = ICP riche et complet (récupéré de l'ancien HRTECH_DOC), toutes les
 * sections remplies. Les autres fixtures sont des cas limites dérivés pour tester
 * les fallbacks et la robustesse du rendu.
 */
import type { ICP } from "./types";

/** ICP complet, toutes sections structurées remplies. */
export const GOLDEN_ICP: ICP = {
  id: "icp_dev_golden",
  segment: "Founders & CTO · SaaS B2B HR Tech early-stage",
  status: "final",
  version: 1,
  createdAt: "2026-06-01",
  synthese:
    "**Le vrai concurrent, ce n'est pas un autre outil, c'est « on le fait nous-mêmes ».** Ce décideur juge en trois minutes, sur la doc et la preuve technique, jamais sur un pitch. L'angle qui gagne : lui prouver, chiffres à l'appui, que vous lui rendez du **temps d'ingénierie**, sa seule ressource rare, au moment précis où la levée l'oblige à scaler sans casser. Tout ce qui sonne commercial vous disqualifie ; un pair technique qui a résolu le même problème vous ouvre la porte.",
  reframe: {
    from: "Boîtes tech B2B en général",
    to: "Fondateur/CTO de SaaS HR Tech, 20-100 salariés, post-Seed à Série A, Paris/Lyon",
    why: "« Tech B2B » est la cible de tout le monde. En verticalisant sur la HR Tech early-stage et en visant le décideur technique, vous occupez un angle que personne ne travaille sérieusement et vous parlez à quelqu'un qui décide vite.",
  },
  identite: {
    role: "Fondateur technique ou CTO (parfois VP Engineering sur les structures > 60)",
    seniority: "Dirigeant, décideur final ET utilisateur de l'outil, cycle de décision court",
    team: "Équipe tech de 4 à 25 personnes, souvent 1 à 3 squads produit",
    geo: "Paris en priorité, puis Lyon ; quelques pôles à Nantes, Bordeaux, Lille",
    industry: "Éditeurs SaaS B2B verticalisés HR Tech (paie, ATS, people analytics, onboarding)",
    size: "20 à 100 salariés, post-Seed à Série A (1 à 12 M€ levés)",
    tenure: "Fondateur depuis 2 à 6 ans, ou CTO recruté il y a 12-30 mois pour structurer la tech",
    kpis: "Vélocité de l'équipe et qualité technique, pas le CA directement. Mesuré sur la capacité à scaler sans casser.",
    buying_role: "Economic buyer ET utilisateur : il décide, il signe, et il s'en sert au quotidien.",
  },
  psychologie: {
    prose: [
      "Ce décideur ne se vit pas comme un acheteur, mais comme un constructeur. Sa première réaction face à un nouvel outil est presque toujours « est-ce qu'on ne pourrait pas le faire nous-mêmes en un week-end ? », le réflexe NIH (not-invented-here) est sa pente naturelle, renforcée par une vraie compétence technique qui rend ce raisonnement crédible à ses propres yeux. Vendre contre ce biais ne marche pas ; il faut le retourner. Ce qui le réveille la nuit, ce n'est pas le manque de fonctionnalités, c'est la dette technique qui s'accumule, le burn-out d'un dev senior irremplaçable, et la peur que la vélocité de l'équipe s'effondre juste au moment où la Série A exige de doubler de taille. Le temps d'ingénierie est sa devise mentale : tout se ramène à « combien de jours-dev ça nous coûte, combien ça nous fait gagner ».",
      "Sur le plan de l'information, il ne lit pas la presse business et ignore LinkedIn de façon quasi militante. Il se forme sur Hacker News, le tech-Twitter/X, quelques Substack d'ingénierie (Pragmatic Engineer en tête), des threads Reddit, et la parole de pairs fondateurs rencontrés en conférence ou en communauté (BAM, Station F, slacks de CTO). Une recommandation d'un autre CTO qu'il respecte vaut mille impressions publicitaires. Les figures d'autorité qui le font bouger sont d'autres builders crédibles, pas des analystes, pas des influenceurs growth, surtout pas des « experts » auto-proclamés.",
      "Côté langage, le piège est fatal et invisible pour un non-technique. Les mots qui sonnent juste sont concrets et mesurés : « temps de build », « DX », « time-to-merge », « on-call », « post-mortem », « on a réduit de 40 % ». Les mots qui sonnent faux le font fuir instantanément : « solution », « disruptif », « synergies », « accompagnement », « expérience collaborateur », et tout superlatif marketing. Un seul de ces termes dans votre première phrase et vous êtes classé « commercial », c'est-à-dire ignoré.",
    ],
    vocab_yes: [
      "temps de build",
      "DX / developer experience",
      "jours-dev économisés",
      "time-to-merge",
      "self-serve",
      "post-mortem",
    ],
    vocab_no: [
      "solution",
      "disruptif",
      "synergies",
      "accompagnement",
      "expérience collaborateur",
      "ROI exceptionnel",
    ],
    autorites:
      "Autres CTO/fondateurs techniques respectés, Pragmatic Engineer, communautés de builders (Station F, BAM, slacks de CTO), jamais des analystes ou des influenceurs growth.",
    biais:
      "Réflexe not-invented-here marqué : surévalue sa capacité à construire et maintenir en interne. Décide vite, sur preuve, déteste qu'on lui fasse perdre du temps.",
    douleurs: [
      {
        pain: "La dette technique s'accumule juste au moment où la Série A exige de doubler l'équipe",
        driver: "Peur que la vélocité s'effondre et que la qualité parte avec",
        intensite: "haute",
      },
      {
        pain: "Un dev senior irremplaçable porte trop de choses, bus factor de 1",
        driver: "Angoisse du burn-out et de la dépendance à une personne",
        intensite: "haute",
      },
      {
        pain: "Chaque outil externe est un arbitrage contre du temps-dev qu'il n'a pas",
        driver: "Le temps d'ingénierie est sa devise rare, tout se ramène à ça",
        intensite: "moyenne",
      },
    ],
    status_quo:
      "Un script ou un module maison maintenu le week-end, ou tout simplement rien et on encaisse la douleur. Le vrai concurrent, c'est « on le fait nous-mêmes ».",
    preuves: [
      "Un benchmark technique public et reproductible",
      "La recommandation d'un autre CTO qu'il respecte",
      "Un chiffrage concret en jours-dev économisés",
      "Une doc et un onboarding self-serve impeccables",
    ],
    resistances: [
      "Le moindre mot de vocabulaire commercial",
      "Une demande de call avant toute preuve",
      "Pas de contenu technique sérieux derrière le message",
    ],
    registre:
      "Pair à pair technique, sec, zéro fluff. Du concret en deux lignes, une preuve, et on le laisse juger lui-même.",
  },
  marche: {
    tam: "≈ 1 400 éditeurs SaaS HR Tech actifs en France",
    sam: "≈ 420 entre 20 et 100 salariés, post-Seed à Série A",
    som: "≈ 130 atteignables en 12 mois avec un outbound ciblé",
    concurrence:
      "Quelques acteurs horizontaux (outils dev génériques) qui ne parlent pas au contexte HR Tech ; aucun positionnement vertical crédible sur ce segment précis",
    maturite:
      "Marché en remplacement : ces équipes ont déjà des outils, la bataille est le switch, pas l'évangélisation",
    cycle: "3 à 6 semaines",
    budget: "12 000 à 35 000 € / an",
    saisonnalite: "Décisions concentrées juste après une levée (T1 et T3) ; creux en août et fin décembre",
    tendances:
      "La pression post-levée pour « faire plus avec la même équipe » pousse ce segment à acheter du temps d'ingénierie plutôt qu'à recruter, une fenêtre favorable de 18-24 mois.",
    sources: [
      { title: "Panorama HR Tech France 2025", site: "lab-rh.com", url: "#" },
      { title: "Baromètre financement tech FR", site: "maddyness.com", url: "#" },
      { title: "State of Engineering Productivity", site: "pragmaticengineer.com", url: "#" },
    ],
    acv: "18 000 € / an en moyenne",
    outbound_note:
      "La liste atteignable plafonne à ~130 comptes : la qualité du ciblage et du timing prime largement sur le volume.",
    conf: "verified",
  },
  challenges: [
    {
      t: "Le réflexe « build it ourselves »",
      d: "C'est l'objection n°1 et elle est sincère : ils en sont techniquement capables. Tant que vous n'avez pas chiffré le coût caché du maintien interne (jours-dev récurrents, on-call, bus factor), vous perdez.",
      conf: "verified",
    },
    {
      t: "Zéro tolérance au discours commercial",
      d: "Une approche perçue comme « sales » grille le contact de façon quasi irréversible. Le premier message doit venir d'un registre pair-à-pair technique, idéalement avec une preuve.",
    },
    {
      t: "Fenêtre d'achat étroite",
      d: "Hors de la période post-levée, le sujet n'est pas prioritaire. Le ciblage doit s'appuyer sur des signaux de levée récents.",
    },
    {
      t: "Décideur = utilisateur exigeant",
      d: "Il jugera votre produit lui-même, en quelques minutes, sur la DX et la doc. Un onboarding self-serve impeccable est le prérequis.",
    },
  ],
  avantages: [
    {
      t: "Le vertical HR Tech est un angle libre",
      d: "Les outils dev génériques parlent à tout le monde et donc à personne. Un positionnement qui connaît les contraintes HR Tech crée une résonance que personne n'occupe.",
      conf: "inferred",
    },
    {
      t: "La preuve technique comme arme commerciale",
      d: "Ce segment, allergique au sales, est avide de contenu technique sérieux. Un benchmark public fait plus que dix SDR.",
    },
    {
      t: "Le timing post-levée est exploitable",
      d: "Brancher le ciblage sur les annonces de levée capte le décideur quand sa douleur « scaler sans casser » devient aiguë et budgétée.",
    },
  ],
  salesnav: {
    jobTitles: ["Founder", "Co-Founder", "CTO", "Chief Technology Officer", "VP Engineering"],
    headcount: ["11-50", "51-200"],
    industry: ["Computer Software", "Human Resources", "Information Technology & Services"],
    geography: ["Paris, France", "Lyon, France"],
    keywords: ["HR tech", "people", "payroll", "ATS", "Series A", "seed"],
  },
  clay: {
    company_size_min: 20,
    company_size_max: 100,
    industries: ["saas", "hr_tech"],
    country: "FR",
    cities: ["Paris", "Lyon"],
    funding_stage: ["seed", "series_a"],
    funding_recency_months: 9,
    decision_maker_titles: ["Founder", "CTO", "VP Engineering"],
    tech_stack_any: ["slack", "notion", "linear"],
    exclude_keywords: ["agency", "consulting", "b2c"],
  },
  qualification: [
    { label: "Éditeur SaaS B2B en HR Tech", checked: true },
    { label: "20 à 100 salariés", checked: true },
    { label: "Levée Seed ou Série A < 9 mois", checked: true },
    { label: "Décideur = fondateur technique ou CTO", checked: true },
    { label: "Équipe d'ingénierie ≥ 4 personnes", checked: true },
    { label: "Stack moderne (Slack / Linear / Notion)", checked: false },
    { label: "Signal de tension d'effectif tech (offres dev ouvertes)", checked: false },
  ],
  hooks: [
    {
      t: "Le coût caché du « on le fait nous-mêmes »",
      d: "Chiffrer les jours-dev récurrents que coûte le maintien interne, parle au réflexe NIH au lieu de le combattre.",
    },
    {
      t: "La preuve avant le pitch",
      d: "Ouvrir avec un benchmark ou un teardown technique, pas une demande de call.",
    },
    {
      t: "Le timing post-levée",
      d: "« Vous venez de lever, l'équipe va doubler, comment vous tenez la vélocité ? », touche la douleur quand elle est budgétée.",
    },
  ],
  angles: [
    {
      angle: "Le coût caché du « on le fait nous-mêmes »",
      ressort: "Le réflexe NIH et la peur de la dette technique qui s'accumule",
      preuve: "Un chiffrage des jours-dev récurrents que coûte le maintien interne",
      eviter: "Tout vocabulaire commercial, ne pas présenter ça comme « une solution »",
    },
    {
      angle: "La preuve avant le pitch",
      ressort: "Son besoin de juger par lui-même, sur du concret technique",
      preuve: "Un benchmark public ou un teardown qu'il peut reproduire",
      eviter: "Demander un call d'emblée, parler features avant preuve",
    },
    {
      angle: "Le pair fondateur",
      ressort: "La confiance qu'il accorde aux CTO qu'il respecte plutôt qu'aux vendeurs",
      preuve: "« [CTO d'une autre HR Tech] a réduit de 40 % son temps de build »",
      eviter: "Citer des analystes, des influenceurs growth ou des logos sans contexte",
    },
  ],
  triggers: [
    {
      event: "Levée de fonds Seed ou Série A",
      source: "Crunchbase, annonces presse tech, Maddyness",
      window: "Dans les 3 mois suivant l'annonce",
      priority: "haute",
    },
    {
      event: "Ouverture de plusieurs postes d'ingénieurs",
      source: "Pages careers, Welcome to the Jungle, LinkedIn Jobs",
      window: "Pendant la phase de recrutement actif",
      priority: "haute",
    },
    {
      event: "Changement ou ajout dans la stack technique",
      source: "BuiltWith, StackShare, GitHub public",
      window: "Au moment du signal détecté",
      priority: "moyenne",
    },
  ],
  enrichment: [
    {
      variable: "Taille de l'équipe ingénierie",
      usage: "Personnalisation du hook + critère de scoring",
      source: "LinkedIn (filtre département), page équipe",
    },
    {
      variable: "Date et montant de la dernière levée",
      usage: "Timing du trigger post-levée",
      source: "Crunchbase, Clay",
    },
    {
      variable: "Stack technique principale",
      usage: "Preuve de modernité, accroche technique sur-mesure",
      source: "BuiltWith, StackShare",
    },
    {
      variable: "Nom et profil du CTO / fondateur technique",
      usage: "Ciblage du bon interlocuteur + registre pair à pair",
      source: "LinkedIn, site, GitHub",
    },
  ],
  antifit: [
    {
      signal: "Agence ou cabinet de conseil",
      reason: "Pas un éditeur, n'a pas la douleur produit ni le cycle court de décision",
    },
    {
      signal: "Produit B2C grand public",
      reason: "Contexte, contraintes et psychologie d'achat totalement différents",
    },
    {
      signal: "Plus de 100 salariés ou Série B+",
      reason: "Process d'achat plus lourd, décideur n'est plus le fondateur technique",
    },
  ],
  scorecard: {
    bloquants: [
      {
        signal: "Type d'entreprise",
        condition: "Doit être un éditeur SaaS B2B HR Tech",
        dataPoint: "industries (Clay) + description du site",
      },
      {
        signal: "Stade de financement",
        condition: "Levée Seed ou Série A de moins de 12 mois",
        dataPoint: "funding_stage + funding_date (Crunchbase/Clay)",
      },
      {
        signal: "Décideur accessible",
        condition: "Fondateur technique ou CTO identifiable",
        dataPoint: "decision_maker_titles (LinkedIn)",
      },
    ],
    scoring: [
      {
        label: "Équipe d'ingénierie >= 4 personnes",
        condition: "Détecté via LinkedIn ou page équipe",
        weight: 2,
      },
      {
        label: "Stack moderne (Slack / Linear / Notion)",
        condition: "Détecté via BuiltWith ou job posts",
        weight: 1,
      },
      {
        label: "Signal de tension d'effectif tech (postes dev ouverts)",
        condition: "Au moins une offre d'ingénieur active",
        weight: 2,
      },
      {
        label: "Levée très récente (< 6 mois)",
        condition: "Renforce le timing",
        weight: 1,
      },
    ],
    threshold: 4,
  },
  sources: [
    { title: "Panorama HR Tech France 2025", site: "lab-rh.com", url: "#" },
    { title: "Baromètre financement tech FR", site: "maddyness.com", url: "#" },
    { title: "State of Engineering Productivity", site: "pragmaticengineer.com", url: "#" },
  ],
};

/**
 * Cas du bug Phase 0 : objet structuré présent-mais-vide qui devrait retomber
 * sur les bullets du panel. Sert à vérifier le fix `isEmpty` du rendu.
 */
export const EMPTY_PSY_ICP: ICP = {
  id: "icp_dev_empty",
  segment: "Cas fallback · psycho/marché/identité vides",
  status: "final",
  version: 1,
  createdAt: "2026-06-03",
  synthese: GOLDEN_ICP.synthese,
  psychologie: { prose: [], vocab_yes: [], vocab_no: [], autorites: "" } as ICP["psychologie"],
  identite: {} as ICP["identite"],
  marche: {} as ICP["marche"],
  panel: {
    psychologie: {
      status: "done",
      text: "Méfiance commerciale : a déjà été échaudé par un SaaS parisien trop pushy\nVocabulaire technique : parle en jours-dev économisés, pas en ROI abstrait\nRéflexe build : pense d'abord à le faire en interne",
    },
    identite: {
      status: "done",
      text: "Fondateur technique ou CTO\n20 à 100 salariés, post-Seed à Série A\nParis et Lyon",
    },
    marche: {
      status: "done",
      text: "Mid-market HR Tech saturé sur le tertiaire\nFenêtre post-levée de 18-24 mois",
    },
  },
};

/**
 * ICP au shape LEGACY (avant la refonte) : pas de reframe/angles/triggers/
 * enrichment/antifit/scorecard, psychologie et marché plats, hooks + qualif
 * binaire. Sert à vérifier que les ICP déjà stockés rendent toujours.
 */
export const LEGACY_ICP: ICP = (() => {
  const c: ICP = JSON.parse(JSON.stringify(GOLDEN_ICP));
  c.id = "icp_dev_legacy";
  c.segment = "Cas legacy · ancien shape (hooks + qualif binaire)";
  delete c.reframe;
  delete c.angles;
  delete c.triggers;
  delete c.enrichment;
  delete c.antifit;
  delete c.scorecard;
  if (c.identite) {
    delete c.identite.kpis;
    delete c.identite.buying_role;
  }
  if (c.psychologie) {
    delete c.psychologie.biais;
    delete c.psychologie.douleurs;
    delete c.psychologie.status_quo;
    delete c.psychologie.preuves;
    delete c.psychologie.resistances;
    delete c.psychologie.registre;
  }
  if (c.marche) {
    delete c.marche.acv;
    delete c.marche.outbound_note;
    delete c.marche.conf;
  }
  c.challenges?.forEach((x) => delete x.conf);
  c.avantages?.forEach((x) => delete x.conf);
  return c;
})();

/** ICP squelette minimal : juste segment + synthèse, le reste absent. */
export const THIN_ICP: ICP = {
  id: "icp_dev_thin",
  segment: "Cas minimal · que la synthèse",
  status: "draft",
  version: 1,
  createdAt: "2026-06-03",
  synthese:
    "Un ICP encore brut, seulement la synthèse remplie. Sert à vérifier que les sections sans donnée se masquent proprement au lieu de planter ou d'afficher du vide.",
};

export type DevFixture = {
  key: string;
  label: string;
  description: string;
  icp: ICP;
};

export const DEV_FIXTURES: DevFixture[] = [
  {
    key: "golden",
    label: "Golden (complet)",
    description: "Toutes les sections structurées remplies. Le rendu de référence.",
    icp: GOLDEN_ICP,
  },
  {
    key: "empty_psy",
    label: "Fallback (structuré vide)",
    description: "Psycho/marché/identité = objets vides + contenu panel. Doit retomber sur le panel.",
    icp: EMPTY_PSY_ICP,
  },
  {
    key: "legacy",
    label: "Legacy (ancien shape)",
    description: "ICP d'avant la refonte (hooks + qualif binaire, pas de nouveaux champs). Doit rendre via la rétro-compat.",
    icp: LEGACY_ICP,
  },
  {
    key: "thin",
    label: "Minimal (synthèse seule)",
    description: "Seulement segment + synthèse. Les autres sections doivent se masquer.",
    icp: THIN_ICP,
  },
];
