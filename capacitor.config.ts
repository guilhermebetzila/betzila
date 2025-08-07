import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'betdreams-appoficial',
  webDir: 'public',
  server: {
    url: 'https://betzila.com.br', // coloque aqui seu domínio ou link da Vercel
    cleartext: true
  }
};

export default config;
