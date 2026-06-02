/**
 * Wrapper for Plausible custom events.
 * Safe to call in any client component — no-op if Plausible not loaded
 * (dev / localhost / blocked).
 *
 * Usage:
 *   import { track } from "@/lib/analytics";
 *   track("Contact form submitted");
 *   track("Custom event", { source: "hero", value: 42 });
 */
type PlausibleProps = Record<string, string | number | boolean>;

type PlausibleFunction = (event: string, options?: { props?: PlausibleProps }) => void;

declare global {
  interface Window {
    plausible?: PlausibleFunction;
  }
}

export function track(event: string, props?: PlausibleProps) {
  if (typeof window === "undefined") return;
  if (typeof window.plausible !== "function") return;
  window.plausible(event, props ? { props } : undefined);
}
