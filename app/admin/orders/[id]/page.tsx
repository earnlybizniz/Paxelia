/**
 * app/admin/orders/[id]/page.tsx
 * Server component — view single order with full details and fulfillment controls.
 */
import { requireAdmin } from '@/lib/admin-auth'
import { createSupabaseServer } from '@/lib/supabase-server'
import { FulfillmentBlock } from '@/components/admin/FulfillmentBlock'
import Link from 'next/link'
import { formatDistanceToNow, format } from 'date-fns'
import { ChevronLeft } from 'lucide-react'
import { ALDER_PRODUCT } from '@/lib/pdp-product'

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()

  const { id } = await params
  const supabase = createSupabaseServer()

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !order) {
    return (
      <div className="p-6">
        <Link href="/admin/orders" className="flex items-center gap-2 text-blue-600 hover:underline mb-4">
          <ChevronLeft size={20} />
          Back to Orders
        </Link>
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-gray-600">The order {id} could not be found.</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl">
      <Link href="/admin/orders" className="flex items-center gap-2 text-blue-600 hover:underline mb-6">
        <ChevronLeft size={20} />
        Back to Orders
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Order {order.id.slice(0, 12)}...</h1>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              order.status === 'paid' ? 'bg-green-100 text-green-800' :
              order.status === 'fulfilled' ? 'bg-blue-100 text-blue-800' :
              order.status === 'failed' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {order.status}
            </span>
            <span className="text-gray-600">{formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}</span>
          </div>
        </div>
      </div>

      {/* Order details grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Customer */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Customer</h3>
          <p className="font-medium mb-1">{order.first_name} {order.last_name}</p>
          <p className="text-sm text-gray-600 mb-3">{order.email}</p>
        </div>

        {/* Shipping */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Shipping</h3>
          <p className="text-sm leading-relaxed">
            {order.shipping_address?.line1}<br />
            {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postalCode}<br />
            {order.shipping_address?.country}
          </p>
        </div>

        {/* Product */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Product</h3>
          <p className="font-medium mb-1">{ALDER_PRODUCT.name}</p>
          <p className="text-sm text-gray-600 mb-1">Size: {order.variant_id}</p>
          {order.finish && <p className="text-sm text-gray-600">Finish: {order.finish}</p>}
        </div>

        {/* Payment */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Payment</h3>
          <p className="font-medium mb-1">${order.total} {order.currency || 'USD'}</p>
          {order.whop_payment_id && <p className="text-xs text-gray-600 font-mono mt-2">{order.whop_payment_id}</p>}
        </div>
      </div>

      {/* Fulfillment block */}
      <FulfillmentBlock order={order} />
    </div>
  )
}