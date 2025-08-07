import { Server } from 'socket.io';
import { prisma } from './prisma';
import { verificarCartelasVencedoras } from './verificarVencedor';

export async function finalizarPartida(partidaId: number, io: Server): Promise<boolean> {
  const cartelasVencedoras = await verificarCartelasVencedoras(partidaId);

  if (cartelasVencedoras.length > 0) {
    await prisma.partida.update({
      where: { id: partidaId },
      data: {
        finalizada: true,
        encerrada: true,
        vencedoraId: cartelasVencedoras[0].id,
      },
    });

    io.emit('partidaFinalizada', cartelasVencedoras[0]);
    return true;
  }

  return false;
}
