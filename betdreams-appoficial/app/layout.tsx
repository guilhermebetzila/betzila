import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata = {
  title: 'Betdreams',
  description: 'App oficial Betdreams',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
