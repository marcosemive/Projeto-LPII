import { verifyPassword } from '@/utils/password';
import UsuarioModel from '@/models/usuario.js';
import { gerarToken } from '@/middlewares/auth.js';
import type { UsuarioCreateInput } from '@/types/Usuario.d.ts';

type UsuarioRole = 'CHEF' | 'ENTUSIASTA';

async function cadastrarUsuario(data: UsuarioCreateInput, role: UsuarioRole, responseKey: 'chef' | 'usuario') {
  const usuario = await UsuarioModel.create({ ...data, role });
  const token = gerarToken({ id: usuario.id, nome: usuario.nome, role });

  return {
    [responseKey]: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    token,
  };
}

export async function cadastroUsuario(data: UsuarioCreateInput) {
  return cadastrarUsuario(data, 'ENTUSIASTA', 'usuario');
}

export async function cadastroChef(data: UsuarioCreateInput) {
  return cadastrarUsuario(data, 'CHEF', 'chef');
}

export async function loginUsuario(email: string, senha: string) {
  const usuario = await UsuarioModel.readByEmail(email);
  if (!usuario || usuario.role !== 'ENTUSIASTA') throw new Error('E-mail ou senha inválidos');

  const senhaCorreta = await verifyPassword(senha, usuario.senha);
  if (!senhaCorreta) throw new Error('E-mail ou senha inválidos');

  const token = gerarToken({ id: usuario.id, nome: usuario.nome, role: usuario.role });
  return { usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }, token };
}

export async function loginChef(email: string, senha: string) {
  const usuario = await UsuarioModel.readByEmail(email);
  if (!usuario || usuario.role !== 'CHEF') throw new Error('E-mail ou senha inválidos');

  const senhaCorreta = await verifyPassword(senha, usuario.senha);
  if (!senhaCorreta) throw new Error('E-mail ou senha inválidos');

  const token = gerarToken({ id: usuario.id, nome: usuario.nome, role: usuario.role });
  return { chef: { id: usuario.id, nome: usuario.nome, email: usuario.email }, token };
}
