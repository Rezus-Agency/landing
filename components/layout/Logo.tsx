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
        "group inline-flex items-baseline gap-1 transition-opacity hover:opacity-80",
        className,
      )}
    >
      <span className="text-foreground text-base font-semibold tracking-tight sm:text-[17px]">
        Rezus
      </span>
      <span
        className="bg-rezus-green mx-1 inline-block h-1 w-1 self-center rounded-full"
        aria-hidden="true"
      />
      <span className="text-muted-foreground text-base font-normal tracking-tight sm:text-[17px]">
        Agency
      </span>
    </Link>
  );
}
