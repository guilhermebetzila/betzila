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
      const variacaoBolsao = (Math.random() - 0.5) * 100; // variação centavos
      const variacaoCapital = (Math.random() - 0.5) * 200; // variação centavos

      prevBolsao.current = bolsao;
      prevCapital.current = capital;

      setBolsao(prev => Math.max(0, prev + variacaoBolsao));
      setCapital(prev => Math.max(0, prev + variacaoCapital));
    }, 100); // atualização a cada 0.1s para efeito contínuo

    return () => clearInterval(interval);
  }, [bolsao, capital]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-start p-6 space-y-8">
      <h1 className="text-4xl font-bold mb-4 text-center">📊 Bolsão da Inteligência Artificial</h1>

      {/* Bolsão */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-2xl p-6 w-full max-w-xl text-center transition-all duration-300">
        <h2 className="text-xl font-semibold mb-2">💼 Bolsão Operacional</h2>
        <p className={`text-4xl font-bold ${
          bolsao > prevBolsao.current ? 'text-green-400' : 'text-red-400'
        } transition-colors duration-300`}>
          {formatBRL(bolsao)}
        </p>
        <span className="text-sm text-gray-200">Valor total em operações de mercado</span>
      </div>

      {/* Capital da Empresa */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-2xl p-6 w-full max-w-xl text-center transition-all duration-300">
        <h2 className="text-xl font-semibold mb-2">🏦 Capital da Empresa</h2>
        <p className={`text-4xl font-bold ${
          capital > prevCapital.current ? 'text-green-400' : 'text-red-400'
        } transition-colors duration-300`}>
          {formatBRL(capital)}
        </p>
        <span className="text-sm text-gray-200">Capital próprio acompanhando as oscilações</span>
      </div>

      {/* Caixa de Proteção */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-lg p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">🛡 Caixa de Proteção 1</h3>
          <p className="text-3xl font-bold">{formatBRL(caixa1)}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-lg p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">🛡 Caixa de Proteção 2</h3>
          <p className="text-3xl font-bold">{formatBRL(caixa2)}</p>
        </div>
      </div>
    </div>
  );
}
