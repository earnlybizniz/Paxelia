/**
 * app/api/admin/fulfill/route.ts
 * POST /api/admin/fulfill
 * Marks order as fulfilled, persists tracking info, sends on-brand tracking email.
 * Requires admin auth via cookie.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin-auth'
import { createSupabaseServer } from '@/lib/supabase-server'
import { Resend } from 'resend'
import { HOME } from '@/lib/home-content'
import { renderShippingEmail, type EmailOrder } from '@/lib/email-templates'

export async function POST(req: NextRequest) {
  try {
    const auth = requireAdminApi(req)
    if (!auth.ok) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, trackingNumber, trackingUrl: rawTrackingUrl } = await req.json()

    if (!orderId || !trackingNumber) {
      return NextResponse.json(
        { error: 'orderId and trackingNumber are required' },
        { status: 400 }
      )
    }

    // Default to parcelsapp if no custom URL provided
    const trackingUrl = rawTrackingUrl?.trim() ||
      `https://parcelsapp.com/en/tracking/${encodeURIComponent(trackingNumber)}`

    const supabase = createSupabaseServer()

    // Fetch order
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('id, status, email, first_name, last_name, variant_id, items, subtotal, shipping, total, currency, shipping_address')
      .eq('id', orderId)
      .single()

    if (fetchError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.status === 'fulfilled') {
      return NextResponse.json({ error: 'Order already fulfilled' }, { status: 400 })
    }

    // Only paid orders can be fulfilled — never ship an unpaid (draft) or refunded order.
    if (order.status !== 'paid') {
      return NextResponse.json(
        { error: `Order must be paid before fulfillment (current status: ${order.status})` },
        { status: 400 },
      )
    }

    // Persist tracking + fulfilled status
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status:          'fulfilled',
        tracking_number: trackingNumber,
        tracking_url:    trackingUrl,
        fulfilled_at:    new Date().toISOString(),
        updated_at:      new Date().toISOString(),
      })
      .eq('id', orderId)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    // Build the Shopify-style shipping email from the shared template module.
    const fromEmail   = process.env.SUPPORT_FROM_EMAIL || `noreply@example.com`
    const brandName   = HOME.brand.name
    const resend      = new Resend(process.env.RESEND_API_KEY)

    const emailOrder: EmailOrder = {
      id:               order.id,
      email:            order.email,
      first_name:       order.first_name,
      last_name:        order.last_name,
      variant_id:       order.variant_id,
      finish_id:        (Array.isArray(order.items) && (order.items[0] as { finish?: string } | undefined)?.finish) || null,
      subtotal:         order.subtotal,
      shipping:         order.shipping,
      total:            order.total,
      currency:         order.currency,
      shipping_address: order.shipping_address as EmailOrder['shipping_address'],
    }
    const { subject, html } = renderShippingEmail(emailOrder, { trackingNumber, trackingUrl })

    try {
      await resend.emails.send({
        from:    `${brandName} <${fromEmail}>`,
        to:      order.email,
        subject,
        html,
      })
    } catch (emailError) {
      console.error('[fulfill] Resend error:', emailError)
      // Email failure does not roll back the DB update — order is still fulfilled
    }

    return NextResponse.json({ success: true, trackingNumber, trackingUrl })
  } catch (error) {
    console.error('[fulfill] Unexpected error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    )
  }
}
