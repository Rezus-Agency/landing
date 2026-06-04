/**
 * Test E2E : reproduit une vraie session chat jusqu'au finalize_icp,
 * vérifie que le LLM produit nativement les 11 champs structurés.
 *
 * Pas de complete-doc, pas de hack : c'est la chaîne réelle du chatbot.
 * Si ce test passe, finalize_icp marche end-to-end.
 *
 * En sortie : un fichier tmp/icp-finalized.json contenant l'ICP produit
 * (utilisé ensuite par scripts/inject-icp.cjs pour seed dans le navigateur).
 */
import { config as loadEnv } from "dotenv";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import pc from "picocolors";
import {
  freshSession,
  runTurn,
  seedIntro,
} from "../../lib/llm-core/agent/orchestrator";
import type { SessionState } from "../../lib/llm-core/types";

loadEnv({ path: ".env.local" });

// Conversation conçue pour mûrir l'ICP en ~5 tours puis demander la génération.
const TURNS = [
  "Je vends un service GTM clé en main : positionnement + outbound email + ICP definition pour des agences IA B2B françaises. J'ai background full-stack + AI engineering, je vise des fondateurs techniques qui ont du mal à structurer leur prospection.",
  "Cible : agences de dev ou intégration IA, 5 à 15 personnes, fondées depuis 12 à 30 mois, en France. Fondateur ou co-fondateur technique au commande. Pas de DSI, pas de comité d'achat.",
  "Aucune idée des chiffres exacts, mais je sens qu'on parle d'un marché autour de 300-500 agences IA actives en France, probablement 100-150 atteignables sur 12 mois avec un outbound bien fait. Le cycle de vente est court : 2-3 semaines une fois le décideur identifié.",
  "Côté psychologie : ce fondateur vit dans Slack et Notion, ignore LinkedIn, méfiant des SDR génériques. Convaincu par un pair technique qui parle sa langue, pas par un commercial. Sa douleur principale : réseau de lancement épuisé et aucun système de prospection structuré, donc pipeline en chute.",
  "Ok je pense qu'on a tout ce qu'il faut. Génère l'analyse complète.",
];

async function collectTurn(state: SessionState, userMsg: string) {
  let text = "";
  let intent = "";
  let model = "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let finalDoc: any = null;
  const searches: string[] = [];
  const panels: string[] = [];
  for await (const event of runTurn(state, userMsg, { cache: true })) {
    switch (event.type) {
      case "turn_start":
        intent = event.intent;
        model = event.model;
        break;
      case "text":
        text += event.delta;
        break;
      case "search_start":
        searches.push(event.query);
        break;
      case "panel_patch":
        panels.push(event.patch.section);
        break;
      case "finalize_signal":
        finalDoc = event.doc;
        break;
      case "error":
        console.log(pc.red(`    [error] ${event.code}: ${event.message}`));
        break;
    }
  }
  return { text, intent, model, searches, panels, finalDoc };
}

async function main() {
  console.log(pc.bold("\n=== Test E2E : chat → finalize_icp → doc complet ===\n"));
  const state = freshSession("test_finalize");
  seedIntro(state);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let finalDoc: any = null;
  for (let i = 0; i < TURNS.length; i++) {
    const msg = TURNS[i];
    console.log(
      pc.cyan(`\nTour ${i + 1}/${TURNS.length} : "${msg.slice(0, 70)}…"`),
    );
    const t0 = Date.now();
    const r = await collectTurn(state, msg);
    const dt = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(
      pc.dim(
        `  → ${r.intent}/${r.model} | ${dt}s | searches=${r.searches.length} panels=${r.panels.length} text=${r.text.length}c`,
      ),
    );
    if (r.finalDoc) {
      finalDoc = r.finalDoc;
      console.log(pc.green("  ✓ finalize_signal reçu"));
      break;
    }
  }

  if (!finalDoc) {
    console.log(pc.red("\n✗ Le bot n'a pas appelé finalize_icp après 5 tours."));
    console.log(pc.dim(`Cost final : $${state.totalUsd.toFixed(4)}`));
    process.exit(1);
  }

  console.log(pc.bold("\n--- Vérification des champs structurés ---"));

  const REQUIRED = [
    "segment_summary", "synthese", "reframe", "identite", "psychologie",
    "marche", "challenges", "avantages", "salesnav", "clay",
    "scorecard", "triggers", "enrichment", "antifit", "angles",
  ];

  let failures = 0;
  for (const field of REQUIRED) {
    const v = finalDoc[field];
    const ok = v !== undefined && v !== null &&
      (typeof v === "string" ? v.length > 0 : true) &&
      (Array.isArray(v) ? v.length > 0 : true);
    if (ok) {
      const summary = Array.isArray(v)
        ? `[${v.length} items]`
        : typeof v === "object"
          ? `{${Object.keys(v).length} keys}`
          : `"${String(v).slice(0, 55)}${String(v).length > 55 ? "..." : ""}"`;
      console.log(pc.green(`  ✓ ${field.padEnd(20)} ${pc.dim(summary)}`));
    } else {
      console.log(pc.red(`  ✗ ${field.padEnd(20)} MISSING`));
      failures += 1;
    }
  }

  // Save the doc to a fixture for Puppeteer injection later
  const outDir = resolve(process.cwd(), "tmp");
  mkdirSync(outDir, { recursive: true });
  const outPath = resolve(outDir, "icp-finalized.json");
  const icpForBrowser = {
    id: "icp_test_" + Date.now().toString(36),
    segment: finalDoc.segment_summary,
    status: "final",
    version: 1,
    createdAt: new Date().toISOString().slice(0, 10),
    synthese: finalDoc.synthese,
    identite: finalDoc.identite,
    psychologie: finalDoc.psychologie,
    marche: finalDoc.marche,
    challenges: finalDoc.challenges,
    avantages: finalDoc.avantages,
    salesnav: finalDoc.salesnav,
    clay: finalDoc.clay,
    reframe: finalDoc.reframe,
    angles: finalDoc.angles,
    triggers: finalDoc.triggers,
    enrichment: finalDoc.enrichment,
    antifit: finalDoc.antifit,
    scorecard: finalDoc.scorecard,
    sources: finalDoc.marche?.sources || [],
    panel: state.panel,
  };
  writeFileSync(outPath, JSON.stringify(icpForBrowser, null, 2));
  console.log(pc.dim(`\nICP fixture saved → ${outPath}`));

  console.log(pc.bold("\n=== Summary ==="));
  if (failures === 0) {
    console.log(pc.green(`✓ Tous les 11 champs produits.`));
    console.log(pc.dim(`Cost session : $${state.totalUsd.toFixed(4)}`));
    process.exit(0);
  } else {
    console.log(pc.red(`✗ ${failures} champs manquants.`));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(pc.red("CRASH:"), err);
  process.exit(1);
});
