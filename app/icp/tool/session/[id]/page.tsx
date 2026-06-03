"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToolStore } from "@/lib/icp-tool/store";
import { FALLBACKS, RESEARCH_HINT, SCRIPT } from "@/lib/icp-tool/mock-data";
import type { ChatEvent, ICP, ICPSection, SessionDraft } from "@/lib/icp-tool/types";
import { toast } from "@/components/icp-tool/ui/ToastProvider";
import {
  BackIcon,
  PanelIcon,
  PauseIcon,
} from "@/components/icp-tool/ui/icons";
import { MessageBot } from "@/components/icp-tool/chat/MessageBot";
import { MessageUser } from "@/components/icp-tool/chat/MessageUser";
import { ResearchCard } from "@/components/icp-tool/chat/ResearchCard";
import { TypingIndicator } from "@/components/icp-tool/chat/TypingIndicator";
import { QuickReplies } from "@/components/icp-tool/chat/QuickReplies";
import { ChatInput } from "@/components/icp-tool/chat/ChatInput";
import { IcpPanel, PANEL_SECTIONS } from "@/components/icp-tool/chat/IcpPanel";

function freshSession(iterateId: string | null): SessionDraft {
  return {
    id: "sess_" + Date.now().toString(36),
    idx: 0,
    panel: {},
    log: [],
    awaiting: false,
    final: false,
    pendingQuick: null,
    iterateId,
    startedAt: Date.now(),
  };
}

function isResearch(e: ChatEvent): e is { research: { label: string; steps: string[]; sources: { title: string; site: string; url: string }[] } } {
  return "research" in e;
}

const TYPING_DELAY = 650;
const BETWEEN_BOT_GAP = 450;
const RESEARCH_DELAY = 3200;

export default function ChatSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const user = useToolStore((s) => s.auth);
  const session = useToolStore((s) => s.session);
  const setSession = useToolStore((s) => s.setSession);
  const upsertIcp = useToolStore((s) => s.upsertIcp);
  const icpById = useToolStore((s) => s.icpById);

  const [hydrated, setHydrated] = useState(false);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const streamRef = useRef<HTMLDivElement>(null);

  // Hydration + session init
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (id === "new" || !session || session.iterateId !== (id === "new" ? null : id && id.startsWith("icp_") ? id : null)) {
      const iter = id !== "new" && id.startsWith("icp_") ? id : null;
      setSession(freshSession(iter));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, id]);

  // Autoscroll on log changes
  useEffect(() => {
    const el = streamRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [session?.log, typing]);

  /* ---------- Chat engine ---------- */
  const advanceFrom = useCallback(
    (from: SessionDraft) => {
      let cancelled = false;
      let state = { ...from };

      async function run() {
        while (!cancelled) {
          const event = SCRIPT[state.idx];
          if (!event) {
            // End of script. Mark final if not already.
            state = { ...state, awaiting: true, final: true, pendingQuick: ["Générer l'analyse"] };
            setSession(state);
            setTyping(false);
            return;
          }
          if (isResearch(event)) {
            // Append research event; the ResearchCard component triggers onDone after animation.
            state = { ...state, log: [...state.log, event], idx: state.idx + 1 };
            setSession(state);
            await new Promise((r) => setTimeout(r, RESEARCH_DELAY));
            if (cancelled) return;
            continue;
          }
          if (event.from === "user") {
            // Wait for user input
            state = { ...state, awaiting: true };
            setSession(state);
            setTyping(false);
            return;
          }
          // bot event
          setTyping(true);
          await new Promise((r) => setTimeout(r, TYPING_DELAY));
          if (cancelled) return;
          setTyping(false);
          const panelNext: Record<string, ICPSection> = { ...state.panel };
          if (event.panel) {
            for (const k of Object.keys(event.panel)) {
              const p = event.panel[k];
              if (p) panelNext[k] = p;
            }
          }
          const isFinal = !!event.final;
          state = {
            ...state,
            log: [...state.log, event],
            idx: state.idx + 1,
            panel: panelNext,
            final: isFinal || state.final,
            pendingQuick: event.quick ?? null,
            awaiting: isFinal,
          };
          setSession(state);
          if (isFinal) return;
          await new Promise((r) => setTimeout(r, BETWEEN_BOT_GAP));
          if (cancelled) return;
        }
      }
      run();
      return () => {
        cancelled = true;
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Start autoplay when session is fresh
  useEffect(() => {
    if (!session) return;
    if (session.awaiting) return;
    if (session.log.length === 0 && session.idx === 0) {
      // Fresh session, kick off
      const cleanup = advanceFrom(session);
      return cleanup;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id]);

  const sendUser = useCallback(
    (text: string) => {
      if (!session) return;
      const value = text.trim();
      if (!value) return;
      // Advance past script's example user event if present.
      let nextIdx = session.idx;
      const nextEvt = SCRIPT[nextIdx];
      if (nextEvt && !isResearch(nextEvt) && nextEvt.from === "user") nextIdx++;
      const updated: SessionDraft = {
        ...session,
        log: [...session.log, { from: "user", text: value }],
        idx: nextIdx,
        awaiting: false,
        pendingQuick: null,
      };
      // If we're at the end of script, push a fallback bot reply.
      if (nextIdx >= SCRIPT.length) {
        const fb = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)] || FALLBACKS[0];
        setSession(updated);
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
          const u2: SessionDraft = {
            ...updated,
            log: [...updated.log, { from: "bot", text: fb }],
            awaiting: true,
          };
          setSession(u2);
        }, TYPING_DELAY);
        return;
      }
      setSession(updated);
      advanceFrom(updated);
    },
    [session, setSession, advanceFrom],
  );

  const onSubmit = () => {
    sendUser(draft);
    setDraft("");
  };

  const onPickQuick = (text: string) => {
    setDraft("");
    if (text.toLowerCase().includes("générer")) {
      onGenerate();
      return;
    }
    sendUser(text);
  };

  const onGenerate = useCallback(() => {
    if (!session) return;
    // For C.2 : create an ICP from session.panel, redirect to result (stub C.3).
    const id = "icp_" + Date.now().toString(36);
    const synthese = session.panel.synthese?.text || "ICP en cours de construction.";
    const baseSegment =
      session.panel.identite?.text?.slice(0, 80) ||
      session.panel.synthese?.text?.split(".")[0] ||
      "Nouvelle cible non-évidente";
    const icp: ICP = {
      id,
      segment: baseSegment.length > 80 ? baseSegment.slice(0, 80) + "…" : baseSegment,
      status: "final",
      version: 1,
      createdAt: new Date().toISOString().slice(0, 10),
      synthese,
    };
    upsertIcp(icp);
    setSession(null);
    toast("ICP généré. Document complet à venir (Sprint C.3).", "success");
    router.push(`/icp/tool/result/${id}`);
  }, [session, upsertIcp, setSession, router]);

  const onPause = () => {
    toast("Session sauvegardée. Vous pouvez la reprendre à tout moment.", "info");
    router.push("/icp/tool/dashboard");
  };

  // Render
  if (!hydrated || !session) {
    return null;
  }

  const iterateIcp = session.iterateId ? icpById(session.iterateId) : null;
  const title = iterateIcp ? `Itération · ${iterateIcp.segment}` : "Nouvelle session de discovery";

  return (
    <div className="chat-shell">
      <div className="chat-main">
        <div className="chat-top">
          <div className="chat-top__l">
            <Link href="/icp/tool/dashboard" className="iconbtn" aria-label="Retour au dashboard">
              <BackIcon />
            </Link>
            <div className="chat-top__title">
              {title}
              <span className="live">session en cours</span>
            </div>
          </div>
          <div className="chat-top__r">
            <span className="autosave">
              <span className="d" /> Sauvegardé
            </span>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={onPause}
              aria-label="Reprendre plus tard"
            >
              <PauseIcon /> Reprendre plus tard
            </button>
            <button
              type="button"
              className="iconbtn"
              onClick={() => setPanelOpen((v) => !v)}
              aria-label="ICP en construction"
            >
              <PanelIcon />
            </button>
          </div>
        </div>

        <div className="chat-stream" ref={streamRef}>
          <div className="chat-inner">
            {session.log.map((event, i) => {
              if (isResearch(event)) {
                return (
                  <ResearchCard
                    key={i}
                    label={event.research.label}
                    steps={event.research.steps}
                    sources={event.research.sources}
                  />
                );
              }
              if (event.from === "user") {
                return <MessageUser key={i} text={event.text} initials={user?.initials || "?"} />;
              }
              return <MessageBot key={i} text={event.text} sources={event.sources} />;
            })}
            {typing && <TypingIndicator />}
            {session.pendingQuick && session.pendingQuick.length > 0 && (
              <QuickReplies options={session.pendingQuick} onPick={onPickQuick} />
            )}
          </div>
        </div>

        <div className="chat-input">
          <ChatInput
            value={draft}
            onChange={setDraft}
            onSubmit={onSubmit}
            disabled={typing}
            placeholder={
              session.final
                ? "Posez une dernière question, ou cliquez « Générer l'analyse »…"
                : "Répondez à l'outil…"
            }
          />
          <p className="chat-hint">{RESEARCH_HINT}</p>
        </div>
      </div>
      <div className={panelOpen ? "" : "icp-panel--closed-mobile"}>
        <IcpPanel panel={session.panel} isFinal={session.final} onGenerate={onGenerate} />
      </div>
    </div>
  );
}
