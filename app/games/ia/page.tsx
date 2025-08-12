'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

// ---------- Utilidades ----------
function randnBoxMuller() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function fmt(n: number, digits = 2) {
  return Number(n).toLocaleString('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
function nowInTZ(timeZone: string) {
  const d = new Date();
  const date = d.toLocaleDateString('pt-BR', { timeZone });
  const time = d.toLocaleTimeString('pt-BR', { timeZone, hour12: false });
  return `${time} - ${date}`;
}

// ---------- Tipos ----------
type Instrument = {
  price: number;
  vol: number;
  currency: 'USD' | 'BRL';
  market: 'US' | 'BR';
};
type OpenTrade = {
  id: number;
  sym: string;
  side: 'BUY' | 'SELL';
  qty: number;
  entryPrice: number;
  entryTs: string;
  stop: number;
  take: number;
  age: number;
  ttl: number;
};
type ClosedTrade = OpenTrade & {
  exitPrice: number;
  exitTs: string;
  exitReason: 'STOP' | 'TAKE' | 'TTL';
  pnlBRL: number;
};

export default function Page() {
  // ---------- Estado base ----------
  const [instruments, setInstruments] = useState<Record<string, Instrument>>({
    'US:SPY': { price: 520.0, vol: 0.0025, currency: 'USD', market: 'US' },
    'BR:VALE3': { price: 60.0, vol: 0.003, currency: 'BRL', market: 'BR' },
  });
  const [usdbrl, setUsdbrl] = useState(5.5);

  const openTradesRef = useRef<OpenTrade[]>([]);
  const closedTradesRef = useRef<ClosedTrade[]>([]);
  const realizedPnLBRLRef = useRef(0);
  const winsRef = useRef(0);
  const lossesRef = useRef(0);
  const idSeqRef = useRef(1);

  const [tick, setTick] = useState(0); // força render a cada segundo

  // ---------- Notícias & Agenda simuladas ----------
  const newsPool = useMemo(
    () => [
      { headline: 'Tech avança após resultados acima do esperado', region: 'US' },
      { headline: 'Commodity sobe com reabertura de portos', region: 'BR' },
      { headline: 'Banco central sinaliza manutenção de juros', region: 'US' },
      { headline: 'Setor industrial aponta recuperação gradual', region: 'BR' },
    ],
    []
  );
  const rollingNewsRef = useRef<{ headline: string; region: string; ts: string }[]>([]);

  const econEventsRef = useRef<{ title: string; when: string; impact: 'alto' | 'médio'; region: 'US' | 'BR' }[]>([]);
  useEffect(() => {
    const now = new Date();
    const addMin = (m: number) => new Date(now.getTime() + m * 60_000).toISOString();
    econEventsRef.current = [
      { title: 'Payroll (EUA)', when: addMin(5), impact: 'alto', region: 'US' },
      { title: 'IPCA (Brasil)', when: addMin(12), impact: 'alto', region: 'BR' },
      { title: 'PMI Serviços (EUA)', when: addMin(18), impact: 'médio', region: 'US' },
      { title: 'Ata COPOM (Brasil)', when: addMin(25), impact: 'alto', region: 'BR' },
    ];
  }, []);

  // ---------- Simuladores ----------
  function simulatePrices() {
    setInstruments((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((sym) => {
        const inst = next[sym];
        const drift = 0.00005;
        const shock = inst.vol * randnBoxMuller();
        const ret = drift + shock;
        inst.price = clamp(inst.price * (1 + ret), 0.01, 1e6);
      });
      return next;
    });
    setUsdbrl((u) => clamp(u * (1 + 0.0002 * randnBoxMuller()), 3.0, 8.0));
  }

  function maybeOpenTrade() {
    if (Math.random() < 0.18) {
      const syms = Object.keys(instruments);
      const sym = syms[Math.floor(Math.random() * syms.length)];
      const side: 'BUY' | 'SELL' = Math.random() < 0.5 ? 'BUY' : 'SELL';
      const qty = Math.floor(1 + Math.random() * 10) * 10;
      const entryPrice = instruments[sym].price;
      const entryTs = new Date().toISOString();
      const ttl = 10 + Math.floor(Math.random() * 25);
      const stop = side === 'BUY' ? entryPrice * 0.992 : entryPrice * 1.008;
      const take = side === 'BUY' ? entryPrice * 1.008 : entryPrice * 0.992;

      const t: OpenTrade = {
        id: idSeqRef.current++,
        sym,
        side,
        qty,
        entryPrice,
        entryTs,
        stop,
        take,
        age: 0,
        ttl,
      };
      openTradesRef.current = [t, ...openTradesRef.current];
    }
  }

  function updateOpenTrades() {
    const remain: OpenTrade[] = [];
    const nowIso = new Date().toISOString();

    openTradesRef.current.forEach((t) => {
      t.age += 1;
      const px = instruments[t.sym].price;
      let exit = false as boolean;
      let exitReason: ClosedTrade['exitReason'] = 'TTL';

      if (t.side === 'BUY') {
        if (px <= t.stop) {
          exit = true;
          exitReason = 'STOP';
        } else if (px >= t.take) {
          exit = true;
          exitReason = 'TAKE';
        }
      } else {
        if (px >= t.stop) {
          exit = true;
          exitReason = 'STOP';
        } else if (px <= t.take) {
          exit = true;
          exitReason = 'TAKE';
        }
      }

      if (!exit && t.age < t.ttl) {
        remain.push(t);
        return;
      }

      const exitPrice = instruments[t.sym].price;
      const feeRate = 0.0003; // 0,03% por lado (fictício)
      const gross =
        (t.side === 'BUY' ? exitPrice - t.entryPrice : t.entryPrice - exitPrice) * t.qty;
      const fees = t.entryPrice * t.qty * feeRate + exitPrice * t.qty * feeRate;

      let pnlBRL = gross - fees;
      const inst = instruments[t.sym];
      if (inst.currency === 'USD') pnlBRL *= usdbrl;

      realizedPnLBRLRef.current += pnlBRL;
      if (pnlBRL >= 0) winsRef.current++;
      else lossesRef.current++;

      const closed: ClosedTrade = {
        ...t,
        exitPrice,
        exitTs: nowIso,
        exitReason,
        pnlBRL: Number(pnlBRL.toFixed(2)),
      };

      closedTradesRef.current = [closed, ...closedTradesRef.current].slice(0, 200);
    });

    openTradesRef.current = remain;
  }

  // Notícias de tempos em tempos
  function maybePushNews() {
    if (Math.random() < 0.3) {
      const n = newsPool[Math.floor(Math.random() * newsPool.length)];
      rollingNewsRef.current = [
        { ...n, ts: new Date().toISOString() },
        ...rollingNewsRef.current,
      ].slice(0, 20);
    }
  }

  // ---------- Loop de 1s ----------
  useEffect(() => {
    const id = setInterval(() => {
      simulatePrices();
      maybeOpenTrade();
      updateOpenTrades();
      maybePushNews();
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instruments]); // instruments no deps para ler preço atualizado

  // ---------- Derivados p/ UI ----------
  const clocks = useMemo(
    () => ({
      br: nowInTZ('America/Sao_Paulo'),
      us: nowInTZ('America/New_York'),
    }),
    [tick]
  );

  const nextEcon = useMemo(() => {
    const now = Date.now();
    const in60 = now + 60 * 60 * 1000;
    return econEventsRef.current
      .filter((e) => {
        const t = new Date(e.when).getTime();
        return t > now && t < in60;
      })
      .slice(0, 5);
  }, [tick]);

  const metrics = useMemo(() => {
    const total = winsRef.current + lossesRef.current;
    const winRate = total > 0 ? (winsRef.current * 100) / total : 0;
    return {
      realizedPnLBRL: Number(realizedPnLBRLRef.current.toFixed(2)),
      totalTrades: total,
      winRate: Number(winRate.toFixed(2)),
    };
  }, [tick]);

  const closed = useMemo(() => closedTradesRef.current.slice(0, 50), [tick]);

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="font-bold">Simulação de IA — EUA & Brasil</div>
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="rounded-full border border-gray-300 px-2 py-1">BR — {clocks.br}</span>
          <span className="rounded-full border border-gray-300 px-2 py-1">NY — {clocks.us}</span>
          <span className="rounded-full border border-gray-300 px-2 py-1">
            USD/BRL — {usdbrl.toFixed(4)}
          </span>
        </div>
      </header>

      <main className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[1fr_360px]">
        {/* Coluna principal */}
        <section className="space-y-4">
          {/* Tickers */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <h2 className="mb-3 text-lg font-semibold">Mercados</h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {Object.entries(instruments).map(([sym, inst]) => (
                <div
                  key={sym}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2"
                >
                  <div className="text-sm">
                    <div className="font-bold">{sym}</div>
                    <div className="text-xs text-gray-600">
                      {inst.market} · {inst.currency}
                    </div>
                  </div>
                  <div className="text-right font-semibold">{fmt(inst.price)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Operações fechadas */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <h2 className="mb-3 text-lg font-semibold">Operações Fechadas (últimas 50)</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-600">
                    <th className="px-2 py-2">ID</th>
                    <th className="px-2 py-2">Mercado</th>
                    <th className="px-2 py-2">Side</th>
                    <th className="px-2 py-2">Qtd</th>
                    <th className="px-2 py-2 text-right">Entrada</th>
                    <th className="px-2 py-2 text-right">Saída</th>
                    <th className="px-2 py-2">Motivo</th>
                    <th className="px-2 py-2 text-right">PNL (BRL)</th>
                  </tr>
                </thead>
                <tbody>
                  {closed.map((r) => (
                    <tr key={r.id} className="border-b border-gray-100">
                      <td className="px-2 py-2">{r.id}</td>
                      <td className="px-2 py-2">{r.sym}</td>
                      <td className="px-2 py-2">{r.side}</td>
                      <td className="px-2 py-2">{r.qty}</td>
                      <td className="px-2 py-2 text-right">{fmt(r.entryPrice)}</td>
                      <td className="px-2 py-2 text-right">{fmt(r.exitPrice)}</td>
                      <td className="px-2 py-2">{r.exitReason}</td>
                      <td
                        className={`px-2 py-2 text-right ${
                          r.pnlBRL >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {fmt(r.pnlBRL)}
                      </td>
                    </tr>
                  ))}
                  {closed.length === 0 && (
                    <tr>
                      <td className="px-2 py-4 text-gray-500" colSpan={8}>
                        Aguarde… as primeiras operações estão a caminho.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Coluna lateral */}
        <aside className="space-y-4">
          {/* Resumo */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <h2 className="mb-2 text-lg font-semibold">Resumo</h2>
            <div className="text-2xl font-extrabold">
              PnL Realizado (BRL): {fmt(metrics.realizedPnLBRL)}
            </div>
            <div className="mt-1 text-sm text-gray-700">
              Trades: {metrics.totalTrades} · Win rate: {fmt(metrics.winRate, 2)}%
            </div>
          </div>

          {/* Notícias */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <h2 className="mb-2 text-lg font-semibold">Notícias (simulado)</h2>
            <div className="flex max-h-64 flex-col gap-2 overflow-auto">
              {rollingNewsRef.current.slice(0, 10).map((n, i) => {
                const hhmm = new Date(n.ts).toLocaleTimeString('pt-BR', { hour12: false });
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 px-2 py-1"
                  >
                    <span className="rounded-full border border-gray-300 px-2 py-0.5 text-xs">
                      {n.region}
                    </span>
                    <span className="text-xs text-gray-600">{hhmm}</span>
                    <span className="text-sm">{n.headline}</span>
                  </div>
                );
              })}
              {rollingNewsRef.current.length === 0 && (
                <div className="text-sm text-gray-500">Sem notícias no momento…</div>
              )}
            </div>
          </div>

          {/* Agenda econômica */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <h2 className="mb-2 text-lg font-semibold">Calendário Econômico (próx. 60 min)</h2>
            <div className="flex max-h-64 flex-col gap-2 overflow-auto">
              {nextEcon.map((e, i) => {
                const hhmm = new Date(e.when).toLocaleTimeString('pt-BR', { hour12: false });
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 px-2 py-1"
                  >
                    <span className="rounded-full border border-gray-300 px-2 py-0.5 text-xs">
                      {e.region}
                    </span>
                    <span className="text-xs text-gray-600">{hhmm}</span>
                    <span className="text-sm">{e.title}</span>
                    <span className="ml-auto rounded-full border border-gray-300 px-2 py-0.5 text-xs">
                      {e.impact}
                    </span>
                  </div>
                );
              })}
              {nextEcon.length === 0 && (
                <div className="text-sm text-gray-500">
                  Sem eventos relevantes na próxima hora.
                </div>
              )}
            </div>
          </div>
        </aside>
      </main>

      <footer className="px-4 py-6 text-center text-xs text-gray-500">
        Demo educacional — dados e eventos simulados.
      </footer>
    </div>
  );
}
