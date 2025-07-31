import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { valor } = body

    if (!valor || valor <= 0) {
      return NextResponse.json({ error: 'Valor inválido' }, { status: 400 })
    }

    // ✅ Corrigido com await
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
    }

    const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!)
    const userId = decoded.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    if (user.saldo < valor) {
      return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 400 })
    }

    const novoSaldo = user.saldo - valor

    await prisma.user.update({
      where: { id: userId },
      data: { saldo: novoSaldo },
    })

    return NextResponse.json({ message: 'Saque realizado com sucesso', saldo: novoSaldo })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 })
  }
}
