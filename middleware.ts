import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Configura o middleware com proteção via NextAuth
export default withAuth(
  function middleware(req: NextRequest) {
    // Aqui você pode adicionar verificações adicionais se quiser
    return NextResponse.next()
  },
  {
    callbacks: {
      // Redireciona se o usuário não estiver autenticado
      authorized({ token }) {
        return !!token
      },
    },
  }
)

// Define quais rotas serão protegidas
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/painel/:path*',
    '/minha-conta/:path*',
    '/investimentos/:path*',
    '/indicacoes/:path*',
  ],
}
