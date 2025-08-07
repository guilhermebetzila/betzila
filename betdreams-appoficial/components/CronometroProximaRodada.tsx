'use client';

import { useEffect, useState } from 'react';

export default function CronometroProximaRodada() {
  const [tempo, setTempo] = useState<number | null>(null);
  const [usandoFallback, setUsandoFallback] = useState(false);

  useEffect(() => {
    let intervalo: NodeJS.Timeout;

    const carregarTempo = async () => {
      try {
        const res = await fetch('/api/partida/tempo-restante');
        const data = await res.json();

        const tempoApi = Number(data.tempoRestante);
        if (!isNaN(tempoApi)) {
          setTempo(tempoApi);
          setUsandoFallback(false);

          intervalo = setInterval(() => {
            setTempo((prev) => {
              if (prev === null || prev <= 1) {
                clearInterval(intervalo);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          usarFallback();
        }
      } catch (err) {
        usarFallback();
      }
    };

    const usarFallback = () => {
      setTempo(150); // fallback: 2m30s
      setUsandoFallback(true);

      intervalo = setInterval(() => {
        setTempo((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(intervalo);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    carregarTempo();

    return () => clearInterval(intervalo);
  }, []);

  if (tempo === null) return <p className="text-white">⏳ Carregando cronômetro...</p>;

  const minutos = String(Math.floor(tempo / 60)).padStart(2, '0');
  const segundos = String(tempo % 60).padStart(2, '0');

  return (
    <div className="p-4 bg-yellow-400 text-center font-bold rounded shadow text-black">
      ⏱️ Próxima rodada em: {minutos}:{segundos}
      {usandoFallback && (
        <p className="text-sm text-red-700 mt-2">
          ⚠ Tempo baseado em fallback local. Verifique a API.
        </p>
      )}
    </div>
  );
}
