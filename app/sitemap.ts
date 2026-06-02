import type { MetadataRoute } from "next";
import { ROUTES, SITE } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-06-02");
  return ROUTES.map((r) => ({
    url: `${SITE.url}${r.path}`,
    lastModified,
    changeFrequency: r.changefreq,
    priority: r.priority,
  }));
}
