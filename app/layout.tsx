import './globals.css'
import Providers from './Providers'
import { Topbar } from '@/components/TopBar'
import BackgroundDots from '@/components/BackgroundDots'

export const metadata = {
  title: 'Betdreams',
  description: 'App oficial Betdreams',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="relative bg-[#0a0d1a] text-white w-full min-h-screen m-0 p-0 overflow-x-hidden">
        <BackgroundDots />
        <Providers>
          <div className="flex flex-col w-full min-h-screen">
            <Topbar />
            <main className="flex-1 w-full">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
