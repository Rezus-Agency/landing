/**
 * Sérialise un ICP existant en markdown, pour l'injecter comme CONTEXTE dans une
 * session d'itération (le LLM doit savoir sur quoi il itère). Couvre tout le doc
 * structuré, avec fallback sur les bullets du panel pour les vieux ICP.
 */
import type { ICP, ICPSection } from "./types";

/**
 * Reconstruit les 6 sections du panel (sidebar de session) depuis un ICP, pour
 * pré-remplir la sidebar en itération. Utilise `icp.panel` s'il existe, sinon
 * dérive le texte depuis le doc structuré.
 */
export function panelFromIcp(icp: ICP): Record<string, ICPSection> {
  if (icp.panel && Object.keys(icp.panel).length > 0) return { ...icp.panel };
  const p: Record<string, ICPSection> = {};
  const done = (text: string): ICPSection => ({ status: "done", text });
  if (icp.synthese) p.synthese = done(icp.synthese.replace(/\*\*/g, ""));
  if (icp.identite) {
    p.identite = done(
      [icp.identite.role, icp.identite.size, icp.identite.geo, icp.identite.team]
        .filter(Boolean)
        .join("\n"),
    );
  }
  if (icp.psychologie?.prose?.length) {
    p.psychologie = done(icp.psychologie.prose.join("\n\n"));
  }
  if (icp.marche) {
    p.marche = done(
      [
        icp.marche.tam && `TAM ${icp.marche.tam}`,
        icp.marche.sam && `SAM ${icp.marche.sam}`,
        icp.marche.som && `SOM ${icp.marche.som}`,
        icp.marche.cycle && `Cycle ${icp.marche.cycle}`,
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }
  if (icp.challenges?.length) {
    p.challenges = done(icp.challenges.map((c) => `${c.t}${c.d ? ": " + c.d : ""}`).join("\n"));
  }
  if (icp.avantages?.length) {
    p.avantages = done(icp.avantages.map((a) => `${a.t}${a.d ? ": " + a.d : ""}`).join("\n"));
  }
  return p;
}

function bulletsFromText(text: string | undefined): string[] {
  return (text || "")
    .split("\n")
    .map((l) => l.replace(/^•\s*/, "").trim())
    .filter(Boolean);
}

export function icpToContextMarkdown(icp: ICP): string {
  const L: string[] = [];
  L.push(`# ICP actuel : ${icp.segment} (v${icp.version})`);

  if (icp.synthese) {
    L.push("");
    L.push("## Synthèse");
    L.push(icp.synthese.replace(/\*\*/g, ""));
  }

  if (icp.reframe && (icp.reframe.from || icp.reframe.to)) {
    L.push("");
    L.push("## Reframe");
    L.push(`De "${icp.reframe.from}" vers "${icp.reframe.to}". Pourquoi : ${icp.reframe.why}`);
  }

  const id = icp.identite;
  if (id) {
    L.push("");
    L.push("## Identité du décideur");
    const rows: [string, string | undefined][] = [
      ["Rôle", id.role],
      ["Séniorité", id.seniority],
      ["Industrie", id.industry],
      ["Taille & stade", id.size],
      ["Équipe", id.team],
      ["Géographie", id.geo],
      ["Ancienneté", id.tenure],
      ["Mesuré sur", id.kpis],
      ["Rôle dans l'achat", id.buying_role],
    ];
    rows.forEach(([k, v]) => v && L.push(`- ${k} : ${v}`));
  } else if (icp.panel?.identite?.text) {
    L.push("");
    L.push("## Identité du décideur");
    bulletsFromText(icp.panel.identite.text).forEach((b) => L.push(`- ${b}`));
  }

  const p = icp.psychologie;
  if (p) {
    L.push("");
    L.push("## Psychologie du décideur");
    if (p.prose?.length) L.push(p.prose.join("\n\n"));
    if (p.biais) L.push(`Biais / style de décision : ${p.biais}`);
    if (p.douleurs?.length) {
      L.push("Douleurs :");
      p.douleurs.forEach((d) => L.push(`- ${d.pain} (driver : ${d.driver}, intensité : ${d.intensite})`));
    }
    if (p.status_quo) L.push(`Status quo (ce qu'il fait aujourd'hui) : ${p.status_quo}`);
    if (p.preuves?.length) L.push(`Ce qui le convainc : ${p.preuves.join(" ; ")}`);
    if (p.resistances?.length) L.push(`Ce qui le fait fuir : ${p.resistances.join(" ; ")}`);
    if (p.vocab_yes?.length) L.push(`Vocabulaire qui sonne juste : ${p.vocab_yes.join(", ")}`);
    if (p.vocab_no?.length) L.push(`Mots qui le font fuir : ${p.vocab_no.join(", ")}`);
    if (p.autorites) L.push(`Figures d'autorité : ${p.autorites}`);
    if (p.registre) L.push(`Registre : ${p.registre}`);
  } else if (icp.panel?.psychologie?.text) {
    L.push("");
    L.push("## Psychologie du décideur");
    bulletsFromText(icp.panel.psychologie.text).forEach((b) => L.push(`- ${b}`));
  }

  const m = icp.marche;
  if (m) {
    L.push("");
    L.push("## Marché");
    const rows: [string, string | undefined][] = [
      ["TAM", m.tam],
      ["SAM", m.sam],
      ["SOM", m.som],
      ["Cycle de vente", m.cycle],
      ["Budget annuel", m.budget],
      ["ACV", m.acv],
      ["Concurrence", m.concurrence],
      ["Maturité", m.maturite],
      ["Saisonnalité", m.saisonnalite],
      ["Tendance", m.tendances],
    ];
    rows.forEach(([k, v]) => v && L.push(`- ${k} : ${v}`));
  } else if (icp.panel?.marche?.text) {
    L.push("");
    L.push("## Marché");
    bulletsFromText(icp.panel.marche.text).forEach((b) => L.push(`- ${b}`));
  }

  if (icp.challenges?.length) {
    L.push("");
    L.push("## Challenges et risques");
    icp.challenges.forEach((c) => L.push(`- ${c.t}${c.d ? ` : ${c.d}` : ""}`));
  }

  if (icp.avantages?.length) {
    L.push("");
    L.push("## Avantages concurrentiels");
    icp.avantages.forEach((a) => L.push(`- ${a.t}${a.d ? ` : ${a.d}` : ""}`));
  }

  const angles = icp.angles?.length
    ? icp.angles
    : (icp.hooks || []).map((h) => ({ angle: h.t, ressort: "", preuve: h.d, eviter: "" }));
  if (angles.length) {
    L.push("");
    L.push("## Angles de message");
    angles.forEach((a) =>
      L.push(
        `- ${a.angle}${a.ressort ? ` (ressort : ${a.ressort})` : ""}${a.preuve ? ` (preuve : ${a.preuve})` : ""}`,
      ),
    );
  }

  if (icp.salesnav || icp.clay || icp.triggers?.length || icp.antifit?.length || icp.scorecard) {
    L.push("");
    L.push("## Ciblage");
    const sn = icp.salesnav;
    if (sn) {
      L.push(
        `Sales Nav : intitulés [${(sn.jobTitles || []).join(", ")}], effectif [${(sn.headcount || []).join(", ")}], secteur [${(sn.industry || []).join(", ")}], géo [${(sn.geography || []).join(", ")}]`,
      );
    }
    if (icp.clay) L.push(`Clay : ${JSON.stringify(icp.clay)}`);
    if (icp.triggers?.length) {
      L.push("Signaux d'achat :");
      icp.triggers.forEach((t) => L.push(`- ${t.event} (${t.source}, ${t.window}, ${t.priority})`));
    }
    if (icp.antifit?.length) {
      L.push("Anti-fit :");
      icp.antifit.forEach((a) => L.push(`- ${a.signal}${a.reason ? ` : ${a.reason}` : ""}`));
    }
    if (icp.scorecard?.bloquants?.length) {
      L.push("Filtres bloquants :");
      icp.scorecard.bloquants.forEach((b) => L.push(`- ${b.signal} : ${b.condition}`));
    }
    if (icp.scorecard?.scoring?.length) {
      L.push("Scoring :");
      icp.scorecard.scoring.forEach((s) => L.push(`- +${s.weight} ${s.label}`));
    }
  }

  return L.join("\n");
}
