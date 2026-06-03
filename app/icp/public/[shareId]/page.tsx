"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useToolStore } from "@/lib/icp-tool/store";
import { getDoc } from "@/lib/icp-tool/mock-data";
import {
  ArrowRightIcon,
  BoltIcon,
  BrainIcon,
  ChartIcon,
  Doc2Icon,
  LockIcon,
  TargetIcon,
  UserIcon,
  Warn2Icon,
} from "@/components/icp-tool/ui/icons";
import {
  SectionAvantages,
  SectionChallenges,
  SectionIdentite,
  SectionMarche,
  SectionOutputs,
  SectionPsychologie,
  SectionSynthese,
} from "@/components/icp-tool/doc/DocSections";

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

const NAV: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: "synthese", label: "Synthèse", icon: <Doc2Icon /> },
  { id: "identite", label: "Identité", icon: <UserIcon /> },
  { id: "psychologie", label: "Psychologie", icon: <BrainIcon /> },
  { id: "marche", label: "Marché", icon: <ChartIcon /> },
  { id: "challenges", label: "Risques", icon: <Warn2Icon /> },
  { id: "avantages", label: "Avantages", icon: <TargetIcon /> },
  { id: "outputs", label: "Outputs", icon: <BoltIcon /> },
];

export default function PublicSharePage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = use(params);
  const [hydrated, setHydrated] = useState(false);
  const icpByShareId = useToolStore((s) => s.icpByShareId);
  const [activeId, setActiveId] = useState<string>("synthese");

  useEffect(() => {
    setHydrated(true);
    document.documentElement.classList.add("pub-body");
    document.body.classList.add("pub-body");
    return () => {
      document.documentElement.classList.remove("pub-body");
      document.body.classList.remove("pub-body");
    };
  }, []);

  // Scroll-spy
  useEffect(() => {
    if (!hydrated) return;
    function onScroll() {
      const top = window.scrollY + 90;
      let cur = NAV[0].id;
      for (const n of NAV) {
        const el = document.getElementById(`sec-${n.id}`);
        if (el && el.offsetTop <= top) cur = n.id;
      }
      setActiveId(cur);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hydrated]);

  if (!hydrated) return null;

  const icp = icpByShareId(shareId);

  if (!icp) {
    return (
      <div className="pub">
        <div className="pub-top">
          <span className="pub-top__brand">
            <span className="logo__mark">Rezus</span>
          </span>
        </div>
        <div
          style={{
            maxWidth: 520,
            margin: "80px auto",
            textAlign: "center",
            padding: "0 24px",
          }}
        >
          <div className="empty__icon" style={{ margin: "0 auto 18px" }}>
            <LockIcon />
          </div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 750,
              letterSpacing: "-0.02em",
            }}
          >
            Lien indisponible
          </h1>
          <p style={{ color: "var(--text-3)", marginTop: 10, lineHeight: 1.55 }}>
            Ce lien de partage n&apos;existe pas ou a été désactivé par son auteur.
          </p>
          <Link href="/signup" className="btn btn--primary" style={{ marginTop: 22 }}>
            Créer mon propre ICP
          </Link>
        </div>
      </div>
    );
  }

  const doc = getDoc(icp);

  return (
    <div className="pub">
      <div className="pub-top">
        <span className="pub-top__brand">
          <span className="logo__mark">Rezus</span>
          <span className="via">· ICP créé via Rezus Agency</span>
        </span>
        <Link href="/signup" className="btn btn--secondary btn--sm">
          Créer le mien
        </Link>
      </div>

      <div className="doc-wrap" style={{ paddingTop: 36 }}>
        <nav className="doc-nav" aria-label="Sommaire">
          <span className="doc-nav__lbl">Sommaire</span>
          {NAV.map((n, i) => (
            <a
              key={n.id}
              href={`#sec-${n.id}`}
              className={activeId === n.id ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(`sec-${n.id}`)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              <span className="doc-nav__ic">{n.icon}</span>
              <span className="doc-nav__t">{n.label}</span>
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
            </a>
          ))}
        </nav>

        <div className="doc-body">
          <div className="doc-hero">
            <div className="doc-hero__meta">
              <span className="badge badge--final">Analyse ICP</span>
              <span className="mono">v{doc.version}</span>
              <span className="mono">· {fmtDate(doc.createdAt)}</span>
            </div>
            <h1>
              ICP, <span className="seg">{doc.segment}</span>
            </h1>
          </div>

          <SectionSynthese doc={doc} publicView />
          <SectionIdentite doc={doc} publicView />
          <SectionPsychologie doc={doc} publicView />
          <SectionMarche doc={doc} publicView />
          <SectionChallenges doc={doc} publicView />
          <SectionAvantages doc={doc} publicView />
          <SectionOutputs doc={doc} publicView />
        </div>
      </div>

      <div className="pub-cta">
        <h2>Et vous, c&apos;est qui votre client idéal ?</h2>
        <p>
          Cette analyse a été produite en une session avec l&apos;outil ICP Discovery de Rezus
          Agency. Faites la vôtre, gratuitement, en 15 minutes.
        </p>
        <Link href="/signup" className="btn btn--primary">
          Créer mon ICP gratuitement <ArrowRightIcon />
        </Link>
      </div>

      <div className="pub-watermark">Rezus Agency · ICP Discovery</div>
    </div>
  );
}
