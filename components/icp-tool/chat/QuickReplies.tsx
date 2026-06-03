"use client";

interface Props {
  options: string[];
  onPick: (text: string) => void;
}

export function QuickReplies({ options, onPick }: Props) {
  if (!options || options.length === 0) return null;
  return (
    <div className="quick">
      {options.map((opt, i) => (
        <button
          key={i}
          type="button"
          className={i === 0 ? "primary" : ""}
          onClick={() => onPick(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
