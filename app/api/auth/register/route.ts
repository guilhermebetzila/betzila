import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { name, email, cpf, password, indicador } = await req.json()

    console.log('[REGISTER] Dados recebidos:', { name, email, cpf, indicador })

    // 🔒 Validação básica
    if (!name || !email || !cpf || !password) {
      return NextResponse.json(
        { message: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      )
    }

    // 📧 Verificar se o e-mail já existe
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    })
    if (existingEmail) {
      return NextResponse.json(
        { message: 'E-mail já cadastrado.' },
        { status: 400 }
      )
    }

    // 🧾 Verificar se o CPF já existe
    const existingCpf = await prisma.user.findUnique({
      where: { cpf },
    })
    if (existingCpf) {
      return NextResponse.json(
        { message: 'CPF já cadastrado.' },
        { status: 400 }
      )
    }

    let indicadoPorId: number | null = null

    // 👤 Buscar ID do indicador, se fornecido
    if (indicador) {
      const userIndicador = await prisma.user.findFirst({
        where: {
          OR: [
            { email: indicador },
            { nome: indicador },
            { id: isNaN(Number(indicador)) ? -1 : Number(indicador) },
          ],
        },
      })

      console.log('[REGISTER] Indicador encontrado:', userIndicador)

      if (userIndicador) {
        indicadoPorId = userIndicador.id
      } else {
        console.log('[REGISTER] Indicador inválido:', indicador)
        // Descomente se quiser bloquear cadastro com indicador inválido:
        // return NextResponse.json({ message: 'Indicador inválido.' }, { status: 400 });
      }
    }

    const hashedPassword = await hash(password, 10)

    // ✅ Criar novo usuário
    const newUser = await prisma.user.create({
      data: {
        nome: name,
        email,
        cpf,
        senha: hashedPassword,
        indicadoPorId,
        indicador: indicador || null,
      },
    })

    console.log('[REGISTER] Novo usuário criado:', newUser.id)

    return NextResponse.json({ success: true, userId: newUser.id })
  } catch (error: any) {
    console.error('[REGISTER] Erro inesperado:', error)

    if (error.code === 'P2002') {
      const campo = error.meta?.target?.[0] || 'campo'
      return NextResponse.json(
        { message: `Já existe um usuário com este ${campo}.` },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: `Erro interno: ${error.message || 'Erro desconhecido'}` },
      { status: 500 }
    )
  }
}
