import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value
    if (!token) return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })

    const decoded = verifyToken(token)
    if (!decoded || !decoded.id) return NextResponse.json({ message: 'Token inválido' }, { status: 401 })

    const { amount } = await req.json()

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ message: 'Valor inválido' }, { status: 400 })
    }

    // Atualiza saldo
    const user = await prisma.user.update({
      where: { id: decoded.id },
      data: { saldo: { increment: amount } },
    })

    return NextResponse.json({ message: 'Depósito realizado', saldoAtualizado: user.saldo })
  } catch (error) {
    console.error('Erro ao depositar:', error)
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}
