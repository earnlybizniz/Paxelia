/**
 * app/api/track/route.ts
 * Server-side CAPI relay for top-of-funnel events (ViewContent, AddToCart).
 *
 * The browser fires the Pixel event AND posts here in parallel. This route
 * reads _fbp/_fbc/user_agent from the request (cookies are sent automatically
 * on same-origin fetch) and forwards a matching CAPI event. Dedup is handled by
 * Meta via event_id = customer_id, identical on both channels.
 *
 * Non-sensitive, best-effort: always returns 200 so tracking never blocks UX.
 */
import { NextRequest, NextResponse } from 'next/server'
import { trackCapi } from '@/lib/meta'
import { getCustomerIdFromCookieHeader } from '@/lib/customer-id'

const ALLOWED_EVENTS = new Set(['ViewContent', 'AddToCart', 'AddPaymentInfo'])

export async function POST(req: NextRequest) {
  try {
    const bodyJson = await req.json().catch(() => null)
    if (!bodyJson || typeof bodyJson !== 'object') {
      return NextResponse.json({ ok: false }, { status: 200 })
    }

    const {
      event_name,
      content_ids,
      content_name,
      content_type,
      value,
      currency,
      num_items,
    } = bodyJson as Record<string, unknown>

    // Only relay known top-of-funnel events; ignore anything else.
    if (typeof event_name !== 'string' || !ALLOWED_EVENTS.has(event_name)) {
      return NextResponse.json({ ok: false }, { status: 200 })
    }

    const cookieHeader = req.headers.get('cookie')
    const customerId   = getCustomerIdFromCookieHeader(cookieHeader)
    // If there's no customer_id cookie yet, skip — Pixel still covers this event.
    if (!customerId) {
      return NextResponse.json({ ok: true, skipped: 'no_cid' }, { status: 200 })
    }

    const userAgent = req.headers.get('user-agent') ?? undefined
    const fbp       = cookieHeader?.match(/_fbp=([^;]*)/)?.[1]
    const fbc       = cookieHeader?.match(/_fbc=([^;]*)/)?.[1]
    const siteUrl   = process.env.NEXT_PUBLIC_SITE_URL ?? ''

    await trackCapi({
      event_name,
      event_id:         customerId,
      external_id:      customerId,
      event_source_url: siteUrl || undefined,
      user_agent:       userAgent,
      fbp,
      fbc,
      value:            typeof value === 'number' ? value : undefined,
      currency:         typeof currency === 'string' ? currency : undefined,
      content_ids:      Array.isArray(content_ids) ? (content_ids as string[]) : undefined,
      content_name:     typeof content_name === 'string' ? content_name : undefined,
      content_type:     typeof content_type === 'string' ? content_type : undefined,
      num_items:        typeof num_items === 'number' ? num_items : undefined,
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch {
    // Never throw — tracking must not affect the user.
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}