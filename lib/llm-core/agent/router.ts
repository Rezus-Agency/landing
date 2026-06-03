/**
 * Router Haiku — classifie chaque message user pour décider quel modèle utiliser.
 *
 * Coût : ~$0.0001/tour (Haiku 4.5 1k tokens input / 50 tokens output).
 * Latence : ~200-400ms (acceptable, ajouté au délai du turn principal).
 *
 * Sorties :
 *   - weak_claim         → Opus 4.8 (challenger fort)
 *   - ready_to_finalize  → Opus 4.8 (synthèse fiable)
 *   - research_request   → Sonnet 4.6 (rapide + tool use)
 *   - discovery          → Sonnet 4.6 (probe par défaut)
 *   - greeting           → Sonnet 4.6 (court ack)
 */

import Anthropic from "@anthropic-ai/sdk";
import type { AnthropicModel } from "../cost";
import { priceCall } from "../cost";
import type { TokenUsage, TurnIntent } from "../types";

const ROUTER_MODEL = "claude-haiku-4-5" as const;

let _client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");
    _client = new Anthropic({ apiKey });
  }
  return _client;
}

const ROUTER_SYSTEM = `Tu es un classifieur. Lis le message user (et le contexte des 3 derniers tours si fourni). Choisis UNE catégorie parmi :

- "greeting" : salutation ou message vide ("ok", "salut", "merci")
- "discovery" : le user partage des infos, raconte, décrit son produit/contexte (PAR DÉFAUT)
- "weak_claim" : le user affirme une cible générique ou évidente (ex : "on cible les PME", "les fondateurs B2B", "les DAF") — celle qui mérite un challenge fort
- "research_request" : le user demande explicitement de vérifier ou chercher quelque chose ("tu peux vérifier", "quelle est la taille", "qui est leader")
- "ready_to_finalize" : le user confirme qu'on peut générer l'analyse finale ("on génère", "c'est bon", "on peut finaliser", "ça me va")

Réponds UNIQUEMENT avec un objet JSON {"intent": "..."}. Pas de prose, pas de markdown, pas d'explications.`;

const CLASSIFY_TOOL: Anthropic.Tool = {
  name: "classify_intent",
  description: "Classifie l'intent du message user. Renvoie une catégorie unique.",
  input_schema: {
    type: "object",
    properties: {
      intent: {
        type: "string",
        enum: [
          "greeting",
          "discovery",
          "weak_claim",
          "research_request",
          "ready_to_finalize",
        ],
      },
    },
    required: ["intent"],
  },
};

export type RouterDecision = {
  intent: TurnIntent;
  model: AnthropicModel;
  thinkingEffort: "low" | "medium" | "high";
  latencyMs: number;
  costUsd: number;
  fallbackReason?: string;
};

/**
 * Classifie le message user et décide du modèle à utiliser pour ce tour.
 */
export async function routeTurn(
  userMessage: string,
  recentTurns: Array<{ role: "user" | "assistant"; text: string }> = [],
): Promise<RouterDecision> {
  const started = Date.now();
  const client = getClient();

  const context = recentTurns
    .slice(-3)
    .map((t) => `[${t.role}] ${t.text.slice(0, 300)}`)
    .join("\n");

  const prompt = context
    ? `Contexte récent :\n${context}\n\nNouveau message user :\n${userMessage}\n\nClassifie en appelant classify_intent.`
    : `Message user :\n${userMessage}\n\nClassifie en appelant classify_intent.`;

  try {
    const res = await client.messages.create({
      model: ROUTER_MODEL,
      max_tokens: 80,
      system: ROUTER_SYSTEM,
      tools: [CLASSIFY_TOOL],
      tool_choice: { type: "tool", name: "classify_intent" },
      messages: [{ role: "user", content: prompt }],
    });

    const usage: TokenUsage = {
      input: res.usage.input_tokens,
      output: res.usage.output_tokens,
      cachedInput: res.usage.cache_read_input_tokens || 0,
      cacheCreation: res.usage.cache_creation_input_tokens || 0,
    };
    const cost = priceCall(ROUTER_MODEL, usage);

    const toolBlock = res.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
    );

    if (!toolBlock) {
      return {
        intent: "discovery",
        model: "claude-sonnet-4-6",
        thinkingEffort: "medium",
        latencyMs: Date.now() - started,
        costUsd: cost,
        fallbackReason: "router did not call tool",
      };
    }

    const input = toolBlock.input as { intent: TurnIntent };
    const intent = input.intent;

    let model: AnthropicModel = "claude-sonnet-4-6";
    let thinkingEffort: "low" | "medium" | "high" = "medium";

    if (intent === "weak_claim") {
      model = "claude-opus-4-8";
      thinkingEffort = "high";
    } else if (intent === "ready_to_finalize") {
      model = "claude-opus-4-8";
      thinkingEffort = "high";
    } else if (intent === "greeting") {
      thinkingEffort = "low";
    }

    return {
      intent,
      model,
      thinkingEffort,
      latencyMs: Date.now() - started,
      costUsd: cost,
    };
  } catch (err) {
    // Fallback : Sonnet par défaut si le router crashe (jamais bloquer un tour)
    return {
      intent: "discovery",
      model: "claude-sonnet-4-6",
      thinkingEffort: "medium",
      latencyMs: Date.now() - started,
      costUsd: 0,
      fallbackReason: (err as Error).message,
    };
  }
}
