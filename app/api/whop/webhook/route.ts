/**
 * app/api/whop/webhook/route.ts
 * Receives Whop payment webhooks (Standard Webhooks spec).
 * Verifies signature via standardwebhooks, reads our metadata defensively,
 * idempotently marks order paid, fires CAPI Purchase.
 */
import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, WebhookVerificationError } from '@/lib/whop'
import { createSupabaseServer } from '@/lib/supabase-server'
import { trackCapi } from '@/lib/meta'
import { ALDER_PRODUCT } from '@/lib/pdp-product'
import { priceForVariant, planForVariant } from '@/lib/whop-plans'
import { Resend } from 'resend'
import { renderOrderConfirmationEmail, type EmailOrder } from '@/lib/email-templates'

// Helper: read metadata from any path Whop might use
function extractMeta(data: Record<string, unknown>) {
  return (
    (data.metadata as Record<string, string> | undefined) ??
    (data.plan    as { metadata?: Record<string, string> } | undefined)?.metadata ??
    (data.membership as { metadata?: Record<string, string> } | undefined)?.metadata ??
    (data.checkout_session as { metadata?: Record<string, string> } | undefined)?.metadata ??
    {}
  )
}

// Backup: pull the finish/colour out of the stored order.items array if it
// wasn't present in the Whop metadata. Returns null when unavailable.
function extractFinishFromItems(items: unknown): string | null {
  if (!Array.isArray(items)) return null
  const first = items[0] as { finish?: unknown } | undefined
  return first && typeof first.finish === 'string' ? first.finish : null
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  // Build Standard Webhooks header map from the request
  const hdrs: Record<string, string | null> = {
    'webhook-id':        req.headers.get('webhook-id'),
    'webhook-timestamp': req.headers.get('webhook-timestamp'),
    // primary Standard Webhooks header; fall back to x-whop-signature if absent
    'webhook-signature': req.headers.get('webhook-signature') ?? req.headers.get('x-whop-signature'),
  }

  let payload: unknown
  try {
    payload = verifyWebhookSignature(rawBody, hdrs)
  } catch (err) {
    // 401 is appropriate for auth failures — Whop will NOT retry 4xx
    if (err instanceof WebhookVerificationError) {
      console.error('[webhook] Signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
    console.error('[webhook] Unexpected error during verification:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }

  const event = payload as {
    type?: string
    data?: Record<string, unknown>
  }

  // Only handle payment.succeeded
  if (event.type !== 'payment.succeeded') {
    // Check for setup_intent.succeeded (saves rebilling ids)
    if (event.type === 'setup_intent.succeeded') {
      return handleSetupIntentSucceeded(event)
    }
    // Reconcile failed rebill payments
    if (event.type === 'payment.failed') {
      return handlePaymentFailed(event)
    }
    return NextResponse.json({ received: true })
  }

  const data      = event.data ?? {}
  const paymentId = data.id as string | undefined
  const userEmail = (data.user as { email?: string } | undefined)?.email ?? ''

  // Read metadata defensively from all known paths
  const meta = extractMeta(data)

  // If rebill_id is present this is a rebill payment — reconcile and exit,
  // do NOT run the order-paid / CAPI flow below.
  if (meta.rebill_id) {
    return handleRebillSucceeded(meta.rebill_id, paymentId)
  }

  if (!meta.order_id || !meta.customer_id) {
    // Unrecoverable — missing metadata won't be fixed by retrying. Return 200.
    console.error('[webhook] Missing metadata in payment.succeeded — full data:', JSON.stringify(data))
    return NextResponse.json({ received: true })
  }

  const { order_id: orderId, customer_id: customerId, variant_id: variantId, email: metaEmail } = meta
  const email = userEmail || metaEmail || ''

  // Rebill IDs (member + payment_method) from this payload. Extracted here so
  // BOTH the normal paid-flow and the reconstruction path below can persist them.
  // Paths confirmed from live payload: data.member.id (mber_…), data.payment_method.id (payt_…).
  const memberId =
    (data.member_id as string | undefined) ??
    (data.member as { id?: string } | undefined)?.id
  const paymentMethodId =
    (data.payment_method_id as string | undefined) ??
    (data.payment_method as { id?: string } | undefined)?.id

  const supabase = createSupabaseServer()

  const { data: existing, error: fetchError } = await supabase
    .from('orders')
    .select('id, status, subtotal, shipping, total, currency, email, customer_id, variant_id, items, first_name, last_name, shipping_address')
    .eq('id', orderId)
    .maybeSingle()

  if (fetchError) {
    // Transient DB read error — let Whop retry (do NOT treat this as "missing").
    console.error('[webhook] Order fetch error (transient) — Whop will retry:', orderId, fetchError)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  if (!existing) {
    // The draft row is genuinely missing — almost always a Supabase blip at
    // session-creation time. Reconstruct a paid order from the Whop metadata so
    // the Purchase event STILL fires and a paid record exists. The real email /
    // name / address cannot be recovered (they only ever lived in the lost draft;
    // Whop holds just the one-time alias by design), but the conversion is never
    // lost. See reconstructPaidOrder below.
    return reconstructPaidOrder({ orderId, customerId, variantId, meta, paymentId, memberId, paymentMethodId })
  }

  if (existing.status !== 'draft') {
    // Already processed — idempotent
    return NextResponse.json({ received: true })
  }

  const { data: updatedRows, error: updateError } = await supabase
    .from('orders')
    .update({
      // NOTE: do NOT write email here. The customer's real email was stored at
      // draft creation; Whop only ever received a one-time alias, so writing the
      // webhook's email back would overwrite the real address with the alias.
      status:          'paid',
      whop_payment_id: paymentId,
      ...(memberId         ? { whop_member_id:         memberId }         : {}),
      ...(paymentMethodId  ? { whop_payment_method_id: paymentMethodId }  : {}),
      updated_at:      new Date().toISOString(),
    })
    .eq('id', orderId)
    .eq('status', 'draft')   // atomic transition guard: ONLY the delivery that flips draft→paid proceeds
    .select('id')

  if (updateError) {
    // Transient DB failure — return 500 so Whop retries
    console.error('[webhook] Supabase update failed:', updateError)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  // If no row was transitioned, a concurrent/duplicate delivery already flipped
  // this order draft→paid and is handling the email + Purchase. Skip so the
  // buyer never receives a second confirmation email. (The status read above
  // also catches the common case; this closes the race where two deliveries
  // both pass that read before either writes.) Idempotent no-op.
  if (!updatedRows || updatedRows.length === 0) {
    return NextResponse.json({ received: true })
  }

  // Read fbp/fbc/user_agent captured at session-creation time
  const fbp        = meta.fbp
  const fbc        = meta.fbc
  const user_agent = meta.user_agent

  // Fire Purchase CAPI (authoritative) — dedup via event_id = order_id so it
  // matches the browser Purchase Pixels (checkout onComplete + thank-you page)
  // and a customer's repeat purchases are never collapsed into one event.
  // external_id = customer_id is still sent (hashed) for matching.
  // Wrapped in try/catch: trackCapi already swallows network errors internally,
  // but this also guards the hashing/serialisation step so a throw here can
  // never skip the confirmation email below or 500 the webhook — a 500 makes
  // Whop retry, and the retry would short-circuit at the draft-status check
  // above, permanently skipping the email for an order that is already paid.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  try {
    await trackCapi({
      event_name:       'Purchase',
      event_id:         orderId,
      external_id:      customerId,
      event_source_url: `${siteUrl}/checkout`,
      // Use the REAL email stored on the order (Whop only had a one-time alias).
      user_email:       (existing.email as string | undefined) || undefined,
      user_agent,
      fbp,
      fbc,
      value:            existing.total,
      // Use currency from the order row; fall back to 'USD'
      currency:         (existing.currency as string | undefined) ?? 'USD',
      content_ids:      variantId ? [variantId] : undefined,
      content_name:     ALDER_PRODUCT.name,
      num_items:        1,
    })
  } catch (capiErr) {
    console.error('[webhook] Purchase CAPI send failed:', capiErr)
  }

  // Send the order-confirmation email (non-blocking — a mail failure must never
  // fail the webhook, or Whop will retry a payment that already succeeded).
  try {
    const toEmail = (existing.email as string | undefined) || email
    const fromEmail = process.env.SUPPORT_FROM_EMAIL
    if (toEmail && fromEmail && process.env.RESEND_API_KEY) {
      const emailOrder: EmailOrder = {
        id:               existing.id as string,
        email:            toEmail,
        first_name:       (existing.first_name as string | null) ?? null,
        last_name:        (existing.last_name as string | null) ?? null,
        variant_id:       (existing.variant_id as string | null) ?? variantId ?? null,
        finish_id:        extractFinishFromItems(existing.items) || null,
        subtotal:         (existing.subtotal as number | null) ?? null,
        shipping:         (existing.shipping as number | null) ?? null,
        total:            (existing.total as number | null) ?? null,
        currency:         (existing.currency as string | null) ?? 'USD',
        shipping_address: (existing.shipping_address as EmailOrder['shipping_address']) ?? null,
      }
      const { subject, html } = renderOrderConfirmationEmail(emailOrder)
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from:    `${ALDER_PRODUCT.brand} <${fromEmail}>`,
        to:      toEmail,
        subject,
        html,
      })
    } else {
      console.error('[webhook] confirmation email skipped — missing recipient or RESEND config')
    }
  } catch (mailErr) {
    console.error('[webhook] confirmation email send failed:', mailErr)
  }

  return NextResponse.json({ received: true })
}

// ─────────────────────────────────────────────────────────────────────────────
// reconstructPaidOrder — last-resort recovery when the draft order row is
// missing at webhook time (a Supabase blip during session creation). Rebuilds a
// paid order from the Whop metadata + the canonical variant price, idempotently,
// and fires the authoritative Purchase CAPI so the conversion is never lost.
// The real email / name / address cannot be recovered (they lived only in the
// lost draft; Whop holds just the one-time alias), so the record is partial and
// no confirmation email is sent — but the order is recorded and Purchase fires.
// ─────────────────────────────────────────────────────────────────────────────
async function reconstructPaidOrder(opts: {
  orderId: string
  customerId: string
  variantId?: string
  meta: Record<string, string>
  paymentId?: string
  memberId?: string
  paymentMethodId?: string
}) {
  const { orderId, customerId, variantId, meta, paymentId, memberId, paymentMethodId } = opts
  const supabase = createSupabaseServer()

  const total  = variantId ? priceForVariant(variantId) : 0
  const planId = variantId ? planForVariant(variantId) : null

  // Idempotent insert (ON CONFLICT DO NOTHING). If a row comes back, THIS
  // delivery created the record and owns the Purchase event; if not, a
  // concurrent/duplicate delivery already reconstructed it — skip the event.
  const reconRow = {
    id:               orderId,
    customer_id:      customerId,
    status:           'paid',
    variant_id:       variantId ?? null,
    plan_id:          planId,
    items:            [{ variantId: variantId ?? null, finish: null, quantity: 1, price: total }],
    subtotal:         total,
    shipping:         0,
    total,
    currency:         'usd',
    // Only the Whop alias is available here — the real email lived only in the
    // lost draft row and is deliberately never sent to Whop.
    email:            meta.email ?? '',
    whop_payment_id:  paymentId ?? null,
    ...(memberId        ? { whop_member_id:         memberId }        : {}),
    ...(paymentMethodId ? { whop_payment_method_id: paymentMethodId } : {}),
    updated_at:       new Date().toISOString(),
  }

  const { data: insertedRows, error: insertError } = await supabase
    .from('orders')
    .upsert(reconRow, { onConflict: 'id', ignoreDuplicates: true })
    .select('id')

  if (insertError) {
    // Transient DB error — let Whop retry so the record eventually lands. CAPI
    // hasn't fired yet, so the retry can't double-count.
    console.error('[webhook] reconstruction insert failed — Whop will retry:', orderId, insertError)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  const weOwn = !!(insertedRows && insertedRows.length > 0)
  console.warn(
    '[webhook] draft row was missing — reconstructed paid order from metadata:',
    orderId,
    weOwn ? '(this delivery owns it)' : '(already handled by another delivery)',
  )

  if (weOwn) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
    try {
      await trackCapi({
        event_name:       'Purchase',
        event_id:         orderId,           // dedups with both browser Purchase pixels
        external_id:      customerId,
        event_source_url: `${siteUrl}/checkout`,
        user_agent:       meta.user_agent,
        fbp:              meta.fbp,
        fbc:              meta.fbc,
        value:            total,
        currency:         'USD',
        content_ids:      variantId ? [variantId] : undefined,
        content_name:     ALDER_PRODUCT.name,
        num_items:        1,
      })
    } catch (capiErr) {
      console.error('[webhook] reconstructed Purchase CAPI failed:', capiErr)
    }
  }

  return NextResponse.json({ received: true })
}

// ─────────────────────────────────────────────────────────────────────────────
// setup_intent.succeeded — saves rebilling ids (runs alongside payment.succeeded)
// ─────────────────────────────────────────────────────────────────────────────
async function handleSetupIntentSucceeded(event: { data?: Record<string, unknown> }) {
  const data = event.data ?? {}

  const meta = extractMeta(data)
  const orderId = meta.order_id

  // Read member_id and payment_method_id from various possible paths
  const memberId =
    (data.member_id as string | undefined) ??
    (data.member as { id?: string } | undefined)?.id
  const paymentMethodId =
    (data.payment_method_id as string | undefined) ??
    (data.payment_method as { id?: string } | undefined)?.id

  if (!orderId || !memberId || !paymentMethodId) {
    console.error('[webhook] setup_intent.succeeded missing ids — orderId:', orderId, 'memberId:', memberId, 'paymentMethodId:', paymentMethodId)
    return NextResponse.json({ received: true }) // 200, don't infinite-retry
  }

  const supabase = createSupabaseServer()
  const { error } = await supabase
    .from('orders')
    .update({
      whop_member_id:         memberId,
      whop_payment_method_id: paymentMethodId,
      updated_at:             new Date().toISOString(),
    })
    .eq('id', orderId)

  if (error) {
    console.error('[webhook] failed to store rebilling ids:', error)
    return NextResponse.json({ error: 'DB error' }, { status: 500 }) // transient → allow retry
  }

  return NextResponse.json({ received: true })
}

// ─────────────────────────────────────────────────────────────────────────────
// handleRebillSucceeded — marks a pending rebill row as succeeded
// Idempotency guard: only transitions from pending → succeeded.
// Duplicate or late webhooks are silently ignored.
// ─────────────────────────────────────────────────────────────────────────────
async function handleRebillSucceeded(rebillId: string, whopPaymentId: string | undefined) {
  const supabase = createSupabaseServer()

  // Fetch current status first — skip if already resolved
  const { data: existing, error: fetchErr } = await supabase
    .from('rebills')
    .select('status')
    .eq('id', rebillId)
    .single()

  if (fetchErr || !existing) {
    console.error('[webhook] handleRebillSucceeded: rebill row not found:', rebillId)
    return NextResponse.json({ received: true }) // 200 — don't retry for missing rows
  }

  if (existing.status !== 'pending') {
    // Already resolved (succeeded or failed) — idempotent no-op
    return NextResponse.json({ received: true })
  }

  const { error } = await supabase
    .from('rebills')
    .update({
      status:          'succeeded',
      whop_payment_id: whopPaymentId ?? null,
      updated_at:      new Date().toISOString(),
    })
    .eq('id', rebillId)
    .eq('status', 'pending') // extra guard at DB level

  if (error) {
    console.error('[webhook] handleRebillSucceeded DB error:', error)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
  return NextResponse.json({ received: true })
}

// ─────────────────────────────────────────────────────────────────────────────
// handlePaymentFailed — marks a pending rebill row as failed
// ─────────────────────────────────────────────────────────────────────────────
async function handlePaymentFailed(event: { data?: Record<string, unknown> }) {
  const data    = event.data ?? {}
  const meta    = extractMeta(data)
  const rebillId = meta.rebill_id

  if (!rebillId) {
    // Not a rebill payment — nothing to reconcile
    return NextResponse.json({ received: true })
  }

  const supabase = createSupabaseServer()
  const { error } = await supabase
    .from('rebills')
    .update({
      status:     'failed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', rebillId)

  if (error) {
    console.error('[webhook] handlePaymentFailed DB error:', error)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
  return NextResponse.json({ received: true })
}
