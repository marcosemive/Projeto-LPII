-- CreateTable
CREATE TABLE "Chef" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Receita" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "img" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "servings" INTEGER NOT NULL,
    "ingredients" TEXT NOT NULL,
    "steps" TEXT NOT NULL,
    "chef_id" INTEGER NOT NULL,
    CONSTRAINT "Receita_chef_id_fkey" FOREIGN KEY ("chef_id") REFERENCES "Chef" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Etiqueta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ReceitaEtiqueta" (
    "receita_id" INTEGER NOT NULL,
    "etiqueta_id" INTEGER NOT NULL,

    PRIMARY KEY ("receita_id", "etiqueta_id"),
    CONSTRAINT "ReceitaEtiqueta_receita_id_fkey" FOREIGN KEY ("receita_id") REFERENCES "Receita" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReceitaEtiqueta_etiqueta_id_fkey" FOREIGN KEY ("etiqueta_id") REFERENCES "Etiqueta" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Favorito" (
    "usuario_id" INTEGER NOT NULL,
    "receita_id" INTEGER NOT NULL,

    PRIMARY KEY ("usuario_id", "receita_id"),
    CONSTRAINT "Favorito_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Favorito_receita_id_fkey" FOREIGN KEY ("receita_id") REFERENCES "Receita" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Chef_email_key" ON "Chef"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Etiqueta_nome_key" ON "Etiqueta"("nome");
