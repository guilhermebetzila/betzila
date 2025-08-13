'use client';

import { useEffect, useState } from 'react';

type UsuarioRede = {
  id: number;
  nome: string;
  nivel: number; // nível de profundidade: 1 até 8
};

export default function RedePage() {
  const [rede, setRede] = useState<UsuarioRede[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarRede() {
      try {
        // Chama sua API que retorna a rede do usuário logado
        const res = await fetch('/api/rede');
        if (!res.ok) throw new Error('Erro ao buscar rede');
        const data = await res.json();
        setRede(data);
      } catch (err) {
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }
    carregarRede();
  }, []);

  // Organiza a rede por nível
  const niveis = Array.from({ length: 8 }, (_, i) => i + 1).map((nivel) => ({
    nivel,
    membros: rede.filter((u) => u.nivel === nivel),
  }));

  return (
    <div className="min-h-screen bg-transparent text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-400">
        Minha Rede
      </h1>

      {carregando && <p className="text-center text-blue-400">Carregando rede...</p>}

      {!carregando && (
        <div className="space-y-8">
          {niveis.map(({ nivel, membros }) => (
            <div
              key={nivel}
              className="rounded-xl p-4 border-2 border-purple-500"
            >
              <h2 className="text-xl font-semibold mb-3 text-blue-400">
                {nivel}º Nível ({membros.length} pessoas)
              </h2>
              {membros.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {membros.map((m) => (
                    <div
                      key={m.id}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg px-4 py-2 shadow-lg hover:scale-105 transition transform"
                    >
                      {m.nome}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-purple-300">
                  Nenhum membro neste nível.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
