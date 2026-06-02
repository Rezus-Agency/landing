import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, href = "/", size = "md" }: LogoProps) {
  return (
    <Link href={href} className={cn("logo group", className)}>
      <span className="logo__mark">Rezus</span>
      <span className="logo__word">Agency</span>
    </Link>
  );
}
