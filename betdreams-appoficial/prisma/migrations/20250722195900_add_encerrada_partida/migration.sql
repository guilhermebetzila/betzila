-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Partida" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "inicio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fim" DATETIME,
    "finalizada" BOOLEAN NOT NULL DEFAULT false,
    "aberta" BOOLEAN NOT NULL DEFAULT true,
    "encerrada" BOOLEAN NOT NULL DEFAULT false,
    "vencedoraId" INTEGER,
    CONSTRAINT "Partida_vencedoraId_fkey" FOREIGN KEY ("vencedoraId") REFERENCES "Cartela" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Partida" ("aberta", "fim", "finalizada", "id", "inicio", "vencedoraId") SELECT "aberta", "fim", "finalizada", "id", "inicio", "vencedoraId" FROM "Partida";
DROP TABLE "Partida";
ALTER TABLE "new_Partida" RENAME TO "Partida";
CREATE UNIQUE INDEX "Partida_vencedoraId_key" ON "Partida"("vencedoraId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
