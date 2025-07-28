// app/api/partida/nova/route.ts
import { NextResponse } from 'next/server';
import { Server } from 'socket.io';
import { iniciarAutomaticamente } from '@/lib/iniciarAutomatico';

let ioGlobal: Server | null = null;

export async function POST(req: Request) {
  try {
    // Se ainda não existe ioGlobal, inicializa
    if (!ioGlobal) {
      ioGlobal = new Server({
        cors: {
          origin: '*',
        },
      });
    }

    // Força o TypeScript a entender que ioGlobal NÃO é null
    const io = ioGlobal as Server;

    // Inicia a partida automática
    await iniciarAutomaticamente(io);

    return NextResponse.json({ mensagem: 'Partida iniciada com sucesso' });
  } catch (error) {
    console.error('[ERRO_NOVA_PARTIDA]', error);
    return NextResponse.json(
      { erro: 'Erro ao iniciar nova partida' },
      { status: 500 }
    );
  }
}
