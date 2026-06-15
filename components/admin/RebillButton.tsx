'use client'

/**
 * components/admin/RebillButton.tsx
 *
 * Per-row action button for the finance page "Members Ready for Rebilling" table.
 *
 * Flow:
 *   1. Admin clicks "Charge"
 *   2. POST /api/admin/rebill/verify  (verify method still exists on Whop)
 *      a. verified: false + reason   → show discrepancy error, block charge
 *      b. verified: false + error: whop_unavailable → warn, offer "proceed anyway" with confirm
 *      c. verified: true              → show confirm dialog with customer + amount + last4
 *   3. Admin confirms → POST /api/admin/rebill { order_id, amount, currency }
 *      (route re-reads canonical ids from Supabase — client never sends raw member/method ids)
 *   4. Pending → success / failure state displayed inline
 *
 * Amount is in dollars (Whop API uses dollars, not cents).
 */

import { useState } from 'react'
import { Loader2, AlertTriangle, ShieldAlert, CheckCircle, XCircle } from 'lucide-react'

interface RebillButtonProps {
  orderId:         string
  memberId:        string
  paymentMethodId: string
  email:           string
  defaultAmount:   number   // dollars, e.g. 899.00
}

type VerifyResult =
  | { verified: true;  method: { type: string; last4?: string } }
  | { verified: false; reason: string }
  | { verified: false; error: 'whop_unavailable' }

type Stage =
  | 'idle'
  | 'verifying'
  | 'discrepancy'       // method gone — block charge
  | 'unavailable'       // Whop unreachable — warn, allow proceed-with-confirm
  | 'confirmed'         // Whop says method is good — show confirm dialog
  | 'charging'
  | 'success'
  | 'failed'

export function RebillButton({
  orderId,
  memberId,
  paymentMethodId,
  email,
  defaultAmount,
}: RebillButtonProps) {
  const [stage,      setStage]      = useState<Stage>('idle')
  const [isCharging, setIsCharging] = useState(false)
  const [amount,     setAmount]     = useState<string>(defaultAmount.toFixed(2))
  const [method,     setMethod]     = useState<{ type: string; last4?: string } | null>(null)
  const [errMsg,     setErrMsg]     = useState<string | null>(null)

  // ── Step 1: Verify ─────────────────────────────────────────────────────────
  async function handleVerify() {
    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrMsg('Enter a valid dollar amount before charging.')
      return
    }

    setStage('verifying')
    setErrMsg(null)

    try {
      const res  = await fetch('/api/admin/rebill/verify', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ member_id: memberId, payment_method_id: paymentMethodId }),
      })
      const data: VerifyResult & { error?: string } = await res.json()

      if (!res.ok) {
        setStage('failed')
        setErrMsg(data.error ?? 'Verification request failed')
        return
      }

      if (data.verified === true) {
        setMethod(data.method)
        setStage('confirmed')
      } else if ('error' in data && data.error === 'whop_unavailable') {
        setStage('unavailable')
      } else {
        setErrMsg((data as { reason?: string }).reason ?? 'Payment method could not be verified')
        setStage('discrepancy')
      }
    } catch {
      setStage('unavailable')
    }
  }

  // ── Step 2: Charge ─────────────────────────────────────────────────────────
  async function handleCharge() {
    setIsCharging(true)
    setErrMsg(null)

    try {
      const res  = await fetch('/api/admin/rebill', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send only order_id — the server re-reads canonical ids from Supabase
        body:    JSON.stringify({
          order_id: orderId,
          amount:   parseFloat(amount),
          currency: 'usd',
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setStage('failed')
        setErrMsg(data.error ?? 'Charge failed')
        return
      }

      setStage('success')
    } catch (err) {
      setStage('failed')
      setErrMsg(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsCharging(false)
    }
  }

  function reset() {
    setStage('idle')
    setErrMsg(null)
    setMethod(null)
    setAmount(defaultAmount.toFixed(2))
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (stage === 'success') {
    return (
      <div className="flex items-center gap-1.5 text-green-700 text-sm">
        <CheckCircle size={14} />
        <span>Charge submitted</span>
        <button onClick={reset} className="ml-2 text-xs text-gray-400 hover:text-gray-600 underline">
          reset
        </button>
      </div>
    )
  }

  if (stage === 'failed') {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-red-700 text-sm">
          <XCircle size={14} />
          <span>{errMsg ?? 'Failed'}</span>
        </div>
        <button onClick={reset} className="text-xs text-gray-500 hover:text-gray-700 underline">
          try again
        </button>
      </div>
    )
  }

  if (stage === 'discrepancy') {
    return (
      <div className="space-y-1 max-w-xs">
        <div className="flex items-start gap-1.5 text-red-700 text-sm">
          <ShieldAlert size={14} className="mt-0.5 shrink-0" />
          <span>{errMsg ?? 'Payment method no longer valid on Whop. Charge blocked.'}</span>
        </div>
        <button onClick={reset} className="text-xs text-gray-500 hover:text-gray-700 underline">
          dismiss
        </button>
      </div>
    )
  }

  if (stage === 'unavailable') {
    return (
      <div className="space-y-2 max-w-xs">
        <div className="flex items-start gap-1.5 text-yellow-700 text-sm">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span>
            Could not verify with Whop right now. Supabase data shown — proceed with caution.
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCharge}
            className="px-3 py-1.5 bg-yellow-600 text-white text-xs rounded font-medium hover:bg-yellow-700 transition"
          >
            Proceed anyway
          </button>
          <button onClick={reset} className="text-xs text-gray-500 hover:text-gray-700 underline">
            cancel
          </button>
        </div>
      </div>
    )
  }

  if (stage === 'confirmed') {
    return (
      <div className="space-y-2 max-w-xs border border-blue-200 bg-blue-50 rounded-lg p-3">
        <p className="text-sm font-medium text-blue-900">Confirm charge</p>
        <p className="text-xs text-blue-800">
          <span className="font-medium">{email}</span>
          {method && (
            <> &mdash; {method.type}{method.last4 ? ` ····${method.last4}` : ''}</>
          )}
        </p>
        <p className="text-sm font-bold text-blue-900">${parseFloat(amount).toFixed(2)} USD</p>
        <p className="text-xs text-blue-700">
          This will create a pending rebill record and charge the saved payment method. Final
          status updates via webhook.
        </p>
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleCharge}
            disabled={isCharging}
            className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition"
          >
            {isCharging && <Loader2 size={12} className="animate-spin" />}
            Confirm & charge
          </button>
          <button onClick={reset} className="text-xs text-gray-500 hover:text-gray-700 underline">
            cancel
          </button>
        </div>
      </div>
    )
  }

  // ── Idle + verifying ───────────────────────────────────────────────────────
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <span className="absolute inset-y-0 left-2.5 flex items-center text-gray-400 text-xs pointer-events-none">
          $
        </span>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={e => { setAmount(e.target.value); setErrMsg(null) }}
          className="w-24 pl-5 pr-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Charge amount in dollars"
        />
      </div>
      <button
        onClick={handleVerify}
        disabled={stage === 'verifying'}
        className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition"
      >
        {stage === 'verifying' && <Loader2 size={12} className="animate-spin" />}
        {stage === 'verifying' ? 'Verifying…' : 'Charge'}
      </button>
      {errMsg && <p className="text-xs text-red-600">{errMsg}</p>}
    </div>
  )
}
