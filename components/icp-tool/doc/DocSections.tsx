"use client";

/**
 * Sections du document ICP, port fidèle du design v2 (ICP Tool v2.html).
 *
 * Chaque section utilise les classes CSS originales du bundle :
 *   - .synthese          (paragraphe avec copy button)
 *   - .persona + grid    (avatar + 5 cellules)
 *   - .memo-prose + .vocab + .memo-aside (psychologie)
 *   - .mkt-box + stats   (marché)
 *   - .stack .point      (challenges/avantages)
 *   - .out-block         (Sales Nav, Clay, qualification, hooks)
 *
 * Source des données : icp.{identite, psychologie, marche, challenges, avantages,
 * salesnav, clay, qualification, hooks} produits par finalize_icp côté LLM.
 *
 * Fallback : si une section n'a pas de structured data (vieille session),
 * on tombe sur les bullets du panel.{section}.text.
 */

import { useState } from "react";
import type { ICP } from "@/lib/icp-tool/types";
import {
  ArrowRightIcon,
  BoltIcon,
  BuildingIcon,
  ChartIcon,
  CheckIcon,
  ChevronLeftIcon,
  ClockIcon,
  ExternalIcon,
  FlagIcon,
  InfoIcon,
  PinIcon,
  SplitIcon,
  TargetIcon,
  UsersIcon,
  XIcon,
} from "@/components/icp-tool/ui/icons";
import type { Challenge, Confidence } from "@/lib/icp-tool/types";
import { CopyButton } from "./CopyButton";

interface SectionProps {
  doc: ICP;
  publicView?: boolean;
}

function SecHeader({ title }: { n?: string; title: string }) {
  return (
    <div className="doc-sec__h">
      <h2>{title}</h2>
    </div>
  );
}

function personaInitials(role: string): string {
  const cleaned = (role || "").replace(/[^a-zA-ZÀ-ÿ ]/g, "").trim();
  const words = cleaned.split(/\s+/);
  return ((words[0] || "?")[0] + (words[1] ? words[1][0] : "")).toUpperCase();
}

function bulletsFromText(text: string | undefined): string[] {
  return (text || "")
    .split("\n")
    .map((l) => l.replace(/^•\s*/, "").trim())
    .filter(Boolean);
}

/**
 * True si `v` est vide : null/undefined, chaîne vide, array vide, objet sans clés,
 * ou objet dont toutes les valeurs sont elles-mêmes vides (ex : un objet psychologie
 * squelette { prose: [], vocab_yes: [], vocab_no: [], autorites: "" }).
 *
 * Sert à empêcher qu'un objet structuré présent-mais-vide produit par un finalize_icp
 * trop maigre ne court-circuite le fallback panel (sinon section blanche).
 */
function isEmpty(v: unknown): boolean {
  if (v == null) return true;
  if (typeof v === "string") return v.trim() === "";
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === "object") {
    const vals = Object.values(v as Record<string, unknown>);
    if (vals.length === 0) return true;
    return vals.every((x) => isEmpty(x));
  }
  return false;
}

/* ===== Confiance (provenance) ===== */

const CONF_META: Record<Confidence, { label: string; icon: React.ReactNode }> = {
  verified: { label: "Vérifié", icon: <CheckIcon /> },
  inferred: { label: "Inféré", icon: <InfoIcon /> },
  hypothesis: { label: "Hypothèse", icon: <InfoIcon /> },
};

/** Badge de niveau de confiance d'un bloc. */
export function ConfBadge({ conf }: { conf?: Confidence }) {
  if (!conf || !CONF_META[conf]) return null;
  const meta = CONF_META[conf];
  return (
    <span className={`conf-badge conf-badge--${conf}`}>
      {meta.icon}
      {meta.label}
    </span>
  );
}

/** Légende expliquant les 3 niveaux, à afficher une fois en tête de document. */
export function ConfLegend() {
  return (
    <div className="conf-legend">
      <ConfBadge conf="verified" /> appuyé par une source
      <ConfBadge conf="inferred" /> déduit de la session
      <ConfBadge conf="hypothesis" /> à vérifier
    </div>
  );
}

/* ===== Chiffres clés (bandeau, haut de Stratégie) ===== */

/**
 * Extrait le "headline" chiffré d'une valeur marché verbeuse, pour le bandeau.
 * Ex : "≈ 130 atteignables en 12 mois avec un outbound ciblé" -> "≈ 130".
 * Garde les tokens numériques/unités en tête, s'arrête au premier mot descriptif.
 */
function statValue(s: string): string {
  const tokens = s.trim().split(/\s+/);
  const unit = /^([~≈+–-]|[\d.,]+|à|et|€|\$|%|k|M|\/|an|ans|mois|semaines?|sem\.?|jours?|j)$/i;
  const out: string[] = [];
  for (const t of tokens) {
    if (unit.test(t)) out.push(t);
    else break;
  }
  const v = out.join(" ").trim();
  return v.length >= 2 ? v : s.trim();
}

export function DocKeyFacts({ doc }: SectionProps) {
  const m = doc.marche;
  if (!m || isEmpty(m)) return null;
  const facts = [
    m.som && { n: m.som, l: "Comptes à viser sur 12 mois" },
    m.cycle && { n: m.cycle, l: "Temps pour signer un client" },
    m.acv && { n: m.acv, l: "Revenu moyen par client" },
    m.budget && !m.acv && { n: m.budget, l: "Budget annuel moyen du poste" },
  ].filter(Boolean) as { n: string; l: string }[];
  if (facts.length === 0) return null;
  return (
    <div className="keyfacts">
      <span className="keyfacts__cap">Le segment en chiffres</span>
      <div className="keyfacts__grid">
        {facts.map((f, i) => (
          <div key={i} className="keyfact">
            <span className="keyfact__n">{statValue(f.n)}</span>
            <span className="keyfact__l">{f.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== 01 Synthèse ===== */

function deriveSyntheseFromPanel(doc: ICP): string {
  const bullets = bulletsFromText(doc.panel?.synthese?.text);
  if (bullets.length === 0) return "";
  return bullets.map((b) => (/[.!?]$/.test(b) ? b : b + ".")).join(" ");
}

/** Rend du texte avec gras markdown (**...**), pour le verdict + emphase. */
function renderInlineBold(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <b key={i}>{part.slice(2, -2)}</b>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function SectionSynthese({ doc }: SectionProps) {
  const raw = doc.synthese?.trim() || "";
  const isPlaceholder = raw.startsWith("Synthèse non générée");
  const text = isPlaceholder || !raw ? deriveSyntheseFromPanel(doc) || raw : raw;
  if (!text) return null;
  return (
    <section className="doc-sec" id="sec-synthese">
      <SecHeader n="01" title="Synthèse exécutive" />
      <div className="synthese">
        <p>{renderInlineBold(text)}</p>
      </div>
    </section>
  );
}

/* ===== 02 Reframe (le non-évident acté) ===== */
export function SectionReframe({ doc }: SectionProps) {
  const r = doc.reframe;
  if (!r || isEmpty(r)) return null;
  return (
    <section className="doc-sec" id="sec-reframe">
      <SecHeader n="02" title="Le reframe" />
      <p className="doc-sec__intro">
        Le résultat non-évident de la session : la cible de départ, et celle, plus
        défendable, sur laquelle on part.
      </p>
      <div className="reframe">
        <div className="reframe__col reframe__col--from">
          <span className="reframe__lbl">Cible de départ</span>
          <p>{r.from}</p>
        </div>
        <span className="reframe__arrow">
          <SplitIcon />
        </span>
        <div className="reframe__col reframe__col--to">
          <span className="reframe__lbl">Cible affinée</span>
          <p>{r.to}</p>
        </div>
      </div>
      {r.why && (
        <p className="memo-aside">
          <b>Pourquoi, </b>
          {r.why}
        </p>
      )}
    </section>
  );
}

/* ===== 07 Identité ===== */

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

export function SectionIdentite({ doc }: SectionProps) {
  const id = doc.identite;
  if (!id || isEmpty(id)) {
    // Fallback bullets
    const bullets = bulletsFromText(doc.panel?.identite?.text);
    if (bullets.length === 0) return null;
    return (
      <section className="doc-sec" id="sec-identite">
        <SecHeader n="07" title="Identité du décideur" />
        <div className="synthese">
          <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
            {bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  }
  const role = (id.role || "").split("(")[0].trim();
  return (
    <section className="doc-sec" id="sec-identite">
      <SecHeader n="07" title="Identité du décideur" />
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
          <PersonaCell
            icon={<UsersIcon />}
            label="Équipe sous sa responsabilité"
            value={id.team}
          />
          <PersonaCell icon={<PinIcon />} label="Géographie" value={id.geo} />
          <PersonaCell icon={<ClockIcon />} label="Ancienneté typique" value={id.tenure} />
          {id.kpis && (
            <PersonaCell icon={<TargetIcon />} label="Mesuré sur" value={id.kpis} />
          )}
          {id.buying_role && (
            <PersonaCell icon={<BoltIcon />} label="Rôle dans l'achat" value={id.buying_role} />
          )}
        </dl>
      </div>
    </section>
  );
}

/* ===== 03 Profil psychologique (volet profond, Stratégie) ===== */
export function SectionPsyProfil({ doc }: SectionProps) {
  const p = doc.psychologie;
  const panelBullets = !p || isEmpty(p) ? bulletsFromText(doc.panel?.psychologie?.text) : [];
  const prose = p && p.prose && p.prose.length > 0 ? p.prose : panelBullets;
  const hasProfil = prose.length > 0 || !!p?.biais || !!p?.autorites;
  if (!hasProfil) return null;
  return (
    <section className="doc-sec" id="sec-psychologie">
      <SecHeader n="03" title="Profil psychologique" />
      <div className="memo-prose">
        {prose.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      {p?.biais && (
        <p className="memo-aside">
          <b>Style de décision, </b>
          {p.biais}
        </p>
      )}
      {p?.autorites && (
        <p className="memo-aside">
          <b>Figures d&apos;autorité, </b>
          {p.autorites}
        </p>
      )}
    </section>
  );
}

/* ===== 08 Brief messaging (volet opérationnel, Message) ===== */
function VocabCol({
  variant,
  icon,
  title,
  items,
}: {
  variant: "yes" | "no";
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  if (items.length === 0) return null;
  return (
    <div className={`vocab__col vocab__col--${variant}`}>
      <span className="vocab__h">
        {icon} {title}
      </span>
      <div className="vocab__tags">
        {items.map((v, i) => (
          <span key={i}>{v}</span>
        ))}
      </div>
    </div>
  );
}

function BriefList({
  variant,
  icon,
  title,
  items,
}: {
  variant: "yes" | "no";
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  if (items.length === 0) return null;
  return (
    <div className={`brief-list brief-list--${variant}`}>
      <span className="brief-list__h">
        {icon} {title}
      </span>
      <ul>
        {items.map((v, i) => (
          <li key={i}>{v}</li>
        ))}
      </ul>
    </div>
  );
}

export function SectionPsyBrief({ doc }: SectionProps) {
  const p = doc.psychologie;
  if (!p) return null;
  const douleurs = p.douleurs || [];
  const preuves = p.preuves || [];
  const resistances = p.resistances || [];
  const vocabYes = p.vocab_yes || [];
  const vocabNo = p.vocab_no || [];
  const hasBrief =
    douleurs.length > 0 ||
    !!p.status_quo ||
    preuves.length > 0 ||
    resistances.length > 0 ||
    vocabYes.length > 0 ||
    vocabNo.length > 0 ||
    !!p.registre;
  if (!hasBrief) return null;
  return (
    <section className="doc-sec" id="sec-brief">
      <SecHeader n="08" title="Brief messaging" />
      <p className="doc-sec__intro">
        De quoi écrire un cold outbound qui sonne juste : ses douleurs, ce qui le
        convainc, ce qui le fait fuir.
      </p>
      {douleurs.length > 0 && (
        <div className="stack">
          {douleurs.map((d, i) => (
            <div key={i} className="point point--risk">
              <span className="point__n">{i + 1}</span>
              <div>
                <div className="point__t">
                  {d.pain}
                  <span className={`tag-int tag-int--${d.intensite}`}>{d.intensite}</span>
                </div>
                {d.driver && <div className="point__d">Driver, {d.driver}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
      {p.status_quo && (
        <p className="memo-aside">
          <b>Ce qu&apos;il fait aujourd&apos;hui, </b>
          {p.status_quo}
        </p>
      )}
      {(preuves.length > 0 || resistances.length > 0) && (
        <div className="brief-cols">
          <BriefList variant="yes" icon={<CheckIcon />} title="Ce qui le convainc" items={preuves} />
          <BriefList variant="no" icon={<XIcon />} title="Ce qui le fait deleter" items={resistances} />
        </div>
      )}
      {(vocabYes.length > 0 || vocabNo.length > 0) && (
        <div className="vocab">
          <VocabCol variant="yes" icon={<CheckIcon />} title="Vocabulaire qui sonne juste" items={vocabYes} />
          <VocabCol variant="no" icon={<XIcon />} title="Mots qui le font fuir" items={vocabNo} />
        </div>
      )}
      {p.registre && (
        <p className="memo-aside">
          <b>Registre, </b>
          {p.registre}
        </p>
      )}
    </section>
  );
}

/* ===== 04 Marché ===== */

function MktStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="mkt-stat">
      <span className="mkt-stat__n">{value}</span>
      <span className="mkt-stat__l">{label}</span>
    </div>
  );
}

function MemoSrcChip({ s }: { s: { title: string; site: string; url: string } }) {
  return (
    <a className="memo-src" href={s.url || "#"} target="_blank" rel="noopener noreferrer">
      <ExternalIcon />
      {s.title} <span>· {s.site}</span>
    </a>
  );
}

export function SectionMarche({ doc }: SectionProps) {
  const m = doc.marche;
  if (!m || isEmpty(m)) {
    const bullets = bulletsFromText(doc.panel?.marche?.text);
    if (bullets.length === 0) return null;
    return (
      <section className="doc-sec" id="sec-marche">
        <SecHeader n="04" title="Analyse du marché" />
        <div className="memo-prose">
          {bullets.map((b, i) => (
            <p key={i}>{b}</p>
          ))}
        </div>
      </section>
    );
  }
  const texture = [
    m.concurrence && { icon: <UsersIcon />, label: "Concurrence", text: m.concurrence },
    m.maturite && { icon: <ChartIcon />, label: "Maturité", text: m.maturite },
    m.saisonnalite && { icon: <ClockIcon />, label: "Saisonnalité", text: m.saisonnalite },
    m.tendances && { icon: <BoltIcon />, label: "Tendance de fond", text: m.tendances },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; text: string }[];
  return (
    <section className="doc-sec" id="sec-marche">
      <SecHeader n="04" title="Analyse du marché" />
      {m.conf && (
        <div className="doc-sec__badges">
          <ConfBadge conf={m.conf} />
        </div>
      )}

      <div className="funnel">
        <div className="funnel__row">
          <span className="funnel__bar" style={{ width: "100%" }} />
          <span className="funnel__txt">
            <b>{m.tam}</b>
            <span>Marché total · TAM</span>
          </span>
        </div>
        <div className="funnel__row">
          <span className="funnel__bar" style={{ width: "66%" }} />
          <span className="funnel__txt">
            <b>{m.sam}</b>
            <span>Atteignable · SAM</span>
          </span>
        </div>
        <div className="funnel__row">
          <span className="funnel__bar" style={{ width: "38%" }} />
          <span className="funnel__txt">
            <b>{m.som}</b>
            <span>Cible 12 mois · SOM</span>
          </span>
        </div>
      </div>

      <div className="deal-eco">
        <MktStat value={m.cycle} label="Cycle de vente" />
        <MktStat value={m.budget} label="Budget annuel" />
        {m.acv && <MktStat value={m.acv} label="ACV moyen" />}
      </div>

      {m.outbound_note && (
        <p className="outbound-note">
          <BoltIcon />
          {m.outbound_note}
        </p>
      )}

      {texture.length > 0 && (
        <div className="texture-grid">
          {texture.map((t, i) => (
            <div key={i} className="texture-card">
              <span className="texture-card__ic">{t.icon}</span>
              <div>
                <span className="texture-card__l">{t.label}</span>
                <p>{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {m.sources && m.sources.length > 0 && (
        <div className="mkt-box__src">
          {m.sources.map((s, i) => (
            <MemoSrcChip key={i} s={s} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ===== 05 Challenges ===== */
export function SectionChallenges({ doc }: SectionProps) {
  const items: Challenge[] =
    doc.challenges && doc.challenges.length > 0
      ? doc.challenges
      : bulletsFromText(doc.panel?.challenges?.text).map((b) => {
          const m = b.match(/^([^:]{4,80})\s*:\s*(.+)$/);
          return m ? { t: m[1].trim(), d: m[2].trim() } : { t: b, d: "" };
        });
  if (items.length === 0) return null;
  return (
    <section className="doc-sec" id="sec-challenges">
      <SecHeader n="05" title="Challenges et risques" />
      <p className="doc-sec__intro">
        Une lecture honnête des raisons pour lesquelles ce segment peut résister, et de
        ce qu&apos;il faut pour réussir quand même.
      </p>
      <div className="stack">
        {items.map((c, i) => (
          <div key={i} className="point point--risk">
            <span className="point__n">{i + 1}</span>
            <div>
              <div className="point__t">
                {c.t}
                <ConfBadge conf={c.conf} />
              </div>
              {c.d && <div className="point__d">{c.d}</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ===== 06 Avantages ===== */
export function SectionAvantages({ doc }: SectionProps) {
  const items: Challenge[] =
    doc.avantages && doc.avantages.length > 0
      ? doc.avantages
      : bulletsFromText(doc.panel?.avantages?.text).map((b) => {
          const m = b.match(/^([^:]{4,80})\s*:\s*(.+)$/);
          return m ? { t: m[1].trim(), d: m[2].trim() } : { t: b, d: "" };
        });
  if (items.length === 0) return null;
  return (
    <section className="doc-sec" id="sec-avantages">
      <SecHeader n="06" title="Avantages concurrentiels" />
      <p className="doc-sec__intro">
        Où se trouve l&apos;angle disponible que peu d&apos;acteurs occupent
        sérieusement.
      </p>
      <div className="stack">
        {items.map((a, i) => (
          <div key={i} className="point point--adv">
            <span className="point__n">
              <CheckIcon />
            </span>
            <div>
              <div className="point__t">
                {a.t}
                <ConfBadge conf={a.conf} />
              </div>
              {a.d && <div className="point__d">{a.d}</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ===== 07 Outputs actionnables ===== */

function FilterRow({ label, vals }: { label: string; vals?: string[] }) {
  const list = vals ?? [];
  return (
    <div className="filter-row">
      <span className="filter-row__label">{label}</span>
      <div className="filter-row__vals">
        {list.map((v, i) => (
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

/* ===== 09 Angles de message (Message) ===== */
export function SectionAngles({ doc }: SectionProps) {
  const angles =
    doc.angles && doc.angles.length > 0
      ? doc.angles
      : (doc.hooks || []).map((h) => ({ angle: h.t, ressort: "", preuve: h.d, eviter: "" }));
  if (angles.length === 0) return null;
  return (
    <section className="doc-sec" id="sec-angles">
      <SecHeader n="09" title="Angles de message" />
      <p className="doc-sec__intro">
        Des angles dérivés de la psychologie, pas du copy écrit : un brief à passer pour
        la séquence.
      </p>
      <div className="angles">
        {angles.map((a, i) => (
          <div key={i} className="angle">
            <div className="angle__t">
              <span className="angle__n">{String(i + 1).padStart(2, "0")}</span>
              {a.angle}
            </div>
            {a.ressort && (
              <div className="angle__row">
                <span>Ressort</span>
                <p>{a.ressort}</p>
              </div>
            )}
            {a.preuve && (
              <div className="angle__row">
                <span>Preuve</span>
                <p>{a.preuve}</p>
              </div>
            )}
            {a.eviter && (
              <div className="angle__row angle__row--no">
                <span>Éviter</span>
                <p>{a.eviter}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ===== 10 Filtres de ciblage : Sales Nav + Clay (Ciblage) ===== */
export function SectionTargeting({ doc, publicView }: SectionProps) {
  const sn = doc.salesnav;
  const clay = doc.clay;
  if (!sn && !clay) return null;

  // Le doc LLM peut omettre un tableau : on défensive systématiquement pour ne
  // jamais planter le rendu sur une fiche partielle.
  const jobTitles = sn?.jobTitles ?? [];
  const headcount = sn?.headcount ?? [];
  const industry = sn?.industry ?? [];
  const geography = sn?.geography ?? [];
  const keywords = sn?.keywords ?? [];
  const navText = sn
    ? [
        `Intitulés: ${jobTitles.join(", ")}`,
        `Effectif: ${headcount.join(", ")}`,
        `Secteur: ${industry.join(", ")}`,
        `Géographie: ${geography.join(", ")}`,
        `Mots-clés: ${keywords.join(", ")}`,
      ].join("\n")
    : "";
  const clayJson = clay ? JSON.stringify(clay, null, 2) : "";

  return (
    <section className="doc-sec" id="sec-targeting">
      <SecHeader n="10" title="Filtres de ciblage" />
      <p className="doc-sec__intro">
        Prêts à coller dans Sales Navigator et Clay pour bâtir la liste.
      </p>

      {sn && (
        <div className="out-block">
          <div className="out-block__lbl">
            <h3>Filtres Sales Navigator</h3>
            {!publicView && <CopyButton text={navText} label="Copier" />}
          </div>
          <div className="codeblock">
            <div className="filter-rows" style={{ padding: 15 }}>
              <FilterRow label="Intitulés" vals={jobTitles} />
              <FilterRow label="Effectif" vals={headcount} />
              <FilterRow label="Secteur" vals={industry} />
              <FilterRow label="Géographie" vals={geography} />
              <FilterRow label="Mots-clés" vals={keywords} />
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
    </section>
  );
}

/* ===== 11 Signaux d'achat (Ciblage) ===== */
export function SectionTriggers({ doc }: SectionProps) {
  const triggers = doc.triggers || [];
  if (triggers.length === 0) return null;
  return (
    <section className="doc-sec" id="sec-triggers">
      <SecHeader n="11" title="Signaux d'achat" />
      <p className="doc-sec__intro">
        Quand contacter un compte. Le nerf du timing en outbound.
      </p>
      <div className="stack">
        {triggers.map((t, i) => (
          <div key={i} className="point point--trigger">
            <span className="point__n">
              <BoltIcon />
            </span>
            <div>
              <div className="point__t">
                {t.event}
                <span className={`tag-int tag-int--${t.priority}`}>{t.priority}</span>
              </div>
              <div className="point__d">
                Où, {t.source} · Fenêtre, {t.window}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ===== 12 Anti-fit (Ciblage) ===== */
export function SectionAntifit({ doc }: SectionProps) {
  const items = doc.antifit || [];
  if (items.length === 0) return null;
  return (
    <section className="doc-sec" id="sec-antifit">
      <SecHeader n="12" title="Anti-fit" />
      <p className="doc-sec__intro">
        Qui ne pas contacter, pour protéger la qualité de campagne et le domaine.
      </p>
      <div className="stack">
        {items.map((a, i) => (
          <div key={i} className="point point--risk">
            <span className="point__n">
              <XIcon />
            </span>
            <div>
              <div className="point__t">{a.signal}</div>
              {a.reason && <div className="point__d">{a.reason}</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ===== 14 Scorecard de qualification (Ciblage) ===== */
export function SectionScorecard({ doc, publicView }: SectionProps) {
  const sc = doc.scorecard;
  const legacyQual = doc.qualification || [];
  if ((!sc || isEmpty(sc)) && legacyQual.length === 0) return null;

  // Fallback ICP legacy : ancienne checklist binaire.
  if (!sc || isEmpty(sc)) {
    return (
      <section className="doc-sec" id="sec-scorecard">
        <SecHeader n="13" title="Qualification" />
        <div className="out-block">
          <QualificationChecklist items={legacyQual} interactive={!publicView} />
        </div>
      </section>
    );
  }

  const bloquants = sc.bloquants || [];
  const scoring = sc.scoring || [];
  return (
    <section className="doc-sec" id="sec-scorecard">
      <SecHeader n="13" title="Scorecard de qualification" />
      <p className="doc-sec__intro">
        À appliquer à un compte réel avant de l&apos;ajouter à la campagne.
      </p>

      {bloquants.length > 0 && (
        <div className="out-block">
          <div className="out-block__lbl">
            <h3>Filtres bloquants</h3>
            <span className="qual-hint">disqualifiants</span>
          </div>
          <div className="stack">
            {bloquants.map((b, i) => (
              <div key={i} className="point point--risk">
                <span className="point__n">
                  <FlagIcon />
                </span>
                <div>
                  <div className="point__t">{b.signal}</div>
                  <div className="point__d">
                    {b.condition} · données, {b.dataPoint}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {scoring.length > 0 && (
        <div className="out-block">
          <div className="out-block__lbl">
            <h3>Critères de scoring</h3>
            {sc.threshold != null && (
              <span className="qual-hint">seuil, {sc.threshold}</span>
            )}
          </div>
          <ul className="scorecard">
            {scoring.map((s, i) => (
              <li key={i}>
                <span className="scorecard__w">+{s.weight}</span>
                <div>
                  <div className="scorecard__l">{s.label}</div>
                  {s.condition && <div className="scorecard__c">{s.condition}</div>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/* ===== Sources globales (recherches session) ===== */
export function SectionSources({ doc }: SectionProps) {
  const sources = doc.sources || [];
  if (sources.length === 0) return null;
  return (
    <section className="doc-sec" id="sec-sources">
      <SecHeader n="14" title="Sources consultées" />
      <details className="src-collapse">
        <summary>
          <span className="src-collapse__lbl">
            {sources.length} source{sources.length > 1 ? "s" : ""} web déclenchées
            pendant la session, dédupées par URL
          </span>
          <span className="src-collapse__chev">
            <ChevronLeftIcon />
          </span>
        </summary>
        <div className="src-grid">
          {sources.map((s, i) => (
            <a
              key={i}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="src-card"
            >
              <ExternalIcon />
              <span className="src-card__txt">
                <span className="src-card__t">{s.title}</span>
                <span className="src-card__s">{s.site}</span>
              </span>
            </a>
          ))}
        </div>
      </details>
    </section>
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
          Cet ICP ne vaut que s&apos;il se transforme en rendez-vous qualifiés.
          C&apos;est exactement ce que fait Rezus Agency : on prend cet angle et on le
          convertit en conversations commerciales réelles, sans spam, sans cramer votre
          domaine.
        </p>
        <a className="btn btn--primary" href="/contact" target="_blank" rel="noopener">
          Voir comment Rezus convertit cet ICP en revenus <ArrowRightIcon />
        </a>
      </div>
    </section>
  );
}
