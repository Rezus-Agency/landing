"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SourceIcon } from "@/components/design/SourceIcon";
import type { SourceId } from "@/lib/sources";

interface OldNewRowProps {
  number: number;
  title: string;
  oldText: string;
  newText: string;
  sourceId?: SourceId;
  index?: number;
}

export function OldNewRow({
  number,
  title,
  oldText,
  newText,
  sourceId,
  index = 0,
}: OldNewRowProps) {
  const numberStr = String(number).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.03, 0.2), ease: [0.21, 0.5, 0.51, 1] }}
      className="border-border group border-b py-8 last:border-b-0 sm:py-10"
    >
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-4 sm:grid-cols-[auto_1fr] sm:gap-x-8 lg:grid-cols-[auto_1fr_1fr] lg:gap-x-10">
        {/* Number + Title (full width on mobile, left col on lg) */}
        <div className="col-span-2 flex items-baseline gap-3 lg:col-span-1 lg:flex-col lg:items-start lg:gap-2">
          <span className={cn("text-muted-foreground/60 font-mono text-xs", "lg:text-sm")}>
            {numberStr}
          </span>
          <h3 className="text-foreground text-lg leading-tight font-medium tracking-tight sm:text-xl lg:text-2xl">
            {title}
          </h3>
        </div>

        {/* Old Way */}
        <div className="border-rezus-red/30 col-span-2 flex items-start gap-3 border-l-2 pl-4 sm:col-span-2 lg:col-span-1 lg:border-l-2 lg:pl-5">
          <X
            className="text-rezus-red mt-0.5 h-4 w-4 shrink-0"
            strokeWidth={2.5}
            aria-label="Ancien monde"
          />
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-[15px]">{oldText}</p>
        </div>

        {/* New Way (Rezus) */}
        <div className="border-rezus-green/30 col-span-2 flex items-start gap-3 border-l-2 pl-4 sm:col-span-2 lg:col-span-1 lg:border-l-2 lg:pl-5">
          <Check
            className="text-rezus-green mt-0.5 h-4 w-4 shrink-0"
            strokeWidth={2.5}
            aria-label="Rezus"
          />
          <p className="text-foreground flex flex-wrap items-baseline gap-x-2 text-sm leading-relaxed sm:text-[15px]">
            <span>{newText}</span>
            {sourceId && (
              <span className="inline-flex translate-y-0.5">
                <SourceIcon sourceId={sourceId} />
              </span>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
