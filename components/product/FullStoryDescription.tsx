'use client'

import { Section } from '@/components/shell/Section'
import { Reveal } from '@/components/shell/Reveal'
import { Eyebrow } from '@/components/shell/Typography'
import { useProduct } from '@/contexts/product-context'

export function FullStoryDescription() {
  const { product } = useProduct()

  if (!product.description?.length) return null

  return (
    <Section id="full-story" tone="paper2" wash>
      <div className="max-w-[680px] mx-auto">
        <Reveal variant="rise">
          <Eyebrow className="text-center">The full story</Eyebrow>
        </Reveal>

        <div className="mt-8 flex flex-col gap-6">
          {product.description.map((para, i) => (
            <Reveal key={i} variant="rise" delay={0.1 + i * 0.08}>
              <p className="font-sans text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed">
                {para}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
