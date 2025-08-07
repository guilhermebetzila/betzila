import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const ultimaPartida = await prisma.partida.findFirst({
      orderBy: {
        inicio: 'desc',
      },
      include: {
        bolas: true,
        cartelas: {
          include: {
            numeros: true,
            user: true,
          },
        },
      },
    })

    if (!ultimaPartida) {
      return NextResponse.json({ vencedor: null })
    }

    const bolasSorteadas: number[] = ultimaPartida.bolas.map((b) => b.numero)

    const cartelaVencedora = ultimaPartida.cartelas.find((cartela) => {
      const numerosCartela = cartela.numeros.map((n) => n.numero)
      return numerosCartela.every((num) => bolasSorteadas.includes(num))
    })

    if (!cartelaVencedora) {
      return NextResponse.json({ vencedor: null })
    }

    return NextResponse.json({
      vencedor: {
        nome: cartelaVencedora.user.nome,
        numeros: cartelaVencedora.numeros.map((n) => n.numero),
      },
    })
  } catch (error) {
    console.error('[ERRO_API_ULTIMAVENCEDORA]', error)
    return NextResponse.json(
      { error: 'Erro ao buscar vencedora.' },
      { status: 500 }
    )
  }
}
