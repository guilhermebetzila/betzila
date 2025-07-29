// app/lib/startBingo.ts
import { Server } from 'socket.io';
import { criarNovaPartida } from './criarPartida';
import { gerarCartelasParaPartida } from './utils';
import { iniciarSorteioDeBolas } from './sortearBolas';
import { verificarCartelasVencedoras } from './verificarVencedor';
import { finalizarPartida } from './finalizarPartida';

export async function iniciarLoopDePartidas(io: Server) {
  while (true) {
    console.log('🟢 Iniciando nova partida...');

    const partida = await criarNovaPartida();
    console.log(`🎮 Partida criada com ID: ${partida.id}`);

    await gerarCartelasParaPartida(partida.id);
    console.log(`🧾 Cartelas geradas para a partida ${partida.id}`);

    await new Promise((resolve) => setTimeout(resolve, 5000)); // Tempo de compra

    await iniciarSorteioDeBolas(partida.id, io); // Emite bolas

    const vencedoras = await verificarCartelasVencedoras(partida.id);
    const idsVencedores = vencedoras
      .filter((v: any) => v.user)
      .map((v: any) => v.user.id);

    io.emit('vencedores', idsVencedores); // Envia para todos
    console.log(`🏆 Vencedores:`, idsVencedores);

    await finalizarPartida(partida.id, io);

    io.emit('resetar'); // Notifica o front que vai reiniciar
    console.log(`🔚 Partida finalizada. Nova em breve...`);

    await new Promise((resolve) => setTimeout(resolve, 5000)); // Intervalo
  }
}
