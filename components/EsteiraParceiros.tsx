'use client';

export function EsteiraParceiros() {
  const parceiros = [
    "Parceiros Nvidia (EUA)",
    "Anthropic (EUA)",
    "HackerSec (BRL)",
    "Axur (BRL)",
    "Apura Cyber Intelligence (BRL)",
    "Totvs (BRL)",
    "Accenture (BRL)",
  ];

  // Texto duplicado para efeito contínuo
  const texto = parceiros.join("   •••   ");

  return (
    <div className="fixed bottom-16 left-0 right-0 overflow-hidden bg-gray-900 text-white py-1 select-none z-[60]">
      <div className="animate-marquee whitespace-nowrap text-sm font-semibold">
        {texto}   •••   {texto}
      </div>
    </div>
  );
}
