// app/api/partida/nova/route.ts
import { NextResponse } from 'next/server'
import { Server } from 'socket.io'
import { iniciarSorteio } from '@/lib/iniciarAutomatico'  // corrigido o nome da função

let ioGlobal: Server | null = null

export async function POST(req: Request) {
  try {
    if (!ioGlobal) {
      ioGlobal = new Server({
        cors: {
          origin: '*',
        },
      })
    }

    const io = ioGlobal as Server

    const body = await req.json()
    const partidaId = body.partidaId  // assumindo que partidaId vem no corpo da requisição

    await iniciarSorteio(partidaId, io)  // usar o nome correto e passar o id

    return NextResponse.json({ mensagem: 'Partida iniciada com sucesso' })
  } catch (error) {
    console.error('[ERRO_NOVA_PARTIDA]', error)
    return NextResponse.json(
      { erro: 'Erro ao iniciar nova partida' },
      { status: 500 }
    )
  }
}
