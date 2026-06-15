'use client'

import { ShieldCheck } from 'lucide-react'
import { Section } from '@/components/shell/Section'
import { Reveal, RevealItem } from '@/components/shell/Reveal'
import { Eyebrow } from '@/components/shell/Typography'
import { useProduct } from '@/contexts/product-context'

export function DurabilityBlock() {
  const { product } = useProduct()

  if (!product.durability?.length) return null

  return (
    <Section id="durability" tone="ink">
      <div className="grid lg:grid-cols-2 gap-14 items-center">
        {/* Left — copy */}
        <Reveal variant="slideL">
          <Eyebrow className="text-[var(--paper)]/50">Built to last</Eyebrow>
          <h2
            className="mt-4 font-display font-normal text-[var(--paper)] tracking-[-0.02em] leading-[1.1]"
            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
          >
            Built from real materials.
            <br />Backed for 15 years.
          </h2>
          <p className="mt-5 font-sans text-[0.95rem] text-[var(--paper)]/60 leading-relaxed max-w-[420px]">
            A genuine bamboo top on a dual-motor lift rated to 220 lb — engineered to move smoothly between
            sitting and standing under a full setup, day after day. The 15-year warranty isn&apos;t a marketing line.
            It&apos;s what we stand behind on the frame, motor, and lift.
          </p>
        </Reveal>

        {/* Right — stat grid */}
        <Reveal variant="slideR" staggerChildren={0.08} className="grid grid-cols-2 gap-4">
          {product.durability.map((item, i) => (
            <RevealItem key={i} variant="rise">
              <div className="flex flex-col gap-1.5 p-5 bg-[var(--paper)]/6 rounded-[6px] border border-[var(--paper)]/8">
                <span
                  className="font-display text-[var(--paper)] tracking-[-0.02em]"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
                >
                  {item.stat}
                </span>
                <span className="font-sans text-[0.78rem] text-[var(--paper)]/50 leading-snug">{item.label}</span>
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </div>

      {/* Warranty callout */}
      <Reveal variant="rise" delay={0.3} className="mt-12 flex items-start gap-4 p-6 bg-[var(--paper)]/5 border border-[var(--paper)]/10 rounded-[6px]">
        <ShieldCheck size={24} className="text-[var(--accent)] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
        <div>
          <p className="font-sans text-[0.9rem] font-medium text-[var(--paper)]">15-year warranty — frame, motors, and electronics</p>
          <p className="font-sans text-[0.8rem] text-[var(--paper)]/50 mt-1">
            No pro-rated coverage, no asterisks. If anything fails in those 15 years, we fix or replace it. Period.
          </p>
        </div>
      </Reveal>
    </Section>
  )
}
