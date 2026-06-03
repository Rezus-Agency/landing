"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToolStore } from "@/lib/icp-tool/store";
import { getDoc } from "@/lib/icp-tool/mock-data";
import { toast } from "@/components/icp-tool/ui/ToastProvider";
import {
  ArrowRightIcon,
  BackIcon,
  BoltIcon,
  ChartIcon,
  PdfIcon,
  ShareIcon,
  SparkIcon,
  UserIcon,
} from "@/components/icp-tool/ui/icons";
import {
  SectionAvantages,
  SectionChallenges,
  SectionIdentite,
  SectionMarche,
  SectionOutputs,
  SectionPsychologie,
  SectionRezusCTA,
  SectionSynthese,
} from "@/components/icp-tool/doc/DocSections";
import { ShareDialog } from "@/components/icp-tool/doc/ShareDialog";

const MONTHS = [
  "jan",
  "fév",
  "mar",
  "avr",
  "mai",
  "juin",
  "juil",
  "août",
  "sep",
  "oct",
  "nov",
  "déc",
];

function fmtDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** 3 groupes de sections, naviguables via TOC + pager (port du source). */
const GROUPS = [
  {
    id: "profil",
    label: "Profil & décideur",
    icon: <UserIcon />,
    secs: ["synthese", "identite", "psychologie"] as const,
  },
  {
    id: "marche",
    label: "Marché & positionnement",
    icon: <ChartIcon />,
    secs: ["marche", "challenges", "avantages"] as const,
  },
  {
    id: "action",
    label: "Plan d'action",
    icon: <BoltIcon />,
    secs: ["outputs"] as const,
  },
];

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const icpById = useToolStore((s) => s.icpById);
  const clearSession = useToolStore((s) => s.clearSession);

  const [hydrated, setHydrated] = useState(false);
  const [pageIdx, setPageIdx] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Scroll to top when switching page
  useEffect(() => {
    scrollerRef.current?.scrollTo(0, 0);
  }, [pageIdx]);

  if (!hydrated) return null;

  const icp = icpById(id);
  const doc = getDoc(icp);

  if (!icp && id !== "icp_hrtech_founders") {
    return (
      <div className="main" style={{ overflowY: "auto", height: "100vh" }}>
        <div className="main__inner">
          <div className="empty" style={{ marginTop: 60 }}>
            <span className="empty__icon">
              <PdfIcon />
            </span>
            <h3>Analyse introuvable</h3>
            <p>Cet ICP n&apos;existe pas ou a été supprimé.</p>
            <Link href="/icp/tool/dashboard" className="btn btn--primary">
              Retour au dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const SECTION_BY_KEY: Record<string, React.ReactNode> = {
    synthese: <SectionSynthese doc={doc} />,
    identite: <SectionIdentite doc={doc} />,
    psychologie: <SectionPsychologie doc={doc} />,
    marche: <SectionMarche doc={doc} />,
    challenges: <SectionChallenges doc={doc} />,
    avantages: <SectionAvantages doc={doc} />,
    outputs: <SectionOutputs doc={doc} />,
  };

  const goTo = (i: number) => setPageIdx(Math.max(0, Math.min(GROUPS.length - 1, i)));

  const onIterate = () => {
    clearSession();
    router.push(`/icp/tool/session/${id}`);
  };

  const onPdf = () => {
    toast("Génération du PDF (simulée)…", "info");
    setTimeout(() => toast("PDF prêt. Export de démo, vrai export à venir."), 1300);
  };

  return (
    <div
      className="main"
      id="main"
      ref={scrollerRef}
      style={{ overflowY: "auto", height: "100vh" }}
    >
      <div className="doc-wrap doc-tabbed">
        <nav className="doc-nav" aria-label="Sommaire">
          <span className="doc-nav__lbl">Sommaire</span>
          {GROUPS.map((g, i) => (
            <button
              key={g.id}
              type="button"
              className={i === pageIdx ? "active" : ""}
              onClick={() => goTo(i)}
            >
              <span className="doc-nav__ic">{g.icon}</span>
              <span className="doc-nav__t">{g.label}</span>
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </nav>

        <div className="doc-body">
          <div className="doc-topbar">
            <div className="doc-topbar__l">
              <Link
                className="iconbtn"
                href="/icp/tool/dashboard"
                aria-label="Retour au dashboard"
              >
                <BackIcon />
              </Link>
              <span className="autosave">
                <span className="d" /> Sauvegardé
              </span>
            </div>
            <div className="doc-actions">
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={onIterate}
              >
                <SparkIcon /> Continuer à itérer
              </button>
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={() => setShareOpen(true)}
              >
                <ShareIcon /> Partager
              </button>
              <button type="button" className="btn btn--primary btn--sm" onClick={onPdf}>
                <PdfIcon /> Exporter PDF
              </button>
            </div>
          </div>

          <div className="doc-hero">
            <div className="doc-hero__meta">
              {doc.status === "final" ? (
                <span className="badge badge--final">Finalisé</span>
              ) : (
                <span className="badge badge--draft">Brouillon</span>
              )}
              <span className="mono">v{doc.version}</span>
              <span className="mono">· généré le {fmtDate(doc.createdAt)}</span>
            </div>
            <h1>
              Votre ICP, <span className="seg">{doc.segment}</span>
            </h1>
          </div>

          {GROUPS.map((g, i) => (
            <div key={g.id} className={`doc-page ${i === pageIdx ? "show" : ""}`}>
              {g.secs.map((sec) => (
                <div key={sec}>{SECTION_BY_KEY[sec]}</div>
              ))}
              <SectionRezusCTA />
            </div>
          ))}

          <div className="doc-pager">
            <button
              type="button"
              className="doc-pager__btn"
              onClick={() => goTo(pageIdx - 1)}
              disabled={pageIdx === 0}
            >
              <BackIcon />
              <span>{pageIdx > 0 ? GROUPS[pageIdx - 1].label : ""}</span>
            </button>
            <span className="doc-pager__pos">
              {pageIdx + 1} / {GROUPS.length} · {GROUPS[pageIdx].label}
            </span>
            <button
              type="button"
              className="doc-pager__btn doc-pager__btn--next"
              onClick={() => goTo(pageIdx + 1)}
              disabled={pageIdx === GROUPS.length - 1}
            >
              <span>
                {pageIdx < GROUPS.length - 1 ? GROUPS[pageIdx + 1].label : ""}
              </span>
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>

      <ShareDialog
        icpId={id}
        open={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </div>
  );
}
