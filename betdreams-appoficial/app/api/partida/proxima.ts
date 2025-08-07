// /pages/api/partida/proxima.ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // ajuste se seu caminho for diferente

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const agora = new Date();
  
  // Arredonda para o próximo múltiplo de 2 minutos e meio (150 segundos)
  const intervalo = 150 * 1000; // 2m30s em milissegundos
  const proximaRodada = new Date(Math.ceil(agora.getTime() / intervalo) * intervalo);

  return res.status(200).json({ proximaRodada });
}
