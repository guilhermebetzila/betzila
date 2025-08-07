// app/api/iniciar/route.ts
import { NextResponse } from 'next/server'
import { loopAutomatico } from '@/lib/loopAutomatico'

export async function GET() {
  loopAutomatico()
  return NextResponse.json({ ok: true, status: 'Loop iniciado' })
}
