'use server'

import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/mailer' // helper de email

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

    // 🔑 Validação de senha complexa
    const senhaRegex = /^(?=.*[A-Z])(?=(?:.*[a-z]){2,})(?=.*\d)(?=.*[!@#$%^&*()_+\-[\]{};:'",.<>\/?\\|]).{6,}$/
    if (!senhaRegex.test(password)) {
      return NextResponse.json(
        {
          message:
            'A senha deve ter pelo menos 1 letra maiúscula, 2 letras minúsculas, 1 número e 1 caractere especial.'
        },
        { status: 400 }
      )
    }

    // 📧 Verificar se o e-mail já existe
    const existingEmail = await prisma.user.findUnique({ where: { email } })
    if (existingEmail) {
      return NextResponse.json({ message: 'E-mail já cadastrado.' }, { status: 400 })
    }

    // 🧾 Verificar se o CPF já existe
    const existingCpf = await prisma.user.findUnique({ where: { cpf } })
    if (existingCpf) {
      return NextResponse.json({ message: 'CPF já cadastrado.' }, { status: 400 })
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

      if (userIndicador) indicadoPorId = userIndicador.id
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

    // 📧 Envia email de boas-vindas
    try {
      await sendWelcomeEmail(email, name)
      console.log('[REGISTER] Email de boas-vindas enviado para:', email)
    } catch (emailError) {
      console.error('[REGISTER] Erro ao enviar email:', emailError)
    }

    // ✅ Gera token JWT e envia cookie
    const token = sign(
      { id: newUser.id, nome: newUser.nome, email: newUser.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      success: true,
      userId: newUser.id,
      message: 'Cadastro realizado com sucesso'
    })

    response.headers.set(
      'Set-Cookie',
      `token=${token}; Path=/; HttpOnly; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`
    )

    return response
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
