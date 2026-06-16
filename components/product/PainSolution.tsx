import { Section } from '@/components/shell/Section'
import { Eyebrow } from '@/components/shell/Typography'
import { X, Check } from 'lucide-react'

/**
 * PainSolution — a clean two-column "the problem → with the Apex" comparison.
 * Icon + text only (no image assets) so it stays sharp and fast. Sits between
 * the feature-grid overview and the detailed feature story.
 */

const ROWS: { pain: string; fix: string }[] = [
  { pain: 'Long hours sitting leave you stiff and drained', fix: 'Lift between sitting and standing all day' },
  { pain: 'Cables everywhere and never enough outlets', fix: 'Built-in outlets, USB-C, and wireless charging' },
  { pain: 'Drinks and snacks crowd — and spill on — your desk', fix: 'Snap-on cup and snack holders off to the side' },
  { pain: 'A full setup swallows your whole room', fix: 'Two work levels stacked into one footprint' },
  { pain: 'The desk is never quite the right height', fix: 'Three one-tap memory-preset heights' },
  { pain: 'A flat, lifeless workspace', fix: 'Task light plus RGBW ambient lighting' },
  { pain: 'Rearranging means dragging a heavy desk', fix: 'Roll it on casters, then lock with one step' },
]

export function PainSolution() {
  return (
    <Section id="why" tone="paper2">
      <div className="flex flex-col gap-8 md:gap-10">
        <div className="flex flex-col gap-4 max-w-2xl">
          <Eyebrow>Why people switch</Eyebrow>
          <h2
            className="font-display font-semibold leading-[1.12] tracking-[-0.01em] text-[var(--ink)]"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}
          >
            Built around real desk problems
          </h2>
        </div>

        <div className="overflow-hidden rounded-[14px] border border-[var(--ink)]/10 bg-[var(--paper)]">
          {/* header */}
          <div className="grid grid-cols-2 border-b border-[var(--ink)]/10">
            <div className="px-4 py-3 md:px-6 font-sans text-[0.72rem] md:text-[0.78rem] font-semibold uppercase tracking-wide text-[var(--ink-mute)]">
              The problem
            </div>
            <div className="px-4 py-3 md:px-6 font-sans text-[0.72rem] md:text-[0.78rem] font-semibold uppercase tracking-wide text-[var(--ink)] bg-[var(--highlight)]/10">
              With the Apex
            </div>
          </div>

          {ROWS.map((r, i) => (
            <div
              key={i}
              className={`grid grid-cols-2 ${i % 2 ? 'bg-[var(--paper2)]/50' : ''} ${i ? 'border-t border-[var(--ink)]/8' : ''}`}
            >
              <div className="flex items-start gap-2.5 px-4 py-4 md:px-6 border-r border-[var(--ink)]/10">
                <X size={16} strokeWidth={2} className="mt-0.5 flex-shrink-0 text-[var(--ink-mute)]" />
                <span className="font-sans text-[0.86rem] md:text-[0.9rem] leading-snug text-[var(--ink-soft)]">{r.pain}</span>
              </div>
              <div className="flex items-start gap-2.5 px-4 py-4 md:px-6">
                <Check size={16} strokeWidth={2.5} className="mt-0.5 flex-shrink-0 text-[var(--highlight)]" />
                <span className="font-sans text-[0.86rem] md:text-[0.9rem] font-medium leading-snug text-[var(--ink)]">{r.fix}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
