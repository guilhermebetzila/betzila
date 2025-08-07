import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.senha) return null;

        const senhaCorreta = await compare(credentials.senha, user.senha);
        if (!senhaCorreta) return null;

        // Retorno compatível com sua tipagem
        return {
          id: String(user.id),
          email: user.email,
          nome: user.nome,
          saldo: user.saldo,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nome = user.nome;
        token.email = user.email;
        token.saldo = user.saldo;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.nome = token.nome as string;
        session.user.email = token.email as string;
        session.user.saldo = token.saldo as number;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  // Configuração explícita do cookie para funcionar bem no mobile (HTTPS obrigatório)
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
};
