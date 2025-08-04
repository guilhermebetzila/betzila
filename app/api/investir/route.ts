import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const userId = Number(session.user.id) // Conversão para número

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

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

    // ✅ Salvar o investimento no histórico
    await prisma.investimento.create({
      data: {
        userId,
        valor,
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
