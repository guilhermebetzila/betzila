import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MercadoPagoConfig, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // ✅ Aceita tanto payment.created quanto payment.updated
    if (body.type !== 'payment' || (body.action !== 'payment.created' && body.action !== 'payment.updated')) {
      return NextResponse.json({ status: 'ignored' }, { status: 200 })
    }

    const paymentId = body.data?.id
    if (!paymentId) {
      return NextResponse.json({ error: 'ID de pagamento ausente' }, { status: 400 })
    }

    const payment = await new Payment(client).get({ id: paymentId })

    // ✅ Verifica se o pagamento foi aprovado por PIX
    if (payment.status !== 'approved' || payment.payment_type_id !== 'pix') {
      return NextResponse.json({ status: 'não processado' }, { status: 200 })
    }

    const email = payment.external_reference // ✅ Pegando do external_reference

    if (!email) {
      return NextResponse.json({ error: 'Email não encontrado no external_reference' }, { status: 400 })
    }

    // ✅ Atualiza o saldo do usuário
    await prisma.user.update({
      where: { email },
      data: {
        saldo: {
          increment: payment.transaction_amount,
        },
      },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json({ error: 'Erro interno no webhook' }, { status: 500 })
  }
}
