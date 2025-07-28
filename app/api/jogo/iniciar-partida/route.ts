import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const partidaExistente = await prisma.partida.findFirst({
      where: { finalizada: false }
    })

    if (partidaExistente) {
      return NextResponse.json({ status: 'em-andamento', partida: partidaExistente })
    }

    const novaPartida = await prisma.partida.create({
      data: {
        finalizada: false,
        aberta: true
      }
    })

    return NextResponse.json({ status: 'nova-criada', partida: novaPartida })
  } catch (error) {
    console.error('[ERRO_PARTIDA]', error)
    return NextResponse.json({ erro: 'Erro ao iniciar partida' }, { status: 500 })
  }
}
