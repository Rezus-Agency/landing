"use client";

import { useEffect, useRef } from "react";

const CALENDLY_URL =
  "https://calendly.com/contact-renemarceau/rdv?hide_event_type_details=1&hide_gdpr_banner=1";
const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

interface CalendlyInlineProps {
  className?: string;
  /** Hauteur du widget en pixels. Calendly recommande 700. */
  height?: number;
}

/**
 * Widget Calendly inline (page /contact).
 *
 * On initialise le widget **explicitement** au montage (initInlineWidget) au lieu
 * de l'auto-init via `data-url` : l'auto-init ne se redéclenche pas en navigation
 * SPA (le script est déjà chargé, le nouveau conteneur reste vide), d'où le widget
 * qui n'apparaissait qu'au refresh.
 */
export function CalendlyInline({ className, height = 700 }: CalendlyInlineProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let poll: ReturnType<typeof setInterval> | null = null;
    let stopTimer: ReturnType<typeof setTimeout> | null = null;

    const init = () => {
      if (cancelled || !ref.current || !window.Calendly) return;
      // Reset du conteneur pour éviter un double iframe (StrictMode / re-montage).
      ref.current.innerHTML = "";
      window.Calendly.initInlineWidget({ url: CALENDLY_URL, parentElement: ref.current });
    };

    // S'assure que le script est demandé (laissé en place pour les visites suivantes).
    if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }

    // On attend que window.Calendly soit prêt par polling : robuste quel que soit
    // l'état du script (déjà chargé, en cours, event load manqué après une nav SPA).
    if (window.Calendly) {
      init();
    } else {
      poll = setInterval(() => {
        if (window.Calendly) {
          if (poll) clearInterval(poll);
          init();
        }
      }, 200);
      stopTimer = setTimeout(() => poll && clearInterval(poll), 20000); // garde-fou
    }

    return () => {
      cancelled = true;
      if (poll) clearInterval(poll);
      if (stopTimer) clearTimeout(stopTimer);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`calendly-inline-widget ${className ?? ""}`.trim()}
      style={{ minWidth: "320px", height: `${height}px` }}
    />
  );
}
