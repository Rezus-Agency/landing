"use client";

import { use } from "react";
import Link from "next/link";
import { useToolStore } from "@/lib/icp-tool/store";
import { LockIcon } from "@/components/icp-tool/ui/icons";

/**
 * Stub C.1 : le document ICP complet arrive en Sprint C.3.
 * Pour l'instant on affiche juste les meta de l'ICP en placeholder.
 */
export default function ResultStubPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const icp = useToolStore((s) => s.icps.find((i) => i.id === id));

  return (
    <div className="main__inner">
      <div className="page-head">
        <div>
          <span className="kicker">ICP</span>
          <h1>{icp?.segment || "ICP introuvable"}</h1>
          {icp?.synthese && (
            <p className="page-head__sub" style={{ maxWidth: "60ch" }}>
              {icp.synthese}
            </p>
          )}
        </div>
      </div>

      <div className="empty" style={{ marginTop: 24 }}>
        <span className="empty__icon">
          <LockIcon />
        </span>
        <h3>Document complet en C.3</h3>
        <p>
          La vue document avec sommaire, sections, filtres Sales Navigator et Clay copiables,
          et le lien public partageable arrivent au sprint C.3.
        </p>
        <Link href="/icp/tool/dashboard" className="btn btn--secondary" style={{ marginTop: 16 }}>
          Retour au dashboard
        </Link>
      </div>
    </div>
  );
}
