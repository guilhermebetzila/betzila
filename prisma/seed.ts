import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 🔹 Criar usuários
  const users = await prisma.user.createMany({
    data: [   
      { email: 'joao@email.com', nome: 'João', senha: '123456' },
      { email: 'ana@email.com', nome: 'Ana', senha: 'abc123' },
      { email: 'maria@email.com', nome: 'Maria', senha: 'senha123' }
    ],
    skipDuplicates: true,
  })

  console.log('✅ Usuários inseridos com sucesso!')

  // 🔹 Buscar usuários criados para vincular depósitos
  const joao = await prisma.user.findUnique({ where: { email: 'joao@email.com' } })
  const ana = await prisma.user.findUnique({ where: { email: 'ana@email.com' } })
  const maria = await prisma.user.findUnique({ where: { email: 'maria@email.com' } })

  if (joao && ana && maria) {
    // 🔹 Criar depósitos Pix de exemplo
    await prisma.deposito.createMany({
      data: [
        { userId: joao.id, valor: 100, status: 'confirmado' },
        { userId: joao.id, valor: 250, status: 'pendente' },
        { userId: ana.id, valor: 500, status: 'aguardando' },
        { userId: ana.id, valor: 75, status: 'em_analise' },
        { userId: maria.id, valor: 300, status: 'cancelado' },
      ],
    })

    console.log('✅ Depósitos de exemplo inseridos com sucesso!')
  }
}

main()
  .catch((e) => {
    console.error('Erro ao inserir dados:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
