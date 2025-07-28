import { prisma } from './prisma';

export async function verificarCartelasVencedoras(partidaId: number) {
  const bolasSorteadas = await prisma.bola.findMany({
    where: { partidaId },
    orderBy: { ordem: 'asc' },
  });

  const numerosSorteados = bolasSorteadas.map((b) => b.numero);

  const cartelas = await prisma.cartela.findMany({
    where: { partidaId },
    include: { numeros: true, user: true },
  });

  const vencedoras = cartelas.filter((cartela) =>
    cartela.numeros.every((n) => numerosSorteados.includes(n.numero))
  );

  return vencedoras ?? []; // ✅ evitar erro de null
}
