import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from 'bcryptjs';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        senha: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email
        const senha = credentials?.senha

        if (!email || !senha) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email }
          });

          if (!user || !user.senha) {
            return null
          }

          const senhaCorreta = await compare(senha, user.senha);

          if (!senhaCorreta) {
            return null
          }

          return {
            id: user.id.toString(),
            nome: user.nome,
            email: user.email,
            saldo: user.saldo
          };
        } catch (error) {
          console.error("Erro no authorize:", error)
          return null
        }
      }
    })
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
      if (token) {
        session.user = {
          id: token.id as string,
          nome: token.nome as string,
          email: token.email as string,
          saldo: token.saldo as number
        };
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
