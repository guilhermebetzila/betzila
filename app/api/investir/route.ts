import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Token ausente' }, { status: 401 })
    }

    const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!) // 👈 alterado aqui
    const userId = decoded?.id

    if (!userId) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const body = await req.json()
    const valor = parseFloat(body.valor)

    if (isNaN(valor) || valor <= 0) {
      return NextResponse.json({ error: 'Valor inválido para investir' }, { status: 400 })
    }

    if (user.saldo < valor) {
      return NextResponse.json({ error: 'Saldo insuficiente para esse valor' }, { status: 400 })
    }

    const novoSaldo = user.saldo - valor
    const novoInvestimento = (user.valorInvestido ?? 0) + valor

    const usuarioAtualizado = await prisma.user.update({
      where: { id: userId },
      data: {
        saldo: novoSaldo,
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
