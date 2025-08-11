/** @type {import('next').NextConfig} */
const nextConfig = {
  // comando export vai gerar arquivos estáticos em /out
  output: 'export', // importante para next export

  // configura para gerar a pasta out
  distDir: '.next', // padrão

  // para evitar problemas de roteamento, deixa assim
  trailingSlash: true, 

  // domínio para imagens externas
  images: {
    domains: ['blob.v0.dev'], 
  }
};

module.exports = nextConfig;
