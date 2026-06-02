"use client";

import { useEffect } from "react";

/**
 * Adds `js` to <html> and `is-ready` to the hero section after first paint.
 * Mirrors the rezus boot() hero entrance logic.
 */
export function HeroReady() {
  useEffect(() => {
    document.documentElement.classList.add("js");
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => hero.classList.add("is-ready"));
    });
    return () => cancelAnimationFrame(id);
  }, []);
  return null;
}
