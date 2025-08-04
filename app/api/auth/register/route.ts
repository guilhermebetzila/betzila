import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, indicador } = await req.json()

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ message: 'E-mail já cadastrado' }, { status: 400 })
    }

    let indicadoPorId = null

    if (indicador) {
      const userIndicador = await prisma.user.findFirst({
        where: {
          OR: [{ email: indicador }, { id: parseInt(indicador) }],
        },
      })

      if (userIndicador) {
        indicadoPorId = userIndicador.id
      }
    }

    const hashedPassword = await hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        nome: name,
        email,
        senha: hashedPassword, // <-- aqui está o nome correto
        indicadoPorId,
      },
    })

    return NextResponse.json({ success: true, userId: newUser.id })
  } catch (error) {
    console.error('Erro ao registrar:', error)
    return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 })
  }
}
