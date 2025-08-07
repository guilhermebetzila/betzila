import { createServer } from 'http';
import { Server } from 'socket.io';
import { iniciarLoopDePartidas } from '../scripts/iniciarAutomatico';

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('Novo cliente conectado:', socket.id);
});

httpServer.listen(4000, () => {
  console.log('Servidor Socket.IO ouvindo na porta 4000');
});

// ✅ Corrigir nome da função e tipar o erro
iniciarLoopDePartidas(io).catch((erro: any) => {
  console.error('Erro ao iniciar loop de partidas:', erro);
});
