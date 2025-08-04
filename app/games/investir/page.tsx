'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function InvestirPage() {
  const router = useRouter();
  const [saldo, setSaldo] = useState(1500);
  const [valorInvestido, setValorInvestido] = useState(0);
  const [valorParaInvestir, setValorParaInvestir] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historico, setHistorico] = useState<any[]>([]);
  const [cpf, setCpf] = useState<string>('');

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch('/api/me', { credentials: 'include' });
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (!data.user?.cpf || data.user.cpf.replace(/[^\d]/g, '').length !== 11) {
        alert('❌ Por favor, cadastre um CPF válido antes de investir.');
        router.push('/games/cadastrar-cpf'); // redireciona para cadastrar CPF
        return;
      }
      setCpf(data.user.cpf);
      setSaldo(data.user.saldo || 1500);
      setValorInvestido(data.user.valorInvestido || 0);
    }

    async function buscarHistorico() {
      const res = await fetch('/api/investir/historico');
      if (res.ok) {
        const dados = await res.json();
        setHistorico(dados);
      }
    }

    checkAuth();
    buscarHistorico();
  }, [router]);

  async function investirValor() {
    setError(null);

    const valor = parseFloat(valorParaInvestir.replace(',', '.'));
    if (isNaN(valor) || valor <= 0) {
      setError('Digite um valor válido maior que zero.');
      return;
    }
    if (valor > saldo) {
      setError('Saldo insuficiente para esse investimento.');
      return;
    }

    if (!cpf || cpf.replace(/[^\d]/g, '').length !== 11) {
      setError('Você precisa cadastrar um CPF válido para investir.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/investir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valor }),
        credentials: 'include',
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao investir valor.');
      } else {
        setSaldo(data.user.saldo);
        setValorInvestido(data.user.valorInvestido);
        setValorParaInvestir('');
        await atualizarHistorico();
      }
    } catch (err) {
      setError('Erro na conexão.');
    } finally {
      setLoading(false);
    }
  }

  async function atualizarHistorico() {
    const res = await fetch('/api/investir/historico');
    if (res.ok) {
      const dados = await res.json();
      setHistorico(dados);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0d1a] text-white flex flex-col items-center justify-start px-4 py-10">
      <h1 className="text-4xl font-bold text-green-500 mb-6">💰 Investimentos</h1>

      <div className="w-full max-w-xl bg-[#1a1d2e] rounded-xl shadow-lg p-6 space-y-6">
        <div>
          <h2 className="text-lg text-gray-300 mb-2">Seu valor investido:</h2>
          <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden">
            <div
              className="bg-green-500 h-6 text-sm text-black font-bold text-center transition-all duration-300"
              style={{ width: `${Math.min((valorInvestido / 20) * 100, 100)}%` }}
            >
              R$ {valorInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-300 text-lg">📈 Acompanhe seus juros diários em tempo real!</p>
        </div>

        <div>
          <label htmlFor="valorInvestir" className="block mb-2 text-gray-300 font-semibold">
            Digite o valor que deseja investir:
          </label>
          <input
            type="text"
            id="valorInvestir"
            value={valorParaInvestir}
            onChange={(e) => setValorParaInvestir(e.target.value)}
            placeholder="Ex: 1000,00"
            className="w-full rounded-md p-3 bg-gray-700 text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={investirValor}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white text-sm px-5 py-2 rounded-lg transition-all shadow-md disabled:opacity-60"
          >
            {loading ? 'Investindo...' : 'Investir Valor'}
          </button>

          <button
            onClick={() => router.push('/dashboard')}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-5 py-2 rounded-lg transition-all shadow-md"
          >
            ← Voltar
          </button>
        </div>

        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-green-400 mb-4">📜 Histórico de Investimentos</h3>
          {historico.length === 0 ? (
            <p className="text-gray-400">Nenhum investimento registrado ainda.</p>
          ) : (
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {historico.map((item) => (
                <li key={item.id} className="text-sm text-gray-200 border-b border-gray-600 pb-2">
                  💵 R$ {item.valor.toFixed(2)} – {new Date(item.criadoEm).toLocaleString('pt-BR')}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
