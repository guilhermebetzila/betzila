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
    const externalRefRaw = paymentData.external_reference

    console.log('📣 Status detalhado recebido do pagamento:', {
      status,
      tipo,
      valor,
      external_reference: externalRefRaw,
    })

    if (typeof externalRefRaw !== 'string' || !externalRefRaw.trim()) {
      console.log('🚫 Email ausente ou inválido no campo external_reference.')
      return NextResponse.json({ error: 'Email ausente ou inválido' }, { status: 400 })
    }

    const email = externalRefRaw.trim().toLowerCase()

    console.log('📦 Verificando status e tipo:', { status, tipo })

    if (status === 'approved') {
      if (!['pix', 'account_money', 'bank_transfer'].includes(tipo)) {
        console.log('💳 Tipo de pagamento não aceito:', tipo)
        return NextResponse.json({ status: 'tipo não aceito' }, { status: 200 })
      }

      const user = await prisma.user.findUnique({ where: { email } })
      console.log('👤 Usuário encontrado:', user)

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

    } else {
      console.log('⏳ Pagamento ainda não aprovado. Status atual:', status)
      console.log('⏱️ Agendando nova tentativa em 15 segundos.')

      setTimeout(async () => {
        try {
          const retryPayment = await payments.get({ id: String(paymentId) })

          console.log('🔁 Nova tentativa após 15s:', {
            status: retryPayment.status,
            tipo: retryPayment.payment_type_id,
            valor: retryPayment.transaction_amount,
            external_reference: retryPayment.external_reference,
          })

          if (
            retryPayment.status === 'approved' &&
            ['pix', 'account_money', 'bank_transfer'].includes(retryPayment.payment_type_id ?? '') &&
            typeof retryPayment.external_reference === 'string' &&
            retryPayment.external_reference.trim()
          ) {
            const retryEmail = retryPayment.external_reference.trim().toLowerCase()
            await prisma.user.update({
              where: { email: retryEmail },
              data: { saldo: { increment: retryPayment.transaction_amount } },
            })
            console.log(`✅ Saldo atualizado na tentativa após 15s: +${retryPayment.transaction_amount} para ${retryEmail}`)
          } else {
            console.log('❌ Tentativa após 15s não resultou em aprovação.')
          }
        } catch (e) {
          console.error('❌ Erro na re-tentativa após 15s:', e)
        }
      }, 15000)

      return NextResponse.json({ status: 'não aprovado ainda, re-tentando em 15s' }, { status: 200 })
    }

  } catch (error) {
    console.error('❌ Erro geral no processamento do webhook:', error)
    return NextResponse.json({ error: 'Erro interno no webhook' }, { status: 500 })
  }
}
