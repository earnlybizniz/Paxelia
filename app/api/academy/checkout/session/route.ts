// app/api/academy/checkout/session/route.ts
/**
 * Academy checkout session — a near-verbatim copy of the store's
 * /api/checkout/session, with exactly two intentional differences:
 *   1. The customer's REAL email is sent to Whop (no one-time pool alias).
 *   2. No Meta / CAPI tracking is fired.
 * Everything else matches the store: the same metadata shape, the same
 * Supabase `orders` fill, the Whop checkout session, the alder_cid cookie,
 * and server-computed totals (never trusting the client price).
 * Lives under /api/ so middleware bypasses tenant routing.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/whop'
import { planForVariant } from '@/lib/whop-plans'
import { createSupabaseServer } from '@/lib/supabase-server'
import { validateCheckoutInput, computeTotals } from '@/lib/checkout'
import { getCustomerIdFromCookieHeader } from '@/lib/customer-id'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { variantId, email, address, billingSame } = body

    // Validate input (same rules as the store — requires email + address fields)
    const validationError = validateCheckoutInput({ variantId, email, address, billingSame })
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    // Read customer_id from cookie — mint one server-side if absent (same as store)
    const cookieHeader = req.headers.get('cookie')
    let customerId = getCustomerIdFromCookieHeader(cookieHeader)
    let needsSetCookie = false
    if (!customerId) {
      customerId = crypto.randomUUID()
      needsSetCookie = true
    }

    // Server-computed totals — never trust the client price
    const totals = computeTotals(variantId)
    const planId = planForVariant(variantId)
    if (!planId) {
      return NextResponse.json({ error: 'No payment plan configured for this option' }, { status: 400 })
    }

    const orderId = crypto.randomUUID()

    // Same metadata shape the store sends — but with the customer's REAL email.
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
          email,            // REAL email goes to Whop for the academy
          variant_id:  variantId,
          fbp,
          fbc,
          user_agent:  userAgent,
        },
        returnUrl: `${siteUrl}/checkout/complete?order=${orderId}`,
      })
    } catch (whopErr) {
      console.error('[academy/checkout/session] Whop SDK error:', whopErr)
      return NextResponse.json({ error: 'Payment provider unavailable — check WHOP_API_KEY' }, { status: 503 })
    }

    // Same Supabase `orders` fill as the store (real email stored here too).
    try {
      const supabase = createSupabaseServer()
      await supabase.from('orders').upsert({
        id:               orderId,
        customer_id:      customerId,
        status:           'draft',
        variant_id:       variantId,
        plan_id:          planId,
        session_id:       sessionId,
        items:            [{ variantId, finish: null, quantity: 1, price: totals.subtotal }],
        subtotal:         totals.subtotal,
        shipping:         totals.shipping,
        total:            totals.total,
        currency:         totals.currency,
        email,
        first_name:       address.firstName,
        last_name:        address.lastName,
        shipping_address: address,
        billing_same:     billingSame,
      }, { onConflict: 'id' })
    } catch (dbErr) {
      // Log but don't block — payment can still complete via the Whop webhook
      console.error('[academy/checkout/session] Supabase upsert error:', dbErr)
    }

    const res = NextResponse.json({ sessionId, orderId })
    if (needsSetCookie) {
      res.cookies.set('alder_cid', customerId, {
        maxAge:   60 * 60 * 24 * 365 * 2, // 2 years
        path:     '/',
        sameSite: 'lax',
        httpOnly: false,
      })
    }
    return res
  } catch (err) {
    console.error('[academy/checkout/session] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
