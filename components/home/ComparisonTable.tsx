'use client'

import { motion } from 'framer-motion'
import { Check, Minus } from 'lucide-react'
import { useHome } from '@/contexts/home-context'
import { Section } from '@/components/shell/Section'
import { Reveal } from '@/components/shell/Reveal'
import { Eyebrow, SectionHeading } from '@/components/shell/Typography'
import { rise, checkPop } from '@/lib/motion'
import { cn } from '@/lib/utils'

function CellIcon({ value, isAlder }: { value: boolean | string; isAlder: boolean }) {
  if (typeof value !== 'boolean') {
    return <span className="font-sans text-[0.75rem] text-[var(--ink-soft)]">{value}</span>
  }
  if (value) {
    return (
      <motion.span
        variants={isAlder ? checkPop : rise}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className={cn(
          'inline-flex items-center justify-center w-5 h-5 rounded-full',
          isAlder ? 'bg-[var(--accent)]' : 'bg-[var(--ink)]/20'
        )}
      >
        <Check size={10} className={isAlder ? 'text-[var(--paper)]' : 'text-[var(--ink-soft)]'} strokeWidth={3} />
      </motion.span>
    )
  }
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--ink)]/6">
      <Minus size={10} className="text-[var(--ink-mute)]" strokeWidth={2} />
    </span>
  )
}

export function ComparisonTable() {
  const { comparison } = useHome()

  return (
    <Section id="comparison" tone="paper3" wash>
      <Reveal variant="rise" className="flex flex-col gap-3 mb-8">
        <Eyebrow>{comparison.eyebrow}</Eyebrow>
        <SectionHeading className="max-w-[22ch]">{comparison.heading}</SectionHeading>
      </Reveal>

      {/* Mobile: Vertical card-based layout — no horizontal scroll */}
      <div className="md:hidden">
        {/* Legend header */}
        <div className="flex items-center justify-between py-3 px-1 border-b border-[var(--ink)]/10 mb-2">
          <span className="font-sans text-[0.7rem] uppercase tracking-[0.15em] text-[var(--ink-mute)]">Feature</span>
          <div className="flex items-center gap-4">
            {comparison.columns.map((col, ci) => (
              <span
                key={ci}
                className={cn(
                  'font-sans text-[0.65rem] font-medium text-center',
                  ci === 0 ? 'text-[var(--accent)]' : 'text-[var(--ink-mute)]'
                )}
                style={{ width: '52px' }}
              >
                {col}
              </span>
            ))}
          </div>
        </div>

        {/* Feature rows */}
        {comparison.rows.map((row, ri) => (
          <motion.div
            key={ri}
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-5%' }}
            transition={{ delay: ri * 0.04 }}
            className="flex items-center justify-between py-3.5 px-1 border-b border-[var(--ink)]/6"
          >
            <span className="font-sans text-[0.875rem] text-[var(--ink-soft)] flex-1 pr-3">{row.feature}</span>
            <div className="flex items-center gap-4">
              {row.cells.map((cell, ci) => (
                <div key={ci} className="flex items-center justify-center" style={{ width: '52px' }}>
                  <CellIcon value={cell} isAlder={ci === 0} />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop: Traditional table layout */}
      <div className="hidden md:block">
        <table className="w-full border-separate border-spacing-0 text-left">
          {/* Header */}
          <thead>
            <tr>
              <th className="font-sans text-[0.75rem] text-[var(--ink-mute)] uppercase tracking-[0.15em] font-normal py-4 pr-8 align-middle">
                Feature
              </th>
              {comparison.columns.map((col, ci) => (
                <th
                  key={ci}
                  className={cn(
                    'py-4 px-6 text-center font-sans text-[0.85rem] font-medium align-middle',
                    ci === 0
                      ? 'bg-[var(--accent)] text-[var(--paper)] rounded-t-[4px]'
                      : 'text-[var(--ink-mute)]'
                  )}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          {/* Rows */}
          <tbody>
            {comparison.rows.map((row, ri) => (
              <motion.tr
                key={ri}
                variants={rise}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-12% 0px' }}
                transition={{ delay: ri * 0.06 }}
                className="group"
              >
                <td className="font-sans text-[0.9rem] text-[var(--ink-soft)] py-4 pr-8 border-b border-[var(--ink)]/6 group-hover:text-[var(--ink)] transition-colors duration-200">
                  {row.feature}
                </td>

                {row.cells.map((cell, ci) => (
                  <td
                    key={ci}
                    className={cn(
                      'py-4 px-6 text-center border-b border-[var(--ink)]/6 transition-all duration-200',
                      ci === 0
                        ? 'bg-[var(--accent)]/6 group-hover:bg-[var(--accent)]/12'
                        : 'group-hover:bg-[var(--paper2)]/50'
                    )}
                  >
                    <CellIcon value={cell} isAlder={ci === 0} />
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}
