/**
 * Test isolé : un tour d'agent.
 * Usage: pnpm icp:turn "ton message"
 *
 * Affiche en streaming les events émis par l'orchestrator,
 * sans UI Ink. Permet de valider :
 *  - System prompt chargé
 *  - Streaming texte fonctionne
 *  - Tool use loop fonctionne (search_web déclenchée si besoin)
 *  - Cost ticker affiche les bons chiffres
 */
import { config as loadEnv } from "dotenv";
import pc from "picocolors";
import { freshSession, runTurn } from "../../lib/llm-core/agent/orchestrator";

loadEnv({ path: ".env.local" });

async function main() {
  const userMessage =
    process.argv.slice(2).join(" ") ||
    "On édite un SIRH pour PME. On cible les DRH de boîtes de 50 à 200 personnes.";

  console.log(pc.dim("\n============================================"));
  console.log(pc.bold("User: ") + userMessage);
  console.log(pc.dim("============================================\n"));

  const state = freshSession("manual_test");

  process.stdout.write(pc.bold("Bot: "));

  for await (const event of runTurn(state, userMessage, { cache: true })) {
    switch (event.type) {
      case "turn_start":
        process.stderr.write(
          pc.dim(`[router→${event.intent}|${event.model}] `),
        );
        break;
      case "text":
        process.stdout.write(pc.white(event.delta));
        break;
      case "thinking":
        process.stderr.write(pc.dim(event.delta));
        break;
      case "search_start":
        console.log(
          pc.cyan(`\n\n🔍 search_web("${event.query}") — ${pc.dim(event.reason)}`),
        );
        break;
      case "search_result":
        if (event.result.error) {
          console.log(
            pc.red(`   ✗ ${event.result.provider} failed: ${event.result.error}`),
          );
        } else {
          console.log(
            pc.green(
              `   ✓ ${event.result.results.length} sources via ${event.result.provider} (${event.result.latencyMs}ms, $${event.result.costUsd.toFixed(4)})`,
            ),
          );
          event.result.results.slice(0, 3).forEach((s, i) => {
            console.log(`     ${pc.dim(String(i + 1).padStart(2))} ${pc.cyan(s.site)} — ${s.title.slice(0, 70)}`);
          });
          console.log();
          process.stdout.write(pc.bold("Bot: "));
        }
        break;
      case "panel_patch": {
        const confColor =
          event.patch.confidence === "verified"
            ? pc.green
            : event.patch.confidence === "inferred"
              ? pc.yellow
              : pc.dim;
        console.log(
          pc.magenta(
            `\n\n📋 panel.${event.patch.section} ${confColor("[" + event.patch.confidence + "]")} (${event.patch.bullets.length} bullet${event.patch.bullets.length > 1 ? "s" : ""})`,
          ),
        );
        event.patch.bullets.forEach((b) => console.log(`     • ${pc.dim(b)}`));
        if (event.patch.sources.length > 0) {
          console.log(`     sources: ${event.patch.sources.map((s) => pc.cyan(s)).join(", ")}`);
        }
        console.log();
        process.stdout.write(pc.bold("Bot: "));
        break;
      }
      case "finalize_signal":
        console.log(pc.bgGreen(pc.black("\n\n[FINALIZE]")) + " " + pc.bold(event.segment_summary));
        break;
      case "cost":
        // Émis à la fin (pas pendant le streaming)
        break;
      case "turn_done":
        console.log(pc.dim(`\n\n[stop_reason=${event.stopReason}]`));
        break;
      case "error":
        console.log(pc.red(`\n[error ${event.code}] ${event.message}`));
        break;
    }
  }

  console.log(pc.dim("\n============================================"));
  console.log(
    pc.bold("Session totals: ") +
      `searches=${state.searchCount} cost=${pc.green("$" + state.totalUsd.toFixed(4))}`,
  );
  console.log(pc.dim("============================================\n"));
}

main().catch((err) => {
  console.error(pc.red("crashed:"), err);
  process.exit(1);
});
