import { sortearBola } from './sortearBolas';
import { prisma } from './prisma';

export async function iniciarSorteioContinuo() {
  const partida = await prisma.partida.findFirst({
    where: { aberta: true, finalizada: false },
  });

  if (!partida) return;

  const intervalo = setInterval(async () => {
    await sortearBola(partida.id);
  }, 5000); // a cada 5 segundos

  return intervalo;
}
