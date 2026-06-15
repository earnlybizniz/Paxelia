'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useHome } from '@/contexts/home-context'
import { Section } from '@/components/shell/Section'
import { Reveal, RevealItem } from '@/components/shell/Reveal'
import { Eyebrow, SectionHeading } from '@/components/shell/Typography'
import { stagger, checkPop, slideL, slideR } from '@/lib/motion'

export function ProblemSolution() {
  const { problemSolution: ps } = useHome()
  const reduced = useReducedMotion()

  return (
    <Section id="problem" tone="paper2" wash>
      <div className="flex flex-col gap-10">
        <Reveal variant="rise" className="flex flex-col gap-3">
          <Eyebrow>{ps.eyebrow}</Eyebrow>
          <SectionHeading className="max-w-[22ch]">{ps.heading}</SectionHeading>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-0 border border-[var(--ink)]/10 rounded-[4px] overflow-hidden">

          {/* ─── Bad panel ─── */}
          <motion.div
            variants={slideL}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-12% 0px' }}
            className="bg-[var(--paper3)] p-8 md:p-12 flex flex-col gap-6 border-b md:border-b-0 md:border-r border-[var(--ink)]/8"
          >
            <p className="font-sans font-medium text-[var(--ink-mute)] text-[0.75rem] uppercase tracking-[0.2em]">
              {ps.bad.title}
            </p>
            <ul className="flex flex-col gap-4">
              {ps.bad.points.map((point, i) => (
                <RevealItem key={i} variant="rise">
                  <li className="flex items-start gap-3 group">
                    <motion.span
                      variants={checkPop}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true }}
                      className="mt-0.5 w-5 h-5 rounded-full bg-[#c1392b]/10 flex items-center justify-center shrink-0"
                    >
                      <X size={11} className="text-[#c1392b]" strokeWidth={2.5} />
                    </motion.span>
                    <span className="font-sans text-[var(--ink-mute)] text-[0.95rem] leading-relaxed">{point}</span>
                  </li>
                </RevealItem>
              ))}
            </ul>
          </motion.div>

          {/* ─── Good panel ─── */}
          <motion.div
            variants={slideR}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-12% 0px' }}
            className="bg-[var(--paper)] p-8 md:p-12 flex flex-col gap-6"
          >
            <p className="font-sans font-medium text-[var(--accent)] text-[0.75rem] uppercase tracking-[0.2em]">
              {ps.good.title}
            </p>
            <ul className="flex flex-col gap-4">
              {ps.good.points.map((point, i) => (
                <RevealItem key={i} variant="rise">
                  <li className="flex items-start gap-3 group cursor-default">
                    <motion.span
                      variants={checkPop}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true }}
                      className="mt-0.5 w-5 h-5 rounded-full bg-[var(--accent)]/12 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                    >
                      <Check size={11} className="text-[var(--accent)]" strokeWidth={2.5} />
                    </motion.span>
                    <span className="font-sans text-[var(--ink-soft)] text-[0.95rem] leading-relaxed group-hover:text-[var(--ink)] transition-colors">{point}</span>
                  </li>
                </RevealItem>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </Section>
  )
}
