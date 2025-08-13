'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Cpu } from 'lucide-react';

export default function BolsaoPage() {
  const [valor, setValor] = useState(1000.0);
  const [variacao, setVariacao] = useState(0);
  const [positivo, setPositivo] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Gera variação entre -10 e +10
      const change = (Math.random() * 20 - 10);
      setValor((prev) => {
        const novoValor = prev + change;
        setVariacao(change);
        setPositivo(change >= 0);
        return novoValor;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center justify-center p-6 text-white">
      <div className="text-center space-y-4 max-w-lg">
        <div className="flex items-center justify-center gap-3">
          <Cpu size={40} className="text-yellow-400 animate-pulse" />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Inteligência Artificial Operando no Mercado
          </h1>
        </div>
        <p className="text-gray-300">
          Este é o capital total que nossa IA está gerenciando em tempo real no mercado financeiro.
        </p>
      </div>

      <div className="mt-10 relative bg-gradient-to-br from-yellow-500 to-yellow-300 rounded-3xl shadow-2xl p-8 sm:p-12 w-full max-w-md transform hover:scale-105 transition-transform duration-500">
        <div className="absolute inset-0 rounded-3xl border-4 border-yellow-200 opacity-40 animate-pulse"></div>
        <div className="text-center">
          <p className="text-lg text-black font-semibold mb-2">Bolsão da IA</p>
          <h2 className="text-5xl sm:text-6xl font-extrabold text-black drop-shadow-md">
            R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <div className={`mt-4 flex items-center justify-center gap-2 font-bold text-lg ${positivo ? 'text-green-600' : 'text-red-600'}`}>
            {positivo ? <ArrowUpRight size={28} /> : <ArrowDownRight size={28} />}
            {positivo ? '+' : ''}{variacao.toFixed(2)}
          </div>
        </div>
      </div>

      <p className="mt-8 text-gray-400 text-sm text-center max-w-md">
        O valor oscila a cada operação simulada, refletindo ganhos e perdas dinâmicos como se a IA estivesse operando entradas e saídas reais no mercado.
      </p>
    </main>
  );
}
