/**
 * components/product/ProductTracking.tsx
 * Client island — fires ViewContent (Pixel + CAPI) on product page mount,
 * and captures any inbound fbclid into _fbc for ad-click attribution.
 * Mounts inside the ProductProvider so it can read product data.
 */
'use client'

import { useEffect } from 'react'
import { useProduct } from '@/contexts/product-context'
import { getOrCreateCustomerId } from '@/lib/customer-id'
import { trackPixelWithExternalId, sendServerEvent, captureFbclid } from '@/lib/meta'

export function ProductTracking() {
  const { product, selection } = useProduct()

  useEffect(() => {
    // Capture fbclid → _fbc first so the CAPI relay can read it on this same load.
    captureFbclid()

    const cid = getOrCreateCustomerId()
    const payload = {
      content_ids:  [selection.size],   // standardized: short size id (sm|md|lg) across the whole funnel
      content_name: product.name,
      content_type: 'product',
      value:        product.basePrice,
      currency:     'USD',
    }

    // Browser Pixel (with hashed external_id) + server CAPI in parallel; dedup via event_id = cid.
    void trackPixelWithExternalId('ViewContent', cid, payload)
    sendServerEvent('ViewContent', payload)
    // Only runs once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}