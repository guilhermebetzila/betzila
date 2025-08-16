import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ⚙️ Variáveis de ambiente (definiremos no PASSO 4)
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY!;
const RECEIVING_WALLET = process.env.USDT_WALLET_ADDRESS!.toLowerCase();

// USDT (BEP-20) na BSC
const USDT_CONTRACT = "0x55d398326f99059fF775485246999027B3197955";
const DECIMALS = 18; // USDT na BSC tem 18 casas decimais
const MIN_CONFIRMATIONS = 3; // quantidade mínima de confirmações

export async function GET() {
  try {
    // 1) Buscar depósitos pendentes da nossa carteira
    const pendentes = await prisma.onChainDeposit.findMany({
      where: { status: "pendente", to: RECEIVING_WALLET },
      select: { id: true, amount: true, userId: true },
    });

    if (pendentes.length === 0) {
      return NextResponse.json({ ok: true, msg: "Sem pendentes" });
    }

    // 2) Buscar últimas transferências de USDT para a carteira destino na BscScan
    const url =
      `https://api.bscscan.com/api` +
      `?module=account&action=tokentx` +
      `&contractaddress=${USDT_CONTRACT}` +
      `&address=${RECEIVING_WALLET}` +
      `&sort=desc&apikey=${BSCSCAN_API_KEY}`;

    const resp = await fetch(url);
    const data = await resp.json();

    if (data.status !== "1" || !Array.isArray(data.result)) {
      return NextResponse.json({ ok: false, msg: "Sem resultados da BscScan" });
    }

    const txs: any[] = data.result;

    // 3) Para cada pendente, ver se há uma tx compatível (valor >= solicitado)
    for (const dep of pendentes) {
      const match = txs.find((t) => {
        const toOK = String(t.to).toLowerCase() === RECEIVING_WALLET;
        const confOK = Number(t.confirmations || "0") >= MIN_CONFIRMATIONS;
        const amountOnChain = Number(t.value) / 10 ** DECIMALS;

        // tolerância pequena por arredondamento
        const amountOK = amountOnChain + 1e-9 >= dep.amount;

        return toOK && confOK && amountOK;
      });

      if (!match) continue;

      // 4) Confirmar depósito, gravar hash e creditar saldo
      await prisma.$transaction(async (tx) => {
        await tx.onChainDeposit.update({
          where: { id: dep.id },
          data: {
            txHash: match.hash,
            from: String(match.from).toLowerCase(),
            status: "confirmado",
          },
        });

        if (dep.userId) {
          await tx.user.update({
            where: { id: dep.userId },
            data: { saldo: { increment: dep.amount } },
          });
        }
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Erro ao verificar depósitos USDT:", e);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
