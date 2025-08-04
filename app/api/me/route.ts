// /app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.email) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Buscar usuário no banco para pegar dados completos, como CPF
    const user = await prisma.user.findUnique({
      where: { email: token.email },
      select: { id: true, email: true, cpf: true, saldo: true, valorInvestido: true },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error("[ERRO ME]", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
