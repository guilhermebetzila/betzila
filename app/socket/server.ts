// app/scripts/socket/server.ts
import { createServer } from 'http';
import { Server } from 'socket.io';
import { iniciarLoopDePartidas } from '@/lib/startBingo'; // ✅ usando alias

const server = createServer();
const io = new Server(server, {
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  console.log('🎮 Novo jogador conectado:', socket.id);
});

iniciarLoopDePartidas(io); // Loop 24h automático

server.listen(4000, () => {
  console.log('🟢 Socket.IO rodando na porta 4000');
});
