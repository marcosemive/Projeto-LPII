import bcrypt from 'bcrypt';
import Database from '@/database/database.js';
import type { Chef, ChefCreateInput, ChefUpdateInput } from '@/types/Chef.d.ts';

async function create(data: ChefCreateInput): Promise<Chef> {
  const db = await Database.connect();

  const { nome, email, senha } = data;

  if (nome && email && senha) {
    const jaExiste = await db.get(
      `SELECT id FROM chef WHERE email = ?`, [email]
    );
    if (jaExiste) throw new Error('E-mail já cadastrado');

    const hash = await bcrypt.hash(senha, 10);
    const sql = `INSERT INTO chef (nome, email, senha) VALUES (?, ?, ?)`;
    const { lastID } = await db.run(sql, [nome, email, hash]);
    return await readById(lastID);
  } else {
    throw new Error('Todos os campos são obrigatórios');
  }
}

async function read(): Promise<Chef[]> {
  const db = await Database.connect();
  const sql = `SELECT id, nome, email FROM chef`;
  return await db.all(sql) as Chef[];
}

async function readById(id: number): Promise<Chef> {
  const db = await Database.connect();
  const sql = `SELECT id, nome, email FROM chef WHERE id = ?`;
  const chef = await db.get(sql, [id]) as Chef | undefined;
  if (chef) {
    return chef;
  } else {
    throw new Error('Chef não encontrado');
  }
}

async function readByEmail(email: string): Promise<(Chef & { senha: string }) | undefined> {
  const db = await Database.connect();
  const sql = `SELECT id, nome, email, senha FROM chef WHERE email = ?`;
  return await db.get(sql, [email]) as (Chef & { senha: string }) | undefined;
}

async function update(data: ChefUpdateInput): Promise<Chef> {
  const db = await Database.connect();

  const { id, nome, email } = data;

  if (id && nome && email) {
    const sql = `UPDATE chef SET nome = ?, email = ? WHERE id = ?`;
    const { changes } = await db.run(sql, [nome, email, id]);
    if (changes === 1) {
      return await readById(id);
    } else {
      throw new Error('Chef não encontrado');
    }
  } else {
    throw new Error('Todos os campos são obrigatórios');
  }
}

async function remove(id: number): Promise<boolean> {
  const db = await Database.connect();
  const sql = `DELETE FROM chef WHERE id = ?`;
  const { changes } = await db.run(sql, [id]);
  if (changes === 1) {
    return true;
  } else {
    throw new Error('Chef não encontrado');
  }
}

export default { create, read, readById, readByEmail, update, remove };