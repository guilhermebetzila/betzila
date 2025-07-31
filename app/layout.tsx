import './globals.css'
import Providers from './Providers'
import { Topbar } from '@/components/TopBar'

export const metadata = {
  title: 'Betdreams',
  description: 'App oficial Betdreams',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className="w-full h-full overflow-x-hidden">
      <body className="m-0 p-0 w-full min-h-screen bg-[#0a0d1a] text-white overflow-x-hidden">
        <Providers>
          <div className="flex flex-col w-full min-h-screen">
            <Topbar />
            <main className="flex-1 w-full max-w-none">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
