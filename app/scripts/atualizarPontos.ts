import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function atualizarPontos() {
  try {
    const usuarios = await prisma.user.findMany();

    for (const usuario of usuarios) {
      // 1️⃣ Buscar investimentos próprios
      const investimentosProprios = await prisma.investimento.findMany({
        where: { userId: usuario.id },
      });

      // 2️⃣ Buscar investimentos dos indicados diretos
      const indicadosDiretos = await prisma.user.findMany({
        where: { indicadoPorId: usuario.id },
      });

      let totalInvestidoIndicados = 0;
      for (const indicado of indicadosDiretos) {
        const inv = await prisma.investimento.findMany({
          where: { userId: indicado.id },
        });
        totalInvestidoIndicados += inv.reduce((acc, i) => acc + i.valor, 0);
      }

      // 3️⃣ Somar total de investimentos próprios + indicados
      const totalInvestido =
        investimentosProprios.reduce((acc, i) => acc + i.valor, 0) +
        totalInvestidoIndicados;

      // 4️⃣ Calcular pontos (1 ponto a cada R$2)
      const pontos = Math.floor(totalInvestido / 2);

      // 5️⃣ Atualizar pontos do usuário
      await prisma.user.update({
        where: { id: usuario.id },
        data: { pontos },
      });

      console.log(`Usuário ID ${usuario.id} atualizado com ${pontos} pontos.`);
    }

    console.log("✅ Atualização de pontos concluída!");
  } catch (error) {
    console.error("❌ Erro ao atualizar pontos:", error);
  } finally {
    await prisma.$disconnect();
  }
}

atualizarPontos();
