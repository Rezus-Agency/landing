"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToolStore } from "@/lib/icp-tool/store";
import type { ChatEvent, ICP, SessionDraft } from "@/lib/icp-tool/types";
import { icpToContextMarkdown, panelFromIcp } from "@/lib/icp-tool/icp-summary";
import { toast } from "@/components/icp-tool/ui/ToastProvider";
import {
  BackIcon,
  PanelIcon,
  PauseIcon,
  SparkIcon,
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

const GEN_STEPS = [
  "Structuration de la cible",
  "Cartographie du marché",
  "Psychologie du décideur",
  "Filtres Sales Nav & Clay",
  "Hook angles & finalisation",
];

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

/**
 * Session d'itération : pré-amorcée avec l'ICP existant. Le panel reprend l'état
 * de l'ICP (sidebar non vide), et les messages LLM contiennent le doc complet en
 * contexte (le modèle sait sur quoi il itère, il n'a pas à repartir de zéro).
 */
function iterateSession(icp: ICP): SessionDraft {
  const intro = `On reprend ton ICP **${icp.segment}**. J'ai tout le contexte en tête : cible, psychologie, marché, angles, ciblage. Dis-moi ce que tu veux **affiner ou challenger** (la cible, le positionnement, un angle, les filtres...) et on le fait évoluer. Quand tu es prêt, on régénère l'analyse.`;
  const context = icpToContextMarkdown(icp);
  return {
    id: "sess_" + Date.now().toString(36),
    idx: 0,
    log: [{ from: "bot", text: intro }],
    awaiting: true,
    final: false,
    pendingQuick: null,
    iterateId: icp.id,
    startedAt: Date.now(),
    panel: panelFromIcp(icp),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Voici l'ICP qu'on a déjà produit ensemble et que je veux ITÉRER (l'affiner, pas le régénérer de zéro). Garde tout ce qui n'est pas remis en cause, et quand je demande la génération, ré-émets le document complet avec mes changements intégrés.\n\n${context}`,
          },
        ],
      },
      { role: "assistant", content: [{ type: "text", text: intro }] },
    ],
    totalUsd: 0,
    searchCount: 0,
  };
}

function isResearch(e: ChatEvent): e is {
  research: { label: string; steps: string[]; sources: { title: string; site: string; url: string }[] };
} {
  return "research" in e;
}

/** Coupe une chaîne à `max` chars sans casser un mot, suffixe par "…" si tronqué. */
function truncateAtWord(s: string, max: number): string {
  const clean = (s || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut) + "…";
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
  const sessionLoaded = useToolStore((s) => s.sessionLoaded);
  const icpsLoaded = useToolStore((s) => s.icpsLoaded);
  const setSession = useToolStore((s) => s.setSession);
  const clearSession = useToolStore((s) => s.clearSession);
  const upsertIcp = useToolStore((s) => s.upsertIcp);
  const icpById = useToolStore((s) => s.icpById);

  const [hydrated, setHydrated] = useState(false);
  const [draft, setDraft] = useState("");
  // Ouvert par défaut sur grand écran, replié sur mobile (slide-in à la demande).
  const [panelOpen, setPanelOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth > 1080,
  );
  const [generating, setGenerating] = useState(false);
  const [genStepIndex, setGenStepIndex] = useState(0);
  const streamRef = useRef<HTMLDivElement>(null);

  const { send, busy } = useChatStream();

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Init / resume session
  useEffect(() => {
    if (!hydrated) return;
    // Pour une reprise ("resume") ou une itération (id = un ICP), on attend que
    // la session ouverte ET les ICP soient chargés depuis la DB, sinon on
    // recréerait une session neuve par erreur. "new" n'attend pas.
    if (id !== "new" && (!sessionLoaded || !icpsLoaded)) return;
    const iter = id !== "new" && id !== "resume" ? id : null;
    const base = iter ? icpById(iter) : null;

    if (base) {
      // Itération : il FAUT une session amorcée pour cet ICP (contexte en
      // messages[0] role user). Sinon (session absente, autre ICP, ou vieille
      // session générique) on (re)crée la session d'itération.
      const properlySeeded =
        !!session &&
        session.iterateId === base.id &&
        session.messages?.[0]?.role === "user";
      if (!properlySeeded) setSession(iterateSession(base));
    } else {
      // Discovery neuve ("new") ou reprise d'une session existante ("resume").
      const needsFresh =
        id === "new" ||
        !session ||
        !session.messages ||
        session.iterateId !== (iter || null);
      if (needsFresh) setSession(freshSession(iter));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, id, sessionLoaded, icpsLoaded]);

  // Autoscroll : déclenché à l'hydratation (reprise) + à chaque nouveau message.
  // Double rAF pour attendre que le layout des bulles soit calculé avant de scroller.
  // On utilise .length plutôt que la ref array pour stabiliser les deps (HMR-safe).
  const logLength = session?.log?.length ?? 0;
  useEffect(() => {
    if (!hydrated) return;
    const el = streamRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    });
  }, [hydrated, session?.id, logLength, busy]);

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
    if (!session || generating) return;
    setGenerating(true);
    setGenStepIndex(0);

    // Anim séquentielle des steps (port du wiz-gen du formulaire guidé)
    let i = 0;
    const tick = () => {
      setGenStepIndex(i);
      i++;
      if (i < GEN_STEPS.length) setTimeout(tick, 520);
      else setTimeout(finishGenerate, 700);
    };
    tick();
  };

  const finishGenerate = () => {
    if (!session) return;
    // Itération : nouvelle entrée (non destructive), version incrémentée depuis l'ICP source.
    const base = session.iterateId ? icpById(session.iterateId) : null;
    const id = "icp_" + Date.now().toString(36);
    const version = base ? base.version + 1 : 1;

    // Segment (titre du doc) : segment_summary produit par finalize_icp.
    // Fallback : le segment de l'ICP itéré, le bullet n°1 de panel.synthese, ou défaut.
    const rawSegment =
      session.finalSegmentSummary ||
      base?.segment ||
      (session.panel.synthese?.text || "")
        .split("\n")[0]
        ?.replace(/^•\s*/, "")
        .trim() ||
      "Nouvelle cible non-évidente";
    const segment = truncateAtWord(rawSegment, 78);

    // Synthèse prose : produite par finalize_icp.synthese (paragraphe rédigé
    // par le LLM lui-même). Pas de flatten de bullets ici, c'est de la prose.
    const synthese =
      session.finalSynthese?.trim() ||
      "Synthèse non générée. Reprends la session et termine par 'on peut générer l'analyse' pour que le bot produise la prose finale.";

    // Document final structuré produit par finalize_icp. On sploat les
    // champs riches au top-level de l'ICP pour matcher le type ICP existant.
    const doc = session.finalDoc || {};
    upsertIcp({
      id,
      segment,
      status: "final",
      version,
      createdAt: new Date().toISOString().slice(0, 10),
      synthese,
      panel: { ...session.panel },
      sources: session.allSources ? [...session.allSources] : [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      identite: (doc as any).identite,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      psychologie: (doc as any).psychologie,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      marche: (doc as any).marche,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      challenges: (doc as any).challenges,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      avantages: (doc as any).avantages,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      salesnav: (doc as any).salesnav,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      clay: (doc as any).clay,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      qualification: (doc as any).qualification,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      hooks: (doc as any).hooks,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reframe: (doc as any).reframe,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      angles: (doc as any).angles,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      triggers: (doc as any).triggers,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      enrichment: (doc as any).enrichment,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      antifit: (doc as any).antifit,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      scorecard: (doc as any).scorecard,
    });
    // La session est consommée : on la supprime (store + DB).
    clearSession();
    toast("Analyse générée.", "success");
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
    <div className={`chat-shell${panelOpen ? "" : " chat-shell--panel-closed"}`}>
      <div className="chat-main">
        <div className="chat-top">
          <div className="chat-top__l">
            <Link href="/icp/tool/dashboard" className="iconbtn" aria-label="Retour au dashboard">
              <BackIcon />
            </Link>
            <div className="chat-top__title">
              {title}
              <span className="live">{busy ? "en cours" : "session prête"}</span>
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
              className={`iconbtn${panelOpen ? " is-active" : ""}`}
              onClick={() => setPanelOpen((v) => !v)}
              aria-label={panelOpen ? "Masquer l'ICP en construction" : "Afficher l'ICP en construction"}
              aria-pressed={panelOpen}
              title="ICP en construction"
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
              // Skip empty bot bubbles : évite l'avatar "R" vide pendant un tour
              // où le bot a déjà ouvert une bulle mais pas encore streamé de texte
              // (ex : tour qui démarre par un tool_use sans préambule).
              if (!event.text || !event.text.trim()) return null;
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
            disabled={busy || generating}
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
      <IcpPanel
        panel={session.panel}
        isFinal={session.final}
        onGenerate={onGenerate}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
      />
      {/* Scrim mobile : ferme le panneau en cliquant à côté */}
      {panelOpen && (
        <div
          className="icp-panel__scrim"
          onClick={() => setPanelOpen(false)}
          aria-hidden="true"
        />
      )}

      {generating && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(13, 11, 9, 0.92)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="wiz-gen"
            style={{
              maxWidth: 520,
              width: "100%",
              padding: "48px 32px",
              textAlign: "center",
            }}
          >
            <div className="empty__icon" style={{ margin: "0 auto 24px" }}>
              <SparkIcon />
            </div>
            <h2 style={{ marginBottom: 8 }}>Génération de votre analyse…</h2>
            <p className="wiz-card__hint" style={{ marginBottom: 24 }}>
              {GEN_STEPS[genStepIndex]}
            </p>
            <div className="wiz-progress__bar">
              <div
                className="wiz-progress__fill"
                style={{ width: `${((genStepIndex + 1) / GEN_STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
