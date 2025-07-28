'use client';

import React from 'react';
import { useSidebar } from '@/hooks/context/sidebar-context';
import {
  FaBars,
  FaTimes,
  FaGamepad,
  FaFutbol,
  FaDice,
  FaTicketAlt,
  FaBomb,
  FaRocket,
  FaStar,
  FaChessBoard,
  FaCoins
} from 'react-icons/fa';

export function Sidebar() {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <aside
      className={`transition-all duration-300 ease-in-out bg-gray-900 text-white h-screen fixed top-0 left-0 shadow-lg z-50 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="p-4 flex flex-col h-full">
        <button
          onClick={toggleSidebar}
          className="text-white bg-yellow-500 hover:bg-yellow-600 p-2 rounded w-full flex items-center justify-center"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav className="mt-6 space-y-4 flex-1">
          <div className="flex items-center space-x-2 hover:bg-gray-700 px-3 py-2 rounded cursor-pointer">
            <FaGamepad />
            {isOpen && <span>Ao Vivo</span>}
          </div>
          <div className="flex items-center space-x-2 hover:bg-gray-700 px-3 py-2 rounded cursor-pointer">
            <FaTicketAlt />
            {isOpen && <span>Bingo</span>}
          </div>
          <div className="flex items-center space-x-2 hover:bg-gray-700 px-3 py-2 rounded cursor-pointer">
            <FaDice />
            {isOpen && <span>Cassino</span>}
          </div>
          <div className="flex items-center space-x-2 hover:bg-gray-700 px-3 py-2 rounded cursor-pointer">
            <FaFutbol />
            {isOpen && <span>Esportes</span>}
          </div>

          {/* Novos Itens de Jogos */}
          <div className="flex items-center space-x-2 hover:bg-gray-700 px-3 py-2 rounded cursor-pointer">
            <FaStar />
            {isOpen && <span>Slots</span>}
          </div>
          <div className="flex items-center space-x-2 hover:bg-gray-700 px-3 py-2 rounded cursor-pointer">
            <FaBomb />
            {isOpen && <span>Mines</span>}
          </div>
          <div className="flex items-center space-x-2 hover:bg-gray-700 px-3 py-2 rounded cursor-pointer">
            <FaRocket />
            {isOpen && <span>Aviator</span>}
          </div>
          <div className="flex items-center space-x-2 hover:bg-gray-700 px-3 py-2 rounded cursor-pointer">
            <FaChessBoard />
            {isOpen && <span>Bingo Torneios</span>}
          </div>
        </nav>
      </div>
    </aside>
  );
}
