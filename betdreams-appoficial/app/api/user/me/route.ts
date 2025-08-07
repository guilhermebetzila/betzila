// app/api/user/me/route.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  if (!token || !token.id) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(token.id) },
    select: {
      id: true,
      email: true,
      nome: true,
      saldo: true,
    },
  });

  return NextResponse.json(user);
}
