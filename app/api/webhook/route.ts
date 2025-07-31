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

    let paymentData
    try {
      paymentData = await payments.get({ id: String(paymentId) })
      console.log('🔍 Dados completos do pagamento:', JSON.stringify(paymentData, null, 2))
    } catch (error) {
      console.error('❌ Erro ao buscar detalhes do pagamento:', error)
      return NextResponse.json({ error: 'Erro ao buscar pagamento' }, { status: 500 })
    }

    const status = paymentData.status
    const tipo = paymentData.payment_type_id ?? ''
    const valor = paymentData.transaction_amount
    const email = paymentData.external_reference?.trim().toLowerCase()

    console.log('📦 Dados resumidos:', { status, tipo, valor, email })

    if (status !== 'approved') {
      console.log('⏳ Pagamento ainda não aprovado. Status:', status)
      return NextResponse.json({ status: 'não aprovado' }, { status: 200 })
    }

    if (!['pix', 'account_money', 'bank_transfer'].includes(tipo)) {
      console.log('💳 Tipo de pagamento não aceito:', tipo)
      return NextResponse.json({ status: 'tipo não aceito' }, { status: 200 })
    }

    if (!email) {
      console.log('🚫 Email ausente no campo external_reference.')
      return NextResponse.json({ error: 'Email ausente' }, { status: 400 })
    }

    // NOVO: Verificar se usuário existe antes do update
    try {
      const user = await prisma.user.findUnique({ where: { email } })
      console.log('👤 Usuário encontrado:', user)
      if (!user) {
        console.log('🚫 Usuário não encontrado para o email:', email)
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 400 })
      }
    } catch (e) {
      console.error('❌ Erro ao buscar usuário no banco:', e)
      return NextResponse.json({ error: 'Erro ao buscar usuário' }, { status: 500 })
    }

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
