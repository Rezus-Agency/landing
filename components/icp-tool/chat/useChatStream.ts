"use client";

/**
 * Hook qui POST /api/icp/chat et consomme la SSE stream.
 * Met à jour le Zustand store en temps réel : log, panel, totalUsd, etc.
 */

import { useCallback, useRef, useState } from "react";
import { useToolStore } from "@/lib/icp-tool/store";
import { toast } from "@/components/icp-tool/ui/ToastProvider";
import { panelFromIcp } from "@/lib/icp-tool/icp-summary";
import type { ChatEvent, ICP, ICPSection, SessionDraft } from "@/lib/icp-tool/types";

type LlmPanelPatch = {
  section: "synthese" | "identite" | "psychologie" | "marche" | "challenges" | "avantages";
  bullets: string[];
  confidence: "verified" | "inferred" | "hypothesis";
  sources: string[];
};

type LlmSearchResult = {
  query: string;
  results: Array<{ title: string; site: string; url: string }>;
  provider: "linkup" | "tavily" | "none";
  latencyMs: number;
  error?: string;
};

/** Convertit un patch LLM en ICPSection UI (texte + status). */
function patchToSection(p: LlmPanelPatch, existing?: ICPSection): ICPSection {
  const existingBullets = existing
    ? existing.text.split(/\n/).filter((l) => l.trim().startsWith("•")).map((l) => l.replace(/^•\s*/, "").trim())
    : [];
  const allBullets = [...existingBullets, ...p.bullets];
  const dedup = Array.from(new Set(allBullets));
  const text = dedup.map((b) => `• ${b}`).join("\n");
  const status: ICPSection["status"] = p.confidence === "verified" || p.confidence === "inferred" ? "done" : "draft";
  return { status, text };
}

export function useChatStream() {
  const session = useToolStore((s) => s.session);
  const setSession = useToolStore((s) => s.setSession);
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setBusy(false);
  }, []);

  const send = useCallback(
    async (userText: string) => {
      if (busy) return;
      const current = useToolStore.getState().session;
      if (!current) return;

      const text = userText.trim();
      if (!text) return;

      setBusy(true);

      // 1. Append user message côté UI immédiatement
      const baseLog: ChatEvent[] = [...current.log, { from: "user", text }];
      const userAnthropic = { role: "user" as const, content: [{ type: "text", text }] };

      let live: SessionDraft = {
        ...current,
        log: baseLog,
        messages: [...(current.messages || []), userAnthropic],
        awaiting: false,
        pendingQuick: null,
      };
      setSession(live);

      // 2. Une seule bulle bot par "séquence de texte" : créée à la 1ère delta,
      //    fermée dès qu'un search_start arrive. Évite les avatars empilés vides.
      let botBubbleOpen = false;
      const ensureBotBubble = () => {
        if (botBubbleOpen) return;
        live = { ...live, log: [...live.log, { from: "bot", text: "" }] };
        setSession(live);
        botBubbleOpen = true;
      };
      const closeBotBubble = () => {
        botBubbleOpen = false;
      };

      const appendBotText = (delta: string) => {
        ensureBotBubble();
        const log = [...live.log];
        const last = log[log.length - 1];
        if (last && "from" in last && last.from === "bot") {
          log[log.length - 1] = { ...last, text: last.text + delta };
          live = { ...live, log };
          setSession(live);
        }
      };

      // 3. Recherche groupée : tant qu'aucun texte n'est venu interrompre,
      //    les search_start successifs sont fusionnés dans la même carte.
      let openResearchIdx: number | null = null;
      const dedupSources = (acc: Array<{ title: string; site: string; url: string }>, add: Array<{ title: string; site: string; url: string }>) => {
        const seen = new Set(acc.map((s) => s.url || s.title));
        return [...acc, ...add.filter((s) => !seen.has(s.url || s.title))];
      };

      const abortController = new AbortController();
      abortRef.current = abortController;

      try {
        const res = await fetch("/api/icp/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: live.id,
            messages: live.messages,
            panel: {}, // Le serveur gère son propre panel; on reçoit les patches en stream
            totalUsd: live.totalUsd || 0,
            searchCount: live.searchCount || 0,
            userMessage: text,
            scenario: live.iterateId || undefined,
          }),
          signal: abortController.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(`HTTP ${res.status}: ${await res.text()}`);
        }

        // 4. Parse SSE stream
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // Split par double newline (séparateur SSE)
          const chunks = buffer.split(/\n\n/);
          buffer = chunks.pop() || ""; // garde le dernier chunk incomplet

          for (const chunk of chunks) {
            if (!chunk.trim()) continue;
            const eventLine = chunk.split("\n").find((l) => l.startsWith("event:"));
            const dataLine = chunk.split("\n").find((l) => l.startsWith("data:"));
            if (!eventLine || !dataLine) continue;
            const eventType = eventLine.slice("event:".length).trim();
            let data: unknown;
            try {
              data = JSON.parse(dataLine.slice("data:".length).trim());
            } catch {
              continue;
            }
            handleEvent(eventType, data);
          }
        }
      } catch (err) {
        const message = (err as Error).message || String(err);
        const log: ChatEvent[] = [...live.log, { from: "bot", text: `\n\n⚠ Erreur : ${message}` }];
        live = { ...live, log };
        setSession(live);
      } finally {
        live = { ...live, awaiting: true };
        setSession(live);
        setBusy(false);
        abortRef.current = null;
      }

      // -------- inner: handles each SSE event --------
      function handleEvent(type: string, data: unknown) {
        switch (type) {
          case "text": {
            const d = data as { delta: string };
            if (d.delta) {
              // Une fois qu'on revoit du texte, la carte de recherche est close.
              openResearchIdx = null;
              appendBotText(d.delta);
            }
            break;
          }
          case "search_start": {
            const d = data as { query: string; reason: string; language: string };
            // Toute bulle bot en cours est fermée (texte continuera dans une nouvelle bulle après recherche).
            closeBotBubble();
            const stepText = d.query;
            if (openResearchIdx !== null) {
              // Append step à la carte ouverte
              const log = [...live.log];
              const ev = log[openResearchIdx];
              if (ev && "research" in ev) {
                log[openResearchIdx] = {
                  research: {
                    label: ev.research.label,
                    steps: [...ev.research.steps, stepText],
                    sources: ev.research.sources,
                  },
                };
                live = { ...live, log };
                setSession(live);
              }
            } else {
              const label = "Vérification des sources";
              const newLog: ChatEvent[] = [
                ...live.log,
                { research: { label, steps: [stepText], sources: [] } },
              ];
              openResearchIdx = newLog.length - 1;
              live = { ...live, log: newLog };
              setSession(live);
            }
            break;
          }
          case "search_result": {
            const r = data as { result: LlmSearchResult };
            const newSources = r.result.results
              .filter((s) => s.url && !s.url.startsWith("#"))
              .map((s) => ({ title: s.title, site: s.site, url: s.url }));
            // 1. Append à la carte de recherche en cours (si une est ouverte)
            if (openResearchIdx !== null) {
              const log = [...live.log];
              const ev = log[openResearchIdx];
              if (ev && "research" in ev) {
                log[openResearchIdx] = {
                  research: {
                    label: ev.research.label,
                    steps: ev.research.steps,
                    sources: dedupSources(ev.research.sources, newSources),
                  },
                };
                live = { ...live, log };
              }
            }
            // 2. Append à la collection globale de session (servira au doc final).
            const cumulative = dedupSources(live.allSources || [], newSources);
            live = { ...live, allSources: cumulative, searchCount: (live.searchCount || 0) + 1 };
            setSession(live);
            break;
          }
          case "panel_patch": {
            const patch = data as { patch: LlmPanelPatch };
            const existing = live.panel[patch.patch.section];
            const newSection = patchToSection(patch.patch, existing);
            const newPanel = { ...live.panel, [patch.patch.section]: newSection };
            live = { ...live, panel: newPanel };
            setSession(live);
            break;
          }
          case "finalize_signal": {
            const d = data as {
              segment_summary?: string;
              synthese?: string;
              doc?: Record<string, unknown>;
            };
            const doc = (d.doc || live.finalDoc || {}) as Partial<ICP>;
            // Réconcilie le panneau avec le document final : les sections
            // produites par finalize_icp (psychologie, marché...) sont marquées
            // "done" même si le LLM n'avait pas émis les update_panel_*
            // correspondants en cours de route. Le panneau reflète alors
            // fidèlement le doc juste avant la génération.
            const docAsIcp = {
              synthese: d.synthese || live.finalSynthese || "",
              identite: doc.identite,
              psychologie: doc.psychologie,
              marche: doc.marche,
              challenges: doc.challenges,
              avantages: doc.avantages,
            } as unknown as ICP;
            const reconciledPanel = { ...live.panel, ...panelFromIcp(docAsIcp) };
            live = {
              ...live,
              final: true,
              pendingQuick: ["Générer l'analyse"],
              panel: reconciledPanel,
              finalSegmentSummary: d.segment_summary || live.finalSegmentSummary,
              finalSynthese: d.synthese || live.finalSynthese,
              finalDoc: d.doc || live.finalDoc,
            };
            setSession(live);
            break;
          }
          case "cost": {
            const c = data as { sessionUsd: number };
            live = { ...live, totalUsd: c.sessionUsd };
            setSession(live);
            break;
          }
          case "state": {
            // Snapshot final du serveur pour persistence
            const s = data as {
              messages: SessionDraft["messages"];
              panel: SessionState_panel;
              totalUsd: number;
              searchCount: number;
              finalized: boolean;
            };
            live = {
              ...live,
              messages: s.messages,
              totalUsd: s.totalUsd,
              searchCount: s.searchCount,
              final: live.final || s.finalized,
            };
            setSession(live);
            break;
          }
          case "error": {
            const e = data as { code: string; message: string };
            // Erreurs "soft" (le tour s'est partiellement déroulé) : toast subtil,
            // on garde la réponse texte intacte côté chat. Erreurs hard : on l'ajoute en bulle.
            const softCodes = new Set([
              "max_tool_iterations",
              "tool_execution_error",
            ]);
            if (softCodes.has(e.code)) {
              toast(
                e.code === "max_tool_iterations"
                  ? "Le bot a enchaîné trop de recherches, sa réponse est partielle. Relance-le si besoin."
                  : `Outil interrompu : ${e.message}`,
                "info",
              );
            } else {
              const log: ChatEvent[] = [
                ...live.log,
                { from: "bot", text: `\n\n⚠ ${e.code} : ${e.message}` },
              ];
              live = { ...live, log };
              setSession(live);
            }
            break;
          }
          case "done": {
            // fin du stream
            break;
          }
        }
      }
    },
    [busy, setSession],
  );

  return { send, busy, abort, session };
}

// Type local pour le panel renvoyé en fin de stream
type SessionState_panel = Record<string, { bullets: string[]; confidence: string; sources: string[] }>;
