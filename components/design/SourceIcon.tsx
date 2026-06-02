import { ArrowUpRight } from "lucide-react";
import { SOURCES, type SourceId } from "@/lib/sources";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SourceIconProps {
  sourceId: SourceId;
  className?: string;
}

export function SourceIcon({ sourceId, className }: SourceIconProps) {
  const source = SOURCES[sourceId];

  if (!source) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Source : ${source.name} (${source.year})`}
          className={cn(
            "text-muted-foreground hover:text-foreground inline-flex h-5 w-5 items-center justify-center rounded transition-colors",
            className,
          )}
        >
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
        </a>
      </TooltipTrigger>
      <TooltipContent className="font-mono text-xs">
        {source.name} · {source.year}
      </TooltipContent>
    </Tooltip>
  );
}
