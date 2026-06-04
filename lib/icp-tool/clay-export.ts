/**
 * Génère une spec markdown "table Clay" à partir d'un ICP.
 *
 * Objectif : un prompt/spec portable, à coller dans Clay (Claygent) ou un LLM,
 * pour bâtir une TABLE DE LEADS (à filtrer et qualifier ensuite), pas une liste
 * finale ni du copy d'email. C'est là que vivent les variables d'enrichissement.
 */
import type { ICP } from "./types";

export function icpToClaySpec(icp: ICP): string {
  const L: string[] = [];

  L.push(
    "Tu es un assistant GTM. À partir de la spec ICP ci-dessous, aide-moi à construire une table Clay de prospection : sourcing des comptes, colonnes d'enrichissement, signaux de timing, et logique de scoring/qualification. Ne génère PAS de copy d'email. L'objectif est une table de leads à filtrer et qualifier, pas une liste finale.",
  );
  L.push("");
  L.push("---");
  L.push("");
  L.push(`# Table Clay de prospection : ${icp.segment}`);
  if (icp.synthese) {
    L.push("");
    L.push(`> ${icp.synthese}`);
  }

  /* 1. Sourcing */
  const sn = icp.salesnav;
  const clay = icp.clay;
  if (sn || clay) {
    L.push("");
    L.push("## 1. Sourcing (qui importer dans la table)");
    if (sn) {
      L.push("");
      L.push("**Sales Navigator**");
      if (sn.jobTitles?.length) L.push(`- Intitulés : ${sn.jobTitles.join(", ")}`);
      if (sn.headcount?.length) L.push(`- Effectif : ${sn.headcount.join(", ")}`);
      if (sn.industry?.length) L.push(`- Secteur : ${sn.industry.join(", ")}`);
      if (sn.geography?.length) L.push(`- Géographie : ${sn.geography.join(", ")}`);
      if (sn.keywords?.length) L.push(`- Mots-clés : ${sn.keywords.join(", ")}`);
    }
    if (clay) {
      L.push("");
      L.push("**Firmographie (filtres Clay)**");
      L.push("```json");
      L.push(JSON.stringify(clay, null, 2));
      L.push("```");
    }
  }

  /* 2. Colonnes d'enrichissement */
  const enr = icp.enrichment || [];
  if (enr.length) {
    L.push("");
    L.push("## 2. Colonnes d'enrichissement (à pull par compte ou contact)");
    L.push("");
    L.push("| Colonne | Usage | Source |");
    L.push("| --- | --- | --- |");
    enr.forEach((e) => L.push(`| ${e.variable} | ${e.usage} | ${e.source} |`));
  }

  /* 3. Signaux de timing */
  const tr = icp.triggers || [];
  if (tr.length) {
    L.push("");
    L.push("## 3. Signaux de timing (colonnes à surveiller)");
    tr.forEach((t) =>
      L.push(
        `- **${t.event}** · où : ${t.source} · fenêtre : ${t.window} (priorité ${t.priority})`,
      ),
    );
  }

  /* 4. Scoring & qualification */
  const sc = icp.scorecard;
  if (sc && ((sc.bloquants && sc.bloquants.length) || (sc.scoring && sc.scoring.length))) {
    L.push("");
    L.push("## 4. Scoring & qualification");
    if (sc.bloquants?.length) {
      L.push("");
      L.push("**Filtres bloquants (exclure le compte si non respecté)**");
      sc.bloquants.forEach((b) =>
        L.push(`- ${b.signal} : ${b.condition} (donnée : ${b.dataPoint})`),
      );
    }
    if (sc.scoring?.length) {
      L.push("");
      L.push("**Scoring (colonne de priorisation)**");
      sc.scoring.forEach((s) =>
        L.push(`- +${s.weight} : ${s.label}${s.condition ? ` (${s.condition})` : ""}`),
      );
      if (sc.threshold != null) L.push(`- Seuil "on y va" : ${sc.threshold}`);
    }
  } else if (icp.qualification?.length) {
    L.push("");
    L.push("## 4. Qualification");
    icp.qualification.forEach((q) =>
      L.push(`- ${q.checked ? "[must-have] " : "[nice-to-have] "}${q.label}`),
    );
  }

  /* 5. Anti-fit */
  const af = icp.antifit || [];
  const exclude = icp.clay?.exclude_keywords || [];
  if (af.length || exclude.length) {
    L.push("");
    L.push("## 5. Anti-fit (exclure du sourcing)");
    af.forEach((a) => L.push(`- ${a.signal}${a.reason ? ` : ${a.reason}` : ""}`));
    if (exclude.length) L.push(`- Mots-clés à exclure : ${exclude.join(", ")}`);
  }

  L.push("");
  return L.join("\n");
}
