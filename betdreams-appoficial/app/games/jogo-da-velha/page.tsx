'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/context/AuthContext';
import { io, Socket } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CartelaAoVivo from '@/components/CartelaAoVivo';
import BolasAoVivo from '@/components/BolasAoVivo';
import { VencedorUltimaPartida } from '@/components/VencedorUltimaPartida';
import CronometroProximaRodada from '@/components/CronometroProximaRodada';

const socket: Socket = io('http://localhost:4000'); // Altere para produção se necessário

interface Cartela {
  id: string;
  numeros: number[];
}

export default function BingoPage() {
  const { user, loading } = useAuth();
  const [quantidade, setQuantidade] = useState(1);
  const [cartelas, setCartelas] = useState<Cartela[]>([]);
  const [numerosSorteados, setNumerosSorteados] = useState<number[]>([]);
  const [temCartela, setTemCartela] = useState(true);
  const [carregandoCartela, setCarregandoCartela] = useState(true);

  // 📡 Conexão e escuta dos eventos do socket
  useEffect(() => {
    socket.on('cartela', (novaCartela: Cartela) => {
      setCartelas(prev => [...prev, novaCartela]);
    });

    socket.on('numeroSorteado', (numero: number) => {
      setNumerosSorteados(prev => [...prev, numero]);
    });

    socket.on('resetar', () => {
      setCartelas([]);
      setNumerosSorteados([]);
    });

    return () => {
      socket.off('cartela');
      socket.off('numeroSorteado');
      socket.off('resetar');
    };
  }, []);

  // ✅ Verifica se o usuário já tem cartela nesta rodada
  useEffect(() => {
    const verificarCartela = async () => {
      setCarregandoCartela(true);
      try {
        const res = await fetch('/api/cartelas/minha');
        const data = await res.json();
        setTemCartela(!!data?.cartela);
      } catch (error) {
        console.error('Erro ao verificar cartela:', error);
        setTemCartela(true);
      } finally {
        setCarregandoCartela(false);
      }
    };

    if (user) verificarCartela();
  }, [user]);

  // 📤 Envia pedido de compra de cartelas via socket
  const comprarCartelas = () => {
    if (quantidade > 0) {
      socket.emit('comprarCartelas', quantidade);
    }
  };

  // 💳 Fallback: compra via fetch se não tiver nenhuma cartela
  const comprarCartela = async () => {
    try {
      const res = await fetch('/api/cartelas/comprar', {
        method: 'POST',
      });

      if (res.ok) {
        setTemCartela(true);
        alert('Cartela comprada com sucesso!');
      } else {
        const data = await res.json();
        alert(data.message || 'Erro ao comprar cartela.');
      }
    } catch (error) {
      console.error('Erro ao comprar cartela:', error);
      alert('Erro ao comprar cartela.');
    }
  };

  // ❌ Removido: chamada para sortearBola e intervalo automático

  if (loading) {
    return <p className="text-center mt-10 text-white">Carregando jogo...</p>;
  }

  if (!user) {
    return (
      <p className="text-center mt-10 text-red-500">
        Acesso negado. Faça login para jogar.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6 text-yellow-300 animate-pulse">
        🎱 Jogo do Bingo Multiplayer
      </h1>

      <p className="mb-4 text-lg text-center text-white">
        👤 Jogador: <strong>{user.nome || user.email}</strong> — 💰 Saldo: R$ {Number(user.saldo || 0).toFixed(2)}
      </p>

      {/* Área de compra via socket */}
      <section className="bg-zinc-800 p-6 rounded-lg shadow-lg w-full max-w-md mb-8">
        <label className="block mb-2 text-sm text-gray-300">
          Quantas cartelas deseja comprar? (R$1 cada)
        </label>
        <Input
          type="number"
          min={1}
          value={quantidade}
          onChange={(e) => setQuantidade(Number(e.target.value))}
          className="mb-2"
        />
        <p className="text-sm text-yellow-400 mb-4 font-mono">
          Total: R${quantidade},00
        </p>
        <Button
          onClick={comprarCartelas}
          className="w-full bg-green-600 hover:bg-green-700 transition-all"
        >
          ➕ Comprar {quantidade === 1 ? 'Cartela' : `${quantidade} Cartelas`}
        </Button>
      </section>

      {/* Botão alternativo se o usuário ainda não tiver cartela */}
      {!carregandoCartela && !temCartela && (
        <div className="mb-8">
          <Button
            onClick={comprarCartela}
            className="bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-4 shadow-md"
          >
            🛒 Comprar Cartela
          </Button>
        </div>
      )}

      {/* Cartela ao Vivo */}
      <section className="mt-10 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4 text-yellow-300">🎟️ Sua Cartela ao Vivo</h2>
        <CartelaAoVivo />
      </section>

      {/* Bolas sorteadas */}
      <section className="mt-10 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4 text-yellow-300">⚽ Bolas Sorteadas</h2>
        <BolasAoVivo />
      </section>

      {/* Último vencedor */}
      <section className="mt-10 w-full max-w-2xl">
        <VencedorUltimaPartida />
      </section>

      {/* Cronômetro */}
      <section className="mt-10 w-full max-w-2xl">
        <CronometroProximaRodada />
      </section>
    </div>
  );
}
