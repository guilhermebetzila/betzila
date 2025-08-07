'use client';

import React from 'react';
import { useSidebar } from '@/hooks/context/sidebar-context';

export function Sidebar() {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <aside
      className={`transition-all duration-300 ease-in-out bg-gray-800 text-white h-full ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="p-4">
        <button
          onClick={toggleSidebar}
          className="text-sm bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
        >
          Alternar
        </button>

        {/* Exemplo de conteúdo do menu */}
        {isOpen && (
          <ul className="mt-4 space-y-2">
            <li>Dashboard</li>
            <li>Perfil</li>
            <li>Configurações</li>
          </ul>
        )}
      </div>
    </aside>
  );
}
