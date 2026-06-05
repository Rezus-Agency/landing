"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToolStore } from "@/lib/icp-tool/store";
import { toast } from "@/components/icp-tool/ui/ToastProvider";
import {
  ArrowRightIcon,
  BackIcon,
  ChartIcon,
  PdfIcon,
  PlugIcon,
  ShareIcon,
  SparkIcon,
  TargetIcon,
  UserIcon,
} from "@/components/icp-tool/ui/icons";
import {
  ConfLegend,
  DocKeyFacts,
  SectionAngles,
  SectionAntifit,
  SectionAvantages,
  SectionChallenges,
  SectionIdentite,
  SectionMarche,
  SectionPsyBrief,
  SectionPsyProfil,
  SectionReframe,
  SectionRezusCTA,
  SectionScorecard,
  SectionSources,
  SectionSynthese,
  SectionTargeting,
  SectionTriggers,
} from "@/components/icp-tool/doc/DocSections";
import { ShareDialog } from "@/components/icp-tool/doc/ShareDialog";
import { ClayExportDialog } from "@/components/icp-tool/doc/ClayExportDialog";
import type { ICP } from "@/lib/icp-tool/types";

const MONTHS = [
  "jan", "fév", "mar", "avr", "mai", "juin",
  "juil", "août", "sep", "oct", "nov", "déc",
];

function fmtDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** 3 pages, alignées sur le workflow outbound : Stratégie, Message, Ciblage. */
const GROUPS: {
  id: string;
  label: string;
  icon: React.ReactNode;
  render: (icp: ICP) => React.ReactNode;
}[] = [
  {
    id: "strategie",
    label: "Stratégie",
    icon: <ChartIcon />,
    render: (icp) => (
      <>
        <DocKeyFacts doc={icp} />
        <SectionSynthese doc={icp} />
        <ConfLegend />
        <SectionReframe doc={icp} />
        <SectionPsyProfil doc={icp} />
        <SectionMarche doc={icp} />
        <SectionChallenges doc={icp} />
        <SectionAvantages doc={icp} />
      </>
    ),
  },
  {
    id: "message",
    label: "Message",
    icon: <UserIcon />,
    render: (icp) => (
      <>
        <SectionIdentite doc={icp} />
        <SectionPsyBrief doc={icp} />
        <SectionAngles doc={icp} />
      </>
    ),
  },
  {
    id: "ciblage",
    label: "Ciblage",
    icon: <TargetIcon />,
    render: (icp) => (
      <>
        <SectionTargeting doc={icp} />
        <SectionTriggers doc={icp} />
        <SectionAntifit doc={icp} />
        <SectionScorecard doc={icp} />
        <SectionSources doc={icp} />
      </>
    ),
  },
];

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  // On sélectionne l'ICP directement (référence du tableau) pour re-render
  // quand l'hydratation DB le fait apparaître.
  const icp = useToolStore((s) => s.icps.find((i) => i.id === id));
  const icpsLoaded = useToolStore((s) => s.icpsLoaded);
  const clearSession = useToolStore((s) => s.clearSession);

  const [hydrated, setHydrated] = useState(false);
  const [pageIdx, setPageIdx] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [clayOpen, setClayOpen] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Scroll au top quand on change de page
  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageIdx]);

  if (!hydrated) return null;

  // Chargement DB en cours : on attend plutôt que d'afficher "introuvable".
  if (!icp && !icpsLoaded) {
    return (
      <div className="main" style={{ overflowY: "auto", height: "100vh" }}>
        <div className="main__inner">
          <div className="empty" style={{ marginTop: 60 }} aria-busy="true">
            <span className="empty__icon">
              <ChartIcon />
            </span>
            <h3>Chargement de l&apos;analyse…</h3>
          </div>
        </div>
      </div>
    );
  }

  if (!icp) {
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

  const onIterate = () => {
    clearSession();
    router.push(`/icp/tool/session/${icp.id}`);
  };

  const onPdf = async () => {
    if (!icp || generatingPdf) return;
    setGeneratingPdf(true);
    try {
      const [{ pdf }, { IcpPdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/icp-tool/doc/IcpPdf"),
      ]);
      const blob = await pdf(<IcpPdf icp={icp} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const slug =
        (icp.segment || "icp")
          .normalize("NFD")
          .replace(/[̀-ͯ]/g, "")
          .replace(/[^a-zA-Z0-9-_]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 60) || "icp";
      a.download = `Rezus-ICP-${slug}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast("PDF téléchargé.", "success");
    } catch (err) {
      toast(
        `Erreur PDF : ${(err as Error).message || "génération échouée"}`,
        "error",
      );
    } finally {
      setGeneratingPdf(false);
    }
  };

  const goTo = (i: number) => setPageIdx(Math.max(0, Math.min(GROUPS.length - 1, i)));

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
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={() => setClayOpen(true)}
              >
                <PlugIcon /> Table Clay
              </button>
              <button
                type="button"
                className="btn btn--primary btn--sm"
                onClick={onPdf}
                disabled={generatingPdf}
                aria-busy={generatingPdf}
              >
                <PdfIcon />
                {generatingPdf ? "Génération…" : "Exporter PDF"}
              </button>
            </div>
          </div>

          {/* Le hero (segment + meta) n'apparaît que sur la 1re page */}
          {pageIdx === 0 && (
            <div className="doc-hero">
              <div className="doc-hero__meta">
                {icp.status === "final" ? (
                  <span className="badge badge--final">Finalisé</span>
                ) : (
                  <span className="badge badge--draft">Brouillon</span>
                )}
                <span className="mono">v{icp.version}</span>
                <span className="mono">· généré le {fmtDate(icp.createdAt)}</span>
              </div>
              <h1>
                Votre ICP, <span className="seg">{icp.segment}</span>
              </h1>
            </div>
          )}

          {GROUPS.map((g, i) => (
            <div key={g.id} className={`doc-page ${i === pageIdx ? "show" : ""}`}>
              {g.render(icp)}
            </div>
          ))}

          <SectionRezusCTA />

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
      <ClayExportDialog icp={icp} open={clayOpen} onClose={() => setClayOpen(false)} />
    </div>
  );
}
