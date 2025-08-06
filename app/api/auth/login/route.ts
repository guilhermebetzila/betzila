import { PrismaClient } from '@prisma/client'
import { compare } from 'bcryptjs'
import { NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !(await compare(password, user.senha))) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 })
    }

    const token = sign(
      {
        id: user.id,
        nome: user.nome,
        email: user.email,
        saldo: user.saldo
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({ message: 'Login com sucesso' })

    // Definindo o cookie com nome padrão usado pelo next-auth/jwt
    response.headers.set(
      'Set-Cookie',
      `next-auth.session-token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}`
    )

    return response
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    return NextResponse.json({ message: 'Erro no servidor' }, { status: 500 })
  }
}
