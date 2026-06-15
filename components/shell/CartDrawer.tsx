'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/contexts/cart-context'
import { ALDER_PRODUCT, getVariantHeroImageSrc, PRODUCT_NAME, finishLabel, variantSubtitle } from '@/lib/pdp-product'
import { formatCurrency } from '@/lib/pdp-pricing'
import { cn } from '@/lib/utils'

const FREE_SHIPPING_THRESHOLD = 0

// Gradient placeholders keyed by finish — the only hardcoded finish data, and
// purely cosmetic (thumbnail fallback while the image loads). All labels and the
// product name come from the single source of truth (lib/pdp-product).
const FINISH_GRADIENTS: Record<string, string> = {
  white: 'linear-gradient(135deg, #FAFAFA 0%, #E0E0E0 100%)',
  mocha: 'linear-gradient(135deg, #8A6B52 0%, #6F4E37 100%)',
}

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, itemCount } = useCart()
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Escape key
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, closeCart])

  // Focus trap: move focus to close button when opened
  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus()
  }, [isOpen])

  const isEmpty = items.length === 0

  return (
    <>
      {/* Scrim — isolated in its OWN AnimatePresence with a stable key so it
          always unmounts on close. Previously the scrim + drawer were two
          unkeyed children inside a single AnimatePresence wrapped in a Fragment;
          framer-motion can fail to unmount a fragment's children on exit and
          leave this full-screen scrim stuck (invisible, at opacity:0) while it
          keeps capturing every click — the "nothing is clickable after closing
          the cart" bug. One keyed child per AnimatePresence is the reliable
          pattern and guarantees the overlay is gone the moment the cart closes. */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="cart-scrim"
            className="fixed inset-0 z-50 bg-[var(--ink)]/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="cart-drawer"
            className="fixed top-0 right-0 bottom-0 z-50 flex flex-col w-full max-w-[420px] bg-[var(--paper)] shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 40 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-heading"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--ink)]/8">
              <h2 id="cart-heading" className="font-display text-[1.15rem] text-[var(--ink)] tracking-[-0.01em] flex items-center gap-2">
                <ShoppingBag size={18} className="text-[var(--accent)]" strokeWidth={1.5} />
                Your Cart
                {itemCount > 0 && (
                  <span className="font-sans text-[0.85rem] text-[var(--ink-mute)] font-normal ml-1">
                    ({itemCount})
                  </span>
                )}
              </h2>
              <button
                ref={closeButtonRef}
                onClick={closeCart}
                className="p-2 -mr-2 text-[var(--ink-mute)] hover:text-[var(--ink)] transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {isEmpty ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center h-full px-8 text-center gap-5">
                  <div className="w-16 h-16 rounded-full bg-[var(--paper2)] flex items-center justify-center">
                    <ShoppingBag size={24} className="text-[var(--ink-mute)]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-display text-[1.15rem] text-[var(--ink)] mb-1">Your cart is empty</p>
                    <p className="font-sans text-[0.85rem] text-[var(--ink-soft)]">
                      Your new desk is waiting.
                    </p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-[var(--paper)] font-sans text-[0.875rem] font-medium rounded-[3px] hover:bg-[var(--accent-deep)] transition-colors"
                  >
                    Keep browsing
                    <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                /* Line items */
                <ul>
                  <AnimatePresence initial={false}>
                  {items.map((item) => {
                    const finishName = finishLabel(item.finishId)
                    const variantLine = variantSubtitle(item.sizeId, item.finishId)
                    const gradient = FINISH_GRADIENTS[item.finishId] || 'linear-gradient(135deg, #8B7355 0%, #6B5344 100%)'
                    // Hero image for the chosen finish (first image of that variant's
                    // gallery) — data-driven, falls back to the gradient while loading
                    // or if no image exists.
                    const heroSrc = getVariantHeroImageSrc(ALDER_PRODUCT, item.finishId)

                    return (
                      <li
                        key={item.id}
                        className="flex gap-4 px-6 py-5 border-b border-[var(--ink)]/6"
                      >
                        {/* Thumbnail — variant hero image over a gradient fallback */}
                        <div
                          className="relative w-20 h-20 flex-shrink-0 rounded-[4px] overflow-hidden"
                          style={{ background: gradient }}
                        >
                          {heroSrc && (
                            <Image
                              src={heroSrc}
                              alt={`${PRODUCT_NAME} — ${finishName}`}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                          <p className="font-sans text-[0.875rem] font-medium text-[var(--ink)] leading-snug">
                            {PRODUCT_NAME}
                          </p>
                          <p className="font-sans text-[0.78rem] text-[var(--ink-mute)]">
                            {variantLine}
                          </p>
                          <p className="font-sans text-[0.9rem] font-medium text-[var(--ink)]">
                            {formatCurrency(item.price * item.quantity)}
                          </p>

                          {/* Qty + Remove row */}
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center border border-[var(--ink)]/15 rounded-full overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--paper2)] transition-colors disabled:opacity-30"
                                aria-label="Decrease quantity"
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-7 text-center font-sans text-[0.8rem] text-[var(--ink)]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= 10}
                                className="w-7 h-7 flex items-center justify-center text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--paper2)] transition-colors disabled:opacity-30"
                                aria-label="Increase quantity"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1.5 text-[var(--ink-mute)] hover:text-red-500 transition-colors"
                              aria-label={`Remove ${variantLine} from cart`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer — only when items present */}
            {!isEmpty && (
              <div className="px-6 py-5 border-t border-[var(--ink)]/8 flex flex-col gap-4">
                {/* Free shipping cue */}
                <div className="flex items-center gap-2 text-[0.78rem] text-[var(--ink-soft)]">
                  <span className="flex items-center gap-1 text-green-600 font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Free shipping unlocked
                  </span>
                  &mdash; on every order, always.
                </div>

                {/* Subtotal */}
                <div className="flex items-baseline justify-between">
                  <span className="font-sans text-[0.875rem] text-[var(--ink-soft)]">Subtotal</span>
                  <span className="font-display text-[1.25rem] text-[var(--ink)] tracking-[-0.01em]">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <p className="font-sans text-[0.72rem] text-[var(--ink-mute)]">
                  Taxes calculated at checkout
                </p>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className={cn(
                    'flex items-center justify-center gap-2 w-full py-3.5 rounded-[3px]',
                    'bg-[var(--accent)] text-[var(--paper)] font-sans text-[0.95rem] font-medium',
                    'hover:bg-[var(--accent-deep)] transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2'
                  )}
                >
                  Checkout
                  <ArrowRight size={15} />
                </Link>

                <button
                  onClick={closeCart}
                  className="font-sans text-[0.82rem] text-[var(--ink-mute)] hover:text-[var(--ink)] transition-colors text-center"
                >
                  Continue shopping
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}