import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Buscar usuários com valorInvestido maior que 0
    const usuariosInvestidores = await prisma.user.findMany({
      where: {
        valorInvestido: {
          gt: 0,
        },
      },
    })

    // Para cada usuário, calcular rendimento e atualizar saldo
    for (const user of usuariosInvestidores) {
      const rendimento = user.valorInvestido * 0.025 // 2,5%
      const novoSaldo = user.saldo + rendimento

      await prisma.user.update({
        where: { id: user.id },
        data: {
          saldo: novoSaldo,
        },
      })
    }

    return NextResponse.json({ message: 'Rendimentos aplicados com sucesso!' })
  } catch (error) {
    console.error('Erro ao aplicar rendimentos:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
