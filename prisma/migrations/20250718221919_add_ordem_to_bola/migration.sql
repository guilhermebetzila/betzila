/*
  Warnings:

  - Added the required column `ordem` to the `Bola` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bola" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" INTEGER NOT NULL,
    "ordem" INTEGER NOT NULL,
    "partidaId" INTEGER NOT NULL,
    CONSTRAINT "Bola_partidaId_fkey" FOREIGN KEY ("partidaId") REFERENCES "Partida" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Bola" ("id", "numero", "partidaId") SELECT "id", "numero", "partidaId" FROM "Bola";
DROP TABLE "Bola";
ALTER TABLE "new_Bola" RENAME TO "Bola";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
