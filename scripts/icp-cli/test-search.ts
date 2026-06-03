/**
 * Test isolé du tool search_web (Linkup + Tavily fallback).
 * Usage: pnpm icp:search "ta requête"
 */
import { config as loadEnv } from "dotenv";
import pc from "picocolors";
import { searchWeb } from "../../lib/llm-core/tools/search-web";

loadEnv({ path: ".env.local" });

async function main() {
  const query = process.argv.slice(2).join(" ") || "marché SIRH France 2025";
  console.log(pc.bold(`\nsearch_web("${query}")\n`));

  const result = await searchWeb({
    query,
    language: "fr",
    depth: "fast",
    reason: "test isolé CLI",
  });

  const status = result.results.length > 0 ? pc.green("✓") : pc.red("✗");
  console.log(
    `${status} provider=${pc.cyan(result.provider)} latency=${result.latencyMs}ms cost=${pc.dim("$" + result.costUsd.toFixed(4))}`,
  );

  if (result.error) {
    console.log(pc.red(`  error: ${result.error}`));
  }

  console.log();
  result.results.forEach((src, i) => {
    console.log(`  ${pc.dim(String(i + 1).padStart(2, "0"))}  ${pc.bold(src.title.slice(0, 80))}`);
    console.log(`      ${pc.cyan(src.url)}`);
    if (src.snippet) {
      console.log(`      ${pc.dim(src.snippet.slice(0, 150))}`);
    }
    console.log();
  });
}

main().catch((err) => {
  console.error(pc.red("crashed:"), err);
  process.exit(1);
});
