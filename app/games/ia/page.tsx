'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

// ---------- Utilidades ----------
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
type VolumeTrade = {
  id: number;
  sym: string;
  side: 'BUY' | 'SELL';
  qty: number;
  entryPrice: number;
  exitPrice: number;
  entryTs: string;
  exitTs: string;
  pnl: number;
  fee: number;
  tax: number;
  result: 'GAIN' | 'LOSS';
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

  const simulatedVolumeTradesRef = useRef<VolumeTrade[]>([]);
  const volumeIdRef = useRef(1);

  const [tick, setTick] = useState(0);

  // ---------- Notícias & Agenda ----------
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

  // ---------- Fetch cotações reais ----------
  async function fetchRealPrices() {
    try {
      const symbols = ['VALE3.SA', 'SPY'];
      const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols.join(',')}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!data.quoteResponse || !data.quoteResponse.result) return;

      const quotes = data.quoteResponse.result;
      setInstruments((prev) => {
        const next = { ...prev };
        quotes.forEach((q: any) => {
          const sym = q.symbol === 'VALE3.SA' ? 'BR:VALE3' : 'US:SPY';
          const inst = next[sym];
          if (inst) inst.price = q.regularMarketPrice || inst.price;
        });
        return next;
      });
    } catch (err) {
      console.error('Erro ao buscar cotações reais:', err);
    }
  }

  async function fetchUSDReal() {
    try {
      const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=USDBRL=X`;
      const res = await fetch(url);
      const data = await res.json();
      const quote = data.quoteResponse.result[0];
      if (quote && quote.regularMarketPrice) setUsdbrl(quote.regularMarketPrice);
    } catch (err) {
      console.error('Erro ao buscar USD/BRL:', err);
    }
  }

  // ---------- Operações simuladas ----------
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
        if (px <= t.stop) exit = true, exitReason = 'STOP';
        else if (px >= t.take) exit = true, exitReason = 'TAKE';
      } else {
        if (px >= t.stop) exit = true, exitReason = 'STOP';
        else if (px <= t.take) exit = true, exitReason = 'TAKE';
      }

      if (!exit && t.age < t.ttl) {
        remain.push(t);
        return;
      }

      const exitPrice = instruments[t.sym].price;
      const feeRate = 0.0003;
      const gross = (t.side === 'BUY' ? exitPrice - t.entryPrice : t.entryPrice - exitPrice) * t.qty;
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

  function maybePushNews() {
    if (Math.random() < 0.3) {
      const n = newsPool[Math.floor(Math.random() * newsPool.length)];
      rollingNewsRef.current = [
        { ...n, ts: new Date().toISOString() },
        ...rollingNewsRef.current,
      ].slice(0, 20);
    }
  }

  // ---------- Simulação de volume realista ----------
  function maybeSimulateVolumeTrade() {
    const now = new Date();
    const hourUS = now.getUTCHours() - 4; // NY timezone approx
    const hourBR = now.getUTCHours() - 3; // SP timezone approx
    const isPeak = (hour: number, market: 'US' | 'BR') => {
      if (market === 'US') return hour >= 10 && hour <= 11 || hour >= 14 && hour <= 16;
      else return hour >= 10 && hour <= 11 || hour >= 14 && hour <= 16;
    };

    const syms = Object.keys(instruments);
    const batchSize = 2 + Math.floor(Math.random() * 4); // 2-5 trades por batch

    for (let i = 0; i < batchSize; i++) {
      const sym = syms[Math.floor(Math.random() * syms.length)];
      const inst = instruments[sym];
      const side: 'BUY' | 'SELL' = Math.random() < 0.5 ? 'BUY' : 'SELL';

      // Ajuste de probabilidade por horário
      const hour = inst.market === 'US' ? hourUS : hourBR;
      if (!isPeak(hour, inst.market) && Math.random() > 0.3) continue;

      // Quantidade proporcional à liquidez
      const baseQty = sym.includes('SPY') ? 50 : 20;
      const qty = baseQty + Math.floor(Math.random() * baseQty);

      // Preço flutuando ±0,5%
      const entryPrice = inst.price * (1 + (Math.random() - 0.5) / 100);
      const exitPrice = entryPrice * (1 + (Math.random() - 0.5) / 50);

      const entryTs = new Date().toISOString();
      const exitTs = new Date(Date.now() + Math.floor(Math.random() * 10 * 60_000)).toISOString();

      const feeRate = 0.0003;
      const gross = (side === 'BUY' ? exitPrice - entryPrice : entryPrice - exitPrice) * qty;
      const fee = (entryPrice + exitPrice) * qty * feeRate;
      const pnl = gross - fee;
      const tax = pnl > 0 ? pnl * 0.15 : 0;
      const result: VolumeTrade['result'] = pnl >= 0 ? 'GAIN' : 'LOSS';

      simulatedVolumeTradesRef.current = [
        {
          id: volumeIdRef.current++,
          sym,
          side,
          qty,
          entryPrice,
          exitPrice,
          entryTs,
          exitTs,
          pnl,
          fee,
          tax,
          result,
        },
        ...simulatedVolumeTradesRef.current,
      ].slice(0, 100);
    }
  }

  // ---------- Loop 1s ----------
  useEffect(() => {
    const id = setInterval(() => {
      fetchRealPrices();
      fetchUSDReal();
      maybeOpenTrade();
      updateOpenTrades();
      maybePushNews();
      maybeSimulateVolumeTrade();
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [instruments]);

  // ---------- Derivados ----------
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
    return econEventsRef.current.filter((e) => {
      const t = new Date(e.when).getTime();
      return t > now && t < in60;
    }).slice(0, 5);
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
          <span className="rounded-full border border-gray-300 px-2 py-1">USD/BRL — {usdbrl.toFixed(4)}</span>
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
                <div key={sym} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2">
                  <div className="text-sm">
                    <div className="font-bold">{sym}</div>
                    <div className="text-xs text-gray-600">{inst.market} · {inst.currency}</div>
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
                      <td className={`px-2 py-2 text-right ${r.pnlBRL >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(r.pnlBRL)}</td>
                    </tr>
                  ))}
                  {closed.length === 0 && (
                    <tr>
                      <td className="px-2 py-4 text-gray-500" colSpan={8}>Aguarde… as primeiras operações estão a caminho.</td>
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
            <div className="text-2xl font-extrabold">PnL Realizado (BRL): {fmt(metrics.realizedPnLBRL)}</div>
            <div className="mt-1 text-sm text-gray-700">Trades: {metrics.totalTrades} · Win rate: {fmt(metrics.winRate, 2)}%</div>
          </div>

          {/* Notícias */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <h2 className="mb-2 text-lg font-semibold">Notícias (simulado)</h2>
            <div className="flex max-h-64 flex-col gap-2 overflow-auto">
              {rollingNewsRef.current.slice(0, 10).map((n, i) => {
                const hhmm = new Date(n.ts).toLocaleTimeString('pt-BR', { hour12: false });
                return (
                  <div key={i} className="text-sm">
                    [{n.region}] {hhmm} — {n.headline}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Volume de operações */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <h2 className="mb-2 text-lg font-semibold">Volume de Operações (simulado)</h2>
            <div className="overflow-auto max-h-64">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs text-gray-600 uppercase">
                    <th className="px-2 py-1">Ativo</th>
                    <th className="px-2 py-1">Side</th>
                    <th className="px-2 py-1">Qtd</th>
                    <th className="px-2 py-1 text-right">Entrada</th>
                    <th className="px-2 py-1 text-right">Saída</th>
                    <th className="px-2 py-1 text-right">PNL</th>
                    <th className="px-2 py-1 text-right">Taxa</th>
                    <th className="px-2 py-1 text-right">Imposto</th>
                    <th className="px-2 py-1">Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {simulatedVolumeTradesRef.current.map((v) => (
                    <tr key={v.id} className="border-b border-gray-100">
                      <td className="px-2 py-1">{v.sym}</td>
                      <td className="px-2 py-1">{v.side}</td>
                      <td className="px-2 py-1">{v.qty}</td>
                      <td className="px-2 py-1 text-right">{fmt(v.entryPrice)}</td>
                      <td className="px-2 py-1 text-right">{fmt(v.exitPrice)}</td>
                      <td className={`px-2 py-1 text-right ${v.result === 'GAIN' ? 'text-green-600' : 'text-red-600'}`}>{fmt(v.pnl)}</td>
                      <td className="px-2 py-1 text-right">{fmt(v.fee)}</td>
                      <td className="px-2 py-1 text-right">{fmt(v.tax)}</td>
                      <td className="px-2 py-1">{v.result}</td>
                    </tr>
                  ))}
                  {simulatedVolumeTradesRef.current.length === 0 && (
                    <tr>
                      <td className="px-2 py-2 text-gray-500" colSpan={9}>Aguardando operações simuladas…</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Próximos eventos econômicos */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <h2 className="mb-2 text-lg font-semibold">Eventos Econômicos Próximos</h2>
            <ul className="text-sm text-gray-700">
              {nextEcon.map((e, i) => (
                <li key={i}>[{e.region}] {new Date(e.when).toLocaleTimeString('pt-BR', { hour12: false })} — {e.title} ({e.impact})</li>
              ))}
              {nextEcon.length === 0 && <li>Aguardando eventos próximos…</li>}
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
