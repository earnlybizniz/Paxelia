// components/academy/ui/accordion.tsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export type FaqItem = { q: string; a: string }

export function FaqAccordion({ items, className }: { items: FaqItem[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div
      className={cn(
        "divide-y divide-[var(--omni-line)] rounded-3xl border border-[var(--omni-line)] bg-white",
        className,
      )}
    >
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={i} className="px-6">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-display text-base font-semibold text-[var(--omni-ink)] sm:text-lg">{item.q}</span>
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--omni-line)] text-[var(--omni-ink-soft)] transition-all duration-300",
                  isOpen && "rotate-45 border-[var(--omni-brand)]/40 bg-[var(--omni-brand-soft)] text-[var(--omni-brand)]",
                )}
              >
                <Plus className="h-4 w-4" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.21, 0.5, 0.26, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 pr-12 text-[15px] leading-relaxed text-[var(--omni-ink-soft)]">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
