import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import MercadoPagoConfig, { Payment } from 'mercadopago'

const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
})

const payments = new Payment(mp)

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token?.email) {
      console.log('🔒 Usuário não autenticado.')
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { amount, description = 'Depósito via PIX' } = await req.json()
    const valor = Number(amount)

    if (!valor || valor <= 0) {
      console.log('⚠️ Valor inválido:', valor)
      return NextResponse.json({ error: 'Valor inválido' }, { status: 400 })
    }

    console.log('📤 Criando pagamento para:', token.email, 'Valor:', valor)

    const paymentData = await payments.create({
      body: {
        transaction_amount: valor,
        description,
        payment_method_id: 'pix',
        payer: { email: token.email },
        external_reference: token.email,
      },
    })

    console.log('✅ PIX gerado:', paymentData.id)

    const copia_e_cola = paymentData.point_of_interaction?.transaction_data?.qr_code

    if (!copia_e_cola) {
      console.log('❌ Erro: Código PIX não gerado.')
      return NextResponse.json({ error: 'Erro ao gerar código PIX' }, { status: 500 })
    }

    // Retorna só o código para copiar e colar, sem o QR code em imagem/base64
    return NextResponse.json({
      id: paymentData.id,
      status: paymentData.status,
      copia_e_cola,
    })

  } catch (error: any) {
    // Logs detalhados para entender o erro completo
    console.error('❌ Erro ao criar PIX completo:', error)
    console.error('❌ Erro ao criar PIX response.data:', error.response?.data)
    console.error('❌ Erro ao criar PIX message:', error.message)

    return NextResponse.json({
      error: 'Erro interno ao criar pagamento PIX',
      detalhes: error.response?.data || error.message || error,
    }, { status: 500 })
  }
}
