/**
 * app/store/checkout/complete/route.ts
 * Handles Whop's returnUrl redirect after payment.
 * Middleware rewrites /checkout/complete → /store/checkout/complete internally.
 * Redirects use req.nextUrl.origin so they always resolve through middleware
 * (browser URL stays /thank-you or /checkout — never exposes /store paths).
 */
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl
  const status = searchParams.get('status')
  const order  = searchParams.get('order') ?? ''

  if (status === 'error') {
    // /checkout resolves via middleware rewrite → /store/checkout
    return NextResponse.redirect(new URL('/checkout?error=payment', origin))
  }

  // Successful return — /thank-you resolves via middleware rewrite → /store/thank-you
  return NextResponse.redirect(new URL(`/thank-you?order=${encodeURIComponent(order)}`, origin))
}
