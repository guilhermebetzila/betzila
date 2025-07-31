// app/convite/[nomeDoUsuario]/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ConvitePage({ params }: { params: { nomeDoUsuario: string } }) {
  const router = useRouter()

  useEffect(() => {
    const { nomeDoUsuario } = params
    // Salva o nome do indicador no localStorage
    localStorage.setItem('indicador', nomeDoUsuario)
    // Redireciona para a página de registro
    router.push('/registro')
  }, [params, router])

  return <p className="text-white p-6">Carregando convite...</p>
}
