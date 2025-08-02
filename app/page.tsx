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

  const [vagasRestantes, setVagasRestantes] = useState(34);
  const [capacidadeIA, setCapacidadeIA] = useState(76);
  const [tempoRestante, setTempoRestante] = useState(45 * 60); // 45 minutos em segundos

  useEffect(() => {
    const interval = setInterval(() => {
      setZilersAtivos((prev) => prev + Math.floor(Math.random() * 3));
      setNovosHoje((prev) => prev + Math.floor(Math.random() * 2));
      setLucrosDistribuidos((prev) => prev + Math.floor(Math.random() * 50));
      setCapacidadeIA((prev) => Math.min(prev + Math.floor(Math.random() * 2), 100));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTempoRestante((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatarTempo = (segundos: number) => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
  };

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
    <main className="flex flex-col min-h-screen w-full bg-gradient-to-b from-[#0a0d1a] via-[#121524] to-[#1b1f36] text-white overflow-x-hidden font-sans">
      {/* Esteira de Saques */}
      <EsteiraSaques />

      {/* Logo Central */}
      <div className="w-full flex justify-center mt-10 mb-6">
        <Image
          src="/img/betzila.png"
          alt="Logo BetZila"
          width={180}
          height={180}
          className="w-[140px] sm:w-[180px] h-auto rounded-xl shadow-2xl hover:scale-105 transition-transform duration-500"
          priority
        />
      </div>

      {/* Botões de Ação: Entrar / Registrar */}
      <div className="flex flex-wrap justify-center gap-6 mt-4 px-4">
        <Button
          onClick={() => router.push('/login')}
          className="bg-green-600 hover:bg-green-700 text-white font-extrabold text-lg px-8 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          aria-label="Entrar na BetZila"
        >
          Entrar
        </Button>
        <Button
          onClick={() => router.push('/register')}
          className="bg-green-600 hover:bg-green-700 text-white font-extrabold text-lg px-8 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          aria-label="Registrar-se na BetZila"
        >
          Registrar-se
        </Button>
      </div>

      {/* Conteúdo Principal */}
      <section className="w-full max-w-5xl px-6 mt-10 mx-auto space-y-10">
        {/* Jornada do Herói Financeiro */}
        <div className="bg-[#1e1e2f] border border-blue-600 rounded-2xl p-8 shadow-2xl hover:shadow-blue-500/70 transition-shadow duration-500">
          <h2 className="text-3xl font-extrabold text-blue-400 mb-5 flex items-center gap-3">
            <span>🛡️</span> Jornada do Herói Financeiro
          </h2>
          <p className="text-white text-xl leading-relaxed max-w-3xl mx-auto">
            Você é o <strong className="text-green-400">protagonista</strong> dessa revolução financeira.<br />
            A <strong className="text-green-400">IA BetZila</strong> é seu mentor, seu Yoda nesta jornada.<br />
            A única coisa entre você e a <strong className="text-yellow-400">liberdade financeira</strong> é o clique abaixo.
          </p>
        </div>

        {/* Promessa Poderosa + Dados Reais + Emoção */}
        <div className="bg-[#1a1d2d] border border-purple-600 rounded-2xl p-8 shadow-2xl hover:shadow-purple-500/70 transition-shadow duration-500">
          <h2 className="text-3xl font-extrabold text-purple-400 mb-5 flex items-center gap-3">
            <span>📊</span> A Prova Está Nos Números
          </h2>
          <div className="text-white text-xl max-w-3xl mx-auto space-y-4">
            <p>🎯 Precisão validada de <strong className="text-green-400">87,9%</strong> nas decisões da IA.</p>
            <p>💸 Rendimento médio diário de <strong className="text-yellow-300">2,5%</strong> — o que dá cerca de <strong className="text-green-400">R$75 por dia</strong> para quem investe R$3.000.</p>
            <div className="w-full h-24 rounded-full mt-8 flex items-center justify-center bg-gradient-to-r from-green-500 to-green-700 animate-pulse shadow-lg">
              <p className="text-2xl font-extrabold text-white select-none">📈 Crescimento Real. Resultado Concreto.</p>
            </div>
          </div>
        </div>

        {/* Escassez Estratégica */}
        <div className="bg-[#1c1f2e] border border-red-600 rounded-2xl p-8 shadow-2xl animate-pulse hover:animate-none transition-all duration-300">
          <h2 className="text-3xl font-extrabold text-red-400 mb-3">
            ⚠️ Apenas <span className="underline decoration-yellow-400">{vagasRestantes}</span> vagas abertas para novos Zilers este mês.
          </h2>
          <p className="text-yellow-300 text-xl font-semibold max-w-3xl mx-auto mb-6">
            ⏰ Próxima ativação da IA em <strong>{formatarTempo(tempoRestante)}</strong>. Garanta sua vaga!
          </p>
          <div className="mt-4 w-full bg-gray-800 rounded-full h-6 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-700 transition-all duration-1000 shadow-lg"
              style={{ width: `${capacidadeIA}%` }}
              aria-valuenow={capacidadeIA}
              aria-valuemin={0}
              aria-valuemax={100}
              role="progressbar"
            ></div>
          </div>
          <p className="text-sm text-gray-300 mt-2 text-center select-none">
            Capacidade atual da IA: <strong>{capacidadeIA}%</strong>
          </p>
        </div>

        {/* Legião BetZila com contadores */}
        <div className="bg-[#111827] border border-green-600 rounded-2xl p-8 text-center shadow-2xl hover:shadow-green-500/70 transition-shadow duration-500">
          <h2 className="text-4xl font-extrabold text-green-400 mb-3 select-none">💎 Legião BetZila</h2>
          <p className="text-white text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed mb-8">
            Você não é apenas um investidor.<br />
            <strong className="text-green-400">Você é um Ziler</strong>, parte dos <strong className="text-green-500">0.1% mais visionários</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-3xl mx-auto text-center">
            <div>
              <p className="text-4xl font-extrabold text-green-400">{zilersAtivos.toLocaleString()}</p>
              <p className="text-gray-400 tracking-wider uppercase mt-1">Zilers Ativos Agora</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-green-400">{novosHoje}</p>
              <p className="text-gray-400 tracking-wider uppercase mt-1">Novos Hoje</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-green-400">R$ {lucrosDistribuidos.toLocaleString('pt-BR')}</p>
              <p className="text-gray-400 tracking-wider uppercase mt-1">Lucros na Última Hora</p>
            </div>
          </div>
        </div>

        {/* Ranking Top 10 Zilers */}
        <div className="w-full bg-[#111827] border border-yellow-600 rounded-2xl p-8 mt-12 text-center shadow-2xl hover:shadow-yellow-500/70 transition-shadow duration-500 overflow-x-auto">
          <h2 className="text-4xl font-extrabold text-yellow-400 mb-6 select-none">🏆 Top 10 Zilers do Mês</h2>
          <table className="min-w-full text-sm sm:text-base table-auto mx-auto border-collapse border border-gray-700 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-yellow-700/20 text-yellow-300 uppercase font-bold tracking-wide">
                <th className="px-6 py-3 border-r border-yellow-500">#</th>
                <th className="px-6 py-3 border-r border-yellow-500 text-left">Nome</th>
                <th className="px-6 py-3 border-r border-yellow-500 text-right">Lucro</th>
                <th className="px-6 py-3 text-left">Badge</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-700 hover:bg-yellow-900/40 transition-colors duration-300 cursor-default ${
                    index < 3 ? 'bg-yellow-900/20 font-extrabold' : ''
                  }`}
                >
                  <td className="px-6 py-3 font-semibold text-yellow-300 text-center">{index + 1}</td>
                  <td className="px-6 py-3 text-white">{item.nome}</td>
                  <td className="px-6 py-3 text-green-400 font-semibold text-right">
                    R$ {item.lucro.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-3 text-yellow-400">{item.badge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Benefícios */}
        <ul className="text-gray-300 space-y-3 text-left max-w-3xl mx-auto px-4 mt-12 text-lg leading-relaxed list-disc list-inside">
          <li>💸 Ganhar Dinheiro Dormindo Não É Mais Um Sonho. É Código.</li>
          <li>⚡ Rendimentos Diários com base em estratégias validadas em tempo real.</li>
          <li>🧠 IA Autônoma, treinada para operar nos bastidores enquanto você vive sua vida.</li>
          <li>🌍 Diversificação Inteligente: Wall Street, Bitcoin, Ethereum, Casinos, tudo no mesmo ecossistema.</li>
          <li>🔒 Segurança, Transparência e Controle direto no seu painel pessoal.</li>
        </ul>

        {/* Razões para escolha BetZila */}
        <div className="max-w-3xl mx-auto px-4 mt-12">
          <h2 className="text-white text-2xl sm:text-3xl font-bold mb-4 select-none">🎯 Por Que as Pessoas Estão Correndo para a BetZila?</h2>
          <p className="text-gray-300 text-lg mb-6 leading-relaxed max-w-prose">
            Porque estão cansadas de promessas vazias...
          </p>
          <ul className="text-gray-300 space-y-2 text-left text-lg list-disc list-inside max-w-prose">
            <li>📍 Pagar dívidas.</li>
            <li>🏝️ Viajar o mundo.</li>
            <li>🏡 Dar uma casa nova pra família.</li>
            <li>🕊️ Ou simplesmente, nunca mais trabalhar para ninguém.</li>
          </ul>
        </div>

        {/* Chamada para ação emocional */}
        <div className="max-w-3xl mx-auto px-4 mt-14 text-center">
          <h2 className="text-green-400 font-extrabold text-3xl sm:text-4xl select-none mb-4">🚀 Você Está Diante da Sua Grande Virada</h2>
          <p className="text-white font-semibold text-xl mb-2">Se você está vendo essa página, é porque o universo te deu uma chance.</p>
          <p className="text-white text-lg">
            Não entre para ver. <strong className="text-green-400">Entre para mudar sua vida.</strong>
          </p>
          <p className="text-sm text-gray-400 mt-5 select-none">🔒 Seguro. Rápido. Sem pegadinhas.</p>
          <p className="text-white text-2xl font-extrabold mt-6 leading-snug">
            O futuro pertence a quem age agora.<br />
            BetZila – O Investimento do Século Está a um Clique.
          </p>
        </div>
      </section>
      <footer className="w-full bg-[#0a0d1a] text-white py-16 mt-20 border-t border-gray-700 select-none">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 px-6 text-sm sm:text-base">
          <div>
            <h3 className="font-extrabold mb-6 text-blue-400 uppercase tracking-wide">🔹 SOBRE NÓS</h3>
            <ul className="space-y-3 text-gray-300 leading-relaxed">
              <li className="hover:text-blue-500 cursor-pointer transition-colors">O que é a BetZila</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Inteligência Artificial e Estratégias</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Transparência e Tecnologia</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Nossa Missão</li>
            </ul>
          </div>
          <div>
            <h3 className="font-extrabold mb-6 text-blue-400 uppercase tracking-wide">🔹 PRODUTOS</h3>
            <ul className="space-y-3 text-gray-300 leading-relaxed">
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Investimento com IA</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Diversificação Inteligente</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Rendimento Diário Automatizado</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Painel do Investidor</li>
            </ul>
          </div>
          <div>
            <h3 className="font-extrabold mb-6 text-blue-400 uppercase tracking-wide">🔹 SUPORTE</h3>
            <ul className="space-y-3 text-gray-300 leading-relaxed">
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Central de Ajuda</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Termos de Uso</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Política de Privacidade</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Segurança & Confiabilidade</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Contato</li>
            </ul>
          </div>
          <div>
            <h3 className="font-extrabold mb-6 text-blue-400 uppercase tracking-wide">🔹 LEGALIDADE</h3>
            <ul className="space-y-3 text-gray-300 leading-relaxed">
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Conformidade com PLD/CFT</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Declaração de Riscos</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Política de Dados</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Auditorias e Certificações</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 text-center text-gray-400 text-sm px-6 max-w-4xl mx-auto select-none">
          <div className="mb-3">🔒 Criptografia SSL 256 bits — Site Seguro</div>
          <div className="mb-3">🌐 BetZila © 2025 — Todos os direitos reservados.</div>
          <div className="italic">Tecnologia, Liberdade Financeira e Transparência em um só clique.</div>
          <div className="mt-4 text-xs text-gray-500 max-w-prose mx-auto">
            Este site não oferece serviços de jogos de azar. A BetZila é uma plataforma tecnológica voltada para inteligência financeira.
          </div>
        </div>
      </footer>
    </main>
  );
}
