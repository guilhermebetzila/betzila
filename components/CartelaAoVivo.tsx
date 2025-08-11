'use client';

import { useEffect, useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export default function CartelaAoVivo() {
  const [cartela, setCartela] = useState<number[]>([]);
  const [bolas, setBolas] = useState<number[]>([]);

  useEffect(() => {
    const fetchTudo = async () => {
      const resCart = await fetch(`${API_BASE_URL}/api/cartelas/minha`);
      const dataCart = resCart.ok ? await resCart.json() : null;

      const resBolas = await fetch(`${API_BASE_URL}/api/partida/bolasSorteadas`);
      const dataBolas = resBolas.ok ? await resBolas.json() : null;

      if (dataCart?.cartelas?.[0]?.numeros) {
        setCartela(dataCart.cartelas[0].numeros.map((n: any) => n.numero));
      }
      if (Array.isArray(dataBolas)) {
        setBolas(dataBolas.map((b: { numero: number }) => b.numero));
      }
    };

    fetchTudo();
    const iv = setInterval(fetchTudo, 5000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="grid grid-cols-5 gap-2 p-4 bg-white rounded shadow">
      {cartela.map((num, idx) => (
        <div
          key={idx}
          className={`w-12 h-12 flex items-center justify-center font-bold rounded-full ${
            bolas.includes(num) ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'
          }`}
        >
          {num}
        </div>
      ))}
    </div>
  );
}
