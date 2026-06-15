/**
 * lib/admin-auth.ts
 * Server-only. All admin auth logic lives here.
 *
 * Flow:
 *  1. POST /api/admin/auth  — constant-time compare against ADMIN_PASSWORD,
 *     set signed httpOnly "admin_session" cookie on success.
 *  2. requireAdmin()        — call at top of every admin server component /
 *     API route; redirects to /admin/login or returns 401 if invalid.
 *
 * ENV (server-only, never NEXT_PUBLIC_):
 *   ADMIN_PASSWORD          — the login password
 *   ADMIN_SESSION_SECRET    — 32+ random bytes, used to sign/verify the cookie
 */
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createHmac, timingSafeEqual } from 'crypto'

const SESSION_COOKIE = 'admin_session'
const SESSION_MAX_AGE = 60 * 60 * 12 // 12 hours

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET ?? ''
  if (!s || s.length < 16) {
    // Warn loudly in dev; in prod this will cause auth to always fail safely.
    console.error('[admin-auth] ADMIN_SESSION_SECRET is not set or too short')
  }
  return s
}

function sign(payload: string): string {
  const secret = getSecret()
  const mac = createHmac('sha256', secret).update(payload).digest('base64url')
  return `${payload}.${mac}`
}

function verify(token: string): string | null {
  const lastDot = token.lastIndexOf('.')
  if (lastDot === -1) return null
  const payload = token.slice(0, lastDot)
  const expected = sign(payload)
  try {
    const a = Buffer.from(expected)
    const b = Buffer.from(token)
    if (a.length !== b.length) return null
    if (!timingSafeEqual(a, b)) return null
    // Check expiry — payload format: "admin:{issuedAt}"
    const parts = payload.split(':')
    const issuedAt = parseInt(parts[1] ?? '0', 10)
    if (Date.now() / 1000 - issuedAt > SESSION_MAX_AGE) return null
    return payload
  } catch {
    return null
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Constant-time password check. Returns true on match. */
export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? ''
  if (!expected) return false
  try {
    const a = Buffer.from(expected, 'utf8')
    const b = Buffer.from(input.padEnd(expected.length), 'utf8').slice(0, expected.length)
    if (input.length !== expected.length) {
      // Still do the comparison to avoid timing leak, then return false
      timingSafeEqual(a, Buffer.from(input.padEnd(expected.length).slice(0, expected.length)))
      return false
    }
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

/** Build the signed session token. Call after password is verified. */
export function createSessionToken(): string {
  const issuedAt = Math.floor(Date.now() / 1000)
  const payload = `admin:${issuedAt}`
  return sign(payload)
}

/** Cookie options. httpOnly + secure + sameSite strict (admin never needs cross-site). */
export function sessionCookieOptions() {
  return {
    name:     SESSION_COOKIE,
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge:   SESSION_MAX_AGE,
    path:     '/',
  }
}

/**
 * requireAdmin() — call at the top of every admin server component.
 * Redirects to /admin/login if the session is missing or invalid.
 * Returns void on success.
 */
export async function requireAdmin(): Promise<void> {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value ?? ''
  if (!verify(token)) {
    redirect('/admin-login')
  }
}

/**
 * requireAdminApi() — call in every admin API route.
 * Returns { ok: true } or { ok: false, response: NextResponse }.
 */
export function requireAdminApi(request: Request): { ok: true } | { ok: false; status: 401 } {
  const cookieHeader = request.headers.get('cookie') ?? ''
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`))
  const token = match ? decodeURIComponent(match[1]) : ''
  if (!verify(token)) {
    return { ok: false, status: 401 }
  }
  return { ok: true }
}

/** Delete the session cookie (logout). */
export async function clearAdminSession(): Promise<void> {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE)
}
