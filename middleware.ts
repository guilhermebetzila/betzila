import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

// Middleware para proteger rotas privadas
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  const isAuthenticated = !!token
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')

  if (isDashboardRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Define quais rotas o middleware irá monitorar
export const config = {
  matcher: ['/dashboard/:path*'],
}
