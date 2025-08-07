import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const partida = await prisma.partida.findFirst({
      where: { finalizada: false },
      orderBy: { inicio: "desc" },
      include: { bolas: true },
    });

    if (!partida) {
      return NextResponse.json({ bolas: [] });
    }

    return NextResponse.json({
      bolas: partida.bolas.map((b) => b.numero),
    });
  } catch (error) {
    console.error("❌ Erro ao buscar bolas:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
