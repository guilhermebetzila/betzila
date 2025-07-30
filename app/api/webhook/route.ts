// app/api/webhook/route.ts
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

    if (body.type !== 'payment' || !['payment.created', 'payment.updated'].includes(body.action)) {
      console.log('Webhook ignorado: tipo ou ação inválidos', body.type, body.action)
      return NextResponse.json({ status: 'ignored' }, { status: 200 })
    }

    const paymentId = body.data?.id
    if (!paymentId) {
      console.log('ID de pagamento ausente no webhook')
      return NextResponse.json({ error: 'ID de pagamento ausente' }, { status: 400 })
    }

    const paymentData = await payments.get({ id: String(paymentId) })

    console.log('Dados do pagamento recebidos:', paymentData)

    if (paymentData.status !== 'approved' || paymentData.payment_type_id !== 'pix') {
      console.log('Pagamento não aprovado ou não é PIX:', paymentData.status, paymentData.payment_type_id)
      return NextResponse.json({ status: 'não processado' }, { status: 200 })
    }

    const email = paymentData.external_reference
    if (!email) {
      console.log('Email não encontrado no external_reference')
      return NextResponse.json({ error: 'Email não encontrado no external_reference' }, { status: 400 })
    }

    try {
      await prisma.user.update({
        where: { email },
        data: { saldo: { increment: paymentData.transaction_amount } },
      })
      console.log(`Saldo atualizado para ${email}: +${paymentData.transaction_amount}`)
    } catch (e) {
      console.error('Erro ao atualizar saldo no banco:', e)
      return NextResponse.json({ error: 'Erro ao atualizar saldo no banco' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json({ error: 'Erro interno no webhook' }, { status: 500 })
  }
}
