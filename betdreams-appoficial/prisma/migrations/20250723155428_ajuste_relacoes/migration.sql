/*
  Warnings:

  - A unique constraint covering the columns `[vencedoraId]` on the table `Partida` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Partida_vencedoraId_key" ON "Partida"("vencedoraId");
