import { prisma } from './prisma';
import { gerarNumerosUnicos } from './utils';

export async function criarPartida() {
  const partida = await prisma.partida.create({
    data: {
      aberta: true,
      encerrada: false,
      finalizada: false,
    },
  });

  const usuarios = await prisma.user.findMany();

  for (const user of usuarios) {
    const cartela = await prisma.cartela.create({
      data: {
        partidaId: partida.id,
        userId: user.id,
      },
    });

    const numeros = gerarNumerosUnicos(15, 1, 75);
    for (const numero of numeros) {
      await prisma.numeroCartela.create({
        data: {
          numero,
          cartelaId: cartela.id,
        },
      });
    }
  }

  return partida;
}
