-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Partida" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "inicio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fim" DATETIME,
    "finalizada" BOOLEAN NOT NULL DEFAULT false,
    "vencedoraId" INTEGER,
    CONSTRAINT "Partida_vencedoraId_fkey" FOREIGN KEY ("vencedoraId") REFERENCES "Cartela" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cartela" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "criadaEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "venceu" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "partidaId" INTEGER NOT NULL,
    CONSTRAINT "Cartela_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Cartela_partidaId_fkey" FOREIGN KEY ("partidaId") REFERENCES "Partida" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NumeroCartela" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" INTEGER NOT NULL,
    "cartelaId" INTEGER NOT NULL,
    CONSTRAINT "NumeroCartela_cartelaId_fkey" FOREIGN KEY ("cartelaId") REFERENCES "Cartela" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Bola" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" INTEGER NOT NULL,
    "partidaId" INTEGER NOT NULL,
    CONSTRAINT "Bola_partidaId_fkey" FOREIGN KEY ("partidaId") REFERENCES "Partida" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Partida_vencedoraId_key" ON "Partida"("vencedoraId");
