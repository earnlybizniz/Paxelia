/**
 * app/api/admin/auth/route.ts
 * POST: Validate ADMIN_PASSWORD, set signed httpOnly session cookie.
 * Rate-limited to 10 attempts per IP per 15 minutes (in-memory).
 */
import { NextRequest, NextResponse } from 'next/server'
import { checkPassword, createSessionToken, sessionCookieOptions } from '@/lib/admin-auth'

// ── In-memory rate limiter ────────────────────────────────────────────────────
const attempts = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS  = 15 * 60 * 1000 // 15 min
const MAX_TRIES  = 10

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = attempts.get(ip)
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  entry.count += 1
  if (entry.count > MAX_TRIES) return true
  return false
}

// ── Handler ───────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many attempts — try again later' }, { status: 429 })
  }

  let body: { password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { password = '' } = body

  if (!checkPassword(password)) {
    // Consistent delay to slow brute force even if rate limiter is bypassed
    await new Promise(r => setTimeout(r, 300))
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = createSessionToken()
  const opts  = sessionCookieOptions()

  const res = NextResponse.json({ ok: true })
  res.cookies.set(opts.name, token, {
    httpOnly: opts.httpOnly,
    secure:   opts.secure,
    sameSite: opts.sameSite,
    maxAge:   opts.maxAge,
    path:     opts.path,
  })
  return res
}
