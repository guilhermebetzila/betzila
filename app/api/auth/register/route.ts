import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, indicador } = await req.json();

    console.log('[REGISTER] Dados recebidos:', { name, email, indicador });

    // Validação básica
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    // Verificar se o e-mail já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'E-mail já cadastrado' }, { status: 400 });
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
        // Opcional: se quiser bloquear registro com indicador inválido, descomente abaixo:
        // return NextResponse.json({ message: 'Indicador inválido' }, { status: 400 });
      }
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        nome: name,
        email,
        senha: hashedPassword,
        indicadoPorId: indicadoPorId ?? null,  // garante null em vez de undefined
        indicador: indicador || null,          // salva indicador como string se vier
      },
    });

    console.log('[REGISTER] Novo usuário criado com ID:', newUser.id);

    return NextResponse.json({ success: true, userId: newUser.id });
  } catch (error: any) {
    console.error('[REGISTER] Erro inesperado:', error);
    return NextResponse.json(
      { message: `Erro interno: ${error?.message || 'Erro desconhecido'}` },
      { status: 500 },
    );
  }
}
