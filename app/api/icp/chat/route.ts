/**
 * POST /api/icp/chat
 *
 * Body : { messages: AnthropicMessage[], userMessage: string, scenario?: string }
 * Response : SSE stream d'AgentEvents typés (text, search_result, panel_patch, etc.)
 *
 * Le client envoie son état conversation complet (messages array) à chaque tour.
 * Le serveur est stateless (pas de DB côté serveur pour v1).
 * À la fin, le serveur émet un event "state" avec le nouvel état complet pour que
 * le client persiste en localStorage.
 *
 * Runtime: Node (pas Edge) car @anthropic-ai/sdk + tsx loader.
 * Max duration: 300s (long sessions OK).
 */
import { runTurn } from "@/lib/llm-core/agent/orchestrator";
import type { SessionState } from "@/lib/llm-core/types";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

interface RequestBody {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: Array<{ role: "user" | "assistant"; content: any }>;
  panel: SessionState["panel"];
  totalUsd: number;
  searchCount: number;
  userMessage: string;
  scenario?: string;
  sessionId?: string;
}

function sseFormat(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: Request) {
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  if (!body.userMessage || typeof body.userMessage !== "string") {
    return new Response("Missing userMessage", { status: 400 });
  }

  // Reconstitue un SessionState à partir du payload client
  const state: SessionState = {
    id: body.sessionId || "sess_" + Date.now().toString(36),
    scenario: body.scenario,
    startedAt: Date.now(),
    messages: Array.isArray(body.messages) ? body.messages : [],
    panel: body.panel || {},
    toolCalls: [],
    totalUsd: typeof body.totalUsd === "number" ? body.totalUsd : 0,
    searchCount: typeof body.searchCount === "number" ? body.searchCount : 0,
    finalized: false,
  };

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(encoder.encode(sseFormat(event, data)));
        } catch {
          // controller closed
        }
      };

      try {
        for await (const event of runTurn(state, body.userMessage, { cache: true })) {
          send(event.type, event);
        }
        // À la fin, on renvoie l'état complet pour persistence côté client
        send("state", {
          messages: state.messages,
          panel: state.panel,
          totalUsd: state.totalUsd,
          searchCount: state.searchCount,
          finalized: state.finalized,
        });
      } catch (err) {
        const message = (err as Error).message || String(err);
        send("error", { code: "stream_failure", message });
      } finally {
        send("done", { ok: true });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
