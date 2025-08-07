import { prisma } from './prisma';
import { socket } from './socket';

export async function verificarCartelasVencedoras(partidaId: number) {
  const bolasSorteadas = await prisma.bola.findMany({
    where: { partidaId },
  });

  const numerosSorteados = bolasSorteadas.map(bola => bola.numero);

  const cartelas = await prisma.cartela.findMany({
    where: { partidaId },
    include: { numeros: true, user: true },
  });

  const cartelasVencedoras = cartelas.filter(cartela => {
    const numerosCartela = cartela.numeros.map(n => n.numero);
    return numerosCartela.every(num => numerosSorteados.includes(num));
  });

  if (cartelasVencedoras.length > 0) {
    const cartela = cartelasVencedoras[0];
    const numerosCartela = cartela.numeros.map(n => n.numero);

    await prisma.partida.update({
      where: { id: partidaId },
      data: {
        vencedoraId: cartela.id,
        finalizada: true,
        encerrada: true,
        aberta: false,
      },
    });

    socket.emit('vencedor', {
      nome: cartela.user?.nome || 'Jogador',
      cartelaId: cartela.id,
      numeros: numerosCartela,
    });
  }

  return cartelasVencedoras;
}
