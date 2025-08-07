import { iniciarSorteioDeBolas } from './sortearBolas';
import { Server } from 'socket.io';

export async function loopAutomatico(partidaId: number, io: Server) {
  await iniciarSorteioDeBolas(partidaId, io);
}
