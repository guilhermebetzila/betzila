'use client'; // ESSENCIAL para habilitar o uso de contexto React

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/hooks/context/AuthContext'; // ✅ Caminho corrigido

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionProvider>
  );
}
