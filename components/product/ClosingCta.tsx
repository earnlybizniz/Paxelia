'use client'

import { useProduct } from '@/contexts/product-context'
import { useCart } from '@/contexts/cart-context'
import { getOrCreateCustomerId } from '@/lib/customer-id'
import { trackPixelWithExternalId, sendServerEvent } from '@/lib/meta'
import { Section } from '@/components/shell/Section'
import { Reveal } from '@/components/shell/Reveal'
import { MagneticButton } from '@/components/shell/MagneticButton'
import { ParsedHeading } from '@/components/shell/Typography'
import { formatCurrency } from '@/lib/pdp-pricing'

export function ClosingCta() {
  const { product, price, compareAt, selection } = useProduct()
  const { addItem, openCart } = useCart()

  const handleAddToCart = () => {
    const sizeId = selection.size || 'standard'
    const finishId = selection.finish || 'white'

    addItem({
      sizeId: sizeId as 'sm' | 'md' | 'lg',
      finishId: finishId as 'white' | 'mocha',
      frameId: 'black',
      quantity: 1,
      price: price,
      msrp: compareAt || price,
    })
    openCart()

    // Fire AddToCart — Pixel (hashed external_id) + server CAPI, dedup via
    // event_id = cid. Mirrors BuyBox so this CTA counts AddToCart at click time
    // instead of adding to cart silently. content_ids uses the short size id to
    // match every other funnel event.
    const cid = getOrCreateCustomerId()
    const payload = {
      content_ids:  [selection.size],
      content_name: product.name,
      content_type: 'product',
      value:        price,
      currency:     'USD',
    }
    void trackPixelWithExternalId('AddToCart', cid, payload)
    sendServerEvent('AddToCart', payload)
  }

  return (
    <Section tone="ink" className="relative overflow-hidden">
      {/* Ambient accent drift */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 20% 80%, color-mix(in srgb, var(--accent) 12%, transparent), transparent)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-3xl mx-auto">
        <Reveal variant="rise">
          <ParsedHeading
            text="Ready to *upgrade* your workspace?"
            as="h2"
            className="!text-[var(--paper)] !text-[clamp(2rem,5vw,3.5rem)]"
          />
        </Reveal>

        <Reveal variant="rise">
          <p className="font-sans text-[1.1rem] text-[var(--paper)]/70 leading-relaxed max-w-xl">
            Real Italian marble, an industrial-grade lift, and a 10-year warranty — at a factory-direct price. Your workspace deserves it.
          </p>
        </Reveal>

        <Reveal variant="rise">
          <div className="flex flex-col items-center gap-4">
            <MagneticButton
              onClick={handleAddToCart}
              variant="inverted"
              className="px-10 py-4 text-[1rem]"
            >
              Add to cart — {formatCurrency(price)}
            </MagneticButton>

            <p className="font-sans text-[0.85rem] text-[var(--paper)]/50">
              Free shipping · 30-night trial
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}