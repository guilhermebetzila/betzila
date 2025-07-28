import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const cartelas = await prisma.cartela.findMany({
      where: { userId: Number(session.user.id) },
      include: {
        numeros: true,
        partida: true
      }
    })
    return NextResponse.json({ cartelas }, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar cartelas:', error)
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}
