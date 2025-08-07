import { Server } from 'socket.io';
import { criarPartida } from './criarPartida';
import { iniciarSorteioDeBolas } from './sortearBolas';
import { verificarCartelasVencedoras } from './verificarVencedor';
import { finalizarPartida } from './finalizarPartida';

export async function iniciarLoopDePartidas(io: Server) {
  while (true) {
    const partida = await criarPartida();
    io.emit('novaPartida', partida);

    await new Promise(res => setTimeout(res, 2000));

    await iniciarSorteioDeBolas(partida.id, io);

    await new Promise(res => setTimeout(res, 3000));

    const vencedoras = await verificarCartelasVencedoras(partida.id);

    const idsVencedores = vencedoras
      .filter(v => v.user !== null && v.user !== undefined)
      .map(v => v.user!.id);

    await finalizarPartida(partida.id, io);
  }
}
