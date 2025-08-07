import { PrismaClient } from '@prisma/client'
import { compare } from 'bcryptjs'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !user.senha || !(await compare(password, user.senha))) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 })
    }

    return NextResponse.json({
      message: 'Credenciais válidas',
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        saldo: user.saldo
      }
    })
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
