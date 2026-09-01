import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import { authConfig } from '@/lib/auth.config'

// A lightweight, provider-less instance keeps Prisma/bcrypt out of the Edge bundle.
const { auth } = NextAuth(authConfig)

const ADMIN_ONLY = ['/admin']

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  if (!session) {
    const url = new URL('/login', req.nextUrl)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  const needsAdmin = ADMIN_ONLY.some((p) => pathname.startsWith(p))
  if (needsAdmin && session.user?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/account/:path*', '/cart/checkout/:path*', '/admin/:path*']
}
