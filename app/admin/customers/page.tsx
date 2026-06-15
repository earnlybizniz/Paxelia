/**
 * app/admin/customers/page.tsx
 * Server component — list all unique customers from orders table.
 */
import { requireAdmin } from '@/lib/admin-auth'
import { createSupabaseServer } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function AdminCustomersPage() {
  await requireAdmin()

  const supabase = createSupabaseServer()

  // Get distinct customers with their order count and total spent
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, email, first_name, last_name, total, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Customers</h1>
        <p className="text-red-600">Error loading customers: {error.message}</p>
      </div>
    )
  }

  // Group orders by email to get unique customers
  const customerMap = new Map<string, {
    email: string
    first_name: string
    last_name: string
    order_count: number
    total_spent: number
    last_order: string
  }>()

  orders?.forEach(order => {
    const existing = customerMap.get(order.email)
    if (existing) {
      existing.order_count += 1
      existing.total_spent += order.total || 0
      existing.last_order = order.created_at
    } else {
      customerMap.set(order.email, {
        email: order.email,
        first_name: order.first_name,
        last_name: order.last_name,
        order_count: 1,
        total_spent: order.total || 0,
        last_order: order.created_at,
      })
    }
  })

  const customers = Array.from(customerMap.values()).sort(
    (a, b) => new Date(b.last_order).getTime() - new Date(a.last_order).getTime()
  )

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customers</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-3 font-semibold">Name</th>
              <th className="text-left py-3 px-3 font-semibold">Email</th>
              <th className="text-left py-3 px-3 font-semibold">Orders</th>
              <th className="text-left py-3 px-3 font-semibold">Total Spent</th>
              <th className="text-left py-3 px-3 font-semibold">Last Order</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.email} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-3">
                    <div className="font-medium">{customer.first_name} {customer.last_name}</div>
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-600">{customer.email}</td>
                  <td className="py-3 px-3">
                    <Link
                      href={`/admin/orders?email=${encodeURIComponent(customer.email)}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {customer.order_count}
                    </Link>
                  </td>
                  <td className="py-3 px-3 font-semibold">${customer.total_spent.toFixed(2)}</td>
                  <td className="py-3 px-3 text-sm text-gray-600">
                    {new Date(customer.last_order).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-6 px-3 text-center text-gray-500">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Total unique customers: {customers.length}
      </div>
    </div>
  )
}
