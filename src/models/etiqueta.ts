import Database from '@/database/database.js';
import type { Etiqueta, EtiquetaCreateInput } from '@/types/Etiqueta.d.ts';

async function create(data: EtiquetaCreateInput): Promise<Etiqueta> {
  const db = await Database.connect();

  const { nome } = data;

  if (nome) {
    const sql = `INSERT INTO etiqueta (nome) VALUES (?)`;
    const { lastID } = await db.run(sql, [nome]);
    return await readById(lastID);
  } else {
    throw new Error('Nome da etiqueta é obrigatório');
  }
}

async function read(): Promise<Etiqueta[]> {
  const db = await Database.connect();
  const sql = `SELECT id, nome FROM etiqueta`;
  return await db.all(sql) as Etiqueta[];
}

async function readById(id: number): Promise<Etiqueta> {
  const db = await Database.connect();
  const sql = `SELECT id, nome FROM etiqueta WHERE id = ?`;
  const etiqueta = await db.get(sql, [id]) as Etiqueta | undefined;
  if (etiqueta) {
    return etiqueta;
  } else {
    throw new Error('Etiqueta não encontrada');
  }
}

async function readByNome(nome: string): Promise<Etiqueta | undefined> {
  const db = await Database.connect();
  const sql = `SELECT id, nome FROM etiqueta WHERE nome = ?`;
  return await db.get(sql, [nome]) as Etiqueta | undefined;
}

export default { create, read, readById, readByNome };
