"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Remet la page en haut à chaque changement de route (sauf navigation vers une
 * ancre #section, qu'on laisse se positionner elle-même).
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}
