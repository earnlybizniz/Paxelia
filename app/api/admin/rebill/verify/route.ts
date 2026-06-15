/**
 * app/api/admin/rebill/verify/route.ts
 * POST /api/admin/rebill/verify
 *
 * Verifies that a Whop member's saved payment method still exists and is
 * accessible before an admin initiates a rebill charge.
 *
 * Whop SDK used:
 *   whop.paymentMethods.retrieve(id)
 *   Source: node_modules/@whop/sdk/resources/payment-methods.d.ts
 *   Returns: PaymentMethodRetrieveResponse (discriminated union on `typename`)
 *     - BasePaymentMethod        { id, payment_method_type, typename }
 *     - CardPaymentMethod        { ..., card: { brand, last4, exp_month, exp_year } }
 *     - UsBankAccountPaymentMethod { ..., us_bank_account: { bank_name, last4, account_type } }
 *     - CashappPaymentMethod     { ..., cashapp: { cashtag, buyer_id } }
 *     - IdealPaymentMethod       { ..., ideal: { bank, bic } }
 *     - SepaDebitPaymentMethod   { ..., sepa_debit: { last4, ... } }
 *
 * IMPORTANT: `paymentMethods.retrieve` requires the API key to have
 * `member:payment_methods:read` permission on the Whop app.
 *
 * Returns:
 *   { verified: true,  method: { type: string, last4?: string } }  — method found
 *   { verified: false, reason: string }                            — method gone / mismatch
 *   { verified: false, error: 'whop_unavailable' }                 — Whop API error/timeout
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin-auth'
import Whop from '@whop/sdk'

export async function POST(req: NextRequest) {
  const auth = requireAdminApi(req)
  if (!auth.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { member_id, payment_method_id } = await req.json()

  if (!member_id || !payment_method_id) {
    return NextResponse.json(
      { error: 'member_id and payment_method_id are required' },
      { status: 400 }
    )
  }

  const apiKey = process.env.WHOP_API_KEY || ''
  if (!apiKey) {
    return NextResponse.json({ error: 'WHOP_API_KEY not configured' }, { status: 500 })
  }

  try {
    const whop = new Whop({ apiKey })

    // Retrieve the specific payment method by ID.
    // This is the most direct verification: if it resolves, the method exists and
    // is accessible. If Whop throws a 404 or permission error, it's gone.
    const method = await whop.paymentMethods.retrieve(payment_method_id)

    // Extra guard: confirm the returned id matches what we asked for
    if (method.id !== payment_method_id) {
      return NextResponse.json({
        verified: false,
        reason: 'Payment method ID mismatch — Whop returned a different method',
      })
    }

    // Extract type + last4 for display (never expose full card data)
    let type: string = method.payment_method_type ?? 'unknown'
    let last4: string | undefined

    if (method.typename === 'CardPaymentMethod' && 'card' in method) {
      type  = method.card.brand ?? 'card'
      last4 = method.card.last4 ?? undefined
    } else if (method.typename === 'UsBankAccountPaymentMethod' && 'us_bank_account' in method) {
      type  = `bank (${method.us_bank_account.bank_name})`
      last4 = method.us_bank_account.last4
    } else if (method.typename === 'SepaDebitPaymentMethod' && 'sepa_debit' in method) {
      type  = 'sepa_debit'
      last4 = method.sepa_debit.last4 ?? undefined
    } else if (method.typename === 'CashappPaymentMethod' && 'cashapp' in method) {
      type  = 'cashapp'
      last4 = method.cashapp.cashtag ?? undefined
    }

    return NextResponse.json({ verified: true, method: { type, last4 } })

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)

    // Distinguish "not found / gone" from a generic Whop outage
    // The Whop SDK throws with status codes embedded in the message or as .status
    const errAny = err as Record<string, unknown>
    const status = typeof errAny?.status === 'number' ? errAny.status : 0

    if (status === 404 || message.toLowerCase().includes('not found')) {
      return NextResponse.json({
        verified: false,
        reason: 'Payment method no longer exists on Whop',
      })
    }

    // Any other error (network, 5xx, auth, etc.) → graceful degradation
    console.error('[rebill/verify] Whop API error:', message)
    return NextResponse.json({ verified: false, error: 'whop_unavailable' })
  }
}
