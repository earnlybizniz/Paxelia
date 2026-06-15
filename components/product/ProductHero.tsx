'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useProduct } from '@/contexts/product-context'
import { Section } from '@/components/shell/Section'
import { Reveal } from '@/components/shell/Reveal'
import { Gallery } from './Gallery'
import { BuyBox } from './BuyBox'

export function ProductHero() {
  const { product } = useProduct()

  return (
    <Section tone="paper" divider={false} className="!pt-6 md:!pt-10">
      {/* Breadcrumb */}
      <Reveal variant="fade" className="mb-6 md:mb-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[0.8rem]">
          <Link
            href="/"
            className="font-sans text-[var(--ink-mute)] hover:text-[var(--ink)] transition-colors"
          >
            Home
          </Link>
          <ChevronRight size={14} className="text-[var(--ink-mute)]" />
          <span className="font-sans text-[var(--ink-soft)]">{product.name}</span>
        </nav>
      </Reveal>

      {/* Hero Grid */}
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
        {/* Gallery — sticky on desktop. min-w-0 lets the column shrink on mobile
            so the inner thumbnail strip scrolls instead of widening the section.
            id is the scroll target when a colour variant is chosen (so the buyer
            is taken up to see that variant's images). */}
        <div id="product-gallery" className="min-w-0 md:sticky md:top-24 md:self-start scroll-mt-24">
          <Gallery />
        </div>

        {/* Buy Box */}
        <div className="min-w-0">
          <BuyBox />
        </div>
      </div>
    </Section>
  )
}