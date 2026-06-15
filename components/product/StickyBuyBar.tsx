'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { useProduct } from '@/contexts/product-context'
import { useCart } from '@/contexts/cart-context'
import { getOrCreateCustomerId } from '@/lib/customer-id'
import { trackPixelWithExternalId, sendServerEvent } from '@/lib/meta'
import { formatCurrency } from '@/lib/pdp-pricing'
import { E } from '@/lib/motion'
import { cn } from '@/lib/utils'

export function StickyBuyBar() {
  const { product, price, compareAt, configLabel, activeImage, selection } = useProduct()
  const { addItem, openCart } = useCart()
  const [isVisible, setIsVisible] = useState(false)
  const reduced = useReducedMotion()

  // Track when the inline Add-to-cart leaves the viewport
  useEffect(() => {
    const handleScroll = () => {
      // Show bar after scrolling past ~600px (roughly past the hero buy box)
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const winHeight = window.innerHeight

      // Hide when near the footer (within 220px of bottom)
      const nearBottom = scrollY + winHeight > docHeight - 220

      setIsVisible(scrollY > 600 && !nearBottom)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    // event_id = cid. Mirrors BuyBox so the sticky bar counts AddToCart at click
    // time. Previously this added to cart silently, so a mobile buyer using the
    // sticky bar generated no AddToCart and the event first surfaced as
    // InitiateCheckout. content_ids uses the short size id to match every other
    // funnel event.
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
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            'fixed bottom-0 left-0 right-0 z-40',
            'bg-[var(--paper)]/95 backdrop-blur-md border-t border-[var(--ink)]/10',
            'safe-area-inset-bottom'
          )}
          initial={reduced ? { opacity: 0 } : { y: '110%' }}
          animate={reduced ? { opacity: 1 } : { y: 0 }}
          exit={reduced ? { opacity: 0 } : { y: '110%' }}
          transition={{ duration: 0.35, ease: E }}
        >
          <div className="max-w-[1200px] mx-auto px-4 py-3 md:py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Product Info */}
              <div className="flex items-center gap-3 md:gap-4 min-w-0">
                {/* Thumbnail (hidden on mobile) */}
                <div className="hidden sm:block relative w-12 h-12 rounded-[4px] overflow-hidden flex-shrink-0">
                  <div
                    className="absolute inset-0"
                    style={{ background: activeImage.placeholder }}
                  />
                  {activeImage.src && (
                    <Image
                      src={activeImage.src}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  )}
                </div>

                {/* Name and config */}
                <div className="min-w-0">
                  <p className="font-sans text-[0.85rem] md:text-[0.9rem] font-medium text-[var(--ink)] truncate">
                    {product.name}
                  </p>
                  <p className="font-sans text-[0.7rem] md:text-[0.75rem] text-[var(--ink-mute)] truncate">
                    {configLabel}
                  </p>
                </div>
              </div>

              {/* Price and CTA */}
              <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
                {/* Price (hidden on smallest screens) */}
                <div className="hidden xs:flex flex-col items-end">
                  <span className="font-sans text-[1rem] md:text-[1.1rem] font-medium text-[var(--ink)]">
                    {formatCurrency(price)}
                  </span>
                  {compareAt && compareAt > price && (
                    <span className="font-sans text-[0.7rem] text-[var(--ink-mute)] line-through">
                      {formatCurrency(compareAt)}
                    </span>
                  )}
                </div>

                {/* CTA */}
                <button
                  onClick={handleAddToCart}
                  className={cn(
                    'px-4 md:px-6 py-2.5 md:py-3 rounded-[4px]',
                    'bg-[var(--accent)] text-[var(--paper)] font-sans text-[0.85rem] md:text-[0.9rem] font-medium',
                    'hover:bg-[var(--accent-deep)] transition-colors',
                    'whitespace-nowrap'
                  )}
                >
                  <span className="sm:hidden">Add — {formatCurrency(price)}</span>
                  <span className="hidden sm:inline">Add to cart</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
