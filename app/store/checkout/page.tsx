/**
 * app/store/checkout/page.tsx
 * Server component wrapper that forces dynamic rendering.
 * This prevents prerendering which breaks @whop/checkout/react.
 */
export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { POLICY_CONFIG as C } from '@/lib/policies-config'
import CheckoutClient from './checkout-client'

export const metadata: Metadata = {
  title: `${C.brandName} — Checkout`,
}

export default function CheckoutPage() {
  return <CheckoutClient />
}