// app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, indicador } = body

    // Verifica se o email já existe
    const userExists = await prisma.user.findUnique({
      where: { email },
    })

    if (userExists) {
      return NextResponse.json(
        { error: 'E-mail já cadastrado' },
        { status: 400 }
      )
    }

    // Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(password, 10)

    // Cria o novo usuário
    const novoUsuario = await prisma.user.create({
      data: {
        nome: name,
        email,
        senha: senhaCriptografada,
        indicador: indicador || null, // campo opcional
      },
    })

    return NextResponse.json({ sucesso: true, usuario: novoUsuario })
  } catch (error) {
    console.error('Erro no cadastro:', error)
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    )
  }
}
