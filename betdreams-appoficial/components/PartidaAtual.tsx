'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Bola {
  id: number;
  numero: number;
  ordem: number;
}

interface Partida {
  id: number;
  inicio: string;
  finalizada: boolean;
  bolasSorteadas: Bola[];
}

export default function PartidaAtual() {
  const [partida, setPartida] = useState<Partida | null>(null);
  const [loading, setLoading] = useState(true);

  const buscarPartidaAtual = async () => {
    try {
      const res = await axios.get('/api/partida/atual');
      setPartida(res.data.partida);
    } catch (error) {
      console.error('Erro ao buscar partida:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarPartidaAtual();

    // Atualiza a cada 5 segundos
    const intervalo = setInterval(buscarPartidaAtual, 5000);
    return () => clearInterval(intervalo);
  }, []);

  if (loading) return <p>🔄 Carregando partida...</p>;
  if (!partida) return <p>❌ Nenhuma partida em andamento.</p>;

  return (
    <div className="p-4 rounded-xl bg-white shadow-md text-center">
      <h2 className="text-xl font-bold mb-4 text-gray-700">
        Partida #{partida.id}
      </h2>

      <p className="text-sm text-gray-500 mb-2">
        Iniciada em: {new Date(partida.inicio).toLocaleString()}
      </p>

      <h3 className="text-lg font-semibold mt-4 text-gray-600">Bolas sorteadas:</h3>

      <div className="flex flex-wrap gap-2 justify-center mt-2">
        {partida.bolasSorteadas
          .sort((a, b) => a.ordem - b.ordem)
          .map((bola) => (
            <div
              key={bola.id}
              className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow"
            >
              {bola.numero}
            </div>
          ))}
      </div>
    </div>
  );
}
