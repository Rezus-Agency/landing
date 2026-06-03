/**
 * Mock data pour l'outil ICP Discovery v1.
 * Port direct de icp2/data.js. Tout est en localStorage côté client, pas de backend.
 * Le LLM réel + recherche temps réel viendront plus tard.
 */
import type { ChatEvent, ComingSoonFeature, ICP, User } from "./types";

export const DEMO_USER: User = {
  name: "René Marceau",
  company: "Rezus Agency",
  email: "rene@rezus.agency",
  initials: "RM",
};

export const GUEST_USER: User = {
  name: "Invité",
  email: "guest@local",
  initials: "GU",
};

export const RESEARCH_HINT =
  "L'IA consulte des sources publiques en temps réel pour confronter votre intuition au marché réel.";

/**
 * Conversation scriptée (le cœur du produit).
 * Types : {from:'bot', text, sources?, quick?, panel?, final?} | {from:'user', text} | {research:{...}}
 */
export const SCRIPT: ChatEvent[] = [
  {
    from: "bot",
    text: "Avant de commencer, une mise au point : je ne suis pas là pour valider votre ICP. Je suis là pour le **challenger**.\n\nLa plupart des founders arrivent avec une cible « évidente » , souvent la même que la moitié de leurs concurrents. Mon job, c'est de vous aider à trouver l'angle que les autres ne voient pas.\n\nPour démarrer simplement : **qu'est-ce que vous vendez, et à qui pensez-vous le vendre aujourd'hui ?**",
  },
  {
    from: "user",
    text: "On édite un SIRH (logiciel RH) pour PME. On cible les DRH de boîtes de 50 à 200 personnes.",
  },
  {
    from: "bot",
    text: "Honnêtement ? C'est exactement l'ICP que vise *déjà* la moitié du marché. « DRH de PME 50-200 » est la cible par défaut de presque tous les SIRH français. Avant qu'on s'engage là-dedans, laissez-moi regarder à quoi ressemble vraiment ce terrain.",
    panel: {
      synthese: {
        status: "draft",
        text: "Point de départ : SIRH pour DRH de PME 50-200 (cible générique, à challenger).",
      },
    },
  },
  {
    research: {
      label: "Analyse du marché SIRH / HR Tech français",
      steps: [
        "Cartographie des acteurs SIRH en France",
        "Estimation du niveau de saturation mid-market",
        "Identification des segments sous-servis",
      ],
      sources: [
        { title: "Panorama HR Tech France 2025", site: "lab-rh.com", url: "#" },
        { title: "Marché du SIRH : acteurs & parts de marché", site: "journaldunet.com", url: "#" },
        { title: "PME & digitalisation RH , baromètre", site: "bpifrance.fr", url: "#" },
      ],
    },
  },
  {
    from: "bot",
    text: "Voilà ce que ça donne. Le mid-market RH français est **un des segments les plus encombrés** de la tech B2B : Payfit, Lucca, Factorial, et une dizaine d'autres se battent sur exactement « DRH de PME tertiaire 50-200 ». Le coût d'acquisition y est élevé et la différenciation faible.",
    sources: [
      { title: "Panorama HR Tech France 2025", site: "lab-rh.com", url: "#" },
      { title: "Marché du SIRH : parts de marché", site: "journaldunet.com", url: "#" },
    ],
    panel: {
      marche: {
        status: "draft",
        text: "Mid-market RH tertiaire : très saturé (Payfit, Lucca, Factorial). CAC élevé, différenciation faible.",
      },
    },
  },
  {
    from: "bot",
    text: "Donc ma vraie question : **qu'est-ce que votre produit fait mieux que les autres, concrètement ?** Pas le pitch marketing , la chose que vos meilleurs clients actuels vous disent qui les a convaincus.",
  },
  {
    from: "user",
    text: "On est beaucoup plus forts sur la gestion multi-sites et la conformité (conventions collectives, paie complexe). Nos meilleurs clients sont souvent des boîtes avec plusieurs établissements en région.",
  },
  {
    from: "bot",
    text: "Ça, c'est un signal beaucoup plus intéressant que « SIRH pour PME ». Le multi-sites et la conformité paie complexe, c'est précisément là où les outils tertiaires parisiens sont **faibles** , ils sont pensés pour une PME mono-site, des cadres, une convention simple.\n\nLaissez-moi vérifier qui souffre vraiment de ce problème.",
    panel: {
      avantages: {
        status: "draft",
        text: "Force réelle : multi-sites + conformité paie complexe (conventions collectives). Angle peu couvert par les acteurs tertiaires.",
      },
    },
  },
  {
    research: {
      label: "Recherche des segments à forte douleur conformité / multi-sites",
      steps: [
        "Secteurs à conventions collectives complexes",
        "PME industrielles & multi-établissements en région",
        "Niveau d'équipement SIRH de ces segments",
      ],
      sources: [
        {
          title: "Conventions collectives & complexité paie par secteur",
          site: "urssaf.fr",
          url: "#",
        },
        { title: "PME industrielles en région : équipement numérique", site: "insee.fr", url: "#" },
        { title: "Le retard RH des ETI industrielles", site: "usine-digitale.fr", url: "#" },
      ],
    },
  },
  {
    from: "bot",
    text: "C'est net. Le segment qui cumule **forte douleur conformité + multi-sites + sous-équipement SIRH**, ce sont les **PME industrielles multi-établissements en région, 100-250 salariés** : agroalimentaire, logistique, BTP, services techniques. Conventions lourdes, paie multi-site, et des outils actuels souvent vieillissants ou faits maison.",
    sources: [
      { title: "Le retard RH des ETI industrielles", site: "usine-digitale.fr", url: "#" },
      { title: "PME industrielles : équipement numérique", site: "insee.fr", url: "#" },
    ],
    panel: {
      marche: {
        status: "done",
        text: "Cible affinée : PME industrielles multi-sites en région (100-250 sal.). Conventions complexes, sous-équipées, peu courtisées par les SIRH parisiens.",
      },
    },
  },
  {
    from: "bot",
    text: "Mais attention , changer de cible change *tout le reste*. Le décideur n'est plus le même. Dans une scale-up tech parisienne vous parlez à un People Ops moderne. Dans une PME industrielle de Vendée, vous parlez à un **Responsable RH terrain**, souvent seul, pragmatique, qui a déjà été échaudé par un logiciel trop complexe.\n\nVous le connaissez, ce profil ? Vous lui avez déjà parlé ?",
  },
  {
    from: "user",
    text: "Oui un peu. C'est vrai qu'ils sont méfiants vis-à-vis des outils « parisiens » et qu'ils veulent surtout que ça marche et qu'on réponde au téléphone.",
  },
  {
    from: "bot",
    text: "Exactement. Et ça, c'est de l'or pour votre positionnement. Laissez-moi creuser la psychologie d'achat de ce décideur, parce que c'est là que se gagne ou se perd la vente.",
    panel: {
      identite: {
        status: "done",
        text: "Responsable RH (souvent RRH unique) de PME industrielle multi-sites, 100-250 sal., en région. 40-55 ans, non early-adopter.",
      },
    },
  },
  {
    research: {
      label: "Psychologie d'achat du Responsable RH en PME industrielle",
      steps: [
        "Critères de décision RH hors tech parisienne",
        "Rapport au risque et à la nouveauté",
        "Canaux d'information et figures d'autorité",
      ],
      sources: [
        { title: "Comment les RH de PME choisissent leurs outils", site: "myrhline.com", url: "#" },
        {
          title: "Décision d'achat B2B en région : le poids du bouche-à-oreille",
          site: "bpifrance.fr",
          url: "#",
        },
      ],
    },
  },
  {
    from: "bot",
    text: "Le portrait est clair, et il est à l'opposé du cliché tech. Ce décideur :\n\n• **Ce qui le réveille la nuit** : un contrôle URSSAF, une erreur de paie multi-site, un audit conformité raté.\n• **Son biais** : « les outils parisiens ne comprennent pas notre réalité terrain ». Méfiance envers le marketing tech.\n• **Ce qui le convainc** : la fiabilité prouvée, un vrai support humain joignable, et surtout le **bouche-à-oreille** de pairs du même secteur.\n• **Ce qui le fait fuir** : le jargon « People Experience », les démos qui survolent la conformité, l'absence de référence sectorielle.",
    sources: [
      { title: "Comment les RH de PME choisissent leurs outils", site: "myrhline.com", url: "#" },
      { title: "Décision d'achat B2B en région", site: "bpifrance.fr", url: "#" },
    ],
    panel: {
      psychologie: {
        status: "done",
        text: "Pragmatique, anti-jargon, échaudé par les outils complexes. Convaincu par fiabilité + support humain + bouche-à-oreille sectoriel. Fuit le marketing « People Experience ».",
      },
    },
  },
  {
    from: "bot",
    text: "Et c'est précisément là votre **angle compétitif** : pendant que tout le monde se bat sur le DRH tertiaire avec du discours « expérience collaborateur », vous pouvez être le SIRH qui *parle conformité multi-site et qui décroche le téléphone*. C'est défendable, c'est crédible, et personne ne l'occupe sérieusement.",
    panel: {
      avantages: {
        status: "done",
        text: "Angle libre : « le SIRH qui maîtrise la paie multi-site complexe et offre un vrai support terrain ». Discours conformité > discours expérience. Crédibilité sectorielle = barrière à l'entrée.",
      },
      synthese: {
        status: "done",
        text: "ICP non-évident : Responsables RH de PME industrielles multi-sites en région (100-250 sal.), mal servis par les SIRH tertiaires parisiens, gagnés par une promesse de conformité fiable et de support humain.",
      },
    },
  },
  {
    from: "bot",
    text: "Il reste un point à ne pas sous-estimer : ce segment a un **cycle de vente plus long** et fonctionne au bouche-à-oreille , donc les premières références sectorielles sont décisives. On y reviendra dans l'analyse.\n\nJe pense qu'on a maintenant un ICP solide *et* non-évident. On peut **générer l'analyse complète** , marché, psychologie, risques, angles, et vos filtres de prospection , ou continuer à creuser un point si vous voulez.",
    panel: {
      challenges: {
        status: "done",
        text: "Cycle de vente plus long, décision au bouche-à-oreille, besoin de références sectorielles initiales. Risque : crédibilité à établir hors réseau.",
      },
    },
    final: true,
    quick: ["Générer l'analyse complète", "Creuser encore un point"],
  },
];

export const FALLBACKS: string[] = [
  "Bonne remarque. Donnez-moi un exemple concret , un client réel chez qui ça s'est vérifié.",
  "Je vous arrête une seconde : est-ce une intuition, ou vous l'avez observé sur des deals réels ?",
  "Intéressant. Mais jouons l'avocat du diable : qu'est-ce qui pourrait rendre ça faux ?",
  "Noté, je l'intègre. Autre chose sur ce point, ou on avance ?",
];

/**
 * 3 ICPs seedés pour le dashboard de l'utilisateur démo.
 * Le premier (HR Tech founders) est le seul "final" avec un document complet.
 */
export const SEED_ICPS: ICP[] = [
  {
    id: "icp_hrtech_founders",
    segment: "Founders & CTO · SaaS B2B HR Tech early-stage",
    status: "final",
    version: 1,
    createdAt: "2026-06-01",
    synthese:
      "Le client le plus convertible n'est pas « les boîtes tech B2B » mais le fondateur/CTO d'un SaaS HR Tech de 20-100 personnes, post-Seed à Série A, allergique au discours commercial et obsédé par le temps d'ingénierie.",
  },
  {
    id: "icp_scaleup_finance",
    segment: "DAF de scale-ups SaaS post-Série B",
    status: "final",
    version: 2,
    createdAt: "2026-05-24",
    synthese:
      "Directeurs financiers de SaaS 150-400 personnes qui doivent structurer le reporting après une levée importante.",
  },
  {
    id: "icp_logistics_draft",
    segment: "Responsables d'exploitation · logistique régionale",
    status: "draft",
    version: 1,
    createdAt: "2026-05-30",
    synthese:
      "Exploration en cours : décideurs ops dans la logistique du dernier kilomètre en région.",
  },
];

/**
 * Document HR Tech complet (port du window.ICP2.doc).
 * Utilisé comme template : getDoc(id) merge l'ICP store avec ce contenu de démo.
 * Quand on connectera Supabase + LLM, chaque ICP aura son propre contenu.
 */
export const HRTECH_DOC: ICP = {
  id: "icp_hrtech_founders",
  segment: "Founders & CTO · SaaS B2B HR Tech early-stage",
  status: "final",
  version: 1,
  createdAt: "2026-06-01",
  synthese:
    "Votre client le plus convertible n'est pas « les boîtes tech B2B » en général, mais le fondateur ou CTO d'un éditeur SaaS HR Tech français de 20 à 100 personnes, entre la Seed et la Série A, basé à Paris ou Lyon. Ce décideur est technique, pressé, et structurellement allergique au discours commercial : il vit dans Slack, Linear et Notion, et juge un outil en trois minutes à la qualité de sa documentation, pas à son pitch. Il a déjà un produit qui tourne et une petite équipe, donc sa douleur n'est plus « construire » mais « tenir le rythme sans casser la qualité ni cramer ses devs ». L'angle gagnant n'est pas de lui vendre une features de plus, mais de lui prouver, chiffres et preuve technique à l'appui, que vous lui faites regagner du temps d'ingénierie, la seule ressource qu'il sait être son vrai goulot. Tout message qui sonne « marketing » vous disqualifie ; tout message qui sonne « pair technique qui a résolu le même problème » vous ouvre la porte.",
  identite: {
    role: "Fondateur technique ou CTO (parfois VP Engineering sur les structures > 60)",
    seniority: "Dirigeant, décideur final ET utilisateur de l'outil, cycle de décision court",
    team: "Équipe tech de 4 à 25 personnes, souvent 1 à 3 squads produit",
    geo: "Paris en priorité, puis Lyon ; quelques pôles à Nantes, Bordeaux, Lille",
    industry: "Éditeurs SaaS B2B verticalisés HR Tech (paie, ATS, people analytics, onboarding)",
    size: "20 à 100 salariés, post-Seed à Série A (1 à 12 M€ levés)",
    tenure: "Fondateur depuis 2 à 6 ans, ou CTO recruté il y a 12-30 mois pour structurer la tech",
  },
  psychologie: {
    prose: [
      "Ce décideur ne se vit pas comme un acheteur, mais comme un constructeur. Sa première réaction face à un nouvel outil est presque toujours « est-ce qu'on ne pourrait pas le faire nous-mêmes en un week-end ? », le réflexe NIH (not-invented-here) est sa pente naturelle, renforcée par une vraie compétence technique qui rend ce raisonnement crédible à ses propres yeux. Vendre contre ce biais ne marche pas ; il faut le retourner. Ce qui le réveille la nuit, ce n'est pas le manque de fonctionnalités, c'est la dette technique qui s'accumule, le burn-out d'un dev senior irremplaçable, et la peur que la vélocité de l'équipe s'effondre juste au moment où la Série A exige de doubler de taille. Le temps d'ingénierie est sa devise mentale : tout se ramène à « combien de jours-dev ça nous coûte, combien ça nous fait gagner ».",
      "Sur le plan de l'information, il ne lit pas la presse business et ignore LinkedIn de façon quasi militante. Il se forme sur Hacker News, le tech-Twitter/X, quelques Substack d'ingénierie (Pragmatic Engineer en tête), des threads Reddit, et la parole de pairs fondateurs rencontrés en conférence ou en communauté (BAM, Station F, slacks de CTO). Une recommandation d'un autre CTO qu'il respecte vaut mille impressions publicitaires. Les figures d'autorité qui le font bouger sont d'autres builders crédibles, pas des analystes, pas des influenceurs growth, surtout pas des « experts » auto-proclamés.",
      "Côté langage, le piège est fatal et invisible pour un non-technique. Les mots qui sonnent juste sont concrets et mesurés : « temps de build », « DX », « time-to-merge », « on-call », « post-mortem », « on a réduit de 40 % ». Les mots qui sonnent faux le font fuir instantanément : « solution », « disruptif », « synergies », « accompagnement », « expérience collaborateur », et tout superlatif marketing. Un seul de ces termes dans votre première phrase et vous êtes classé « commercial », c'est-à-dire ignoré. À l'inverse, une démo qui montre le produit en 30 secondes, une doc claire, et une preuve chiffrée valent plus que n'importe quel argumentaire.",
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
  },
  challenges: [
    {
      t: "Le réflexe « build it ourselves »",
      d: "C'est l'objection n°1 et elle est sincère : ils en sont techniquement capables. Tant que vous n'avez pas chiffré le coût caché du maintien interne (jours-dev récurrents, on-call, bus factor), vous perdez. Préparez la démonstration du vrai coût total, pas une liste de features.",
    },
    {
      t: "Zéro tolérance au discours commercial",
      d: "Une approche perçue comme « sales » grille le contact de façon quasi irréversible. Le premier message doit venir d'un registre pair-à-pair technique, idéalement avec une preuve (benchmark, repo, doc) plutôt qu'une demande de call.",
    },
    {
      t: "Fenêtre d'achat étroite",
      d: "Hors de la période post-levée, le sujet n'est pas prioritaire. Mal timé, même le bon message tombe à plat. Le ciblage doit s'appuyer sur des signaux de levée récents, sinon le cycle s'allonge indéfiniment.",
    },
    {
      t: "Décideur = utilisateur exigeant",
      d: "Il jugera votre produit lui-même, en quelques minutes, sur la DX et la doc. Un onboarding self-serve impeccable n'est pas un bonus, c'est le prérequis pour que la vente existe.",
    },
  ],
  avantages: [
    {
      t: "Le vertical HR Tech est un angle libre",
      d: "Les outils dev génériques parlent à tout le monde et donc à personne. Un positionnement qui connaît les contraintes spécifiques de la HR Tech (conformité, données sensibles, paie) crée une résonance immédiate que personne n'occupe.",
    },
    {
      t: "La preuve technique comme arme commerciale",
      d: "Ce segment, allergique au sales, est au contraire avide de contenu technique sérieux. Un benchmark public, un teardown, un outil gratuit bien fait font plus que dix SDR, et personne dans le secteur ne le fait correctement.",
    },
    {
      t: "Le timing post-levée est exploitable",
      d: "Brancher le ciblage sur les annonces de levée (Seed/Série A) capte le décideur exactement quand sa douleur « scaler sans casser » devient aiguë et budgétée.",
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
      d: "Chiffrer les jours-dev récurrents que coûte le maintien interne, parle directement au réflexe NIH au lieu de le combattre.",
    },
    {
      t: "La preuve avant le pitch",
      d: "Ouvrir avec un benchmark ou un teardown technique, pas une demande de call, entre par le registre « pair technique ».",
    },
    {
      t: "Le timing post-levée",
      d: "« Vous venez de lever, l'équipe va doubler, comment vous tenez la vélocité ? », touche la douleur exactement quand elle est budgétée.",
    },
    {
      t: "La DX comme terrain commun",
      d: "Parler time-to-merge et on-call plutôt que features, montre que vous venez du même monde.",
    },
    {
      t: "Le pair fondateur",
      d: "« [CTO d'une autre HR Tech] a réduit de 40 % son temps de build avec ça », la recommandation de pair vaut mille impressions.",
    },
  ],
};

/**
 * Merge un ICP du store avec le template HRTECH_DOC pour avoir un document
 * complet à afficher. Stratégie de démo : tous les ICPs partagent le contenu
 * du HRTECH_DOC, seuls id/segment/synthese/status/version/createdAt viennent
 * de l'ICP réel.
 */
export function getDoc(icp: ICP | null | undefined): ICP {
  const base: ICP = JSON.parse(JSON.stringify(HRTECH_DOC));
  if (!icp) return base;
  return {
    ...base,
    id: icp.id,
    segment: icp.segment || base.segment,
    synthese: icp.synthese || base.synthese,
    status: icp.status || base.status,
    version: icp.version || base.version,
    createdAt: icp.createdAt || base.createdAt,
  };
}

/**
 * 6 features Tier 2 affichées sur le dashboard avec bouton "Notifier" individuel.
 */
export const COMING_SOON: ComingSoonFeature[] = [
  {
    id: "versioning",
    icon: "history",
    title: "Versioning & historique",
    desc: "Suivez comment votre ICP évolue avec votre boîte, version après version.",
  },
  {
    id: "abtest",
    icon: "split",
    title: "Multi-ICPs & A/B testing",
    desc: "Comparez plusieurs ICPs en parallèle et identifiez celui qui convertit le mieux.",
  },
  {
    id: "crm",
    icon: "plug",
    title: "Connexion CRM (feedback loop)",
    desc: "Branchez HubSpot ou Pipedrive : l'outil affine votre ICP avec vos données réelles.",
  },
  {
    id: "reverse",
    icon: "magnet",
    title: "Reverse-engineering clients",
    desc: "Listez vos meilleurs clients, on extrait l'ICP implicite qui les relie.",
  },
  {
    id: "transcript",
    icon: "mic",
    title: "Import depuis un appel discovery",
    desc: "Uploadez la transcription d'un appel, on en tire un premier ICP structuré.",
  },
  {
    id: "library",
    icon: "books",
    title: "Bibliothèque d'ICPs",
    desc: "Inspirez-vous d'ICPs anonymisés validés par d'autres founders B2B.",
  },
];
