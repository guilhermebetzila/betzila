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
  const [tempoRestante, setTempoRestante] = useState(45 * 60);

  // Estados do simulador interativo
  const [investimento, setInvestimento] = useState(200);
  const [ganhoSimples, setGanhoSimples] = useState({ semana: 0, mes: 0, tresMeses: 0 });
  const [ganhoIndicacao, setGanhoIndicacao] = useState({ semana: 0, mes: 0, tresMeses: 0 });
  const [ganhoIndicado, setGanhoIndicado] = useState({ semana: 0, mes: 0, tresMeses: 0 });
  const [ganhoTotal, setGanhoTotal] = useState(0);

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

  // Função para calcular ganhos do simulador com juros compostos e comissões
  useEffect(() => {
    const taxaDiaria = 0.025; // 2,5% ao dia
    const diasSemana = 7;
    const diasMes = 30;
    const diasTresMeses = 90;

    // Fórmula juros compostos: valor * (1 + taxa) ** dias - valor
    const ganhoSimplesSemana = investimento * (1 + taxaDiaria) ** diasSemana - investimento;
    const ganhoSimplesMes = investimento * (1 + taxaDiaria) ** diasMes - investimento;
    const ganhoSimplesTresMeses = investimento * (1 + taxaDiaria) ** diasTresMeses - investimento;

    // Ganhos com indicação direta (10%) - 1 indicado por dia com investimento fixo de 200
    const investimentoIndicacao = 200;
    const comissaoDireta = 0.10;
    const ganhoIndicacaoSemana = investimentoIndicacao * comissaoDireta * diasSemana;
    const ganhoIndicacaoMes = investimentoIndicacao * comissaoDireta * diasMes;
    const ganhoIndicacaoTresMeses = investimentoIndicacao * comissaoDireta * diasTresMeses;

    // Ganhos com indicação indireta (5%) - indicado do indicado
    const comissaoIndireta = 0.05;
    const ganhoIndicadoSemana = investimentoIndicacao * comissaoIndireta * diasSemana;
    const ganhoIndicadoMes = investimentoIndicacao * comissaoIndireta * diasMes;
    const ganhoIndicadoTresMeses = investimentoIndicacao * comissaoIndireta * diasTresMeses;

    // Total ganhos em 3 meses (simples + direta + indireta)
    const totalTresMeses = ganhoSimplesTresMeses + ganhoIndicacaoTresMeses + ganhoIndicadoTresMeses;

    setGanhoSimples({
      semana: ganhoSimplesSemana,
      mes: ganhoSimplesMes,
      tresMeses: ganhoSimplesTresMeses,
    });

    setGanhoIndicacao({
      semana: ganhoIndicacaoSemana,
      mes: ganhoIndicacaoMes,
      tresMeses: ganhoIndicacaoTresMeses,
    });

    setGanhoIndicado({
      semana: ganhoIndicadoSemana,
      mes: ganhoIndicadoMes,
      tresMeses: ganhoIndicadoTresMeses,
    });

    setGanhoTotal(totalTresMeses);
  }, [investimento]);

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
      <EsteiraSaques />

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

      <div className="flex flex-wrap justify-center gap-6 mt-4 px-4">
        <Button
          onClick={() => router.push('/login')}
          className="bg-green-600 hover:bg-green-700 text-white font-extrabold text-lg px-8 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          Entrar
        </Button>
        <Button
          onClick={() => router.push('/register')}
          className="bg-green-600 hover:bg-green-700 text-white font-extrabold text-lg px-8 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          Registrar-se
        </Button>
      </div>

      <section className="w-full max-w-4xl px-6 mt-14 mx-auto text-center leading-relaxed text-xl sm:text-2xl space-y-6 text-white">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-green-400 mb-6 select-none">
          🛡️ Sua Jornada Começa Aqui
        </h2>
        <p>
          Você é o <span className="text-green-400 font-bold">protagonista</span> dessa revolução financeira. A <span className="text-green-400 font-bold">IA BetZila</span> é seu mentor, seu Yoda nesta caminhada.
        </p>
        <p>
          A única coisa entre você e a <span className="text-yellow-300 font-bold">liberdade financeira</span> é o próximo clique.
        </p>
        <p>
          📊 <span className="text-purple-400 font-bold">A Prova Está Nos Números:</span> Precisão validada de <span className="text-green-400 font-bold">87,9%</span> nas decisões da IA. Rendimento médio diário de <span className="text-yellow-300 font-bold">2,5%</span> — o que representa até <span className="text-green-400 font-bold">R$75/dia</span> para quem investe R$3.000.
        </p>
        <p>
          ⚠️ Restam apenas <span className="text-red-400 font-bold">{vagasRestantes}</span> vagas disponíveis para novos Zilers neste mês.
          A IA será ativada em <span className="text-yellow-300 font-bold">{formatarTempo(tempoRestante)}</span>.
        </p>
        <div className="w-full bg-gray-800 rounded-full h-6 overflow-hidden shadow-inner mt-4">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-700 transition-all duration-1000 shadow-lg"
            style={{ width: `${capacidadeIA}%` }}
            aria-valuenow={capacidadeIA}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
          ></div>
        </div>
        <p className="text-sm text-gray-300 mt-2 select-none">
          Capacidade atual da IA: <span className="text-white font-semibold">{capacidadeIA}%</span>
        </p>
        <p>
          Você não está apenas investindo. <span className="text-green-400 font-bold">Você está se unindo a uma legião.</span> Uma comunidade dos <span className="text-green-400 font-bold">0.1% mais visionários</span> do Brasil.
        </p>
        <p>📍 Pagar dívidas.</p>
        <p>🏝️ Viajar o mundo.</p>
        <p>🏡 Dar uma casa nova pra família.</p>
        <p>🕊️ Ou simplesmente, nunca mais trabalhar para ninguém.</p>

        {/* Funil de Conversão Estratégico */}
        <div className="bg-[#0f172a] border border-green-600 rounded-2xl shadow-2xl mt-10 py-10 px-6 text-center space-y-6 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-green-400 select-none">🔓 3 Passos Simples para sua Virada</h3>
          <ol className="text-white text-lg sm:text-xl space-y-3 list-decimal list-inside text-left max-w-md mx-auto font-medium">
            <li>Crie seu perfil BetZila</li>
            <li>Ative a IA com qualquer valor</li>
            <li>Veja seus ganhos começarem amanhã</li>
          </ol>
          <Button
            onClick={() => router.push('/register')}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold text-lg px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 mt-4"
          >
            Quero minha Virada Agora ⚡
          </Button>
          <p className="text-gray-400 text-sm mt-2">100% seguro. Sem promessas vazias.</p>
        </div>
        {/* Simulador Interativo de Ganhos */}
        <section className="bg-[#111827] rounded-2xl p-8 mt-12 max-w-3xl mx-auto shadow-2xl text-white">
          <h3 className="text-2xl font-bold text-yellow-400 mb-6 select-none">💰 Simulador Interativo de Ganhos</h3>
          <p className="mb-4 text-gray-300">
            Digite o valor que deseja investir e veja seus ganhos estimados com juros diários e comissões por indicação.
          </p>
          <input
            type="number"
            min={100}
            step={50}
            value={investimento}
            onChange={(e) => setInvestimento(Number(e.target.value))}
            className="w-full p-3 rounded-md text-black font-semibold text-lg mb-6 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Digite seu investimento (mínimo R$100)"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="bg-yellow-700 rounded-lg p-4 shadow-lg transform transition-transform hover:scale-105">
              <h4 className="text-xl font-semibold mb-2">1 Semana</h4>
              <p>R$ {ganhoSimples.semana.toFixed(2)}</p>
              <p className="text-sm text-yellow-300">Juros 2,5% ao dia</p>
              <p>+ R$ {ganhoIndicacao.semana.toFixed(2)} (10% indicação direta)</p>
              <p>+ R$ {ganhoIndicado.semana.toFixed(2)} (5% indireta)</p>
            </div>
            <div className="bg-yellow-700 rounded-lg p-4 shadow-lg transform transition-transform hover:scale-105">
              <h4 className="text-xl font-semibold mb-2">1 Mês</h4>
              <p>R$ {ganhoSimples.mes.toFixed(2)}</p>
              <p className="text-sm text-yellow-300">Juros 2,5% ao dia</p>
              <p>+ R$ {ganhoIndicacao.mes.toFixed(2)} (10% indicação direta)</p>
              <p>+ R$ {ganhoIndicado.mes.toFixed(2)} (5% indireta)</p>
            </div>
            <div className="bg-yellow-700 rounded-lg p-4 shadow-lg transform transition-transform hover:scale-105">
              <h4 className="text-xl font-semibold mb-2">3 Meses</h4>
              <p>R$ {ganhoSimples.tresMeses.toFixed(2)}</p>
              <p className="text-sm text-yellow-300">Juros 2,5% ao dia</p>
              <p>+ R$ {ganhoIndicacao.tresMeses.toFixed(2)} (10% indicação direta)</p>
              <p>+ R$ {ganhoIndicado.tresMeses.toFixed(2)} (5% indireta)</p>
            </div>
          </div>
          <div className="mt-8 text-center text-yellow-400 font-bold text-2xl animate-pulse">
            Ganho Total em 3 meses: R$ {ganhoTotal.toFixed(2)}
          </div>
          <p className="mt-4 text-gray-300 text-sm max-w-prose mx-auto">
            * Considerando 2,5% de rendimento diário composto + comissão de indicação direta (10%) e indireta (5%) para 1 pessoa indicada por dia com investimento fixo de R$200.
          </p>
        </section>
      </section>
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
        <li>🌍 Diversificação Inteligente: Wall Street, Bitcoin, Ethereum, Cassinos — tudo no mesmo ecossistema.</li>
       
        <li>🔒 Segurança, Transparência e Controle direto no seu painel pessoal.</li>
      </ul>

      {/* Razões para escolha BetZila */}
      <div className="max-w-3xl mx-auto px-4 mt-12">
        <h2 className="text-white text-2xl sm:text-3xl font-bold mb-4 select-none">
          🎯 Por Que as Pessoas Estão Correndo para a BetZila?
        </h2>
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
        <h2 className="text-green-400 font-extrabold text-3xl sm:text-4xl select-none mb-4">
          🚀 Você Está Diante da Sua Grande Virada
        </h2>
        <p className="text-white font-semibold text-xl mb-2">
          Se você está vendo essa página, é porque o universo te deu uma chance.
        </p>
        <p className="text-white text-lg">
          Não entre para ver. <strong className="text-green-400">Entre para mudar sua vida.</strong>
        </p>
        <p className="text-sm text-gray-400 mt-5 select-none">🔒 Seguro. Rápido. Sem pegadinhas.</p>
        <p className="text-white text-2xl font-extrabold mt-6 leading-snug">
          O futuro pertence a quem age agora.<br />
          BetZila – O Investimento do Século Está a um Clique.
        </p>
      </div>

      {/* Rodapé */}
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
