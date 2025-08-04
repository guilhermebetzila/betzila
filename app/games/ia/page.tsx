// app/games/ia/page.tsx
import React from 'react';

export default function IaTrabalhandoPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <h1 className="text-4xl font-bold mb-8">IA está trabalhando...</h1>

      <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-500 border-t-transparent"></div>

      <p className="mt-6 text-gray-300 text-lg">Por favor, aguarde enquanto a inteligência artificial processa seu pedido.</p>
    </main>
  );
}
