/**
 * components/checkout/ThankYouView.tsx
 * Presentational component for the thank-you page.
 * Can receive a real order from Supabase or null (graceful fallback).
 * All design, animations, and "What's next" copy are preserved from the original page.
 */
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { ThemeStyle } from '@/components/shell/ThemeStyle'
import { Grain } from '@/components/shell/Grain'
import { E, rise } from '@/lib/motion'
import { ALDER_PRODUCT, sizeLabel } from '@/lib/pdp-product'
import { formatCurrency } from '@/lib/pdp-pricing'
import { POLICY_CONFIG } from '@/lib/policies-config'

interface Order {
  id: string
  status: string
  variant_id: string
  total: number
  currency: string
  email: string
  first_name: string
  last_name: string
  shipping_address: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  } | null
}

interface Props {
  order: Order | null
  orderId: string
}

const STEPS = [
  { step: '1', title: 'Confirmation email', body: 'Check your inbox for your order summary and receipt.' },
  { step: '2', title: 'Preparation',        body: "We'll carefully pack and prepare your desk within 1–2 business days." },
  { step: '3', title: 'Shipping',           body: "You'll receive a shipping notification with tracking once it's on its way." },
  { step: '4', title: 'Delivery',           body: `Your ${ALDER_PRODUCT.name} arrives within 5–12 business days. Some assembly is required — instructions are included.` },
]

export function ThankYouView({ order, orderId }: Props) {
  const displayId = order?.id ?? orderId

  return (
    <>
      <ThemeStyle />
      <Grain />

      <main
        id="main"
        className="min-h-screen flex flex-col items-center justify-center px-5 py-20"
        style={{ backgroundColor: 'var(--paper)' }}
      >
        <motion.div
          className="w-full max-w-[520px] flex flex-col items-center text-center gap-8"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: E }}
        >
          {/* Check icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 22 }}
          >
            <CheckCircle2
              size={64}
              strokeWidth={1.25}
              className="text-[var(--accent)]"
              aria-hidden
            />
          </motion.div>

          {/* Heading */}
          <div className="flex flex-col gap-2">
            <motion.h1
              className="font-display font-normal text-[var(--ink)] leading-tight"
              style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)' }}
              variants={rise}
              initial="hidden"
              animate="show"
            >
              Order confirmed.
            </motion.h1>
            <p className="font-sans text-[1rem] text-[var(--ink-soft)] leading-relaxed">
              Thank you — your {ALDER_PRODUCT.name} is on its way. A confirmation email is heading to your inbox now.
            </p>
            {displayId && (
              <p className="font-sans text-[0.78rem] text-[var(--ink-mute)] mt-1">
                Order reference: <span className="font-mono text-[var(--ink)]">{displayId}</span>
              </p>
            )}
          </div>

          {/* Real order summary — only when we have a real order from Supabase */}
          {order && (
            <div
              className="w-full rounded-[8px] border p-5 text-left flex flex-col gap-3"
              style={{
                borderColor:     'color-mix(in srgb, var(--ink) 12%, transparent)',
                backgroundColor: 'var(--paper2, #f5f5f4)',
              }}
            >
              <h2 className="font-sans text-[0.72rem] uppercase tracking-widest text-[var(--ink-mute)]">
                Order summary
              </h2>

              {/* Product row */}
              <div className="flex items-center justify-between gap-4">
                <p className="font-sans text-[0.88rem] text-[var(--ink)]">
                  {ALDER_PRODUCT.name} — {sizeLabel(order.variant_id)}
                </p>
                <p className="font-sans text-[0.88rem] font-medium text-[var(--ink)] flex-shrink-0">
                  {formatCurrency(order.total)}
                </p>
              </div>

              <div
                className="h-px w-full"
                style={{ backgroundColor: 'color-mix(in srgb, var(--ink) 10%, transparent)' }}
              />

              {/* Email */}
              <div className="flex flex-col gap-0.5">
                <p className="font-sans text-[0.72rem] uppercase tracking-widest text-[var(--ink-mute)]">
                  Confirmation sent to
                </p>
                <p className="font-sans text-[0.85rem] text-[var(--ink)]">{order.email}</p>
              </div>

              {/* Shipping address */}
              {order.shipping_address && (
                <div className="flex flex-col gap-0.5">
                  <p className="font-sans text-[0.72rem] uppercase tracking-widest text-[var(--ink-mute)]">
                    Ships to
                  </p>
                  <p className="font-sans text-[0.85rem] text-[var(--ink)] leading-relaxed">
                    {order.first_name} {order.last_name}<br />
                    {order.shipping_address.line1}
                    {order.shipping_address.line2 ? `, ${order.shipping_address.line2}` : ''}<br />
                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postalCode}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* What happens next */}
          <div
            className="w-full rounded-[8px] border p-6 text-left flex flex-col gap-4"
            style={{
              borderColor:     'color-mix(in srgb, var(--ink) 8%, transparent)',
              backgroundColor: 'var(--paper2, #f5f5f4)',
            }}
          >
            <h2 className="font-sans text-[0.72rem] uppercase tracking-widest text-[var(--ink-mute)]">
              {"What's next"}
            </h2>
            {STEPS.map(({ step, title, body }) => (
              <div key={step} className="flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center font-sans text-[0.72rem] font-semibold flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--paper)' }}
                  aria-hidden
                >
                  {step}
                </span>
                <div>
                  <p className="font-sans text-[0.88rem] font-medium text-[var(--ink)]">{title}</p>
                  <p className="font-sans text-[0.78rem] text-[var(--ink-soft)] leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link
              href="/product"
              className="flex-1 py-4 flex items-center justify-center rounded-[6px] font-sans text-[0.9rem] font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--paper)' }}
            >
              Back to the desk
            </Link>
            <Link
              href="/"
              className="flex-1 py-4 flex items-center justify-center rounded-[6px] font-sans text-[0.9rem] font-medium border transition-colors"
              style={{
                borderColor: 'color-mix(in srgb, var(--ink) 20%, transparent)',
                color:       'var(--ink)',
              }}
            >
              Back to home
            </Link>
          </div>

          {/* Support */}
          <p className="font-sans text-[0.78rem] text-[var(--ink-mute)]">
            Questions? Email us at{' '}
            <a
              href={`mailto:${POLICY_CONFIG.supportEmail}`}
              className="underline underline-offset-2 hover:text-[var(--ink)] transition-colors"
            >
              {POLICY_CONFIG.supportEmail}
            </a>
          </p>
        </motion.div>
      </main>
    </>
  )
}