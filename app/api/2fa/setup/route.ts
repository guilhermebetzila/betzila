import { NextResponse } from 'next/server'
import speakeasy from 'speakeasy'

export async function GET() {
  const secret = speakeasy.generateSecret({
    name: 'BetZila (2FA)', // Nome que aparecerá no app autenticador
    length: 20,
  })

  return NextResponse.json({
    secret: secret.base32, // só o código secreto
  })
}
