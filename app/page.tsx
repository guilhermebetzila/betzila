'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import EsteiraSaques from '@/components/EsteiraSaques';

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col min-h-screen w-full bg-[#0a0d1a] text-white overflow-x-hidden">
      {/* Esteira de saques */}
      <EsteiraSaques />

      {/* Avatar */}
      <div className="w-full flex justify-center mt-8 mb-4">
        <Image
          src="/img/betzila.png"
          alt="Avatar BetZila"
          width={160}
          height={160}
          className="sm:w-[160px] sm:h-[160px] w-[120px] h-[120px] rounded-xl shadow-xl"
        />
      </div>

      {/* Botões Login/Registro */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <Button
          onClick={() => router.push('/login')}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold text-lg px-6 py-3 rounded shadow"
        >
          Entrar
        </Button>
        <Button
          onClick={() => router.push('/register')}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold text-lg px-6 py-3 rounded shadow"
        >
          Registrar-se
        </Button>
      </div>

      {/* Conteúdo principal */}
      <div className="w-full flex flex-col items-center px-6 sm:px-12 lg:px-20 xl:px-32 mt-6 space-y-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-green-400">
          🌐 Bem-vindo ao Futuro dos Investimentos
        </h1>
        <p className="text-xl font-semibold text-white">
          💥 A Nova Era de Riqueza Começa com um Clique.
        </p>

        <p className="text-gray-300 max-w-4xl">
          Imagine uma inteligência artificial que nunca dorme.
          Ela estuda padrões, rastreia bilhões de dados em tempo real, detecta os movimentos mais lucrativos do mercado financeiro tradicional, criptoativos e até mesmo as jogadas mais vantajosas dos maiores cassinos online do mundo.
        </p>

        <p className="text-green-400 font-bold text-xl">Agora imagine que você pode investir nela.</p>

        <p className="text-white font-semibold text-lg">📈 Essa é a BetZila.</p>

        <ul className="text-gray-300 space-y-2 text-left max-w-3xl">
          <li>💸 Ganhar Dinheiro Dormindo Não É Mais Um Sonho. É Código.</li>
          <li>⚡ Rendimentos Diários com base em estratégias validadas em tempo real.</li>
          <li>🧠 IA Autônoma, treinada para operar nos bastidores enquanto você vive sua vida.</li>
          <li>🌍 Diversificação Inteligente: Wall Street, Bitcoin, Ethereum, Casinos, tudo no mesmo ecossistema.</li>
          <li>🔒 Segurança, Transparência e Controle direto no seu painel pessoal.</li>
        </ul>

        <h2 className="text-white text-xl font-bold mt-6">🎯 Por Que as Pessoas Estão Correndo para a BetZila?</h2>
        <p className="text-gray-300 max-w-3xl">
          Porque estão cansadas de promessas vazias.<br />
          Porque querem liberdade financeira de verdade.<br />
          Porque sentem que nasceram para mais.
        </p>

        <ul className="text-gray-300 space-y-1 text-left max-w-3xl">
          <li>📍 Pagar dívidas.</li>
          <li>🏝️ Viajar o mundo.</li>
          <li>🏡 Dar uma casa nova pra família.</li>
          <li>🕊️ Ou simplesmente, nunca mais trabalhar para ninguém.</li>
        </ul>

        <h2 className="text-green-400 font-bold text-2xl mt-6">
          🚀 Você Está Diante da Sua Grande Virada
        </h2>
        <p className="text-white font-semibold">
          Se você está vendo essa página, é porque o universo te deu uma chance.
        </p>
        <p className="text-white">
          Não entre para ver. <strong className="text-green-400">Entre para mudar sua vida.</strong>
        </p>

        <p className="text-sm text-gray-400 mt-4">
          🔒 Seguro. Rápido. Sem pegadinhas.
        </p>
        <p className="text-white text-lg font-bold mt-4">
          O futuro pertence a quem age agora.<br />
          BetZila – O Investimento do Século Está a um Clique.
        </p>
      </div>

      {/* Rodapé */}
      <footer className="w-full bg-[#0a0d1a] text-white py-12 px-6 mt-20 border-t border-gray-700">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <h3 className="font-bold mb-4 text-blue-400">🔹 SOBRE NÓS</h3>
            <ul className="space-y-2 text-gray-300">
              <li>O que é a BetZila</li>
              <li>Inteligência Artificial e Estratégias</li>
              <li>Transparência e Tecnologia</li>
              <li>Nossa Missão</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-blue-400">🔹 PRODUTOS</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Investimento com IA</li>
              <li>Diversificação Inteligente</li>
              <li>Rendimento Diário Automatizado</li>
              <li>Painel do Investidor</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-blue-400">🔹 SUPORTE</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Central de Ajuda</li>
              <li>Termos de Uso</li>
              <li>Política de Privacidade</li>
              <li>Segurança & Confiabilidade</li>
              <li>Contato</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-blue-400">🔹 LEGALIDADE</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Conformidade com PLD/CFT</li>
              <li>Declaração de Riscos</li>
              <li>Política de Dados</li>
              <li>Auditorias e Certificações</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 text-center text-gray-400 text-sm">
          <div className="mb-2">🔒 Criptografia SSL 256 bits — Site Seguro</div>
          <div className="mb-2">🌐 BetZila © 2025 — Todos os direitos reservados.</div>
          <div className="italic">Tecnologia, Liberdade Financeira e Transparência em um só clique.</div>
          <div className="mt-2 text-xs text-gray-500">
            Este site não oferece serviços de jogos de azar. A BetZila é uma plataforma tecnológica voltada para inteligência financeira.
          </div>
        </div>
      </footer>
    </main>
  );
}
