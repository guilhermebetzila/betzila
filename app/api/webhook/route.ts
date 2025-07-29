import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (body.type !== 'payment') return NextResponse.json({ ok: true })

    const paymentId = body.data?.id
    if (!paymentId) return NextResponse.json({ ok: true })

    let payment
    try {
      payment = await new Payment(client).get({ id: paymentId })
    } catch {
      return NextResponse.json({ ok: true })
    }

    if (payment.status !== 'approved') return NextResponse.json({ ok: true })

    const email = payment.metadata?.email
    const valor = Number(payment.transaction_amount)
    if (!email) return NextResponse.json({ ok: true })

    await prisma.user.update({
      where: { email },
      data: { saldo: { increment: valor } },
    })

    console.log(`Saldo atualizado para ${email}: +${valor}`)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json({ ok: true })
  }
}
