/**
 * Orchestrator — un tour d'agent ICP Discovery.
 *
 * Boucle :
 *   1. Stream Claude (Sonnet 4.6 par défaut) avec system prompt + tools
 *   2. Si stop_reason === "tool_use" : exécute les tools, push tool_result, restream
 *   3. Si stop_reason === "end_turn" : turn done
 *
 * Émet des AgentEvents typés (text, search_start, search_result, cost, etc.)
 * via async generator.
 *
 * C.4.3 : Sonnet seul + search_web. C.4.4 ajoutera le routing Haiku → Opus.
 * C.4.5 ajoutera les 6 update_panel_* tools.
 */

import Anthropic from "@anthropic-ai/sdk";
import { searchWeb } from "../tools/search-web";
import { SYSTEM_PROMPT_FR } from "../prompts/system.fr";
import { ALL_TOOLS } from "./tools-schema";
import { priceCall, type AnthropicModel } from "../cost";
import type { AgentEvent, PanelPatch, SessionState, TokenUsage } from "../types";
import { routeTurn } from "./router";

const PANEL_SECTIONS = new Set([
  "synthese",
  "identite",
  "psychologie",
  "marche",
  "challenges",
  "avantages",
]);

const DEFAULT_MODEL: AnthropicModel = "claude-sonnet-4-6";

let _client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");
    _client = new Anthropic({ apiKey });
  }
  return _client;
}

export type RunTurnOptions = {
  /** Si défini, force ce modèle au lieu du routing automatique. Utile pour les tests. */
  model?: AnthropicModel;
  maxTokens?: number;
  /** Si true, prompt caching activé sur system + tools. */
  cache?: boolean;
  /** Si true (défaut), router Haiku appelé pour décider du modèle. */
  router?: boolean;
};

/**
 * Exécute un tour conversationnel complet.
 * Push le message user, stream Claude, gère tool use loop, retourne quand turn done.
 */
export async function* runTurn(
  state: SessionState,
  userMessage: string,
  opts: RunTurnOptions = {},
): AsyncGenerator<AgentEvent, void, unknown> {
  const maxTokens = opts.maxTokens || 1200;
  const useRouter = opts.router !== false && !opts.model;

  // Routing décision
  let model: AnthropicModel = opts.model || DEFAULT_MODEL;
  let intent: import("../types").TurnIntent = "discovery";

  if (useRouter) {
    // Construit le contexte des 3 derniers tours (texte seulement)
    const recent = state.messages.slice(-6).map((m) => {
      const text =
        typeof m.content === "string"
          ? m.content
          : Array.isArray(m.content)
            ? (m.content as Array<{ type: string; text?: string }>)
                .filter((b) => b.type === "text")
                .map((b) => b.text || "")
                .join(" ")
            : "";
      return { role: m.role, text };
    });
    const decision = await routeTurn(userMessage, recent);
    model = decision.model;
    intent = decision.intent;
    state.totalUsd += decision.costUsd;
  }

  // Push user message
  state.messages.push({
    role: "user",
    content: [{ type: "text", text: userMessage }],
  });

  let turnUsage: TokenUsage = { input: 0, output: 0, cachedInput: 0, cacheCreation: 0 };
  let turnCost = 0;

  yield { type: "turn_start", model, intent };

  // Tool use loop : on continue tant que Claude appelle des tools.
  // Garde-fou : max 5 iterations pour éviter une boucle infinie.
  for (let iteration = 0; iteration < 5; iteration++) {
    const client = getClient();

    const stream = await client.messages.stream({
      model,
      max_tokens: maxTokens,
      system: opts.cache
        ? [
            {
              type: "text",
              text: SYSTEM_PROMPT_FR,
              cache_control: { type: "ephemeral" },
            } as Anthropic.TextBlockParam,
          ]
        : SYSTEM_PROMPT_FR,
      tools: ALL_TOOLS,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: state.messages as any,
    });

    // Accumule les blocs pour reconstituer la réponse assistant
    let assistantBlocks: Array<Anthropic.ContentBlock> = [];

    for await (const event of stream) {
      if (event.type === "content_block_delta") {
        if (event.delta.type === "text_delta") {
          yield { type: "text", delta: event.delta.text };
        } else if (event.delta.type === "thinking_delta") {
          yield { type: "thinking", delta: event.delta.thinking };
        }
        // input_json_delta : pour les tool calls streamés — ignoré ici (on attend le complet)
      } else if (event.type === "message_delta") {
        if (event.usage) {
          turnUsage = {
            input: (turnUsage.input || 0) + (event.usage.input_tokens || 0),
            output: (turnUsage.output || 0) + (event.usage.output_tokens || 0),
            cachedInput:
              (turnUsage.cachedInput || 0) + (event.usage.cache_read_input_tokens || 0),
            cacheCreation:
              (turnUsage.cacheCreation || 0) + (event.usage.cache_creation_input_tokens || 0),
          };
        }
      }
    }

    // Récupère le message final pour avoir les blocs (text + tool_use)
    const finalMessage = await stream.finalMessage();
    assistantBlocks = finalMessage.content;

    // Push la réponse assistant dans l'historique
    state.messages.push({ role: "assistant", content: assistantBlocks });

    // Compute cost pour cette itération
    const iterCost = priceCall(model, turnUsage);
    turnCost += iterCost;
    state.totalUsd += iterCost;

    // Y a-t-il des tool calls à exécuter ?
    const toolUses = assistantBlocks.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
    );

    if (toolUses.length === 0) {
      // Pas de tool call : turn done
      yield {
        type: "cost",
        turnUsd: turnCost,
        sessionUsd: state.totalUsd,
        tokens: turnUsage,
      };
      yield { type: "turn_done", stopReason: finalMessage.stop_reason || "end_turn" };
      return;
    }

    // Exécute chaque tool call et collecte les tool_result
    const toolResults: Anthropic.ToolResultBlockParam[] = [];

    for (const tu of toolUses) {
      state.toolCalls.push({ name: tu.name, input: tu.input });

      if (tu.name === "search_web") {
        const input = tu.input as {
          query: string;
          language: "fr" | "en";
          depth: "fast" | "deep";
          reason: string;
        };
        yield {
          type: "search_start",
          query: input.query,
          language: input.language,
          reason: input.reason,
        };

        const result = await searchWeb({
          query: input.query,
          language: input.language,
          depth: input.depth,
          reason: input.reason,
        });

        state.searchCount += 1;
        state.totalUsd += result.costUsd;
        state.toolCalls[state.toolCalls.length - 1].result = result;

        yield { type: "search_result", result };

        const compact = {
          query: result.query,
          provider: result.provider,
          error: result.error,
          results: result.results.map((s) => ({
            title: s.title,
            url: s.url,
            site: s.site,
            snippet: s.snippet?.slice(0, 250),
          })),
        };

        toolResults.push({
          type: "tool_result",
          tool_use_id: tu.id,
          content: JSON.stringify(compact),
          is_error: !!result.error,
        });
      } else if (tu.name.startsWith("update_panel_")) {
        const section = tu.name.replace("update_panel_", "");
        if (!PANEL_SECTIONS.has(section)) {
          toolResults.push({
            type: "tool_result",
            tool_use_id: tu.id,
            content: `Unknown section: ${section}`,
            is_error: true,
          });
          continue;
        }
        const input = tu.input as {
          bullets: string[];
          confidence: PanelPatch["confidence"];
          sources: string[];
        };
        const sectionKey = section as PanelPatch["section"];

        // Append au panel state (ne remplace pas)
        const existing = state.panel[sectionKey];
        const merged: Omit<PanelPatch, "section"> = existing
          ? {
              bullets: [...existing.bullets, ...input.bullets],
              confidence:
                input.confidence === "verified" || existing.confidence === "verified"
                  ? "verified"
                  : input.confidence === "inferred" || existing.confidence === "inferred"
                    ? "inferred"
                    : "hypothesis",
              sources: Array.from(new Set([...existing.sources, ...input.sources])),
            }
          : {
              bullets: input.bullets,
              confidence: input.confidence,
              sources: input.sources,
            };
        state.panel[sectionKey] = merged;

        yield {
          type: "panel_patch",
          patch: {
            section: sectionKey,
            bullets: input.bullets,
            confidence: input.confidence,
            sources: input.sources,
          },
        };

        toolResults.push({
          type: "tool_result",
          tool_use_id: tu.id,
          content: `Panel section "${section}" updated with ${input.bullets.length} bullet(s). Confidence: ${input.confidence}.`,
        });
      } else if (tu.name === "finalize_icp") {
        const input = tu.input as { segment_summary: string };
        state.finalized = true;
        yield { type: "finalize_signal", segment_summary: input.segment_summary };
        toolResults.push({
          type: "tool_result",
          tool_use_id: tu.id,
          content: `Finalize triggered. The user-facing app will now generate the final ICP document.`,
        });
      } else {
        // Tool inconnu
        toolResults.push({
          type: "tool_result",
          tool_use_id: tu.id,
          content: `Unknown tool: ${tu.name}`,
          is_error: true,
        });
      }
    }

    // Push tool_results dans une nouvelle user message, puis on relance la boucle
    state.messages.push({ role: "user", content: toolResults });

    // Émission du coût intermédiaire (pas final encore)
    yield {
      type: "cost",
      turnUsd: turnCost,
      sessionUsd: state.totalUsd,
      tokens: turnUsage,
    };
  }

  // Max iterations atteint
  yield {
    type: "error",
    code: "max_tool_iterations",
    message: "Trop d'appels d'outils en chaîne. Tour interrompu.",
  };
  yield { type: "turn_done", stopReason: "max_iterations" };
}

/** Helper : crée un état de session vierge. */
export function freshSession(scenario?: string): SessionState {
  return {
    id: "sess_" + Date.now().toString(36),
    scenario,
    startedAt: Date.now(),
    messages: [],
    panel: {},
    toolCalls: [],
    totalUsd: 0,
    searchCount: 0,
    finalized: false,
  };
}
