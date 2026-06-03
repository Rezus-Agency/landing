/**
 * Test multi-tours : simule une conversation pour vérifier que le panel se remplit.
 * Usage: pnpm icp:multi
 */
import { config as loadEnv } from "dotenv";
import pc from "picocolors";
import { freshSession, runTurn } from "../../lib/llm-core/agent/orchestrator";

loadEnv({ path: ".env.local" });

const SCRIPT_USER_TURNS = [
  "On édite un SIRH pour PME, on cible les DRH de boîtes 50 à 200 personnes.",
  "Notre force c'est la gestion multi-sites et la conformité paie complexe (conventions collectives). Nos meilleurs clients sont souvent des PME industrielles en région.",
  "Oui, on a vu que les Responsables RH dans ces boîtes sont méfiants envers les outils parisiens et veulent surtout du fiable et du support humain. Ils se forment au bouche-à-oreille sectoriel.",
];

async function main() {
  const state = freshSession("multi_test_hrtech");
  console.log(pc.bold("\n=== Multi-turn test ===\n"));

  for (let i = 0; i < SCRIPT_USER_TURNS.length; i++) {
    const userMsg = SCRIPT_USER_TURNS[i];
    console.log(pc.dim(`────── tour ${i + 1} ──────`));
    console.log(pc.bold(pc.blue("User: ")) + userMsg + "\n");
    process.stdout.write(pc.bold("Bot: "));

    let panelPatchCount = 0;
    let searchCount = 0;
    for await (const event of runTurn(state, userMsg, { cache: true })) {
      switch (event.type) {
        case "turn_start":
          process.stderr.write(pc.dim(`[${event.intent}|${event.model}] `));
          break;
        case "text":
          process.stdout.write(event.delta);
          break;
        case "search_start":
          console.log(pc.cyan(`\n  🔍 search: "${event.query}"`));
          searchCount += 1;
          break;
        case "search_result":
          if (event.result.error) {
            console.log(pc.red(`     ✗ ${event.result.error}`));
          } else {
            console.log(
              pc.green(
                `     ✓ ${event.result.results.length} sources via ${event.result.provider} (${event.result.latencyMs}ms)`,
              ),
            );
          }
          process.stdout.write(pc.bold("\n  Bot: "));
          break;
        case "panel_patch":
          panelPatchCount += 1;
          console.log(
            pc.magenta(
              `\n  📋 panel.${event.patch.section} [${event.patch.confidence}] ${event.patch.bullets.length} bullet(s)`,
            ),
          );
          event.patch.bullets.forEach((b) => console.log(`     • ${pc.dim(b.slice(0, 100))}`));
          process.stdout.write(pc.bold("\n  Bot: "));
          break;
      }
    }
    console.log(
      pc.dim(
        `\n   [searches=${searchCount} panels=${panelPatchCount} session=$${state.totalUsd.toFixed(4)}]\n`,
      ),
    );
  }

  // Résumé final du panel
  console.log(pc.bold("\n=== Panel final ===\n"));
  const sections = [
    "synthese",
    "identite",
    "psychologie",
    "marche",
    "challenges",
    "avantages",
  ] as const;
  for (const s of sections) {
    const v = state.panel[s];
    if (!v) {
      console.log(pc.dim(`  ${s.padEnd(14)} : (empty)`));
    } else {
      const confColor =
        v.confidence === "verified"
          ? pc.green
          : v.confidence === "inferred"
            ? pc.yellow
            : pc.dim;
      console.log(
        `  ${pc.bold(s.padEnd(14))} ${confColor("[" + v.confidence + "]")} ${v.bullets.length} bullets, ${v.sources.length} src`,
      );
    }
  }

  console.log(
    pc.dim(
      `\nTotal session: ${SCRIPT_USER_TURNS.length} turns, ${state.searchCount} searches, ${state.toolCalls.length} tool calls, $${state.totalUsd.toFixed(4)}\n`,
    ),
  );
}

main().catch((err) => {
  console.error(pc.red("crashed:"), err);
  process.exit(1);
});
