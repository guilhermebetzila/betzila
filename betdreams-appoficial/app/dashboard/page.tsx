'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/context/AuthContext';
import LayoutWrapper from '@/components/LayoutWrapper';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [totalIndicados, setTotalIndicados] = useState<number>(0);

  useEffect(() => {
    const fetchIndicacoes = async () => {
      try {
        const res = await fetch('/api/user/indicacoes');
        const data = await res.json();
        if (res.ok) {
          setTotalIndicados(data.totalIndicados || 0);
        }
      } catch (error) {
        console.error('Erro ao buscar indicações:', error);
      }
    };

    if (user) fetchIndicacoes();
  }, [user]);

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  if (loading) {
    return <p className="text-center mt-10 text-white">Carregando...</p>;
  }

  if (!user) {
    return (
      <p className="text-center mt-10 text-red-500">
        Acesso negado. Faça login para continuar.
      </p>
    );
  }

  return (
    <LayoutWrapper>
      <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="flex items-center gap-4 mb-10">
          <img
            src={'/default-avatar.png'}
            alt="Avatar"
            className="w-20 h-20 rounded-full border-4 border-white shadow-md"
          />
          <div>
            <h1 className="text-3xl font-bold">Olá, {user.nome || user.email}</h1>
            <p className="text-gray-400 text-sm mt-1">Bem-vindo ao seu painel personalizado</p>
            <p className="text-yellow-400 mt-2">
              📢 Você já indicou <strong>{totalIndicados}</strong> pessoa(s)!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Button className="bg-gray-700 hover:bg-gray-800 text-white text-lg py-6 shadow">
            💰 Saldo: R$ {Number(user.saldo || 0).toFixed(2)}
          </Button>

          <Button onClick={() => router.push('/games/depositar')} className="bg-gray-700 hover:bg-gray-800 text-white text-lg py-6 shadow">
            📥 Depositar
          </Button>

          <Button onClick={() => router.push('/games/saque')} className="bg-gray-700 hover:bg-gray-800 text-white text-lg py-6 shadow">
            📤 Saque via Pix
          </Button>

          <Button className="bg-gray-700 hover:bg-gray-800 text-white text-lg py-6 shadow">
            ⚙️ Configurações
          </Button>

          <Button className="bg-gray-700 hover:bg-gray-800 text-white text-lg py-6 shadow">
            📄 Histórico
          </Button>

          <Button className="bg-gray-700 hover:bg-gray-800 text-white text-lg py-6 shadow">
            🆘 Suporte
          </Button>

          <Button onClick={() => router.push('/games/indicacao')} className="bg-gray-700 hover:bg-gray-800 text-white text-lg py-6 shadow">
            🔗 Link de Indicação
          </Button>

          <Button onClick={() => router.push('/games/jogo-da-velha')} className="bg-gray-700 hover:bg-gray-800 text-white text-lg py-6 shadow">
            #️⃣ Jogar Bingo
          </Button>

          <Button onClick={handleLogout} className="bg-black hover:bg-white border border-white hover:text-black text-white text-lg py-6 shadow">
            🚪 Sair
          </Button>
        </div>
      </div>
    </LayoutWrapper>
  );
}
