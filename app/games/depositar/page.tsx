'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// 🔹 Componente de Badge de Status
function StatusBadge({ status }: { status: string }) {
  const cores: Record<string, string> = {
    confirmado: 'bg-green-500 text-black',
    pendente: 'bg-orange-500 text-black',
    aguardando: 'bg-yellow-500 text-black',
    cancelado: 'bg-red-600 text-white',
    em_analise: 'bg-blue-500 text-white',
  };

  const labels: Record<string, string> = {
    confirmado: 'Confirmado',
    pendente: 'Pendente',
    aguardando: 'Aguardando Vinculação',
    cancelado: 'Cancelado',
    em_analise: 'Em Análise',
  };

  return (
    <span
      className={`ml-2 px-2 py-1 text-xs rounded ${cores[status] || 'bg-gray-600 text-white'}`}
    >
      {labels[status] || status}
    </span>
  );
}

export default function Depositar() {
  const [valor, setValor] = useState('');
  const [copiacola, setCopiacola] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const [historicoPix, setHistoricoPix] = useState<any[]>([]);
  const [onchainConfirmados, setOnchainConfirmados] = useState<any[]>([]);
  const [onchainPendentes, setOnchainPendentes] = useState<any[]>([]);
  const [usuario, setUsuario] = useState<any>(null);

  const { data: session } = useSession();

  useEffect(() => {
    buscarHistorico();
  }, []);

  async function buscarHistorico() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/depositos`, {
        credentials: 'include',
      });
      if (res.ok) {
        const dados = await res.json();
        setHistoricoPix(dados.pix || []);
        setOnchainConfirmados(dados.onchainConfirmados || []);
        setOnchainPendentes(dados.onchainPendentes || []);
        setUsuario(dados.usuario || null);
      }
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    }
  }

  const gerarPix = async () => {
    setErro('');
    setCopiacola('');
    setLoading(true);

    try {
      const response = await axios.post('/api/pix', {
        amount: Number(valor),
        email: session?.user?.email,
      });

      setCopiacola(response.data.copia_e_cola);
      setValor('');
      await buscarHistorico();
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      setErro('Erro ao criar pagamento');
    } finally {
      setLoading(false);
    }
  };

  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(copiacola);
      alert('Código copiado com sucesso!');
    } catch {
      alert('Erro ao copiar o código.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">🕹️ Tela de Depósito</h1>
      <p className="mb-6 text-sm">
        Adicione saldo à sua conta via Pix ou USDT (on-chain).
      </p>

      <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-md">
        {/* Input Pix */}
        <label className="text-white text-sm mb-2 flex items-center gap-1">
          🪙 Valor do Depósito (Pix)
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

        {erro && <p className="text-red-500 mt-3 text-sm">❌ {erro}</p>}

        {copiacola && (
          <div className="mt-4">
            <label className="block text-sm mb-2">
              🔗 Código Pix (copie e cole no seu banco):
            </label>
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

        {/* Histórico Pix */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-green-400 mb-4">
            📜 Histórico via Pix
          </h2>
          {historicoPix.length === 0 ? (
            <p className="text-gray-400">Nenhum depósito Pix registrado ainda.</p>
          ) : (
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {historicoPix.map((item) => (
                <li
                  key={item.id}
                  className="text-sm text-gray-200 border-b border-gray-600 pb-2 flex justify-between items-center"
                >
                  <span>
                    💵 R$ {item.valor.toFixed(2)} –{' '}
                    {new Date(item.criadoEm).toLocaleString('pt-BR')}
                  </span>
                  <StatusBadge status={item.status || 'pendente'} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* On-chain confirmados */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-yellow-400 mb-4">
            ✅ On-Chain Confirmados
          </h2>
          {onchainConfirmados.length === 0 ? (
            <p className="text-gray-400">Nenhum depósito confirmado ainda.</p>
          ) : (
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {onchainConfirmados.map((item) => (
                <li
                  key={item.id}
                  className="text-sm text-gray-200 border-b border-gray-600 pb-2 flex justify-between items-center"
                >
                  <span>
                    💰 {item.amount} USDT –{' '}
                    {new Date(item.createdAt).toLocaleString('pt-BR')} <br />
                    🔗{' '}
                    <a
                      href={`https://bscscan.com/tx/${item.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      Ver no BscScan
                    </a>
                  </span>
                  <StatusBadge status={item.status || 'confirmado'} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* On-chain pendentes */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-orange-400 mb-4">
            ⏳ On-Chain Pendentes
          </h2>
          {onchainPendentes.length === 0 ? (
            <p className="text-gray-400">Nenhum depósito pendente.</p>
          ) : (
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {onchainPendentes.map((item) => (
                <li
                  key={item.id}
                  className="text-sm text-gray-200 border-b border-gray-600 pb-2 flex justify-between items-center"
                >
                  <span>
                    ⚠️ {item.amount} USDT –{' '}
                    {new Date(item.createdAt).toLocaleString('pt-BR')} <br />
                    🔗{' '}
                    <a
                      href={`https://bscscan.com/tx/${item.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      Ver no BscScan
                    </a>
                  </span>
                  <StatusBadge status={item.status || 'pendente'} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Info da Carteira */}
        {usuario?.carteira && (
          <div className="mt-6 text-sm text-gray-400">
            📌 Sua carteira vinculada:
            <span className="text-white ml-1">{usuario.carteira}</span>
          </div>
        )}
      </div>
    </div>
  );
}
