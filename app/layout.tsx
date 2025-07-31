import './globals.css'
import Providers from './Providers'
import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/TopBar'

export const metadata = {
  title: 'Betdreams',
  description: 'App oficial Betdreams',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className="w-full h-full overflow-x-hidden">
      <body className="m-0 p-0 w-full min-h-screen bg-background text-foreground">
        <Providers>
          <div className="flex flex-col w-full min-h-screen">
            <Topbar />
            {/* <Header /> REMOVIDO conforme solicitado */}
            <main className="flex-1 w-full">{children}</main>
            <Sidebar />
          </div>
        </Providers>
      </body>
    </html>
  )
}
