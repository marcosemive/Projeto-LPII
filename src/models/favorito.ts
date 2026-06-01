import Database from '@/database/database.js';
import Receita from '@/models/receita.js';
import type { Receita as ReceitaType } from '@/types/Receita.d.ts';
import type { Favorito } from '@/types/Favorito.d.ts';

async function add(usuario_id: number, receita_id: number): Promise<Favorito> {
  const db = await Database.connect();

  const jaExiste = await db.get(
    `SELECT 1 FROM favorito WHERE usuario_id = ? AND receita_id = ?`,
    [usuario_id, receita_id]
  );

  if (jaExiste) throw new Error('Receita já está nos favoritos');

  await db.run(
    `INSERT INTO favorito (usuario_id, receita_id) VALUES (?, ?)`,
    [usuario_id, receita_id]
  );

  return { usuario_id, receita_id };
}

async function remove(usuario_id: number, receita_id: number): Promise<boolean> {
  const db = await Database.connect();

  const { changes } = await db.run(
    `DELETE FROM favorito WHERE usuario_id = ? AND receita_id = ?`,
    [usuario_id, receita_id]
  );

  if (changes === 1) {
    return true;
  } else {
    throw new Error('Favorito não encontrado');
  }
}

async function readByUsuario(usuario_id: number): Promise<ReceitaType[]> {
  const db = await Database.connect();

  const rows = await db.all(
    `SELECT receita_id FROM favorito WHERE usuario_id = ?`,
    [usuario_id]
  );

  const receitas: ReceitaType[] = [];
  for (const row of rows) {
    receitas.push(await Receita.readById(row.receita_id));
  }

  return receitas;
}

export default { add, remove, readByUsuario };
