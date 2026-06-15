// app/edu/checkout/complete/route.ts
/**
 * Handles Whop's returnUrl redirect after payment for the academy tenant.
 * Whop returns to /checkout/complete; the persistent `tenant` cookie makes
 * middleware rewrite that to /edu/checkout/complete for academy buyers.
 * Redirects use req.nextUrl.origin so they resolve back through middleware
 * (the browser URL stays /thank-you or /checkout — never /edu paths).
 */
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl
  const status = searchParams.get('status')
  const order = searchParams.get('order') ?? ''

  if (status === 'error') {
    return NextResponse.redirect(new URL('/checkout?error=payment', origin))
  }

  return NextResponse.redirect(new URL(`/thank-you?order=${encodeURIComponent(order)}`, origin))
}
