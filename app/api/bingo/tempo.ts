// pages/api/bingo/tempo.ts
import { NextApiRequest, NextApiResponse } from "next";

let rodadaInicio: Date | null = null;
const duracaoEmSegundos = 150; // 2 minutos e 30 segundos

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!rodadaInicio) {
    rodadaInicio = new Date();
  }

  const agora = new Date();
  const segundosPassados = Math.floor((agora.getTime() - rodadaInicio.getTime()) / 1000);
  const segundosRestantes = Math.max(0, duracaoEmSegundos - segundosPassados);

  res.status(200).json({ segundosRestantes });
}
