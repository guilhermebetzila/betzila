'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/context/AuthContext';
import LayoutWrapper from '@/components/LayoutWrapper';
import IAWorkingPanel from '@/components/IAWorkingPanel';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

const menuItems = [
  { label: '💰 Saldo', action: null },
  { label: '📥 Depositar', action: '/games/depositar' },
  { label: '📤 Saque via Pix', action: '/games/saque' },
  { label: '⚙️ Configurações', action: null },
  { label: '📄 Histórico', action: null },
  { label: '🆘 Suporte', action: null },
  { label: '🔗 Indicação', action: '/games/indicacao' },
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

  const handleMenuClick = (item: any) => {
    if (item.action === 'logout') {
      signOut({ callbackUrl: '/login' });
    } else if (item.action) {
      router.push(item.action);
    }
  };

  if (loading) return <p className="text-center mt-10 text-white">Carregando...</p>;
  if (!user) return <p className="text-center mt-10 text-red-500">Acesso negado. Faça login para continuar.</p>;

  return (
    <LayoutWrapper>
      <div className="min-h-screen px-4 py-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        
        {/* IA trabalhando acima da mensagem de boas-vindas */}
        <IAWorkingPanel />

        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-4">
            Olá, {user.nome || user.email}
            <span className="bg-yellow-400 text-black px-3 py-1 text-sm rounded shadow-sm font-semibold">
              Saldo: R$ {saldo.toFixed(2)}
            </span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Bem-vindo ao seu painel personalizado</p>
          <p className="text-yellow-400 mt-2">
            📢 Você já indicou <strong>{totalIndicados}</strong> pessoa(s)!
          </p>
        </div>

        <div className="mb-6 flex flex-col items-center space-y-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Buscar jogos ou provedores..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center cursor-pointer w-16"
                onClick={() => handleMenuClick(item)}
              >
                <div className="w-12 h-12 bg-gray-800 border-2 border-yellow-400 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                  <span className="text-xl">{item.label.split(' ')[0]}</span>
                </div>
                <span className="text-[10px] mt-1 text-center text-white leading-tight">
                  {item.label.split(' ').slice(1).join(' ')}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-gray-900 text-white p-6 rounded-xl max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">🚀 Bem-vindo à BetZila AI</h2>
            <p className="mb-2">Seja bem-vindo à IA mais audaciosa e inovadora do mercado.</p>
            <p className="mb-2">Após anos de estudos, pesquisas e acompanhamento minucioso dos principais setores econômicos, finalmente reunimos as mentes mais brilhantes para trabalhar por você.</p>
            <p className="mb-2">A era da Inteligência Artificial a seu favor começa agora.</p>
            <p className="mb-2">Faça parte de um ecossistema revolucionário, onde seu capital pode render <strong>2,5% ao dia</strong>, com segurança, estratégia e tecnologia.</p>
            <p className="mb-2">💰 E lembre-se: os <strong>juros compostos</strong> são o segredo das grandes riquezas — e agora estão ao seu alcance.</p>
            <p className="mb-2">🧬 Nosso sistema também recompensa a sua rede:</p>
            <ul className="text-sm text-gray-300 mb-4">
              <li>1ª geração de indicação: 10%</li>
              <li>2ª geração: 5%</li>
              <li>3ª geração: 2,5%</li>
            </ul>
            <p className="font-semibold text-green-400">Transforme sua vida com a força da Inteligência Artificial.<br />Comece agora com a BetZila AI.</p>
          </div>
        </div>

        {/* Quadrados */}
        <div className="flex flex-col items-center space-y-6 mb-12">
          <div className="bg-gray-800 border-2 border-red-600 rounded-2xl p-6 w-72 text-center">
            <p className="text-sm text-red-500 mb-2 font-bold">Saldo Diário</p>
            <p className="text-2xl font-semibold text-white">R$ 00,00</p>
          </div>
          <div className="bg-gray-800 border-2 border-red-600 rounded-2xl p-6 w-72 text-center">
            <p className="text-sm text-red-500 mb-2 font-bold">Rede de Indicações</p>
            <p className="text-2xl font-semibold text-white">{totalIndicados}</p>
          </div>
        </div>

        {/* Rodapé */}
        <footer className="w-full mt-20 bg-gray-900 text-white py-12 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">APOSTE</h3>
              <ul className="space-y-2 text-sm text-gray-300"><li>Indicação</li><li>Jogo da Velha</li></ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">LINKS ÚTEIS</h3>
              <ul className="space-y-2 text-sm text-gray-300"><li>Comunidade</li><li>Promoções</li></ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">REGRAS</h3>
              <ul className="space-y-2 text-sm text-gray-300"><li>Termos e Condições</li><li>Jogo Responsável</li></ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">SUPORTE</h3>
              <ul className="space-y-1 text-sm text-gray-300"><li>📚 Central de Ajuda</li><li>📞 0800 00 4546</li><li>📧 suporte@betdreams.com</li></ul>
            </div>
          </div>
        </footer>
      </div>
    </LayoutWrapper>
  );
}
