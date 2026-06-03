/**
 * Smoke test — vérifie que les 3 APIs (Anthropic, Linkup, Tavily) fonctionnent.
 * Run: pnpm icp:smoke
 *
 * Pour chaque API:
 * 1. Charge la clé depuis .env.local
 * 2. Fait un call minimal
 * 3. Affiche succès + latence + petit échantillon de réponse
 * 4. Sort 0 si tout OK, 1 sinon
 */
import { config as loadEnv } from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
import { tavily } from "@tavily/core";
import pc from "picocolors";

loadEnv({ path: ".env.local" });

type CheckResult = {
  name: string;
  ok: boolean;
  latencyMs: number;
  detail: string;
  error?: string;
};

async function timed<T>(fn: () => Promise<T>): Promise<{ ms: number; value?: T; error?: unknown }> {
  const t = Date.now();
  try {
    const value = await fn();
    return { ms: Date.now() - t, value };
  } catch (error) {
    return { ms: Date.now() - t, error };
  }
}

async function checkAnthropic(): Promise<CheckResult> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || key === "TODO") {
    return { name: "Anthropic", ok: false, latencyMs: 0, detail: "key missing", error: "ANTHROPIC_API_KEY not set" };
  }
  const client = new Anthropic({ apiKey: key });
  const result = await timed(() =>
    client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 30,
      messages: [{ role: "user", content: "Réponds exactement: 'pong'" }],
    }),
  );
  if (result.error) {
    return {
      name: "Anthropic",
      ok: false,
      latencyMs: result.ms,
      detail: "call failed",
      error: String((result.error as Error)?.message || result.error),
    };
  }
  const text =
    result.value!.content[0]?.type === "text" ? result.value!.content[0].text : "(non-text)";
  return {
    name: "Anthropic",
    ok: true,
    latencyMs: result.ms,
    detail: `model=claude-haiku-4-5, reply="${text.trim()}"`,
  };
}

async function checkLinkup(): Promise<CheckResult> {
  const key = process.env.LINKUP_API_KEY;
  if (!key || key === "TODO") {
    return { name: "Linkup", ok: false, latencyMs: 0, detail: "key missing", error: "LINKUP_API_KEY not set" };
  }
  const result = await timed(async () => {
    const res = await fetch("https://api.linkup.so/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: "marché SIRH France 2025",
        depth: "standard",
        outputType: "searchResults",
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    return (await res.json()) as { results?: Array<{ name?: string; url?: string }> };
  });
  if (result.error) {
    return {
      name: "Linkup",
      ok: false,
      latencyMs: result.ms,
      detail: "call failed",
      error: String((result.error as Error)?.message || result.error),
    };
  }
  const data = result.value!;
  const count = data.results?.length || 0;
  const first = data.results?.[0];
  return {
    name: "Linkup",
    ok: count > 0,
    latencyMs: result.ms,
    detail: `${count} results, first: "${first?.name?.slice(0, 60) || "?"}" — ${first?.url || "?"}`,
  };
}

async function checkTavily(): Promise<CheckResult> {
  const key = process.env.TAVILY_API_KEY;
  if (!key || key === "TODO") {
    return { name: "Tavily", ok: false, latencyMs: 0, detail: "key missing", error: "TAVILY_API_KEY not set" };
  }
  const client = tavily({ apiKey: key });
  const result = await timed(() =>
    client.search("marché SIRH France 2025", { searchDepth: "advanced", maxResults: 3 }),
  );
  if (result.error) {
    return {
      name: "Tavily",
      ok: false,
      latencyMs: result.ms,
      detail: "call failed",
      error: String((result.error as Error)?.message || result.error),
    };
  }
  const data = result.value!;
  const count = data.results?.length || 0;
  const first = data.results?.[0];
  return {
    name: "Tavily",
    ok: count > 0,
    latencyMs: result.ms,
    detail: `${count} results, first: "${first?.title?.slice(0, 60) || "?"}" — ${first?.url || "?"}`,
  };
}

async function main() {
  console.log(pc.bold("\nSmoke test — 3 APIs"));
  console.log(pc.dim("============================================"));

  const checks = await Promise.all([checkAnthropic(), checkLinkup(), checkTavily()]);

  let allOk = true;
  for (const c of checks) {
    const status = c.ok ? pc.green("✓") : pc.red("✗");
    const name = pc.bold(c.name.padEnd(10));
    const lat = pc.dim(`${c.latencyMs}ms`.padStart(7));
    console.log(`${status} ${name} ${lat}  ${c.detail}`);
    if (c.error) console.log(`  ${pc.red("error:")} ${c.error}`);
    if (!c.ok) allOk = false;
  }

  console.log(pc.dim("============================================"));
  if (allOk) {
    console.log(pc.green("\nAll APIs reachable. Ready for C.4.2.\n"));
    process.exit(0);
  } else {
    console.log(pc.red("\nOne or more APIs failed. Fix before continuing.\n"));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(pc.red("Smoke test crashed:"), err);
  process.exit(1);
});
