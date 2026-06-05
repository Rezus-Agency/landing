/**
 * POST /api/icp/spec-generate
 *
 * Génération one-shot de l'ICP à partir du formulaire guidé (wizard). On met en
 * forme la saisie en brief, puis on délègue à generateFromSpec (recherche +
 * finalize_icp forcé). Renvoie le document final en JSON ; le client construit
 * l'ICP (icpFromDoc) et le sauvegarde comme celui du chat.
 */
import { generateFromSpec, checkSpecSufficiency } from "@/lib/llm-core/agent/spec-generate";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

/* eslint-disable @typescript-eslint/no-explicit-any */
type SpecData = Record<string, any>;

function line(label: string, value: unknown): string {
  if (value == null || value === "") return "";
  if (Array.isArray(value)) return value.length ? `- ${label} : ${value.join(", ")}` : "";
  return `- ${label} : ${value}`;
}

/** Met en forme la saisie du wizard en brief markdown pour le modèle. */
function specToMarkdown(d: SpecData): string {
  const o = d.offre || {};
  const c = d.cible || {};
  const dec = d.decideur || {};
  const p = d.pain || {};
  const af = d.antifit || {};
  const size =
    c.sizeMin || c.sizeMax ? `${c.sizeMin || "?"} à ${c.sizeMax || "?"} employés` : "";
  const L = [
    "Voici l'ICP affirmé par le fondateur via le formulaire guidé. Enrichis-le et structure-le.",
    "",
    "## Offre",
    line("Ce qu'il vend", o.what),
    line("Différenciation", o.differentiation),
    "",
    "## Cible (compte)",
    line("Secteur / vertical", c.industry),
    line("Taille d'entreprise", size),
    line("Géographie", c.geo),
    line("Stade", c.stage),
    "",
    "## Décideur",
    line("Rôle", dec.role),
    line("Séniorité", dec.seniority),
    "",
    "## Pain & déclencheurs",
    line("Pain principal", p.main),
    line("Événements déclencheurs", p.triggers),
    "",
    "## Anti-fit",
    line("Clients à éviter", af.avoid),
    line("Signaux disqualifiants", af.signals),
  ];
  return L.filter((l) => l !== "").join("\n");
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  let body: { data?: SpecData };
  try {
    body = (await req.json()) as { data?: SpecData };
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }
  const data = body.data || {};
  if (!data.offre?.what) {
    return Response.json({ error: "Décris au moins ce que tu vends." }, { status: 422 });
  }

  const brief = specToMarkdown(data);

  // Garde-fou rapide AVANT la génération coûteuse : si la saisie est
  // inexploitable, on renvoie les champs à retravailler sans brûler de tokens Opus.
  const check = await checkSpecSufficiency(brief);
  if (!check.sufficient && check.issues.length > 0) {
    return Response.json({ insufficient: true, issues: check.issues }, { status: 422 });
  }

  try {
    const out = await generateFromSpec(brief);
    return Response.json(out);
  } catch (err) {
    return Response.json(
      { error: (err as Error).message || "Génération échouée" },
      { status: 500 },
    );
  }
}
