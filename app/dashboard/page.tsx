'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/context/AuthContext';
import LayoutWrapper from '@/components/LayoutWrapper';
import IAWorkingPanel from '@/components/IAWorkingPanel';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import CampoCPF from '@/components/CampoCPF';

const menuItems = [
  { label: '📥 Depositar', action: '/games/depositar' },
  { label: '📤 Saque via Pix', action: '/games/saque' },
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
  '🌍 "Agora posso viajar com minha esposa. A BetZila me deu asas!" — Paulo, MG',
  '👨‍👩‍👧‍👦 "Consegui pagar a escola das minhas filhas. Obrigado, BetZila!" — Juliana, SP',
  '🚀 "Investi R$ 200 e hoje vivo de renda com a IA." — Carlos, BA',
  '🎯 "Não acreditava em mim até ver meus resultados. A IA me fez acreditar!" — Amanda, DF',
  '💼 "Montei minha loja virtual com os lucros da BetZila." — Tiago, RJ',
  '🏠 "Minha primeira reforma da casa foi com os rendimentos diários." — Larissa, CE',
  '📈 "Não é só dinheiro. É liberdade. É escolha." — Rafael, SC',
  '🎓 "Pude voltar a estudar graças ao lucro diário." — Bianca, PR',
  '💡 "A BetZila virou meu sócio invisível. A IA trabalha por mim!" — Victor, RS',
  '💖 "Dei orgulho pros meus pais. Finalmente ajudo em casa." — Camila, AM',
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [totalIndicados, setTotalIndicados] = useState<number>(0);
  const [saldo, setSaldo] = useState<number>(0);
  const [saques, setSaques] = useState<string[]>([]);
  const [audioAtivado, setAudioAtivado] = useState(false);
  const [mutado, setMutado] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Estado e função para CPF
  const [cpf, setCpf] = useState<string>('');

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

    const fetchCPF = async () => {
      try {
        const res = await fetch('/api/me');
        const data = await res.json();
        if (res.ok && data?.user?.cpf) {
          setCpf(data.user.cpf);
        }
      } catch (error) {
        console.error('Erro ao buscar CPF:', error);
      }
    };

    if (user) {
      fetchIndicacoes();
      fetchSaldo();
      fetchCPF();
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

  if (loading) return <p className="text-center mt-10 text-white">Carregando...</p>;
  if (!user) return <p className="text-center mt-10 text-red-500">Acesso negado. Faça login para continuar.</p>;

  const cpfValido = cpf && cpf.replace(/[^\d]/g, '').length === 11;

  return (
    <LayoutWrapper>
      <div className="min-h-screen px-4 py-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative">

        {/* Botões de Som */}
        {!audioAtivado && (
          <button
            onClick={() => {
              if (!audioRef.current) {
                const audio = new Audio('/audio/triunfo.mp3');
                audio.loop = true;
                audio.volume = 0.25;
                audio.play().catch((err) => {
                  console.warn('Erro ao tocar áudio:', err);
                });
                audioRef.current = audio;
                setAudioAtivado(true);
              }
            }}
            className="fixed top-4 right-4 z-50 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg shadow-lg text-sm font-semibold"
          >
            🔊 Ativar Som
          </button>
        )}
        {audioAtivado && (
          <button
            onClick={() => {
              if (audioRef.current) {
                const novoEstado = !mutado;
                audioRef.current.muted = novoEstado;
                setMutado(novoEstado);
              }
            }}
            className="fixed top-16 right-4 z-50 bg-gray-800 border border-green-400 px-4 py-2 rounded-lg shadow-md text-sm"
          >
            {mutado ? '🔇 Mutado' : '🔊 Som Ativo'}
          </button>
        )}

        {/* MENU DE AÇÕES */}
        <div className="mb-6 flex justify-center gap-4 flex-wrap mt-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuClick(item)}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md shadow-md font-semibold text-sm transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Saudação, saldo, indicações e CPF */}
        <div className="mb-6 max-w-3xl mx-auto">
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

          {/* Campo para CPF */}
          <div className="mt-6">
            <CampoCPF
              cpfInicial={cpf}
              onSalvar={async (novoCpf) => {
                try {
                  const res = await fetch('/api/user/atualizar-cpf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cpf: novoCpf }),
                  });
                  if (res.ok) {
                    setCpf(novoCpf);
                    alert('✅ CPF salvo com sucesso!');
                  } else {
                    alert('❌ Erro ao salvar CPF.');
                  }
                } catch (e) {
                  console.error('Erro ao salvar CPF:', e);
                  alert('❌ Erro ao salvar CPF.');
                }
              }}
            />
          </div>
        </div>

        {/* Barra Pontos */}
        <div className="mb-6 max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-inner p-4 border-2 border-green-400">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold text-sm">🎁 Pontos Acumulados</span>
            <span className="text-green-400 font-bold text-sm">{pontos} pts</span>
          </div>
          <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden">
            <div className="bg-green-400 h-4" style={{ width: `${progresso}%` }}></div>
          </div>
          <p className="text-gray-300 text-xs mt-2">
            Faltam <span className="text-green-400 font-semibold">{1000 - pontos} pts</span> para desbloquear o <strong>App Exclusivo BetZila!</strong>
          </p>
        </div>

        <div className="mb-6"><IAWorkingPanel /></div>

        {/* Prova Social */}
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

        {/* Esteira de Comentários */}
        <div className="mb-8">
          <h3 className="text-lg text-center text-green-400 font-semibold mb-3">💬 Transformações Reais com a BetZila</h3>
          <div className="overflow-x-auto whitespace-nowrap space-x-4 scroll-smooth px-2 py-4 border-t border-b border-green-700">
            {comentariosEsteira.map((comentario, index) => (
              <span
                key={index}
                className="inline-block bg-gray-700 text-white text-sm px-4 py-2 rounded-full shadow-sm border border-green-500 min-w-[250px]"
              >
                {comentario}
              </span>
            ))}
          </div>
        </div>

        {/* Botão Investir com bloqueio se CPF inválido */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => {
              if (!cpfValido) {
                alert('❌ Por favor, cadastre um CPF válido antes de investir.');
                return;
              }
              router.push('/games/investir');
            }}
            className={`${
              !cpfValido
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            } text-black font-semibold py-2 px-5 rounded-lg shadow-md transition-all text-base`}
          >
            💹 Investir Agora
          </button>
        </div>

        {/* Rodapé */}
        <footer className="w-full mt-20 bg-gray-900 text-white py-12 px-6 border-t border-green-800">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-green-400 text-lg font-bold mb-4">🔐 Segurança & Confiança</h3>
              <p className="text-sm text-gray-300 mb-2">Auditoria independente concluída com sucesso.</p>
              <p className="text-sm text-gray-300 mb-2">IA operando com precisão validada de 87,9%.</p>
              <p className="text-sm text-gray-300">Certificados e parcerias disponíveis no painel.</p>
            </div>
            <div>
              <h3 className="text-green-400 text-lg font-bold mb-4">📈 Transparência Total</h3>
              <p className="text-sm text-gray-300 mb-2">Painel de controle com histórico completo.</p>
              <p className="text-sm text-gray-300 mb-2">Saque e depósito via Pix 100% transparente.</p>
              <p className="text-sm text-gray-300">Controle total do seu investimento, em tempo real.</p>
            </div>
            <div>
              <h3 className="text-green-400 text-lg font-bold mb-4">🤝 Comunidade Ziler</h3>
              <p className="text-sm text-gray-300 mb-2">Top 10 Zilers com maiores ganhos do mês.</p>
              <p className="text-sm text-gray-300 mb-2">Missão: Pagar dívidas, viver de renda, transformar vidas.</p>
              <p className="text-sm text-gray-300">Você é o protagonista dessa revolução financeira.</p>
            </div>
          </div>
          <div className="text-center mt-12 text-sm text-gray-500">© {new Date().getFullYear()} BetZila • Todos os direitos reservados</div>
        </footer>
      </div>
    </LayoutWrapper>
  );
}
