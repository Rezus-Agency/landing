"use client";

import { use } from "react";
import Link from "next/link";
import { useToolStore } from "@/lib/icp-tool/store";
import { COMING_SOON } from "@/lib/icp-tool/features";
import { toast } from "@/components/icp-tool/ui/ToastProvider";
import {
  ArrowRightIcon,
  CheckIcon,
  ICON_MAP,
  LockIcon,
  SparkIcon,
} from "@/components/icp-tool/ui/icons";

export default function ComingSoonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const feature = COMING_SOON.find((f) => f.id === id);
  const user = useToolStore((s) => s.auth);
  const isNotified = useToolStore((s) => s.isNotified(id));
  const toggleNotify = useToolStore((s) => s.toggleNotify);

  if (!feature) {
    return (
      <div className="main__inner">
        <div className="empty">
          <h3>Feature inconnue</h3>
          <Link href="/icp/tool/dashboard" className="btn btn--secondary">
            Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  const Icon = ICON_MAP[feature.icon] || LockIcon;

  const onToggle = () => {
    const on = toggleNotify(id);
    toast(on ? "Parfait, on vous prévient au lancement." : "Notification annulée.", "info");
  };

  return (
    <div className="main__inner">
      <div className="app-crumb">
        <Link href="/icp/tool/dashboard">Mes ICPs</Link>
        <ArrowRightIcon /> <span>Bientôt disponible</span>
      </div>

      <div className="notify-wrap">
        <span className="empty__icon">
          <Icon />
        </span>
        <span
          className="soon-card__notify"
          style={{ marginBottom: 14, display: "inline-flex" }}
          aria-hidden="true"
        >
          <LockIcon /> Coming soon
        </span>
        <h1 style={{ fontSize: 30, fontWeight: 760, letterSpacing: "-0.03em" }}>
          {feature.title}
        </h1>
        <p
          style={{
            color: "var(--text-2)",
            marginTop: 12,
            lineHeight: 1.6,
            fontSize: 16,
          }}
        >
          {feature.desc}
        </p>
        <p
          style={{
            color: "var(--text-3)",
            marginTop: 18,
            fontSize: 14.5,
          }}
        >
          On vous prévient à{" "}
          <b style={{ color: "var(--text-2)" }}>{user?.email || "votre email"}</b> dès que
          c&apos;est prêt.
        </p>
        <button
          type="button"
          className={`btn ${isNotified ? "btn--secondary" : "btn--primary"}`}
          style={{ marginTop: 22 }}
          onClick={onToggle}
        >
          {isNotified ? (
            <>
              <CheckIcon /> Vous serez notifié
            </>
          ) : (
            <>
              <SparkIcon /> Me notifier au lancement
            </>
          )}
        </button>
        {isNotified && (
          <p style={{ marginTop: 12, fontSize: 13, color: "var(--text-3)" }}>
            Vous ne voulez plus ?{" "}
            <button
              type="button"
              onClick={onToggle}
              style={{
                color: "var(--text-2)",
                borderBottom: "1px solid var(--border-strong)",
                fontSize: 13,
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              Annuler la notification
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
