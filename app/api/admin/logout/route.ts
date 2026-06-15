/**
 * app/api/admin/logout/route.ts
 * POST: Clears the admin_session cookie.
 */
import { NextRequest, NextResponse } from 'next/server'
import { sessionCookieOptions } from '@/lib/admin-auth'

export async function POST(_req: NextRequest) {
  const opts = sessionCookieOptions()
  const res  = NextResponse.json({ ok: true })
  res.cookies.set(opts.name, '', { ...opts, maxAge: 0 })
  return res
}
