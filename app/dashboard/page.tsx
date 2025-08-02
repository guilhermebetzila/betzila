'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/context/AuthContext';
import LayoutWrapper from '@/components/LayoutWrapper';
import IAWorkingPanel from '@/components/IAWorkingPanel';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

const menuItems = [
  { label: '📥 Depositar', action: '/games/depositar' },
  { label: '📤 Saque via Pix', action: '/games/saque' },
  { label: '#️⃣ Jogar Bingo', action: '/games/jogo-da-velha' },
  { label: '🚪 Sair', action: 'logout' },
];

const nomesFicticios = [
  'Ana Clara', 'Bruno Silva', 'Carlos Eduardo', 'Daniela Souza', 'Eduardo Lima',
  'Fernanda Rocha', 'Gabriel Santos', 'Helena Costa', 'Igor Alves', 'Juliana Castro',
  'Kauan Ferreira', 'Larissa Oliveira', 'Marcelo Dias', 'Natalia Gomes', 'Otávio Ramos',
  'Paula Martins', 'Rafael Teixeira', 'Simone Silva', 'Thiago Mendes', 'Vanessa Moreira',
];

function gerarSaquesAleatorios(qtd = 1000) {
  const saques = [];
  for (let i = 0; i < qtd; i++) {
    const nome = nomesFicticios[Math.floor(Math.random() * nomesFicticios.length)];
    const valor = (Math.random() * (2000 - 300) + 300).toFixed(2);
    saques.push(`💸 ${nome} sacou R$ ${valor}`);
  }
  return saques;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [totalIndicados, setTotalIndicados] = useState<number>(0);
  const [search, setSearch] = useState('');
  const [saldo, setSaldo] = useState<number>(0);
  const [saques, setSaques] = useState<string[]>([]);

  useEffect(() => {
    setSaques(gerarSaquesAleatorios());

    const fetchIndicacoes = async () => {
      try {
        const res = await fetch('/api/user/indicacoes');
        const data = await res.json();
        if (res.ok) setTotalIndicados(data.totalIndicados || 0);
      } catch (error) {
        console.error('Erro ao buscar indicações:', error);
      }
    };

    const fetchSaldo = async () => {
      try {
        const res = await fetch('/api/saldo');
        const data = await res.json();
        if (res.ok) setSaldo(data.saldo || 0);
      } catch (error) {
        console.error('Erro ao buscar saldo:', error);
      }
    };

    if (user) {
      fetchIndicacoes();
      fetchSaldo();
    }
  }, [user]);

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (item.action === 'logout') {
      signOut({ callbackUrl: '/login' });
    } else if (item.action) {
      router.push(item.action);
    }
  };

  if (loading) return <p className="text-center mt-10 text-white">Carregando...</p>;
  if (!user) return <p className="text-center mt-10 text-red-500">Acesso negado. Faça login para continuar.</p>;

  const pontos = totalIndicados * 10; // Exemplo: 10 pontos por indicação
  const progresso = Math.min((pontos / 1000) * 100, 100);

  return (
    <LayoutWrapper>
      <div className="min-h-screen px-4 py-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-4">
            Olá, {user.nome || user.email}
            <span className="bg-green-400 text-black px-3 py-1 text-sm rounded shadow-sm font-semibold">
              Saldo: R$ {saldo.toFixed(2)}
            </span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Bem-vindo ao seu painel personalizado</p>
          <p className="text-green-400 mt-2">
            📢 Você já indicou <strong>{totalIndicados}</strong> pessoa(s)!
          </p>
          <div className="mt-4">
            <p className="text-sm text-gray-300 mb-1">🎁 Pontos Acumulados: {pontos} pontos</p>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div className="bg-green-400 h-4 rounded-full" style={{ width: `${progresso}%` }}></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Você precisa de 1000 pontos para desbloquear o próximo prêmio</p>
          </div>
        </div>

           {/* Barra de Pontuação Acumulada */}
        <div className="mb-6 max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-inner p-4 border-2 border-green-400">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold text-sm">🎁 Pontos Acumulados</span>
            <span className="text-green-400 font-bold text-sm">1240 pts</span>
          </div>
          <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden">
            <div
              className="bg-green-400 h-4"
              style={{ width: `62%` }} // Simulando progresso até a próxima recompensa
            ></div>
          </div>
          <p className="text-gray-300 text-xs mt-2">
            Faltam <span className="text-green-400 font-semibold">760 pts</span> para desbloquear o <strong>App Exclusivo BetZila!</strong>
          </p>
        </div>

        <div className="mb-6"><IAWorkingPanel /></div>

        {/* Seção de Prova Social */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-center text-white mb-4">🎯 Prova Social: Saques Recentes</h3>
          <div className="bg-gray-800 rounded-xl p-4 max-h-40 overflow-y-auto shadow-inner border border-green-400">
            <ul className="space-y-1 text-sm text-green-300 font-mono">
              {saques.slice(0, 20).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-6 mb-12">
          <div className="bg-gray-800 border-2 border-green-400 rounded-2xl p-6 w-72 text-center">
            <p className="text-sm text-green-400 mb-2 font-bold">Saldo Diário</p>
            <p className="text-2xl font-semibold text-white">R$ 00,00</p>
          </div>
          <div className="bg-gray-800 border-2 border-green-400 rounded-2xl p-6 w-72 text-center">
            <p className="text-sm text-green-400 mb-2 font-bold">Rede de Indicações</p>
            <p className="text-2xl font-semibold text-white">{totalIndicados}</p>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={() => router.push('/games/investir')}
            className="bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-6 rounded-full shadow-xl transition-all text-lg"
          >
            💹 Investir Agora
          </button>
        </div>

        <footer className="w-full mt-20 bg-gray-900 text-white py-12 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">APOSTE</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Indicação</li>
                <li>Jogo da Velha</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">LINKS ÚTEIS</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Comunidade</li>
                <li>Promoções</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">REGRAS</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Termos e Condições</li>
                <li>Jogo Responsável</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">SUPORTE</h3>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>📚 Central de Ajuda</li>
                <li>📞 0800 00 4546</li>
                <li>📧 suporte@betdreams.com</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </LayoutWrapper>
  );
}