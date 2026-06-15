/**
 * app/admin/page.tsx
 * Dashboard: stats + awaiting-fulfillment queue.
 * Server component — data fetched directly from Supabase.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { requireAdmin } from '@/lib/admin-auth'
import { createSupabaseServer } from '@/lib/supabase-server'
import { whopEmailPoolRemaining } from '@/lib/whop-email'
import { CopyButton } from '@/components/admin/CopyButton'

export const metadata: Metadata = { title: 'Dashboard' }

async function getDashboardData() {
  const supabase = createSupabaseServer()

  // All paid/fulfilled/refunded orders
  const { data: rawOrders } = await supabase
    .from('orders')
    .select('id, status, total, currency, email, first_name, last_name, variant_id, created_at, tracking_number')
    .in('status', ['paid', 'fulfilled', 'refunded'])
    .order('created_at', { ascending: false })

  // Supabase returns null on error — default to empty array so downstream is always non-null
  const orders = rawOrders ?? []

  const totalRevenue   = orders.filter(o => o.status !== 'refunded').reduce((s, o) => s + (o.total ?? 0), 0)
  const totalOrders    = orders.length
  const awaitingCount  = orders.filter(o => o.status === 'paid').length
  const fulfilledCount = orders.filter(o => o.status === 'fulfilled').length

  const awaiting = orders.filter(o => o.status === 'paid')
  const recent   = orders.slice(0, 8)

  // Whop email pool — remaining unused addresses (null if the RPC errors)
  const emailPoolRemaining = await whopEmailPoolRemaining(supabase)

  return { totalRevenue, totalOrders, awaitingCount, fulfilledCount, awaiting, recent, emailPoolRemaining }
}

export default async function AdminDashboardPage() {
  await requireAdmin()
  const { totalRevenue, totalOrders, awaitingCount, fulfilledCount, awaiting, recent, emailPoolRemaining } = await getDashboardData()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Operations overview</p>
      </div>

      {/* Whop email pool status — turns red when low so a pending revenue-stop is impossible to miss */}
      <WhopPoolBanner remaining={emailPoolRemaining} />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue"     value={`$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
        <StatCard label="Total Orders"      value={String(totalOrders)} />
        <StatCard label="Awaiting Fulfillment" value={String(awaitingCount)} accent={awaitingCount > 0} />
        <StatCard label="Fulfilled"         value={String(fulfilledCount)} />
      </div>

      {/* Awaiting fulfillment queue */}
      {awaiting.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-base font-semibold text-gray-900">Awaiting Fulfillment</h2>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white text-[0.65rem] font-bold">
              {awaiting.length}
            </span>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Order</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Variant</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Total</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {awaiting.map((o, i) => (
                  <tr key={o.id} className={`${i < awaiting.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-500">{o.id.slice(0, 8)}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {o.first_name} {o.last_name}
                      <div className="text-xs text-gray-400">{o.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-medium uppercase">{o.variant_id}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">${(o.total ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                      >
                        Fulfill →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Recent orders */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            View all
          </Link>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Order ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Total</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o, i) => (
                <tr key={o.id} className={`${i < recent.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-mono text-xs text-blue-600 hover:underline">
                      {o.id.slice(0, 8)}
                    </Link>
                    <CopyButton text={o.id} className="ml-1.5" />
                  </td>
                  <td className="px-4 py-3 text-gray-900">{o.first_name} {o.last_name}</td>
                  <td className="px-4 py-3 font-semibold">${(o.total ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

/**
 * Whop email-pool health. Checkout HARD-BLOCKS when the pool hits 0, so this
 * surfaces the remaining count and escalates color as it runs low.
 *   null  → RPC unavailable (pool table/function not set up yet) — neutral note
 *   0     → red alarm: checkout is currently blocked
 *   1–10  → red warning: refill now
 *   11–25 → amber: getting low
 *   >25   → green: healthy
 */
function WhopPoolBanner({ remaining }: { remaining: number | null }) {
  if (remaining === null) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
        Whop email pool: not configured yet.
      </div>
    )
  }

  const isEmpty = remaining === 0
  const isCrit  = remaining > 0 && remaining <= 10
  const isLow   = remaining > 10 && remaining <= 25

  const tone = isEmpty || isCrit
    ? 'border-red-300 bg-red-50 text-red-800'
    : isLow
    ? 'border-amber-300 bg-amber-50 text-amber-800'
    : 'border-green-200 bg-green-50 text-green-800'

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm flex items-center justify-between ${tone}`}>
      <span className="font-medium">
        Whop email pool: <span className="font-bold">{remaining}</span> remaining
      </span>
      <span className="text-xs">
        {isEmpty
          ? '⚠ Checkout is BLOCKED — refill the whop_email_pool now.'
          : isCrit
          ? '⚠ Critically low — refill the whop_email_pool soon.'
          : isLow
          ? 'Running low — consider refilling soon.'
          : 'Healthy'}
      </span>
    </div>
  )
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${accent ? 'text-amber-600' : 'text-gray-900'}`}>{value}</p>
    </div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft:     'bg-gray-100 text-gray-600',
    paid:      'bg-amber-100 text-amber-700',
    fulfilled: 'bg-green-100 text-green-700',
    refunded:  'bg-red-100 text-red-600',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold capitalize ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}