/**
 * components/admin/FulfillmentBlock.tsx
 * Collects tracking number + optional URL, POSTs to /api/admin/fulfill.
 */
'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface FulfillmentBlockProps {
  order: {
    id: string
    status: string
    tracking_number?: string | null
    tracking_url?: string | null
    first_name: string
    email: string
  }
}

export function FulfillmentBlock({ order }: FulfillmentBlockProps) {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingUrl, setTrackingUrl]       = useState('')
  const [loading, setLoading]               = useState(false)
  const [success, setSuccess]               = useState(false)
  const [error, setError]                   = useState<string | null>(null)

  const handleFulfill = async () => {
    if (!trackingNumber.trim()) {
      setError('Tracking number is required')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch('/api/admin/fulfill', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          orderId:        order.id,
          trackingNumber: trackingNumber.trim(),
          trackingUrl:    trackingUrl.trim() || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to fulfill order')
        return
      }

      setSuccess(true)
      setTimeout(() => window.location.reload(), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const isFulfilled = order.status === 'fulfilled'

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white">
      <h3 className="text-lg font-semibold mb-4">Fulfillment</h3>

      <div className="space-y-4">

        {/* Status badge */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Status</p>
            <p className="text-sm text-gray-600 capitalize">
              {isFulfilled ? 'Order fulfilled' : 'Awaiting fulfillment'}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isFulfilled ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isFulfilled ? 'Fulfilled' : 'Pending'}
          </span>
        </div>

        {/* Existing tracking info (already fulfilled) */}
        {isFulfilled && order.tracking_number && (
          <div className="space-y-1 text-sm">
            <p className="text-gray-600">
              <span className="font-medium">Tracking: </span>
              {order.tracking_url ? (
                <a
                  href={order.tracking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-mono"
                >
                  {order.tracking_number}
                </a>
              ) : (
                <span className="font-mono">{order.tracking_number}</span>
              )}
            </p>
          </div>
        )}

        {/* Fulfill form — only shown when not yet fulfilled */}
        {!isFulfilled && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tracking Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={e => setTrackingNumber(e.target.value)}
                placeholder="e.g. 1Z999AA10123456784"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tracking URL <span className="text-gray-400 font-normal">(optional — defaults to ParcelsApp)</span>
              </label>
              <input
                type="url"
                value={trackingUrl}
                onChange={e => setTrackingUrl(e.target.value)}
                placeholder="https://parcelsapp.com/en/tracking/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleFulfill}
              disabled={loading || !trackingNumber.trim()}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Fulfilling...' : 'Mark as Fulfilled & Send Tracking Email'}
            </button>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm">{error}</div>
        )}

        {success && (
          <div className="p-3 bg-green-100 text-green-800 rounded-lg text-sm">
            Order fulfilled. Tracking email sent to {order.email}.
          </div>
        )}
      </div>
    </div>
  )
}
