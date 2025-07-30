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

    // Só processa se for evento de pagamento criado ou atualizado
    if (body.type !== 'payment' || !['payment.created', 'payment.updated'].includes(body.action)) {
      console.log('🔁 Webhook ignorado. Tipo ou ação não compatíveis:', body.type, body.action)
      return NextResponse.json({ status: 'ignored' }, { status: 200 })
    }

    // Pega o ID do pagamento para consultar no Mercado Pago
    const paymentId = body.data?.id
    if (!paymentId) {
      console.log('⚠️ ID de pagamento ausente.')
      return NextResponse.json({ error: 'ID ausente' }, { status: 400 })
    }

    // Busca os dados completos do pagamento no Mercado Pago
    const paymentData = await payments.get({ id: String(paymentId) })

    const status = paymentData.status
    const tipo = paymentData.payment_type_id
    const valor = paymentData.transaction_amount
    const email = paymentData.external_reference?.trim().toLowerCase()

    console.log('📦 Dados do pagamento recebidos do Mercado Pago:', {
      status,
      tipo,
      valor,
      email,
    })

    // Só atualiza se pagamento aprovado e via PIX
    if (status !== 'approved' || tipo !== 'pix') {
      console.log('⏳ Pagamento ainda não aprovado ou não é PIX.')
      return NextResponse.json({ status: 'não processado' }, { status: 200 })
    }

    // Se email estiver vazio, erro
    if (!email) {
      console.log('🚫 Email ausente no campo external_reference.')
      return NextResponse.json({ error: 'Email ausente' }, { status: 400 })
    }

    // Atualiza saldo no banco
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
