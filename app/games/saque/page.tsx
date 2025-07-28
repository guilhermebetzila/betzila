'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SaquePage() {
  const [valor, setValor] = useState('')
  const [chavePix, setChavePix] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [chaveSalva, setChaveSalva] = useState('')
  const router = useRouter()

  useEffect(() => {
    const chave = localStorage.getItem('chavePix')
    if (chave) setChaveSalva(chave)
  }, [])

  const handleSaque = () => {
    if (!valor || parseFloat(valor) <= 0) {
      setMensagem('❌ Digite um valor válido para saque.')
      return
    }

    if (!chaveSalva) {
      setMensagem('⚠️ Cadastre uma chave Pix antes de sacar.')
      return
    }

    setMensagem(`✅ Pedido de saque de R$ ${parseFloat(valor).toFixed(2)} enviado para a chave: ${chaveSalva}`)
  }

  const salvarChavePix = () => {
    if (!chavePix) {
      setMensagem('❌ Digite uma chave Pix válida.')
      return
    }

    localStorage.setItem('chavePix', chavePix)
    setChaveSalva(chavePix)
    setChavePix('')
    setMensagem('✅ Chave Pix salva com sucesso!')
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-4">📤 Tela de Saque</h1>
      <p className="mb-6 text-gray-400">Insira o valor que deseja sacar via Pix.</p>

      <div className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-md">
        <label className="block mb-2 font-semibold">💸 Valor do Saque</label>
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="Digite o valor em R$"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <button
          onClick={handleSaque}
          className="bg-blue-600 hover:bg-blue-700 w-full py-2 rounded font-semibold transition duration-300"
        >
          📤 Receber via Pix
        </button>
      </div>

      <div className="bg-gray-800 mt-6 p-6 rounded-lg shadow-md w-full max-w-md">
        <label className="block mb-2 font-semibold">🔐 Cadastrar chave Pix</label>
        <input
          type="text"
          value={chavePix}
          onChange={(e) => setChavePix(e.target.value)}
          placeholder="E-mail, CPF ou telefone"
          className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
        />
        <button
          onClick={salvarChavePix}
          className="bg-green-600 hover:bg-green-700 w-full py-2 rounded font-semibold transition duration-300"
        >
          💾 Salvar chave Pix
        </button>

        {chaveSalva && (
          <p className="mt-4 text-sm text-gray-300 text-center">
            ✅ Chave cadastrada: <strong>{chaveSalva}</strong>
          </p>
        )}
      </div>

      {mensagem && (
        <p className="mt-6 text-sm text-yellow-400 text-center">{mensagem}</p>
      )}

      <button
        onClick={() => router.push('/dashboard')}
        className="mt-8 bg-white text-black px-6 py-2 rounded hover:bg-gray-100 transition"
      >
        ← Voltar para o Painel
      </button>
    </div>
  )
}
