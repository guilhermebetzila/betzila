'use client';

import Link from 'next/link';

export function Topbar() {
  return (
    <div className="fixed top-0 right-0 z-50 p-4 flex gap-4">
      <Link href="/login">
        <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-1 px-4 rounded">
          Entrar
        </button>
      </Link>
      <Link href="/register">
        <button className="bg-white hover:bg-gray-200 text-black font-bold py-1 px-4 rounded border">
          Registrar-se
        </button>
      </Link>
    </div>
  );
}
