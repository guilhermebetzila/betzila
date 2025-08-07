'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Numero {
  id: number;
  numero: number;
}

interface Cartela {
  id: number;
  numeros: Numero[];
  venceu: boolean;
}

export default function MinhasCartelas() {
  const [cartelas, setCartelas] = useState<Cartela[]>([]);
  const [loading, setLoading] = useState(true);

  const buscarCartelas = async () => {
    try {
      const res = await axios.get('/api/cartelas/minhas');
      setCartelas(res.data.cartelas);
    } catch (error) {
      console.error('Erro ao buscar cartelas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarCartelas();
    const intervalo = setInterval(buscarCartelas, 5000); // Atualiza a cada 5s
    return () => clearInterval(intervalo);
  }, []);

  if (loading) return <p>Carregando cartelas...</p>;
  if (cartelas.length === 0) return <p>Você ainda não tem cartelas nesta partida.</p>;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-2">🎫 Suas Cartelas</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cartelas.map((cartela) => (
          <div
            key={cartela.id}
            className={`p-4 rounded-lg shadow-md border ${
              cartela.venceu ? 'bg-green-100 border-green-500' : 'bg-white'
            }`}
          >
            <h3 className="font-semibold mb-2">
              Cartela #{cartela.id}{' '}
              {cartela.venceu && <span className="text-green-700">🏆 Vencedora!</span>}
            </h3>
            <div className="flex flex-wrap gap-2">
              {cartela.numeros.map((num) => (
                <span
                  key={num.id}
                  className="w-8 h-8 flex items-center justify-center bg-blue-200 rounded-full font-bold"
                >
                  {num.numero}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
