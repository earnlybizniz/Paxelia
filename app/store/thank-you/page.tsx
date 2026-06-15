/**
 * app/store/thank-you/page.tsx
 * Server component — fetches the real order from Supabase using ?order=<id>.
 * Passes the real total to PurchasePixel (client) so Meta Purchase never fires
 * with value 0. Handles the webhook race condition: shows success as long as the
 * order row exists, regardless of status (webhook may not have arrived yet).
 */
import { createSupabaseServer } from '@/lib/supabase-server'
import { ThankYouView } from '@/components/checkout/ThankYouView'
import { PurchasePixel } from '@/components/checkout/PurchasePixel'
import { ThankYouRecover } from '@/components/checkout/ThankYouRecover'

// This page depends on the ?order= search param and must fetch the live order
// from Supabase on every navigation. Without these, Next.js can statically
// optimize / serve a prefetched RSC payload, so the server component never
// re-runs for the real ?order= value — which means the order is never fetched
// and PurchasePixel never fires. force-dynamic guarantees a fresh server render.
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const { order: orderId } = await searchParams

  let order = null
  if (orderId) {
    const supabase = createSupabaseServer()
    const { data } = await supabase
      .from('orders')
      .select('id, status, variant_id, total, currency, email, first_name, last_name, shipping_address, items')
      .eq('id', orderId)
      .maybeSingle()
    order = data ?? null
  }

  return (
    <>
      {/* No ?order= in the URL → recover the id the checkout stashed in
          localStorage just before navigating, then reload with ?order=<id>.
          Redundancy for buyers who reach /thank-you without the param (a
          back-nav, a stripped query string, or an early exit and later return).
          Renders nothing; only acts when a stashed id exists. */}
      {!orderId && <ThankYouRecover />}

      {/* Only fire Purchase if we have a real order total — never fire with
          value 0. event_id = order.id so it dedups with the checkout onComplete
          Pixel AND the webhook CAPI (all three share the order id). */}
      {order && (
        <PurchasePixel
          orderId={order.id}
          value={order.total}
          currency={order.currency ?? 'USD'}
          contentId={order.variant_id}
        />
      )}
      <ThankYouView order={order} orderId={orderId ?? ''} />
    </>
  )
}