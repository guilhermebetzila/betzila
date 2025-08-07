// app/api/cartela-ativa/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      cartelas: {
        where: {
          partida: { finalizada: false },
        },
        include: {
          numeros: true,
        },
      },
    },
  });

  const cartelaAtiva = user?.cartelas[0];

  return NextResponse.json({ cartela: cartelaAtiva });
}
