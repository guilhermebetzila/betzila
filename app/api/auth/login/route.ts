import { PrismaClient } from '@prisma/client'
import { compare } from 'bcryptjs'
import { NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    // Busca usuário no banco
    const user = await prisma.user.findUnique({ where: { email } })

    // Verifica se usuário existe e a senha bate
    if (!user || !(await compare(password, user.senha))) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 })
    }

    // Cria um token JWT simples (usado apenas para armazenar no cookie)
    const token = sign(
      {
        id: user.id,
        nome: user.nome,
        email: user.email
      },
      process.env.JWT_SECRET!, // você deve ter essa variável no seu .env
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      message: 'Login com sucesso',
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        saldo: user.saldo
      }
    })

    // Define o cookie manualmente com HttpOnly
    response.headers.set(
      'Set-Cookie',
      `token=${token}; Path=/; HttpOnly; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`
    )

    return response
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
