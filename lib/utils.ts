import { prisma } from './prisma'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Função para combinar classes Tailwind
export function cn(...inputs: any[]) {
  return twMerge(clsx(...inputs))
}

// Gera 5 cartelas com 15 números aleatórios para uma partida
export async function gerarCartelasParaPartida(partidaId: number) {
  for (let i = 0; i < 5; i++) {
    const numeros = gerarNumerosAleatorios(15, 1, 75)

    const cartela = await prisma.cartela.create({
      data: {
        partidaId,
      },
    })

    for (const numero of numeros) {
      await prisma.numeroCartela.create({
        data: {
          cartelaId: cartela.id,
          numero,
        },
      })
    }
  }
}

// Gera números aleatórios únicos dentro de um intervalo
function gerarNumerosAleatorios(quantidade: number, min: number, max: number): number[] {
  const numeros: number[] = []
  while (numeros.length < quantidade) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min
    if (!numeros.includes(num)) {
      numeros.push(num)
    }
  }
  return numeros
}
