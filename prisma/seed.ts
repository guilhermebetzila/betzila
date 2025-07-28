// prisma/seed.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.createMany({
    data: [   
      { email: 'joao@email.com', name: 'João', senha: '123456' },
      { email: 'ana@email.com', name: 'Ana', senha: 'abc123' },
      { email: 'maria@email.com', name: 'Maria', senha: 'senha123' }
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
