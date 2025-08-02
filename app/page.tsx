'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import EsteiraSaques from '@/components/EsteiraSaques';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();

  const [zilersAtivos, setZilersAtivos] = useState(1249);
  const [novosHoje, setNovosHoje] = useState(87);
  const [lucrosDistribuidos, setLucrosDistribuidos] = useState(18450);

  useEffect(() => {
    const interval = setInterval(() => {
      setZilersAtivos(prev => prev + Math.floor(Math.random() * 3));
      setNovosHoje(prev => prev + Math.floor(Math.random() * 2));
      setLucrosDistribuidos(prev => prev + Math.floor(Math.random() * 50));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const ranking = [
    { nome: 'Juliana R.', lucro: 9872, badge: 'Diamante' },
    { nome: 'Carlos M.', lucro: 8850, badge: 'Platina' },
    { nome: 'Renata L.', lucro: 7810, badge: 'Ouro' },
    { nome: 'Fábio Z.', lucro: 7225, badge: 'Ouro' },
    { nome: 'Amanda P.', lucro: 6890, badge: 'Prata' },
    { nome: 'Thiago K.', lucro: 6605, badge: 'Prata' },
    { nome: 'Fernanda S.', lucro: 5990, badge: 'Bronze' },
    { nome: 'Igor D.', lucro: 5745, badge: 'Bronze' },
    { nome: 'Lucas G.', lucro: 5310, badge: 'Bronze' },
    { nome: 'Patrícia C.', lucro: 5102, badge: 'Bronze' },
  ];

  return (
    <main className="flex flex-col min-h-screen w-full bg-[#0a0d1a] text-white overflow-x-hidden">
      <EsteiraSaques />

      <div className="w-full flex justify-center mt-8 mb-4">
        <Image
          src="/img/betzila.png"
          alt="Avatar BetZila"
          width={160}
          height={160}
          className="sm:w-[160px] sm:h-[160px] w-[120px] h-[120px] rounded-xl shadow-xl"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <Button
          onClick={() => router.push('/login')}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold text-lg px-6 py-3 rounded shadow"
        >
          Entrar
        </Button>
        <Button
          onClick={() => router.push('/register')}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold text-lg px-6 py-3 rounded shadow"
        >
          Registrar-se
        </Button>
      </div>

      <div className="w-full flex flex-col items-center px-4 mt-6 space-y-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-green-400">
          🌐 Bem-vindo ao Futuro dos Investimentos
        </h1>
        <p className="text-xl font-semibold text-white">
          💥 A Nova Era de Riqueza Começa com um Clique.
        </p>
        <p className="text-gray-300 w-full max-w-screen-lg">
          Imagine uma inteligência artificial que nunca dorme.
          Ela estuda padrões, rastreia bilhões de dados em tempo real, detecta os movimentos mais lucrativos do mercado financeiro tradicional, criptoativos e até mesmo as jogadas mais vantajosas dos maiores cassinos online do mundo.
        </p>
        <p className="text-green-400 font-bold text-xl">Agora imagine que você pode investir nela.</p>
        <p className="text-white font-semibold text-lg">📈 Essa é a BetZila.</p>

        {/* Legião BetZila com contador */}
        <div className="w-full max-w-4xl bg-[#111827] border border-green-600 rounded-xl p-6 sm:p-8 mt-6 text-center shadow-xl">
          <h2 className="text-3xl font-bold text-green-400 mb-2">💎 Legião BetZila</h2>
          <p className="text-white text-lg sm:text-xl">
            Você não é apenas um investidor.<br />
            <strong className="text-green-400">Você é um Ziler</strong>, parte dos <strong className="text-green-500">0.1% mais visionários</strong> que usam inteligência artificial para prosperar enquanto dormem.
          </p>
          <p className="text-gray-400 mt-4 text-sm sm:text-base">
            Sinta-se parte de uma comunidade VIP. Um movimento silencioso que está mudando o jogo financeiro no Brasil.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 text-center">
            <div>
              <p className="text-2xl font-bold text-green-400">{zilersAtivos.toLocaleString()}</p>
              <p className="text-gray-300">Zilers Ativos Agora</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">{novosHoje}</p>
              <p className="text-gray-300">Novos Hoje</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">R$ {lucrosDistribuidos.toLocaleString('pt-BR')}</p>
              <p className="text-gray-300">Lucros na Última Hora</p>
            </div>
          </div>
        </div>

        {/* Ranking Top 10 Zilers */}
        <div className="w-full max-w-4xl bg-[#111827] border border-yellow-500 rounded-xl p-6 sm:p-8 mt-10 text-center shadow-xl">
          <h2 className="text-3xl font-bold text-yellow-400 mb-4">🏆 Top 10 Zilers do Mês</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-300 text-left">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Nome</th>
                  <th className="px-4 py-2">Lucro</th>
                  <th className="px-4 py-2">Badge</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((item, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-[#1f2937]">
                    <td className="px-4 py-2 font-bold text-white">{index + 1}</td>
                    <td className="px-4 py-2 text-white">{item.nome}</td>
                    <td className="px-4 py-2 text-green-400 font-semibold">R$ {item.lucro.toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-2 text-yellow-400">{item.badge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Benefícios e restante da página */}
        <ul className="text-gray-300 space-y-2 text-left w-full max-w-screen-md px-2 mt-6">
          <li>💸 Ganhar Dinheiro Dormindo Não É Mais Um Sonho. É Código.</li>
          <li>⚡ Rendimentos Diários com base em estratégias validadas em tempo real.</li>
          <li>🧠 IA Autônoma, treinada para operar nos bastidores enquanto você vive sua vida.</li>
          <li>🌍 Diversificação Inteligente: Wall Street, Bitcoin, Ethereum, Casinos, tudo no mesmo ecossistema.</li>
          <li>🔒 Segurança, Transparência e Controle direto no seu painel pessoal.</li>
        </ul>

        <h2 className="text-white text-xl font-bold mt-6">🎯 Por Que as Pessoas Estão Correndo para a BetZila?</h2>
        <p className="text-gray-300 w-full max-w-screen-md">Porque estão cansadas de promessas vazias...</p>
        <ul className="text-gray-300 space-y-1 text-left w-full max-w-screen-md px-2">
          <li>📍 Pagar dívidas.</li>
          <li>🏝️ Viajar o mundo.</li>
          <li>🏡 Dar uma casa nova pra família.</li>
          <li>🕊️ Ou simplesmente, nunca mais trabalhar para ninguém.</li>
        </ul>

        <h2 className="text-green-400 font-bold text-2xl mt-6">🚀 Você Está Diante da Sua Grande Virada</h2>
        <p className="text-white font-semibold">Se você está vendo essa página, é porque o universo te deu uma chance.</p>
        <p className="text-white">Não entre para ver. <strong className="text-green-400">Entre para mudar sua vida.</strong></p>

        <p className="text-sm text-gray-400 mt-4">🔒 Seguro. Rápido. Sem pegadinhas.</p>
        <p className="text-white text-lg font-bold mt-4">
          O futuro pertence a quem age agora.<br />
          BetZila – O Investimento do Século Está a um Clique.
        </p>
      </div>

      <footer className="w-full bg-[#0a0d1a] text-white py-12 mt-20 border-t border-gray-700">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm px-4">
          <div>
            <h3 className="font-bold mb-4 text-blue-400">🔹 SOBRE NÓS</h3>
            <ul className="space-y-2 text-gray-300">
              <li>O que é a BetZila</li>
              <li>Inteligência Artificial e Estratégias</li>
              <li>Transparência e Tecnologia</li>
              <li>Nossa Missão</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-blue-400">🔹 PRODUTOS</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Investimento com IA</li>
              <li>Diversificação Inteligente</li>
              <li>Rendimento Diário Automatizado</li>
              <li>Painel do Investidor</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-blue-400">🔹 SUPORTE</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Central de Ajuda</li>
              <li>Termos de Uso</li>
              <li>Política de Privacidade</li>
              <li>Segurança & Confiabilidade</li>
              <li>Contato</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-blue-400">🔹 LEGALIDADE</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Conformidade com PLD/CFT</li>
              <li>Declaração de Riscos</li>
              <li>Política de Dados</li>
              <li>Auditorias e Certificações</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 text-center text-gray-400 text-sm px-2">
          <div className="mb-2">🔒 Criptografia SSL 256 bits — Site Seguro</div>
          <div className="mb-2">🌐 BetZila © 2025 — Todos os direitos reservados.</div>
          <div className="italic">Tecnologia, Liberdade Financeira e Transparência em um só clique.</div>
          <div className="mt-2 text-xs text-gray-500">
            Este site não oferece serviços de jogos de azar. A BetZila é uma plataforma tecnológica voltada para inteligência financeira.
          </div>
        </div>
      </footer>
    </main>
  );
}
