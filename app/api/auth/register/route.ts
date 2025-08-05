import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, indicador, cpf } = await req.json();

    console.log('[REGISTER] Dados recebidos:', { name, email, cpf, indicador });

    // Validação básica
    if (!name || !email || !password || !cpf) {
      return NextResponse.json({ message: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    // Verificar se o e-mail já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json({ message: 'E-mail já cadastrado' }, { status: 400 });
    }

    // Verificar se o CPF já existe
    const existingCpf = await prisma.user.findUnique({
      where: { cpf },
    });
    if (existingCpf) {
      return NextResponse.json({ message: 'CPF já cadastrado' }, { status: 400 });
    }

    let indicadoPorId: number | null = null;

    // Se tiver indicador, procurar no banco
    if (indicador) {
      const userIndicador = await prisma.user.findFirst({
        where: {
          OR: [
            { email: indicador },
            { nome: indicador },
            { id: isNaN(Number(indicador)) ? -1 : Number(indicador) },
          ],
        },
      });

      console.log('[REGISTER] Indicador encontrado:', userIndicador);

      if (userIndicador) {
        indicadoPorId = userIndicador.id;
      } else {
        console.log('[REGISTER] Indicador informado não encontrado:', indicador);
        // Se quiser obrigar indicador válido, descomente abaixo:
        // return NextResponse.json({ message: 'Indicador inválido' }, { status: 400 });
      }
    }

    const hashedPassword = await hash(password, 10);

    try {
      const newUser = await prisma.user.create({
        data: {
          nome: name,
          email,
          senha: hashedPassword,
          cpf,
          indicadoPorId: indicadoPorId ?? null,
          indicador: indicador || null,
        },
      });

      console.log('[REGISTER] Novo usuário criado com ID:', newUser.id);

      return NextResponse.json({ success: true, userId: newUser.id });
    } catch (prismaError: any) {
      console.error('[REGISTER] Erro ao criar usuário:', prismaError);

      if (prismaError.code === 'P2002') {
        const targetField = prismaError.meta?.target?.[0] || 'campo único';
        return NextResponse.json(
          { message: `Já existe um usuário com este ${targetField}.` },
          { status: 400 },
        );
      }

      throw prismaError;
    }

  } catch (error: any) {
    console.error('[REGISTER] Erro inesperado:', error, error?.stack);
    return NextResponse.json(
      { message: `Erro interno: ${error?.message || 'Erro desconhecido'}` },
      { status: 500 },
    );
  }
}
