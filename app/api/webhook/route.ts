import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MercadoPagoConfig, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Apenas processa eventos de criação de pagamento
    if (body.type !== 'payment' || body.action !== 'payment.created') {
      return NextResponse.json({ status: 'ignored' }, { status: 200 })
    }

    const paymentId = body.data?.id
    if (!paymentId) {
      return NextResponse.json({ error: 'ID de pagamento ausente' }, { status: 400 })
    }

    // Busca o pagamento na API do Mercado Pago
    const payment = await new Payment(client).get({ id: paymentId })

    // Verifica se o pagamento foi aprovado e é via Pix
    if (payment.status !== 'approved' || payment.payment_type_id !== 'pix') {
      return NextResponse.json({ status: 'não processado' }, { status: 200 })
    }

    const email = payment.metadata?.email
    if (!email) {
      return NextResponse.json({ error: 'Email não encontrado nos metadados' }, { status: 400 })
    }

    // Atualiza saldo no banco de dados
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
