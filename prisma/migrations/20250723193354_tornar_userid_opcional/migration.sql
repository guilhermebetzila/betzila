-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cartela" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "criadaEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "venceu" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER,
    "partidaId" INTEGER NOT NULL,
    CONSTRAINT "Cartela_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Cartela_partidaId_fkey" FOREIGN KEY ("partidaId") REFERENCES "Partida" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Cartela" ("criadaEm", "id", "partidaId", "userId", "venceu") SELECT "criadaEm", "id", "partidaId", "userId", "venceu" FROM "Cartela";
DROP TABLE "Cartela";
ALTER TABLE "new_Cartela" RENAME TO "Cartela";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
