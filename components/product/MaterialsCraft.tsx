'use client'

import Image from 'next/image'
import { Section } from '@/components/shell/Section'
import { Reveal } from '@/components/shell/Reveal'
import { Eyebrow } from '@/components/shell/Typography'
import { useProduct } from '@/contexts/product-context'

/**
 * Feature icon grid (replaces the old lucide "Materials & craft" grid).
 * Renders product.materials, where each item's `icon` is now an image PATH
 * (the custom PNG icons in /public/images/product/icons), not a lucide name.
 *
 * Layout per spec:
 *   - mobile  → 2 columns  → 8 items = 4 rows  (compact, not tall)
 *   - desktop → 4 columns  → 8 items = 2 rows
 */
export function MaterialsCraft() {
  const { product } = useProduct()

  if (!product.materials?.length) return null

  return (
    <Section id="materials" tone="paper3">
      <Reveal variant="rise">
        <Eyebrow className="text-center">Features</Eyebrow>
        <h2
          className="mt-4 text-center font-display font-normal text-[var(--ink)] tracking-[-0.02em]"
          style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}
        >
          Everything you need, built in
        </h2>
      </Reveal>

      {/* 2 cols on mobile (→ 4 rows), 4 cols from md up (→ 2 rows) */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-9 sm:gap-x-6 sm:gap-y-10">
        {product.materials.map((item, i) => (
          <Reveal key={i} variant="rise" delay={0.05 + i * 0.05}>
            <div className="flex flex-col items-center text-center gap-3 h-full px-1">
              {/* Circular outline icon — keeps every cell visually identical */}
              <div className="flex items-center justify-center w-[68px] h-[68px] rounded-full border border-[var(--accent)]/30 bg-[var(--paper)]">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={40}
                  height={40}
                  className="w-9 h-9 object-contain"
                />
              </div>
              <p className="font-sans text-[0.9rem] font-medium text-[var(--ink)] leading-snug">
                {item.title}
              </p>
              <p className="font-sans text-[0.75rem] text-[var(--ink-soft)] leading-relaxed max-w-[22ch]">
                {item.detail}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
