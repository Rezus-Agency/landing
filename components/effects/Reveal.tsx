"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: 1 | 2 | 3;
  as?: "div" | "section" | "article" | "span" | "p" | "li" | "ul";
  style?: React.CSSProperties;
  id?: string;
}

/**
 * Wraps children in a .reveal element that animates in (fade + slight Y + blur)
 * when it enters the viewport. Mirrors the rezus initReveal() logic.
 */
export function Reveal({
  children,
  className,
  delay,
  as: Component = "div",
  style,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Component
      // @ts-expect-error — ref type varies with `as`
      ref={ref}
      id={id}
      className={cn("reveal", className)}
      style={style}
      {...(delay ? { "data-delay": String(delay) } : {})}
    >
      {children}
    </Component>
  );
}
