// app/edu/checkout/page.tsx
// force-dynamic prevents prerendering, which breaks @whop/checkout/react.
export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import CheckoutClient from './checkout-client'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Join Wylorise — choose your billing length and get instant access to the ebook and community.',
  alternates: { canonical: '/checkout' },
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  return <CheckoutClient />
}
