'use client';

import Link from 'next/link';
import {
  FaChartLine,
  FaRocket,
  FaWallet,
  FaBrain,
  FaGlobe
} from 'react-icons/fa';

export function Sidebar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white flex justify-around items-center h-16 z-50 border-t border-gray-800 md:hidden">
      <Link href="/dashboard">
        <SidebarItem icon={<FaChartLine />} label="Painel" />
      </Link>
      <Link href="/games/ia">
        <SidebarItem icon={<FaRocket />} label="IA" />
      </Link>
      <Link href="/games/investir">
        <SidebarItem icon={<FaWallet />} label="Investir" />
      </Link>
      <Link href="/como-funciona">
        <SidebarItem icon={<FaBrain />} label="Como Funciona" />
      </Link>
      <Link href="/ecossistema">
        <SidebarItem icon={<FaGlobe />} label="Ecosistema" />
      </Link>
    </nav>
  );
}

function SidebarItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-xs hover:text-yellow-400 cursor-pointer">
      <div className="text-lg">{icon}</div>
      <span>{label}</span>
    </div>
  );
}
