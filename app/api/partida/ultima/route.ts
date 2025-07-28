import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const ultimaPartida = await prisma.partida.findFirst({
      where: { finalizada: false },
      orderBy: { inicio: 'desc' },
    });

    if (!ultimaPartida) {
      return NextResponse.json({ erro: 'Nenhuma partida em andamento' }, { status: 404 });
    }

    return NextResponse.json({
      inicio: ultimaPartida.inicio,
    });
  } catch (error) {
    return NextResponse.json({ erro: 'Erro ao buscar a última partida' }, { status: 500 });
  }
}
