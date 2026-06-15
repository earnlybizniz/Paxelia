'use client'

import {} from 'react'
import { ShoppingCart, Flame } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useProduct } from '@/contexts/product-context'
import { useCart } from '@/contexts/cart-context'
import { getOrCreateCustomerId } from '@/lib/customer-id'
import { trackPixelWithExternalId, sendServerEvent } from '@/lib/meta'
import { Reveal } from '@/components/shell/Reveal'
import { StarRating } from '@/components/shell/Typography'
import { VariantSelector } from './VariantSelector'
import { BuyAccordion } from './BuyAccordion'
import { formatCurrency, getSavings } from '@/lib/pdp-pricing'
import { cn } from '@/lib/utils'

export function BuyBox() {
  const { product, price, compareAt, configLabel, variantId, selection } = useProduct()
  const { addItem, openCart } = useCart()
  const router = useRouter()
  const savings = getSavings(price, compareAt)

  // Build the cart item from current selection
  function buildCartItem() {
    const sizeId   = (selection.size   ?? 'md')     as 'sm' | 'md' | 'lg'
    const finishId = (selection.finish ?? 'white') as 'white' | 'mocha'
    return { sizeId, finishId, frameId: 'black' as const, quantity: 1, price, msrp: compareAt || price }
  }

  const handleAddToCart = () => {
    addItem(buildCartItem())
    openCart()
    // Fire AddToCart — Pixel (with hashed external_id) + server CAPI, dedup via event_id = cid
    const cid = getOrCreateCustomerId()
    const payload = {
      content_ids:  [selection.size],   // standardized: short size id
      content_name: product.name,
      content_type: 'product',
      value:        price,
      currency:     'USD',
    }
    void trackPixelWithExternalId('AddToCart', cid, payload)
    sendServerEvent('AddToCart', payload)
  }

  const handleBuyNow = () => {
    addItem(buildCartItem())
    // Fire AddToCart (same as add-to-cart) then navigate. sendServerEvent uses
    // sendBeacon so it survives the immediate redirect to /checkout.
    const cid = getOrCreateCustomerId()
    const payload = {
      content_ids:  [selection.size],   // standardized: short size id
      content_name: product.name,
      content_type: 'product',
      value:        price,
      currency:     'USD',
    }
    void trackPixelWithExternalId('AddToCart', cid, payload)
    sendServerEvent('AddToCart', payload)
    router.push('/checkout')
  }

  return (
    <Reveal variant="slideR" className="flex flex-col gap-6 min-w-0">
      {/* Badge, Title, Reviews — compact section */}
      <div className="flex flex-col gap-2">
        {/* Limited time discount badge */}
        <div className="flex items-center gap-1.5">
          <Flame size={16} className="text-red-600" />
          <span className="font-sans text-[0.8rem] text-red-600">
            Limited time discount
          </span>
        </div>

        {/* Product Name (h1) */}
        <h1
          className="font-display font-normal text-[var(--ink)] leading-[1.04] tracking-[-0.02em]"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
        >
          {product.name}
        </h1>

        {/* Rating Row */}
        <Link href="#reviews" className="flex items-center gap-3 group w-fit">
          <StarRating value={product.rating} size={18} />
          <span className="font-sans text-[0.9rem] text-[var(--ink-soft)] group-hover:text-[var(--ink)] transition-colors">
            {product.rating} · {product.reviewCount.toLocaleString()} reviews
          </span>
        </Link>
      </div>

      {/* Price Block */}
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-display text-[2rem] text-green-700 tracking-[-0.02em]">
          {formatCurrency(price)}
        </span>
        {compareAt && compareAt > price && (
          <span className="font-sans text-[1.1rem] text-[var(--ink-mute)] line-through">
            {formatCurrency(compareAt)}
          </span>
        )}
        {savings > 0 && (
          <span className="bg-[var(--accent)] text-[var(--paper)] px-2 py-0.5 rounded-full font-sans text-[0.75rem] font-medium">
            Save {formatCurrency(savings)}
          </span>
        )}
      </div>

      {/* Finance Line removed — single payment only */}

      {/* Variant Selector */}
      <VariantSelector />

      {/* Buy Actions */}
      <div className="flex flex-col gap-3 pt-1">
        {/* Primary — Add to Cart */}
        <button
          onClick={handleAddToCart}
          className={cn(
            'w-full py-4 rounded-[3px] font-sans text-[1rem] font-medium',
            'bg-[var(--accent)] text-[var(--paper)]',
            'hover:bg-[var(--accent-deep)] transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2',
            'flex items-center justify-center gap-2'
          )}
        >
          <ShoppingCart size={18} strokeWidth={1.5} />
          <span>Add to cart — {formatCurrency(price)}</span>
        </button>

        {/* Secondary — Buy Now */}
        <button
          onClick={handleBuyNow}
          className={cn(
            'w-full py-3.5 rounded-[3px] font-sans text-[0.95rem] font-medium',
            'border border-[var(--accent)] text-[var(--accent)]',
            'hover:bg-[var(--accent)]/6 transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2'
          )}
        >
          Buy it now
        </button>
      </div>

      {/* Buy Accordion */}
      <BuyAccordion />
    </Reveal>
  )
}
