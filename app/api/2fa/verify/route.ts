import { NextRequest, NextResponse } from 'next/server'
import speakeasy from 'speakeasy'

export async function POST(req: NextRequest) {
  try {
    const { token, secret } = await req.json()

    if (!token || !secret) {
      return NextResponse.json({ success: false, error: 'Token ou segredo ausente.' }, { status: 400 })
    }

    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1, // permite uma pequena margem de erro no tempo
    })

    if (!verified) {
      return NextResponse.json({ success: false, error: 'Código 2FA inválido.' }, { status: 401 })
    }

    return NextResponse.json({ success: true, message: 'Código 2FA verificado com sucesso!' })
  } catch (error) {
    console.error('Erro ao verificar código 2FA:', error)
    return NextResponse.json({ success: false, error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
