/**
 * app/api/checkout/session/route.ts
 * POST: Validates input, recomputes total server-side, creates Whop checkout
 * session with metadata, upserts Supabase draft order, returns sessionId.
 */
import { NextRequest, NextResponse } from 'next/server'
import { cookies, headers } from 'next/headers'
import { createCheckoutSession } from '@/lib/whop'
import { planForVariant, priceForVariant } from '@/lib/whop-plans'
import { createSupabaseServer } from '@/lib/supabase-server'
import { validateCheckoutInput, computeTotals } from '@/lib/checkout'
import { trackCapi } from '@/lib/meta'
import { PRODUCT_NAME } from '@/lib/pdp-product'
import { getCustomerIdFromCookieHeader } from '@/lib/customer-id'
import { claimWhopEmail } from '@/lib/whop-email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { variantId, finish, email, address, billingSame } = body

    // Validate input
    const validationError = validateCheckoutInput({ variantId, email, address, billingSame })
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    // Read customer_id from cookie — mint one server-side if absent
    const cookieHeader = req.headers.get('cookie')
    let customerId = getCustomerIdFromCookieHeader(cookieHeader)
    let needsSetCookie = false
    if (!customerId) {
      customerId = crypto.randomUUID()
      needsSetCookie = true
    }

    // Server-computed totals — never trust client price
    const totals = computeTotals(variantId)
    const planId = planForVariant(variantId)
    if (!planId) {
      return NextResponse.json({ error: 'No payment plan configured for this variant' }, { status: 400 })
    }

    // Generate order_id
    const orderId = crypto.randomUUID()

    // Claim a one-time pool email to send to Whop (keeps the customer's real
    // email out of Whop). Retry once to ride out a transient RPC hiccup, then —
    // as an ABSOLUTE LAST RESORT — fall back to the customer's real email so a
    // sale is NEVER blocked. Falling back means the real email reaches Whop for
    // that one order (the accepted trade-off vs. losing the sale). Refill the
    // pool when this happens — see docs/SUPABASE_SETUP.md.
    const supabase = createSupabaseServer()
    let whopEmail = await claimWhopEmail(supabase, orderId)
    if (!whopEmail) {
      await new Promise((r) => setTimeout(r, 200))
      whopEmail = await claimWhopEmail(supabase, orderId)
    }
    if (!whopEmail) {
      whopEmail = email
      console.error(
        '[checkout/session] whop_email_pool EXHAUSTED — fell back to REAL customer email for order',
        orderId,
        '— REFILL THE POOL (see docs/SUPABASE_SETUP.md).',
      )
    }

    // Create Whop checkout session with metadata for dedup + CAPI enrichment
    const siteUrl   = process.env.NEXT_PUBLIC_SITE_URL ?? ''
    const userAgent = req.headers.get('user-agent') ?? undefined
    const fbp       = cookieHeader?.match(/_fbp=([^;]*)/)?.[1]
    const fbc       = cookieHeader?.match(/_fbc=([^;]*)/)?.[1]

    let sessionId: string
    try {
      sessionId = await createCheckoutSession({
        planId,
        metadata: {
          customer_id: customerId,
          order_id:    orderId,
          email:       whopEmail,   // ALIAS sent to Whop (not the customer's real email)
          variant_id:  variantId,
          fbp,
          fbc,
          user_agent:  userAgent,
        },
        returnUrl: `${siteUrl}/checkout/complete?order=${orderId}`,
      })
    } catch (whopErr) {
      console.error('[checkout/session] Whop SDK error:', whopErr)
      return NextResponse.json({ error: 'Payment provider unavailable — check WHOP_API_KEY' }, { status: 503 })
    }

    // Upsert the Supabase draft order. This row is REQUIRED: the webhook looks it
    // up by id to mark it paid, send the confirmation email, and fire the Purchase
    // CAPI. If it's missing, a paid order becomes invisible (no record, no email,
    // no conversion event). So we retry transient failures and, if the row still
    // can't be written, FAIL CLOSED before payment — better a "try again shortly"
    // than a silent lost sale. (Any Whop session created just above is harmless if
    // we bail here — it simply goes unused; no charge happens without the embed.)
    // Stores the customer's REAL email (Whop only ever received the alias above).
    const draftRow = {
      id:               orderId,
      customer_id:      customerId,
      status:           'draft',
      variant_id:       variantId,
      plan_id:          planId,
      session_id:       sessionId,
      items:            [{ variantId, finish: typeof finish === 'string' ? finish : null, quantity: 1, price: totals.subtotal }],
      subtotal:         totals.subtotal,
      shipping:         totals.shipping,
      total:            totals.total,
      currency:         totals.currency,
      email,
      first_name:       address.firstName,
      last_name:        address.lastName,
      shipping_address: address,
      billing_same:     billingSame,
    }

    let draftSaved = false
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const { error: upsertError } = await supabase
          .from('orders')
          .upsert(draftRow, { onConflict: 'id' })
        if (!upsertError) {
          draftSaved = true
          break
        }
        console.error(`[checkout/session] draft upsert attempt ${attempt}/3 failed:`, upsertError)
      } catch (dbErr) {
        console.error(`[checkout/session] draft upsert attempt ${attempt}/3 threw:`, dbErr)
      }
      if (attempt < 3) await new Promise((r) => setTimeout(r, 200 * attempt))
    }

    if (!draftSaved) {
      console.error('[checkout/session] draft order could not be saved after retries — blocking checkout for order', orderId)
      return NextResponse.json(
        { error: 'Payment is temporarily unavailable. Please try again shortly.' },
        { status: 503 },
      )
    }

    // Fire InitiateCheckout CAPI (non-blocking — don't fail checkout if tracking fails)
    trackCapi({
      event_name:       'InitiateCheckout',
      event_id:         customerId,
      external_id:      customerId,
      event_source_url: `${siteUrl}/checkout`,
      user_email:       email,
      user_agent:       userAgent,
      fbp,
      fbc,
      value:            totals.total,
      currency:         totals.currency,
      content_ids:      [variantId],   // standardized: short size id (sm|md|lg)
      content_name:     PRODUCT_NAME,
      content_type:     'product',
      num_items:        1,
    }).catch(capiErr => console.error('[checkout/session] CAPI error:', capiErr))

    const res = NextResponse.json({ sessionId, orderId, whopEmail })
    if (needsSetCookie) {
      res.cookies.set('alder_cid', customerId, {
        maxAge:   60 * 60 * 24 * 365 * 2, // 2 years
        path:     '/',
        sameSite: 'lax',
        httpOnly: false, // must be readable by Pixel JS client-side
      })
    }
    return res
  } catch (err) {
    console.error('[checkout/session] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
