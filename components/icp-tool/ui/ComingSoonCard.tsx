"use client";

import { useRouter } from "next/navigation";
import { useToolStore } from "@/lib/icp-tool/store";
import { toast } from "./ToastProvider";
import { CheckIcon, ICON_MAP, LockIcon } from "./icons";
import type { ComingSoonFeature } from "@/lib/icp-tool/types";

interface Props {
  feature: ComingSoonFeature;
}

export function ComingSoonCard({ feature }: Props) {
  const router = useRouter();
  const isNotified = useToolStore((s) => s.isNotified(feature.id));
  const toggleNotify = useToolStore((s) => s.toggleNotify);

  const Icon = ICON_MAP[feature.icon] || LockIcon;

  const onCardClick = () => router.push(`/icp/tool/soon/${feature.id}`);
  const onNotifyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const on = toggleNotify(feature.id);
    toast(on ? "On vous prévient au lancement" : "Notification annulée.", "info");
  };

  return (
    <div
      className={`soon-card ${isNotified ? "notified" : ""}`}
      onClick={onCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCardClick();
        }
      }}
    >
      <div className="soon-card__top">
        <span className="soon-card__ic">
          <Icon />
        </span>
        <button
          type="button"
          className={`soon-card__notify ${isNotified ? "on" : ""}`}
          onClick={onNotifyClick}
          title={
            isNotified ? "Vous serez notifié, cliquez pour annuler" : "Être notifié au lancement"
          }
        >
          {isNotified ? (
            <>
              <CheckIcon /> Suivi
            </>
          ) : (
            <>
              <LockIcon /> Bientôt
            </>
          )}
        </button>
      </div>
      <h3>{feature.title}</h3>
      <p>{feature.desc}</p>
    </div>
  );
}
