import bcrypt from 'bcrypt';
import { prisma } from '@/database/prisma.js';
import type { Chef, ChefCreateInput, ChefUpdateInput } from '@/types/Chef.d.ts';

async function create(data: ChefCreateInput): Promise<Chef> {
  const { nome, email, senha } = data;

  if (nome && email && senha) {
    const jaExiste = await prisma.chef.findUnique({ where: { email } });
    if (jaExiste) throw new Error('E-mail já cadastrado');

    const hash = await bcrypt.hash(senha, 10);

    const chef = await prisma.chef.create({
      data: { nome, email, senha: hash },
    });

    return { id: chef.id, nome: chef.nome, email: chef.email };
  } else {
    throw new Error('Todos os campos são obrigatórios');
  }
}

async function read(): Promise<Chef[]> {
  return await prisma.chef.findMany({
    select: { id: true, nome: true, email: true },
  });
}

async function readById(id: number): Promise<Chef> {
  const chef = await prisma.chef.findUnique({
    where: { id },
    select: { id: true, nome: true, email: true },
  });

  if (chef) {
    return chef;
  } else {
    throw new Error('Chef não encontrado');
  }
}

async function readByEmail(email: string): Promise<(Chef & { senha: string }) | undefined> {
  const chef = await prisma.chef.findUnique({ where: { email } });
  return chef ?? undefined;
}

async function update(data: ChefUpdateInput): Promise<Chef> {
  const { id, nome, email } = data;

  if (id && nome && email) {
    try {
      const chef = await prisma.chef.update({
        where: { id },
        data: { nome, email },
      });
      return { id: chef.id, nome: chef.nome, email: chef.email };
    } catch {
      throw new Error('Chef não encontrado');
    }
  } else {
    throw new Error('Todos os campos são obrigatórios');
  }
}

async function remove(id: number): Promise<boolean> {
  try {
    await prisma.chef.delete({ where: { id } });
    return true;
  } catch {
    throw new Error('Chef não encontrado');
  }
}

export default { create, read, readById, readByEmail, update, remove };