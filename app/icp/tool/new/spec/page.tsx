"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToolStore } from "@/lib/icp-tool/store";
import { toast } from "@/components/icp-tool/ui/ToastProvider";
import {
  ArrowRightIcon,
  BackIcon,
  SparkIcon,
} from "@/components/icp-tool/ui/icons";

type SpecData = {
  identite?: { industry?: string; size?: string; geo?: string; stage?: string };
  decideur?: { role?: string; seniority?: string; team?: string };
  pain?: { main?: string; triggers?: string[] };
  antifit?: { avoid?: string; signals?: string[] };
};

const STEPS = [
  { key: "identite", label: "Cible" },
  { key: "decideur", label: "Décideur" },
  { key: "pain", label: "Pain" },
  { key: "antifit", label: "Anti-fit" },
  { key: "review", label: "Validation" },
] as const;

const STEP_TITLES = ["Votre cible", "Le décideur", "Pain & déclencheurs", "Anti-fit", "Validation"];

const INDUSTRIES = [
  "SaaS B2B",
  "Fintech",
  "HR Tech",
  "Cybersécurité",
  "DevTools / Infra",
  "Industrie / Manufacturing",
  "Logistique",
  "Santé / BioTech",
  "Services pro",
  "Autre",
];
const GEOS = ["France", "France + régions", "Europe", "Monde"];
const STAGES = ["Seed", "Série A", "Série B+", "Rentable / bootstrap"];
const ROLES = [
  "CEO / Fondateur",
  "DRH / Responsable RH",
  "CTO / VP Eng",
  "VP Sales / CRO",
  "DAF / Finance",
  "Head of Growth",
  "COO / Ops",
];
const SENIORITIES = ["Fondateur", "C-level / VP", "Directeur / Head", "Manager"];
const TEAM_SIZES = ["1 – 5", "5 – 25", "25 – 100", "100+"];
const TRIGGERS = [
  "Levée de fonds",
  "Recrutement clé",
  "Nouvelle réglementation",
  "Expansion / nouveau site",
  "Changement de stack",
  "Croissance > 20%",
  "Audit / contrôle",
];
const SIGNALS = [
  "Trop petit",
  "B2C",
  "Pas de budget",
  "Cible non définie",
  "Recherche de volume pur",
  "Hors zone géo",
];

function setDeep(
  data: SpecData,
  group: keyof SpecData,
  field: string,
  value: string | string[],
): SpecData {
  return { ...data, [group]: { ...(data[group] || {}), [field]: value } };
}

function toggleMulti(current: string[] | undefined, value: string): string[] {
  const list = current ? [...current] : [];
  const i = list.indexOf(value);
  if (i >= 0) list.splice(i, 1);
  else list.push(value);
  return list;
}

export default function WizardPage() {
  const router = useRouter();
  const spec = useToolStore((s) => s.spec);
  const setSpec = useToolStore((s) => s.setSpec);
  const clearSpec = useToolStore((s) => s.clearSpec);
  const upsertIcp = useToolStore((s) => s.upsertIcp);

  const [hydrated, setHydrated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genStepIndex, setGenStepIndex] = useState(0);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!spec) setSpec({ step: 0, data: {} });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (!hydrated || !spec) return null;

  const step = spec.step || 0;
  const data = (spec.data as SpecData) || {};
  const isReview = step === STEPS.length - 1;
  const pct = (step / (STEPS.length - 1)) * 100;

  const update = (next: SpecData) => setSpec({ step, data: next });

  const goPrev = () => setSpec({ ...spec, step: Math.max(0, step - 1) });
  const goNext = () => {
    if (step < STEPS.length - 1) {
      setSpec({ ...spec, step: step + 1 });
    } else {
      runGenerate();
    }
  };

  const runGenerate = () => {
    setGenerating(true);
    const steps = [
      "Structuration des critères",
      "Analyse du marché ciblé",
      "Psychologie du décideur",
      "Filtres Sales Nav & Clay",
      "Hook angles & finalisation",
    ];
    let i = 0;
    const tick = () => {
      setGenStepIndex(i);
      i++;
      if (i < steps.length) setTimeout(tick, 520);
      else setTimeout(finishGen, 600);
    };
    tick();
  };

  const finishGen = () => {
    const id = "icp_" + Date.now().toString(36);
    const ind = data.identite?.industry || "B2B";
    const role = data.decideur?.role || "décideurs";
    const synthese = data.pain?.main
      ? `Cible : ${role} dans ${ind}${data.identite?.size ? ` (≤ ${data.identite.size} employés)` : ""}. ${data.pain.main}`
      : `Profil ${ind} ciblant des ${role}.`;
    upsertIcp({
      id,
      segment: `${role} · ${ind}`,
      status: "final",
      version: 1,
      createdAt: new Date().toISOString().slice(0, 10),
      synthese,
    });
    clearSpec();
    toast("Analyse générée");
    router.push(`/icp/tool/result/${id}`);
  };

  const GEN_STEPS = [
    "Structuration des critères",
    "Analyse du marché ciblé",
    "Psychologie du décideur",
    "Filtres Sales Nav & Clay",
    "Hook angles & finalisation",
  ];

  return (
    <div className="main__inner">
      <div className="app-crumb">
        <Link href="/icp/tool/dashboard">Mes ICPs</Link>
        <ArrowRightIcon /> <Link href="/icp/tool/new">Nouvelle session</Link>
        <ArrowRightIcon /> <span>Formulaire guidé</span>
      </div>

      <div className="wizard">
        <div className="wiz-top">
          <span className="kicker">Formulaire guidé</span>
          <span className="autosave">
            <span className="d" /> Sauvegardé
          </span>
        </div>

        <div className="wiz-progress">
          <div className="wiz-progress__bar">
            <div className="wiz-progress__fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="wiz-progress__steps">
            {STEPS.map((s, i) => (
              <div
                key={s.key}
                className={`wiz-progress__step ${i < step ? "done" : ""} ${i === step ? "current" : ""}`}
              >
                <b>{String(i + 1).padStart(2, "0")}</b>
                {s.label}
              </div>
            ))}
          </div>
        </div>

        <div className="wiz-card">
          {generating ? (
            <div className="wiz-gen">
              <div className="empty__icon">
                <SparkIcon />
              </div>
              <h2 style={{ marginBottom: 8 }}>Génération de votre analyse…</h2>
              <p className="wiz-card__hint">{GEN_STEPS[genStepIndex]}</p>
              <div className="wiz-progress__bar">
                <div
                  className="wiz-progress__fill"
                  style={{ width: `${((genStepIndex + 1) / GEN_STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <span className="wiz-card__num">
                ÉTAPE {step + 1} / {STEPS.length}
              </span>
              <h2>{STEP_TITLES[step]}</h2>
              <div className="wiz-fields">
                {step === 0 && (
                  <StepCible data={data} onChange={update} />
                )}
                {step === 1 && (
                  <StepDecideur data={data} onChange={update} />
                )}
                {step === 2 && <StepPain data={data} onChange={update} />}
                {step === 3 && <StepAntifit data={data} onChange={update} />}
                {step === 4 && (
                  <StepReview
                    data={data}
                    onGoTo={(targetStep) => setSpec({ ...spec, step: targetStep })}
                  />
                )}
              </div>
            </>
          )}
        </div>

        {!generating && (
          <div className="wiz-nav">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={goPrev}
              style={step === 0 ? { visibility: "hidden" } : undefined}
            >
              <BackIcon /> Précédent
            </button>
            <button type="button" className="btn btn--primary" onClick={goNext}>
              {isReview ? (
                <>
                  <SparkIcon /> Générer l&apos;analyse
                </>
              ) : (
                <>
                  Suivant <ArrowRightIcon />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== Steps ===== */

function StepCible({ data, onChange }: { data: SpecData; onChange: (d: SpecData) => void }) {
  const v = data.identite || {};
  const size = v.size || "200";
  return (
    <>
      <div className="icp-field">
        <label htmlFor="wz-ind">Industrie cible</label>
        <select
          id="wz-ind"
          value={v.industry || INDUSTRIES[0]}
          onChange={(e) => onChange(setDeep(data, "identite", "industry", e.target.value))}
        >
          {INDUSTRIES.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>
      <div className="icp-field">
        <label htmlFor="wz-size">Taille d&apos;entreprise visée (employés)</label>
        <div className="range-wrap">
          <input
            id="wz-size"
            type="range"
            min={10}
            max={1000}
            step={10}
            value={size}
            onChange={(e) => onChange(setDeep(data, "identite", "size", e.target.value))}
          />
          <span className="range-val">jusqu&apos;à {size} employés</span>
        </div>
      </div>
      <div className="wiz-row">
        <div className="icp-field">
          <label htmlFor="wz-geo">Géographie</label>
          <select
            id="wz-geo"
            value={v.geo || GEOS[0]}
            onChange={(e) => onChange(setDeep(data, "identite", "geo", e.target.value))}
          >
            {GEOS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="icp-field">
          <label htmlFor="wz-stage">Stade</label>
          <select
            id="wz-stage"
            value={v.stage || STAGES[0]}
            onChange={(e) => onChange(setDeep(data, "identite", "stage", e.target.value))}
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

function StepDecideur({ data, onChange }: { data: SpecData; onChange: (d: SpecData) => void }) {
  const v = data.decideur || {};
  return (
    <>
      <div className="icp-field">
        <label>Rôle du décideur</label>
        <div className="chips">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              className={`chip ${v.role === r ? "sel" : ""}`}
              onClick={() => onChange(setDeep(data, "decideur", "role", r))}
            >
              {r}
            </button>
          ))}
        </div>
        <span className="wiz-card__hint">Le décideur économique principal.</span>
      </div>
      <div className="wiz-row">
        <div className="icp-field">
          <label htmlFor="wz-sen">Séniorité</label>
          <select
            id="wz-sen"
            value={v.seniority || SENIORITIES[1]}
            onChange={(e) => onChange(setDeep(data, "decideur", "seniority", e.target.value))}
          >
            {SENIORITIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="icp-field">
          <label htmlFor="wz-team">Taille d&apos;équipe gérée</label>
          <select
            id="wz-team"
            value={v.team || TEAM_SIZES[1]}
            onChange={(e) => onChange(setDeep(data, "decideur", "team", e.target.value))}
          >
            {TEAM_SIZES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

function StepPain({ data, onChange }: { data: SpecData; onChange: (d: SpecData) => void }) {
  const v = data.pain || {};
  return (
    <>
      <div className="icp-field">
        <label htmlFor="wz-pain">Pain principal résolu</label>
        <textarea
          id="wz-pain"
          value={v.main || ""}
          onChange={(e) => onChange(setDeep(data, "pain", "main", e.target.value))}
          placeholder="Quelle douleur précise votre produit fait-il disparaître ?"
        />
      </div>
      <div className="icp-field">
        <label>Événements déclencheurs</label>
        <div className="chips">
          {TRIGGERS.map((t) => {
            const sel = (v.triggers || []).includes(t);
            return (
              <button
                key={t}
                type="button"
                className={`chip ${sel ? "sel" : ""}`}
                onClick={() => onChange(setDeep(data, "pain", "triggers", toggleMulti(v.triggers, t)))}
              >
                {t}
              </button>
            );
          })}
        </div>
        <span className="wiz-card__hint">Plusieurs choix possibles.</span>
      </div>
    </>
  );
}

function StepAntifit({ data, onChange }: { data: SpecData; onChange: (d: SpecData) => void }) {
  const v = data.antifit || {};
  return (
    <>
      <div className="icp-field">
        <label htmlFor="wz-avoid">Clients à éviter</label>
        <textarea
          id="wz-avoid"
          value={v.avoid || ""}
          onChange={(e) => onChange(setDeep(data, "antifit", "avoid", e.target.value))}
          placeholder="Quels profils vous font perdre votre temps ?"
        />
      </div>
      <div className="icp-field">
        <label>Signaux disqualifiants</label>
        <div className="chips">
          {SIGNALS.map((s) => {
            const sel = (v.signals || []).includes(s);
            return (
              <button
                key={s}
                type="button"
                className={`chip ${sel ? "sel" : ""}`}
                onClick={() => onChange(setDeep(data, "antifit", "signals", toggleMulti(v.signals, s)))}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

function StepReview({
  data,
  onGoTo,
}: {
  data: SpecData;
  onGoTo: (step: number) => void;
}) {
  const rows: { k: string; v: string; goto: number }[] = [
    { k: "Industrie", v: data.identite?.industry || "—", goto: 0 },
    { k: "Taille", v: data.identite?.size ? `≤ ${data.identite.size} employés` : "—", goto: 0 },
    { k: "Géographie", v: data.identite?.geo || "—", goto: 0 },
    { k: "Décideur", v: data.decideur?.role || "—", goto: 1 },
    { k: "Pain", v: data.pain?.main || "—", goto: 2 },
    { k: "Triggers", v: (data.pain?.triggers || []).join(", ") || "—", goto: 2 },
    { k: "Anti-fit", v: data.antifit?.avoid || "—", goto: 3 },
    { k: "Signaux exclus", v: (data.antifit?.signals || []).join(", ") || "—", goto: 3 },
  ];
  return (
    <>
      <p className="wiz-card__hint" style={{ marginBottom: 18 }}>
        Vérifiez votre profil. L&apos;IA enrichira ensuite avec l&apos;analyse de marché, la
        psychologie du décideur et les outputs.
      </p>
      <dl className="recap">
        {rows.map((r, i) => (
          <div key={i} className="recap-row">
            <dt>{r.k}</dt>
            <dd>{r.v}</dd>
            <button type="button" className="edit" onClick={() => onGoTo(r.goto)}>
              modifier
            </button>
          </div>
        ))}
      </dl>
    </>
  );
}
