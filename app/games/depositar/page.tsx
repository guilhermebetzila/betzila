'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export default function Depositar() {
  const [valor, setValor] = useState('');
  const [copiacola, setCopiacola] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [historico, setHistorico] = useState<any[]>([]); // histórico de depósitos

  const { data: session } = useSession();

  useEffect(() => {
    buscarHistorico();
  }, []);

  // Função para buscar histórico
  async function buscarHistorico() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/depositos/historico`, { credentials: 'include' });
      if (res.ok) {
        const dados = await res.json();
        setHistorico(dados);
      }
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    }
  }

  const gerarPix = async () => {
    setErro('')
    setCopiacola('')
    setLoading(true)

    try {
      const response = await axios.post('/api/pix', {
        amount: Number(valor),
        email: session?.user?.email,
      })

      setCopiacola(response.data.copia_e_cola)
      setValor('') // limpa campo após gerar

      await buscarHistorico() // atualiza histórico após gerar Pix
    } catch (error) {
      console.error('Erro ao criar pagamento:', error)
      setErro('Erro ao criar pagamento')
    } finally {
      setLoading(false)
    }
  }

  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(copiacola)
      alert('Código copiado com sucesso!')
    } catch {
      alert('Erro ao copiar o código.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">🕹️ Tela de Depósito</h1>
      <p className="mb-6 text-sm">Adicione saldo à sua conta via Pix.</p>

      <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-md">
        <label className="text-white text-sm mb-2 flex items-center gap-1">
          🪙 Valor do Depósito
        </label>
        <input
          className="w-full p-2 rounded bg-black border border-zinc-700 text-white mb-4"
          type="number"
          placeholder="10"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />

        <button
          onClick={gerarPix}
          disabled={loading || !valor}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition"
        >
          {loading ? 'Gerando Pix...' : '🔒 Gerar Pix'}
        </button>

        {erro && (
          <p className="text-red-500 mt-3 text-sm">❌ {erro}</p>
        )}

        {copiacola && (
          <div className="mt-4">
            <label className="block text-sm mb-2">🔗 Código Pix (copie e cole no seu banco):</label>
            <textarea
              className="w-full bg-zinc-800 text-white p-2 rounded resize-none"
              rows={3}
              readOnly
              value={copiacola}
            />
            <button
              onClick={copiarCodigo}
              className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              📋 Copiar Código
            </button>
          </div>
        )}

        {/* Histórico de Depósitos */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-green-400 mb-4">📜 Histórico de Depósitos</h2>
          {historico.length === 0 ? (
            <p className="text-gray-400">Nenhum depósito registrado ainda.</p>
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
    </div>
  )
}
