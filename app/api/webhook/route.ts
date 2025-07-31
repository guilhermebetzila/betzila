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

    // ✅ VERIFICAÇÃO PRINCIPAL DIRETA
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

    // ❗ Pagamento ainda não válido, agendar nova tentativa
    console.log('⏳ Pagamento ainda não aprovado ou tipo não aceito. Status:', status, '| Tipo:', tipo)

    setTimeout(async () => {
      try {
        const retryPayment = await payments.get({ id: String(paymentId) })
        const retryStatus = retryPayment.status
        const retryTipo = retryPayment.payment_type_id ?? ''
        const retryRef = retryPayment.external_reference

        console.log('🔁 Nova tentativa após 15s:', {
          status: retryStatus,
          tipo: retryTipo,
          valor: retryPayment.transaction_amount,
          external_reference: retryRef,
        })

        if (
          retryStatus === 'approved' &&
          ['pix', 'account_money', 'bank_transfer'].includes(retryTipo) &&
          typeof retryRef === 'string' &&
          retryRef.trim()
        ) {
          const retryEmail = retryRef.trim().toLowerCase()
          await prisma.user.update({
            where: { email: retryEmail },
            data: { saldo: { increment: retryPayment.transaction_amount } },
          })
          console.log(`✅ Saldo atualizado após nova tentativa para ${retryEmail}: +${retryPayment.transaction_amount}`)
        } else {
          console.log('❌ Nova tentativa após 15s não resultou em aprovação válida.')
        }
      } catch (e) {
        console.error('❌ Erro na nova tentativa após 15s:', e)
      }
    }, 15000)

    return NextResponse.json({ status: 'Pagamento pendente ou tipo inválido' }, { status: 200 })

  } catch (error) {
    console.error('❌ Erro geral no webhook:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
