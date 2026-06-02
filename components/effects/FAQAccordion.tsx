"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/icons";
import type { FAQItem } from "@/lib/faq-items";
import { cn } from "@/lib/utils";

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const qId = `faq-q-${i}`;
        const aId = `faq-a-${i}`;
        return (
          <div key={i} className={cn("faq-item", isOpen && "is-open")}>
            <button
              type="button"
              id={qId}
              className="faq-q"
              aria-expanded={isOpen}
              aria-controls={aId}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              {item.q}
              <span className="faq-q__icon" aria-hidden="true">
                <PlusIcon />
              </span>
            </button>
            <div id={aId} role="region" aria-labelledby={qId} className="faq-a">
              <div className="faq-a__inner">
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
