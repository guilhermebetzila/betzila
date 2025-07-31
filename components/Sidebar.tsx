'use client';

import React from 'react';
import { useSidebar } from '@/hooks/context/sidebar-context';
import {
  FaBars,
  FaTimes,
  FaRocket,
  FaChartLine,
  FaWallet,
  FaBrain,
  FaBullseye,
  FaGlobe,
  FaUsers,
  FaMoneyBillWave,
  FaVideo,
  FaTelegramPlane,
  FaGift,
  FaHeadset,
  FaFileAlt,
  FaLock
} from 'react-icons/fa';

export function Sidebar() {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <aside
      className={`transition-all duration-300 ease-in-out bg-gray-900 text-white h-screen fixed top-0 left-0 shadow-lg z-50 ${
        isOpen ? 'w-72' : 'w-16'
      }`}
    >
      <div className="p-4 flex flex-col h-full">
        {/* Botão Toggle */}
        <button
          onClick={toggleSidebar}
          className="text-white bg-yellow-500 hover:bg-yellow-600 p-2 rounded w-full flex items-center justify-center"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Painel com indicadores */}
        <div className="mt-6 space-y-4 text-sm">
          {isOpen && (
            <>
              <div className="bg-gray-800 p-3 rounded">
                ⚡ <strong>Rendimento de Hoje:</strong> +R$ 174,23
              </div>
              <div className="bg-gray-800 p-3 rounded">
                📊 <strong>Performance da IA:</strong> 12,8% semanais
              </div>
            </>
          )}
        </div>

        {/* Navegação principal */}
        <nav className="mt-6 space-y-4 flex-1 text-sm">
          <SidebarItem icon={<FaChartLine />} label="Painel de Controle" isOpen={isOpen} />
          <SidebarItem icon={<FaRocket />} label="Visão Geral da IA" isOpen={isOpen} />
          <SidebarItem icon={<FaWallet />} label="Investimentos Ativos" isOpen={isOpen} />
          <SidebarItem icon={<FaBrain />} label="Como Funciona a BetZila" isOpen={isOpen} />
          <SidebarItem icon={<FaBullseye />} label="Missão: Liberdade Financeira" isOpen={isOpen} />
          <SidebarItem icon={<FaGlobe />} label="Ecossistema BetZila" isOpen={isOpen} />
        </nav>

        {/* Impacto e comunidade */}
        <div className="space-y-4 text-sm">
          {isOpen && (
            <>
              <div className="bg-gray-800 p-3 rounded">
                🫂 <strong>Pessoas Impactadas:</strong> +12.452
              </div>
              <div className="bg-gray-800 p-3 rounded">
                💰 <strong>Total Gerado:</strong> R$ 14.250.000+
              </div>
              <SidebarItem icon={<FaVideo />} label="Depoimentos" isOpen={isOpen} />
              <SidebarItem icon={<FaTelegramPlane />} label="Canal VIP Telegram/Discord" isOpen={isOpen} />
              <SidebarItem icon={<FaGift />} label="Convidar Amigos" isOpen={isOpen} />
              <SidebarItem icon={<FaHeadset />} label="Suporte VIP 24/7" isOpen={isOpen} />
              <SidebarItem icon={<FaFileAlt />} label="Termos e Riscos" isOpen={isOpen} />
              <SidebarItem icon={<FaLock />} label="Segurança e Transparência" isOpen={isOpen} />
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, isOpen }: { icon: React.ReactNode; label: string; isOpen: boolean }) {
  return (
    <div className="flex items-center space-x-2 hover:bg-gray-700 px-3 py-2 rounded cursor-pointer">
      {icon}
      {isOpen && <span>{label}</span>}
    </div>
  );
}
