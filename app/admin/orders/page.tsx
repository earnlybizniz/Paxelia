/**
 * app/admin/orders/page.tsx
 * Server component — lists all orders with sorting + filters.
 * Calls requireAdmin before rendering, redirects if not authenticated.
 */
import { requireAdmin } from '@/lib/admin-auth'
import { createSupabaseServer } from '@/lib/supabase-server'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export default async function AdminOrdersPage() {
  await requireAdmin()

  const supabase = createSupabaseServer()

  // Fetch all orders, newest first
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, status, total, currency, email, first_name, last_name, variant_id, created_at, whop_payment_id')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        <p className="text-red-600">Error loading orders: {error.message}</p>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    paid: 'bg-green-100 text-green-800',
    fulfilled: 'bg-blue-100 text-blue-800',
    failed: 'bg-red-100 text-red-800',
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-3 font-semibold">Order ID</th>
              <th className="text-left py-3 px-3 font-semibold">Customer</th>
              <th className="text-left py-3 px-3 font-semibold">Size</th>
              <th className="text-left py-3 px-3 font-semibold">Total</th>
              <th className="text-left py-3 px-3 font-semibold">Status</th>
              <th className="text-left py-3 px-3 font-semibold">Created</th>
              <th className="text-left py-3 px-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? (
              orders.map((order: any) => (
                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-3 font-mono text-sm">{order.id.slice(0, 8)}...</td>
                  <td className="py-3 px-3">
                    <div>
                      <div className="font-medium">{order.first_name} {order.last_name}</div>
                      <div className="text-sm text-gray-600">{order.email}</div>
                    </div>
                  </td>
                  <td className="py-3 px-3 capitalize">{order.variant_id}</td>
                  <td className="py-3 px-3 font-semibold">
                    {order.currency || 'USD'} ${order.total || 0}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-600">
                    {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                  </td>
                  <td className="py-3 px-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-6 px-3 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Total orders: {orders?.length || 0}
      </div>
    </div>
  )
}
