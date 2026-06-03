"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToolStore } from "@/lib/icp-tool/store";
import {
  ArrowRightIcon,
  BrainIcon,
  SparkIcon,
  TargetIcon,
} from "@/components/icp-tool/ui/icons";

export default function NewSessionChoicePage() {
  const router = useRouter();
  const clearSession = useToolStore((s) => s.clearSession);
  const clearSpec = useToolStore((s) => s.clearSpec);

  const goChat = () => {
    clearSession();
    router.push("/icp/tool/session/new");
  };
  const goWizard = () => {
    clearSpec();
    router.push("/icp/tool/new/spec");
  };

  return (
    <div className="main__inner">
      <div className="app-crumb">
        <Link href="/icp/tool/dashboard">Mes ICPs</Link>
        <ArrowRightIcon /> <span>Nouvelle session</span>
      </div>

      <div className="page-head" style={{ marginBottom: 6 }}>
        <div>
          <span className="kicker">Nouvelle session</span>
          <h1>Par où voulez-vous démarrer ?</h1>
          <p className="page-head__sub" style={{ maxWidth: "60ch" }}>
            Vous pouvez parler à l&apos;outil comme à un consultant, ou remplir un formulaire
            guidé.
          </p>
        </div>
      </div>

      <div className="mode-grid">
        <button type="button" className="mode-card mode-card--recommended" onClick={goChat}>
          <span className="mode-card__tag">Recommandé</span>
          <span className="mode-card__ic">
            <BrainIcon />
          </span>
          <h2>Mode chatbot</h2>
          <p>
            Une vraie conversation où l&apos;outil challenge votre intuition, recherche en
            direct, et construit l&apos;ICP avec vous. C&apos;est là que les ICP non-évidents
            sortent.
          </p>
          <span className="mode-card__time">15 à 30 min · session interactive</span>
          <span className="mode-card__cta">
            Démarrer la session <ArrowRightIcon />
          </span>
        </button>

        <button type="button" className="mode-card" onClick={goWizard}>
          <span className="mode-card__ic">
            <TargetIcon />
          </span>
          <h2>Mode wizard</h2>
          <p>
            Un formulaire guidé en 5 étapes pour cadrer votre cible plus rapidement. Moins de
            challenge, plus de structure. À privilégier si vous avez déjà une intuition forte à
            documenter.
          </p>
          <span className="mode-card__time">5 à 10 min · formulaire structuré</span>
          <span className="mode-card__cta">
            Ouvrir le wizard <ArrowRightIcon />
          </span>
        </button>
      </div>

      <p
        style={{
          marginTop: 32,
          color: "var(--text-faint)",
          fontFamily: "var(--font-mono)",
          fontSize: 11.5,
          letterSpacing: "0.06em",
          textAlign: "center",
        }}
      >
        <SparkIcon
          width={12}
          height={12}
          style={{ verticalAlign: "middle", marginRight: 6 }}
        />
        ICP discovery. Pas ICP validation.
      </p>
    </div>
  );
}
