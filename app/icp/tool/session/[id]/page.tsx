"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToolStore } from "@/lib/icp-tool/store";
import type { ChatEvent, SessionDraft } from "@/lib/icp-tool/types";
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
import { IcpPanel } from "@/components/icp-tool/chat/IcpPanel";
import { useChatStream } from "@/components/icp-tool/chat/useChatStream";

/**
 * Message d'intro envoyé d'office au démarrage de chaque session.
 * Synchronisé avec INTRO_MESSAGE dans lib/llm-core/agent/orchestrator.ts
 * (le serveur le ré-inscrit dans state.messages à chaque tour).
 */
const INTRO_MESSAGE = `Salut. On va définir ton ICP ensemble. Voilà la règle du jeu :

1. **Je vais challenger ta cible**, pas la valider. Si tu me dis "je cible les CTO B2B" je vais te répondre "comme la moitié du marché, qu'est-ce qui te différencie ?"
2. **Je vais faire des recherches en direct** pour étayer mes claims. Tu verras les sources s'afficher au fur et à mesure.
3. **Je vais te proposer mes hypothèses** avant de te poser des questions. Si tu ne sais pas, dis-le, je creuserai à ta place.
4. **L'objectif** : sortir un ICP non-évident, défendable et exécutable en 10 à 15 tours, pas plus.

Pour démarrer : **qu'est-ce que tu vends, et à qui tu penses le vendre aujourd'hui ?**`;

function freshSession(iterateId: string | null): SessionDraft {
  return {
    id: "sess_" + Date.now().toString(36),
    idx: 0,
    panel: {},
    log: [{ from: "bot", text: INTRO_MESSAGE }],
    awaiting: true,
    final: false,
    pendingQuick: null,
    iterateId,
    startedAt: Date.now(),
    messages: [{ role: "assistant", content: [{ type: "text", text: INTRO_MESSAGE }] }],
    totalUsd: 0,
    searchCount: 0,
  };
}

function isResearch(e: ChatEvent): e is {
  research: { label: string; steps: string[]; sources: { title: string; site: string; url: string }[] };
} {
  return "research" in e;
}

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
  const [draft, setDraft] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const streamRef = useRef<HTMLDivElement>(null);

  const { send, busy } = useChatStream();

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Init / resume session
  useEffect(() => {
    if (!hydrated) return;
    const iter = id !== "new" && id.startsWith("icp_") ? id : null;
    const needsFresh =
      id === "new" ||
      !session ||
      session.iterateId !== iter ||
      // session legacy sans messages array : on reset
      !session.messages;
    if (needsFresh) {
      setSession(freshSession(iter));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, id]);

  // Autoscroll
  useEffect(() => {
    const el = streamRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [session?.log, busy]);

  const onSubmit = () => {
    const text = draft.trim();
    if (!text || busy) return;
    setDraft("");
    void send(text);
  };

  const onPickQuick = (text: string) => {
    if (busy) return;
    if (text.toLowerCase().includes("générer")) {
      onGenerate();
      return;
    }
    void send(text);
  };

  const onGenerate = () => {
    if (!session) return;
    const id = "icp_" + Date.now().toString(36);
    const syntheseText = session.panel.synthese?.text || "ICP en cours de construction.";
    const baseSegment =
      session.panel.identite?.text?.slice(0, 80) ||
      session.panel.synthese?.text?.split("\n")[0]?.replace(/^•\s*/, "").slice(0, 80) ||
      "Nouvelle cible non-évidente";
    upsertIcp({
      id,
      segment: baseSegment.length > 80 ? baseSegment.slice(0, 80) + "…" : baseSegment,
      status: "final",
      version: 1,
      createdAt: new Date().toISOString().slice(0, 10),
      synthese: syntheseText.replace(/^•\s*/gm, "").replace(/\n/g, " ").slice(0, 400),
    });
    setSession(null);
    toast("ICP généré. Document complet à venir (Sprint C.3).", "success");
    router.push(`/icp/tool/result/${id}`);
  };

  const onPause = () => {
    toast("Session sauvegardée. Vous pouvez la reprendre à tout moment.", "info");
    router.push("/icp/tool/dashboard");
  };

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
              <span className="live">
                {busy ? "en cours" : "session prête"}
                {typeof session.totalUsd === "number" && session.totalUsd > 0 && (
                  <span style={{ marginLeft: 8, opacity: 0.7 }}>
                    · ${session.totalUsd.toFixed(3)}
                  </span>
                )}
              </span>
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
                return (
                  <MessageUser key={i} text={event.text} initials={user?.initials || "?"} />
                );
              }
              return <MessageBot key={i} text={event.text} sources={event.sources} />;
            })}
            {busy && <TypingIndicator />}
            {!busy && session.pendingQuick && session.pendingQuick.length > 0 && (
              <QuickReplies options={session.pendingQuick} onPick={onPickQuick} />
            )}
          </div>
        </div>

        <div className="chat-input">
          <ChatInput
            value={draft}
            onChange={setDraft}
            onSubmit={onSubmit}
            disabled={busy}
            placeholder={
              session.final
                ? "Pose une dernière question, ou clique « Générer l'analyse »…"
                : busy
                  ? "Le bot rédige…"
                  : "Ta réponse…"
            }
          />
          <p className="chat-hint">
            {busy
              ? "Recherche en cours, lecture des sources, structuration de la réponse…"
              : "L'IA challenge ton intuition et confronte tes claims à des sources web réelles."}
          </p>
        </div>
      </div>
      <div className={panelOpen ? "" : "icp-panel--closed-mobile"}>
        <IcpPanel panel={session.panel} isFinal={session.final} onGenerate={onGenerate} />
      </div>
    </div>
  );
}
