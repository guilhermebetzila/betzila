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

    // Ignora notificações de modo de teste
    if (body.live_mode === false) {
      console.log('⚠️ Webhook em modo de teste ignorado (live_mode: false)')
      return NextResponse.json({ ok: true })
    }

    const paymentId = body.data?.id
    if (!paymentId) {
      console.warn('❌ ID do pagamento ausente na notificação')
      return NextResponse.json({ ok: true })
    }

    // Busca detalhes do pagamento
    let payment
    try {
      payment = await new Payment(client).get({ id: paymentId })
    } catch (err) {
      console.error('❌ Falha ao buscar pagamento no Mercado Pago:', err)
      return NextResponse.json({ ok: true }) // responde 200 para não gerar falha na entrega
    }

    console.log('📦 Detalhes do pagamento:', {
      status: payment.status,
      email: payment.metadata?.email,
      valor: payment.transaction_amount,
    })

    if (payment.status !== 'approved') {
      console.log('⏳ Pagamento ainda não aprovado. Ignorado.')
      return NextResponse.json({ ok: true })
    }

    const email = payment.metadata?.email
    const valor = Number(payment.transaction_amount)

    if (!email) {
      console.warn('❌ Email ausente no metadata do pagamento')
      return NextResponse.json({ ok: true })
    }

    // Atualiza saldo no banco
    await prisma.user.update({
      where: { email },
      data: { saldo: { increment: valor } },
    })

    console.log(`✅ Pagamento aprovado! R$${valor} creditado para ${email}`)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('❌ Erro geral no webhook:', error)
    return NextResponse.json({ ok: true }) // responde 200 para evitar falha no webhook
  }
}
