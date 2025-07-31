import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import MercadoPagoConfig, { Payment } from 'mercadopago'

const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
})

const payments = new Payment(mp)

export async function POST(req: Request) {
  console.log('📩 Webhook recebido! ✅ Função ATUAL executando!')

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
    } catch (error) {
      console.error('❌ Erro ao buscar detalhes do pagamento:', error)
      return NextResponse.json({ error: 'Erro ao buscar pagamento' }, { status: 500 })
    }

    const status = paymentData.status
    const tipo = paymentData.payment_type_id ?? ''
    const valor = paymentData.transaction_amount
    const externalRefRaw = paymentData.external_reference

    console.log('📦 Dados do pagamento recebidos do Mercado Pago:', {
      status,
      tipo,
      valor,
      email: externalRefRaw,
    })

    if (typeof externalRefRaw !== 'string' || !externalRefRaw.trim()) {
      console.log('🚫 Email ausente ou inválido no campo external_reference.')
      return NextResponse.json({ error: 'Email ausente ou inválido' }, { status: 400 })
    }

    const email = externalRefRaw.trim().toLowerCase()

    // ✅ Verificação correta
    if (status === 'approved' && ['pix', 'bank_transfer', 'account_money'].includes(tipo)) {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        console.log('🚫 Usuário não encontrado para o email:', email)
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 400 })
      }

      const result = await prisma.user.update({
        where: { email },
        data: { saldo: { increment: valor } },
      })

      console.log(`✅ Saldo atualizado com sucesso para ${email}: +${valor}`, result)
      return NextResponse.json({ success: true }, { status: 200 })
    }

    // ❗ Ainda não aprovado ou tipo não aceito
    console.log(`⏳ Pagamento não processado ainda. Status: ${status} | Tipo: ${tipo}`)

    return NextResponse.json({ status: 'Aguardando aprovação ou tipo não aceito' }, { status: 200 })

  } catch (error) {
    console.error('❌ Erro geral no webhook:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
