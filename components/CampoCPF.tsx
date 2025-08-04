'use client';

import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';

type Props = {
  cpfInicial?: string;
  onSalvar: (cpf: string) => void;
};

export default function CampoCPF({ cpfInicial = '', onSalvar }: Props) {
  const [cpf, setCpf] = useState(cpfInicial);
  const [editando, setEditando] = useState(!cpfInicial);
  const [erro, setErro] = useState('');

  useEffect(() => {
    setCpf(cpfInicial);
    setEditando(!cpfInicial);
  }, [cpfInicial]);

  const validarCPF = (valor: string) => {
    const somenteNumeros = valor.replace(/[^\d]/g, '');
    return somenteNumeros.length === 11;
  };

  const salvar = () => {
    if (!validarCPF(cpf)) {
      setErro('CPF inválido');
      return;
    }
    setErro('');
    setEditando(false);
    onSalvar(cpf);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow border border-green-500 max-w-md mx-auto mb-6">
      <label className="block text-sm font-semibold text-white mb-2">CPF (para depósitos via Pix)</label>

      {editando ? (
        <div className="flex gap-2 items-center">
          <InputMask
            mask="999.999.999-99"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className="bg-gray-700 text-white p-2 rounded w-full outline-none"
            placeholder="Digite seu CPF"
          />
          <button
            onClick={salvar}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
          >
            Salvar
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-green-400">{cpf}</span>
          <button
            onClick={() => setEditando(true)}
            className="text-sm text-blue-400 hover:underline"
          >
            Editar
          </button>
        </div>
      )}

      {erro && <p className="text-red-400 text-sm mt-2">{erro}</p>}
    </div>
  );
}
