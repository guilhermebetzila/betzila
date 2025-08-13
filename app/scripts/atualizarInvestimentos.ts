// app/scripts/atualizarInvestimentos.ts
import { prisma } from '../../lib/prisma';

async function aplicarRendimentos() {
  try {
    // Busca todos os usuários com seus investimentos
    const usuarios = await prisma.user.findMany({
      include: {
        investimentos: true,
      },
    });

    // Processa todos os usuários em paralelo
    await Promise.all(
      usuarios.map(async (usuario) => {
        let totalRendimento = 0;

        // Processa todos os investimentos do usuário
        const atualizacoesInvestimentos = usuario.investimentos.map(async (inv) => {
          if (!inv.ativo) return 0;

          // Percentual diário variável por faixa
          let percentualDiario: number;
          if (inv.valor <= 5000) {
            percentualDiario = 1.5;
          } else if (inv.valor <= 10000) {
            percentualDiario = parseFloat((Math.random() * (1.8 - 1.6) + 1.6).toFixed(2));
          } else {
            percentualDiario = parseFloat((Math.random() * (2.5 - 2.0) + 2.0).toFixed(2));
          }

          const rendimento = inv.valor * (percentualDiario / 100);
          let novoAcumulado = inv.rendimentoAcumulado + rendimento;

          // Desativa investimento se atingir limite
          let ativo = true;
          if (novoAcumulado >= inv.limite) {
            novoAcumulado = inv.limite;
            ativo = false;
          }

          await prisma.investimento.update({
            where: { id: inv.id },
            data: {
              rendimentoAcumulado: novoAcumulado,
              ativo,
            },
          });

          return rendimento;
        });

        const rendimentos = await Promise.all(atualizacoesInvestimentos);
        totalRendimento = rendimentos.reduce((acc, val) => acc + val, 0);

        if (totalRendimento > 0) {
          await prisma.user.update({
            where: { id: usuario.id },
            data: {
              saldo: usuario.saldo + totalRendimento,
            },
          });

          console.log(
            `Rendimento total de R$ ${totalRendimento.toFixed(2)} aplicado para o usuário ${usuario.id}`
          );
        }
      })
    );

    console.log('✅ Rendimentos aplicados com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao aplicar rendimentos:', err);
  } finally {
    await prisma.$disconnect();
  }
}

// Executa a função
aplicarRendimentos();
