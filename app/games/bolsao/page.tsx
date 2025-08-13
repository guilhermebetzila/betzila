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
  // Valores iniciais ajustados
  const [bolsao, setBolsao] = useState(10_000);
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
    }, 500); // atualização a cada 0.5s para efeito suave

    return () => clearInterval(interval);
  }, [bolsao, capital]);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-start p-6 space-y-8">

      <h1 className="text-4xl font-bold mb-4 text-center">Bolsão da Inteligência Artificial</h1>

      {/* Bolsão */}
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-xl text-center border-2 border-black">
        <h2 className="text-xl font-semibold mb-2">Bolsão Operacional</h2>
        <p className={`text-4xl font-bold ${
          bolsao > prevBolsao.current ? 'text-black' : 'text-gray-600'
        } transition-colors duration-500`}>
          {formatBRL(bolsao)}
        </p>
        <span className="text-sm text-gray-700">Valor total em operações de mercado</span>
      </div>

      {/* Capital da Empresa */}
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-xl text-center border-2 border-black">
        <h2 className="text-xl font-semibold mb-2">Capital da Empresa</h2>
        <p className={`text-4xl font-bold ${
          capital > prevCapital.current ? 'text-black' : 'text-gray-600'
        } transition-colors duration-500`}>
          {formatBRL(capital)}
        </p>
        <span className="text-sm text-gray-700">Capital próprio acompanhando as oscilações</span>
      </div>

      {/* Caixa de Proteção */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-6 text-center border-2 border-black">
          <h3 className="text-lg font-semibold mb-2">Caixa de Proteção 1</h3>
          <p className="text-3xl font-bold text-gray-700">{formatBRL(caixa1)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center border-2 border-black">
          <h3 className="text-lg font-semibold mb-2">Caixa de Proteção 2</h3>
          <p className="text-3xl font-bold text-gray-700">{formatBRL(caixa2)}</p>
        </div>
      </div>
    </div>
  );
}
