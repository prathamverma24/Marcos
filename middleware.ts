import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const authSecret = process.env.NEXTAUTH_SECRET || 'local-placeholder-secret-login-disabled'
const isDev = process.env.NODE_ENV !== 'production'

function createNonce() {
  return btoa(crypto.randomUUID())
}

function createContentSecurityPolicy(nonce: string) {
  const csp = [
    "default-src 'none'",
    "base-uri 'none'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self' https://api.web3forms.com",
    `script-src 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-eval'" : ''}`,
    "script-src-attr 'none'",
    `style-src 'self' 'nonce-${nonce}'`,
    "style-src-attr 'none'",
    "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com",
    "font-src 'self'",
    "connect-src 'self'",
    "media-src 'self' blob:",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "frame-src https://www.google.com https://maps.google.com https://api.web3forms.com",
    'upgrade-insecure-requests',
  ]

  return csp.join('; ')
}

function applySecurityHeaders(response: NextResponse, contentSecurityPolicy: string) {
  response.headers.set('Content-Security-Policy', contentSecurityPolicy)
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'accelerometer=(), autoplay=(), camera=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), usb=(), interest-cohort=(), browsing-topics=()',
  )

  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const nonce = createNonce()
  const contentSecurityPolicy = createContentSecurityPolicy(nonce)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicy)
  const nextOptions = {
    request: {
      headers: requestHeaders,
    },
  }

  if (pathname.startsWith('/admin/login') || pathname.startsWith('/api/auth')) {
    return applySecurityHeaders(NextResponse.next(nextOptions), contentSecurityPolicy)
  }

  const token = process.env.NEXTAUTH_SECRET ? await getToken({ req: request, secret: authSecret }) : null
  const isAdmin = token?.role === 'ADMIN'

  if (pathname.startsWith('/api/admin')) {
    if (!isAdmin) {
      return applySecurityHeaders(
        NextResponse.json({ success: false, error: 'Admin access required' }, { status: 401 }),
        contentSecurityPolicy,
      )
    }

    return applySecurityHeaders(NextResponse.next(nextOptions), contentSecurityPolicy)
  }

  if (pathname.startsWith('/admin') && !isAdmin) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return applySecurityHeaders(NextResponse.redirect(loginUrl), contentSecurityPolicy)
  }

  return applySecurityHeaders(NextResponse.next(nextOptions), contentSecurityPolicy)
}

export const config = {
  matcher: [
    {
      source: '/((?!_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
