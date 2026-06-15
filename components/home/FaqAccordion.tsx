'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import { useHome } from '@/contexts/home-context'
import { Section } from '@/components/shell/Section'
import { Reveal, RevealItem } from '@/components/shell/Reveal'
import { Eyebrow, SectionHeading } from '@/components/shell/Typography'
import { stagger, E } from '@/lib/motion'

export function FaqAccordion() {
  const { faq } = useHome()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <Section id="faq" tone="paper3" wash>
      <div className="max-w-[720px] mx-auto">
        <Reveal variant="rise" className="flex flex-col gap-3 mb-12 text-center">
          <Eyebrow className="justify-center">{faq.eyebrow}</Eyebrow>
          <SectionHeading className="max-w-[22ch] mx-auto">{faq.heading}</SectionHeading>
        </Reveal>

        <div className="flex flex-col divide-y divide-[var(--ink)]/8">
          {faq.items.map((item, i) => (
            <RevealItem key={i} variant="rise">
              <div>
                <button
                  className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  aria-controls={`faq-${i}`}
                  id={`faq-btn-${i}`}
                >
                  <span
                    className="font-sans text-[0.95rem] text-[var(--ink-soft)] font-medium leading-snug group-hover:text-[var(--accent)] transition-colors duration-200"
                  >
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: E }}
                    className="shrink-0 text-[var(--ink-mute)] group-hover:text-[var(--accent)] transition-colors"
                  >
                    <Plus size={18} strokeWidth={1.5} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      key="content"
                      id={`faq-${i}`}
                      role="region"
                      aria-labelledby={`faq-btn-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: E }}
                      className="overflow-hidden"
                    >
                      <p className="font-sans text-[0.9rem] text-[var(--ink-soft)] leading-relaxed pb-6 pr-8">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </RevealItem>
          ))}
        </div>
      </div>
    </Section>
  )
}
