import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('📩 Webhook recebido:', JSON.stringify(body, null, 2))

    if (body.type !== 'payment') {
      console.log('🔕 Notificação ignorada (não é pagamento)')
      return NextResponse.json({ ok: true })
    }

    // Opcional: remova ou comente esta parte para testes sandbox
    if (body.live_mode === false) {
      console.log('⚠️ Webhook sandbox ignorado (live_mode: false)')
      return NextResponse.json({ ok: true })
    }

    const paymentId = body.data?.id
    if (!paymentId) {
      console.warn('❌ ID do pagamento ausente na notificação')
      return NextResponse.json({ ok: true })
    }

    let payment
    try {
      payment = await new Payment(client).get({ id: paymentId })
    } catch (err) {
      console.error('❌ Erro ao buscar pagamento no Mercado Pago:', err)
      return NextResponse.json({ ok: true }) // evitar falha na entrega
    }

    console.log('📦 Dados do pagamento:', {
      status: payment.status,
      email: payment.metadata?.email,
      valor: payment.transaction_amount,
    })

    if (payment.status !== 'approved') {
      console.log('⏳ Pagamento não aprovado ainda, ignorando')
      return NextResponse.json({ ok: true })
    }

    const email = payment.metadata?.email
    const valor = Number(payment.transaction_amount)

    if (!email) {
      console.warn('❌ Email ausente no metadata do pagamento')
      return NextResponse.json({ ok: true })
    }

    try {
      const userUpdated = await prisma.user.update({
        where: { email },
        data: { saldo: { increment: valor } },
      })
      console.log(`✅ Saldo atualizado para ${email}: +R$${valor}`)
    } catch (prismaError) {
      console.error('❌ Erro ao atualizar saldo no banco:', prismaError)
      // mesmo assim retornamos ok para Mercado Pago não tentar de novo
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('❌ Erro geral no webhook:', error)
    return NextResponse.json({ ok: true }) // evitar falha no webhook
  }
}
