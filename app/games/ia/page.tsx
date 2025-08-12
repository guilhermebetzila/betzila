'use client';

import React, { useEffect, useState } from 'react';

const vagasTotais = 34;
const ativacaoInicialSegundos = 44 * 60 + 30; // 44min30s em segundos
const precisaoIA = 87.9; // em %

function formatTempo(segundos: number) {
  const m = Math.floor(segundos / 60)
    .toString()
    .padStart(2, '0');
  const s = (segundos % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function gerarPontos(num: number, max: number) {
  return Array.from({ length: num }).map(() => Math.random() * max);
}

function gerarBarras(num: number, max: number) {
  return Array.from({ length: num }).map(() => Math.random() * max);
}

function randomGainLoss() {
  const percentNum = Math.random() * 12 - 5;
  const percent = percentNum.toFixed(2);
  const isGain = percentNum >= 0;
  return {
    text: `${isGain ? '📈' : '📉'} ${isGain ? '+' : ''}${percent}%`,
    gain: isGain,
  };
}

export default function IaTrabalhandoPage() {
  const [vagasRestantes, setVagasRestantes] = useState(vagasTotais);
  const [tempoAtivacao, setTempoAtivacao] = useState(ativacaoInicialSegundos);
  const [precisao, setPrecisao] = useState(precisaoIA);
  const [ganhoDia, setGanhoDia] = useState(0);
  const [statusOperacao, setStatusOperacao] = useState('Analisando o mercado...');
  const [resultadoAtual, setResultadoAtual] = useState<{ text: string; gain: boolean } | null>(null);
  const [notificacoes, setNotificacoes] = useState<{ nome: string; lucro: number; badge: string }[]>([]);

  const [graficoMercado, setGraficoMercado] = useState<number[]>(gerarPontos(20, 100));
  const [deepWebData, setDeepWebData] = useState<string[]>([
    'Buscando fontes anônimas...',
    'Coletando dados de fóruns ocultos...',
    'Raspando dados da dark web...',
  ]);
  const [graficoFinanceiro, setGraficoFinanceiro] = useState<number[]>(gerarBarras(10, 80));
  const [monitorBets, setMonitorBets] = useState<{ bet: string; odd: number; status: string }[]>([
    { bet: 'Time A vs Time B', odd: 1.85, status: 'Analisando' },
    { bet: 'Jogo X vs Y', odd: 2.4, status: 'Aguardando resultado' },
    { bet: 'Equipe Z vs W', odd: 3.1, status: 'Lucro +5%' },
  ]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTempoAtivacao((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    const updateInterval = setInterval(() => {
      const ganho = +(Math.random() * 0.05).toFixed(4);
      setGanhoDia((g) => +(g + ganho).toFixed(4));

      setResultadoAtual(randomGainLoss());

      const fases = [
        'Analisando o mercado...',
        'Validando sinais...',
        'Executando operações...',
        'Ajustando estratégias...',
        'Reavaliando portfólio...',
        'Sincronizando com Wall Street...',
      ];
      setStatusOperacao(fases[Math.floor(Math.random() * fases.length)]);

      const nomesAleatorios = ['Paulo', 'Juliana', 'Carlos', 'Amanda', 'Thiago', 'Fernanda'];
      const badgeOptions = ['Diamante', 'Platina', 'Ouro', 'Prata', 'Bronze'];
      if (Math.random() < 0.6) {
        setNotificacoes((n) => {
          const novo = {
            nome: nomesAleatorios[Math.floor(Math.random() * nomesAleatorios.length)],
            lucro: +(Math.random() * 1500 + 500).toFixed(2),
            badge: badgeOptions[Math.floor(Math.random() * badgeOptions.length)],
          };
          const arr = [novo, ...n];
          return arr.slice(0, 5);
        });
      }

      setVagasRestantes((v) => (v > 0 && Math.random() < 0.1 ? v - 1 : v));

      setPrecisao((p) => {
        let novo = p + (Math.random() * 0.4 - 0.2);
        if (novo < 85) novo = 85;
        if (novo > 90) novo = 90;
        return +novo.toFixed(2);
      });

      setGraficoMercado((g) => [...g.slice(1), Math.random() * 100]);
      setGraficoFinanceiro((g) => [...g.slice(1), Math.random() * 80]);

      setDeepWebData((d) => {
        const msgs = [
          'Buscando fontes anônimas...',
          'Coletando dados de fóruns ocultos...',
          'Raspando dados da dark web...',
          'Analisando padrões de comportamento...',
          'Detectando ameaças e oportunidades...',
          'Filtrando ruídos e informações irrelevantes...',
        ];
        const novoMsg = msgs[Math.floor(Math.random() * msgs.length)];
        const arr = [novoMsg, ...d];
        return arr.slice(0, 5);
      });

      setMonitorBets((bets) =>
        bets.map((bet) => {
          const oddsChange = (Math.random() - 0.5) * 0.1;
          const newOdd = Math.max(1.1, +(bet.odd + oddsChange).toFixed(2));
          const statuses = ['Analisando', 'Aguardando resultado', 'Lucro +5%', 'Perda -3%', 'Ajustando aposta'];
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
          return { ...bet, odd: newOdd, status: newStatus };
        }),
      );
    }, 3000);

    return () => {
      clearInterval(timerInterval);
      clearInterval(updateInterval);
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-white text-black p-6 space-y-10 overflow-y-auto">
      <div className="flex items-center gap-3 mb-2">
        <img src="/img/robo.png" alt="Ziller.Ia" className="w-12 h-12 drop-shadow-lg" />
        <h1 className="text-5xl font-extrabold text-black drop-shadow-lg">Ziller.ia trabalhando...</h1>
      </div>
      <p className="text-gray-700 max-w-xl text-center text-lg italic mb-8">
        Você é o protagonista dessa revolução financeira. A IA Ziller é seu mentor, seu Yoda nesta caminhada.
      </p>

      {/* Indicadores gerais */}
      <section className="flex flex-col md:flex-row justify-center gap-10 w-full max-w-7xl">
        {/* Ativação IA */}
        <div className="bg-gray-100 rounded-xl shadow-lg p-6 flex-1 flex flex-col items-center animate-fadeIn">
          <h2 className="text-2xl font-bold mb-4 text-black">⏳ Ativação da IA</h2>
          <div className="text-6xl font-mono font-extrabold text-black mb-2">{formatTempo(tempoAtivacao)}</div>
          <p className="text-gray-700 mb-4">
            Restam apenas <span className="text-black font-bold">{vagasRestantes}</span> vagas para novos Zilers neste mês.
          </p>
          {tempoAtivacao === 0 && (
            <p className="text-black font-bold text-lg animate-pulse">IA ativada! Seu futuro começa agora! ⚡</p>
          )}
        </div>

        {/* Precisão IA */} 
<div className="bg-gray-100 rounded-xl shadow-lg p-6 flex-1 flex flex-col items-center animate-fadeIn delay-200">
  <h2 className="text-2xl font-bold mb-4 text-black">📊 Precisão da IA</h2>
  <div className="text-6xl font-mono font-extrabold text-black mb-4">{precisao.toFixed(2)}%</div>
  <p className="text-gray-700 italic text-center max-w-xs">
    Precisão validada de decisões, garantindo resultados confiáveis para seu investimento.
  </p>
</div>

{/* Ganho estimado */}
<div className="bg-gray-100 rounded-xl shadow-lg p-6 flex-1 flex flex-col items-center animate-fadeIn delay-400">
  <h2 className="text-2xl font-bold mb-4 text-black">💰 Ganho estimado hoje</h2>
  <div className="text-5xl font-extrabold text-black mb-2">R$ {(ganhoDia * 3000).toFixed(2)}</div>
  <p className="text-gray-700 italic max-w-xs text-center">
    Com um investimento de R$ 3.000, a IA está garantindo esse rendimento diário estimado.
  </p>
</div>
</section>

{/* Status e resultado atual */}
<section className="w-full max-w-5xl bg-gray-100 rounded-xl shadow-inner p-6 animate-fadeIn">
  <h3 className="text-xl font-semibold mb-4 text-black flex items-center gap-3">
    <span className="animate-pulse">⚙️</span> Status da Operação
  </h3>
  <p className="text-black font-mono text-lg mb-4">{statusOperacao}</p>
  {resultadoAtual && (
    <p className={`text-xl font-bold ${resultadoAtual.gain ? 'text-black' : 'text-red-500'}`}>
      Resultado Atual: {resultadoAtual.text}
    </p>
  )}
</section>

{/* Contêineres IA detalhados */}
<section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl w-full animate-fadeIn">
  {/* Pesquisa de Mercado */}
  <div className="bg-gray-100 rounded-xl shadow-lg p-6 flex flex-col">
    <h3 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
      🔍 Pesquisa de Mercado
      <span className="animate-pulse text-black text-lg">•</span>
    </h3>
    <p className="text-gray-700 mb-4 font-mono">
      Analisando tendências globais, comportamento do consumidor e movimentos de concorrentes...
    </p>
    <svg
      viewBox="0 0 220 80"
      className="w-full h-20"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Gráfico de linha pesquisa de mercado"
    >
      <polyline
        fill="none"
        stroke="#000000"
        strokeWidth="3"
        points={graficoMercado.map((v, i) => `${i * 11} ${80 - v}`).join(' ')}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>

  {/* Pesquisa na Deep Web */}
  <div className="bg-gray-100 rounded-xl shadow-lg p-6 flex flex-col">
    <h3 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
      🕵️ Pesquisa na Deep Web
      <span className="animate-pulse text-black text-lg">•</span>
    </h3>
    <ul className="text-black font-mono space-y-1 max-h-28 overflow-y-auto border border-black rounded p-2 bg-gray-200">
      {deepWebData.map((msg, idx) => (
        <li key={idx} className="select-text">
          {msg}
        </li>
      ))}
    </ul>
  </div>

  {/* Análise Mercado Financeiro */}
  <div className="bg-gray-100 rounded-xl shadow-lg p-6 flex flex-col">
    <h3 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
      📈 Análise Mercado Financeiro
      <span className="animate-pulse text-black text-lg">•</span>
    </h3>
    <svg
      viewBox="0 0 220 80"
      className="w-full h-20"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Gráfico de barras análise financeira"
    >
      {graficoFinanceiro.map((v, i) => {
        const barWidth = 18;
        const gap = 4;
        const x = i * (barWidth + gap);
        const y = 80 - v;
        return (
          <rect key={i} x={x} y={y} width={barWidth} height={v} fill="#000000" rx="3" ry="3" />
        );
      })}
    </svg>
    <p className="text-gray-700 mt-2 text-sm italic">
      Avaliando cotações e movimentações do mercado para ajustar a carteira.
    </p>
  </div>

  {/* Monitoramento de Bets */}
  <div className="bg-gray-100 rounded-xl shadow-lg p-6 flex flex-col">
    <h3 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
      🎲 Monitoramento de Apostas
      <span className="animate-pulse text-black text-lg">•</span>
    </h3>
    <table className="w-full text-black text-sm font-mono border-collapse">
      <thead>
        <tr>
          <th className="border-b border-black pb-1 text-left">Evento</th>
          <th className="border-b border-black pb-1 text-center">Odds</th>
          <th className="border-b border-black pb-1 text-right">Status</th>
        </tr>
      </thead>
      <tbody>
        {monitorBets.map(({ bet, odd, status }, idx) => (
          <tr key={idx} className="hover:bg-black/10 transition-colors cursor-default">
            <td className="py-1">{bet}</td>
            <td className="text-center">{odd.toFixed(2)}</td>
            <td className="text-right">{status}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <p className="text-gray-700 mt-2 text-xs italic">Ajustando apostas para maximizar ganhos e minimizar perdas.</p>
  </div>
</section>

      {/* Notificações sociais dinâmicas */} 
<section className="w-full max-w-5xl bg-white rounded-xl shadow-inner p-6 mt-6 animate-fadeIn">
  <h3 className="text-xl font-semibold mb-4 text-black">📢 Notificações Recentes</h3>
  <ul className="space-y-2 max-h-48 overflow-y-auto text-black font-mono">
    {notificacoes.length === 0 && (
      <li className="text-gray-500 italic text-center">Nenhuma notificação ainda.</li>
    )}
    {notificacoes.map(({ nome, lucro, badge }, idx) => (
      <li
        key={idx}
        className="flex justify-between bg-white border border-gray-300 rounded px-4 py-2 hover:bg-gray-100 transition-colors cursor-default select-none shadow-md"
      >
        <span>
          {nome} ganhou R$ {lucro.toFixed(2)}
        </span>
        <span className="text-black font-semibold">{badge}</span>
      </li>
    ))}
  </ul>
</section>

{/* Mensagem motivacional final */}
<section className="max-w-5xl text-center text-gray-700 italic mt-10 px-4">
  <p>
    Você não está apenas investindo. Você está se unindo a uma legião. Uma comunidade dos <b>0.1%</b> mais visionários do Brasil.
  </p>
  <p className="mt-4">
    <span className="font-bold text-black">Pagar dívidas.</span> <br />
    <span className="font-bold text-black">Viajar o mundo.</span> <br />
    <span className="font-bold text-black">Dar uma casa nova pra família.</span> <br />
    <span className="font-bold text-black">Ou simplesmente, nunca mais trabalhar para ninguém.</span>
  </p>
</section>
    </main>
  );
}
