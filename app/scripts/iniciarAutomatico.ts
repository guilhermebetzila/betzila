import { prisma } from '@/lib/prisma';
import { iniciarSorteioDeBolas } from '@/lib/sortearBolas';
import { Server } from 'socket.io';

async function iniciarPartida(io: Server) {
  try {
    const partidaExistente = await prisma.partida.findFirst({
      where: { finalizada: false },
    });

    if (partidaExistente) {
      console.log('[INFO] Já existe uma partida em andamento:', partidaExistente.id);
      return;
    }

    const novaPartida = await prisma.partida.create({
      data: {
        finalizada: false,
        aberta: true,
      },
    });

    console.log('[NOVA PARTIDA CRIADA]', novaPartida.id);

    // ⚠️ Corrigir: Passar `io` como segundo argumento
    iniciarSorteioDeBolas(novaPartida.id, io);

  } catch (erro: any) {
    console.error('[ERRO AO INICIAR PARTIDA]', erro);
  }
}

// ✅ Função exportada corretamente com o nome esperado no server.ts
export async function iniciarLoopDePartidas(io: Server) {
  while (true) {
    await iniciarPartida(io);
    console.log('[AGUARDANDO 2min30s PARA VERIFICAR NOVAMENTE...]');
    await new Promise(resolve => setTimeout(resolve, 150000));
  }
}
