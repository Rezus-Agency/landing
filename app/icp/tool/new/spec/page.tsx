"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToolStore } from "@/lib/icp-tool/store";
import { toast } from "@/components/icp-tool/ui/ToastProvider";
import {
  ArrowRightIcon,
  BackIcon,
  CheckIcon,
} from "@/components/icp-tool/ui/icons";

const STEPS = [
  {
    key: "vision",
    label: "Vision",
    title: "Qu'est-ce que vous vendez ?",
    lede: "En une phrase. Le produit, pas le pitch.",
    placeholder: "Ex. SIRH multi-sites pour PME industrielles",
  },
  {
    key: "target",
    label: "Cible",
    title: "À qui pensez-vous le vendre ?",
    lede: "Soyez précis : titre, taille de boîte, secteur, géographie.",
    placeholder:
      "Ex. Responsables RH de PME industrielles 100-250 salariés, multi-sites, en région",
  },
  {
    key: "problem",
    label: "Problème",
    title: "Quel problème vous résolvez ?",
    lede: "Le vrai problème ressenti par votre cible, pas une feature.",
    placeholder:
      "Ex. La conformité paie multi-site est un cauchemar avec les outils tertiaires standards",
  },
  {
    key: "differentiator",
    label: "Différenciation",
    title: "Qu'est-ce qui vous rend différent ?",
    lede: "Pas le pitch marketing. Ce que vos clients vous disent.",
    placeholder:
      "Ex. Le seul SIRH qui maîtrise vraiment les conventions complexes + support humain joignable",
  },
  {
    key: "gtm",
    label: "GTM",
    title: "Comment vous attaquez ce marché ?",
    lede: "Canaux, type d'outbound, ce qui marche aujourd'hui.",
    placeholder:
      "Ex. Cold email ciblé sur signaux secteur + LinkedIn outbound auprès des dirigeants régionaux",
  },
] as const;

export default function WizardPage() {
  const router = useRouter();
  const upsertIcp = useToolStore((s) => s.upsertIcp);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string>>({});

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const value = data[current.key] || "";

  const setValue = (v: string) => setData((d) => ({ ...d, [current.key]: v }));

  const next = () => {
    if (!isLast) {
      setStep(step + 1);
      return;
    }
    const id = "icp_" + Date.now().toString(36);
    upsertIcp({
      id,
      segment: data.target?.split(/[,.]/)[0]?.trim() || "Nouvelle cible à cadrer",
      status: "draft",
      version: 1,
      createdAt: new Date().toISOString().slice(0, 10),
      synthese:
        data.vision && data.target
          ? `${data.vision}. Cible visée : ${data.target}.${data.differentiator ? ` Différenciation : ${data.differentiator}.` : ""}`
          : "Brouillon créé depuis le wizard, à compléter.",
    });
    toast("Brouillon ICP créé. À enrichir au prochain passage.");
    router.push(`/icp/tool/result/${id}`);
  };

  return (
    <div className="main__inner">
      <div className="app-crumb">
        <Link href="/icp/tool/dashboard">Mes ICPs</Link>
        <ArrowRightIcon />
        <Link href="/icp/tool/new">Nouvelle session</Link>
        <ArrowRightIcon /> <span>Wizard</span>
      </div>

      <div className="wizard-shell">
        <div className="page-head" style={{ marginBottom: 4 }}>
          <div>
            <span className="kicker">Mode wizard · cadrage rapide</span>
            <h1 style={{ fontSize: 28 }}>Cadrez votre ICP en 5 étapes.</h1>
          </div>
        </div>

        <div className="wizard-steps" aria-label="Progression">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`wizard-steps__bar ${
                i < step ? "done" : i === step ? "active" : ""
              }`}
            />
          ))}
        </div>
        <div className="wizard-steps__labels">
          {STEPS.map((s, i) => (
            <span key={s.key} style={{ color: i <= step ? "var(--accent)" : undefined }}>
              {String(i + 1).padStart(2, "0")} {s.label}
            </span>
          ))}
        </div>

        <h2 className="wizard-step__title">{current.title}</h2>
        <p className="wizard-step__lede">{current.lede}</p>

        <div className="wizard-fields">
          <div className="icp-field">
            <label htmlFor="wz-input">Votre réponse</label>
            <textarea
              id="wz-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={current.placeholder}
              rows={4}
              autoFocus
            />
          </div>
        </div>

        <div className="wizard-nav">
          {step > 0 ? (
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => setStep(step - 1)}
            >
              <BackIcon /> Précédent
            </button>
          ) : (
            <Link href="/icp/tool/new" className="btn btn--secondary btn--sm">
              <BackIcon /> Annuler
            </Link>
          )}
          <button type="button" className="btn btn--primary" onClick={next}>
            {isLast ? (
              <>
                <CheckIcon /> Créer le brouillon
              </>
            ) : (
              <>
                Suivant <ArrowRightIcon />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
