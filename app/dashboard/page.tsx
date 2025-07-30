'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/context/AuthContext';
import LayoutWrapper from '@/components/LayoutWrapper';
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

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [totalIndicados, setTotalIndicados] = useState<number>(0);
  const [search, setSearch] = useState('');
  const [saldo, setSaldo] = useState<number>(0);

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

    const fetchSaldo = async () => {
      try {
        const res = await fetch('/api/saldo'); // ✅ ROTA CORRETA
        const data = await res.json();
        if (res.ok) {
          setSaldo(data.saldo || 0);
        }
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

  const renderGameCard = (src: string, alt: string, href?: string) => (
    <div
      className="relative bg-gray-800 rounded-xl overflow-hidden shadow hover:scale-105 transition-transform duration-300 cursor-pointer"
      onClick={() => {
        if (href) router.push(href);
      }}
    >
      <img src={src} alt={alt} className="w-full h-32 sm:h-40 object-cover" />
      <span className="absolute top-2 left-2 bg-yellow-400 text-black font-semibold text-xs px-3 py-1 rounded shadow-lg">
        Jogar agora
      </span>
    </div>
  );

  return (
    <LayoutWrapper>
      <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="mb-10">
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

        {/* Barra de busca */}
        <div className="mb-10">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Buscar jogos ou provedores..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Menus rápidos */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
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

        {/* Apostas Esportivas */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">📊 Apostas Esportivas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => renderGameCard(`/img/game${n}.png`, `Jogo ${n}`))}
          </div>
        </div>

        {/* Cassino ao Vivo */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">🎰 Cassino ao Vivo</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => renderGameCard(`/img/live${n}.png`, `Cassino ${n}`))}
          </div>
        </div>

        {/* Jogos de Fortune */}
        {/* Jogos de Fortune */}
<div className="mt-16">
  <h2 className="text-2xl font-bold mb-6">🧧 Jogos de Fortune</h2>
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
    {[
      { src: '/img/demo1.png', alt: 'Fortune Ox', link: '/games/fortune-ox' },
      { src: '/img/demo2.png', alt: 'Fortune Rabbit', link: '/games/fortune-rabbit' },
      { src: '/img/demo3.png', alt: 'Fortune Tiger', link: '/games/fortune-tiger' },
      { src: '/img/demo4.png', alt: 'Fortune Mouse', link: '/games/fortune-mouse' },
      { src: '/img/demo5.png', alt: 'Fortune Cat', link: '/games/fortune-cat' },
      { src: '/img/demo6.png', alt: 'Fortune Pig', link: '/games/fortune-pig' },
      { src: '/img/demo7.png', alt: 'Fortune Panda', link: '/games/fortune-panda' },
      { src: '/img/demo8.png', alt: 'Fortune Dog', link: '/games/fortune-dog' },
    ].map((game, i) => (
      <div
        key={i}
        onClick={() => router.push(game.link)}
        className="relative bg-gray-800 rounded-xl overflow-hidden shadow hover:scale-105 transition-transform duration-300 cursor-pointer"
      >
        <img src={game.src} alt={game.alt} className="w-full h-32 sm:h-40 object-cover" />
        <span className="absolute top-2 left-2 bg-yellow-400 text-black font-semibold text-xs px-3 py-1 rounded shadow-lg">
          Jogar agora
        </span>
      </div>
    ))}
  </div>
</div>

        {/* Populares */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">🔥 Populares</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(10)].map((_, i) => renderGameCard(`/img/demo${15 + i}.png`, `Popular ${15 + i}`))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">❓ Perguntas Frequentes</h2>
          <ul className="space-y-3 text-white text-sm">
            {[
              'Como faço para sacar via Pix?',
              'Como entrar em contato com o suporte da BetDreams?',
              'Como consultar meu histórico de apostas?',
              'Como cancelo um bônus?',
              'Como consultar meu histórico de transação?',
              'Como apostar nos jogos da BetDreams?',
              'Como posso encontrar instruções para o jogo?',
              'Onde encontro todas promoções e bônus disponíveis?'
            ].map((question, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-yellow-400">➔</span>
                <span>{question}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Rodapé */}
        <footer className="w-full mt-20 bg-gray-900 text-white py-12 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">APOSTE</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Apostas Esportivas</li>
                <li>Fortune Tiger</li>
                <li>Fortune Rabbit</li>
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
                <li>Termos e Condições Gerais</li>
                <li>Jogo Responsável</li>
                <li>Regras de Apostas Esportivas</li>
                <li>Termos e Condições Gerais de Bônus</li>
                <li>Política de Privacidade</li>
                <li>Regras de Pagamento</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">SUPORTE</h3>
              <p className="text-sm text-gray-300 mb-2">
                Conte com nossa equipe sempre que precisar.<br />
                Atendimento disponível 24 horas por dia, 7 dias por semana.
              </p>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>📚 Central de Ajuda</li>
                <li>📞 0800 00 4546</li>
                <li>📧 suporte.betdreams@gmail.com</li>
              </ul>
            </div>
          </div>
          <div className="max-w-6xl mx-auto mt-10">
            <h3 className="font-bold mb-2">OUTROS</h3>
            <p className="text-sm text-gray-300">Ouvidoria PROCON</p>
          </div>
        </footer>
      </div>
    </LayoutWrapper>
  );
}
