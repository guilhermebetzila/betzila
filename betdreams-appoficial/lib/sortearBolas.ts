import { Server } from 'socket.io';
import { prisma } from './prisma';
import { embaralharArray } from './utils';

export async function iniciarSorteioDeBolas(partidaId: number, io: Server) {
  const bolas = embaralharArray(Array.from({ length: 75 }, (_, i) => i + 1));

  for (let i = 0; i < bolas.length; i++) {
    const numero = bolas[i];

    await prisma.bola.create({
      data: {
        numero,
        ordem: i + 1,
        partidaId,
      },
    });

    io.emit('numeroSorteado', numero);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}
