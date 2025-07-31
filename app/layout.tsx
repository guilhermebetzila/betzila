// app/layout.tsx
import './globals.css'
import Providers from './Providers'
import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/TopBar' // ainda incluído se precisar usar
import { Header } from '@/components/header'

export const metadata = {
  title: 'Betdreams',
  description: 'App oficial Betdreams',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className="w-full h-full overflow-x-hidden">
      <body className="w-full min-h-screen bg-[#0a0d1a] text-white m-0 p-0 overflow-x-hidden">
        <Providers>
          <div className="flex flex-col w-full min-h-screen">
            {/* Header (barra verde com logo e busca) */}
            <Header />

            {/* Conteúdo principal */}
            <main className="flex-1 w-full">{children}</main>

            {/* Apenas o Sidebar fixo no rodapé */}
            <Sidebar />
          </div>
        </Providers>
      </body>
    </html>
  )
}

