/**
 * Génération one-shot de l'ICP pour le wizard ("J'ai déjà mon ICP").
 *
 * Deux phases pour la fiabilité :
 *   1. Recherche (optionnelle, 1 vague) : le modèle peut lancer 1-2 search_web
 *      pour fonder le marché sur des sources réelles.
 *   2. finalize_icp FORCÉ (tool_choice) : sortie structurée propre et complète,
 *      sans préambule texte ni format hybride (évite les fiches tronquées/cassées
 *      observées en un seul tour libre).
 */
import Anthropic from "@anthropic-ai/sdk";
import { searchWeb } from "../tools/search-web";
import { SEARCH_WEB_TOOL, FINALIZE_ICP_TOOL } from "./tools-schema";
import { SPEC_SYSTEM_PROMPT_FR } from "../prompts/spec.fr";
import { priceCall, type AnthropicModel } from "../cost";
import type { TokenUsage, WebSource } from "../types";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Phase 1 (décision de recherche) : Haiku, rapide et bon marché.
// Phase 2 (finalize forcé) : Opus. Testé : Sonnet rendait des fiches trouées
// (identite/psychologie/reframe manquantes) sur ce gros schéma ; Opus produit un
// document complet et fiable. La latence (~60-70s) est couverte par l'animation.
const PHASE1_MODEL: AnthropicModel = "claude-haiku-4-5";
const PHASE2_MODEL: AnthropicModel = "claude-opus-4-8";

let _client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");
    _client = new Anthropic({ apiKey });
  }
  return _client;
}

function toUsage(u: Anthropic.Usage): TokenUsage {
  return {
    input: u.input_tokens || 0,
    output: u.output_tokens || 0,
    cachedInput: u.cache_read_input_tokens || 0,
    cacheCreation: u.cache_creation_input_tokens || 0,
  };
}

export type SpecGenResult = {
  doc: Record<string, any>;
  segmentSummary: string;
  synthese: string;
  sources: WebSource[];
  totalUsd: number;
};

export type SpecIssue = { field: string; message: string };
export type SpecCheck = { sufficient: boolean; issues: SpecIssue[] };

const CHECK_TOOL: Anthropic.Tool = {
  name: "report_sufficiency",
  description:
    "Indique si la saisie du formulaire suffit à générer un ICP utile, et sinon quels champs retravailler.",
  input_schema: {
    type: "object",
    properties: {
      sufficient: {
        type: "boolean",
        description: "true si on peut produire une fiche utile, false sinon.",
      },
      issues: {
        type: "array",
        description: "Champs à retravailler (vide si sufficient=true).",
        items: {
          type: "object",
          properties: {
            field: {
              type: "string",
              enum: [
                "offre.what",
                "offre.differentiation",
                "cible.industry",
                "decideur.role",
                "pain.main",
                "antifit.avoid",
              ],
            },
            message: {
              type: "string",
              description: "Message court, concret et bienveillant pour l'utilisateur.",
            },
          },
          required: ["field", "message"],
        },
      },
    },
    required: ["sufficient", "issues"],
  },
};

const CHECK_SYSTEM = `Tu vérifies si la saisie d'un formulaire ICP suffit à produire une fiche de qualité pour de la prospection.

Sois PERMISSIF : ne bloque QUE si un champ est vide, absurde (ex. "non", "test", "azerty", "rien"), ou bien trop vague pour en tirer quoi que ce soit d'utile. Si la saisie est globalement exploitable même imparfaite, tu réponds sufficient=true (on enrichira). Le champ le plus important est "ce que tu vends" (offre.what) : s'il est inexploitable, sufficient=false.

Ne sur-bloque pas : l'utilisateur veut aller vite, on évite les allers-retours inutiles. Maximum 2-3 issues, sur les champs vraiment problématiques. Messages courts et actionnables.

Tu réponds UNIQUEMENT via l'outil report_sufficiency.`;

/** Garde-fou rapide (Haiku) AVANT la génération coûteuse : évite de brûler des
 * tokens Opus sur une saisie inexploitable, et renvoie les champs à retravailler. */
export async function checkSpecSufficiency(brief: string): Promise<SpecCheck> {
  const client = getClient();
  try {
    const r = await client.messages.create({
      model: PHASE1_MODEL,
      max_tokens: 512,
      system: CHECK_SYSTEM,
      tools: [CHECK_TOOL],
      tool_choice: { type: "tool", name: "report_sufficiency" },
      messages: [{ role: "user", content: brief }],
    });
    const tu = r.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use" && b.name === "report_sufficiency",
    );
    const input = (tu?.input || {}) as { sufficient?: boolean; issues?: SpecIssue[] };
    return {
      sufficient: input.sufficient !== false,
      issues: Array.isArray(input.issues) ? input.issues : [],
    };
  } catch {
    // En cas d'échec du garde-fou, on laisse passer (on ne bloque pas l'utilisateur).
    return { sufficient: true, issues: [] };
  }
}

export async function generateFromSpec(brief: string): Promise<SpecGenResult> {
  const client = getClient();
  let totalUsd = 0;
  const sources: WebSource[] = [];
  const seen = new Set<string>();
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: brief }];

  // ---- Phase 1 : recherche (optionnelle) ----
  const r1 = await client.messages.create({
    model: PHASE1_MODEL,
    max_tokens: 1024,
    system: SPEC_SYSTEM_PROMPT_FR,
    tools: [SEARCH_WEB_TOOL],
    messages,
  });
  totalUsd += priceCall(PHASE1_MODEL, toUsage(r1.usage));

  const toolUses = r1.content.filter(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
  );
  if (toolUses.length > 0) {
    messages.push({ role: "assistant", content: r1.content });
    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const tu of toolUses) {
      if (tu.name === "search_web") {
        const inp = tu.input as any;
        try {
          const sr = await searchWeb({
            query: String(inp.query || ""),
            language: inp.language === "en" ? "en" : "fr",
            depth: inp.depth === "deep" ? "deep" : "fast",
            reason: inp.reason,
          });
          totalUsd += sr.costUsd || 0;
          for (const s of sr.results) {
            if (s.url && !seen.has(s.url)) {
              seen.add(s.url);
              sources.push(s);
            }
          }
          toolResults.push({
            type: "tool_result",
            tool_use_id: tu.id,
            content: JSON.stringify(sr.results.slice(0, 6)),
          });
        } catch {
          toolResults.push({
            type: "tool_result",
            tool_use_id: tu.id,
            content: "Recherche indisponible, continue sans.",
            is_error: true,
          });
        }
      } else {
        toolResults.push({
          type: "tool_result",
          tool_use_id: tu.id,
          content: "ignoré",
        });
      }
    }
    messages.push({ role: "user", content: toolResults });
  }

  // ---- Phase 2 : finalize_icp forcé ----
  messages.push({
    role: "user",
    content:
      "Produis maintenant la fiche complète via finalize_icp. Remplis TOUTES les sections (identite, psychologie, marche, challenges, avantages, salesnav, clay, scorecard, triggers, enrichment, antifit, angles), aucune vide.",
  });

  const r2 = await client.messages.create({
    model: PHASE2_MODEL,
    max_tokens: 8192,
    system: SPEC_SYSTEM_PROMPT_FR,
    tools: [FINALIZE_ICP_TOOL],
    tool_choice: { type: "tool", name: "finalize_icp" },
    messages,
  });
  totalUsd += priceCall(PHASE2_MODEL, toUsage(r2.usage));

  const fin = r2.content.find(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use" && b.name === "finalize_icp",
  );
  if (!fin) throw new Error("Le modèle n'a pas produit de fiche.");
  const doc = (fin.input || {}) as Record<string, any>;

  return {
    doc,
    segmentSummary: String(doc.segment_summary || ""),
    synthese: String(doc.synthese || ""),
    sources,
    totalUsd,
  };
}
