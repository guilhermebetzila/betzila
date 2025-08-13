import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const userId = Number(session.user.id)

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        saldo: true,
        valorInvestido: true,
        pontos: true,
        indicadoPorId: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const body = await req.json()
    const valor = parseFloat(body.valor)

    if (isNaN(valor) || valor < 1) {
      return NextResponse.json({ error: 'Valor inválido para investir (mínimo R$1)' }, { status: 400 })
    }

    if (user.saldo < valor) {
      return NextResponse.json({ error: 'Saldo insuficiente para esse valor' }, { status: 400 })
    }

    // Define percentual diário de acordo com o valor investido
    let percentualDiario: number
    if (valor <= 5000) {
      percentualDiario = parseFloat((Math.random() * (1.5 - 1.0) + 1.0).toFixed(2))
    } else if (valor <= 10000) {
      percentualDiario = parseFloat((Math.random() * (1.8 - 1.5) + 1.5).toFixed(2))
    } else {
      percentualDiario = 2.0
    }

    const novoSaldo = user.saldo - valor
    const novoInvestimento = user.valorInvestido + valor
    const pontosGanhos = Math.floor(valor / 2)

    // Atualiza saldo, valor investido e pontos
    const usuarioAtualizado = await prisma.user.update({
      where: { id: userId },
      data: {
        saldo: novoSaldo,
        valorInvestido: novoInvestimento,
        pontos: { increment: pontosGanhos },
      },
    })

    // Salva investimento no histórico com percentual diário
    await prisma.investimento.create({
      data: {
        userId,
        valor,
        percentualDiario,
        rendimentoAcumulado: 0, // inicia com 0
      },
    })

    // Atualiza pontos do indicado direto
    if (user.indicadoPorId) {
      await prisma.user.update({
        where: { id: user.indicadoPorId },
        data: { pontos: { increment: pontosGanhos } },
      })

      const indicadorDireto = await prisma.user.findUnique({
        where: { id: user.indicadoPorId },
        select: { indicadoPorId: true },
      })

      if (indicadorDireto?.indicadoPorId) {
        await prisma.user.update({
          where: { id: indicadorDireto.indicadoPorId },
          data: { pontos: { increment: pontosGanhos } },
        })
      }
    }

    return NextResponse.json({
      message: 'Valor investido com sucesso!',
      user: {
        saldo: usuarioAtualizado.saldo,
        valorInvestido: usuarioAtualizado.valorInvestido,
        pontos: usuarioAtualizado.pontos,
      },
      investimento: {
        valor,
        percentualDiario,
      },
    })
  } catch (error) {
    console.error('Erro ao investir valor:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
