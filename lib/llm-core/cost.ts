/**
 * Pricing par MTok pour Anthropic + recherche.
 * Source : Anthropic pricing page (mid-2026).
 * Le cost ticker du CLI utilise ces tables.
 */

import type { TokenUsage } from "./types";

export type AnthropicModel =
  | "claude-opus-4-8"
  | "claude-sonnet-4-6"
  | "claude-haiku-4-5";

type ModelPricing = {
  /** USD per million input tokens. */
  input: number;
  /** USD per million output tokens. */
  output: number;
  /** Cache read = 10% of input. */
  cacheRead: number;
  /** Cache 1h write = 2x input. Cache 5min write = 1.25x input. On utilise 1h. */
  cacheWrite: number;
};

export const PRICING: Record<AnthropicModel, ModelPricing> = {
  "claude-opus-4-8": { input: 5, output: 25, cacheRead: 0.5, cacheWrite: 10 },
  "claude-sonnet-4-6": { input: 3, output: 15, cacheRead: 0.3, cacheWrite: 6 },
  "claude-haiku-4-5": { input: 1, output: 5, cacheRead: 0.1, cacheWrite: 2 },
};

/** Coût d'un appel donné en USD. */
export function priceCall(model: AnthropicModel, usage: TokenUsage): number {
  const p = PRICING[model];
  const inputCost = (usage.input * p.input) / 1_000_000;
  const cacheReadCost = (usage.cachedInput * p.cacheRead) / 1_000_000;
  const cacheWriteCost = (usage.cacheCreation * p.cacheWrite) / 1_000_000;
  const outputCost = (usage.output * p.output) / 1_000_000;
  return inputCost + cacheReadCost + cacheWriteCost + outputCost;
}

/** Coût d'une recherche selon le provider. */
export function priceSearch(provider: "linkup" | "tavily" | "none"): number {
  switch (provider) {
    case "linkup":
      // Estimation à confirmer avec sales Linkup. Hypothèse $0.02/search standard.
      return 0.02;
    case "tavily":
      // Advanced = 2 credits @ $0.008/credit = $0.016.
      return 0.016;
    case "none":
      return 0;
  }
}

export function formatUsd(usd: number): string {
  if (usd < 0.01) return `$${(usd * 1000).toFixed(2)}m`;
  return `$${usd.toFixed(4)}`;
}
