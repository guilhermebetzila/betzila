import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import MercadoPagoConfig, { Payment } from 'mercadopago'

const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
})

const payments = new Payment(mp)

export async function POST(req: Request) {
  console.log('📩 Webhook recebido!')

  try {
    const body = await req.json()
    console.log('🧾 Conteúdo do webhook:', body)

    if (body.type !== 'payment' || !['payment.created', 'payment.updated'].includes(body.action)) {
      console.log('🔁 Webhook ignorado. Tipo ou ação não compatíveis:', body.type, body.action)
      return NextResponse.json({ status: 'ignored' }, { status: 200 })
    }

    const paymentId = body.data?.id
    if (!paymentId) {
      console.log('⚠️ ID de pagamento ausente.')
      return NextResponse.json({ error: 'ID ausente' }, { status: 400 })
    }

    const paymentData = await payments.get({ id: String(paymentId) })

    const status = paymentData.status
    const tipo = paymentData.payment_type_id
    const valor = paymentData.transaction_amount
    const email = paymentData.external_reference

    console.log('📦 Dados do pagamento:', {
      status,
      tipo,
      valor,
      email,
    })

    if (status !== 'approved' || tipo !== 'pix') {
      console.log('⏳ Pagamento não aprovado ou não é PIX.')
      return NextResponse.json({ status: 'não processado' }, { status: 200 })
    }

    if (!email) {
      console.log('🚫 Email ausente no external_reference.')
      return NextResponse.json({ error: 'Email ausente' }, { status: 400 })
    }

    try {
      const result = await prisma.user.update({
        where: { email },
        data: { saldo: { increment: valor } },
      })

      console.log(`✅ Saldo atualizado com sucesso para ${email}: +${valor}`, result)
    } catch (e) {
      console.error('❌ Erro ao atualizar saldo no banco:', e)
      return NextResponse.json({ error: 'Erro ao atualizar saldo' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (error) {
    console.error('❌ Erro geral no webhook:', error)
    return NextResponse.json({ error: 'Erro interno no webhook' }, { status: 500 })
  }
}
