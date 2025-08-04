import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Token ausente' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    const userId = decoded?.id;

    const { cpf } = await req.json();

    if (!cpf || cpf.replace(/[^\d]/g, '').length !== 11) {
      return NextResponse.json({ error: 'CPF inválido' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { cpf },
    });

    return NextResponse.json({ sucesso: true });
  } catch (error) {
    console.error('Erro ao atualizar CPF:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
