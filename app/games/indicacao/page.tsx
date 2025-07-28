'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function IndicacaoPage() {
  const router = useRouter()

  const linkConvite = 'https://betdreams.com/convite/bruno123' // simulado

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

      <p className="text-lg mb-4">{linkConvite}</p>

      <div className="flex gap-4">
        <Button
          onClick={copiarLink}
          className="bg-green-600 hover:bg-green-700"
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
