import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'

if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
  throw new Error('MERCADO_PAGO_ACCESS_TOKEN não definido no .env')
}

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const amount = Number(body?.amount)
    const email = body?.email // 👈 Recebendo email enviado do frontend

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Valor inválido' }, { status: 400 })
    }

    if (!email) {
      return NextResponse.json({ error: 'Email do usuário é obrigatório' }, { status: 400 })
    }

    const payment = await new Payment(client).create({
      body: {
        transaction_amount: amount,
        description: 'Depósito via PIX',
        payment_method_id: 'pix',
        payer: {
          email,
          first_name: 'Usuário',
          last_name: 'Teste',
          identification: {
            type: 'CPF',
            number: '12345678909',
          },
          address: {
            zip_code: '06233200',
            street_name: 'Av. das Nações Unidas',
            street_number: '3003',
            neighborhood: 'Bonfim',
            city: 'Osasco',
            federal_unit: 'SP',
          },
        },
        metadata: {
          email, // 👈 Metadado usado pelo webhook para creditar o saldo
        },
        external_reference: email, // 👈 (opcional extra para rastrear)
      },
    })

    const transactionData = payment?.point_of_interaction?.transaction_data

    if (!transactionData?.qr_code || !transactionData?.qr_code_base64) {
      return NextResponse.json(
        { error: 'QR Code do PIX não encontrado.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      copia_e_cola: transactionData.qr_code,
      qr_code_base64: transactionData.qr_code_base64,
    })
  } catch (error: any) {
    console.error('Erro ao criar pagamento PIX:', error)
    return NextResponse.json(
      { error: error?.message || 'Erro ao criar pagamento' },
      { status: 500 }
    )
  }
}
