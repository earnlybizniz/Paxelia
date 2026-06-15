/**
 * app/admin/finance/page.tsx
 * Server component — displays revenue, customer lifetime value, and members with rebilling IDs.
 * The list is Supabase-driven (fast, always available).
 * Per-row charge actions talk to Whop live via RebillButton (client component).
 */
import { requireAdmin } from '@/lib/admin-auth'
import { createSupabaseServer } from '@/lib/supabase-server'
import { RebillButton } from '@/components/admin/RebillButton'

export default async function AdminFinancePage() {
  await requireAdmin()

  const supabase = createSupabaseServer()

  // Fetch all paid orders — include id + total for rebill action
  const { data: paidOrders } = await supabase
    .from('orders')
    .select('id, total, currency, status, whop_member_id, whop_payment_method_id, email, created_at')
    .eq('status', 'paid')

  // Summary stats
  const totalRevenue  = paidOrders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0
  const totalOrders   = paidOrders?.length || 0
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Unique members with saved payment methods — keep the most recent order per member
  // so the RebillButton has the correct order_id to pass to /api/admin/rebill
  const membersWithRebilling = paidOrders?.filter(
    o => o.whop_member_id && o.whop_payment_method_id
  ) || []

  const uniqueMembers = new Map<string, typeof membersWithRebilling[0]>()
  membersWithRebilling.forEach(order => {
    if (order.whop_member_id && !uniqueMembers.has(order.whop_member_id)) {
      uniqueMembers.set(order.whop_member_id, order)
    }
  })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Finance</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-2">{totalOrders} paid orders</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Avg Order Value</h3>
          <p className="text-3xl font-bold">${avgOrderValue.toFixed(2)}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Unique Customers</h3>
          <p className="text-3xl font-bold">
            {paidOrders ? new Set(paidOrders.map(o => o.email)).size : 0}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Rebilling Ready</h3>
          <p className="text-3xl font-bold text-blue-600">{uniqueMembers.size}</p>
          <p className="text-xs text-gray-500 mt-2">Members with saved payment</p>
        </div>
      </div>

      {/* Members with rebilling capability */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-bold mb-1">Members Ready for Rebilling</h2>
        <p className="text-sm text-gray-600 mb-4">
          List is sourced from Supabase. Clicking <strong>Charge</strong> verifies the payment
          method live with Whop before charging. If Whop is unreachable you will see a warning
          and can choose to proceed with Supabase data or cancel.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-3 font-semibold text-sm">Email</th>
                <th className="text-left py-3 px-3 font-semibold text-sm">Member ID</th>
                <th className="text-left py-3 px-3 font-semibold text-sm">Payment Method ID</th>
                <th className="text-left py-3 px-3 font-semibold text-sm">Last Order</th>
                <th className="text-left py-3 px-3 font-semibold text-sm">Charge</th>
              </tr>
            </thead>
            <tbody>
              {uniqueMembers.size > 0 ? (
                Array.from(uniqueMembers.values()).map((order, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 align-top">
                    <td className="py-3 px-3 text-sm">{order.email}</td>
                    <td className="py-3 px-3 font-mono text-xs text-gray-600">
                      {order.whop_member_id?.slice(0, 16)}…
                    </td>
                    <td className="py-3 px-3 font-mono text-xs text-gray-600">
                      {order.whop_payment_method_id?.slice(0, 16)}…
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3">
                      <RebillButton
                        orderId={order.id}
                        memberId={order.whop_member_id!}
                        paymentMethodId={order.whop_payment_method_id!}
                        email={order.email ?? ''}
                        defaultAmount={order.total ?? 0}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 px-3 text-center text-gray-500">
                    No members with saved payment methods yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
