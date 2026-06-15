/**
 * lib/whop.ts
 * Whop SDK init + helper wrappers used by API routes.
 * Server-only — never import from client components.
 */
import { Whop } from '@whop/sdk'
import { Webhook, WebhookVerificationError } from 'standardwebhooks'

// Pass apiKey explicitly because @whop/sdk may not auto-read NEXT_PUBLIC_ vars
// in all environments.
const apiKey = process.env.WHOP_API_KEY ?? ''
const whop = new Whop({ apiKey })

export interface CreateSessionInput {
  planId: string
  metadata: {
    customer_id: string
    order_id: string
    email: string
    variant_id: string
    fbp?: string
    fbc?: string
    user_agent?: string
  }
  returnUrl: string
}

/**
 * Creates a Whop checkout configuration (session) server-side so we can
 * attach metadata before the embed mounts.
 * The returned session id is passed to the embed as `sessionId`.
 */
export async function createCheckoutSession(input: CreateSessionInput): Promise<string> {
  const session = await whop.checkoutConfigurations.create({
    plan_id:      input.planId,
    metadata:     input.metadata,
    redirect_url: input.returnUrl,
  })
  return session.id
}

/**
 * Verifies an inbound Whop webhook using the Standard Webhooks spec:
 *   signed message = {webhook-id}.{webhook-timestamp}.{rawBody}
 *   HMAC-SHA256 over the base64-encoded secret
 * Also validates the timestamp is within a 5-minute tolerance window.
 *
 * Pass the raw request body (string) and the full headers map.
 * Returns the parsed payload or throws WebhookVerificationError on failure.
 */
export function verifyWebhookSignature(
  rawBody: string,
  headers: Record<string, string | null>,
): unknown {
  const secret = process.env.WHOP_WEBHOOK_SECRET ?? ''
  if (!secret || secret.includes('placeholder')) {
    throw new WebhookVerificationError('WHOP_WEBHOOK_SECRET is not set')
  }

  // Whop provides the webhook secret as a RAW string, but the standardwebhooks
  // library base64-DECODES whatever it's given (and strips a `whsec_` prefix).
  // Per Whop's own docs (new Whop({ webhookKey: btoa(secret) })), the secret must
  // be base64-ENCODED before being handed to the verifier. If we pass the raw
  // secret, base64.decode() throws and the handler 500s. So:
  //   - if already `whsec_`-prefixed, pass through (lib strips + decodes it)
  //   - otherwise base64-encode the raw secret (Node equivalent of btoa)
  const encodedSecret = secret.startsWith('whsec_')
    ? secret
    : Buffer.from(secret, 'utf8').toString('base64')

  const wh = new Webhook(encodedSecret)

  // Build the Standard Webhooks header object — fall back gracefully if any are missing
  const whHeaders: Record<string, string> = {}
  const id        = headers['webhook-id']
  const timestamp = headers['webhook-timestamp']
  const signature = headers['webhook-signature']

  if (id)        whHeaders['webhook-id']        = id
  if (timestamp) whHeaders['webhook-timestamp'] = timestamp
  if (signature) whHeaders['webhook-signature'] = signature

  return wh.verify(rawBody, whHeaders)
}

export { WebhookVerificationError }