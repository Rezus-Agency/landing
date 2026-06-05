"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToolStore } from "@/lib/icp-tool/store";
import { toast } from "@/components/icp-tool/ui/ToastProvider";
import { icpFromDoc } from "@/lib/icp-tool/icp-from-doc";
import { ArrowRightIcon, BackIcon, SparkIcon } from "@/components/icp-tool/ui/icons";

type SpecData = {
  offre?: { what?: string; differentiation?: string };
  cible?: { industry?: string; sizeMin?: string; sizeMax?: string; geo?: string; stage?: string };
  decideur?: { role?: string; seniority?: string };
  pain?: { main?: string; triggers?: string[] };
  antifit?: { avoid?: string; signals?: string[] };
};

type Issue = { field: string; message: string };

const STEPS = [
  { key: "offre", label: "Offre" },
  { key: "cible", label: "Cible" },
  { key: "decideur", label: "Décideur" },
  { key: "pain", label: "Pain" },
  { key: "antifit", label: "Anti-fit" },
  { key: "review", label: "Validation" },
] as const;

const STEP_TITLES = [
  "Ton offre",
  "Ta cible",
  "Le décideur",
  "Pain & déclencheurs",
  "Anti-fit",
  "Validation",
];

/** Champ requis par étape (clé "group.field"). Le reste est optionnel. */
const REQUIRED: Record<number, string[]> = {
  0: ["offre.what"],
  1: ["cible.industry"],
  2: ["decideur.role"],
  3: ["pain.main"],
  4: [],
};

const INDUSTRY_SUGGESTIONS = [
  "SaaS B2B",
  "Industrie / Manufacturing",
  "BTP / Construction",
  "Services professionnels",
  "Cabinet conseil / comptable",
  "Santé / BioTech",
  "Logistique / Transport",
  "Commerce / Retail",
  "Agence / Studio créatif",
  "Immobilier",
  "Fintech",
  "HR Tech",
  "Cybersécurité",
  "DevTools / Infra",
];
const GEO_SUGGESTIONS = [
  "France",
  "France + DOM-TOM",
  "Île-de-France",
  "Grandes métropoles françaises",
  "France + Benelux",
  "Europe francophone (FR/BE/CH/LU)",
  "Europe",
  "Amérique du Nord",
  "International / Monde",
];
const STAGE_SUGGESTIONS = [
  "Amorçage / pré-seed",
  "Seed",
  "Série A",
  "Série B+",
  "Rentable / bootstrap",
  "PME établie",
  "ETI / grand groupe",
];
const ROLE_SUGGESTIONS = [
  "Fondateur / CEO",
  "DAF / RAF (Finance)",
  "DRH / Responsable RH",
  "CTO / VP Engineering",
  "VP Sales / CRO",
  "COO / Directeur des opérations",
  "Directeur de studio / d'agence",
  "Directeur d'usine / de site",
  "Office / Operations Manager",
  "Responsable achats",
];
const SENIORITIES = ["Fondateur / dirigeant", "C-level / VP", "Directeur / Head", "Manager", "Opérationnel"];
const TRIGGERS = [
  "Levée de fonds",
  "Recrutement clé",
  "Nouvelle réglementation",
  "Expansion / nouveau site",
  "Changement de stack / d'outil",
  "Forte croissance",
  "Audit / contrôle",
  "Nouveau dirigeant",
  "Fusion / acquisition",
  "Fin de contrat fournisseur",
];
const SIGNALS = [
  "Trop petit",
  "B2C",
  "Pas de budget",
  "Cible non définie",
  "Recherche de volume pur",
  "Hors zone géo",
  "Secteur non pertinent",
  "Mono-produit / mono-projet",
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

function getField(data: SpecData, key: string): unknown {
  const [g, f] = key.split(".");
  return (data as Record<string, Record<string, unknown>>)[g]?.[f];
}

function stepOfField(key: string): number {
  const g = key.split(".")[0];
  return ["offre", "cible", "decideur", "pain", "antifit"].indexOf(g);
}

const GEN_STEPS = [
  "Lecture de ta saisie",
  "Analyse du marché ciblé",
  "Psychologie du décideur",
  "Filtres Sales Nav & Clay",
  "Angles & finalisation",
];

export default function WizardPage() {
  const router = useRouter();
  const spec = useToolStore((s) => s.spec);
  const setSpec = useToolStore((s) => s.setSpec);
  const clearSpec = useToolStore((s) => s.clearSpec);
  const upsertIcp = useToolStore((s) => s.upsertIcp);

  const [hydrated, setHydrated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genStepIndex, setGenStepIndex] = useState(0);
  const [genError, setGenError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [issues, setIssues] = useState<Issue[]>([]);
  const genTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!spec) {
      setSpec({
        step: 0,
        data: {
          cible: { geo: GEO_SUGGESTIONS[0], stage: STAGE_SUGGESTIONS[5] },
          decideur: { seniority: SENIORITIES[1] },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  useEffect(
    () => () => {
      if (genTimer.current) clearInterval(genTimer.current);
    },
    [],
  );

  if (!hydrated || !spec) return null;

  const step = spec.step || 0;
  const data = (spec.data as SpecData) || {};
  const isReview = step === STEPS.length - 1;
  const pct = (step / (STEPS.length - 1)) * 100;

  const update = (next: SpecData) => {
    setSpec({ step, data: next });
    if (Object.keys(errors).length) setErrors({});
    if (issues.length) setIssues([]);
  };

  const goTo = (target: number) => {
    setErrors({});
    setSpec({ ...spec, step: target });
  };
  const goPrev = () => goTo(Math.max(0, step - 1));

  /** Valide les champs requis de l'étape courante avant d'avancer. */
  const validateCurrent = (): boolean => {
    const missing: Record<string, boolean> = {};
    for (const key of REQUIRED[step] || []) {
      const v = getField(data, key);
      if (!v || (typeof v === "string" && !v.trim())) missing[key] = true;
    }
    setErrors(missing);
    if (Object.keys(missing).length > 0) {
      toast("Complète le champ requis avant de continuer.", "error");
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (!validateCurrent()) return;
    if (step < STEPS.length - 1) setSpec({ ...spec, step: step + 1 });
    else void runGenerate();
  };

  const runGenerate = async () => {
    setGenError(null);
    setIssues([]);
    setGenerating(true);
    setGenStepIndex(0);
    genTimer.current = setInterval(() => {
      setGenStepIndex((i) => Math.min(i + 1, GEN_STEPS.length - 1));
    }, 4500);

    const stopTimer = () => {
      if (genTimer.current) clearInterval(genTimer.current);
    };

    try {
      const res = await fetch("/api/icp/spec-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });

      if (res.status === 422) {
        const e = (await res.json().catch(() => ({}))) as { issues?: Issue[] };
        stopTimer();
        setGenerating(false);
        if (e.issues && e.issues.length) {
          setIssues(e.issues);
          const firstStep = stepOfField(e.issues[0].field);
          if (firstStep >= 0) setSpec({ ...spec, step: firstStep });
          toast("Précise quelques réponses pour une analyse de qualité.", "info");
        } else {
          setGenError("Saisie insuffisante pour générer.");
        }
        return;
      }
      if (!res.ok) {
        const e = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(e.error || `Erreur ${res.status}`);
      }

      const out = (await res.json()) as {
        doc: Record<string, unknown>;
        segmentSummary?: string;
        synthese?: string;
        sources?: { title: string; site: string; url: string }[];
      };
      const fallback = `${data.decideur?.role || "Décideurs"} · ${data.cible?.industry || "B2B"}`;
      const icp = icpFromDoc({
        doc: out.doc,
        segmentSummary: out.segmentSummary,
        synthese: out.synthese,
        sources: out.sources,
        fallbackSegment: fallback,
      });
      upsertIcp(icp);
      clearSpec();
      toast("Analyse générée.", "success");
      router.push(`/icp/tool/result/${icp.id}`);
    } catch (err) {
      stopTimer();
      setGenerating(false);
      setGenError((err as Error).message || "Génération échouée.");
      toast("Génération échouée. Réessaie.", "error");
    }
  };

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
              <p className="wiz-card__hint" style={{ marginTop: 14, opacity: 0.7 }}>
                L&apos;IA croise ta saisie avec une recherche marché en temps réel, puis rédige
                l&apos;analyse complète. Compte 1 à 2 minutes.
              </p>
            </div>
          ) : (
            <>
              <span className="wiz-card__num">
                ÉTAPE {step + 1} / {STEPS.length}
              </span>
              <h2>{STEP_TITLES[step]}</h2>

              {issues.length > 0 && (
                <div className="wiz-issues" role="alert">
                  <p className="wiz-issues__title">
                    À préciser pour une analyse de qualité :
                  </p>
                  <ul>
                    {issues.map((iss, i) => (
                      <li key={i}>
                        <span>{iss.message}</span>
                        <button type="button" onClick={() => goTo(stepOfField(iss.field))}>
                          corriger
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="wiz-fields">
                {step === 0 && <StepOffre data={data} onChange={update} errors={errors} />}
                {step === 1 && <StepCible data={data} onChange={update} errors={errors} />}
                {step === 2 && <StepDecideur data={data} onChange={update} errors={errors} />}
                {step === 3 && <StepPain data={data} onChange={update} errors={errors} />}
                {step === 4 && <StepAntifit data={data} onChange={update} />}
                {step === 5 && <StepReview data={data} onGoTo={goTo} />}
              </div>
              {genError && (
                <p className="icp-field__err" style={{ marginTop: 14 }}>
                  {genError}
                </p>
              )}
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

/* ===== UI helpers ===== */

function ReqMark() {
  return <span style={{ color: "var(--accent, #d99543)" }}> *</span>;
}
function OptMark() {
  return <span className="opt"> (optionnel)</span>;
}

/** Chips multi-sélection avec ajout libre ("Autre…"). */
function MultiChips({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: string[];
  value: string[] | undefined;
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const list = value || [];
  const custom = list.filter((v) => !options.includes(v));
  const addCustom = () => {
    const t = draft.trim();
    if (t && !list.includes(t)) onChange([...list, t]);
    setDraft("");
  };
  return (
    <>
      <div className="chips">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            className={`chip ${list.includes(o) ? "sel" : ""}`}
            onClick={() => onChange(toggleMulti(list, o))}
          >
            {o}
          </button>
        ))}
        {custom.map((c) => (
          <button
            key={c}
            type="button"
            className="chip sel"
            onClick={() => onChange(toggleMulti(list, c))}
            title="Retirer"
          >
            {c} ✕
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
          placeholder={placeholder || "Autre…"}
        />
        <button type="button" className="btn btn--secondary btn--sm" onClick={addCustom}>
          Ajouter
        </button>
      </div>
    </>
  );
}

/* ===== Steps ===== */

function StepOffre({
  data,
  onChange,
  errors,
}: {
  data: SpecData;
  onChange: (d: SpecData) => void;
  errors: Record<string, boolean>;
}) {
  const v = data.offre || {};
  return (
    <>
      <div className={`icp-field ${errors["offre.what"] ? "invalid" : ""}`}>
        <label htmlFor="wz-what">
          Que vends-tu ?<ReqMark />
        </label>
        <textarea
          id="wz-what"
          value={v.what || ""}
          onChange={(e) => onChange(setDeep(data, "offre", "what", e.target.value))}
          placeholder="Ex. Un logiciel de notes de frais offline pour le BTP, qui ventile les dépenses par chantier."
        />
        {errors["offre.what"] && <p className="icp-field__err">Indispensable pour générer.</p>}
        <span className="wiz-card__hint">
          Plus tu es précis et concret, meilleure sera l&apos;analyse. Pas envie d&apos;écrire ?{" "}
          <Link href="/icp/tool/session/new">Passe par le chat</Link>, plus naturel.
        </span>
      </div>
      <div className="icp-field">
        <label htmlFor="wz-diff">
          Ta différence vs les alternatives<OptMark />
        </label>
        <textarea
          id="wz-diff"
          value={v.differentiation || ""}
          onChange={(e) => onChange(setDeep(data, "offre", "differentiation", e.target.value))}
          placeholder="Pourquoi on te choisit toi plutôt qu'un concurrent ou le statu quo (Excel, fait-maison...) ?"
        />
      </div>
    </>
  );
}

function StepCible({
  data,
  onChange,
  errors,
}: {
  data: SpecData;
  onChange: (d: SpecData) => void;
  errors: Record<string, boolean>;
}) {
  const v = data.cible || {};
  return (
    <>
      <div className={`icp-field ${errors["cible.industry"] ? "invalid" : ""}`}>
        <label htmlFor="wz-ind">
          Secteur / vertical visé<ReqMark />
        </label>
        <input
          id="wz-ind"
          list="wz-ind-list"
          value={v.industry || ""}
          onChange={(e) => onChange(setDeep(data, "cible", "industry", e.target.value))}
          placeholder="Tape ton secteur (texte libre, suggestions proposées)"
          autoComplete="off"
        />
        <datalist id="wz-ind-list">
          {INDUSTRY_SUGGESTIONS.map((i) => (
            <option key={i} value={i} />
          ))}
        </datalist>
        {errors["cible.industry"] && <p className="icp-field__err">Indique au moins un secteur.</p>}
      </div>
      <div className="icp-field">
        <label>
          Taille d&apos;entreprise visée (employés)<OptMark />
        </label>
        <div className="wiz-row">
          <input
            type="number"
            min={1}
            value={v.sizeMin || ""}
            onChange={(e) => onChange(setDeep(data, "cible", "sizeMin", e.target.value))}
            placeholder="min (ex. 50)"
            aria-label="Taille minimum"
          />
          <input
            type="number"
            min={1}
            value={v.sizeMax || ""}
            onChange={(e) => onChange(setDeep(data, "cible", "sizeMax", e.target.value))}
            placeholder="max (ex. 200)"
            aria-label="Taille maximum"
          />
        </div>
      </div>
      <div className="wiz-row">
        <div className="icp-field">
          <label htmlFor="wz-geo">
            Géographie<OptMark />
          </label>
          <input
            id="wz-geo"
            list="wz-geo-list"
            value={v.geo || ""}
            onChange={(e) => onChange(setDeep(data, "cible", "geo", e.target.value))}
            placeholder="Ex. France + Benelux, Île-de-France, Monde…"
            autoComplete="off"
          />
          <datalist id="wz-geo-list">
            {GEO_SUGGESTIONS.map((g) => (
              <option key={g} value={g} />
            ))}
          </datalist>
        </div>
        <div className="icp-field">
          <label htmlFor="wz-stage">
            Stade / maturité<OptMark />
          </label>
          <input
            id="wz-stage"
            list="wz-stage-list"
            value={v.stage || ""}
            onChange={(e) => onChange(setDeep(data, "cible", "stage", e.target.value))}
            placeholder="Ex. PME établie, Série A…"
            autoComplete="off"
          />
          <datalist id="wz-stage-list">
            {STAGE_SUGGESTIONS.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>
      </div>
    </>
  );
}

function StepDecideur({
  data,
  onChange,
  errors,
}: {
  data: SpecData;
  onChange: (d: SpecData) => void;
  errors: Record<string, boolean>;
}) {
  const v = data.decideur || {};
  return (
    <>
      <div className={`icp-field ${errors["decideur.role"] ? "invalid" : ""}`}>
        <label htmlFor="wz-role">
          Rôle du décideur<ReqMark />
        </label>
        <input
          id="wz-role"
          list="wz-role-list"
          value={v.role || ""}
          onChange={(e) => onChange(setDeep(data, "decideur", "role", e.target.value))}
          placeholder="Qui signe ? (texte libre, suggestions proposées)"
          autoComplete="off"
        />
        <datalist id="wz-role-list">
          {ROLE_SUGGESTIONS.map((r) => (
            <option key={r} value={r} />
          ))}
        </datalist>
        {errors["decideur.role"] && <p className="icp-field__err">Indique qui décide / signe.</p>}
        <span className="wiz-card__hint">Le décideur économique principal, celui qui valide le budget.</span>
      </div>
      <div className="icp-field">
        <label htmlFor="wz-sen">
          Séniorité<OptMark />
        </label>
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
    </>
  );
}

function StepPain({
  data,
  onChange,
  errors,
}: {
  data: SpecData;
  onChange: (d: SpecData) => void;
  errors: Record<string, boolean>;
}) {
  const v = data.pain || {};
  return (
    <>
      <div className={`icp-field ${errors["pain.main"] ? "invalid" : ""}`}>
        <label htmlFor="wz-pain">
          Pain principal résolu<ReqMark />
        </label>
        <textarea
          id="wz-pain"
          value={v.main || ""}
          onChange={(e) => onChange(setDeep(data, "pain", "main", e.target.value))}
          placeholder="Quelle douleur précise et coûteuse ton produit fait-il disparaître ?"
        />
        {errors["pain.main"] && <p className="icp-field__err">Décris la douleur résolue.</p>}
      </div>
      <div className="icp-field">
        <label>
          Événements déclencheurs<OptMark />
        </label>
        <MultiChips
          options={TRIGGERS}
          value={v.triggers}
          onChange={(next) => onChange(setDeep(data, "pain", "triggers", next))}
          placeholder="Autre déclencheur…"
        />
        <span className="wiz-card__hint">Quand le besoin devient urgent. Plusieurs choix, ou ajoute le tien.</span>
      </div>
    </>
  );
}

function StepAntifit({ data, onChange }: { data: SpecData; onChange: (d: SpecData) => void }) {
  const v = data.antifit || {};
  return (
    <>
      <div className="icp-field">
        <label htmlFor="wz-avoid">
          Clients à éviter<OptMark />
        </label>
        <textarea
          id="wz-avoid"
          value={v.avoid || ""}
          onChange={(e) => onChange(setDeep(data, "antifit", "avoid", e.target.value))}
          placeholder="Quels profils te font perdre ton temps ou ne renouvellent jamais ?"
        />
      </div>
      <div className="icp-field">
        <label>
          Signaux disqualifiants<OptMark />
        </label>
        <MultiChips
          options={SIGNALS}
          value={v.signals}
          onChange={(next) => onChange(setDeep(data, "antifit", "signals", next))}
          placeholder="Autre signal…"
        />
      </div>
    </>
  );
}

function StepReview({ data, onGoTo }: { data: SpecData; onGoTo: (step: number) => void }) {
  const c = data.cible || {};
  const size =
    c.sizeMin || c.sizeMax ? `${c.sizeMin || "?"} à ${c.sizeMax || "?"} employés` : "—";
  const rows: { k: string; v: string; goto: number }[] = [
    { k: "Offre", v: data.offre?.what || "—", goto: 0 },
    { k: "Différenciation", v: data.offre?.differentiation || "—", goto: 0 },
    { k: "Secteur", v: c.industry || "—", goto: 1 },
    { k: "Taille", v: size, goto: 1 },
    { k: "Géographie", v: c.geo || "—", goto: 1 },
    { k: "Décideur", v: data.decideur?.role || "—", goto: 2 },
    { k: "Pain", v: data.pain?.main || "—", goto: 3 },
    { k: "Triggers", v: (data.pain?.triggers || []).join(", ") || "—", goto: 3 },
    { k: "Anti-fit", v: data.antifit?.avoid || "—", goto: 4 },
    { k: "Signaux exclus", v: (data.antifit?.signals || []).join(", ") || "—", goto: 4 },
  ];
  return (
    <>
      <p className="wiz-card__hint" style={{ marginBottom: 18 }}>
        Vérifie ta saisie. L&apos;IA enrichira avec une recherche marché, la psychologie du
        décideur, les angles et les filtres de ciblage. Plus tes réponses sont détaillées,
        meilleur est le rendu.
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
