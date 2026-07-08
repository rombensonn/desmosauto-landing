"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

export function FAQ({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="grid w-full min-w-0 max-w-4xl justify-self-stretch border-t border-neutral-300">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <div key={item.question} className="border-b border-neutral-300 bg-transparent">
            <button
              id={buttonId}
              type="button"
              className="grid min-h-16 w-full cursor-pointer grid-cols-[minmax(0,1fr)_2rem] items-center gap-3 px-0 py-4 text-left font-[var(--font-heading)] text-base font-bold text-neutral-950 sm:text-lg"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span className="min-w-0">{item.question}</span>
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-950"
              >
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="flex"
                >
                  <Plus size={18} />
                </motion.span>
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-3xl pb-5 pr-10 leading-7 text-neutral-700">{item.answer}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
