'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// Simulação de ganhadores
const nomes = ['Lucas', 'Ana', 'Carlos', 'Fernanda', 'João', 'Paula', 'Guilherme', 'Sofia'];
const jogos = [
  { name: 'Slot Tigrinho', image: '/img/jogo1.png' },
  { name: 'Dados Dourados', image: '/img/jogo2.png' },
  { name: 'Roleta Turbo', image: '/img/jogo3.png' },
  { name: 'Touros Loucos', image: '/img/jogo4.png' },
];

function gerarItem() {
  const nome = nomes[Math.floor(Math.random() * nomes.length)];
  const valor = 200 + Math.floor(Math.random() * 800);
  const jogo = jogos[Math.floor(Math.random() * jogos.length)];
  return { nome, valor, jogo };
}

export default function Home() {
  const router = useRouter();

  const [ganhos, setGanhos] = useState(() => Array.from({ length: 10 }, gerarItem));

  useEffect(() => {
    const interval = setInterval(() => {
      setGanhos((prev) => [...prev.slice(1), gerarItem()]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const games = [
    { id: 1, name: 'Jogo 1', image: '/img/jogo1.png' },
    { id: 2, name: 'Jogo 2', image: '/img/jogo2.png' },
    { id: 3, name: 'Jogo 3', image: '/img/jogo3.png' },
    { id: 4, name: 'Jogo 4', image: '/img/jogo4.png' },
    { id: 5, name: 'Jogo 5', image: '/img/jogo5.png' },
    { id: 6, name: 'Jogo 6', image: '/img/jogo6.png' },
    { id: 7, name: 'Jogo 7', image: '/img/jogo7.png' },
    { id: 8, name: 'Jogo 8', image: '/img/jogo8.png' },
  ];

  const liveGames = [
    { id: 1, name: 'Cassino 1', image: '/img/cassino1.png' },
    { id: 2, name: 'Cassino 2', image: '/img/cassino2.png' },
    { id: 3, name: 'Cassino 3', image: '/img/cassino3.png' },
    { id: 4, name: 'Cassino 4', image: '/img/cassino4.png' },
  ];

  const mostPlayed = [
    { id: 1, name: 'Mais Jogado 1', image: '/img/mais1.png' },
    { id: 2, name: 'Mais Jogado 2', image: '/img/mais2.png' },
    { id: 3, name: 'Mais Jogado 3', image: '/img/mais3.png' },
    { id: 4, name: 'Mais Jogado 4', image: '/img/mais4.png' },
  ];

  const odds = [
    {
      id: 1,
      time1: 'Flamengo',
      time2: 'Atlético-MG',
      data: '27.07.25, 20:30',
      odds: ['1.46', '4.33', '8.00'],
    },
    {
      id: 2,
      time1: 'Grêmio',
      time2: 'Fortaleza',
      data: '29.07.25, 20:30',
      odds: ['2.26', '3.29', '3.50'],
    },
    {
      id: 3,
      time1: 'Dila Gori',
      time2: 'Riga FC',
      data: '31.07.25, 13:00',
      odds: ['3.64', '3.40', '2.09'],
    },
  ];

  return (
    <main className="flex flex-col items-center justify-center bg-[#0a0d1a]">

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

      {/* Boas-vindas */}
      <div className="text-center space-y-6 mt-6 px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-yellow-400">
          💰 Bem-vindo ao <span className="text-white">BetZila</span>
        </h1>

        <p className="text-gray-300 text-lg max-w-md mx-auto">
          Aposte com segurança e diversão em nosso cassino online
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button onClick={() => router.push('/login')} className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-lg px-6 py-3 rounded shadow">
            Entrar
          </Button>
          <Button onClick={() => router.push('/register')} className="bg-white hover:bg-gray-100 text-black font-semibold text-lg px-6 py-3 rounded shadow">
            Registrar-se
          </Button>
        </div>
      </div>

      {/* Esteira Horizontal de Ganhadores */}
      <div className="w-full bg-[#121826] py-2 overflow-hidden relative border-y border-yellow-500 mb-10 mt-10">
        <div className="flex animate-marquee gap-4 whitespace-nowrap px-4">
          {ganhos.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-gray-800 px-3 py-2 rounded-xl shadow min-w-max"
            >
              <Image
                src={item.jogo.image}
                alt={item.jogo.name}
                width={36}
                height={36}
                className="rounded"
              />
              <div className="text-white text-sm">
                <p><strong className="text-yellow-400">{item.nome}</strong> ganhou <strong>R$ {item.valor}</strong></p>
                <p className="text-xs text-gray-400">{item.jogo.name}</p>
              </div>
            </div>
          ))}
        </div>
        <style jsx>{`
          .animate-marquee {
            animation: marquee 25s linear infinite;
          }
          @keyframes marquee {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}</style>
      </div>

      {/* Jogos Populares */}
      <div className="w-full max-w-6xl mt-4 px-4">
        <h2 className="text-3xl font-bold text-white mb-6">🎮 Jogos Populares</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 pb-16">
          {games.map((game) => (
            <div key={game.id} className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
              <Image
                src={game.image}
                alt={game.name}
                width={300}
                height={200}
                className="object-cover w-full h-40"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Super Odds */}
      <div className="w-full max-w-6xl px-4 mt-4 mb-16">
        <h2 className="text-3xl font-bold text-white mb-6">⚡ Super Odds</h2>
        <div className="space-y-6">
          {odds.map((match) => (
            <div key={match.id} className="bg-gray-800 rounded-xl p-4 shadow-md text-white">
              <div className="flex justify-between items-center text-sm text-gray-300 mb-2">
                <span>{match.data}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="font-semibold">{match.time1} vs {match.time2}</div>
                <div className="flex gap-3">
                  {match.odds.map((odd, idx) => (
                    <span key={idx} className="bg-yellow-500 text-black font-bold py-1 px-3 rounded">
                      {odd}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cassino Ao Vivo */}
      <div className="w-full max-w-6xl px-4 mt-10 mb-10">
        <h2 className="text-3xl font-bold text-white mb-6">🎰 Cassino Ao Vivo</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {liveGames.map((game) => (
            <div key={game.id} className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
              <Image
                src={game.image}
                alt={game.name}
                width={300}
                height={200}
                className="object-cover w-full h-40"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mais Jogados */}
      <div className="w-full max-w-6xl px-4 mt-10 mb-20">
        <h2 className="text-3xl font-bold text-white mb-6">🎯 Mais Jogados</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {mostPlayed.map((game) => (
            <div key={game.id} className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
              <Image
                src={game.image}
                alt={game.name}
                width={300}
                height={200}
                className="object-cover w-full h-40"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#0a0d1a] text-white py-12 px-6">
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
