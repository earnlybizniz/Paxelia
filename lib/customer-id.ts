/**
 * lib/customer-id.ts
 * Manages the first-party `alder_cid` cookie used as our tracking dedup key.
 * The same customer_id flows through every Meta event and into Whop metadata,
 * so Pixel and CAPI purchases dedup to one event.
 */

const COOKIE_NAME = 'alder_cid'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 2 // 2 years

/** Client-side: read or mint a customer_id and store it in a first-party cookie. */
export function getOrCreateCustomerId(): string {
  if (typeof document === 'undefined') return ''

  const existing = getCookieValue(COOKIE_NAME)
  if (existing) return existing

  const id = crypto.randomUUID()
  document.cookie = `${COOKIE_NAME}=${id}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`
  return id
}

/** Client-side: read the customer_id if it exists. */
export function getCustomerId(): string {
  if (typeof document === 'undefined') return ''
  return getCookieValue(COOKIE_NAME) ?? ''
}

function getCookieValue(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

/** Server-side: parse customer_id from a raw Cookie header string. */
export function getCustomerIdFromCookieHeader(cookieHeader: string | null): string {
  if (!cookieHeader) return ''
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : ''
}
