"use client";

import { useEffect, useRef } from "react";

interface CursorGlowProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps children in a div that tracks pointer position via CSS variables
 * (--mx, --my) — used by .finalcta__box for the cursor-aware glow.
 */
export function CursorGlow({ children, className }: CursorGlowProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
