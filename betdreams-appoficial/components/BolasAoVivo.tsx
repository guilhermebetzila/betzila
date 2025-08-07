'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket;

export default function BolasAoVivo() {
  const [numerosSorteados, setNumerosSorteados] = useState<number[]>([]);

  useEffect(() => {
    const fetchBolas = async () => {
      try {
        const res = await fetch('/api/partida/bolasSorteadas');
        if (!res.ok) throw new Error('Erro ao buscar bolas sorteadas');
        const data = await res.json();

        // ✅ Verifica se é array válido
        if (!Array.isArray(data)) throw new Error('Resposta inesperada do servidor');

        const numeros = data.map((bola: { numero: number }) => bola.numero);
        setNumerosSorteados(numeros);
      } catch (err) {
        console.error('Erro no fetch inicial das bolas:', err);
      }
    };

    fetchBolas();

    socket = io('http://localhost:4000');

    socket.on('numeroSorteado', (numero: number) => {
      setNumerosSorteados((prev) =>
        prev.includes(numero) ? prev : [...prev, numero]
      );
    });

    socket.on('resetar', () => {
      setNumerosSorteados([]);
    });

    return () => {
      socket.off('numeroSorteado');
      socket.off('resetar');
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-white rounded-md shadow-md min-h-[60px]">
      {numerosSorteados.length === 0 ? (
        <p className="text-gray-500">Nenhuma bola sorteada ainda.</p>
      ) : (
        numerosSorteados.map((numero, idx) => (
          <div
            key={idx}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-400 text-black font-bold text-sm"
          >
            {numero}
          </div>
        ))
      )}
    </div>
  );
}
