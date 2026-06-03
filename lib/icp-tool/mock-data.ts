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
