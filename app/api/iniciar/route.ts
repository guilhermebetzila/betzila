// app/api/iniciar/route.ts
import { NextResponse } from 'next/server'
import { iniciarSorteioContinuo } from '@/lib/loopAutomatico'  // corrigido o nome da função

export async function GET() {
  try {
    await iniciarSorteioContinuo()   // usar o nome correto da função
    return NextResponse.json({ ok: true, status: 'Loop iniciado' })
  } catch (error) {
    console.error('[ERRO_LOOP_INICIADO]', error)
    return NextResponse.json({ ok: false, status: 'Erro ao iniciar loop' }, { status: 500 })
  }
}
