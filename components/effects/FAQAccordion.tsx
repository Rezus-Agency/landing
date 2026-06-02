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
        return (
          <div key={i} className={cn("faq-item", isOpen && "is-open")}>
            <button
              type="button"
              className="faq-q"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              {item.q}
              <span className="faq-q__icon">
                <PlusIcon />
              </span>
            </button>
            <div className="faq-a">
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
