import bcrypt from 'bcrypt';
import prisma from '@/database/prisma.js';
import type { Usuario, UsuarioCreateInput, UsuarioUpdateInput } from '@/types/Usuario.d.ts';

async function create(data: UsuarioCreateInput): Promise<Usuario> {
  const { nome, email, senha } = data;

  if (nome && email && senha) {
    const hash = await bcrypt.hash(senha, 10);
    const usuario = await prisma.usuario.create({
      data: { nome, email, senha: hash }
    });
    return { id: usuario.id, nome: usuario.nome, email: usuario.email };
  } else {
    throw new Error('Todos os campos são obrigatórios');
  }
}

async function read(): Promise<Usuario[]> {
  const usuarios = await prisma.usuario.findMany({
    select: { id: true, nome: true, email: true }
  });
  return usuarios;
}

async function readById(id: number): Promise<Usuario> {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
    select: { id: true, nome: true, email: true }
  });
  if (usuario) {
    return usuario;
  } else {
    throw new Error('Usuário não encontrado');
  }
}

async function readByEmail(email: string): Promise<(Usuario & { senha: string }) | undefined> {
  const usuario = await prisma.usuario.findUnique({
    where: { email }
  });
  if (usuario) {
    return { id: usuario.id, nome: usuario.nome, email: usuario.email, senha: usuario.senha };
  }
  return undefined;
}

async function update(data: UsuarioUpdateInput): Promise<Usuario> {
  const { id, nome, email } = data;

  if (id && nome && email) {
    const usuario = await prisma.usuario.update({
      where: { id },
      data: { nome, email }
    });
    return { id: usuario.id, nome: usuario.nome, email: usuario.email };
  } else {
    throw new Error('Todos os campos são obrigatórios');
  }
}

async function remove(id: number): Promise<boolean> {
  await prisma.usuario.delete({
    where: { id }
  });
  return true;
}

export default { create, read, readById, readByEmail, update, remove };
