import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    // Extrai o token JWT da request, usando a chave secreta
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Você pode retornar o token (que tem dados do usuário), ou buscar dados adicionais no banco

    return NextResponse.json({
      authenticated: true,
      user: token, // token contém info do usuário (id, email, name etc)
    });
  } catch (error) {
    console.error("[ERRO ME]", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
