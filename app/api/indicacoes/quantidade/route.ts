import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function GET() {
  try {
    const cookieStore = await cookies() // <-- manter o await
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Token ausente' }, { status: 401 })
    }

    const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!) // 👈 alterado aqui
    const userName = decoded?.nome

    if (!userName) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    // Conta quantos usuários foram indicados pelo usuário logado
    const quantidadeIndicados = await prisma.user.count({
      where: {
        indicador: userName,
      },
    })

    return NextResponse.json({ quantidade: quantidadeIndicados })
  } catch (error) {
    console.error('Erro ao buscar quantidade de indicados:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
