'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center bg-[#0a0d1a] min-h-screen">
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

      {/* Copy poderosa */}
      <div className="text-center text-white px-6 max-w-3xl space-y-6 mt-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-yellow-400">🌐 Bem-vindo ao Futuro dos Investimentos</h1>
        <p className="text-xl text-white font-semibold">💥 A Nova Era de Riqueza Começa com um Clique.</p>

        <p className="text-gray-300">
          Imagine uma inteligência artificial que nunca dorme.
          Ela estuda padrões, rastreia bilhões de dados em tempo real, detecta os movimentos mais lucrativos do mercado financeiro tradicional, criptoativos e até mesmo as jogadas mais vantajosas dos maiores cassinos online do mundo.
        </p>
        <p className="text-yellow-400 font-bold text-xl">Agora imagine que você pode investir nela.</p>

        <p className="text-white font-semibold text-lg">📈 Essa é a BetZila.</p>
        <ul className="text-gray-300 space-y-2 text-left">
          <li>💸 Ganhar Dinheiro Dormindo Não É Mais Um Sonho. É Código.</li>
          <li>⚡ Rendimentos Diários com base em estratégias validadas em tempo real.</li>
          <li>🧠 IA Autônoma, treinada para operar nos bastidores enquanto você vive sua vida.</li>
          <li>🌍 Diversificação Inteligente: Wall Street, Bitcoin, Ethereum, Casinos, tudo no mesmo ecossistema.</li>
          <li>🔒 Segurança, Transparência e Controle direto no seu painel pessoal.</li>
        </ul>

        <h2 className="text-white text-xl font-bold mt-6">🎯 Por Que as Pessoas Estão Correndo para a BetZila?</h2>
        <p className="text-gray-300">Porque estão cansadas de promessas vazias.<br />Porque querem liberdade financeira de verdade.<br />Porque sentem que nasceram para mais.</p>

        <ul className="text-gray-300 space-y-1">
          <li>📍 Pagar dívidas.</li>
          <li>🏝️ Viajar o mundo.</li>
          <li>🏡 Dar uma casa nova pra família.</li>
          <li>🕊️ Ou simplesmente, nunca mais trabalhar para ninguém.</li>
        </ul>

        <h2 className="text-yellow-400 font-bold text-2xl mt-6">🚀 Você Está Diante da Sua Grande Virada</h2>
        <p className="text-white font-semibold">Se você está vendo essa página, é porque o universo te deu uma chance.</p>
        <p className="text-white">Não entre para ver. <strong className="text-yellow-400">Entre para mudar sua vida.</strong></p>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Button
            onClick={() => router.push('/login')}
            className="bg-[#8B0000] hover:bg-[#a50000] text-white font-semibold text-lg px-6 py-3 rounded shadow"
          >
            Entrar
          </Button>
          <Button
            onClick={() => router.push('/register')}
            className="bg-[#8B0000] hover:bg-[#a50000] text-white font-semibold text-lg px-6 py-3 rounded shadow"
          >
            Registrar-se
          </Button>
        </div>

        <p className="text-sm text-gray-400 mt-4">🔒 Seguro. Rápido. Sem pegadinhas.</p>
        <p className="text-white text-lg font-bold mt-4">O futuro pertence a quem age agora.<br />BetZila – O Investimento do Século Está a um Clique.</p>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#0a0d1a] text-white py-12 px-6 mt-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-4">CASSINO</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#">Cassino</a></li>
              <li><a href="#">Cassino Ao Vivo</a></li>
              <li><a href="#">Torneios</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">ESPORTES</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#">Ao Vivo</a></li>
              <li><a href="#">Esportes</a></li>
              <li><a href="#">TOP Bets 🏆</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">SUPORTE</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#">Central de Ajuda</a></li>
              <li><a href="#">Termos e Condições</a></li>
              <li><a href="#">Política de Privacidade</a></li>
              <li><a href="#">Política de Bônus</a></li>
              <li><a href="#">Política de PLD/CFTP</a></li>
              <li><a href="#">Jogo Responsável</a></li>
              <li><a href="#">Regras de Apostas Esportivas</a></li>
              <li><a href="#">Gamble Aware</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}
