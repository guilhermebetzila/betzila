import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.email) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { amount } = await req.json();
    const valor = Number(amount);

    if (!valor || valor <= 0) {
      return NextResponse.json({ error: 'Valor inválido' }, { status: 400 });
    }

    // Buscar CPF do usuário pelo e-mail
    const user = await prisma.user.findUnique({
      where: { email: token.email },
      select: { cpf: true },
    });

    if (!user?.cpf || user.cpf.replace(/\D/g, '').length !== 11) {
      return NextResponse.json({
        error: 'CPF ausente ou inválido. Atualize seu CPF antes de depositar.',
      }, { status: 403 });
    }

    // Se CPF válido, continue o processo de depósito (aqui seria com MercadoPago, por exemplo)
    return NextResponse.json({
      sucesso: true,
      mensagem: 'CPF validado. Pode prosseguir com o depósito.',
    });
  } catch (error) {
    console.error('Erro em /api/depositar:', error);
    return NextResponse.json({ error: 'Erro interno ao processar depósito' }, { status: 500 });
  }
}
