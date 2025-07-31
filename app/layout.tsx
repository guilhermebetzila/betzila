// app/layout.tsx
import './globals.css';
import Providers from './Providers';

export const metadata = {
  title: 'Betdreams',
  description: 'App oficial Betdreams',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" data-scroll-behavior="smooth" className="h-full w-full">
      <body className="bg-gray-900 text-white h-full w-full min-h-screen overflow-x-hidden">
        <Providers>
          <div className="min-h-screen w-full flex flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
