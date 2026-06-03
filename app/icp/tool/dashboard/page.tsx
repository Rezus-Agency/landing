"use client";

import { useState } from "react";
import Link from "next/link";
import { useToolStore } from "@/lib/icp-tool/store";
import { IcpCard } from "@/components/icp-tool/ui/IcpCard";
import { SparkIcon } from "@/components/icp-tool/ui/icons";

export default function DashboardPage() {
  const user = useToolStore((s) => s.auth);
  const icps = useToolStore((s) => s.icps);
  const [mounted] = useState(true);

  if (!mounted) return null;

  const greet = new Date().getHours() < 18 ? "Bonjour" : "Bonsoir";
  const firstName = (user?.name || "").split(" ")[0];

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

      {icps.length > 0 ? (
        <div className="icp-grid">
          {icps.map((icp) => (
            <IcpCard key={icp.id} icp={icp} />
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );
}
