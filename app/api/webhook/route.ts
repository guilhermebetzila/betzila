import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import MercadoPagoConfig, { Payment } from 'mercadopago'

const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
})

const payments = new Payment(mp)

export async function POST(req: Request) {
  console.log('🚨 VERSÃO ATUAL DO CÓDIGO WEBHOOK ESTÁ SENDO EXECUTADA')
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
    } catch (error) {
      console.error('❌ Erro ao buscar detalhes do pagamento:', error)
      return NextResponse.json({ error: 'Erro ao buscar pagamento' }, { status: 500 })
    }

    const status = (paymentData.status ?? '').toString().trim().toLowerCase()
    const tipoOriginal = (paymentData.payment_type_id ?? '').toString()
    const tipo = tipoOriginal.trim().toLowerCase().replace(/\s+/g, '')
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
    const aprovado = status === 'approved'

    const tiposAceitos = ['pix', 'bank_transfer', 'account_money']
    const tipoAceito = tiposAceitos.includes(tipo)

    // 🚨 Log detalhado da verificação
    console.log('🧪 Verificação do tipo:', {
      tipoRecebido: tipo,
      tiposAceitos,
      tipoAceito,
    })

    if (aprovado && tipoAceito) {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        console.log('🚫 Usuário não encontrado para o email:', email)
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 400 })
      }

      await prisma.user.update({
        where: { email },
        data: { saldo: { increment: valor } },
      })

      console.log(`✅ Saldo atualizado com sucesso para ${email}: +${valor}`)
      return NextResponse.json({ success: true }, { status: 200 })
    }

    console.log('⏳ Pagamento ainda não aprovado ou tipo não aceit.', {
      aprovado,
      tipoAceito,
      tipoRecebido: tipo,
      tipoOriginal,
      statusRecebido: status,
    })

    return NextResponse.json({ status: 'aguardando aprovação ou tipo inválido' }, { status: 200 })

  } catch (error) {
    console.error('❌ Erro geral no webhook:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
