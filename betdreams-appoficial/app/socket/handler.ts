import { Server } from 'socket.io'

let interval: NodeJS.Timeout | null = null
const cartelasPorUsuario: Record<string, number[]> = {}
let numerosSorteados: number[] = []
let jogoAtivo = false

export const socketHandler = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Usuário conectado:', socket.id)

    socket.on('comprarCartela', (cartela: number[]) => {
      cartelasPorUsuario[socket.id] = cartela
    })

    socket.on('disconnect', () => {
      delete cartelasPorUsuario[socket.id]
    })

    socket.on('novoJogo', () => {
      if (interval) clearInterval(interval)
      numerosSorteados = []
      jogoAtivo = true

      const numerosDisponiveis = Array.from({ length: 60 }, (_, i) => i + 1)

      interval = setInterval(() => {
        if (numerosDisponiveis.length === 0 || !jogoAtivo) {
          clearInterval(interval!)
          return
        }

        const index = Math.floor(Math.random() * numerosDisponiveis.length)
        const numero = numerosDisponiveis.splice(index, 1)[0]
        numerosSorteados.push(numero)
        io.emit('numeroSorteado', numero)

        for (const [id, cartela] of Object.entries(cartelasPorUsuario)) {
          const venceu = cartela.every(num => numerosSorteados.includes(num))
          if (venceu) {
            io.emit('vencedor', id)
            jogoAtivo = false
            clearInterval(interval!)
            setTimeout(() => {
              io.emit('resetar')
              numerosSorteados = []
              for (const key in cartelasPorUsuario) delete cartelasPorUsuario[key]
            }, 5000)
            break
          }
        }
      }, 2000)
    })
  })
}
