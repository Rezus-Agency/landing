import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
}

export function Logo({ className, href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="Rezus Agency — Accueil"
      className={cn(
        "group inline-flex items-center gap-1.5 transition-opacity hover:opacity-80",
        className,
      )}
    >
      <span className="text-foreground text-base font-semibold tracking-tight sm:text-lg">
        Rezus
      </span>
      <span className="bg-rezus-green inline-block h-1.5 w-1.5 rounded-full" aria-hidden="true" />
    </Link>
  );
}
