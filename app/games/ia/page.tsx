'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UsuarioComIndicados {
  id: number;
  nome: string;
  email: string;
  indicados: UsuarioComIndicados[];
}

interface UsuarioRede {
  id: number;
  nome: string;
  nivel: number;
  indicados: UsuarioRede[];
  aberto: boolean;
}

export default function RedePage() {
  const [rede, setRede] = useState<UsuarioRede | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarRede() {
      try {
        const res = await fetch('/api/rede');
        if (!res.ok) throw new Error('Erro ao buscar rede');
        const data: UsuarioComIndicados = await res.json();

        function converter(usuario: UsuarioComIndicados, nivel: number): UsuarioRede {
          return {
            id: usuario.id,
            nome: usuario.nome,
            nivel,
            aberto: nivel <= 1,
            indicados: usuario.indicados.map((ind) => converter(ind, nivel + 1)),
          };
        }

        setRede(converter(data, 1));
      } catch (err) {
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }

    carregarRede();
  }, []);

  function toggleNode(node: UsuarioRede) {
    node.aberto = !node.aberto;
    setRede({ ...rede! });
  }

  const nivelColors = [
    'from-blue-700 to-blue-500',
    'from-purple-700 to-purple-500',
    'from-indigo-600 to-indigo-400',
    'from-teal-600 to-teal-400',
    'from-pink-600 to-pink-400',
    'from-yellow-500 to-yellow-300',
    'from-green-600 to-green-400',
    'from-orange-500 to-orange-300',
  ];

  function getGradient(nivel: number) {
    return nivelColors[nivel - 1] || 'from-gray-500 to-gray-300';
  }

  function renderNode(node: UsuarioRede) {
    return (
      <div key={node.id} className="relative flex flex-col items-center mt-6">
        <div
          className="flex items-center gap-2 cursor-pointer select-none z-10"
          onClick={() => toggleNode(node)}
        >
          {node.indicados.length > 0 && (
            <span className="text-white font-bold">{node.aberto ? '▼' : '▶'}</span>
          )}
          <div
            className={`bg-gradient-to-r ${getGradient(
              node.nivel
            )} text-white px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition transform`}
          >
            {node.nome}
          </div>
        </div>

        <AnimatePresence>
          {node.aberto && node.indicados.length > 0 && (
            <motion.div
              key="children"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex mt-8 justify-center relative space-x-8"
            >
              {node.indicados.map((ind, index) => (
                <div key={ind.id} className="relative flex flex-col items-center">
                  {/* Linha vertical */}
                  <div className="absolute top-0 left-1/2 w-px h-6 bg-white/50"></div>

                  {/* Linha horizontal conectando irmãos */}
                  {index > 0 && (
                    <div className="absolute top-3 left-0 w-full h-px bg-white/50"></div>
                  )}

                  {renderNode(ind)}
                </div>
              ))}

              {/* Linha vertical para o nó pai */}
              <div className="absolute top-0 left-1/2 w-px h-6 bg-white/50"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white p-6 overflow-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-400">
        Minha Rede - Visão em Árvore
      </h1>

      {carregando && (
        <p className="text-center text-blue-400">Carregando rede...</p>
      )}

      {!carregando && rede && (
        <div className="overflow-auto p-4 min-w-max flex justify-center">
          {renderNode(rede)}
        </div>
      )}

      {!carregando && !rede && (
        <p className="text-center text-purple-300">Nenhum membro encontrado.</p>
      )}
    </div>
  );
}
