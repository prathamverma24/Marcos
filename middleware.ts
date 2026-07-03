import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const authSecret = process.env.NEXTAUTH_SECRET || 'local-placeholder-secret-login-disabled'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin/login') || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  const token = process.env.NEXTAUTH_SECRET ? await getToken({ req: request, secret: authSecret }) : null
  const isAdmin = token?.role === 'ADMIN'

  if (pathname.startsWith('/api/admin')) {
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 401 })
    }

    return NextResponse.next()
  }

  if (pathname.startsWith('/admin') && !isAdmin) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
