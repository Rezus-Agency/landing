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
            "Liste de phrases courtes et factuelles. Pas de superlatifs, pas de jargon. Une bullet = une idée concrète.",
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
    "Appelle ce tool UNIQUEMENT quand : (1) le segment est spécifique, (2) la psychologie est documentée, (3) au moins un angle compétitif est clair, (4) le fondateur a explicitement confirmé qu'on peut générer l'analyse ('ok on génère', 'c'est bon', 'on finalise'). Ne pas finalize prématurément.",
  input_schema: {
    type: "object",
    properties: {
      segment_summary: {
        type: "string",
        description:
          "Une phrase qui résume la cible affinée. Ex: 'Responsables RH de PME industrielles multi-sites en région (100-250 sal.), mal servis par les SIRH tertiaires parisiens.'",
      },
    },
    required: ["segment_summary"],
  },
};

export const ALL_TOOLS: Anthropic.Tool[] = [
  SEARCH_WEB_TOOL,
  ...PANEL_TOOLS,
  FINALIZE_ICP_TOOL,
];

// Backwards compat (utilisé par C.4.3)
export const ALL_TOOLS_C43 = ALL_TOOLS;
