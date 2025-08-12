import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.createMany({
    data: [   
      { email: 'joao@email.com', nome: 'João', senha: '123456' },
      { email: 'ana@email.com', nome: 'Ana', senha: 'abc123' },
      { email: 'maria@email.com', nome: 'Maria', senha: 'senha123' }
    ],
  })

  console.log('✅ Usuários inseridos com sucesso!')
}

main()
  .catch((e) => {
    console.error('Erro ao inserir usuários:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
