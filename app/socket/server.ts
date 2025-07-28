import { createServer } from 'http';
import { Server } from 'socket.io';
import { iniciarLoopDePartidas } from '@/lib/startBingo';

const server = createServer();
const io = new Server(server, {
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  console.log('🎮 Novo jogador conectado');
});

// ✅ Passa o io corretamente
iniciarLoopDePartidas(io); // inicia o ciclo automático com socket.io

server.listen(4000, () => {
  console.log('🟢 Socket.IO rodando na porta 4000');
});
