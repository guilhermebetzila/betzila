import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const userId = Number(token.sub)

    // Verifica se há uma partida aberta
    const partidaAtual = await prisma.partida.findFirst({
      where: { aberta: true }
    })

    if (!partidaAtual) {
      return NextResponse.json({ error: 'Nenhuma partida disponível no momento' }, { status: 400 })
    }

    // Cria uma nova cartela para o usuário nessa partida
    const novaCartela = await prisma.cartela.create({
      data: {
        userId,
        partidaId: partidaAtual.id
      }
    })

    return NextResponse.json({ success: true, cartela: novaCartela })
  } catch (error) {
    console.error('Erro ao comprar cartela:', error)
    return NextResponse.json({ error: 'Erro ao comprar cartela' }, { status: 500 })
  }
}
