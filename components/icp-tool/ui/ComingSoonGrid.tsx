"use client";

import { useToolStore } from "@/lib/icp-tool/store";
import { COMING_SOON } from "@/lib/icp-tool/mock-data";
import { ComingSoonCard } from "./ComingSoonCard";
import { CheckIcon } from "./icons";

export function ComingSoonGrid() {
  const notifyCount = useToolStore((s) => s.notify.length);

  return (
    <>
      <div className="soon-head">
        <h2>Bientôt disponible</h2>
        <span className="badge badge--draft">Roadmap</span>
        <span className="line" />
        {notifyCount > 0 && (
          <span className="soon-head__count">
            <CheckIcon /> {notifyCount} suivi{notifyCount > 1 ? "s" : ""}
          </span>
        )}
      </div>
      <div className="soon-grid">
        {COMING_SOON.map((feature) => (
          <ComingSoonCard key={feature.id} feature={feature} />
        ))}
      </div>
    </>
  );
}
