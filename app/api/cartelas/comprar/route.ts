import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
  }

  const partida = await prisma.partida.findFirst({
    where: {
      aberta: true,
      finalizada: false,
      encerrada: false,
    },
  });

  if (!partida) {
    return NextResponse.json({ error: 'Nenhuma partida ativa disponível' }, { status: 400 });
  }

  // (Opcional) Verifica se o usuário já comprou uma cartela nesta partida
  const cartelaExistente = await prisma.cartela.findFirst({
    where: {
      userId: user.id,
      partidaId: partida.id,
    },
  });

  if (cartelaExistente) {
    return NextResponse.json({ error: 'Você já possui uma cartela nesta partida' }, { status: 400 });
  }

  // Cria nova cartela
  const novaCartela = await prisma.cartela.create({
    data: {
      userId: user.id,
      partidaId: partida.id,
    },
  });

  return NextResponse.json({ success: true, cartela: novaCartela }, { status: 201 });
}
