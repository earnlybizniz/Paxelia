'use client'

import { motion } from 'framer-motion'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useHome } from '@/contexts/home-context'
import { Section } from '@/components/shell/Section'
import { Reveal, RevealItem } from '@/components/shell/Reveal'
import { scaleReveal, stagger } from '@/lib/motion'

export function GuaranteeStrip() {
  const { guarantee } = useHome()

  return (
    <Section id="guarantee" tone="paper2">
      <Reveal staggerChildren={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
        {guarantee.items.map((item, i) => {
          // Dynamic icon lookup from lucide
          const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[item.icon] ?? LucideIcons.Shield
          return (
            <RevealItem key={i} variant="rise">
              <div className="flex flex-col items-center text-center gap-4">
                <motion.div
                  variants={scaleReveal}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center"
                >
                  <Icon size={22} className="text-[var(--accent)]" strokeWidth={1.5} />
                </motion.div>
                <div>
                  <p className="font-sans font-medium text-[var(--ink)] text-[0.9rem] mb-1">{item.title}</p>
                  <p className="font-sans text-[0.82rem] text-[var(--ink-mute)] leading-relaxed">{item.body}</p>
                </div>
              </div>
            </RevealItem>
          )
        })}
      </Reveal>
    </Section>
  )
}
