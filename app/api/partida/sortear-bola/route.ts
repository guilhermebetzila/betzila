import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const partida = await prisma.partida.findFirst({
      where: { aberta: true, finalizada: false },
      include: { bolas: true, cartelas: { include: { numeros: true } } },
    });

    if (!partida) {
      return NextResponse.json({ message: 'Nenhuma partida ativa.' }, { status: 400 });
    }

    const bolasSorteadas = partida.bolas.map(b => b.numero);
    const todasBolas = Array.from({ length: 75 }, (_, i) => i + 1);
    const bolasDisponiveis = todasBolas.filter(n => !bolasSorteadas.includes(n));

    if (bolasDisponiveis.length === 0) {
      return NextResponse.json({ message: 'Todas as bolas já foram sorteadas.' }, { status: 400 });
    }

    const novaBola = bolasDisponiveis[Math.floor(Math.random() * bolasDisponiveis.length)];

    await prisma.bola.create({
      data: {
        numero: novaBola,
        ordem: bolasSorteadas.length + 1,
        partidaId: partida.id,
      },
    });

    const novasBolas = [...bolasSorteadas, novaBola];

    // Verificar vitória
    for (const cartela of partida.cartelas) {
      const numerosCartela = cartela.numeros.map(n => n.numero);
      const venceu = numerosCartela.every(n => novasBolas.includes(n));

      if (venceu) {
        await prisma.cartela.update({
          where: { id: cartela.id },
          data: { venceu: true },
        });

        await prisma.partida.update({
          where: { id: partida.id },
          data: {
            finalizada: true,
            aberta: false,
            encerrada: true,
            vencedoraId: cartela.id,
            fim: new Date(),
          },
        });

        return NextResponse.json({ message: 'Partida encerrada. Temos um vencedor!', vencedor: cartela.id });
      }
    }

    return NextResponse.json({ message: 'Bola sorteada com sucesso!', numero: novaBola });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao sortear bola.' }, { status: 500 });
  }
}
