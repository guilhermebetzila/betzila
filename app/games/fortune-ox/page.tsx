'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FortuneOxPage() {
  const router = useRouter();

  useEffect(() => {
    // aqui você pode carregar assets ou sockets se quiser
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <button
        onClick={() => router.back()}
        className="mb-4 bg-yellow-500 text-black px-4 py-2 rounded"
      >
        ← Voltar
      </button>

      <h1 className="text-3xl font-bold mb-4">🧧 Fortune OX</h1>

      <div className="w-full h-[500px] bg-gray-900 flex items-center justify-center rounded-xl">
        <p className="text-lg">Aqui vai o jogo ou iframe do Fortune OX 🎮</p>
      </div>
    </div>
  );
}
