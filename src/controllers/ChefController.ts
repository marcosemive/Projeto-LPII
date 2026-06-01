import bcrypt from 'bcrypt';
import Chef from '@/models/chef.js';
import { gerarToken } from '@/middlewares/auth.js';
import type { ChefCreateInput } from '@/types/Chef.d.ts';

export async function cadastroChef(data: ChefCreateInput) {
  const chef = await Chef.create(data);
  const token = gerarToken({ id: chef.id, nome: chef.nome, tipo: 'chef' });
  return { chef, token };
}

export async function loginChef(email: string, senha: string) {
  const chef = await Chef.readByEmail(email);
  if (!chef) throw new Error('E-mail ou senha inválidos');

  const senhaCorreta = await bcrypt.compare(senha, chef.senha!);
  if (!senhaCorreta) throw new Error('E-mail ou senha inválidos');

  const token = gerarToken({ id: chef.id, nome: chef.nome, tipo: 'chef' });
  return { chef: { id: chef.id, nome: chef.nome, email: chef.email }, token };
}
