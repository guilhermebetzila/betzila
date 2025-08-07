import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const partidaExistente = await prisma.partida.findFirst({
    where: {
      finalizada: false,
    },
  });

  if (partidaExistente) {
    return NextResponse.json({ mensagem: 'Já existe partida em andamento' });
  }

  const novaPartida = await prisma.partida.create({
    data: {
      inicio: new Date(),
      fim: null,
      finalizada: false,
      vencedoraId: null,
    },
  });

  return NextResponse.json(novaPartida);
}
