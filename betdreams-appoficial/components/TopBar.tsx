'use client'

import Link from 'next/link'

const TopBar = () => {
  return (
    <header className="w-full bg-[#0f0f0f] border-b border-gray-800 text-white px-6 py-2 flex justify-between items-center text-sm">
      {/* Aviso ou botão de download */}
      <div className="flex items-center gap-2">
        <span className="text-green-400">📲</span>
        <p className="text-xs">Faça o download do nosso aplicativo para uma experiência ainda melhor!</p>
        <button className="ml-2 text-xs bg-green-600 px-2 py-1 rounded hover:bg-green-500 transition">
          Download
        </button>
      </div>

      {/* Botões de ação: Registrar e Entrar */}
      <div className="flex items-center gap-2">
        <Link
          href="/registro"
          className="bg-yellow-400 text-black font-bold px-3 py-1 rounded hover:bg-yellow-300 transition"
        >
          🟡 Registre-se
        </Link>
        <Link
          href="/login"
          className="bg-green-600 px-3 py-1 rounded hover:bg-green-500 transition"
        >
          Entrar
        </Link>
      </div>
    </header>
  )
}

export default TopBar
