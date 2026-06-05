"use client";

import { useState } from "react";
import Link from "next/link";
import { useToolStore } from "@/lib/icp-tool/store";
import { IcpCard } from "@/components/icp-tool/ui/IcpCard";
import { ComingSoonGrid } from "@/components/icp-tool/ui/ComingSoonGrid";
import { confirmModal } from "@/components/icp-tool/ui/ConfirmModal";
import { toast } from "@/components/icp-tool/ui/ToastProvider";
import { ArrowRightIcon, SparkIcon, XIcon } from "@/components/icp-tool/ui/icons";

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return "il y a quelques secondes";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.round(hours / 24);
  return `il y a ${days} j`;
}

function countUserTurns(
  messages: Array<{ role: "user" | "assistant"; content: unknown }> | undefined,
): number {
  if (!messages) return 0;
  let n = 0;
  for (const m of messages) {
    if (m.role !== "user") continue;
    // Filtre les messages qui ne contiennent QUE des tool_result (pas du vrai input user)
    if (Array.isArray(m.content)) {
      const blocks = m.content as Array<{ type?: string }>;
      const hasText = blocks.some((b) => b.type === "text");
      if (hasText) n += 1;
    } else {
      n += 1;
    }
  }
  return n;
}

export default function DashboardPage() {
  const user = useToolStore((s) => s.auth);
  const icps = useToolStore((s) => s.icps);
  const icpsLoaded = useToolStore((s) => s.icpsLoaded);
  const session = useToolStore((s) => s.session);
  const clearSession = useToolStore((s) => s.clearSession);
  const [mounted] = useState(true);

  if (!mounted) return null;

  const greet = new Date().getHours() < 18 ? "Bonjour" : "Bonsoir";
  const firstName = (user?.name || "").split(" ")[0];

  const resumable = session && !session.final;
  const resumeHref = resumable
    ? `/icp/tool/session/${session.iterateId || "resume"}`
    : "/icp/tool/new";
  const sessionTurns = resumable ? countUserTurns(session.messages) : 0;

  return (
    <div className="main__inner">
      <div className="page-head">
        <div>
          <span className="kicker">
            {greet}
            {firstName ? `, ${firstName}` : ""}
          </span>
          <h1>Mes ICPs</h1>
          {icps.length > 0 && (
            <p className="page-head__sub">
              {icps.length} analyse{icps.length > 1 ? "s" : ""} · une session = un ICP non-évident
            </p>
          )}
        </div>
        {icps.length > 0 && (
          <Link href="/icp/tool/new" className="btn btn--primary">
            <SparkIcon />
            Nouvelle session
          </Link>
        )}
      </div>

      {resumable && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "18px 22px",
            border: "1px solid var(--border-1, rgba(245, 178, 88, 0.25))",
            background:
              "linear-gradient(180deg, rgba(245,178,88,0.05) 0%, rgba(245,178,88,0.02) 100%)",
            borderRadius: 14,
            marginBottom: 28,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <span
              className="kicker"
              style={{ color: "var(--amber, #f5b258)", marginBottom: 4 }}
            >
              Session en cours
            </span>
            <h2
              style={{
                fontSize: 18,
                margin: 0,
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              Reprendre votre discovery
            </h2>
            <p
              style={{
                margin: "4px 0 0",
                color: "var(--text-3)",
                fontSize: 14,
              }}
            >
              {sessionTurns > 0
                ? `${sessionTurns} échange${sessionTurns > 1 ? "s" : ""}`
                : "Session démarrée"}
              {" · "}
              {formatRelative(session.startedAt)}
            </p>
          </div>
          <button
            type="button"
            className="iconbtn"
            onClick={async () => {
              const ok = await confirmModal({
                title: "Abandonner cette session ?",
                body: "Les échanges, le panel et les sources collectées seront perdus. Cette action est irréversible.",
                confirm: "Abandonner",
                cancel: "Garder la session",
                danger: true,
              });
              if (ok) {
                clearSession();
                toast("Session abandonnée.", "info");
              }
            }}
            aria-label="Abandonner la session"
            title="Abandonner"
            style={{ flexShrink: 0 }}
          >
            <XIcon />
          </button>
          <Link
            href={resumeHref}
            className="btn btn--primary"
            style={{ flexShrink: 0 }}
          >
            Reprendre <ArrowRightIcon />
          </Link>
        </div>
      )}

      {!icpsLoaded ? (
        <div className="icp-grid" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="icp-card"
              aria-hidden="true"
              style={{ opacity: 0.5, pointerEvents: "none", minHeight: 168 }}
            >
              <div className="icp-card__top">
                <span className="badge badge--draft" style={{ opacity: 0.4 }}>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              </div>
              <div
                className="icp-card__name"
                style={{ background: "rgba(255,255,255,0.06)", borderRadius: 6, height: 18, width: "70%" }}
              />
              <div
                className="icp-card__sum"
                style={{ background: "rgba(255,255,255,0.04)", borderRadius: 6, height: 36, marginTop: 10 }}
              />
            </div>
          ))}
        </div>
      ) : icps.length > 0 ? (
        <div className="icp-grid">
          {icps.map((icp) => (
            <IcpCard key={icp.id} icp={icp} />
          ))}
        </div>
      ) : (
        !resumable && (
          <div className="empty">
            <span className="empty__icon">
              <SparkIcon />
            </span>
            <h3>Définissez votre premier ICP</h3>
            <p>
              Pas un formulaire de plus : une session de discovery où l&apos;IA challenge votre
              cible et la confronte au marché réel.
            </p>
            <Link href="/icp/tool/new" className="btn btn--primary">
              <SparkIcon />
              Créer mon premier ICP
            </Link>
          </div>
        )
      )}

      <ComingSoonGrid />
    </div>
  );
}
