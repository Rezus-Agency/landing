import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  ariaLabel?: string;
}

export function Section({ children, className, id, ariaLabel }: SectionProps) {
  return (
    <section id={id} aria-label={ariaLabel} className={cn("py-20 sm:py-24 lg:py-32", className)}>
      {children}
    </section>
  );
}
