'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function InvestirPage() {
  const router = useRouter()
  const [saldo, setSaldo] = useState(1500) // Substitua com fetch real do saldo
  const [valorInvestido, setValorInvestido] = useState(0)
  const [valorParaInvestir, setValorParaInvestir] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function investirValor() {
    setError(null)

    const valor = parseFloat(valorParaInvestir.replace(',', '.'))

    if (isNaN(valor) || valor <= 0) {
      setError('Digite um valor válido maior que zero.')
      return
    }
    if (valor > saldo) {
      setError('Saldo insuficiente para esse investimento.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/investir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valor }),
        credentials: 'include',  // Envia os cookies junto
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao investir valor.')
      } else {
        setSaldo(data.user.saldo)
        setValorInvestido(data.user.valorInvestido)
        setValorParaInvestir('')
      }
    } catch (err) {
      setError('Erro na conexão.')
    } finally {
      setLoading(false)
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
              className="bg-green-500 h-6 text-sm text-black font-bold text-center"
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
          <Button
            onClick={investirValor}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl"
          >
            {loading ? 'Investindo...' : 'Investir Valor'}
          </Button>

          <Button
            onClick={() => router.push('/dashboard')}
            className="bg-red-700 hover:bg-red-800 text-white font-semibold px-6 py-3 rounded-xl"
          >
            ← Voltar ao Painel
          </Button>
        </div>

        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    </main>
  )
}
