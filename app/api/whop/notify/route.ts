/**
 * app/api/whop/notify/route.ts
 *
 * SEPARATE Whop webhook  →  Telegram notifications for the RETAIL store.
 *
 * Intentionally and completely isolated from the money path:
 *   - it is a DIFFERENT URL with its OWN Whop webhook subscription + secret
 *     (WHOP_NOTIFY_WEBHOOK_SECRET), so it shares nothing with /api/whop/webhook
 *   - it imports nothing from Supabase / Meta / Resend / the Whop SDK / product config
 *   - it only verifies the signature, builds a message, and posts to Telegram
 *   - it FAILS SILENTLY: any internal error is logged and answered 200, so it can
 *     never retry-storm or otherwise affect the store. The ONLY non-200 it returns
 *     is a 401 on a genuine signature mismatch (harmless on this standalone route,
 *     and useful for spotting a wrong secret).
 *
 * Setup: create a SECOND webhook in Whop (Developer → Create Webhook) pointing at
 *        https://omnirise.store/api/whop/notify  on API version v1, then select the
 *        events you want. Do NOT modify the existing webhook.
 */
import { NextRequest, NextResponse } from 'next/server'
import {
  verifyNotifyWebhook,
  WebhookVerificationError,
  notifyConfigured,
  notifySecretConfigured,
  notifyFromWebhook,
} from '@/lib/telegram-notify'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  // Nothing in here may throw out of the handler — notifications must never matter.
  try {
    const rawBody = await req.text()

    // Not configured yet → accept and ignore (silent no-op, no Whop retries).
    if (!notifySecretConfigured() || !notifyConfigured()) {
      return NextResponse.json({ received: true, skipped: 'not_configured' })
    }

    const headers: Record<string, string | null> = {
      'webhook-id':        req.headers.get('webhook-id'),
      'webhook-timestamp': req.headers.get('webhook-timestamp'),
      'webhook-signature': req.headers.get('webhook-signature') ?? req.headers.get('x-whop-signature'),
    }

    let payload: unknown
    try {
      payload = verifyNotifyWebhook(rawBody, headers)
    } catch (err) {
      if (err instanceof WebhookVerificationError) {
        console.error('[notify] signature verification failed:', err.message)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
      // Anything unexpected during verification: stay silent, accept the delivery.
      console.error('[notify] verification error (ignored):', err)
      return NextResponse.json({ received: true })
    }

    const evt = (payload ?? {}) as {
      type?: string; event?: string; action?: string; data?: unknown
    }
    const eventName = evt.type ?? evt.event ?? evt.action ?? ''
    const data = (evt.data && typeof evt.data === 'object' ? evt.data : {}) as Record<string, unknown>

    // notifyFromWebhook never throws; await so the send completes before the
    // serverless function is frozen after the response.
    await notifyFromWebhook(eventName, data)

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[notify] unexpected error (ignored):', err)
    return NextResponse.json({ received: true })
  }
}
