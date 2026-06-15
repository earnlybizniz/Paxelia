/**
 * components/checkout/ThankYouRecover.tsx
 * Redundancy net for the thank-you page when it loads WITHOUT an ?order= param.
 *
 * The checkout stashes the order id in localStorage ('wylorise_last_order')
 * immediately before navigating to /thank-you?order=<id> (see checkout-client
 * handlePaymentComplete). If a buyer reaches /thank-you with no ?order= — a
 * back-navigation, a stripped query string, or an early exit and later return —
 * this reads that stashed id and reloads the page with it, so the real order is
 * fetched and the Purchase Pixel fires.
 *
 * Renders nothing. It only acts when there is no ?order= in the URL AND a
 * stashed id exists, and it uses location.replace (not push) so the param-less
 * URL does not linger in history. After the reload the URL has ?order=, so this
 * component is not rendered again (the page only mounts it when orderId is
 * absent) — there is no redirect loop.
 */
'use client'

import { useEffect } from 'react'

export function ThankYouRecover() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const params = new URLSearchParams(window.location.search)
      if (params.get('order')) return // already have one — nothing to recover
      const stashed = window.localStorage.getItem('wylorise_last_order')
      if (!stashed) return
      window.location.replace(`/thank-you?order=${encodeURIComponent(stashed)}`)
    } catch {
      /* localStorage blocked / unavailable — fail silent, show generic success */
    }
  }, [])

  return null
}
