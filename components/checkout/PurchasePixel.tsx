/**
 * components/checkout/PurchasePixel.tsx
 * Client-only component that fires the Meta Purchase Pixel event.
 * Uses the real order total from Supabase (passed as a prop) — not the cart —
 * so the value is always accurate even if the cart was already cleared.
 * The event_id is the order_id — the SAME id used by the checkout onComplete
 * Pixel and the Whop webhook CAPI call → Meta deduplicates all three to one
 * Purchase, while repeat purchases (different order_id) are never dropped.
 */
'use client'

import { useEffect } from 'react'
import { getOrCreateCustomerId } from '@/lib/customer-id'
import { trackPixelPurchase } from '@/lib/meta'
import { PRODUCT_NAME } from '@/lib/pdp-product'
import { useCart } from '@/contexts/cart-context'

interface Props {
  orderId: string
  value: number
  currency: string
  contentId?: string
}

export function PurchasePixel({ orderId, value, currency, contentId }: Props) {
  const { clearCart } = useCart()

  useEffect(() => {
    const cid = getOrCreateCustomerId() // sent as sha256 external_id for matching
    // event_id = order_id (NOT customer_id) so a repeat purchase is never
    // dedup-dropped by Meta, and so this dedups with the checkout onComplete
    // Pixel AND the webhook CAPI (all three send the same order_id).
    void trackPixelPurchase(orderId, cid, {
      value,                            // REAL order total, not cart subtotal
      currency,
      content_name: PRODUCT_NAME,
      content_ids:  contentId ? [contentId] : undefined,
      content_type: 'product',
      num_items:    1,
    })
    clearCart() // clear AFTER the real value has already been read
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, value, currency, contentId])

  return null
}