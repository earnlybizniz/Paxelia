/**
 * components/checkout/OrderSummaryCollapse.tsx
 * Shopify / Stripe-style order summary — the buyer's source of truth for what
 * they pay. Used in BOTH checkout steps (the Whop embed hides pricing, so the
 * payment step depends on this to show the real total).
 *
 *  - OrderSummaryCollapse  → MOBILE: a compact bar with the TOTAL always visible;
 *    tap to expand the full line items + breakdown. Collapsed by default so it
 *    never eats vertical space, but the amount is never hidden.
 *  - OrderSummarySidebar   → DESKTOP: the same content in a sticky card.
 *
 * All numbers + labels come from the cart (single source of truth) and the
 * pdp-product helpers — nothing is hardcoded, so it can never drift.
 */
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronDown, ShoppingBag, Lock } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '@/contexts/cart-context'
import { E } from '@/lib/motion'
import { ALDER_PRODUCT, getVariantHeroImageSrc, getFinishOption, variantSubtitle } from '@/lib/pdp-product'
import { formatCurrency } from '@/lib/pdp-pricing'

function pctOff(savings: number, compareTotal: number): number {
  if (compareTotal <= 0) return 0
  return Math.round((savings / compareTotal) * 100)
}

/** Small label/value row used in the breakdown. */
function Row({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between font-sans text-[0.82rem] text-[var(--ink-soft)]">
      <span>{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  )
}

/** Product rows — thumbnail (with a qty badge), name, variant, line price. */
function LineItems() {
  const { items } = useCart()
  return (
    <div className="flex flex-col gap-4">
      {items.map(item => {
        const finishOption = getFinishOption(item.finishId)
        const label = variantSubtitle(item.sizeId, item.finishId)
        const heroSrc = getVariantHeroImageSrc(ALDER_PRODUCT, item.finishId)
        const lineCompare = item.msrp > item.price ? item.msrp * item.quantity : 0
        return (
          <div key={item.id} className="flex items-start gap-3">
            {/* Thumbnail + qty badge (Shopify-style) */}
            <div className="relative flex-shrink-0">
              <div
                className="relative w-14 h-14 rounded-[6px] overflow-hidden border border-[var(--ink)]/10"
                style={{ backgroundColor: 'var(--paper)' }}
              >
                {heroSrc && (
                  <Image
                    src={heroSrc}
                    alt={`${ALDER_PRODUCT.name} — ${finishOption?.label ?? item.finishId}`}
                    fill
                    className="object-contain"
                    sizes="56px"
                  />
                )}
              </div>
              <span
                className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full bg-[var(--ink)] text-[var(--paper)] text-[0.7rem] font-semibold flex items-center justify-center"
                aria-label={`Quantity ${item.quantity}`}
              >
                {item.quantity}
              </span>
            </div>

            {/* Name + variant */}
            <div className="flex-1 min-w-0">
              <p className="font-sans text-[0.85rem] font-medium text-[var(--ink)] leading-snug">
                {ALDER_PRODUCT.name}
              </p>
              <p className="font-sans text-[0.75rem] text-[var(--ink-mute)] mt-0.5">{label}</p>
            </div>

            {/* Line price */}
            <div className="text-right flex-shrink-0">
              <p className="font-sans text-[0.85rem] font-medium text-[var(--ink)]">
                {formatCurrency(item.price * item.quantity)}
              </p>
              {lineCompare > 0 && (
                <p className="font-sans text-[0.72rem] text-[var(--ink-mute)] line-through">
                  {formatCurrency(lineCompare)}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** Subtotal / shipping / total + savings cue + trust line. */
function Totals() {
  const { subtotal, savings } = useCart()
  const total = subtotal // free shipping, always
  const compareTotal = subtotal + savings
  const saved = pctOff(savings, compareTotal)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Row label="Subtotal" value={formatCurrency(subtotal)} />
        <Row label="Shipping" value="Free" valueClass="text-[var(--ink)]" />
      </div>

      {/* Total — large + unmissable, with USD label */}
      <div className="border-t border-[var(--ink)]/10 pt-3 flex items-baseline justify-between">
        <span className="font-sans text-[0.95rem] font-semibold text-[var(--ink)]">Total</span>
        <span className="flex items-baseline gap-1.5">
          {savings > 0 && (
            <span className="font-sans text-[0.8rem] text-[var(--ink-mute)] line-through">
              {formatCurrency(compareTotal)}
            </span>
          )}
          <span className="font-sans text-[0.7rem] font-normal text-[var(--ink-mute)]">USD</span>
          <span className="font-display text-[1.35rem] text-green-700 tracking-[-0.01em]">
            {formatCurrency(total)}
          </span>
        </span>
      </div>

      {/* Savings cue */}
      {savings > 0 && (
        <div
          className="flex items-center gap-1.5 rounded-[6px] px-3 py-2"
          style={{ backgroundColor: 'color-mix(in srgb, #15803d 10%, transparent)' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="3" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-sans text-[0.8rem] font-medium" style={{ color: '#15803d' }}>
            You&apos;re saving {formatCurrency(savings)}{saved > 0 ? ` (${saved}% off)` : ''}
          </span>
        </div>
      )}

      {/* Trust line */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 font-sans text-[0.72rem] text-[var(--ink-mute)]">
        <span className="flex items-center gap-1">
          <Lock size={11} strokeWidth={2} aria-hidden /> Secure checkout
        </span>
        <span aria-hidden>·</span>
        <span>Free shipping</span>
        <span aria-hidden>·</span>
        <span>30-day returns</span>
      </div>
    </div>
  )
}

/** MOBILE — collapsible bar; the total stays visible even when collapsed. */
export function OrderSummaryCollapse() {
  const { subtotal, savings } = useCart()
  const total = subtotal
  const compareTotal = subtotal + savings
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden border-b border-[var(--ink)]/8" style={{ backgroundColor: 'var(--paper2, var(--paper))' }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full px-5 py-3.5 flex items-center justify-between gap-3"
        aria-expanded={open}
        aria-controls="order-summary-panel"
      >
        <span className="flex items-center gap-2 font-sans text-[0.85rem] font-medium text-[var(--accent)]">
          <ShoppingBag size={15} strokeWidth={1.75} aria-hidden />
          {open ? 'Hide order summary' : 'Show order summary'}
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2, ease: E }} className="flex">
            <ChevronDown size={15} aria-hidden />
          </motion.span>
        </span>
        <span className="flex items-baseline gap-1.5">
          {savings > 0 && (
            <span className="font-sans text-[0.8rem] text-[var(--ink-mute)] line-through">
              {formatCurrency(compareTotal)}
            </span>
          )}
          <span className="font-sans text-[1.05rem] font-semibold text-green-700">
            {formatCurrency(total)}
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="order-summary-panel"
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: E }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-4 flex flex-col gap-5">
              <LineItems />
              <Totals />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** DESKTOP — sticky summary card. */
export function OrderSummarySidebar() {
  return (
    <div
      className="rounded-[10px] p-6 flex flex-col gap-5 border border-[var(--ink)]/8"
      style={{ backgroundColor: 'var(--paper2, #f5f5f4)' }}
    >
      <h2 className="font-sans text-[0.75rem] uppercase tracking-widest text-[var(--ink-mute)]">
        Order summary
      </h2>
      <LineItems />
      <Totals />
    </div>
  )
}
