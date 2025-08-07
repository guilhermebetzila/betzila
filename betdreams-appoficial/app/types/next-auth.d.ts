// types/next-auth.d.ts
import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    nome: string
    email: string
    saldo: number // <- ADICIONA saldo AQUI
  }

  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    nome: string
    email: string
    saldo: number // <- E AQUI TAMBÉM
  }
}
