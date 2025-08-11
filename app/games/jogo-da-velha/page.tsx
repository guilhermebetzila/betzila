'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/context/AuthContext';
import socket from '@/lib/socketClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CartelaAoVivo from '@/components/CartelaAoVivo';
import BolasAoVivo from '@/components/BolasAoVivo';
import { VencedorUltimaPartida } from '@/components/VencedorUltimaPartida';
import CronometroProximaRodada from '@/components/CronometroProximaRodada';

interface Cartela {
  id: string;
  numeros: number[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export default function BingoPage() {
  const { user, loading } = useAuth();
  const [quantidade, setQuantidade] = useState(1);
  const [cartelas, setCartelas] = useState<Cartela[]>([]);
  const [numerosSorteados, setNumerosSorteados] = useState<number[]>([]);
  const [temCartela, setTemCartela] = useState(true);
  const [carregandoCartela, setCarregandoCartela] = useState(true);

  // 📡 Eventos do socket
  useEffect(() => {
    const onCartela = (novaCartela: Cartela) => {
      setCartelas(prev => [...prev, novaCartela]);
    };

    const onNumero = (numero: number) => {
      setNumerosSorteados(prev => [...prev, numero]);
    };

    const onResetar = () => {
      setCartelas([]);
      setNumerosSorteados([]);
    };

    socket.on('cartela', onCartela);
    socket.on('numeroSorteado', onNumero);
    socket.on('resetar', onResetar);

    return () => {
      socket.off('cartela', onCartela);
      socket.off('numeroSorteado', onNumero);
      socket.off('resetar', onResetar);
    };
  }, []);

  // ✅ Verifica se já tem cartela
  useEffect(() => {
    const verificarCartela = async () => {
      setCarregandoCartela(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/cartelas/minha`);
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

  // 📤 Compra de cartelas via socket
  const comprarCartelas = () => {
    if (quantidade > 0) {
      socket.emit('comprarCartelas', quantidade);
    }
  };

  // 💳 Fallback: compra via fetch
  const comprarCartela = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/cartelas/comprar`, {
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

  if (loading) {
    return <p className="text-center mt-10 text-white">Carregando jogo...</p>;
  }

  if (!user) {
    return (
      <p className="text-center mt-10 text-red-500 text-lg">
        Acesso negado. Faça login para jogar.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-black text-white flex flex-col items-center p-6">
      <h1 className="text-5xl font-extrabold mb-6 text-yellow-400 drop-shadow-lg">
        🎱 Bingo Multiplayer
      </h1>

      <div className="mb-6 text-center">
        <p className="text-lg">
          👤 <strong>{user.nome || user.email}</strong>
        </p>
        <p className="text-sm text-green-400 font-bold">
          💰 Saldo: R$ {Number(user.saldo || 0).toFixed(2)}
        </p>
      </div>

      <section className="bg-zinc-900 p-6 rounded-xl shadow-xl w-full max-w-md mb-8 border border-yellow-500">
        <label className="block mb-2 text-sm text-gray-300 font-semibold">
          Quantas cartelas deseja comprar? (R$1 cada)
        </label>
        <Input
          type="number"
          min={1}
          value={quantidade}
          onChange={(e) => setQuantidade(Number(e.target.value))}
          className="mb-2 bg-zinc-800 text-white border border-gray-600"
        />
        <p className="text-sm text-yellow-400 mb-4 font-mono">
          Total: <span className="font-bold">R${quantidade},00</span>
        </p>
        <Button
          onClick={comprarCartelas}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:brightness-110 transition-all text-white font-bold"
        >
          ➕ Comprar {quantidade === 1 ? 'Cartela' : `${quantidade} Cartelas`}
        </Button>
      </section>

      {!carregandoCartela && !temCartela && (
        <div className="mb-8">
          <Button
            onClick={comprarCartela}
            className="bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-4 shadow-md rounded-full"
          >
            🛒 Comprar Cartela
          </Button>
        </div>
      )}

      <section className="mt-10 w-full max-w-4xl px-4">
        <h2 className="text-2xl font-bold mb-4 text-yellow-300">🎟️ Sua Cartela ao Vivo</h2>
        <CartelaAoVivo />
      </section>

      <section className="mt-10 w-full max-w-4xl px-4">
        <h2 className="text-2xl font-bold mb-4 text-yellow-300">⚽ Bolas Sorteadas</h2>
        <BolasAoVivo />
      </section>

      <section className="mt-10 w-full max-w-2xl px-4">
        <VencedorUltimaPartida />
      </section>

      <section className="mt-10 w-full max-w-2xl px-4 mb-10">
        <CronometroProximaRodada />
      </section>
    </div>
  );
}
