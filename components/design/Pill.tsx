import { cn } from "@/lib/utils";

type PillVariant = "default" | "rezus" | "old" | "muted";

interface PillProps {
  children: React.ReactNode;
  variant?: PillVariant;
  className?: string;
}

const variantClasses: Record<PillVariant, string> = {
  default: "border-border bg-card text-foreground",
  rezus: "border-rezus-green/30 bg-rezus-green/10 text-rezus-green",
  old: "border-rezus-red/30 bg-rezus-red/10 text-rezus-red",
  muted: "border-border bg-background text-muted-foreground",
};

export function Pill({ children, variant = "default", className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-xs tracking-wide uppercase",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
