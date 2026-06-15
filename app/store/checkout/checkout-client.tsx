/**
 * app/store/checkout/checkout-client.tsx
 * Single-page Shopify-inspired checkout.
 * Layout: logo → collapsed order summary → contact → delivery → shipping method
 *          → billing toggle → Whop payment embed → policies
 *
 * On desktop: two-column — form left (max 560px), sticky summary right.
 * On mobile:  single column with collapsed order summary at top.
 */
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Lock } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { ThemeStyle } from '@/components/shell/ThemeStyle'
import { Grain } from '@/components/shell/Grain'
import { CheckoutShell } from '@/components/checkout/CheckoutShell'
import { OrderSummaryCollapse, OrderSummarySidebar } from '@/components/checkout/OrderSummaryCollapse'
import { ContactSection } from '@/components/checkout/ContactSection'
import { DeliverySection, type AddressState } from '@/components/checkout/DeliverySection'
import { ShippingMethod } from '@/components/checkout/ShippingMethod'
import { BillingToggle } from '@/components/checkout/BillingToggle'
import { WhopPayment } from '@/components/checkout/WhopPayment'
import { getOrCreateCustomerId } from '@/lib/customer-id'
import { trackPixelWithExternalId, trackPixelPurchase, sendServerEvent } from '@/lib/meta'
import { PRODUCT_NAME } from '@/lib/pdp-product'
import { planForVariant } from '@/lib/whop-plans'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CheckoutFormState {
  email:       string
  address:     AddressState
  billingSame: boolean
}

interface FieldErrors {
  email?:      string
  lastName?:   string
  line1?:      string
  city?:       string
  state?:      string
  postalCode?: string
}

const DEFAULT_ADDRESS: AddressState = {
  firstName:  '',
  lastName:   '',
  line1:      '',
  line2:      '',
  city:       '',
  state:      '',
  postalCode: '',
  country:    'US',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isAddressReady(a: AddressState): boolean {
  return !!(a.line1.trim() && a.city.trim() && a.state.trim() && a.postalCode.trim())
}

function isFormReady(email: string, address: AddressState): boolean {
  return !!(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && isAddressReady(address))
}

function variantIdFromCart(sizeId: string): string {
  // Cart sizeIds are always sm | md | lg — passed straight to planForVariant()
  return sizeId
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CheckoutClient() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()

  // Form state
  const [email,       setEmail]       = useState('')
  const [address,     setAddress]     = useState<AddressState>(DEFAULT_ADDRESS)
  const [billingSame, setBillingSame] = useState(true)
  const [errors,      setErrors]      = useState<FieldErrors>({})

  // Session state (set after form is ready + API call succeeds)
  const [sessionId,   setSessionId]   = useState<string | null>(null)
  const [orderId,     setOrderId]     = useState<string | null>(null)
  const [whopEmail,   setWhopEmail]   = useState<string | null>(null)
  const [planId,      setPlanId]      = useState<string | null>(null)
  const [sessionLoading, setSessionLoading] = useState(false)
  const [sessionError,   setSessionError]   = useState<string | null>(null)

  // If Whop bounced the buyer back after a failed payment, /checkout/complete
  // redirects to /checkout?error=payment — surface that as the session error
  // (reuses the existing error display below the Continue button).
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('error') === 'payment'
    ) {
      setSessionError('Your payment did not go through. Please try again.')
    }
  }, [])

  // ── Two-step wizard (presentation only — does NOT change the money path) ──
  // step 'details' = contact/delivery/shipping/billing form (unchanged).
  // step 'payment' = order summary + Back + the Whop embed, shown only once the
  // embed is FULLY ready for card entry.
  // While awaitingEmbed is true we show a reassuring loader AND mount the embed
  // off-screen so it initialises; when it reports 'ready' we reveal step 2.
  const [step,          setStep]          = useState<'details' | 'payment'>('details')
  const [awaitingEmbed, setAwaitingEmbed] = useState(false)

  // Prevent empty-cart redirect from racing the /thank-you navigation
  const completing = useRef(false)

  // Redirect if cart is empty (but not mid-completion)
  useEffect(() => {
    if (items.length === 0 && !completing.current) {
      router.push('/product')
    }
  }, [items, router])

  // Mint customer_id as soon as checkout mounts (idempotent — create or read),
  // and fire InitiateCheckout exactly ONCE, only after the cart actually has
  // items. Guarding on items.length prevents a spurious IC (value 0, content_ids
  // ['md'], num_items 0) firing before the cart has hydrated or on a stray
  // empty-cart visit — that would pollute the funnel and could dedup away the
  // buyer's real InitiateCheckout.
  const icFired = useRef(false)
  useEffect(() => {
    const cid = getOrCreateCustomerId()
    if (icFired.current || items.length === 0) return
    icFired.current = true
    // Standardized content_ids: short size id (sm|md|lg) — matches every other funnel event.
    const sizeId = items[0]?.sizeId ?? 'md'
    void trackPixelWithExternalId('InitiateCheckout', cid, {
      content_ids:  [sizeId],
      content_name: PRODUCT_NAME,
      content_type: 'product',
      value:        subtotal,
      currency:     'USD',
      num_items:    items.length,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  // Determine variant from first cart item
  const firstItem = items[0]
  const variantId = firstItem ? variantIdFromCart(firstItem.sizeId) : 'md'
  // Finish (colour) of the chosen item — threaded through so the order record and
  // confirmation email can show the correct per-variant hero image. Size still
  // drives pricing/plans; finish is metadata only.
  const finishId = firstItem?.finishId ?? null

  // Reset the session AND the wizard back to a clean "details" state. Called
  // whenever the buyer edits anything that invalidates the created session
  // (email, address, billing). This guarantees we never reveal the payment step
  // with a stale session/embed — the "re-create if edited" guarantee.
  const resetSession = useCallback(() => {
    setSessionId(null)
    setOrderId(null)
    setWhopEmail(null)
    setPlanId(null)
    setSessionError(null)
    setAwaitingEmbed(false)
    setStep('details')
  }, [])

  // Address field updater
  const handleAddressChange = useCallback((field: keyof AddressState, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
    // If address changes after a session was created, reset it (re-create on edit).
    resetSession()
  }, [resetSession])

  // Validate + create session when form is ready
  const createSession = useCallback(async () => {
    // Reuse-if-unchanged: if a valid session already exists (e.g. the buyer went
    // Back and returned without editing anything — any edit calls resetSession),
    // don't re-create it. Just advance to the payment step with the embed that's
    // already mounted and ready. Editing any field clears sessionId, so reaching
    // here with a sessionId means nothing changed.
    if (sessionId && planId) {
      setStep('payment')
      return
    }

    // Client-side validation
    const newErrors: FieldErrors = {}
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email      = 'Valid email required'
    if (!address.lastName.trim())   newErrors.lastName   = 'Last name required'
    if (!address.line1.trim())      newErrors.line1      = 'Address required'
    if (!address.city.trim())       newErrors.city       = 'City required'
    if (!address.state.trim())      newErrors.state      = 'State required'
    if (!address.postalCode.trim()) newErrors.postalCode = 'ZIP required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSessionLoading(true)
    setSessionError(null)

    try {
      const res = await fetch('/api/checkout/session', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ variantId, finish: finishId, email, address, billingSame }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSessionError(data.error ?? 'Failed to create session')
        return
      }
      setPlanId(planForVariant(variantId))
      setSessionId(data.sessionId)
      setOrderId(data.orderId)
      setWhopEmail(data.whopEmail ?? null)
      // Reveal the payment step IMMEDIATELY so the embed mounts at FULL SIZE,
      // on-screen — a 1x1 / clipped / off-screen iframe gets throttled by the
      // browser and may never fire its 'ready' state (the old bug). The
      // full-page overlay (awaitingEmbed) covers the page meanwhile, so the
      // buyer sees the loader, not the embed initialising underneath. The
      // overlay lifts the instant the embed reports ready.
      setStep('payment')
      setAwaitingEmbed(true)
    } catch (err) {
      setSessionError('Network error — please try again')
    } finally {
      setSessionLoading(false)
    }
  }, [email, address, billingSame, variantId, finishId, sessionId, planId])

  // Handle payment completion — always navigate with OUR order_id so Supabase lookup works
  const handlePaymentComplete = useCallback(() => {
    completing.current = true   // prevent empty-cart redirect from racing

    // Redundancy: fire the browser Purchase Pixel NOW — before navigating — and
    // stash the order id, so a buyer who closes the tab before the thank-you
    // page loads is still counted. event_id = orderId so this dedups with the
    // thank-you-page Pixel AND the webhook CAPI (all three share the order id).
    // Read cart values BEFORE clearCart() empties them.
    if (orderId) {
      try { window.localStorage.setItem('wylorise_last_order', orderId) } catch { /* storage blocked */ }
      const cid = getOrCreateCustomerId()
      void trackPixelPurchase(orderId, cid, {
        value:        subtotal,
        currency:     'USD',
        content_ids:  [variantId],
        content_name: PRODUCT_NAME,
        content_type: 'product',
        num_items:    items.length || 1,
      })
    }

    clearCart()
    // Use a full-page navigation (NOT router.push) so the thank-you Server
    // Component does a fresh render with the ?order= param in the URL. A
    // client-side router.push can serve a prefetched RSC payload that was
    // fetched WITHOUT the query string, dropping ?order= and leaving the
    // page with no order to fetch (so Purchase never fires). A hard
    // navigation guarantees the param reaches the server.
    window.location.assign(`/thank-you?order=${orderId}`)
  }, [clearCart, orderId, subtotal, variantId, items])

  // Fire the mid-funnel AddPaymentInfo at most once, the first time the embed
  // is fully ready (the card form is displayed).
  const addPaymentInfoFired = useRef(false)

  // Holds the deliberate post-'ready' delay before the overlay lifts, so we can
  // clear it if another state event arrives (prevents stacked timers).
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Embed reports its lifecycle state ('loading' | 'ready' | 'disabled'). Once it
  // is 'ready' (fully loaded, card entry usable), reveal the payment step and
  // drop the loader. Guarded on `awaitingEmbed` so a late 'ready' event that
  // arrives AFTER the buyer edited a field (which ran resetSession and set
  // awaitingEmbed=false) can't force an empty payment step.
  const handleEmbedStateChange = useCallback((state: 'loading' | 'ready' | 'disabled') => {
    // The embed is mounted full-size (under the overlay) the moment a session
    // exists, so it loads normally and reports its state. Any non-'loading'
    // state ('ready', or 'disabled' because every field is prefilled/hidden)
    // means the embed has finished initialising → lift the overlay. This is the
    // PRIMARY reveal mechanism; the timer below is only a last-resort net.
    if (state !== 'loading') {
      // Hold the overlay for a deliberate 1.5s beat after the embed reports it's
      // ready, so the card form is fully painted/settled before we reveal it
      // (avoids a flash of half-rendered fields). Clear any prior pending reveal
      // so repeated state events don't stack timers. Presentational only — does
      // not touch the session / money path.
      if (revealTimer.current) clearTimeout(revealTimer.current)
      revealTimer.current = setTimeout(() => setAwaitingEmbed(false), 1500)
    }

    // First time the embed is fully READY (card form displayed + usable), fire
    // AddPaymentInfo — browser Pixel (event_id = cid) + the server CAPI relay
    // (/api/track), deduped on event_id = cid, store-only like every other
    // funnel event. This is a PROXY for "reached the payment form": the buyer
    // hasn't entered card details yet (that happens inside Whop's cross-origin
    // iframe, which the page cannot observe), so it counts everyone who reaches
    // the form. The ref fires it once per checkout; Meta also dedups on cid.
    if (state === 'ready' && !addPaymentInfoFired.current) {
      addPaymentInfoFired.current = true
      const cid = getOrCreateCustomerId()
      const payload = {
        content_ids:  [variantId],
        content_name: PRODUCT_NAME,
        content_type: 'product',
        value:        subtotal,
        currency:     'USD',
        num_items:    items.length || 1,
      }
      void trackPixelWithExternalId('AddPaymentInfo', cid, payload)
      sendServerEvent('AddPaymentInfo', payload)
    }
  }, [variantId, subtotal, items])

  // Last-resort safety net. The embed now mounts full-size on-screen (under the
  // overlay), so it reliably fires its state within a second or two and the
  // overlay lifts via handleEmbedStateChange above. This timer ONLY matters if
  // the embed never reports at all (e.g. a hard network/embed failure) — a
  // generous window so it never pre-empts a slow-but-working embed. It just
  // lifts the overlay so the buyer is never stuck; the embed shows its own state
  // beneath. Presentational only; does not touch the session / money path.
  useEffect(() => {
    if (!awaitingEmbed) return
    const t = setTimeout(() => setAwaitingEmbed(false), 12000)
    return () => clearTimeout(t)
  }, [awaitingEmbed])

  // Clear the deliberate post-'ready' reveal timer on unmount so it can't fire
  // against an unmounted component. Presentational only.
  useEffect(() => () => {
    if (revealTimer.current) clearTimeout(revealTimer.current)
  }, [])

  // Back: return to the details step. The session is preserved (NOT reset) so an
  // unchanged form reuses it; editing any field triggers resetSession() which
  // forces a fresh session — the "reuse if unchanged, re-create if edited" rule.
  const handleBackToDetails = useCallback(() => {
    setStep('details')
  }, [])

  const formReady    = isFormReady(email, address)
  const addrReady    = isAddressReady(address)
  // Require a pool alias (whopEmail) before mounting the embed, so the buyer's
  // REAL email can never reach Whop's prefill. Combined with email={whopEmail
  // ?? ''} below — and Apple Pay / Google Pay being disabled on the Whop plans
  // (those wallets supply the buyer's real email and bypass prefill) — Whop only
  // ever receives a one-time alias.
  const embedReady   = !!(sessionId && planId && whopEmail)

  return (
    <>
      <ThemeStyle />
      <Grain />

      {/* Full-page loading overlay — shown from the instant "Continue to payment"
          is tapped (sessionLoading) through the embed initialising off-screen
          (awaitingEmbed), and removed in one clean cut the moment `step` flips to
          'payment'. Purely presentational: it sits ON TOP of the existing flow and
          changes nothing about the session, Pixel, email aliasing, or the embed. */}
      {(sessionLoading || awaitingEmbed) && <PaymentPreparingOverlay />}

      <CheckoutShell>

        {/* Mobile collapsed order summary */}
        <OrderSummaryCollapse />

        {/* Main layout */}
        <div className="mx-auto max-w-[1100px] px-5 md:px-10 py-8 md:py-12">
          <h1 className="sr-only">Checkout</h1>

          <div className="flex flex-col md:grid md:grid-cols-[1fr_380px] md:gap-12 lg:gap-20 gap-8">

            {/* ── Left column ─────────────────────────────────────────
                The Whop embed mounts ONCE (as soon as a real session exists)
                and stays mounted across the loading→payment transition, so it
                never re-initialises. We only toggle what's visible:
                  • step 'details'              → form (+ Continue or loader)
                  • awaitingEmbed               → form hidden? no — form stays,
                    loader replaces the button; embed is mounted but hidden
                  • step 'payment'              → recap + the (already-ready) embed
            ─────────────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-6 min-w-0">

              {/* DETAILS (contact/delivery/shipping/billing) — shown in step 1.
                  Kept mounted (just hidden) during the brief loading phase so
                  going Back is instant and state is never lost. */}
              <div className={step === 'details' ? 'flex flex-col gap-6' : 'hidden'}>
                <ContactSection
                  email={email}
                  error={errors.email}
                  onChange={v => { setEmail(v); setErrors(p => ({ ...p, email: undefined })); resetSession() }}
                />
                <DeliverySection
                  address={address}
                  errors={errors}
                  onChange={handleAddressChange}
                />
                <ShippingMethod addressReady={addrReady} />
                <BillingToggle checked={billingSame} onChange={v => { setBillingSame(v); resetSession() }} />

                {/* Continue button. The full-page loader overlay (mounted near the
                    top of this component) covers the whole screen while the session
                    is created and the embed initialises off-screen, so the button
                    simply stays here, disabled, underneath it. */}
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={createSession}
                    disabled={sessionLoading || awaitingEmbed}
                    className="h-12 w-full rounded-[6px] font-sans text-[0.92rem] font-semibold transition-opacity disabled:opacity-60"
                    style={{ backgroundColor: 'var(--accent)', color: 'var(--paper)' }}
                  >
                    {sessionLoading || awaitingEmbed ? 'Preparing payment...' : 'Continue to payment'}
                  </button>
                  {sessionError && (
                    <p role="alert" className="font-sans text-[0.78rem] text-center" style={{ color: 'var(--error, #c0392b)' }}>
                      {sessionError}
                    </p>
                  )}
                </div>
              </div>

              {/* PAYMENT step header (Back + recap) — only in step 2 */}
              {step === 'payment' && (
                <div className="flex flex-col gap-5">
                  <button
                    type="button"
                    onClick={handleBackToDetails}
                    className="inline-flex items-center gap-1.5 self-start font-sans text-[0.82rem] transition-colors hover:text-[var(--ink)]"
                    style={{ color: 'var(--ink-mute)' }}
                  >
                    <ChevronLeft size={15} strokeWidth={2} aria-hidden />
                    Back to contact &amp; delivery
                  </button>

                  <div
                    className="rounded-[6px] border p-4 flex flex-col gap-1"
                    style={{ borderColor: 'color-mix(in srgb, var(--ink) 12%, transparent)' }}
                  >
                    <div className="flex justify-between gap-3">
                      <span className="font-sans text-[0.72rem] uppercase tracking-wide" style={{ color: 'var(--ink-mute)' }}>Contact</span>
                      <span className="font-sans text-[0.82rem] text-right truncate" style={{ color: 'var(--ink)' }}>{email}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="font-sans text-[0.72rem] uppercase tracking-wide" style={{ color: 'var(--ink-mute)' }}>Ship to</span>
                      <span className="font-sans text-[0.82rem] text-right" style={{ color: 'var(--ink)' }}>
                        {address.line1}{address.line2 ? `, ${address.line2}` : ''}, {address.city}, {address.state} {address.postalCode}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* THE SINGLE PERSISTENT EMBED.
                  Mounts as soon as a real session + alias exist, at FULL SIZE,
                  and stays mounted. During the initial load `step` is already
                  'payment' and the full-page overlay covers it, so it loads
                  on-screen (never throttled) and fires its ready state, which
                  lifts the overlay. If the buyer goes Back, we only toggle it to
                  `hidden` (display:none) — it stays mounted and already-loaded,
                  so returning is instant with no second initialisation. */}
              {embedReady && (
                <div className={step === 'payment' ? 'block' : 'hidden'}>
                  <WhopPayment
                    planId={planId!}
                    sessionId={sessionId!}
                    orderId={orderId!}
                    email={whopEmail ?? ''}
                    address={address}
                    billingSame={billingSame}
                    onComplete={handlePaymentComplete}
                    onStateChange={handleEmbedStateChange}
                  />
                </div>
              )}

            </div>

            {/* ── Right: sticky summary (desktop only) ──────────────── */}
            <aside className="hidden md:block">
              <div className="sticky top-20">
                <OrderSummarySidebar />
              </div>
            </aside>

          </div>
        </div>

      </CheckoutShell>
    </>
  )
}

// ─── PaymentPreparingOverlay ─────────────────────────────────────────────────
// Full-page loading overlay shown from the instant "Continue to payment" is
// tapped until the Whop embed reports ready (or the last-resort timer fires).
// A clean, standard spinner + calm state copy — no gimmicks. It completely
// covers the page so the buyer never sees the embed initialise underneath.
// Presentation only: mounted purely on (sessionLoading || awaitingEmbed); it
// touches nothing about the session, the Pixel, the email aliasing, or the embed.
const PREP_STAGES = [
  'Verifying your details',
  'Getting your checkout ready',
  'Almost there',
]

function PaymentPreparingOverlay() {
  const [stage, setStage] = useState(0)

  // Advance the reassurance copy on a calm timer. The overlay almost always
  // lifts (on the embed's ready state) within a second or two.
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1300)
    const t2 = setTimeout(() => setStage(2), 2800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Lock background scroll while the overlay is up; reverted on unmount.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center gap-6 px-8"
      style={{ backgroundColor: 'var(--paper)' }}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Preparing your secure checkout"
    >
      {/* wordmark */}
      <div className="font-sans text-[1.1rem] font-semibold tracking-[0.01em]" style={{ color: 'var(--ink)' }}>
        Wylorise
      </div>

      {/* standard spinner — the universally recognised ring */}
      <span
        className="h-10 w-10 rounded-full animate-spin"
        style={{
          border: '3px solid color-mix(in srgb, var(--ink) 12%, transparent)',
          borderTopColor: 'var(--accent)',
        }}
        aria-hidden="true"
      />

      {/* staged state copy */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p
          key={stage}
          className="font-sans text-[1rem] font-medium"
          style={{ color: 'var(--ink)', animation: 'fadeIn 0.35s ease-out' }}
        >
          {PREP_STAGES[stage]}
        </p>
        <p className="font-sans text-[0.8rem]" style={{ color: 'var(--ink-mute)' }}>
          This only takes a moment — please keep this page open.
        </p>
      </div>

      {/* secure reassurance */}
      <div className="flex items-center gap-1.5 font-sans text-[0.74rem]" style={{ color: 'var(--ink-mute)' }}>
        <Lock size={11} strokeWidth={2} aria-hidden />
        Secure checkout
      </div>

      <style dangerouslySetInnerHTML={{ __html: '@keyframes fadeIn{from{opacity:0}to{opacity:1}}' }} />
    </div>
  )
}
