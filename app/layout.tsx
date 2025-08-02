import './globals.css'
import Providers from './Providers'
import { Topbar } from '@/components/TopBar'

export const metadata = {
  title: 'Betdreams',
  description: 'App oficial Betdreams',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="relative bg-[#0a0d1a] text-white w-full min-h-screen m-0 p-0 overflow-x-hidden">
        {/* Fundo de bolinhas pulsantes */}
        <div className="background-dots fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
          {[...Array(30)].map((_, i) => {
            const size = 4 + Math.random() * 6
            const top = Math.random() * 100
            const left = Math.random() * 100
            const delay = Math.random() * 3
            return (
              <span
                key={i}
                style={{
                  width: size + 'px',
                  height: size + 'px',
                  top: top + 'vh',
                  left: left + 'vw',
                  animationDelay: delay + 's',
                }}
                className="absolute rounded-full bg-[rgba(0,200,83,0.3)] filter drop-shadow-[0_0_4px_rgba(0,200,83,0.7)] animate-pulseDot"
              />
            )
          })}
        </div>

        <Providers>
          <div className="flex flex-col w-full min-h-screen">
            <Topbar />
            <main className="flex-1 w-full">
              {children}
            </main>
          </div>
        </Providers>

        <style jsx global>{`
          body, main {
            background: linear-gradient(270deg, #0a0d1a, #121524, #001f1f, #0a0d1a);
            background-size: 800% 800%;
            animation: gradientShift 30s ease infinite;
          }

          @keyframes gradientShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          @keyframes pulseDot {
            0%, 100% {
              opacity: 0.3;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.3);
            }
          }

          .animate-pulseDot {
            animation-name: pulseDot;
            animation-duration: 3s;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
            transform-origin: center;
          }
        `}</style>
      </body>
    </html>
  )
}
