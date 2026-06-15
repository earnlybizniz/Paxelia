'use client'

import { Shield, Truck, RotateCcw, CreditCard } from 'lucide-react'
import { useProduct } from '@/contexts/product-context'
import { Section } from '@/components/shell/Section'
import { Reveal } from '@/components/shell/Reveal'
import { Eyebrow, SectionHeading } from '@/components/shell/Typography'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  RotateCcw,
  Truck,
  Shield,
  CreditCard,
}

export function GuaranteeBlock() {
  const { product } = useProduct()

  return (
    <Section tone="paper2">
      <div className="flex flex-col gap-10">
        {/* Header */}
        <div className="text-center">
          <Reveal variant="rise">
            <Eyebrow className="mb-3">Our Promise</Eyebrow>
          </Reveal>
          <Reveal variant="rise">
            <SectionHeading className="!text-[clamp(1.75rem,3vw,2.5rem)]">
              Zero risk, total confidence
            </SectionHeading>
          </Reveal>
        </div>

        {/* Trust Items */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {product.trust.map((item, i) => {
            const Icon = iconMap[item.icon] || Shield

            return (
              <Reveal key={i} variant="rise" delay={i * 0.08}>
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                    <Icon size={24} className="text-[var(--accent)]" />
                  </div>
                  <h3 className="font-sans text-[0.95rem] font-medium text-[var(--ink)]">
                    {item.title}
                  </h3>
                  <p className="font-sans text-[0.8rem] text-[var(--ink-mute)]">
                    {item.sub}
                  </p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
