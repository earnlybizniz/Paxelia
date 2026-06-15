/**
 * app/api/admin/rebill/route.ts
 * POST /api/admin/rebill
 * Charges a saved payment method off-session via Whop.
 *
 * Whop payments.create payload (verified against https://dev.whop.com/api-reference/v2/payments/create-a-payment):
 *   Top-level:  company_id, member_id, payment_method_id, plan, metadata
 *   plan:       initial_price (dollars), plan_type: "one_time", company_id, currency
 *   metadata:   arbitrary key/value — used to tag rebill_id for webhook reconciliation
 *
 * Flow:
 *   1. Verify admin session
 *   2. Load whop_member_id + whop_payment_method_id from DB (never trust client)
 *   3. Insert a pending rebills row as an audit record
 *   4. Call Whop — on success store whop_payment_id (status stays pending until webhook)
 *   5. Webhook payment.succeeded / payment.failed reconciles the row via rebill_id in metadata
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin-auth'
import { createSupabaseServer } from '@/lib/supabase-server'
import Whop from '@whop/sdk'

export async function POST(req: NextRequest) {
  const auth = requireAdminApi(req)
  if (!auth.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { order_id, amount, currency = 'usd' } = await req.json()

  if (!order_id || typeof amount !== 'number' || amount <= 0) {
    return NextResponse.json(
      { error: 'order_id and a positive amount are required' },
      { status: 400 }
    )
  }

  const supabase = createSupabaseServer()

  // Re-fetch payment credentials from DB — never trust client-supplied ids
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .select('id, email, first_name, whop_member_id, whop_payment_method_id, status')
    .eq('id', order_id)
    .single()

  if (orderErr || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  if (!order.whop_member_id || !order.whop_payment_method_id) {
    return NextResponse.json(
      { error: 'Order does not have a saved payment method. Customer must re-purchase with setupFutureUsage enabled.' },
      { status: 422 }
    )
  }

  // Canonical env var — used everywhere in the codebase
  const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || ''

  if (!companyId) {
    return NextResponse.json({ error: 'NEXT_PUBLIC_WHOP_COMPANY_ID not configured' }, { status: 500 })
  }

  // Insert pending audit row before calling Whop so it exists even if Whop times out
  const { data: rebillRow, error: insertErr } = await supabase
    .from('rebills')
    .insert({
      order_id:          order.id,
      member_id:         order.whop_member_id,
      payment_method_id: order.whop_payment_method_id,
      amount,
      currency,
      status:            'pending',
      created_at:        new Date().toISOString(),
    })
    .select('id')
    .single()

  if (insertErr || !rebillRow) {
    console.error('[rebill] Failed to insert rebills row:', insertErr)
    return NextResponse.json({ error: 'Failed to create rebill record' }, { status: 500 })
  }

  const rebillId = rebillRow.id

  try {
    const whop = new Whop({ apiKey: process.env.WHOP_API_KEY || '' })

    // Verified payload shape from installed SDK types (resources/payments.d.ts):
    // Top-level: company_id, member_id, payment_method_id, plan, metadata
    // plan fields: currency (required), initial_price, plan_type — NO company_id inside plan
    const payment = await whop.payments.create({
      company_id:        companyId,
      member_id:         order.whop_member_id,
      payment_method_id: order.whop_payment_method_id,
      plan: {
        initial_price: amount,    // dollars, e.g. 49.00
        plan_type:     'one_time',
        currency,
      },
      // rebill_id lets the webhook identify and reconcile this exact audit row
      metadata: {
        rebill_id: rebillId,
        order_id:  order.id,
      },
    })

    // Store the returned Whop payment id (status stays pending until webhook confirms)
    await supabase
      .from('rebills')
      .update({ whop_payment_id: payment.id })
      .eq('id', rebillId)

    return NextResponse.json({
      success:    true,
      rebill_id:  rebillId,
      payment_id: payment.id,
      status:     payment.status,
    })
  } catch (err) {
    console.error('[rebill] Whop API error:', err)

    await supabase
      .from('rebills')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('id', rebillId)

    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Whop API error' },
      { status: 502 }
    )
  }
}
