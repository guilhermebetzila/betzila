'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket;

export default function BolasAoVivo() {
  const [numerosSorteados, setNumerosSorteados] = useState<number[]>([]);
  const [vencedores, setVencedores] = useState<string[]>([]);

  useEffect(() => {
    const fetchBolas = async () => {
      try {
        const res = await fetch('/api/partida/bolasSorteadas');
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Resposta inválida');

        const numeros = data.map((b: { numero: number }) => b.numero);
        setNumerosSorteados(numeros);
      } catch (err) {
        console.error('Erro ao buscar bolas:', err);
      }
    };

    fetchBolas();

    socket = io('http://localhost:4000', {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => console.log('🔌 Conectado ao servidor'));
    socket.on('disconnect', () => console.log('❌ Desconectado'));

    socket.on('numeroSorteado', (numero: number) => {
      setNumerosSorteados((prev) =>
        prev.includes(numero) ? prev : [...prev, numero]
      );
    });

    socket.on('resetar', () => {
      setNumerosSorteados([]);
      setVencedores([]);
    });

    socket.on('vencedores', (ids: string[]) => {
      setVencedores(ids);
      console.log('🏆 IDs dos vencedores:', ids);
    });

    return () => {
      socket.off('numeroSorteado');
      socket.off('resetar');
      socket.off('vencedores');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <div className="p-4 space-y-4 bg-white rounded shadow-md">
      <div className="flex flex-wrap gap-2 min-h-[60px]">
        {numerosSorteados.length === 0 ? (
          <p className="text-gray-500">Aguardando bolas sorteadas...</p>
        ) : (
          numerosSorteados.map((n, idx) => (
            <div
              key={idx}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-400 text-black font-bold"
            >
              {n}
            </div>
          ))
        )}
      </div>

      {vencedores.length > 0 && (
        <div className="text-green-600 font-semibold">
          Vencedores: {vencedores.join(', ')}
        </div>
      )}
    </div>
  );
}
