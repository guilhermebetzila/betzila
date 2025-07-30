import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MercadoPagoConfig, Payment } from 'mercadopago'

const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
})

const payments = new Payment(mp)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (body.type !== 'payment' || !['payment.created', 'payment.updated'].includes(body.action)) {
      return NextResponse.json({ status: 'ignored' }, { status: 200 })
    }

    const paymentId = body.data?.id
    if (!paymentId) {
      return NextResponse.json({ error: 'ID de pagamento ausente' }, { status: 400 })
    }

    // v2: retorna o pagamento diretamente (sem `.body`)
    const paymentData = await payments.get({ id: String(paymentId) })

    if (paymentData.status !== 'approved' || paymentData.payment_type_id !== 'pix') {
      return NextResponse.json({ status: 'não processado' }, { status: 200 })
    }

    const email = paymentData.external_reference
    if (!email) {
      return NextResponse.json({ error: 'Email não encontrado no external_reference' }, { status: 400 })
    }

    await prisma.user.update({
      where: { email },
      data: { saldo: { increment: paymentData.transaction_amount } },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json({ error: 'Erro interno no webhook' }, { status: 500 })
  }
}
