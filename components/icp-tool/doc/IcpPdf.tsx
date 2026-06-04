"use client";

/**
 * Document PDF du livrable ICP, rendu par @react-pdf/renderer.
 *
 * Thème clair (print-friendly), accent amber Rezus. Le PDF consomme le doc
 * STRUCTURÉ (reframe, identité, psychologie profil + brief, marché funnel,
 * challenges, avantages, angles, ciblage, triggers, anti-fit, scorecard),
 * avec fallback sur les bullets du panel pour les vieux ICP. Groupé comme le
 * web : Stratégie / Message / Ciblage.
 *
 * Polices : Helvetica (built-in react-pdf). Niveau de confiance rendu en
 * marqueur texte (react-pdf ne réutilise pas les composants DOM).
 */

import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import type { Confidence, ICP } from "@/lib/icp-tool/types";

const TONE = {
  bg: "#ffffff",
  text: "#1a1410",
  textSoft: "#3a2f27",
  textMuted: "#5a4d44",
  textFaint: "#968577",
  border: "#e6dfd6",
  accent: "#d99543",
  accentSoft: "#fbf3e6",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 52,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: TONE.text,
    backgroundColor: TONE.bg,
  },
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
    paddingBottom: 6,
  },
  brand: {
    fontSize: 8,
    letterSpacing: 1.2,
    color: TONE.textFaint,
    fontFamily: "Helvetica-Bold",
  },
  brandRight: { fontSize: 8, color: TONE.textFaint },
  cover: {
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: TONE.border,
    paddingBottom: 24,
  },
  badgeWrap: { flexDirection: "row", marginBottom: 14 },
  badge: {
    fontSize: 8,
    color: TONE.accent,
    backgroundColor: TONE.accentSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    lineHeight: 1.18,
    letterSpacing: -0.5,
  },
  titlePrefix: { color: TONE.text },
  segment: { color: TONE.accent },
  metaRow: { flexDirection: "row", marginTop: 12, fontSize: 9, color: TONE.textMuted },
  metaItem: { marginRight: 16 },

  kicker: {
    fontSize: 8.5,
    letterSpacing: 1.5,
    color: TONE.accent,
    fontFamily: "Helvetica-Bold",
    marginTop: 16,
    marginBottom: 12,
  },
  section: { marginBottom: 18 },
  secHeader: {
    marginBottom: 9,
    borderBottomWidth: 0.5,
    borderBottomColor: TONE.border,
    paddingBottom: 5,
  },
  secTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", color: TONE.text },
  confTag: { fontSize: 7.5, color: TONE.textFaint, fontFamily: "Helvetica" },
  intro: { fontSize: 9, color: TONE.textMuted, lineHeight: 1.45, marginBottom: 8 },
  prose: {
    fontSize: 10,
    lineHeight: 1.55,
    color: TONE.textSoft,
    textAlign: "justify",
    marginBottom: 7,
  },
  bullet: { flexDirection: "row", marginBottom: 6 },
  bulletDot: { width: 12, color: TONE.accent, fontFamily: "Helvetica-Bold", fontSize: 10 },
  bulletText: { flex: 1, fontSize: 10, lineHeight: 1.5, color: TONE.textSoft },

  keyRow: { flexDirection: "row", marginBottom: 5 },
  keyLabel: { width: 118, fontSize: 8.5, color: TONE.textFaint, fontFamily: "Helvetica-Bold" },
  keyVal: { flex: 1, fontSize: 9.5, color: TONE.textSoft, lineHeight: 1.4 },

  aside: {
    fontSize: 9.5,
    color: TONE.textSoft,
    lineHeight: 1.45,
    marginTop: 8,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: TONE.accent,
  },
  asideLabel: { fontFamily: "Helvetica-Bold", color: TONE.text },

  point: { flexDirection: "row", marginBottom: 8 },
  pointNum: { width: 16, fontSize: 9, fontFamily: "Courier-Bold", color: TONE.accent },
  pointBody: { flex: 1 },
  pTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: TONE.text },
  pDesc: { fontSize: 9, color: TONE.textMuted, lineHeight: 1.45, marginTop: 2 },

  funnelRow: { flexDirection: "row", marginBottom: 5, alignItems: "baseline" },
  funnelVal: { width: 230, fontSize: 11, fontFamily: "Helvetica-Bold", color: TONE.text },
  funnelLabel: { flex: 1, fontSize: 8.5, color: TONE.textFaint },

  miniLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: TONE.textFaint,
    letterSpacing: 0.5,
    marginBottom: 4,
    marginTop: 9,
  },
  inlineList: { fontSize: 9.5, color: TONE.textSoft, lineHeight: 1.5 },

  source: { flexDirection: "row", marginBottom: 5, fontSize: 9, color: TONE.textMuted },
  sourceNum: { width: 22, color: TONE.textFaint, fontFamily: "Courier" },
  sourceTitle: { flex: 1 },
  sourceSite: { color: TONE.textFaint, marginLeft: 6 },
  link: { color: TONE.accent, textDecoration: "none" },

  ctaBox: {
    marginTop: 22,
    padding: 16,
    backgroundColor: TONE.accentSoft,
    borderLeftWidth: 3,
    borderLeftColor: TONE.accent,
  },
  ctaKicker: {
    fontSize: 8,
    color: TONE.accent,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    marginBottom: 6,
  },
  ctaTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", color: TONE.text, marginBottom: 4 },
  ctaText: { fontSize: 9, color: TONE.textSoft, lineHeight: 1.45 },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 52,
    right: 52,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: TONE.textFaint,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: TONE.border,
  },
});

const MONTHS = [
  "janv.", "févr.", "mars", "avr.", "mai", "juin",
  "juil.", "août", "sept.", "oct.", "nov.", "déc.",
];

function fmtDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function bulletsFromText(text: string | undefined): string[] {
  return (text || "")
    .split("\n")
    .map((l) => l.replace(/^•\s*/, "").trim())
    .filter(Boolean);
}

/**
 * Remplace les glyphes absents de Helvetica (built-in react-pdf) par des
 * équivalents ASCII. Sans ça, "≈" se rend en "H", "≥" en carré, etc.
 */
function pdfSafe(s?: string): string {
  return (s || "")
    .replace(/≈/g, "~")
    .replace(/≥/g, ">=")
    .replace(/≤/g, "<=")
    .replace(/→/g, "->")
    .replace(/×/g, "x");
}

const CONF_LABEL: Record<Confidence, string> = {
  verified: "vérifié",
  inferred: "inféré",
  hypothesis: "hypothèse",
};

function ConfTag({ conf }: { conf?: Confidence }) {
  if (!conf || !CONF_LABEL[conf]) return null;
  return <Text style={styles.confTag}>{`   (${CONF_LABEL[conf]})`}</Text>;
}

function Kicker({ label }: { label: string }) {
  return <Text style={styles.kicker}>{label}</Text>;
}

function SecHead({ title, conf }: { title: string; conf?: Confidence }) {
  return (
    <View style={styles.secHeader} wrap={false}>
      <Text style={styles.secTitle}>
        {title}
        <ConfTag conf={conf} />
      </Text>
    </View>
  );
}

function KeyRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <View style={styles.keyRow}>
      <Text style={styles.keyLabel}>{label}</Text>
      <Text style={styles.keyVal}>{pdfSafe(value)}</Text>
    </View>
  );
}

function Aside({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <Text style={styles.aside}>
      <Text style={styles.asideLabel}>{label} </Text>
      {value}
    </Text>
  );
}

/** Rend une prose avec gras markdown (**...**) en Helvetica-Bold. */
function ProseBold({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <Text style={styles.prose}>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <Text key={i} style={{ fontFamily: "Helvetica-Bold" }}>
            {p.slice(2, -2)}
          </Text>
        ) : (
          p
        ),
      )}
    </Text>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((b, i) => (
        <View key={i} style={styles.bullet}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{b}</Text>
        </View>
      ))}
    </View>
  );
}

/** Liste numérotée titre + desc (challenges, avantages, douleurs, triggers, anti-fit). */
function PointList({
  items,
  marker = "num",
}: {
  items: { t: string; d?: string; conf?: Confidence; tag?: string }[];
  marker?: "num" | "dot";
}) {
  return (
    <View>
      {items.map((p, i) => (
        <View key={i} style={styles.point} wrap={false}>
          <Text style={styles.pointNum}>{marker === "num" ? `${i + 1}.` : "•"}</Text>
          <View style={styles.pointBody}>
            <Text style={styles.pTitle}>
              {p.t}
              {p.tag ? <Text style={styles.confTag}>{`   ${p.tag}`}</Text> : null}
              <ConfTag conf={p.conf} />
            </Text>
            {p.d ? <Text style={styles.pDesc}>{p.d}</Text> : null}
          </View>
        </View>
      ))}
    </View>
  );
}

interface Props {
  icp: ICP;
}

export function IcpPdf({ icp }: Props) {
  const generatedAt = fmtDate(icp.createdAt);

  const synthese = icp.synthese?.trim() || icp.panel?.synthese?.text?.trim() || "";
  const r = icp.reframe;
  const psy = icp.psychologie;
  const m = icp.marche;
  const id = icp.identite;
  const sc = icp.scorecard;
  const sn = icp.salesnav;
  const clay = icp.clay;
  const sources = icp.sources || [];

  const challenges =
    icp.challenges && icp.challenges.length
      ? icp.challenges
      : bulletsFromText(icp.panel?.challenges?.text).map((b) => {
          const mm = b.match(/^([^:]{4,80})\s*:\s*(.+)$/);
          return mm ? { t: mm[1].trim(), d: mm[2].trim() } : { t: b };
        });
  const avantages =
    icp.avantages && icp.avantages.length
      ? icp.avantages
      : bulletsFromText(icp.panel?.avantages?.text).map((b) => {
          const mm = b.match(/^([^:]{4,80})\s*:\s*(.+)$/);
          return mm ? { t: mm[1].trim(), d: mm[2].trim() } : { t: b };
        });

  const psyProse = psy?.prose?.length ? psy.prose : bulletsFromText(icp.panel?.psychologie?.text);
  const angles =
    icp.angles && icp.angles.length
      ? icp.angles
      : (icp.hooks || []).map((h) => ({ angle: h.t, ressort: "", preuve: h.d, eviter: "" }));
  const triggers = icp.triggers || [];
  const antifit = icp.antifit || [];

  const clayLines = clay
    ? [
        { label: "Taille", value: `${clay.company_size_min} à ${clay.company_size_max}` },
        { label: "Industries", value: (clay.industries || []).join(", ") },
        { label: "Pays / villes", value: [clay.country, ...(clay.cities || [])].filter(Boolean).join(", ") },
        { label: "Stade", value: (clay.funding_stage || []).join(", ") },
        { label: "Titres décideurs", value: (clay.decision_maker_titles || []).join(", ") },
        { label: "Stack", value: (clay.tech_stack_any || []).join(", ") },
        { label: "Exclure", value: (clay.exclude_keywords || []).join(", ") },
      ].filter((l) => l.value)
    : [];

  return (
    <Document
      title={`ICP — ${icp.segment}`}
      author="Rezus Agency"
      subject="ICP Discovery"
      creator="Rezus Agency · ICP Discovery"
      producer="Rezus Agency · ICP Discovery"
      keywords="ICP, segmentation, B2B, prospection"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.brandRow} fixed>
          <Text style={styles.brand}>REZUS AGENCY · ICP DISCOVERY</Text>
          <Text style={styles.brandRight}>
            v{icp.version} · {generatedAt}
          </Text>
        </View>

        {/* Cover */}
        <View style={styles.cover}>
          <View style={styles.badgeWrap}>
            <Text style={styles.badge}>
              {icp.status === "final" ? "FINALISÉ" : "BROUILLON"}
            </Text>
          </View>
          <Text style={styles.title}>
            <Text style={styles.titlePrefix}>Votre ICP, </Text>
            <Text style={styles.segment}>{icp.segment}</Text>
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>Généré le {generatedAt}</Text>
            <Text style={styles.metaItem}>Version {icp.version}</Text>
          </View>
        </View>

        {/* ============ STRATÉGIE ============ */}
        <Kicker label="STRATÉGIE" />

        {synthese ? (
          <View style={styles.section}>
            <SecHead title="Synthèse exécutive" />
            <ProseBold text={synthese} />
          </View>
        ) : null}

        {r && (r.from || r.to) ? (
          <View style={styles.section} wrap={false}>
            <SecHead title="Le reframe" />
            <KeyRow label="Cible de départ" value={r.from} />
            <KeyRow label="Cible affinée" value={r.to} />
            <Aside label="Pourquoi," value={r.why} />
          </View>
        ) : null}

        {psyProse.length || psy?.biais || psy?.autorites ? (
          <View style={styles.section}>
            <SecHead title="Profil psychologique" />
            {psyProse.map((p, i) => (
              <Text key={i} style={styles.prose}>
                {p}
              </Text>
            ))}
            <Aside label="Style de décision," value={psy?.biais} />
            <Aside label="Figures d'autorité," value={psy?.autorites} />
          </View>
        ) : null}

        {m ? (
          <View style={styles.section}>
            <SecHead title="Analyse du marché" conf={m.conf} />
            <View style={styles.funnelRow}>
              <Text style={styles.funnelVal}>{pdfSafe(m.tam)}</Text>
              <Text style={styles.funnelLabel}>Marché total · TAM</Text>
            </View>
            <View style={styles.funnelRow}>
              <Text style={styles.funnelVal}>{pdfSafe(m.sam)}</Text>
              <Text style={styles.funnelLabel}>Atteignable · SAM</Text>
            </View>
            <View style={styles.funnelRow}>
              <Text style={styles.funnelVal}>{pdfSafe(m.som)}</Text>
              <Text style={styles.funnelLabel}>Cible 12 mois · SOM</Text>
            </View>
            <Text style={styles.miniLabel}>ÉCONOMIE DU DEAL</Text>
            <KeyRow label="Cycle de vente" value={m.cycle} />
            <KeyRow label="Budget annuel" value={m.budget} />
            <KeyRow label="ACV moyen" value={m.acv} />
            <KeyRow label="Concurrence" value={m.concurrence} />
            <KeyRow label="Maturité" value={m.maturite} />
            <KeyRow label="Saisonnalité" value={m.saisonnalite} />
            <KeyRow label="Tendance" value={m.tendances} />
            <Aside label="Pour la prospection," value={m.outbound_note} />
          </View>
        ) : bulletsFromText(icp.panel?.marche?.text).length ? (
          <View style={styles.section}>
            <SecHead title="Analyse du marché" />
            <Bullets items={bulletsFromText(icp.panel?.marche?.text)} />
          </View>
        ) : null}

        {challenges.length ? (
          <View style={styles.section}>
            <SecHead title="Challenges et risques" />
            <PointList items={challenges} />
          </View>
        ) : null}

        {avantages.length ? (
          <View style={styles.section}>
            <SecHead title="Avantages concurrentiels" />
            <PointList items={avantages} />
          </View>
        ) : null}

        {/* ============ MESSAGE ============ */}
        <Kicker label="MESSAGE" />

        {id ? (
          <View style={styles.section}>
            <SecHead title="Identité du décideur" />
            <KeyRow label="Rôle" value={id.role} />
            <KeyRow label="Séniorité" value={id.seniority} />
            <KeyRow label="Entreprise" value={id.industry} />
            <KeyRow label="Taille & stade" value={id.size} />
            <KeyRow label="Équipe" value={id.team} />
            <KeyRow label="Géographie" value={id.geo} />
            <KeyRow label="Ancienneté" value={id.tenure} />
            <KeyRow label="Mesuré sur" value={id.kpis} />
            <KeyRow label="Rôle dans l'achat" value={id.buying_role} />
          </View>
        ) : bulletsFromText(icp.panel?.identite?.text).length ? (
          <View style={styles.section}>
            <SecHead title="Identité du décideur" />
            <Bullets items={bulletsFromText(icp.panel?.identite?.text)} />
          </View>
        ) : null}

        {psy &&
        (psy.douleurs?.length ||
          psy.status_quo ||
          psy.preuves?.length ||
          psy.resistances?.length ||
          psy.vocab_yes?.length ||
          psy.registre) ? (
          <View style={styles.section}>
            <SecHead title="Brief messaging" />
            {psy.douleurs?.length ? (
              <PointList
                items={psy.douleurs.map((d) => ({
                  t: d.pain,
                  d: d.driver ? `Driver, ${d.driver}` : undefined,
                  tag: `[${d.intensite}]`,
                }))}
              />
            ) : null}
            <Aside label="Ce qu'il fait aujourd'hui," value={psy.status_quo} />
            {psy.preuves?.length ? (
              <>
                <Text style={styles.miniLabel}>CE QUI LE CONVAINC</Text>
                <Text style={styles.inlineList}>{psy.preuves.join(" · ")}</Text>
              </>
            ) : null}
            {psy.resistances?.length ? (
              <>
                <Text style={styles.miniLabel}>CE QUI LE FAIT DELETER</Text>
                <Text style={styles.inlineList}>{psy.resistances.join(" · ")}</Text>
              </>
            ) : null}
            {psy.vocab_yes?.length ? (
              <>
                <Text style={styles.miniLabel}>VOCABULAIRE QUI SONNE JUSTE</Text>
                <Text style={styles.inlineList}>{psy.vocab_yes.join(", ")}</Text>
              </>
            ) : null}
            {psy.vocab_no?.length ? (
              <>
                <Text style={styles.miniLabel}>MOTS QUI LE FONT FUIR</Text>
                <Text style={styles.inlineList}>{psy.vocab_no.join(", ")}</Text>
              </>
            ) : null}
            <Aside label="Registre," value={psy.registre} />
          </View>
        ) : null}

        {angles.length ? (
          <View style={styles.section}>
            <SecHead title="Angles de message" />
            {angles.map((a, i) => (
              <View key={i} style={styles.point} wrap={false}>
                <Text style={styles.pointNum}>{String(i + 1).padStart(2, "0")}</Text>
                <View style={styles.pointBody}>
                  <Text style={styles.pTitle}>{a.angle}</Text>
                  {a.ressort ? <Text style={styles.pDesc}>Ressort, {a.ressort}</Text> : null}
                  {a.preuve ? <Text style={styles.pDesc}>Preuve, {a.preuve}</Text> : null}
                  {a.eviter ? <Text style={styles.pDesc}>Éviter, {a.eviter}</Text> : null}
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {/* ============ CIBLAGE ============ */}
        <Kicker label="CIBLAGE" />

        {sn || clayLines.length ? (
          <View style={styles.section}>
            <SecHead title="Filtres de ciblage" />
            {sn ? (
              <>
                <Text style={styles.miniLabel}>SALES NAVIGATOR</Text>
                <KeyRow label="Intitulés" value={(sn.jobTitles || []).join(", ")} />
                <KeyRow label="Effectif" value={(sn.headcount || []).join(", ")} />
                <KeyRow label="Secteur" value={(sn.industry || []).join(", ")} />
                <KeyRow label="Géographie" value={(sn.geography || []).join(", ")} />
                <KeyRow label="Mots-clés" value={(sn.keywords || []).join(", ")} />
              </>
            ) : null}
            {clayLines.length ? (
              <>
                <Text style={styles.miniLabel}>CLAY</Text>
                {clayLines.map((l, i) => (
                  <KeyRow key={i} label={l.label} value={l.value} />
                ))}
              </>
            ) : null}
          </View>
        ) : null}

        {triggers.length ? (
          <View style={styles.section}>
            <SecHead title="Signaux d'achat" />
            <PointList
              marker="dot"
              items={triggers.map((t) => ({
                t: t.event,
                d: `Où, ${t.source} · Fenêtre, ${t.window}`,
                tag: `[${t.priority}]`,
              }))}
            />
          </View>
        ) : null}

        {antifit.length ? (
          <View style={styles.section}>
            <SecHead title="Anti-fit" />
            <PointList marker="dot" items={antifit.map((a) => ({ t: a.signal, d: a.reason }))} />
          </View>
        ) : null}

        {sc && ((sc.bloquants && sc.bloquants.length) || (sc.scoring && sc.scoring.length)) ? (
          <View style={styles.section}>
            <SecHead title="Scorecard de qualification" />
            {sc.bloquants?.length ? (
              <>
                <Text style={styles.miniLabel}>FILTRES BLOQUANTS</Text>
                <PointList
                  marker="dot"
                  items={sc.bloquants.map((b) => ({
                    t: b.signal,
                    d: `${b.condition} (donnée, ${b.dataPoint})`,
                  }))}
                />
              </>
            ) : null}
            {sc.scoring?.length ? (
              <>
                <Text style={styles.miniLabel}>
                  SCORING{sc.threshold != null ? ` · SEUIL ${sc.threshold}` : ""}
                </Text>
                {sc.scoring.map((s, i) => (
                  <View key={i} style={styles.keyRow}>
                    <Text style={styles.keyLabel}>+{s.weight}</Text>
                    <Text style={styles.keyVal}>
                      {s.label}
                      {s.condition ? ` (${s.condition})` : ""}
                    </Text>
                  </View>
                ))}
              </>
            ) : null}
          </View>
        ) : icp.qualification?.length ? (
          <View style={styles.section}>
            <SecHead title="Qualification" />
            <Bullets
              items={icp.qualification.map(
                (q) => `${q.checked ? "[must-have] " : "[nice-to-have] "}${q.label}`,
              )}
            />
          </View>
        ) : null}

        {sources.length > 0 ? (
          <View style={styles.section}>
            <SecHead title="Sources consultées" />
            {sources.map((s, i) => (
              <View key={i} style={styles.source}>
                <Text style={styles.sourceNum}>{String(i + 1).padStart(2, "0")}</Text>
                <Link src={s.url} style={[styles.sourceTitle, styles.link]}>
                  {s.title}
                </Link>
                <Text style={styles.sourceSite}>· {s.site}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Closing CTA */}
        <View style={styles.ctaBox} wrap={false}>
          <Text style={styles.ctaKicker}>REZUS AGENCY</Text>
          <Text style={styles.ctaTitle}>La suite, c&apos;est du pipeline.</Text>
          <Text style={styles.ctaText}>
            Cet ICP ne vaut que s&apos;il se transforme en rendez-vous qualifiés. Rezus
            Agency prend cet angle et le convertit en conversations commerciales réelles,
            sans spam, sans cramer votre domaine. rezus-agency.com
          </Text>
        </View>

        <View style={styles.footer} fixed>
          <Text>Rezus Agency · ICP Discovery</Text>
          <Text
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}
