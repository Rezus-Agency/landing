"use client";

interface ScrimProps {
  show: boolean;
  onClick: () => void;
}

export function Scrim({ show, onClick }: ScrimProps) {
  return <div className={`scrim ${show ? "show" : ""}`} onClick={onClick} aria-hidden="true" />;
}
