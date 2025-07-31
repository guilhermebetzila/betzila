'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/context/AuthContext'
import { useEffect, useState } from 'react'

export default function IndicacaoPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [linkConvite, setLinkConvite] = useState('')

  useEffect(() => {
    if (user?.nome) {
      // Gera o link baseado no nome do usuário
      const nomeFormatado = user.nome.toLowerCase().replace(/\s+/g, '')
      const link = `https://betdreams.com/convite/${nomeFormatado}`
      setLinkConvite(link)
    }
  }, [user])

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(linkConvite)
      alert('Link copiado com sucesso!')
    } catch (err) {
      alert('Erro ao copiar o link')
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">🔗 Link de Indicação</h1>

      {user ? (
        <>
          <p className="text-lg mb-2">Bem-vindo, {user.nome}!</p>
          <p className="text-lg mb-4">{linkConvite}</p>
        </>
      ) : (
        <p className="text-lg mb-4 text-red-500">Carregando usuário...</p>
      )}

      <div className="flex gap-4">
        <Button
          onClick={copiarLink}
          className="bg-green-600 hover:bg-green-700"
          disabled={!linkConvite}
        >
          📋 Copiar Link
        </Button>
        <Button
          onClick={() => router.back()}
          className="bg-white text-black hover:bg-gray-300"
        >
          🔙 Voltar
        </Button>
      </div>
    </main>
  )
}
