"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/icp-tool/ui/icons";
import { toast } from "@/components/icp-tool/ui/ToastProvider";

interface Props {
  text: string;
  label?: string;
  successLabel?: string;
  className?: string;
}

export function CopyButton({
  text,
  label = "Copier",
  successLabel = "Copié",
  className = "copy-btn",
}: Props) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback for non-secure contexts
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        // ignore
      }
      ta.remove();
    }
    setCopied(true);
    toast("Copié dans le presse-papier.");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      className={`${className} ${copied ? "copied" : ""}`}
      onClick={onClick}
    >
      {copied ? (
        <>
          <CheckIcon /> {successLabel}
        </>
      ) : (
        <>
          <CopyIcon /> {label}
        </>
      )}
    </button>
  );
}
