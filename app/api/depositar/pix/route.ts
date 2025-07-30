import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
})

export async function POST(req: NextRequest) {
  try {
    const { amount, email } = await req.json()

    if (!amount || !email) {
      return NextResponse.json({ error: 'amount e email são obrigatórios' }, { status: 400 })
    }

    const payment = await new Payment(client).create({
      body: {
        transaction_amount: amount,
        description: 'Depósito via PIX',
        payment_method_id: 'pix',
        payer: { email },
        external_reference: email, // ✅ campo que será enviado de volta no webhook
      },
    })

    const transactionData = payment.point_of_interaction?.transaction_data
    if (!transactionData?.qr_code) {
      return NextResponse.json({ error: 'Erro ao gerar código PIX' }, { status: 500 })
    }

    return NextResponse.json({
      copia_e_cola: transactionData.qr_code,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
