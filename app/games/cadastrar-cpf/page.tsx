'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CadastrarCpfPage() {
  const router = useRouter();
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCpf() {
      const res = await fetch('/api/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.user?.cpf) setCpf(data.user.cpf);
      } else {
        router.push('/login');
      }
    }
    fetchCpf();
  }, [router]);

  function formatCpf(value: string) {
    let v = value.replace(/\D/g, '');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return v;
  }

  function handleCpfChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCpf(formatCpf(e.target.value));
  }

  function validarCpf(cpf: string) {
    return cpf.replace(/\D/g, '').length === 11;
  }

  async function salvarCpf() {
    if (!validarCpf(cpf)) {
      alert('❌ CPF inválido. Digite corretamente.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/user/atualizar-cpf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf }),
        credentials: 'include',
      });
      if (res.ok) {
        alert('✅ CPF salvo com sucesso!');
        router.push('/investir'); // redireciona para investir após salvar
      } else {
        alert('❌ Erro ao salvar CPF.');
      }
    } catch {
      alert('❌ Erro ao salvar CPF.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0d1a] flex flex-col items-center justify-center px-4 py-10 text-white">
      <h1 className="text-3xl font-bold mb-8 text-green-500">📝 Cadastro de CPF</h1>
      <div className="w-full max-w-md bg-[#1a1d2e] rounded-xl p-6 shadow-lg">
        <label htmlFor="cpf" className="block mb-2 font-semibold text-gray-300">
          Digite seu CPF:
        </label>
        <input
          id="cpf"
          type="text"
          maxLength={14}
          value={cpf}
          onChange={handleCpfChange}
          placeholder="000.000.000-00"
          className="w-full rounded-md p-3 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
        />
        <button
          onClick={salvarCpf}
          disabled={loading}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold shadow-md disabled:opacity-60 transition"
        >
          {loading ? 'Salvando...' : 'Salvar CPF'}
        </button>
      </div>
    </main>
  );
}
