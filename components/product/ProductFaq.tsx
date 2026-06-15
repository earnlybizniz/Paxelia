'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useProduct } from '@/contexts/product-context'
import { Section } from '@/components/shell/Section'
import { Reveal } from '@/components/shell/Reveal'
import { Eyebrow, SectionHeading } from '@/components/shell/Typography'
import { cn } from '@/lib/utils'
import { E } from '@/lib/motion'

export function ProductFaq() {
  const { product } = useProduct()
  const [openIndex, setOpenIndex] = useState<number>(0)

  return (
    <Section id="faq" tone="paper">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <Reveal variant="rise">
            <Eyebrow className="mb-3">Got Questions?</Eyebrow>
          </Reveal>
          <Reveal variant="rise">
            <SectionHeading className="!text-[clamp(1.75rem,3vw,2.5rem)]">
              We&apos;ve got answers
            </SectionHeading>
          </Reveal>
        </div>

        {/* FAQ Items */}
        <div className="flex flex-col">
          {product.faq.map((item, i) => (
            <Reveal key={i} variant="rise" delay={i * 0.05}>
              <div className="border-b border-[var(--ink)]/10">
                <button
                  onClick={() => setOpenIndex(prev => (prev === i ? -1 : i))}
                  className="flex items-start justify-between gap-4 w-full py-5 text-left group"
                  aria-expanded={openIndex === i}
                >
                  <span className={cn(
                    'font-sans text-[1rem] font-medium transition-colors',
                    openIndex === i ? 'text-[var(--accent)]' : 'text-[var(--ink)] group-hover:text-[var(--accent)]'
                  )}>
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: E }}
                    className="text-[var(--ink-mute)] flex-shrink-0 mt-1"
                  >
                    <ChevronDown size={20} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: E }}
                      className="overflow-hidden"
                    >
                      <p className="font-sans text-[0.9rem] text-[var(--ink-soft)] leading-relaxed pb-5">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
