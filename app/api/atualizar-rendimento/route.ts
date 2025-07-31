import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function aplicarRendimentos() {
  const usuarios = await prisma.user.findMany();

  for (const usuario of usuarios) {
    const rendimento = usuario.valorInvestido * 0.025;
    await prisma.user.update({
      where: { id: usuario.id },
      data: {
        saldo: usuario.saldo + rendimento,
      },
    });
  }
}

export async function GET() {
  try {
    await aplicarRendimentos();
    return NextResponse.json({ message: 'Rendimentos atualizados com sucesso (GET)' });
  } catch (error) {
    console.error('Erro ao atualizar rendimentos:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST() {
  try {
    await aplicarRendimentos();
    return NextResponse.json({ message: 'Rendimentos atualizados com sucesso (POST)' });
  } catch (error) {
    console.error('Erro ao atualizar rendimentos:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
