"use client";

/**
 * Carte de recherche animée — le wow factor.
 * - spinner orbit pendant que les steps se cochent un par un
 * - puis sources qui apparaissent en stagger
 * - état "done" avec un tick + sources cliquables
 */

import { useEffect, useState } from "react";
import type { Source } from "@/lib/icp-tool/types";
import { CheckIcon, ExternalIcon } from "@/components/icp-tool/ui/icons";
import { siteInitials } from "@/lib/icp-tool/format";

interface Props {
  label: string;
  steps: string[];
  sources: Source[];
  /** Appelé quand l'animation est terminée (utile pour avancer le moteur de chat). */
  onDone?: () => void;
}

type StepState = "off" | "on" | "ok";

export function ResearchCard({ label, steps, sources, onDone }: Props) {
  const [stepStates, setStepStates] = useState<StepState[]>(() => steps.map(() => "off"));
  const [shownSources, setShownSources] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    function setOne(i: number, state: StepState) {
      if (cancelled) return;
      setStepStates((prev) => {
        const next = prev.slice();
        next[i] = state;
        return next;
      });
    }

    function setSrcCount(n: number) {
      if (cancelled) return;
      setShownSources(n);
    }

    // Steps : 0.4s spinner, 0.4s ok, then next.
    const STEP_SPIN = 450;
    const STEP_OK = 250;
    const SRC_GAP = 180;

    let t = 100;
    steps.forEach((_, i) => {
      timers.push(setTimeout(() => setOne(i, "on"), t));
      t += STEP_SPIN;
      timers.push(setTimeout(() => setOne(i, "ok"), t));
      t += STEP_OK;
    });

    // Sources : appear after steps
    t += 200;
    sources.forEach((_, i) => {
      timers.push(setTimeout(() => setSrcCount(i + 1), t));
      t += SRC_GAP;
    });

    // Done
    timers.push(
      setTimeout(() => {
        if (cancelled) return;
        setDone(true);
        onDone?.();
      }, t + 300),
    );

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`research ${done ? "done" : ""}`}>
      <div className="research__head">
        <div className="research__orbit">
          <CheckIcon />
        </div>
        <div className="research__label">
          {done ? "Recherche terminée" : "Recherche en cours"}
          <span className="sub">{label}</span>
        </div>
      </div>
      <div className="research__steps">
        {steps.map((step, i) => (
          <div key={i} className={`research__step ${stepStates[i]}`}>
            <span className="tick" aria-hidden="true">
              {stepStates[i] === "ok" ? (
                <CheckIcon />
              ) : stepStates[i] === "on" ? (
                <span className="sp" />
              ) : (
                <span className="dot" />
              )}
            </span>
            <span>{step}</span>
          </div>
        ))}
      </div>
      {shownSources > 0 && (
        <div className="research__sources">
          <span className="lbl">Sources consultées</span>
          {sources.slice(0, shownSources).map((s, i) => (
            <a
              key={i}
              className="research__src show"
              href={s.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="favi">{siteInitials(s.site)}</span>
              <span className="meta">
                <span className="t">{s.title}</span>
                <span className="u">{s.site}</span>
              </span>
              <ExternalIcon className="ext" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
