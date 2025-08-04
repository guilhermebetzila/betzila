import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Busca usuário pelo email para obter id
    const user = await prisma.user.findUnique({
      where: { email: token.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Busca depósitos do usuário pelo userId
    const depositos = await prisma.deposito.findMany({
      where: { userId: user.id },
      orderBy: { criadoEm: "desc" },
      select: { id: true, valor: true, criadoEm: true },
    });

    return NextResponse.json(depositos);
  } catch (error) {
    console.error("Erro no histórico de depósitos:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
