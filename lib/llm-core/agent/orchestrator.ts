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
  // Bumped à 4096 pour que finalize_icp puisse produire les 11 champs structurés
  // (~2000-3000 tokens de JSON). Les autres tours utilisent à peine 800 tokens donc
  // ce n'est qu'un plafond, pas un coût garanti.
  const maxTokens = opts.maxTokens || 4096;
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
  // Garde-fou : max 10 iterations pour éviter une boucle infinie tout en laissant
  // le bot enchaîner plusieurs recherches + 4-6 panel updates dans le même tour.
  for (let iteration = 0; iteration < 10; iteration++) {
    const client = getClient();

    // Répare les éventuels tool_use orphelins avant chaque call API.
    // L'état state.messages reste tel quel ; on envoie une version réparée.
    const safeMessages = repairMessages(state.messages);

    const stream = client.messages.stream({
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
      messages: safeMessages as any,
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

    // Exécute chaque tool call et collecte les tool_result.
    // CRITIQUE : chaque tool_use DOIT avoir son tool_result correspondant
    // dans le prochain message user, sinon Anthropic renvoie HTTP 400 et la
    // session devient inutilisable. On wrap chaque tool en try/catch et on
    // pousse TOUJOURS un tool_result, même en cas d'erreur.
    const toolResults: Anthropic.ToolResultBlockParam[] = [];

    for (const tu of toolUses) {
      state.toolCalls.push({ name: tu.name, input: tu.input });

      try {
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
          // Defensive parsing — Claude peut omettre des champs ou renvoyer
          // des types inattendus si le tool a un peu hallu sur le schema.
          const rawInput = (tu.input || {}) as Record<string, unknown>;
          const bullets: string[] = Array.isArray(rawInput.bullets)
            ? (rawInput.bullets as unknown[]).filter((b): b is string => typeof b === "string")
            : [];
          const incomingSources: string[] = Array.isArray(rawInput.sources)
            ? (rawInput.sources as unknown[]).filter((s): s is string => typeof s === "string")
            : [];
          const confidence: PanelPatch["confidence"] =
            rawInput.confidence === "verified" ||
            rawInput.confidence === "inferred" ||
            rawInput.confidence === "hypothesis"
              ? rawInput.confidence
              : "hypothesis";

          if (bullets.length === 0) {
            toolResults.push({
              type: "tool_result",
              tool_use_id: tu.id,
              content: `Panel update rejected: no valid bullets provided.`,
              is_error: true,
            });
            continue;
          }

          const sectionKey = section as PanelPatch["section"];

          // Append au panel state (ne remplace pas)
          const existing = state.panel[sectionKey];
          const existingBullets = existing?.bullets ?? [];
          const existingSources = existing?.sources ?? [];
          const merged: Omit<PanelPatch, "section"> = {
            bullets: [...existingBullets, ...bullets],
            confidence:
              confidence === "verified" || existing?.confidence === "verified"
                ? "verified"
                : confidence === "inferred" || existing?.confidence === "inferred"
                  ? "inferred"
                  : "hypothesis",
            sources: Array.from(new Set([...existingSources, ...incomingSources])),
          };
          state.panel[sectionKey] = merged;

          yield {
            type: "panel_patch",
            patch: {
              section: sectionKey,
              bullets,
              confidence,
              sources: incomingSources,
            },
          };

          toolResults.push({
            type: "tool_result",
            tool_use_id: tu.id,
            content: `Panel section "${section}" updated with ${bullets.length} bullet(s). Confidence: ${confidence}.`,
          });
        } else if (tu.name === "finalize_icp") {
          const input = (tu.input || {}) as Record<string, unknown>;
          state.finalized = true;
          const segment_summary =
            typeof input.segment_summary === "string" && input.segment_summary.trim()
              ? input.segment_summary.trim()
              : "Segment cible finalisé.";
          const synthese =
            typeof input.synthese === "string" && input.synthese.trim()
              ? input.synthese.trim()
              : "";
          yield {
            type: "finalize_signal",
            segment_summary,
            synthese,
            doc: input,
          };
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
      } catch (err) {
        // Sécurité : si un tool throw, on doit toujours pousser un tool_result
        // pour ne pas corrompre la conversation. L'erreur est aussi remontée
        // au niveau yield pour visibilité.
        const message = (err as Error).message || String(err);
        yield {
          type: "error",
          code: "tool_execution_error",
          message: `${tu.name}: ${message}`,
        };
        toolResults.push({
          type: "tool_result",
          tool_use_id: tu.id,
          content: `Tool execution failed: ${message}. Continue without this tool's result.`,
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

/**
 * Message d'intro fixe envoyé d'office au démarrage de chaque session.
 * Ce N'EST PAS un appel LLM (gratuit, déterministe, instantané).
 * Il est inscrit dans state.messages comme un "assistant" turn pour que
 * le LLM ait le contexte de ce qui a déjà été dit au user.
 */
export const INTRO_MESSAGE = `Salut. On va définir ton ICP ensemble. Voilà la règle du jeu :

1. **Je vais challenger ta cible**, pas la valider. Si tu me dis "je cible les CTO B2B" je vais te répondre "comme la moitié du marché, qu'est-ce qui te différencie ?"
2. **Je vais faire des recherches en direct** pour étayer mes claims. Tu verras les sources s'afficher au fur et à mesure.
3. **Je vais te proposer mes hypothèses** avant de te poser des questions. Si tu ne sais pas, dis-le, je creuserai à ta place.
4. **L'objectif** : sortir un ICP non-évident, défendable et exécutable en 10 à 15 tours, pas plus.

Pour démarrer : **qu'est-ce que tu vends, et à qui tu penses le vendre aujourd'hui ?**`;

/**
 * Initialise une session en injectant le message d'intro dans state.messages.
 * À appeler une fois par session, avant le premier runTurn.
 */
export function seedIntro(state: SessionState): { intro: string } {
  if (state.messages.length === 0) {
    state.messages.push({
      role: "assistant",
      content: [{ type: "text", text: INTRO_MESSAGE }],
    });
  }
  return { intro: INTRO_MESSAGE };
}

/**
 * Répare le tableau de messages avant un call API.
 *
 * Anthropic exige que chaque `tool_use` block dans un message assistant ait
 * son `tool_result` correspondant dans le message user suivant. Si un tool
 * a crashé en cours de tour, la conversation peut se retrouver avec des
 * tool_use orphelins, ce qui renvoie HTTP 400 indéfiniment.
 *
 * Cette fonction parcourt les messages et ajoute des synthetic tool_results
 * pour tout tool_use orphelin.
 */
function repairMessages(
  messages: Array<{ role: "user" | "assistant"; content: unknown }>,
): Array<{ role: "user" | "assistant"; content: unknown }> {
  const repaired: Array<{ role: "user" | "assistant"; content: unknown }> = [];

  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    repaired.push(m);
    if (m.role !== "assistant" || !Array.isArray(m.content)) continue;

    const toolUseIds: string[] = [];
    for (const block of m.content as Array<{ type?: string; id?: string }>) {
      if (block.type === "tool_use" && typeof block.id === "string") {
        toolUseIds.push(block.id);
      }
    }
    if (toolUseIds.length === 0) continue;

    const next = messages[i + 1];
    const nextBlocks =
      next && next.role === "user" && Array.isArray(next.content)
        ? (next.content as Array<{ type?: string; tool_use_id?: string }>)
        : [];
    const resolvedIds = new Set(
      nextBlocks
        .filter((b) => b.type === "tool_result" && typeof b.tool_use_id === "string")
        .map((b) => b.tool_use_id as string),
    );

    const orphans = toolUseIds.filter((id) => !resolvedIds.has(id));
    if (orphans.length === 0) continue;

    const syntheticResults = orphans.map((id) => ({
      type: "tool_result" as const,
      tool_use_id: id,
      content: "Tool result lost (session recovered). Continue without this output.",
      is_error: true,
    }));

    if (next && next.role === "user" && Array.isArray(next.content)) {
      // Préfixe les synthetic results aux blocs existants
      repaired.push({
        role: "user",
        content: [...syntheticResults, ...(next.content as unknown[])],
      });
      i += 1; // on a consommé next
    } else {
      // Pas de next user, on insère un user message avec les synthetic results
      repaired.push({
        role: "user",
        content: syntheticResults,
      });
    }
  }

  return repaired;
}

export { repairMessages };
