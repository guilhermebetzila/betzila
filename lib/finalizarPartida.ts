import { prisma } from './prisma';

export async function finalizarPartida(partidaId: number, io?: any) {
  await prisma.partida.update({
    where: { id: partidaId },
    data: {
      finalizada: true,
      encerrada: true,
      aberta: false,
      fim: new Date(),
    },
  });

  if (io) {
    io.emit('partidaFinalizada', partidaId);
  }
}
