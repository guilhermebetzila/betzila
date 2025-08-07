// /app/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-yellow-400">
          💰 Bem-vindo ao <span className="text-white">BetDreams</span>
        </h1>

        <p className="text-gray-300 text-lg max-w-md mx-auto">
          Aposte com segurança e diversão em nosso cassino online
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => router.push('/login')}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-lg px-6 py-3 rounded shadow"
          >
            Entrar
          </Button>

          <Button
            onClick={() => router.push('/register')}
            className="bg-white hover:bg-gray-100 text-black font-semibold text-lg px-6 py-3 rounded shadow"
          >
            Registrar-se
          </Button>
        </div>
      </div>
    </main>
  )
}
