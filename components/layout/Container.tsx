import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "main" | "header" | "footer";
}

export function Container({ children, className, as: Component = "div" }: ContainerProps) {
  return <Component className={cn("wrap", className)}>{children}</Component>;
}
