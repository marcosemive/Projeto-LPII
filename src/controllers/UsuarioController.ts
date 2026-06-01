import bcrypt from 'bcrypt';
import Usuario from '@/models/usuario.js';
import { gerarToken } from '@/middlewares/auth.js';
import type { UsuarioCreateInput } from '@/types/Usuario.d.ts';

export async function cadastroUsuario(data: UsuarioCreateInput) {
  const usuario = await Usuario.create(data);
  const token = gerarToken({ id: usuario.id, nome: usuario.nome, tipo: 'usuario' });
  return { usuario, token };
}

export async function loginUsuario(email: string, senha: string) {
  const usuario = await Usuario.readByEmail(email);
  if (!usuario) throw new Error('E-mail ou senha inválidos');

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha!);
  if (!senhaCorreta) throw new Error('E-mail ou senha inválidos');

  const token = gerarToken({ id: usuario.id, nome: usuario.nome, tipo: 'usuario' });
  return { usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }, token };
}
