import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import Receita from '@/models/receita.js';
import Etiqueta from '@/models/etiqueta.js';
import { prisma } from '@/database/prisma.js';

async function up(): Promise<void> {
  const file = resolve('src', 'database', 'seeders.json');
  const seed = JSON.parse(readFileSync(file, 'utf-8'));

  for (const etiqueta of seed.etiquetas) {
    await Etiqueta.create(etiqueta);
  }

  for (const chef of seed.chefs) {
    await prisma.usuario.create({
      data: { nome: chef.nome, email: chef.email, senha: chef.senha, role: 'CHEF' }
    });
  }

  for (const usuario of seed.usuarios) {
    await prisma.usuario.create({
      data: { nome: usuario.nome, email: usuario.email, senha: usuario.senha, role: 'ENTUSIASTA' }
    });
  }

  for (const receita of seed.receitas) {
    await Receita.create(receita);
  }
}

export default { up };
