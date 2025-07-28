import { prisma } from './prisma';
import { verificarCartelasVencedoras } from './verificarVencedor';
import { iniciarSorteioDeBolas } from './sortearBolas';
import { Server } from 'socket.io';

export async function iniciarSorteio(partidaId: number, io: Server) {
  const bolas = Array.from({ length: 75 }, (_, i) => i + 1);
  let index = 0;

  const intervalo = setInterval(async () => {
    const partida = await prisma.partida.findUnique({ where: { id: partidaId } });

    if (!partida || partida.finalizada || partida.encerrada || index >= bolas.length) {
      clearInterval(intervalo);
      return;
    }

    const numero = bolas[index];
    index++;

    await prisma.bola.create({
      data: {
        numero,
        ordem: index,
        partidaId,
      },
    });

    io.emit('numeroSorteado', numero);

    const vencedores = await verificarCartelasVencedoras(partidaId);

    if (vencedores.length > 0) {
      clearInterval(intervalo);
      await prisma.partida.update({
        where: { id: partidaId },
        data: {
          finalizada: true,
          encerrada: true,
        },
      });
    }
  }, 3000);
}
