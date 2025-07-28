import { prisma } from './prisma';

export async function criarNovaPartida() {
  const novaPartida = await prisma.partida.create({
    data: {
      inicio: new Date(),
      finalizada: false,
      aberta: true,
      encerrada: false,
    },
  });
  return novaPartida;
}
