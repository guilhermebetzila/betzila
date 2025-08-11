import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'  // Ajustado aqui

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const userId = Number(session.user.id)

  const historico = await prisma.investimento.findMany({
    where: { userId },
    orderBy: { criadoEm: 'desc' },
  })

  return NextResponse.json(historico)
}
