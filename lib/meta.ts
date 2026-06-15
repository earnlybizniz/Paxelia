/**
 * lib/meta.ts
 * Meta Pixel (client) + Conversions API (server) helpers.
 * All events include event_id = customer_id for deduplication, AND
 * external_id = sha256(customer_id) as a persistent matching signal.
 *
 * Env vars:
 *   NEXT_PUBLIC_META_PIXEL_ID   – public, used by Pixel
 *   META_CAPI_TOKEN             – server-only, used by CAPI
 *   META_TEST_EVENT_CODE        – optional, for Events Manager testing
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
  }
}

// ─── Shared hashing (SHA-256, lowercase hex) ─────────────────────────────────
// Works in both browser (crypto.subtle) and Node (crypto.subtle on modern runtimes).
export async function sha256(message: string): Promise<string> {
  const data   = new TextEncoder().encode(message)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// ─── Client (Pixel) ──────────────────────────────────────────────────────────

export interface PixelEventParams {
  event_id: string
  value?: number
  currency?: string
  content_ids?: string[]
  content_name?: string
  content_type?: string
  num_items?: number
  /** Optional pre-hashed external id (sha256 of customer_id) for matching. */
  external_id?: string
  [key: string]: unknown
}

export function trackPixel(eventName: string, params: PixelEventParams): void {
  if (typeof window === 'undefined') return
  // Meta's base snippet creates a queueing stub (fbq.queue) before the full
  // library loads. Calling through window.fbq still enqueues the event, so
  // early ViewContent / InitiateCheckout events are never silently dropped.
  if (typeof window.fbq !== 'function') return
  const { event_id, external_id, ...rest } = params

  // Pass external_id through Pixel's user_data-style param so it becomes an
  // advanced-matching key. fbq accepts a 4th options arg with eventID for dedup.
  if (external_id) {
    rest.external_id = external_id
  }
  window.fbq('track', eventName, rest, { eventID: event_id })
}

/**
 * Client-side helper: fire a Pixel event with external_id derived from the
 * customer_id. Hashes in-browser so the raw id never leaves as plaintext.
 */
export async function trackPixelWithExternalId(
  eventName: string,
  customerId: string,
  params: Omit<PixelEventParams, 'event_id' | 'external_id'>,
): Promise<void> {
  const external_id = customerId ? await sha256(customerId) : undefined
  trackPixel(eventName, { ...params, event_id: customerId, external_id })
}

/**
 * Client-side Purchase helper. Unlike trackPixelWithExternalId (which uses the
 * customer_id as the event_id), Purchase is deduplicated per ORDER: we use the
 * order_id as the event_id so a customer's second purchase is never collapsed
 * into their first by Meta. external_id = sha256(customer_id) is still sent as a
 * persistent matching signal. The SAME order_id is used by the checkout
 * onComplete handler and by the webhook's server-side Purchase CAPI call, so all
 * browser + server Purchase events for one order dedup down to a single event.
 */
export async function trackPixelPurchase(
  orderId: string,
  customerId: string,
  params: Omit<PixelEventParams, 'event_id' | 'external_id'>,
): Promise<void> {
  const external_id = customerId ? await sha256(customerId) : undefined
  trackPixel('Purchase', { ...params, event_id: orderId, external_id })
}

// ─── First-touch fbc capture ─────────────────────────────────────────────────
/**
 * Meta only sets the _fbc cookie when a visitor arrives with an fbclid URL
 * param (from a Facebook/Instagram ad click). If the Pixel hasn't yet written
 * it, we construct and persist _fbc ourselves so ad-click attribution is not
 * lost. Format: fb.1.<timestamp_ms>.<fbclid>
 * Safe to call on every page load; only writes when an fbclid is present and
 * no _fbc cookie exists yet.
 */
export function captureFbclid(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const fbclid = params.get('fbclid')
  if (!fbclid) return

  const hasFbc = document.cookie.match(/(?:^|;\s*)_fbc=/)
  if (hasFbc) return

  const fbc = `fb.1.${Date.now()}.${fbclid}`
  const maxAge = 60 * 60 * 24 * 90 // 90 days (Meta's attribution window)
  document.cookie = `_fbc=${fbc}; max-age=${maxAge}; path=/; SameSite=Lax`
}

// ─── Client → server relay ───────────────────────────────────────────────────
/**
 * Fire a top-of-funnel event to our CAPI relay (/api/track) in parallel with
 * the browser Pixel. Best-effort and non-blocking — failures are swallowed so
 * tracking never affects UX. event_id/dedup is handled server-side via the
 * customer_id cookie.
 */
export function sendServerEvent(
  eventName: 'ViewContent' | 'AddToCart' | 'AddPaymentInfo',
  payload: {
    content_ids?: string[]
    content_name?: string
    content_type?: string
    value?: number
    currency?: string
    num_items?: number
  },
): void {
  if (typeof window === 'undefined') return
  try {
    const blob = JSON.stringify({ event_name: eventName, ...payload })
    // Prefer sendBeacon (survives navigation, e.g. Buy-Now redirect); fall back to fetch.
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([blob], { type: 'application/json' }))
    } else {
      void fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: blob,
        keepalive: true,
      }).catch(() => {})
    }
  } catch {
    /* never throw from tracking */
  }
}

// ─── Server (CAPI) ───────────────────────────────────────────────────────────

// Meta Graph API version for the Conversions API. SINGLE SOURCE OF TRUTH — bump
// here (or via the META_GRAPH_API_VERSION env var) when Meta ships a new version.
// v25.0 is current (released Feb 2026); v19/v20 are being deprecated through 2026.
const GRAPH_API_VERSION = process.env.META_GRAPH_API_VERSION || 'v25.0'
const CAPI_MAX_ATTEMPTS = 3
const CAPI_RETRY_BASE_MS = 400

export interface CapiEventParams {
  event_name: string
  event_id: string   // customer_id — dedup key
  event_time?: number
  event_source_url?: string
  user_email?: string
  user_agent?: string
  fbp?: string
  fbc?: string
  /** Raw customer_id; hashed to external_id server-side before sending. */
  external_id?: string
  value?: number
  currency?: string
  content_ids?: string[]
  content_name?: string
  content_type?: string
  num_items?: number
}

/**
 * Called from API routes only. Hashes email + external_id with SHA-256 before
 * sending. Returns true once Meta accepts the event. Retries transient failures
 * (network error, HTTP 429, HTTP 5xx) up to 3× with backoff, and logs Meta's
 * own response (events_received + fbtrace_id) so a dropped server event is
 * never silent — it always surfaces in the logs with Meta's trace id.
 */
export async function trackCapi(params: CapiEventParams): Promise<boolean> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const token   = process.env.META_CAPI_TOKEN
  if (!pixelId || !token) {
    console.warn('[meta] CAPI skipped — NEXT_PUBLIC_META_PIXEL_ID or META_CAPI_TOKEN is not set')
    return false
  }

  const eventTime = params.event_time ?? Math.floor(Date.now() / 1000)

  const userData: Record<string, string | string[]> = {}
  if (params.user_email) {
    userData.em = [await sha256(params.user_email.trim().toLowerCase())]
  }
  if (params.external_id) {
    userData.external_id = [await sha256(params.external_id)]
  }
  if (params.user_agent) userData.client_user_agent = params.user_agent
  if (params.fbp) userData.fbp = params.fbp
  if (params.fbc) userData.fbc = params.fbc

  const customData: Record<string, unknown> = {}
  if (params.value !== undefined)     customData.value        = params.value
  if (params.currency)                customData.currency     = params.currency
  if (params.content_ids)             customData.content_ids  = params.content_ids
  if (params.content_name)            customData.content_name = params.content_name
  if (params.content_type)            customData.content_type = params.content_type
  if (params.num_items !== undefined) customData.num_items    = params.num_items

  const body: Record<string, unknown> = {
    data: [
      {
        event_name:        params.event_name,
        event_time:        eventTime,
        event_id:          params.event_id,
        action_source:     'website',
        event_source_url:  params.event_source_url,
        user_data:         userData,
        custom_data:       customData,
      },
    ],
  }

  if (process.env.META_TEST_EVENT_CODE) {
    body.test_event_code = process.env.META_TEST_EVENT_CODE
  }

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${token}`
  const label = `${params.event_name} (event_id=${params.event_id})`

  for (let attempt = 1; attempt <= CAPI_MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })
      const json = (await res.json().catch(() => null)) as
        | { events_received?: number; fbtrace_id?: string; error?: { message?: string; code?: number; fbtrace_id?: string } }
        | null

      if (res.ok) {
        console.log(
          `[meta] CAPI ${label} accepted — events_received=${json?.events_received ?? '?'} fbtrace_id=${json?.fbtrace_id ?? '?'}`,
        )
        return true
      }

      const errMsg = json?.error
        ? `${json.error.message} (code ${json.error.code}, fbtrace_id ${json.error.fbtrace_id})`
        : `HTTP ${res.status}`

      // 4xx other than 429 = permanent (bad token/pixel/payload). Don't retry —
      // retrying can't fix it, and we want it loud in the logs immediately.
      if (res.status < 500 && res.status !== 429) {
        console.error(`[meta] CAPI ${label} PERMANENT failure: ${errMsg}`)
        return false
      }
      console.warn(`[meta] CAPI ${label} attempt ${attempt}/${CAPI_MAX_ATTEMPTS} transient failure: ${errMsg}`)
    } catch (err) {
      console.warn(`[meta] CAPI ${label} attempt ${attempt}/${CAPI_MAX_ATTEMPTS} network error:`, err)
    }
    if (attempt < CAPI_MAX_ATTEMPTS) {
      await new Promise(r => setTimeout(r, attempt * CAPI_RETRY_BASE_MS))
    }
  }

  console.error(`[meta] CAPI ${label} exhausted ${CAPI_MAX_ATTEMPTS} attempts — event NOT delivered`)
  return false
}