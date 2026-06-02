/**
 * Centralized SEO constants for Rezus Agency.
 * Edit here once, propagates everywhere (sitemap, metadata, JSON-LD).
 */

export const SITE = {
  name: "Rezus Agency",
  url: "https://rezus-agency.com",
  shortDescription:
    "Agence d'outbound B2B pour fondateurs tech francophones. Du ciblage, pas du volume.",
  tagline: "Outbound qui n'a rien à voir avec du spam.",
  locale: "fr_FR",
  language: "fr-FR",
  twitterHandle: "@RezusAgency",
  email: "hello@rezus.agency",
  country: "France",
  founderName: "René Marceau",
} as const;

/** Plausible Analytics — domaine à tracker (production). */
export const PLAUSIBLE_DOMAIN = "rezus-agency.com";

/** Google Search Console verification token. À remplacer après création de la propriété GSC. */
export const GSC_VERIFICATION = "TOFILL_GOOGLE_SEARCH_CONSOLE_TOKEN";

export const ROUTES = [
  { path: "/", priority: 1.0, changefreq: "weekly" as const },
  { path: "/methode", priority: 0.9, changefreq: "monthly" as const },
  { path: "/icp", priority: 0.9, changefreq: "monthly" as const },
  { path: "/contact", priority: 0.8, changefreq: "monthly" as const },
  { path: "/mentions-legales", priority: 0.3, changefreq: "yearly" as const },
  { path: "/politique-confidentialite", priority: 0.3, changefreq: "yearly" as const },
] as const;

export function absoluteUrl(path: string): string {
  return `${SITE.url}${path}`;
}

export function ogImageUrl(title: string, eyebrow?: string): string {
  const params = new URLSearchParams({ title });
  if (eyebrow) params.set("eyebrow", eyebrow);
  return `${SITE.url}/api/og?${params.toString()}`;
}
