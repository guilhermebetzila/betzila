'use client';

import { useState, useEffect } from 'react';

type Investimento = {
  id: number;
  valor: number;
  criadoEm: string;
};

export default function InvestirPage() {
  const [valor, setValor] = useState<number>(0);
  const [historico, setHistorico] = useState<Investimento[]>([]);
  const [saldo, setSaldo] = useState<number>(0);
  const [valorInvestido, setValorInvestido] = useState<number>(0);
  const [pontos, setPontos] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarHistorico();
    carregarDadosUsuario();
  }, []);

  const carregarHistorico = async () => {
    const res = await fetch('/api/investir/historico');
    if (res.ok) {
      const data = await res.json();
      setHistorico(data);
    }
  };

  const carregarDadosUsuario = async () => {
    const res = await fetch('/api/user/me');
    if (res.ok) {
      const data = await res.json();
      setSaldo(data.saldo || 0);
      setValorInvestido(data.valorInvestido || 0);
      setPontos(data.pontos || 0);
    }
  };

  const handleInvestir = async () => {
    if (!valor || valor <= 0) {
      alert('Digite um valor válido!');
      return;
    }
    if (valor > saldo) {
      alert('Saldo insuficiente!');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/investir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valor }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('Investimento realizado com sucesso!');
      setSaldo(data.user.saldo);
      setValorInvestido(data.user.valorInvestido);
      setPontos(data.user.pontos);
      setValor(0);
      carregarHistorico();
    } else {
      alert(data.error || 'Erro ao investir.');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">💸 Investir</h1>

      <div className="bg-gray-800 text-white p-4 rounded">
        <p>Saldo disponível: <strong>R$ {saldo.toFixed(2)}</strong></p>
        <p>Total investido: <strong>R$ {valorInvestido.toFixed(2)}</strong></p>
        <p>Pontos: <strong>{pontos}</strong></p>
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          value={valor || ''}
          onChange={(e) => setValor(parseFloat(e.target.value))}
          placeholder="Valor a investir"
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleInvestir}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Processando...' : 'Investir'}
        </button>
      </div>

      <div>
        <p className="mb-1">Progresso do Investimento</p>
        <div className="w-full bg-gray-200 rounded h-4">
          <div
            className="bg-green-500 h-4 rounded"
            style={{ width: `${Math.min(valorInvestido, 1000) / 10}%` }}
          ></div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mt-4">Histórico de investimentos</h2>
        {historico.length === 0 ? (
          <p className="text-gray-500">Nenhum investimento realizado ainda.</p>
        ) : (
          <ul className="divide-y divide-gray-300 mt-2">
            {historico.map((inv) => (
              <li key={inv.id} className="py-2 flex justify-between">
                <span>R$ {inv.valor.toFixed(2)}</span>
                <span className="text-gray-500 text-sm">
                  {new Date(inv.criadoEm).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
