// components/academy/checkout/whop-payment.tsx
'use client'

import { Suspense } from 'react'
import { WhopCheckoutEmbed } from '@whop/checkout/react'
import { Lock } from 'lucide-react'

export interface AcademyAddress {
  firstName: string
  lastName: string
  line1: string
  line2: string
  city: string
  state: string
  postalCode: string
  country: string
}

function PaymentSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-live="polite">
      <div className="h-11 animate-pulse rounded-xl bg-neutral-100" />
      <div className="h-11 animate-pulse rounded-xl bg-neutral-100" />
      <div className="h-32 animate-pulse rounded-xl bg-neutral-100" />
      <span className="sr-only">Loading secure payment…</span>
    </div>
  )
}

interface Props {
  planId: string
  sessionId: string
  orderId: string
  email: string
  address: AcademyAddress
  billingSame: boolean
  onComplete: () => void
  /** Fires with the embed's lifecycle state so the wizard can reveal the payment
   *  step only once the embed is fully ready. Purely presentational. */
  onStateChange?: (state: 'loading' | 'ready' | 'disabled') => void
}

export function WhopPayment({
  planId,
  sessionId,
  orderId,
  email,
  address,
  billingSame,
  onComplete,
  onStateChange,
}: Props) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''

  const prefill = {
    email,
    address: {
      name: `${address.firstName} ${address.lastName}`.trim(),
      country: address.country,
      line1: address.line1,
      line2: address.line2 || undefined,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
    },
  }

  return (
    <section aria-labelledby="omni-payment-heading">
      <div className="mb-3 flex items-center justify-between">
        <h2
          id="omni-payment-heading"
          className="font-display text-sm font-semibold uppercase tracking-widest text-neutral-500"
        >
          Payment
        </h2>
        <p className="flex items-center gap-1.5 text-xs text-neutral-400">
          <Lock className="h-3 w-3" /> Secure &amp; encrypted
        </p>
      </div>

      <Suspense fallback={<PaymentSkeleton />}>
        <WhopCheckoutEmbed
          planId={planId}
          sessionId={sessionId}
          environment="production"
          prefill={prefill}
          hideEmail
          hidePrice
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
