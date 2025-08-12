'use client';

import React, { useEffect, useState } from 'react';
import LayoutWrapper from '@/components/LayoutWrapper';
import IAWorkingPanel from '@/components/IAWorkingPanel';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const menuItems = [
  { label: '🤖 IA', action: '/games/ia' },
  { label: '📥 Depositar', action: '/games/depositar' },
  { label: '📤 Saque via Pix', action: '/games/saque' },
  { label: '📄 Cadastrar CPF', action: '/games/cadastrar-cpf' },
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

const comentariosEsteira = [
  '🌍 "Agora posso viajar com minha esposa. A Ziller.Ia me deu asas!" — Paulo, MG',
  '👨‍👩‍👧‍👦 "Consegui pagar a escola das minhas filhas. Obrigado, Ziller.Ia!" — Juliana, SP',
  '🚀 "Investi R$ 200 e hoje vivo de renda com a IA." — Carlos, BA',
  '🎯 "Não acreditava em mim até ver meus resultados. A IA me fez acreditar!" — Amanda, DF',
  '💼 "Montei minha loja virtual com os lucros da Ziller.Ia." — Tiago, RJ',
  '🏠 "Minha primeira reforma da casa foi com os rendimentos diários." — Larissa, CE',
  '📈 "Não é só dinheiro. É liberdade. É escolha." — Rafael, SC',
  '🎓 "Pude voltar a estudar graças ao lucro diário." — Bianca, PR',
  '💡 "A Ziller.Ia virou meu sócio invisível. A IA trabalha por mim!" — Victor, RS',
  '💖 "Dei orgulho pros meus pais. Finalmente ajudo em casa." — Camila, AM',
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [totalIndicados, setTotalIndicados] = useState<number>(0);
  const [saldo, setSaldo] = useState<number>(0);
  const [saques, setSaques] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(true);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const user = session?.user;

  useEffect(() => {
    const newAudio = new Audio('/audio/triunfo.mp3');
    newAudio.loop = true;
    newAudio.volume = 0.3;
    newAudio.muted = true;
    setAudio(newAudio);

    const playOnInteraction = () => {
      newAudio.play().catch(() => {});
      window.removeEventListener('click', playOnInteraction);
    };
    window.addEventListener('click', playOnInteraction);

    return () => {
      newAudio.pause();
    };
  }, []);

  const toggleMute = () => {
    if (audio) {
      const nextMuted = !isMuted;
      audio.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  useEffect(() => {
    setSaques(gerarSaquesAleatorios());

    const fetchIndicacoes = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/indicacoes`);
        const data = await res.json();
        if (res.ok) setTotalIndicados(data.totalIndicados || 0);
      } catch (error) {
        console.error('Erro ao buscar indicações:', error);
      }
    };

    const fetchSaldo = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/saldo`);
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

  const pontos = totalIndicados * 10;
  const progresso = Math.min((pontos / 1000) * 100, 100);

  if (status === 'loading') return <p className="text-center mt-10 text-black">Carregando...</p>;
  if (status === 'unauthenticated') return <p className="text-center mt-10 text-red-500">Acesso negado. Faça login para continuar.</p>;

  const codigoIndicacao = user?.nome || user?.email || user?.id;
  const linkIndicacao = `https://www.ziller.ia.com.br/register?indicador=${encodeURIComponent(codigoIndicacao || '')}`;

  return (
    <LayoutWrapper>
      <div className="min-h-screen px-4 py-4 bg-white text-black relative">
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={toggleMute}
            className="bg-black hover:bg-gray-800 text-white px-3 py-2 rounded-full shadow-lg transition-colors duration-300 text-sm"
          >
            {isMuted ? '🔇 Som' : '🔊 Som'}
          </button>
        </div>

        <div className="mb-6 flex justify-center gap-4 flex-wrap mt-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuClick(item)}
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md shadow-md font-semibold text-sm transition-colors duration-300 ease-in-out focus:outline-none"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mb-6 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold flex items-center gap-4">
            Olá, {user?.nome || user?.email}
            <span className="bg-black text-white px-3 py-1 text-sm rounded shadow-sm font-semibold">
              Saldo: R$ {saldo.toFixed(2)}
            </span>
          </h1>
          <p className="text-gray-600 text-sm mt-1">Bem-vindo ao seu painel personalizado</p>
          <p className="text-green-600 mt-2">📢 Você já indicou <strong>{totalIndicados}</strong> pessoa(s)!</p>

          <div className="mt-6 bg-gray-100 rounded-lg p-4 border border-black shadow-md">
            <h3 className="text-black text-sm font-semibold mb-2">📲 Seu Código de Indicação:</h3>
            <div className="flex items-center justify-between bg-white text-black px-3 py-2 rounded-md font-mono text-sm border">
              <a
                href={linkIndicacao}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate underline hover:text-green-600"
              >
                {linkIndicacao}
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(linkIndicacao)}
                className="ml-4 bg-black hover:bg-gray-800 text-white font-semibold px-3 py-1 rounded transition-colors text-xs"
              >
                Copiar
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              Compartilhe este link com amigos e ganhe bônus por cada novo Ziler indicado.
            </p>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-700 mb-1">🎁 Pontos Acumulados: {pontos} pontos</p>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-black h-4 rounded-full" style={{ width: `${progresso}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Você precisa de 1000 pontos para desbloquear o próximo prêmio
            </p>
          </div>
        </div>

        <div className="mb-6"><IAWorkingPanel /></div>

        <div className="mb-12">
          <h3 className="text-xl font-semibold text-center text-black mb-4">🎯 Prova Social: Saques Recentes</h3>
          <div className="bg-gray-100 rounded-xl p-4 max-h-40 overflow-y-auto shadow-inner border border-black">
            <ul className="space-y-1 text-sm text-black font-mono">
              {saques.slice(0, 20).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg text-center text-black font-semibold mb-3">
            💬 Transformações Reais com a Ziller.Ia
          </h3>
          <div className="overflow-x-auto whitespace-nowrap space-x-4 scroll-smooth px-2 py-4 border-t border-b border-gray-300">
            {comentariosEsteira.map((comentario, index) => (
              <span
                key={index}
                className="inline-block bg-gray-200 text-black text-sm px-4 py-2 rounded-full shadow-sm border border-black min-w-[250px]"
              >
                {comentario}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={() => router.push('/games/investir')}
            className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-all text-base"
          >
            💹 Investir Agora
          </button>
        </div>
      </div>

      <footer className="w-full mt-20 bg-white text-black py-12 px-6 border-t border-gray-400">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h3 className="text-black text-lg font-bold mb-4">🔐 Segurança & Confiança</h3>
            <p className="text-sm text-gray-700 mb-2">Auditoria independente concluída com sucesso.</p>
            <p className="text-sm text-gray-700 mb-2">IA operando com precisão validada de 87,9%.</p>
            <p className="text-sm text-gray-700">Certificados e parcerias disponíveis no painel.</p>
          </div>
          <div>
            <h3 className="text-black text-lg font-bold mb-4">📈 Transparência Total</h3>
            <p className="text-sm text-gray-700 mb-2">Painel de controle com histórico completo.</p>
            <p className="text-sm text-gray-700 mb-2">Saque e depósito via Pix 100% transparente.</p>
            <p className="text-sm text-gray-700">Controle total do seu investimento, em tempo real.</p>
          </div>
          <div>
            <h3 className="text-black text-lg font-bold mb-4">🤝 Comunidade Ziler</h3>
            <p className="text-sm text-gray-700 mb-2">Top 10 Zilers com maiores ganhos do mês.</p>
            <p className="text-sm text-gray-700 mb-2">
              Missão: Pagar dívidas, viver de renda, transformar vidas.
            </p>
            <p className="text-sm text-gray-700">Você é o protagonista dessa revolução financeira.</p>
          </div>
        </div>
        <div className="text-center mt-12 text-sm text-gray-600">
          © {new Date().getFullYear()} Ziller.Ia • Todos os direitos reservados
        </div>
      </footer>
    </LayoutWrapper>
  );
}
