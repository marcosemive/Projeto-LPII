import { prisma } from '@/database/prisma.js';
import Receita from '@/models/receita.js';
import type { Receita as ReceitaType } from '@/types/Receita.d.ts';
import type { Favorito } from '@/types/Favorito.d.ts';

async function add(usuario_id: number, receita_id: number): Promise<Favorito> {
  const jaExiste = await prisma.favorito.findUnique({
    where: { usuario_id_receita_id: { usuario_id, receita_id } },
  });

  if (jaExiste) throw new Error('Receita já está nos favoritos');

  await prisma.favorito.create({
    data: { usuario_id, receita_id },
  });

  return { usuario_id, receita_id };
}

async function remove(usuario_id: number, receita_id: number): Promise<boolean> {
  try {
    await prisma.favorito.delete({
      where: { usuario_id_receita_id: { usuario_id, receita_id } },
    });
    return true;
  } catch {
    throw new Error('Favorito não encontrado');
  }
}

async function readByUsuario(usuario_id: number): Promise<ReceitaType[]> {
  const favoritos = await prisma.favorito.findMany({
    where: { usuario_id },
  });

  const receitas: ReceitaType[] = [];
  for (const fav of favoritos) {
    receitas.push(await Receita.readById(fav.receita_id));
  }

  return receitas;
}

export default { add, remove, readByUsuario };