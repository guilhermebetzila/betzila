'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000'); // altere se usar outro host

interface Vencedor {
  nome: string;
  numeros: number[];
}

export function VencedorUltimaPartida() {
  const [vencedor, setVencedor] = useState<Vencedor | null>(null);

  useEffect(() => {
    // Escutar o socket para receber o vencedor ao vivo
    socket.on('vencedor', (dados: Vencedor) => {
      console.log('🎉 Vencedor recebido via socket:', dados);
      setVencedor(dados);
    });

    // Cleanup para evitar múltiplas escutas
    return () => {
      socket.off('vencedor');
    };
  }, []);

  if (!vencedor) {
    return <div className="text-center text-gray-400">Nenhum vencedor encontrado ainda.</div>;
  }

  return (
    <div className="text-center mt-4 bg-green-100 p-4 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-2">🏆 Último Vencedor 🏆</h2>
      <p className="text-lg">Nome: <strong>{vencedor.nome}</strong></p>
      <p>Números: {vencedor.numeros.join(', ')}</p>
    </div>
  );
}
