import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function calcularRendimentosDiarios() {
  const hoje = new Date();
  const dateKey = hoje.toISOString().split("T")[0]; // YYYY-MM-DD

  // Criar pasta de logs se não existir
  const logPath = "./logs";
  if (!fs.existsSync(logPath)) fs.mkdirSync(logPath);

  // Registrar início da execução
  fs.appendFileSync(`${logPath}/rendimentos.log`, `\n=== Execução: ${new Date()} ===\n`);

  try {
    // Buscar todos os investimentos
    const investimentos = await prisma.investimento.findMany();
    fs.appendFileSync(`${logPath}/rendimentos.log`, `Encontrados ${investimentos.length} investimentos.\n`);

    for (const investimento of investimentos) {
      const lucro = investimento.valor * investimento.percentualDiario;

      // Verificar se já existe rendimento para este usuário e data
      const existe = await prisma.rendimentoDiario.findFirst({
        where: {
          userId: investimento.userId,
          dateKey: dateKey
        }
      });

      if (!existe) {
        // Criar registro na tabela RendimentoDiario
        await prisma.rendimentoDiario.create({
          data: {
            userId: investimento.userId,
            dateKey: dateKey,
            base: investimento.valor,
            rate: investimento.percentualDiario,
            amount: lucro,
          },
        });

        fs.appendFileSync(`${logPath}/rendimentos.log`, `✅ Rendimento de R$ ${lucro.toFixed(2)} registrado para usuário ID ${investimento.userId}\n`);
      } else {
        fs.appendFileSync(`${logPath}/rendimentos.log`, `⚠️ Rendimento para usuário ID ${investimento.userId} e data ${dateKey} já existe. Pulando...\n`);
      }
    }

    fs.appendFileSync(`${logPath}/rendimentos.log`, "✅ Cálculo e registro de rendimentos concluído!\n");
  } catch (error) {
    fs.appendFileSync(`${logPath}/rendimentos.log`, `❌ Erro ao calcular rendimentos: ${error}\n`);
  } finally {
    await prisma.$disconnect();
  }
}

calcularRendimentosDiarios();
