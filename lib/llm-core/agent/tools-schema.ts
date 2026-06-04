/**
 * Définitions des outils exposés à Claude.
 * Format : Anthropic tool spec (name, description, input_schema).
 */

import type Anthropic from "@anthropic-ai/sdk";

export const SEARCH_WEB_TOOL: Anthropic.Tool = {
  name: "search_web",
  description:
    "Recherche web réelle (Linkup primaire FR, Tavily fallback). Utilise quand le fondateur mentionne un marché, un concurrent, une taille de segment, une tendance ou un fait que tu ne peux pas vérifier depuis la conversation. N'utilise PAS pour des définitions générales (qu'est-ce qu'un ICP, framework AIDA) ou des concepts métier de base. Renvoie une liste de sources avec URLs réelles que tu DOIS citer.",
  input_schema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description:
          "La requête de recherche, en français. Soit spécifique : 'PME industrielles multi-sites paie complexe 2026' plutôt que 'marché RH'.",
      },
      language: {
        type: "string",
        enum: ["fr", "en"],
        description: "Langue cible des résultats. Par défaut 'fr'.",
      },
      depth: {
        type: "string",
        enum: ["fast", "deep"],
        description:
          "'fast' = recherche standard ~2s, suffisant pour valider un fait. 'deep' = recherche multi-passes ~5s, pour explorer un sujet inconnu.",
      },
      reason: {
        type: "string",
        description: "Une phrase : pourquoi cette recherche maintenant. Visible dans les logs.",
      },
    },
    required: ["query", "language", "depth", "reason"],
  },
};

/** Génère la définition d'un tool update_panel_<section>. */
function makePanelTool(
  section: string,
  sectionLabel: string,
  detailHint: string,
): Anthropic.Tool {
  return {
    name: `update_panel_${section}`,
    description: `Mets à jour la section "${sectionLabel}" du panel ICP en construction. ${detailHint} Tu peux appeler ce tool plusieurs fois dans un même tour si plusieurs insights émergent. Chaque appel APPEND des bullets aux existants, ne remplace pas.`,
    input_schema: {
      type: "object",
      properties: {
        bullets: {
          type: "array",
          items: { type: "string" },
          minItems: 1,
          maxItems: 5,
          description:
            "Liste de bullets au FORMAT STRICT 'Titre court : description complète' (titre 2-6 mots, séparateur ' : ', puis description). Ex BON : 'Méfiance commerciale : a déjà été échaudé par un SaaS parisien'. Ex MAUVAIS : 'Il se méfie des commerciaux car...' (pas de titre). Cette structure est utilisée par le rendu final (cards numérotées, persona grid, prose en gras). Une bullet = une idée concrète, pas de jargon, pas de superlatifs.",
        },
        confidence: {
          type: "string",
          enum: ["verified", "inferred", "hypothesis"],
          description:
            "'verified' = appuyé par une source web réelle (URL fournie). 'inferred' = déduction logique des claims du fondateur. 'hypothesis' = théorie de travail à vérifier.",
        },
        sources: {
          type: "array",
          items: { type: "string", format: "uri" },
          description:
            "URLs des sources qui appuient ces bullets. Obligatoire si confidence='verified'. Vide sinon.",
        },
      },
      required: ["bullets", "confidence", "sources"],
    },
  };
}

export const PANEL_TOOLS: Anthropic.Tool[] = [
  makePanelTool(
    "synthese",
    "Synthèse exécutive",
    "Une phrase qui résume l'ICP émergent : qui (rôle + segment), où (géo), et pourquoi (angle compétitif). À mettre à jour quand le segment se précise.",
  ),
  makePanelTool(
    "identite",
    "Identité du décideur",
    "Profil concret : titre, taille d'entreprise, géographie, âge typique, ancienneté, équipe sous sa responsabilité.",
  ),
  makePanelTool(
    "psychologie",
    "Psychologie du décideur",
    "Ce qui le réveille la nuit, ses biais, ce qui le convainc, ce qui le fait fuir, ses figures d'autorité, son vocabulaire.",
  ),
  makePanelTool(
    "marche",
    "Marché ciblé",
    "Taille du segment (TAM/SAM/SOM), maturité, cycle de vente, budget moyen, saisonnalité, concurrents principaux.",
  ),
  makePanelTool(
    "challenges",
    "Challenges identifiés",
    "Les raisons honnêtes pour lesquelles ce segment peut résister à ta vente. Ce qu'il faut pour réussir quand même.",
  ),
  makePanelTool(
    "avantages",
    "Avantages concurrentiels",
    "Où se trouve l'angle disponible que peu d'acteurs occupent sérieusement. Pourquoi tu peux gagner ici.",
  ),
];

export const FINALIZE_ICP_TOOL: Anthropic.Tool = {
  name: "finalize_icp",
  description:
    "Appelle ce tool quand l'ICP est mûr. NE DEMANDE PAS de confirmation, appelle directement. Tu produis ici TOUT le document final structuré : titre, synthèse, identité, psychologie, marché, challenges, avantages, outputs Sales Nav / Clay / qualification / hooks. Chaque champ a un rendu visuel propre (persona grid, vocab tags, stats TAM/SAM/SOM, point cards numérotées, etc.). Sois précis, factuel, sans superlatif. Le contenu vient de ce que tu as collecté pendant la session.",
  input_schema: {
    type: "object",
    properties: {
      segment_summary: {
        type: "string",
        description:
          "TITRE COURT, max 70 chars. Format punchy : rôle + segment + qualificatif. Ex : 'Founders & CTO · SaaS B2B HR Tech early-stage', 'RRH de PME industrielles multi-sites (100-250 sal.)'. Pas de phrase complète.",
      },
      synthese: {
        type: "string",
        description:
          "PROSE narrative unique, 280 à 480 chars. Pas de bullets. Qui est la cible, pourquoi elle est non-évidente, quel angle gagnant. Ton sec et factuel. Pas de jargon marketing.",
      },
      reframe: {
        type: "object",
        description:
          "Le résultat non-évident de la session, rendu en avant -> après. C'est la trace de ce que la session a fait bouger.",
        properties: {
          from: { type: "string", description: "La cible générique avec laquelle le fondateur est arrivé (tours 1-3). Ex : 'DRH de PME 50-200'." },
          to: { type: "string", description: "La cible affinée actée. Ex : 'RRH de PME industrielles multi-sites 100-250 sal. en région'." },
          why: { type: "string", description: "Pourquoi la cible affinée est plus défendable, 1-2 phrases." },
        },
        required: ["from", "to", "why"],
      },
      identite: {
        type: "object",
        description:
          "Profil structuré du décideur, rendu en persona grid avec avatar et 5 cellules. Chaque champ : 1 phrase courte ou 1-2 lignes.",
        properties: {
          role: { type: "string", description: "Titre du décideur. Ex : 'Fondateur technique ou CTO'." },
          seniority: { type: "string", description: "Niveau et position dans la chaîne de décision. Ex : 'Dirigeant, décideur final ET utilisateur, cycle court'." },
          industry: { type: "string", description: "Industrie / type d'entreprise. Ex : 'Éditeurs SaaS B2B verticalisés HR Tech'." },
          size: { type: "string", description: "Taille et stade. Ex : '20 à 100 salariés, post-Seed à Série A'." },
          team: { type: "string", description: "Équipe sous sa responsabilité. Ex : 'Équipe tech de 4 à 25 personnes'." },
          geo: { type: "string", description: "Géographie. Ex : 'Paris en priorité, puis Lyon, Nantes, Bordeaux'." },
          tenure: { type: "string", description: "Ancienneté typique. Ex : 'Fondateur depuis 2 à 6 ans'." },
          kpis: { type: "string", description: "Ce sur quoi le décideur est mesuré, sa métrique de succès. Ex : 'Vélocité de l'équipe et time-to-merge, pas le CA directement'." },
          buying_role: { type: "string", description: "Son rôle dans l'achat. Ex : 'Economic buyer ET utilisateur : il décide et il s'en sert'." },
        },
        required: ["role", "seniority", "industry", "size", "team", "geo", "tenure"],
      },
      psychologie: {
        type: "object",
        description: "Psychologie d'achat du décideur. Rendu en memo-prose + vocab tags + figures d'autorité.",
        properties: {
          prose: {
            type: "array",
            items: { type: "string" },
            minItems: 2,
            maxItems: 3,
            description: "2 à 3 paragraphes de prose narrative, chacun 250-450 chars. Analyse en profondeur : biais, ce qui le réveille la nuit, son rapport à l'info, son langage. Pas de bullets, c'est de la prose dense.",
          },
          vocab_yes: {
            type: "array",
            items: { type: "string" },
            minItems: 4,
            maxItems: 6,
            description: "Mots/expressions qui sonnent juste pour ce décideur. Ex : 'temps de build', 'DX', 'jours-dev économisés'.",
          },
          vocab_no: {
            type: "array",
            items: { type: "string" },
            minItems: 4,
            maxItems: 6,
            description: "Mots/expressions qui le font fuir. Ex : 'solution', 'disruptif', 'synergies', 'accompagnement'.",
          },
          autorites: {
            type: "string",
            description: "Figures d'autorité qui le font bouger, 1-2 phrases. Ex : 'Autres CTO respectés, Pragmatic Engineer, jamais d'analystes ni d'influenceurs growth.'",
          },
          biais: {
            type: "string",
            description: "Style de décision et biais cognitifs dominants, 1-2 phrases. Ex : 'Réflexe not-invented-here, surévalue sa capacité à construire en interne.'",
          },
          douleurs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                pain: { type: "string", description: "La douleur, concrète. Ex : 'La dette technique freine la vélocité juste avant la Série A'." },
                driver: { type: "string", description: "Le driver réel derrière. Ex : 'Peur de cramer ses devs seniors irremplaçables'." },
                intensite: { type: "string", enum: ["haute", "moyenne"] },
              },
              required: ["pain", "driver", "intensite"],
            },
            minItems: 2,
            maxItems: 4,
            description: "2 à 4 douleurs priorisées. Nourrit directement les angles de message.",
          },
          status_quo: {
            type: "string",
            description: "Ce que le décideur fait aujourd'hui à la place d'acheter (le vrai concurrent). Ex : 'Un script maison maintenu le week-end, ou rien'.",
          },
          preuves: {
            type: "array",
            items: { type: "string" },
            description: "Types de preuve qui le convainquent. Ex : ['benchmark technique public', 'recommandation d'un pair CTO', 'chiffre de jours-dev économisés'].",
          },
          resistances: {
            type: "array",
            items: { type: "string" },
            description: "Pourquoi il delete ton cold email (objections niveau message). Ex : ['ton commercial', 'pas de preuve technique', 'demande de call trop tôt'].",
          },
          registre: {
            type: "string",
            description: "Le ton à adopter pour lui parler. Ex : 'Pair à pair technique, sec, zéro fluff, du concret en 2 lignes'.",
          },
        },
        required: ["prose", "vocab_yes", "vocab_no", "autorites"],
      },
      marche: {
        type: "object",
        description: "Analyse marché structurée. Rendu en stat boxes (TAM/SAM/SOM/cycle/budget) + memo-prose (concurrence/maturité/saisonnalité/tendances).",
        properties: {
          tam: { type: "string", description: "Marché total. Format compact avec chiffre. Ex : '≈ 1 400 éditeurs SaaS HR Tech actifs en France'." },
          sam: { type: "string", description: "Atteignable. Ex : '≈ 420 entre 20 et 100 salariés'." },
          som: { type: "string", description: "Cible 12 mois. Ex : '≈ 130 atteignables en 12 mois avec un outbound ciblé'." },
          cycle: { type: "string", description: "Cycle de vente. Ex : '3 à 6 semaines'." },
          budget: { type: "string", description: "Budget annuel moyen. Ex : '12 000 à 35 000 € / an'." },
          concurrence: { type: "string", description: "Paysage concurrentiel. 1-2 phrases." },
          maturite: { type: "string", description: "Maturité du marché. 1-2 phrases." },
          saisonnalite: { type: "string", description: "Saisonnalité. 1-2 phrases." },
          tendances: { type: "string", description: "Tendances de fond. 1-2 phrases." },
          sources: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                site: { type: "string", description: "Domaine. Ex : 'lab-rh.com'." },
                url: { type: "string", format: "uri" },
              },
              required: ["title", "site", "url"],
            },
            description: "2 à 4 sources qui appuient l'analyse marché. Reprends les vraies URLs des recherches faites pendant la session.",
          },
          acv: { type: "string", description: "Valeur annuelle moyenne d'un contrat (économie du deal), distincte du budget marché. Ex : '18 000 € / an en moyenne'." },
          outbound_note: { type: "string", description: "UNE phrase : ce que cette analyse implique concrètement pour la prospection. Ex : 'Liste plafonnée à ~130 comptes, donc qualité de ciblage > volume'." },
          conf: { type: "string", enum: ["verified", "inferred", "hypothesis"], description: "Niveau de confiance global de l'analyse marché. 'verified' si appuyée par les sources, 'inferred' si déduite, 'hypothesis' si à vérifier." },
        },
        required: ["tam", "sam", "som", "cycle", "budget", "concurrence", "maturite", "saisonnalite", "tendances", "sources"],
      },
      challenges: {
        type: "array",
        minItems: 3,
        maxItems: 5,
        description: "3 à 5 challenges/risques. Rendus en numbered point cards (.point--risk). Chaque item : titre court (4-8 mots) + description (1-2 phrases).",
        items: {
          type: "object",
          properties: {
            t: { type: "string", description: "Titre du challenge, court et tranchant. Ex : 'Le réflexe « build it ourselves »'." },
            d: { type: "string", description: "Description : pourquoi ce risque existe et comment le contourner." },
            conf: { type: "string", enum: ["verified", "inferred", "hypothesis"], description: "Niveau de confiance de ce challenge." },
          },
          required: ["t", "d"],
        },
      },
      avantages: {
        type: "array",
        minItems: 2,
        maxItems: 4,
        description: "2 à 4 avantages concurrentiels. Rendus en check point cards (.point--adv). Chaque item : titre + description.",
        items: {
          type: "object",
          properties: {
            t: { type: "string", description: "Titre de l'avantage. Ex : 'Le vertical HR Tech est un angle libre'." },
            d: { type: "string", description: "Description de pourquoi c'est un angle gagnant." },
            conf: { type: "string", enum: ["verified", "inferred", "hypothesis"], description: "Niveau de confiance de cet avantage." },
          },
          required: ["t", "d"],
        },
      },
      salesnav: {
        type: "object",
        description: "Filtres Sales Navigator prêts à copier-coller.",
        properties: {
          jobTitles: { type: "array", items: { type: "string" }, description: "Intitulés de poste. Ex : ['Founder', 'CTO', 'VP Engineering']." },
          headcount: { type: "array", items: { type: "string" }, description: "Tailles d'entreprise. Ex : ['11-50', '51-200']." },
          industry: { type: "array", items: { type: "string" }, description: "Secteurs LinkedIn. Ex : ['Computer Software', 'Human Resources']." },
          geography: { type: "array", items: { type: "string" }, description: "Géographies. Ex : ['Paris, France', 'Lyon, France']." },
          keywords: { type: "array", items: { type: "string" }, description: "Mots-clés bio. Ex : ['HR tech', 'Series A', 'seed']." },
        },
        required: ["jobTitles", "headcount", "industry", "geography", "keywords"],
      },
      clay: {
        type: "object",
        description: "Filtres Clay (objet JSON sérialisable). Reprend des contraintes structurelles.",
        properties: {
          company_size_min: { type: "number" },
          company_size_max: { type: "number" },
          industries: { type: "array", items: { type: "string" } },
          country: { type: "string", description: "Code ISO. Ex : 'FR'." },
          cities: { type: "array", items: { type: "string" } },
          funding_stage: { type: "array", items: { type: "string" }, description: "Stages : 'seed', 'series_a', 'series_b'." },
          funding_recency_months: { type: "number", description: "Levée datant de moins de N mois." },
          decision_maker_titles: { type: "array", items: { type: "string" } },
          tech_stack_any: { type: "array", items: { type: "string" } },
          exclude_keywords: { type: "array", items: { type: "string" } },
        },
        required: [
          "company_size_min", "company_size_max", "industries", "country", "cities",
          "funding_stage", "funding_recency_months", "decision_maker_titles",
          "tech_stack_any", "exclude_keywords",
        ],
      },
      scorecard: {
        type: "object",
        description: "Scorecard de qualification opérationnelle, appliquée à un compte réel avant campagne. Deux paquets : filtres bloquants (sortent le compte de la liste) et critères de scoring pondérés (priorisation).",
        properties: {
          bloquants: {
            type: "array",
            minItems: 2,
            maxItems: 5,
            description: "Filtres bloquants (hard disqualifiers). Si non respecté, le compte sort de la liste.",
            items: {
              type: "object",
              properties: {
                signal: { type: "string", description: "Le signal à vérifier. Ex : 'Stade de financement'." },
                condition: { type: "string", description: "La condition bloquante. Ex : 'Pas de levée Seed/Série A < 12 mois'." },
                dataPoint: { type: "string", description: "La donnée qui permet de vérifier. Ex : 'funding_stage + funding_date (Clay)'." },
              },
              required: ["signal", "condition", "dataPoint"],
            },
          },
          scoring: {
            type: "array",
            minItems: 3,
            maxItems: 6,
            description: "Critères de scoring pondérés pour prioriser. Total des poids ~ threshold.",
            items: {
              type: "object",
              properties: {
                label: { type: "string", description: "Le critère. Ex : 'Stack moderne (Slack/Linear/Notion)'." },
                condition: { type: "string", description: "Comment l'évaluer. Ex : 'Détecté via BuiltWith ou job posts'." },
                weight: { type: "number", description: "Poids, ex 1 à 3." },
              },
              required: ["label", "condition", "weight"],
            },
          },
          threshold: { type: "number", description: "Score minimum pour décider 'on y va'." },
        },
        required: ["bloquants", "scoring"],
      },
      triggers: {
        type: "array",
        minItems: 3,
        maxItems: 6,
        description: "Signaux d'achat : QUAND contacter un compte. Le nerf de l'outbound.",
        items: {
          type: "object",
          properties: {
            event: { type: "string", description: "Ce qui se produit. Ex : 'Levée de fonds Seed ou Série A'." },
            source: { type: "string", description: "Où le détecter. Ex : 'Crunchbase, annonces presse, job posts ingé'." },
            window: { type: "string", description: "Fenêtre de réactivité. Ex : 'Dans les 3 mois suivant l'annonce'." },
            priority: { type: "string", enum: ["haute", "moyenne"] },
          },
          required: ["event", "source", "window", "priority"],
        },
      },
      enrichment: {
        type: "array",
        minItems: 4,
        maxItems: 6,
        description: "Variables à enrichir par prospect pour personnaliser et qualifier. Nourrit Clay.",
        items: {
          type: "object",
          properties: {
            variable: { type: "string", description: "La donnée à pull. Ex : 'Taille de l'équipe ingénierie'." },
            usage: { type: "string", description: "À quoi elle sert. Ex : 'Personnalisation du hook + critère de scoring'." },
            source: { type: "string", description: "Où la trouver. Ex : 'LinkedIn, site careers, BuiltWith'." },
          },
          required: ["variable", "usage", "source"],
        },
      },
      antifit: {
        type: "array",
        minItems: 2,
        maxItems: 5,
        description: "Exclusions dures au niveau compte : qui NE PAS contacter, pour protéger la qualité de campagne et le domaine.",
        items: {
          type: "object",
          properties: {
            signal: { type: "string", description: "Le signal d'exclusion. Ex : 'Agence ou cabinet de conseil'." },
            reason: { type: "string", description: "Pourquoi exclure. Ex : 'Pas un éditeur, n'a pas la douleur produit'." },
          },
          required: ["signal", "reason"],
        },
      },
      angles: {
        type: "array",
        minItems: 3,
        maxItems: 5,
        description: "3 à 5 angles de message dérivés de la psychologie. PAS du copy écrit, un brief créatif : l'angle, le ressort psychologique actionné, la preuve mobilisée, et ce qu'il ne faut surtout pas dire.",
        items: {
          type: "object",
          properties: {
            angle: { type: "string", description: "L'angle stratégique. Ex : 'Le coût caché du « on le fait nous-mêmes »'." },
            ressort: { type: "string", description: "Le ressort psychologique actionné (réf une douleur). Ex : 'Le réflexe NIH et la peur de la dette technique'." },
            preuve: { type: "string", description: "La preuve sur laquelle il s'appuie. Ex : 'Chiffrage des jours-dev récurrents du maintien interne'." },
            eviter: { type: "string", description: "Ce qu'il ne faut surtout pas dire (réf vocab_no). Ex : 'Tout vocabulaire commercial, ne pas demander un call d'emblée'." },
          },
          required: ["angle", "ressort", "preuve", "eviter"],
        },
      },
    },
    required: [
      "segment_summary", "synthese", "reframe", "identite", "psychologie", "marche",
      "challenges", "avantages", "salesnav", "clay", "scorecard",
      "triggers", "enrichment", "antifit", "angles",
    ],
  },
};

export const ALL_TOOLS: Anthropic.Tool[] = [
  SEARCH_WEB_TOOL,
  ...PANEL_TOOLS,
  FINALIZE_ICP_TOOL,
];

// Backwards compat (utilisé par C.4.3)
export const ALL_TOOLS_C43 = ALL_TOOLS;
