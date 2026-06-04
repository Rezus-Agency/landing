/**
 * Vérifie que IcpPdf rend un vrai PDF (sans planter) pour un ICP nouveau shape
 * (golden) ET un ICP legacy (fallbacks panel/hooks/qualif). Écrit dans tmp/.
 *
 *   npx tsx scripts/icp-cli/test-pdf.tsx
 */
import { renderToFile } from "@react-pdf/renderer";
import { resolve } from "node:path";
import { statSync, mkdirSync } from "node:fs";
import { GOLDEN_ICP, LEGACY_ICP, THIN_ICP } from "../../lib/icp-tool/fixtures";
import { IcpPdf } from "../../components/icp-tool/doc/IcpPdf";

async function main() {
  mkdirSync(resolve(process.cwd(), "tmp"), { recursive: true });
  const cases: [string, typeof GOLDEN_ICP][] = [
    ["golden", GOLDEN_ICP],
    ["legacy", LEGACY_ICP],
    ["thin", THIN_ICP],
  ];
  for (const [name, icp] of cases) {
    const out = resolve(process.cwd(), `tmp/icp-pdf-${name}.pdf`);
    await renderToFile(<IcpPdf icp={icp} />, out);
    console.log(`✓ ${name.padEnd(7)} ${statSync(out).size} bytes → ${out}`);
  }
  console.log("\nPDF render OK pour les 3 cas.");
}

main().catch((e) => {
  console.error("PDF render FAILED:", e);
  process.exit(1);
});
