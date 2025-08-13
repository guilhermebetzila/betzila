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

    // Atualiza saldo e valor investido
    const novoSaldo = user.saldo - valor
    const novoInvestimento = user.valorInvestido + valor

    await prisma.user.update({
      where: { id: userId },
      data: {
        saldo: novoSaldo,
        valorInvestido: novoInvestimento,
      },
    })

    // Salva investimento no histórico
    await prisma.investimento.create({
      data: {
        userId,
        valor,
        percentualDiario,
        rendimentoAcumulado: 0,
      },
    })

    // Atualiza pontos instantaneamente incluindo todos os níveis de indicados
    await atualizarPontos(userId)

    return NextResponse.json({
      message: 'Valor investido com sucesso!',
      user: await prisma.user.findUnique({ where: { id: userId }, select: { saldo: true, valorInvestido: true, pontos: true } }),
      investimento: { valor, percentualDiario },
    })
  } catch (error) {
    console.error('Erro ao investir valor:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// Função para atualizar pontos do usuário incluindo indicados em todos os níveis
async function atualizarPontos(userId: number) {
  const usuario = await prisma.user.findUnique({ where: { id: userId } })
  if (!usuario) return

  // Investimentos próprios
  const investimentosProprios = await prisma.investimento.findMany({ where: { userId } })
  let totalInvestido = investimentosProprios.reduce((acc, i) => acc + i.valor, 0)

  // Função recursiva para somar investimentos de todos os indicados
  async function somarInvestimentosIndicados(indicadorId: number): Promise<number> {
    const indicados = await prisma.user.findMany({ where: { indicadoPorId: indicadorId } })
    let total = 0
    for (const indicado of indicados) {
      const inv = await prisma.investimento.findMany({ where: { userId: indicado.id } })
      total += inv.reduce((acc, i) => acc + i.valor, 0)
      // chama recursivamente para os próximos níveis
      total += await somarInvestimentosIndicados(indicado.id)
    }
    return total
  }

  totalInvestido += await somarInvestimentosIndicados(userId)

  // Calcula pontos: 1 ponto a cada R$2
  const pontos = Math.floor(totalInvestido / 2)

  // Atualiza os pontos do usuário
  await prisma.user.update({
    where: { id: userId },
    data: { pontos },
  })
}

