/**
 * Outil de recherche web unifié pour l'agent ICP.
 *
 * Stratégie :
 *   1. Linkup primaire (FR-first, sources sous licence)
 *   2. Tavily fallback si Linkup renvoie < 2 résultats ou erreur
 *   3. Si les deux échouent : { results: [], error: ... }, l'agent doit dire
 *      "aucune source trouvée", JAMAIS halluciner.
 *
 * Pas de "Powered by ..." côté UI. Le provider est exposé dans le résultat
 * pour transparence (logs, fixtures, debug), pas pour branding.
 */

import { tavily } from "@tavily/core";
import type { SearchResult, WebSource } from "../types";
import { priceSearch } from "../cost";

const MIN_RESULTS = 2;

export type SearchOptions = {
  query: string;
  language: "fr" | "en";
  depth: "fast" | "deep";
  /** Raison fournie par l'agent (logging, debug). */
  reason?: string;
};

/** Type minimal d'un résultat Linkup utilisé ici. */
type LinkupItem = {
  name?: string;
  title?: string;
  url: string;
  content?: string;
  snippet?: string;
  publishedAt?: string;
};

type LinkupResponse = {
  results?: LinkupItem[];
};

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

async function searchLinkup(opts: SearchOptions): Promise<SearchResult> {
  const key = process.env.LINKUP_API_KEY;
  const started = Date.now();
  if (!key) {
    return {
      query: opts.query,
      language: opts.language,
      depth: opts.depth,
      results: [],
      provider: "none",
      latencyMs: 0,
      costUsd: 0,
      error: "LINKUP_API_KEY not set",
    };
  }

  // Linkup standard depth = single search, deep = research mode.
  // On garde standard pour les recherches conversationnelles (latence < 2s).
  const linkupDepth = opts.depth === "deep" ? "deep" : "standard";

  try {
    const res = await fetch("https://api.linkup.so/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: opts.query,
        depth: linkupDepth,
        outputType: "searchResults",
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Linkup HTTP ${res.status}: ${body.slice(0, 200)}`);
    }
    const data = (await res.json()) as LinkupResponse;
    const items = data.results || [];

    const results: WebSource[] = items.slice(0, 6).map((it) => ({
      title: it.name || it.title || it.url,
      url: it.url,
      site: domainOf(it.url),
      snippet: it.content || it.snippet || undefined,
      provider: "linkup",
    }));

    return {
      query: opts.query,
      language: opts.language,
      depth: opts.depth,
      results,
      provider: "linkup",
      latencyMs: Date.now() - started,
      costUsd: priceSearch("linkup"),
    };
  } catch (err) {
    return {
      query: opts.query,
      language: opts.language,
      depth: opts.depth,
      results: [],
      provider: "linkup",
      latencyMs: Date.now() - started,
      costUsd: 0,
      error: (err as Error).message,
    };
  }
}

async function searchTavily(opts: SearchOptions): Promise<SearchResult> {
  const key = process.env.TAVILY_API_KEY;
  const started = Date.now();
  if (!key) {
    return {
      query: opts.query,
      language: opts.language,
      depth: opts.depth,
      results: [],
      provider: "none",
      latencyMs: 0,
      costUsd: 0,
      error: "TAVILY_API_KEY not set",
    };
  }
  try {
    const client = tavily({ apiKey: key });
    const r = await client.search(opts.query, {
      searchDepth: opts.depth === "deep" ? "advanced" : "advanced",
      maxResults: 6,
      includeRawContent: false,
    });

    const items = r.results || [];
    const results: WebSource[] = items.slice(0, 6).map((it) => ({
      title: it.title || it.url,
      url: it.url,
      site: domainOf(it.url),
      snippet: it.content || undefined,
      provider: "tavily",
    }));

    return {
      query: opts.query,
      language: opts.language,
      depth: opts.depth,
      results,
      provider: "tavily",
      latencyMs: Date.now() - started,
      costUsd: priceSearch("tavily"),
    };
  } catch (err) {
    return {
      query: opts.query,
      language: opts.language,
      depth: opts.depth,
      results: [],
      provider: "tavily",
      latencyMs: Date.now() - started,
      costUsd: 0,
      error: (err as Error).message,
    };
  }
}

/**
 * Recherche unifiée avec fallback automatique.
 * Renvoie toujours un SearchResult (jamais throw).
 */
export async function searchWeb(opts: SearchOptions): Promise<SearchResult> {
  const linkup = await searchLinkup(opts);
  if (linkup.results.length >= MIN_RESULTS) return linkup;

  // Fallback Tavily
  const tavilyRes = await searchTavily(opts);
  if (tavilyRes.results.length >= MIN_RESULTS) {
    // Cumul latence + coût du fallback dans la facture, mais on garde le résultat Tavily.
    return {
      ...tavilyRes,
      latencyMs: linkup.latencyMs + tavilyRes.latencyMs,
      costUsd: linkup.costUsd + tavilyRes.costUsd,
    };
  }

  // Les deux ont échoué ou renvoyé < MIN_RESULTS.
  return {
    query: opts.query,
    language: opts.language,
    depth: opts.depth,
    results: [],
    provider: "none",
    latencyMs: linkup.latencyMs + tavilyRes.latencyMs,
    costUsd: linkup.costUsd + tavilyRes.costUsd,
    error:
      linkup.error || tavilyRes.error || "Aucune source trouvée (Linkup + Tavily). Soyez plus spécifique.",
  };
}
