// app/scripts/atualizarInvestimentos.ts
import { prisma } from '../../lib/prisma';

async function aplicarRendimentos() {
  try {
    const usuarios = await prisma.user.findMany();

    for (const usuario of usuarios) {
      if (usuario.valorInvestido && usuario.valorInvestido > 0) {
        const rendimento = usuario.valorInvestido * 0.025;

        await prisma.user.update({
          where: { id: usuario.id },
          data: {
            saldo: usuario.saldo + rendimento,
          },
        });

        console.log(`Rendimento de R$ ${rendimento.toFixed(2)} aplicado para o usuário ${usuario.id}`);
      }
    }

    console.log('✅ Rendimentos aplicados com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao aplicar rendimentos:', err);
  } finally {
    await prisma.$disconnect();
  }
}

aplicarRendimentos();
