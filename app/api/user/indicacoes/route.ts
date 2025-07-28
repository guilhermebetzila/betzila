import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies(); // ✅ USAR await
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ erro: 'Token não encontrado' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded?.id;

    if (!userId) {
      return NextResponse.json({ erro: 'Usuário não autenticado' }, { status: 401 });
    }

    const totalIndicados = await prisma.user.count({
      where: {
        indicadoPorId: userId, // ✅ Esse campo precisa estar no schema.prisma
      },
    });

    return NextResponse.json({
      sucesso: true,
      totalIndicados,
    });
  } catch (erro) {
    console.error('[ERRO INDICAÇÕES]', erro);
    return NextResponse.json({ erro: 'Erro interno no servidor' }, { status: 500 });
  }
}
