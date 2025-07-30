import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import MercadoPagoConfig, { Payment } from 'mercadopago'

const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
})

const payments = new Payment(mp)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('📩 Webhook recebido:', body)

    if (body.type !== 'payment' || !['payment.updated', 'payment.created'].includes(body.action)) {
      return NextResponse.json({ status: 'ignored' }, { status: 200 })
    }

    const paymentId = body.data?.id
    if (!paymentId) {
      return NextResponse.json({ error: 'ID ausente' }, { status: 400 })
    }

    const paymentData = await payments.get({ id: String(paymentId) })

    console.log('📦 Dados do pagamento:', {
      status: paymentData.status,
      tipo: paymentData.payment_type_id,
      valor: paymentData.transaction_amount,
      email: paymentData.external_reference,
    })

    if (paymentData.status !== 'approved' || paymentData.payment_type_id !== 'pix') {
      return NextResponse.json({ status: 'não processado' }, { status: 200 })
    }

    const email = paymentData.external_reference
    if (!email) {
      return NextResponse.json({ error: 'Email ausente' }, { status: 400 })
    }

    await prisma.user.update({
      where: { email },
      data: { saldo: { increment: paymentData.transaction_amount } },
    })

    console.log(`✅ Saldo atualizado para ${email}: +${paymentData.transaction_amount}`)
    return NextResponse.json({ success: true }, { status: 200 })

  } catch (error) {
    console.error('❌ Erro no webhook:', error)
    return NextResponse.json({ error: 'Erro interno no webhook' }, { status: 500 })
  }
}
