import { NextRequest, NextResponse } from 'next/server'
import MercadoPagoConfig, { Payment } from 'mercadopago'

const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
})

const payments = new Payment(mp)

export async function POST(req: NextRequest) {
  try {
    const { amount, email, description = 'Depósito via PIX' } = await req.json()

    const valor = Number(amount)
    if (!email || !valor || valor <= 0) {
      return NextResponse.json({ error: 'amount e email são obrigatórios' }, { status: 400 })
    }

    const paymentData = await payments.create({
      body: {
        transaction_amount: valor,
        description,
        payment_method_id: 'pix',
        payer: { email },
        external_reference: email,
      },
    })

    console.log('Pagamento PIX criado:', paymentData)

    const tx = paymentData.point_of_interaction?.transaction_data
    if (!tx?.qr_code) {
      return NextResponse.json({ error: 'Erro ao gerar código PIX' }, { status: 500 })
    }

    return NextResponse.json({
      id: paymentData.id,
      status: paymentData.status,
      copia_e_cola: tx.qr_code,
      qr_code_base64: tx.qr_code_base64 ?? null,
      ticket_url: tx.ticket_url ?? null,
    })
  } catch (error) {
    console.error('Erro ao criar PIX:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
