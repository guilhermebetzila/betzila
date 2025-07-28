'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

// Lista de símbolos (emojis)
const symbols = ['🍋', '🔔', '🐯', '🍒', '💎', '🃏', '🍊', '🍇', '🪙']

export default function FortuneJunglePage() {
  const router = useRouter()
  const [columns, setColumns] = useState<string[][]>([[], [], []])
  const [spinning, setSpinning] = useState(false)

  useEffect(() => {
    const generateColumn = () =>
      Array(6)
        .fill(null)
        .map(() => symbols[Math.floor(Math.random() * symbols.length)])
    setColumns([generateColumn(), generateColumn(), generateColumn()])
  }, [])

  const handleSpin = () => {
    if (spinning) return
    setSpinning(true)

    const interval = setInterval(() => {
      const newCols = Array(3)
        .fill(null)
        .map(() =>
          Array(6)
            .fill(null)
            .map(() => symbols[Math.floor(Math.random() * symbols.length)])
        )
      setColumns(newCols)
    }, 80)

    setTimeout(() => {
      clearInterval(interval)
      setSpinning(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-green-900 to-black flex flex-col items-center justify-center text-white px-4">
      <h1 className="text-4xl font-extrabold mb-6 flex items-center gap-2 text-yellow-400">
        🐯 Fortune Jungle
      </h1>

      {/* Colunas */}
      <div className="flex gap-4 bg-yellow-100 p-4 rounded-xl border-4 border-yellow-300 shadow-inner">
        {columns.map((col, colIndex) => (
          <div
            key={colIndex}
            className="flex flex-col gap-2 bg-[#fffbea] p-2 rounded-lg shadow-lg w-20 h-64 overflow-hidden"
          >
            {col.map((symbol, rowIndex) => (
              <div
                key={rowIndex}
                className={`flex items-center justify-center w-full h-16 text-2xl rounded bg-white ${
                  spinning ? 'reel-spin' : ''
                }`}
              >
                {symbol}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Botões */}
      <Button
        onClick={handleSpin}
        disabled={spinning}
        className="mt-6 bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-6 rounded text-lg"
      >
        🎯 Girar
      </Button>

      <Button
        onClick={() => router.push('/dashboard')}
        className="mt-4 bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded"
      >
        ⬅️ Voltar
      </Button>
    </div>
  )
}
