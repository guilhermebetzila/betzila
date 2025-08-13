'use client';

import React, { useEffect, useState, useRef } from 'react';

function formatBRL(valor: number) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  });
}

export default function BolsaoPage() {
  const [bolsao, setBolsao] = useState(1_000_000);
  const [capital, setCapital] = useState(1_000_000);

  const prevBolsao = useRef(bolsao);
  const prevCapital = useRef(capital);

  // Caixa de Proteção fixo
  const caixa1 = 100_000;
  const caixa2 = 100_000;

  useEffect(() => {
    const interval = setInterval(() => {
      const variacaoBolsao = (Math.random() - 0.5) * 20; // oscilação mais lenta
      const variacaoCapital = (Math.random() - 0.5) * 40; // oscilação mais lenta

      prevBolsao.current = bolsao;
      prevCapital.current = capital;

      setBolsao(prev => Math.max(0, prev + variacaoBolsao));
      setCapital(prev => Math.max(0, prev + variacaoCapital));
    }, 500); // atualização a cada 0.5s para efeito mais suave

    return () => clearInterval(interval);
  }, [bolsao, capital]);

  return (
    <div className="min-h-screen bg-black text-yellow-300 flex flex-col items-center justify-start p-6 space-y-8">
      <h1 className="text-4xl font-bold mb-4 text-center text-yellow-400">Bolsão da Inteligência Artificial</h1>

      {/* Bolsão */}
      <div className="bg-yellow-900/20 rounded-2xl shadow-2xl p-6 w-full max-w-xl text-center border-2 border-yellow-400">
        <h2 className="text-xl font-semibold mb-2 text-yellow-300">Bolsão Operacional</h2>
        <p className={`text-4xl font-bold ${
          bolsao > prevBolsao.current ? 'text-yellow-200' : 'text-yellow-500'
        } transition-colors duration-500`}>
          {formatBRL(bolsao)}
        </p>
        <span className="text-sm text-yellow-200">Valor total em operações de mercado</span>
      </div>

      {/* Capital da Empresa */}
      <div className="bg-yellow-900/20 rounded-2xl shadow-2xl p-6 w-full max-w-xl text-center border-2 border-yellow-400">
        <h2 className="text-xl font-semibold mb-2 text-yellow-300">Capital da Empresa</h2>
        <p className={`text-4xl font-bold ${
          capital > prevCapital.current ? 'text-yellow-200' : 'text-yellow-500'
        } transition-colors duration-500`}>
          {formatBRL(capital)}
        </p>
        <span className="text-sm text-yellow-200">Capital próprio acompanhando as oscilações</span>
      </div>

      {/* Caixa de Proteção */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <div className="bg-yellow-800/20 rounded-2xl shadow-lg p-6 text-center border-2 border-yellow-400">
          <h3 className="text-lg font-semibold mb-2 text-yellow-300">Caixa de Proteção 1</h3>
          <p className="text-3xl font-bold text-yellow-200">{formatBRL(caixa1)}</p>
        </div>
        <div className="bg-yellow-800/20 rounded-2xl shadow-lg p-6 text-center border-2 border-yellow-400">
          <h3 className="text-lg font-semibold mb-2 text-yellow-300">Caixa de Proteção 2</h3>
          <p className="text-3xl font-bold text-yellow-200">{formatBRL(caixa2)}</p>
        </div>
      </div>
    </div>
  );
}
