'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensagem('');
    setCarregando(true);

    if (!email || !senha) {
      setMensagem('Todos os campos são obrigatórios.');
      setCarregando(false);
      return;
    }

    const res = await signIn('credentials', {
      email,
      senha,
      redirect: false,
    });

    if (res?.ok) {
      router.push('/dashboard');
    } else {
      setMensagem('Email ou senha incorretos.');
    }

    setCarregando(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-black text-white">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={carregando}
        >
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      {mensagem && (
        <p className="mt-4 text-sm text-red-500 text-center">{mensagem}</p>
      )}
    </main>
  );
}
