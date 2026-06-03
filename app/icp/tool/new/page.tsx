"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToolStore } from "@/lib/icp-tool/store";
import {
  ArrowRightIcon,
  ClockIcon,
  EditIcon,
  SparkIcon,
} from "@/components/icp-tool/ui/icons";

export default function NewSessionChoicePage() {
  const router = useRouter();
  const clearSession = useToolStore((s) => s.clearSession);
  const setSpec = useToolStore((s) => s.setSpec);

  const goChat = () => {
    clearSession();
    router.push("/icp/tool/session/new");
  };
  const goSpec = () => {
    setSpec({ step: 0, data: {} });
    router.push("/icp/tool/new/spec");
  };

  return (
    <div className="main__inner">
      <div className="app-crumb">
        <Link href="/icp/tool/dashboard">Mes ICPs</Link>
        <ArrowRightIcon /> <span>Nouvelle session</span>
      </div>

      <div className="page-head">
        <div>
          <span className="kicker">Nouvelle session</span>
          <h1>Comment voulez-vous procéder ?</h1>
          <p className="page-head__sub">
            Deux chemins, la même récompense : une analyse ICP complète et actionnable.
          </p>
        </div>
      </div>

      <div className="mode-grid">
        <button type="button" className="mode-card" onClick={goChat}>
          <span className="mode-card__rec">Recommandé</span>
          <span className="mode-card__ic">
            <SparkIcon />
          </span>
          <h3>Découvrir avec l&apos;IA</h3>
          <p>
            Une conversation qui challenge votre intuition, recherche le marché en temps réel et
            fait émerger un ICP non-évident. Idéal si votre cible n&apos;est pas encore
            parfaitement nette.
          </p>
          <span className="mode-card__time">
            <ClockIcon /> ~15 min · conversationnel
          </span>
          <span className="mode-card__go">
            Démarrer la discovery <ArrowRightIcon />
          </span>
        </button>

        <button type="button" className="mode-card" onClick={goSpec}>
          <span className="mode-card__ic">
            <EditIcon />
          </span>
          <h3>J&apos;ai déjà mon ICP</h3>
          <p>
            Un formulaire guidé en 5 étapes pour saisir directement ce que vous savez. Rapide et
            précis si votre cible est déjà claire, l&apos;analyse complète est générée à la fin.
          </p>
          <span className="mode-card__time">
            <EditIcon /> ~5 min · formulaire guidé
          </span>
          <span className="mode-card__go">
            Remplir le formulaire <ArrowRightIcon />
          </span>
        </button>
      </div>
    </div>
  );
}
