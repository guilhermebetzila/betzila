'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function RegistroPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [indicador, setIndicador] = useState('')
  const [erro, setErro] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  // Pega ?indicador= na URL ou localStorage
  useEffect(() => {
    const indicacaoURL = searchParams.get('indicador')
    if (indicacaoURL) {
      localStorage.setItem('indicador', indicacaoURL)
      setIndicador(indicacaoURL)
    } else {
      const indicacaoLocal = localStorage.getItem('indicador')
      if (indicacaoLocal) setIndicador(indicacaoLocal)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      indicador: indicador.trim() || null,
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/login')
      } else {
        const data = await res.json()
        setErro(data?.message || 'Erro ao registrar')
      }
    } catch (err) {
      setErro('Erro de conexão com o servidor')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Registrar</h1>

      {indicador && (
        <p className="mb-2 text-green-600">
          Você está sendo indicado por: <strong>{indicador}</strong>
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          placeholder="Indicador (opcional)"
          value={indicador}
          onChange={(e) => setIndicador(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        {erro && <p className="text-red-500 text-sm">{erro}</p>}
        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
        >
          Registrar
        </button>
      </form>
    </div>
  )
}
