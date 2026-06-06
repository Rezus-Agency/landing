"use client";

import { InlineWidget } from "react-calendly";

const CALENDLY_URL = "https://calendly.com/contact-renemarceau/rdv";

interface CalendlyInlineProps {
  className?: string;
  /** Hauteur du widget en pixels. Calendly recommande 700. */
  height?: number;
}

/**
 * Widget Calendly inline (page /contact).
 *
 * On délègue à `react-calendly` (InlineWidget) : la librairie gère le chargement
 * du script, l'initialisation et surtout la ré-initialisation à chaque montage
 * du composant. C'est ce qui corrige le cas "calendrier vide en navigation SPA"
 * (l'auto-init natif de Calendly ne se redéclenchait pas sans rechargement).
 */
export function CalendlyInline({ className, height = 700 }: CalendlyInlineProps) {
  return (
    <InlineWidget
      url={CALENDLY_URL}
      className={className}
      styles={{ minWidth: "320px", height: `${height}px` }}
      pageSettings={{ hideEventTypeDetails: true, hideGdprBanner: true }}
    />
  );
}
