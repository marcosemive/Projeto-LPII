import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import Receita from '@/models/receita.js';
import Usuario from '@/models/usuario.js';
import Etiqueta from '@/models/etiqueta.js';

async function up(): Promise<void> {
  const file = resolve('src', 'database', 'seeders.json');
  const seed = JSON.parse(readFileSync(file, 'utf-8'));

  for (const etiqueta of seed.etiquetas) {
    await Etiqueta.create(etiqueta);
  }

  for (const chef of seed.chefs) {
    await Usuario.create({ ...chef, role: 'CHEF' });
  }
for (const usuario of seed.usuarios) {
  await Usuario.create({ ...usuario, role: 'ENTUSIASTA' });
}
  for (const receita of seed.receitas) {
    await Receita.create(receita);
  }
}

export default { up };
