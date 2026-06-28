import bcrypt from 'bcrypt';
import { prisma } from '@/database/prisma.js';
import type { Usuario, UsuarioCreateInput, UsuarioUpdateInput } from '@/types/Usuario.d.ts';

async function create(data: UsuarioCreateInput): Promise<Usuario> {
  const { nome, email, senha, role } = data;

  if (nome && email && senha) {
    const jaExiste = await prisma.usuario.findUnique({ where: { email } });
    if (jaExiste) throw new Error('E-mail já cadastrado');

    const hash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: { nome, email, senha: hash, role: role ?? 'ENTUSIASTA' },
    });

    return { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role as Usuario['role'] };
  } else {
    throw new Error('Todos os campos são obrigatórios');
  }
}

async function read(): Promise<Usuario[]> {
  return await prisma.usuario.findMany({
    select: { id: true, nome: true, email: true, role: true },
  }) as Usuario[]; 
}

async function readById(id: number): Promise<Usuario> {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
    select: { id: true, nome: true, email: true, role: true },
  });

  if (usuario) {
    return usuario as Usuario;
  } else {
    throw new Error('Usuário não encontrado');
  }
}

async function readByEmail(email: string): Promise<(Usuario & { senha: string }) | undefined> {
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  return usuario as (Usuario & { senha: string }) ?? undefined;
}

async function update(data: UsuarioUpdateInput): Promise<Usuario> {
  const { id, nome, email, role } = data;

  if (id && nome && email) {
    try {
      const usuario = await prisma.usuario.update({
        where: { id },
        data: { nome, email, role: role ?? 'ENTUSIASTA' },
      });
      return { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role as Usuario['role'] };
    } catch {
      throw new Error('Usuário não encontrado');
    }
  } else {
    throw new Error('Todos os campos são obrigatórios');
  }
}

async function remove(id: number): Promise<boolean> {
  try {
    await prisma.usuario.delete({ where: { id } });
    return true;
  } catch {
    throw new Error('Usuário não encontrado');
  }
}

export default { create, read, readById, readByEmail, update, remove };