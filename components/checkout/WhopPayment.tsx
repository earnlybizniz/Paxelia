// components/checkout/WhopPayment.tsx
/**
 * components/checkout/WhopPayment.tsx
 * Mounts the WhopCheckoutEmbed with the session created server-side.
 * hideEmail + hidePrice always; hideAddressForm only when billing == shipping.
 * Production-only — the checkout always runs against Whop production.
 */
'use client'

import { Suspense } from 'react'
import { WhopCheckoutEmbed } from '@whop/checkout/react'
import { PaymentSkeleton } from '@/components/checkout/PaymentSkeleton'
import { Lock } from 'lucide-react'
import type { AddressState } from '@/components/checkout/DeliverySection'

interface Props {
  planId:       string
  sessionId:    string
  orderId:      string
  email:        string
  address:      AddressState
  billingSame:  boolean
  onComplete:   () => void
  /** Optional: fires with the embed's state ('loading' | 'ready' | 'disabled').
   *  Used by the checkout wizard to know when the embed is fully ready so it can
   *  reveal the payment step. Purely additive — does not affect checkout/payment. */
  onStateChange?: (state: 'loading' | 'ready' | 'disabled') => void
}

export function WhopPayment({ planId, sessionId, orderId, email, address, billingSame, onComplete, onStateChange }: Props) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''

  const prefill = {
    email,
    address: {
      name:       `${address.firstName} ${address.lastName}`.trim(),
      country:    address.country,
      line1:      address.line1,
      line2:      address.line2 || undefined,
      city:       address.city,
      state:      address.state,
      postalCode: address.postalCode,
    },
  }

  return (
    <section aria-labelledby="payment-heading">
      <h2
        id="payment-heading"
        className="font-sans text-[0.78rem] uppercase tracking-widest text-[var(--ink-mute)] mb-1"
      >
        Payment
      </h2>
      <p className="flex items-center gap-1.5 font-sans text-[0.72rem] text-[var(--ink-mute)] mb-3">
        <Lock size={10} strokeWidth={2} aria-hidden />
        All transactions are secure and encrypted.
      </p>

      <Suspense fallback={<PaymentSkeleton />}>
        <WhopCheckoutEmbed
          planId={planId}
          sessionId={sessionId}
          environment="production"
          prefill={prefill}
          hideEmail
          hidePrice
          hideTermsAndConditions
          {...(billingSame ? { hideAddressForm: true } : {})}
          setupFutureUsage="off_session"
          returnUrl={`${siteUrl}/checkout/complete?order=${orderId}`}
          onComplete={onComplete}
          {...(onStateChange ? { onStateChange } : {})}
          theme="light"
          fallback={<PaymentSkeleton />}
        />
      </Suspense>
    </section>
  )
}
