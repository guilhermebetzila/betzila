// app/layout.tsx
import './globals.css'
import Providers from './Providers'

export const metadata = {
  title: 'Betdreams',
  description: 'App oficial Betdreams',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" data-scroll-behavior="smooth">
      <body className="bg-gray-900 text-white min-h-screen flex overflow-y-auto">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
