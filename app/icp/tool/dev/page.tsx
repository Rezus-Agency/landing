"use client";

/**
 * Page de DEV (jamais en prod) pour itérer sur le rendu de la page de résultat
 * sans lancer une vraie session LLM. Seed un ICP fixture dans le store et ouvre
 * la page voulue en un clic.
 *
 * Accès : http://localhost:3000/icp/tool/dev
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToolStore } from "@/lib/icp-tool/store";
import { DEV_FIXTURES } from "@/lib/icp-tool/fixtures";

const IS_DEV = process.env.NODE_ENV === "development";

export default function DevSeedPage() {
  const router = useRouter();
  const upsertIcp = useToolStore((s) => s.upsertIcp);
  const enableShare = useToolStore((s) => s.enableShare);
  const removeIcp = useToolStore((s) => s.removeIcp);
  const isAuthed = useToolStore((s) => s.isAuthed);
  const loginAsGuest = useToolStore((s) => s.loginAsGuest);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
    if (!isAuthed()) loginAsGuest();
  }, [isAuthed, loginAsGuest]);

  if (!IS_DEV) {
    return (
      <div className="main" style={{ overflowY: "auto", height: "100vh" }}>
        <div className="main__inner">
          <div className="empty" style={{ marginTop: 60 }}>
            <h3>Indisponible</h3>
            <p>Cette page de seed n&apos;existe qu&apos;en développement.</p>
          </div>
        </div>
      </div>
    );
  }

  const openResult = (key: string) => {
    const f = DEV_FIXTURES.find((x) => x.key === key);
    if (!f) return;
    upsertIcp(f.icp);
    router.push(`/icp/tool/result/${f.icp.id}`);
  };

  const openPublic = (key: string) => {
    const f = DEV_FIXTURES.find((x) => x.key === key);
    if (!f) return;
    upsertIcp(f.icp);
    const s = enableShare(f.icp.id);
    router.push(`/icp/public/${s.shareId}`);
  };

  const seedAll = () => DEV_FIXTURES.forEach((f) => upsertIcp(f.icp));
  const resetDev = () => DEV_FIXTURES.forEach((f) => removeIcp(f.icp.id));

  return (
    <div className="main" style={{ overflowY: "auto", height: "100vh" }}>
      <div className="main__inner" style={{ maxWidth: 760 }}>
        <h2 style={{ marginBottom: 4 }}>Dev · seed ICP</h2>
        <p style={{ color: "var(--text-2)", marginBottom: 24 }}>
          Injecte une fiche ICP de test dans le store et ouvre la page, sans session LLM.
        </p>

        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <button type="button" className="btn btn--secondary btn--sm" onClick={seedAll} disabled={!hydrated}>
            Tout seed (dashboard)
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => router.push("/icp/tool/dashboard")}>
            Voir le dashboard
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={resetDev} disabled={!hydrated}>
            Retirer les fixtures
          </button>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          {DEV_FIXTURES.map((f) => (
            <div
              key={f.key}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 16,
                display: "grid",
                gap: 8,
              }}
            >
              <div>
                <strong>{f.label}</strong>
                <div style={{ color: "var(--text-2)", fontSize: 13, marginTop: 2 }}>
                  {f.description}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => openResult(f.key)}
                  disabled={!hydrated}
                >
                  Seed → Résultat
                </button>
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  onClick={() => openPublic(f.key)}
                  disabled={!hydrated}
                >
                  Seed → Public
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
