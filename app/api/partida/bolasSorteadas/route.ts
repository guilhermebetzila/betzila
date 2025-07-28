// /api/partida/bolasSorteadas.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const partida = await prisma.partida.findFirst({
      where: { aberta: true, finalizada: false },
      include: { bolas: { orderBy: { ordem: 'asc' } } },
    });

    if (!partida || !partida.bolas) {
      return NextResponse.json([], { status: 200 }); // Garante retorno de array
    }

    return NextResponse.json(partida.bolas, { status: 200 });
  } catch (error) {
    console.error('[ERRO_GET_BOLAS]', error);
    return NextResponse.json({ error: 'Erro ao buscar bolas sorteadas' }, { status: 500 });
  }
}
