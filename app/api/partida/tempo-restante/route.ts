// app/api/partida/tempo-restante/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const partidaAtual = await prisma.partida.findFirst({
      where: { aberta: true },
      orderBy: { inicio: "desc" },
    });

    if (!partidaAtual || !partidaAtual.inicio) {
      return NextResponse.json({ tempoRestante: 150 }); // fallback 2min30s
    }

    const inicio = new Date(partidaAtual.inicio).getTime();
    const agora = Date.now();
    const tempoTotal = 150000; // 2min30s
    const tempoRestante = Math.max(0, Math.floor((inicio + tempoTotal - agora) / 1000));

    return NextResponse.json({ tempoRestante });
  } catch (error) {
    return NextResponse.json({ tempoRestante: 150 });
  }
}
