import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('📩 Webhook recebido:', body)

    // Ignora notificações que não são de pagamento
    if (body.type !== 'payment') {
      console.log('🔕 Notificação ignorada (não é pagamento)')
      return NextResponse.json({ ok: true })
    }

    const paymentId = body.data?.id
    if (!paymentId) {
      console.error('❌ ID do pagamento ausente na notificação')
      return NextResponse.json({ ok: false, error: 'ID ausente' }, { status: 400 })
    }

    // Consulta o pagamento usando o SDK oficial
    const payment = await new Payment(client).get({ id: paymentId })

    console.log('📦 Detalhes do pagamento:', {
      status: payment.status,
      email: payment.metadata?.email,
      valor: payment.transaction_amount,
    })

    // Só continua se estiver aprovado
    if (payment.status !== 'approved') {
      console.log('⏳ Pagamento ainda não aprovado. Ignorado.')
      return NextResponse.json({ ok: true })
    }

    const email = payment.metadata?.email
    const valor = Number(payment.transaction_amount)

    if (!email) {
      console.error('❌ Email não encontrado nos metadados do pagamento!')
      return NextResponse.json({ ok: false, error: 'Email ausente' }, { status: 400 })
    }

    // Atualiza saldo do usuário
    await prisma.user.update({
      where: { email },
      data: { saldo: { increment: valor } },
    })

    console.log(`✅ Pagamento aprovado! R$${valor} creditado para ${email}`)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('❌ Erro no webhook:', error)
    return NextResponse.json({ ok: false, error: 'Erro interno' }, { status: 500 })
  }
}
