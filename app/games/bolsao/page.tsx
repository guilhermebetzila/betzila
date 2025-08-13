'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function formatBRL(valor: number) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  });
}

interface Particula {
  x: number;
  y: number;
  opacity: number;
  size: number;
  speed: number;
}

interface Traco {
  x: number;
  y: number;
  opacity: number;
}

export default function BolsaoPage() {
  const [bolsao, setBolsao] = useState(1_000_000);
  const [capital, setCapital] = useState(1_000_000);
  const [historico, setHistorico] = useState<number[]>(Array(50).fill(1_000_000));
  const [particulas, setParticulas] = useState<Particula[]>([]);
  const [tracos, setTracos] = useState<Traco[]>([]);

  const prevBolsao = useRef(bolsao);
  const prevCapital = useRef(capital);

  const caixa1 = 100_000;
  const caixa2 = 100_000;

  // Atualiza Bolsão, Capital e histórico
  useEffect(() => {
    const interval = setInterval(() => {
      const variacaoBolsao = (Math.random() - 0.5) * 100;
      const variacaoCapital = (Math.random() - 0.5) * 200;

      prevBolsao.current = bolsao;
      prevCapital.current = capital;

      const novoBolsao = Math.max(0, bolsao + variacaoBolsao);
      const novoCapital = Math.max(0, capital + variacaoCapital);

      setBolsao(novoBolsao);
      setCapital(novoCapital);

      setHistorico(prev => {
        const next = [...prev, novoBolsao];
        if (next.length > 50) next.shift();
        return next;
      });

      // Partículas brilhantes
      setParticulas(prev => [
        ...prev,
        { x: Math.random() * 400, y: Math.random() * 200, opacity: 1, size: Math.random() * 4 + 2, speed: Math.random() * 0.02 + 0.01 }
      ]);

      // Traços de luz seguindo o gráfico
      setTracos(prev => [
        ...prev,
        { x: historico.length * 8, y: 200 - (novoBolsao % 200), opacity: 1 }
      ]);
    }, 200);

    return () => clearInterval(interval);
  }, [bolsao, capital, historico]);

  // Atualiza partículas e traços
  useEffect(() => {
    const anim = requestAnimationFrame(() => {
      setParticulas(prev =>
        prev
          .map(p => ({ ...p, y: p.y - p.speed * 100, opacity: p.opacity - 0.01 }))
          .filter(p => p.opacity > 0)
      );
      setTracos(prev =>
        prev
          .map(t => ({ ...t, opacity: t.opacity - 0.02 }))
          .filter(t => t.opacity > 0)
      );
    });
    return () => cancelAnimationFrame(anim);
  }, [particulas, tracos]);

  const data = {
    labels: historico.map((_, idx) => idx.toString()),
    datasets: [
      {
        label: 'Bolsão',
        data: historico,
        fill: true,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 1)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: { duration: 0 },
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-6 space-y-8 relative overflow-hidden">

      {/* Grid animado de fundo */}
      <canvas
        className="absolute inset-0 w-full h-full pointer-events-none"
        ref={canvas => {
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          let frame = 0;
          const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Grid
            const step = 50;
            ctx.strokeStyle = 'rgba(0,255,128,0.05)';
            ctx.lineWidth = 1;
            for (let x = frame % step; x < canvas.width; x += step) {
              ctx.beginPath();
              ctx.moveTo(x, 0);
              ctx.lineTo(x, canvas.height);
              ctx.stroke();
            }
            for (let y = frame % step; y < canvas.height; y += step) {
              ctx.beginPath();
              ctx.moveTo(0, y);
              ctx.lineTo(canvas.width, y);
              ctx.stroke();
            }

            // Ondas de energia
            const waveAmplitude = 15;
            const waveLength = 100;
            const waveSpeed = 0.03;
            ctx.strokeStyle = 'rgba(0,255,128,0.15)';
            ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
              ctx.beginPath();
              for (let x = 0; x < canvas.width; x++) {
                const y = 150 + Math.sin((x + frame * waveSpeed * 100 + i * 50) / waveLength * Math.PI * 2) * waveAmplitude;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.stroke();
            }

            frame += 1;
            requestAnimationFrame(draw);
          };
          draw();
        }}
      />

      <h1 className="text-4xl font-bold mb-4 text-center text-green-400 drop-shadow-neon">📊 Bolsão da Inteligência Artificial</h1>

      {/* Bolsão com gráfico, partículas, traços, neon e ondas */}
      <div className="relative w-full max-w-xl p-6 rounded-2xl shadow-2xl bg-gray-900 overflow-hidden border-4 border-green-400/50 animate-pulse-neon">
        <Line data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <h2 className="text-xl font-semibold mb-2 text-green-400 drop-shadow-neon">💼 Bolsão Operacional</h2>
          <p className={`text-4xl font-bold drop-shadow-neon ${bolsao > prevBolsao.current ? 'text-green-400' : 'text-red-400'} transition-colors duration-300`}>
            {formatBRL(bolsao)}
          </p>
          <span className="text-sm text-gray-200 drop-shadow-neon">Valor total em operações de mercado</span>
        </div>

        <canvas
          className="absolute inset-0 pointer-events-none"
          width={400}
          height={200}
          ref={canvas => {
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Partículas
            particulas.forEach(p => {
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
              ctx.fill();
            });

            // Traços de luz
            tracos.forEach(t => {
              ctx.beginPath();
              ctx.moveTo(t.x, t.y);
              ctx.lineTo(t.x, 200);
              ctx.strokeStyle = `rgba(16, 185, 129, ${t.opacity})`;
              ctx.lineWidth = 2;
              ctx.stroke();
            });
          }}
        />
      </div>

      {/* Capital da Empresa com neon */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-2xl p-6 w-full max-w-xl text-center transition-all duration-300 border-4 border-blue-400/50 animate-pulse-neon">
        <h2 className="text-xl font-semibold mb-2 text-blue-400 drop-shadow-neon">🏦 Capital da Empresa</h2>
        <p className={`text-4xl font-bold drop-shadow-neon ${capital > prevCapital.current ? 'text-green-400' : 'text-red-400'} transition-colors duration-300`}>
          {formatBRL(capital)}
        </p>
        <span className="text-sm text-gray-200 drop-shadow-neon">Capital próprio acompanhando as oscilações</span>
      </div>

      {/* Caixa de Proteção */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-lg p-6 text-center border-2 border-yellow-400/50">
          <h3 className="text-lg font-semibold mb-2 drop-shadow-neon">🛡 Caixa de Proteção 1</h3>
          <p className="text-3xl font-bold drop-shadow-neon">{formatBRL(caixa1)}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-lg p-6 text-center border-2 border-yellow-400/50">
          <h3 className="text-lg font-semibold mb-2 drop-shadow-neon">🛡 Caixa de Proteção 2</h3>
          <p className="text-3xl font-bold drop-shadow-neon">{formatBRL(caixa2)}</p>
        </div>
      </div>

      {/* Estilos neon e glow */}
      <style jsx>{`
        @keyframes pulse-neon {
          0%, 100% { box-shadow: 0 0 10px rgba(255,255,255,0.3), 0 0 20px rgba(0,255,128,0.5), 0 0 30px rgba(0,255,128,0.7); }
          50% { box-shadow: 0 0 20px rgba(255,255,255,0.5), 0 0 30px rgba(0,255,128,0.7), 0 0 40px rgba(0,255,128,1); }
        }
        .animate-pulse-neon {
          animation: pulse-neon 2s infinite alternate;
        }
        .drop-shadow-neon {
          text-shadow: 0 0 5px rgba(0,255,128,0.7), 0 0 10px rgba(0,255,128,0.5), 0 0 20px rgba(0,255,128,0.3);
        }
      `}</style>
    </div>
  );
}
