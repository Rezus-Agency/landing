"use client";

/**
 * Toutes les sections du document ICP (port fidèle de docSecMap du source).
 * Chaque section reçoit l'ICP complet et choisit ses données.
 * En mode public (no shell), les boutons copy sont masqués.
 */

import { useState } from "react";
import type { ICP, Source } from "@/lib/icp-tool/types";
import {
  ArrowRightIcon,
  BoltIcon,
  BuildingIcon,
  ChartIcon,
  CheckIcon,
  ClockIcon,
  Doc2Icon,
  ExternalIcon,
  FlagIcon,
  PinIcon,
  UsersIcon,
  XIcon,
} from "@/components/icp-tool/ui/icons";
import { CopyButton } from "./CopyButton";

interface SectionProps {
  doc: ICP;
  publicView?: boolean;
}

/* ===== Helpers ===== */

function SecHeader({ n, title }: { n: string; title: string }) {
  return (
    <div className="doc-sec__h">
      <h2>{title}</h2>
      <span className="doc-sec__n">{n}</span>
    </div>
  );
}

function personaInitials(role: string): string {
  const cleaned = (role || "").replace(/[^a-zA-ZÀ-ÿ ]/g, "").trim();
  const words = cleaned.split(/\s+/);
  return ((words[0] || "?")[0] + (words[1] ? words[1][0] : "")).toUpperCase();
}

function MemoSrcChip({ s }: { s: Source }) {
  return (
    <a className="memo-src" href={s.url || "#"} target="_blank" rel="noopener noreferrer">
      <ExternalIcon />
      {s.title} <span>· {s.site}</span>
    </a>
  );
}

/* ===== 01 Synthèse ===== */
export function SectionSynthese({ doc, publicView }: SectionProps) {
  return (
    <section className="doc-sec" id="sec-synthese">
      <SecHeader n="01" title="Synthèse exécutive" />
      <div className="synthese">
        {!publicView && (
          <CopyButton text={doc.synthese || ""} className="copy-btn synthese__copy" />
        )}
        <p>{doc.synthese}</p>
      </div>
    </section>
  );
}

/* ===== 02 Identité ===== */
export function SectionIdentite({ doc }: SectionProps) {
  const id = doc.identite;
  if (!id) return null;
  const role = (id.role || "").split("(")[0].trim();
  return (
    <section className="doc-sec" id="sec-identite">
      <SecHeader n="02" title="Identité du décideur" />
      <div className="persona">
        <div className="persona__head">
          <span className="persona__av">{personaInitials(id.role)}</span>
          <div className="persona__id">
            <h3>{role}</h3>
            <p>{id.seniority}</p>
          </div>
        </div>
        <dl className="persona__grid">
          <PersonaCell icon={<BuildingIcon />} label="Entreprise" value={id.industry} />
          <PersonaCell icon={<ChartIcon />} label="Taille & stade" value={id.size} />
          <PersonaCell icon={<UsersIcon />} label="Équipe sous sa responsabilité" value={id.team} />
          <PersonaCell icon={<PinIcon />} label="Géographie" value={id.geo} />
          <PersonaCell icon={<ClockIcon />} label="Ancienneté typique" value={id.tenure} />
        </dl>
      </div>
    </section>
  );
}

function PersonaCell({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="persona__cell">
      <span className="persona__cellic">{icon}</span>
      <div>
        <dt>{label}</dt>
        <dd>{value}</dd>
      </div>
    </div>
  );
}

/* ===== 03 Psychologie ===== */
export function SectionPsychologie({ doc }: SectionProps) {
  const p = doc.psychologie;
  if (!p) return null;
  return (
    <section className="doc-sec" id="sec-psychologie">
      <SecHeader n="03" title="Psychologie du décideur" />
      <div className="memo-prose">
        {(p.prose || []).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      <div className="vocab">
        <div className="vocab__col vocab__col--yes">
          <span className="vocab__h">
            <CheckIcon /> Vocabulaire qui sonne juste
          </span>
          <div className="vocab__tags">
            {(p.vocab_yes || []).map((v, i) => (
              <span key={i}>{v}</span>
            ))}
          </div>
        </div>
        <div className="vocab__col vocab__col--no">
          <span className="vocab__h">
            <XIcon /> Mots qui le font fuir
          </span>
          <div className="vocab__tags">
            {(p.vocab_no || []).map((v, i) => (
              <span key={i}>{v}</span>
            ))}
          </div>
        </div>
      </div>
      <p className="memo-aside">
        <b>Figures d&apos;autorité, </b> {p.autorites}
      </p>
    </section>
  );
}

/* ===== 04 Marché ===== */
export function SectionMarche({ doc }: SectionProps) {
  const m = doc.marche;
  if (!m) return null;
  return (
    <section className="doc-sec" id="sec-marche">
      <SecHeader n="04" title="Analyse du marché" />
      <div className="mkt-box">
        <div className="mkt-box__nums">
          <MktStat value={m.tam} label="Marché total (TAM)" />
          <MktStat value={m.sam} label="Atteignable (SAM)" />
          <MktStat value={m.som} label="Cible 12 mois (SOM)" />
          <MktStat value={m.cycle} label="Cycle de vente" />
          <MktStat value={m.budget} label="Budget annuel moyen" />
        </div>
        <div className="mkt-box__src">
          {(m.sources || []).map((s, i) => (
            <MemoSrcChip key={i} s={s} />
          ))}
        </div>
      </div>
      <div className="memo-prose">
        <p>
          <b>Concurrence, </b> {m.concurrence}
        </p>
        <p>
          <b>Maturité, </b> {m.maturite}
        </p>
        <p>
          <b>Saisonnalité, </b> {m.saisonnalite}
        </p>
        <p>
          <b>Tendance de fond, </b> {m.tendances}
        </p>
      </div>
    </section>
  );
}

function MktStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="mkt-stat">
      <span className="mkt-stat__n">{value}</span>
      <span className="mkt-stat__l">{label}</span>
    </div>
  );
}

/* ===== 05 Challenges ===== */
export function SectionChallenges({ doc }: SectionProps) {
  if (!doc.challenges?.length) return null;
  return (
    <section className="doc-sec" id="sec-challenges">
      <SecHeader n="05" title="Challenges & risques" />
      <p className="doc-sec__intro">
        Une lecture honnête des raisons pour lesquelles ce segment peut résister, et de ce qu&apos;il
        faut pour réussir quand même.
      </p>
      <div className="stack">
        {doc.challenges.map((c, i) => (
          <div key={i} className="point point--risk">
            <span className="point__n">{i + 1}</span>
            <div>
              <div className="point__t">{c.t}</div>
              <div className="point__d">{c.d}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ===== 06 Avantages ===== */
export function SectionAvantages({ doc }: SectionProps) {
  if (!doc.avantages?.length) return null;
  return (
    <section className="doc-sec" id="sec-avantages">
      <SecHeader n="06" title="Avantages concurrentiels" />
      <p className="doc-sec__intro">
        Où se trouve l&apos;angle disponible que peu d&apos;acteurs occupent sérieusement.
      </p>
      <div className="stack">
        {doc.avantages.map((a, i) => (
          <div key={i} className="point point--adv">
            <span className="point__n">
              <CheckIcon />
            </span>
            <div>
              <div className="point__t">{a.t}</div>
              <div className="point__d">{a.d}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ===== 07 Outputs ===== */
export function SectionOutputs({ doc, publicView }: SectionProps) {
  const sn = doc.salesnav;
  const clay = doc.clay;
  const qual = doc.qualification || [];
  const hooks = doc.hooks || [];

  const navText = sn
    ? [
        `Intitulés: ${sn.jobTitles.join(", ")}`,
        `Effectif: ${sn.headcount.join(", ")}`,
        `Secteur: ${sn.industry.join(", ")}`,
        `Géographie: ${sn.geography.join(", ")}`,
        `Mots-clés: ${sn.keywords.join(", ")}`,
      ].join("\n")
    : "";

  const clayJson = clay ? JSON.stringify(clay, null, 2) : "";

  return (
    <section className="doc-sec" id="sec-outputs">
      <SecHeader n="07" title="Outputs actionnables" />
      <p className="doc-sec__intro">
        De la stratégie à l&apos;exécution. À copier directement dans vos outils de prospection.
      </p>

      {sn && (
        <div className="out-block">
          <div className="out-block__lbl">
            <h3>Filtres Sales Navigator</h3>
            {!publicView && <CopyButton text={navText} />}
          </div>
          <div className="codeblock">
            <div className="filter-rows">
              <FilterRow label="Intitulés" vals={sn.jobTitles} />
              <FilterRow label="Effectif" vals={sn.headcount} />
              <FilterRow label="Secteur" vals={sn.industry} />
              <FilterRow label="Géographie" vals={sn.geography} />
              <FilterRow label="Mots-clés" vals={sn.keywords} />
            </div>
          </div>
        </div>
      )}

      {clay && (
        <div className="out-block">
          <div className="out-block__lbl">
            <h3>Filtres Clay</h3>
          </div>
          <div className="codeblock">
            <div className="codeblock__top">
              <span className="codeblock__name">clay · enrichment.json</span>
              {!publicView && <CopyButton text={clayJson} label="Copier le JSON" />}
            </div>
            <pre>{clayJson}</pre>
          </div>
        </div>
      )}

      {qual.length > 0 && (
        <div className="out-block">
          <QualificationChecklist items={qual} interactive={!publicView} />
        </div>
      )}

      {hooks.length > 0 && (
        <div className="out-block">
          <div className="out-block__lbl">
            <h3>Hook angles, cold email</h3>
          </div>
          <div className="hooks">
            {hooks.map((h, i) => (
              <div key={i} className="hook">
                <div className="hook__t">
                  <span className="hook__n">{String(i + 1).padStart(2, "0")}</span>
                  {h.t}
                </div>
                <div className="hook__d">{h.d}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function FilterRow({ label, vals }: { label: string; vals: string[] }) {
  return (
    <div className="filter-row">
      <span className="filter-row__label">{label}</span>
      <div className="filter-row__vals">
        {vals.map((v, i) => (
          <span key={i} className="pill-v">
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}

function QualificationChecklist({
  items,
  interactive,
}: {
  items: { label: string; checked: boolean }[];
  interactive: boolean;
}) {
  const [state, setState] = useState(items.map((i) => i.checked));
  const onCount = state.filter(Boolean).length;
  const toggle = (i: number) => {
    if (!interactive) return;
    setState((s) => s.map((v, idx) => (idx === i ? !v : v)));
  };
  return (
    <>
      <div className="out-block__lbl">
        <h3>Critères de qualification</h3>
        <span className="qual-hint">
          {onCount}/{items.length} validés
        </span>
      </div>
      <ul className="qual-check">
        {items.map((q, i) => (
          <li
            key={i}
            className={state[i] ? "on" : ""}
            role="checkbox"
            aria-checked={state[i]}
            tabIndex={interactive ? 0 : -1}
            onClick={() => toggle(i)}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                toggle(i);
              }
            }}
          >
            <span className="qual-check__box">
              <CheckIcon />
            </span>
            {q.label}
          </li>
        ))}
      </ul>
    </>
  );
}

/* ===== Rezus CTA ===== */
export function SectionRezusCTA() {
  return (
    <section className="doc-sec">
      <div className="rezus-cta">
        <div className="rezus-cta__brand">
          <span className="logo__mark">Rezus</span>
          <span className="logo__word">Agency</span>
        </div>
        <h2>Vous avez votre ICP. La suite, c&apos;est du pipeline.</h2>
        <p>
          Cet ICP ne vaut que s&apos;il se transforme en rendez-vous qualifiés. C&apos;est exactement
          ce que fait Rezus Agency : on prend cet angle et on le convertit en conversations
          commerciales réelles, sans spam, sans cramer votre domaine.
        </p>
        <a className="btn btn--primary" href="/" target="_blank" rel="noopener">
          Voir comment Rezus convertit cet ICP en revenus <ArrowRightIcon />
        </a>
      </div>
    </section>
  );
}

/* Icons used elsewhere to avoid unused warnings */
export const _docIcons = { Doc2Icon, BoltIcon, FlagIcon };
