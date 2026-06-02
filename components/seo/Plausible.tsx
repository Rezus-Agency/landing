import Script from "next/script";
import { PLAUSIBLE_DOMAIN } from "@/lib/seo";

/**
 * Plausible Analytics — privacy-first, no cookies, no consent banner needed.
 * Variant 'outbound-links' auto-tracks clicks on external links (sources ↗,
 * Calendly link if used, social links, etc).
 * Script ignores localhost by default — no events fired during dev.
 */
export function Plausible() {
  return (
    <Script
      defer
      data-domain={PLAUSIBLE_DOMAIN}
      src="https://plausible.io/js/script.outbound-links.js"
      strategy="afterInteractive"
    />
  );
}
