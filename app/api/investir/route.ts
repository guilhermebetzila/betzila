import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()  // AQUI: await para resolver a Promise
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Token ausente' }, { status: 401 })
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
    const userId = decoded?.id

    if (!userId) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    if (user.saldo <= 0) {
      return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 400 })
    }

    const novoInvestimento = (user.valorInvestido ?? 0) + user.saldo

    const usuarioAtualizado = await prisma.user.update({
      where: { id: userId },
      data: {
        saldo: 0,
        valorInvestido: novoInvestimento,
      },
    })

    return NextResponse.json({
      message: 'Valor investido com sucesso!',
      user: {
        saldo: usuarioAtualizado.saldo,
        valorInvestido: usuarioAtualizado.valorInvestido,
      },
    })
  } catch (error) {
    console.error('Erro ao investir valor:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
