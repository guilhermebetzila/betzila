import { Server } from 'socket.io';
import { prisma } from './prisma';

export async function sortearBola(partidaId: number) {
  const bolasSorteadas = await prisma.bola.findMany({
    where: { partidaId },
  });

  const bolasRestantes = Array.from({ length: 75 }, (_, i) => i + 1).filter(
    (numero) => !bolasSorteadas.map((b) => b.numero).includes(numero)
  );

  if (bolasRestantes.length === 0) return;

  const numeroSorteado = bolasRestantes[Math.floor(Math.random() * bolasRestantes.length)];

  await prisma.bola.create({
    data: {
      numero: numeroSorteado,
      ordem: bolasSorteadas.length + 1,
      partidaId,
    },
  });

  console.log(`🔵 Bola sorteada: ${numeroSorteado}`);
}

// ✅ ESTA É A FUNÇÃO QUE VOCÊ IMPORTA NO startBingo.ts
export async function iniciarSorteioDeBolas(partidaId: number, io: Server) {
  for (let i = 0; i < 75; i++) {
    await sortearBola(partidaId);

    // Emite a última bola sorteada para todos os clientes conectados
    const ultimaBola = await prisma.bola.findFirst({
      where: { partidaId },
      orderBy: { ordem: 'desc' },
    });

    if (ultimaBola) {
      io.emit('numeroSorteado', ultimaBola.numero);
    }

    // Aguarda 3 segundos antes de sortear a próxima bola
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
}
