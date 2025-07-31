'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function InvestirPage() {
  const router = useRouter();
  const valorInvestido = 1500; // 💡 Valor fictício, pode ser dinâmico futuramente

  const investir = () => {
    alert(`Você investiu R$ ${valorInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    // Aqui você poderá futuramente chamar uma API para registrar o investimento no banco
  };

  return (
    <main className="min-h-screen bg-[#0a0d1a] text-white flex flex-col items-center justify-start px-4 py-10">
      <h1 className="text-4xl font-bold text-green-500 mb-6">💰 Investimentos</h1>

      <div className="w-full max-w-xl bg-[#1a1d2e] rounded-xl shadow-lg p-6 space-y-6">
        {/* Valor Investido */}
        <div>
          <h2 className="text-lg text-gray-300 mb-2">Seu valor investido:</h2>
          <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden">
            <div
              className="bg-green-500 h-6 text-sm text-black font-bold text-center"
              style={{ width: `${Math.min(valorInvestido / 20, 100)}%` }}
            >
              R$ {valorInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Juros Diários */}
        <div className="text-center">
          <p className="text-gray-300 text-lg">📈 Acompanhe seus juros diários em tempo real!</p>
        </div>

        {/* Botão Investir */}
        <div className="flex justify-center">
          <Button
            onClick={investir}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-xl"
          >
            Investir R$ {valorInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Button>
        </div>

        {/* Botão Voltar */}
        <div className="flex justify-center">
          <Button
            onClick={() => router.push('/dashboard')}
            className="bg-red-700 hover:bg-red-800 text-white font-semibold px-6 py-3 rounded-xl"
          >
            ← Voltar ao Painel
          </Button>
        </div>
      </div>
    </main>
  );
}
