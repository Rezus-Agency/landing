"use client";

import Script from "next/script";

const CALENDLY_URL = "https://calendly.com/contact-renemarceau/rdv";

interface CalendlyInlineProps {
  /** Classe additionnelle posée à côté de .calendly-inline-widget (requise par widget.js). */
  className?: string;
  /** Hauteur du widget en pixels. Calendly recommande 700. */
  height?: number;
}

/**
 * Widget Calendly inline pour la page /contact.
 * Script chargé en lazyOnload pour ne pas bloquer le first paint.
 * Sur /contact, le script a le temps de charger avant que l'utilisateur
 * scrolle jusqu'à la section.
 */
export function CalendlyInline({ className, height = 700 }: CalendlyInlineProps) {
  return (
    <>
      <div
        className={`calendly-inline-widget ${className ?? ""}`.trim()}
        data-url={CALENDLY_URL}
        style={{ minWidth: "320px", height: `${height}px` }}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
    </>
  );
}
