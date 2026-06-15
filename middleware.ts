import { NextResponse, type NextRequest } from 'next/server'

/**
 * MULTI-TENANT MIDDLEWARE
 * 
 * Default tenant: Digital (academy) - all visitors see this by default
 * Secret tenant: Retail (store) - only accessible via ?s=r parameter
 * 
 * Once a user accesses retail via ?s=r, they are PERMANENTLY locked to retail
 * and can never see digital content again (cookie lasts 10 years).
 * 
 * Digital users never see any hint that retail exists.
 */

// Paths that bypass tenant routing entirely
const PASSTHROUGH_PATHS = [
  '/api/',
  '/_next/',
  '/favicon',
  '/admin',
  '/.well-known/',
  '/images/',
  '/videos/',
  '/fonts/',
]

// Secret key to unlock retail tenant (never expose this publicly)
const RETAIL_SECRET_KEY = 'r'

function shouldBypass(pathname: string): boolean {
  return PASSTHROUGH_PATHS.some(path => pathname.startsWith(path))
}

function isRetailUnlocked(request: NextRequest): boolean {
  // Check if user has the permanent retail cookie
  const tenantCookie = request.cookies.get('tenant')?.value
  if (tenantCookie === 'retail') {
    return true
  }
  
  // Check if user is unlocking retail with secret key
  const secretParam = request.nextUrl.searchParams.get('s')
  if (secretParam === RETAIL_SECRET_KEY) {
    return true
  }
  
  return false
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Bypass static assets and API routes
  if (shouldBypass(pathname)) {
    return NextResponse.next()
  }
  
  // Determine tenant first
  const isRetail = isRetailUnlocked(request)
  const tenant = isRetail ? 'retail' : 'academy'
  
  // Build rewrite path — this is allowed internally
  const tenantPath = isRetail ? '/store' : '/edu'
  const rewritePath = pathname === '/' ? tenantPath : `${tenantPath}${pathname}`
  
  // Create rewritten response.
  // IMPORTANT: preserve the original query string on the rewrite. Building the
  // URL from rewritePath alone drops ?foo=bar, so e.g. /thank-you?order=abc
  // would rewrite to /store/thank-you with NO order param — breaking any page
  // that reads searchParams (the thank-you order lookup, etc.).
  const rewriteUrl = new URL(rewritePath, request.url)
  rewriteUrl.search = request.nextUrl.search
  const response = NextResponse.rewrite(rewriteUrl)
  
  // Set permanent cookie if:
  // 1. User is unlocking retail for the first time (via ?s=r)
  // 2. User has no cookie yet (lock to digital)
  const existingCookie = request.cookies.get('tenant')?.value
  const isUnlockingRetail = request.nextUrl.searchParams.get('s') === RETAIL_SECRET_KEY
  
  if (isUnlockingRetail || !existingCookie) {
    response.cookies.set('tenant', tenant, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365 * 10, // 10 years - permanent lock
      path: '/',
    })
  }
  
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
