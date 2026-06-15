'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Section } from '@/components/shell/Section'
import { Reveal, RevealItem } from '@/components/shell/Reveal'
import { Eyebrow } from '@/components/shell/Typography'
import { useProduct } from '@/contexts/product-context'
import { E } from '@/lib/motion'

const CAPTIONS = [
  'At home in the Scandinavian light',
  'Dual monitors. Zero clutter.',
  'White Oak in a minimal loft',
]

export function InYourSpace() {
  const { product } = useProduct()

  if (!product.lifestyle?.length) return null

  return (
    <Section id="lifestyle" tone="paper2">
      <Reveal variant="rise" className="text-center mb-12">
        <Eyebrow>In your space</Eyebrow>
        <h2
          className="mt-4 font-display font-normal text-[var(--ink)] tracking-[-0.02em]"
          style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}
        >
          Picture it in your home
        </h2>
      </Reveal>

      <Reveal variant="rise" staggerChildren={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {product.lifestyle.map((img, i) => (
          <RevealItem key={i} variant="rise">
            <figure className="flex flex-col gap-3 group">
              <div className="relative overflow-hidden rounded-[6px] aspect-square">
                {/* Square frame matches the 800×800 source images, so the whole
                    desk is visible — no cropped tops/legs. */}
                <div className="absolute inset-0" style={{ background: img.placeholder }} />
                {img.src && (
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
              </div>
              <figcaption className="font-sans text-[0.78rem] text-[var(--ink-mute)] tracking-wide uppercase">
                {img.alt || CAPTIONS[i] || ''}
              </figcaption>
            </figure>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  )
}
