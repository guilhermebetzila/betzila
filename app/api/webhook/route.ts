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

    // ✅ Ação esperada
    const action = body.action
    if (!['payment.created', 'payment.updated'].includes(action)) {
      console.log('🔁 Webhook ignorado. Ação não compatível:', action)
      return NextResponse.json({ status: 'ignored' }, { status: 200 })
    }

    const paymentId = body.data?.id
    if (!paymentId) {
      console.log('⚠️ ID de pagamento ausente.')
      return NextResponse.json({ error: 'ID ausente' }, { status: 400 })
    }

    // ✅ Busca informações detalhadas do pagamento
    const paymentData = await payments.get({ id: String(paymentId) })

    const status = paymentData.status
    const tipo = paymentData.payment_type_id ?? ''
    const valor = paymentData.transaction_amount
    const email = paymentData.external_reference?.trim().toLowerCase()

    console.log('📦 Dados do pagamento recebidos do Mercado Pago:', {
      status,
      tipo,
      valor,
      email,
    })

    // ✅ Verifica se está aprovado
    if (status !== 'approved') {
      console.log('⏳ Pagamento ainda não aprovado. Status:', status)
      return NextResponse.json({ status: 'não aprovado' }, { status: 200 })
    }

    // ✅ Verifica se o tipo é aceito (PIX, saldo conta ou transferência)
    if (!['pix', 'account_money', 'bank_transfer'].includes(tipo)) {
      console.log('💳 Tipo de pagamento não aceito:', tipo)
      return NextResponse.json({ status: 'tipo não aceito' }, { status: 200 })
    }

    if (!email) {
      console.log('🚫 Email ausente no campo external_reference.')
      return NextResponse.json({ error: 'Email ausente' }, { status: 400 })
    }

    // ✅ Atualiza o saldo
    try {
      const result = await prisma.user.update({
        where: { email },
        data: { saldo: { increment: valor } },
      })

      console.log(`✅ Saldo atualizado com sucesso para ${email}: +${valor}`, result)
      return NextResponse.json({ success: true }, { status: 200 })

    } catch (e) {
      console.error('❌ Erro ao atualizar o saldo no banco:', e)
      return NextResponse.json({ error: 'Erro ao atualizar saldo' }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ Erro geral no processamento do webhook:', error)
    return NextResponse.json({ error: 'Erro interno no webhook' }, { status: 500 })
  }
}
