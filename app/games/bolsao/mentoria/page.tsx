'use client';

import React from 'react';

export default function MentoriaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 text-white flex flex-col items-center p-6 space-y-12">

      {/* Barra de Mentoria */}
      <header className="w-full max-w-4xl flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500 p-6 rounded-2xl shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide text-white drop-shadow-lg">
          🎓 Mentoria
        </h1>
      </header>

      {/* Quadrados das Aulas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Aula 1 */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center transition-transform transform hover:scale-105 hover:shadow-pink-500/50 cursor-pointer">
          <div className="w-32 h-32 bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
            {/* Aqui você vai adicionar a imagem */}
            <span className="text-white text-xl font-bold">Aula 1</span>
          </div>
          <p className="text-center font-semibold text-lg">Introdução ao Controle Financeiro</p>
        </div>

        {/* Aula 2 */}
        <div className="bg-gradient-to-br from-purple-700 to-pink-600 rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center transition-transform transform hover:scale-105 hover:shadow-green-500/50 cursor-pointer">
          <div className="w-32 h-32 bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
            {/* Aqui você vai adicionar a imagem */}
            <span className="text-white text-xl font-bold">Aula 2</span>
          </div>
          <p className="text-center font-semibold text-lg">Desenvolvendo sua Saúde Emocional</p>
        </div>

        {/* Aula 3 */}
        <div className="bg-gradient-to-br from-pink-600 to-red-500 rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center transition-transform transform hover:scale-105 hover:shadow-yellow-500/50 cursor-pointer">
          <div className="w-32 h-32 bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
            {/* Aqui você vai adicionar a imagem */}
            <span className="text-white text-xl font-bold">Aula 3</span>
          </div>
          <p className="text-center font-semibold text-lg">Tomando Controle da Sua Vida</p>
        </div>
      </div>

      {/* Frase de impacto */}
      <div className="max-w-3xl text-center px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
          Aprenda a cuidar e desenvolver sua saúde financeira e emocional, tomando controle da sua vida de forma consciente e poderosa.
        </h2>
      </div>

      {/* Efeitos decorativos (opcional) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.05)_0%,_transparent_70%)] animate-pulse-slow"></div>
      </div>

      {/* Estilos customizados */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s infinite alternate;
        }
      `}</style>

    </div>
  );
}
