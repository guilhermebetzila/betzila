/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removi o output: 'export' para que o Next.js rode em modo SSR normal, permitindo rotas API
  // output: 'export',

  distDir: '.next', // padrão

  trailingSlash: true,

  images: {
    domains: ['blob.v0.dev'],
  },
};

module.exports = nextConfig;
